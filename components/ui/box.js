class OrthagonalValues {
    constructor(element) {
        this.element = element;
        this._top = 0;
        this._right = 0;
        this._bottom = 0;
        this._left = 0;
    }
    get top() {
        return this._top;
    }
    get right() {
        return this._right;
    }
    get bottom() {
        return this._bottom;
    }
    get left() {
        return this._left;
    }
    set top(n) {
        this._top = n;
        this.updatePositioning();
    }
    set right(n) {
        this._right = n;
        this.updatePositioning();
    }
    set bottom(n) {
        this._bottom = n;
        this.updatePositioning();
    }
    set left(n) {
        this._left = n;
        this.updatePositioning();
    }
    set(...arr) {
        if (arr.length == 1) {
            this._top = arr[0];
            this._right = arr[0];
            this._bottom = arr[0];
            this._left = arr[0];
        } else if (arr.length == 2) {
            this._top = arr[0];
            this._right = arr[1];
            this._bottom = arr[0];
            this._left = arr[1];
        } else {
            [this._top, this._right, this._bottom, this._left] = arr;
        }
    }
    updatePositioning() {
        this.element.updatePositioning(this.element.parent);
    }
}

class Box {
    constructor() {
        this.parent = null;
        this._ctx = null;
        this.x = 0;
        this.y = 0;
        this._width = 0;
        this._height = 0;
        this.padding = new OrthagonalValues(this);
        this.margin = new OrthagonalValues(this);
        this.elements = [];
        this._horizontalAlignment = "center";
        this._verticalAlignment = "center";
        this.display = "visible";
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    set width(width) {
        this._width = width;
        this.updatePositioning(this.parent);
    }
    set height(height) {
        this._height = height;
        this.updatePositioning(this.parent);
    }
    get horizontalAlignment() {
        return this._horizontalAlignment;
    }
    get verticalAlignment() {
        return this._verticalAlignment;
    }
    set horizontalAlignment(horizontalAlignment) {
        this._horizontalAlignment = horizontalAlignment;
        this.updatePositioning(this.parent);
    }
    set verticalAlignment(verticalAlignment) {
        this._verticalAlignment = verticalAlignment;
        this.updatePositioning(this.parent);
    }
    get ctx() {
        return this._ctx;
    }
    set ctx(ctx) {
        this._ctx = ctx;
        for (var o of this.elements) {
            o.ctx = this._ctx;
        }
    }
    addElement(o) {
        this.elements.push(o);
        o.ctx = this.ctx;
        o.parent = this;

        o.updatePositioning(this);
    }
    updatePositioning(parent) {
        if (parent) {
            this.updateAxis("horizontal", this._horizontalAlignment, parent);
            this.updateAxis("vertical", this._verticalAlignment, parent);
        }

        for (var o of this.elements) {
            o.updatePositioning(this);
        }
    }
    updateAxis(axis, alignment, parent) {
        let dimension = axis == "horizontal" ? "width" : "height";
        let coordinate = axis == "horizontal" ? "x" : "y";
        let top = axis == "horizontal" ? "left" : "top";
        let bottom = axis == "horizontal" ? "right" : "bottom";
        if (alignment == "center") {
            this[coordinate] = parent[coordinate] + parent[dimension] / 2 - this[dimension] / 2;
            this[coordinate] += this.margin[top];
        }
        if (alignment == top) {
            this[coordinate] = parent[coordinate] + parent.padding[top];
            this[coordinate] += this.margin[top];
        }
        if (alignment == bottom) {
            this[coordinate] = parent[coordinate] + parent[dimension] - parent.padding[bottom];
            this[coordinate] -= this.margin[bottom];
        }
        if (alignment == `outside ${top}`) {
            this[coordinate] = parent[coordinate] - this[dimension];
            this[coordinate] -= this.margin[bottom];
        }
        if (alignment == `outside ${bottom}`) {
            this[coordinate] = parent[coordinate] + parent[dimension];
            this[coordinate] += this.margin[top];
        }
    }
    update() {
        for (var o of this.elements) {
            o.update();
        }
    }
    draw() {
        if (!this.ctx) return;
        if (this.display == "hidden") return;

        this.drawSelf();

        for (var o of this.elements) {
            o.draw();
        }
    }
    drawSelf() {
        this.ctx.fillStyle = "black";
        if(this.color) this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class WindowBox extends Box {
    constructor() {
        super();
        this.resizeToFitWindow();
    }
    update() {
        this.resizeToFitWindow();
        super.update();
    }
    drawSelf() {
    }
    resizeToFitWindow() {
        if (this._width == window.innerWidth && this._height == window.innerHeight) return;
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this.updatePositioning();
    }
    updatePositioning(parent) {
        for (var o of this.elements) {
            o.updatePositioning(this);
        }
    }
}

export default { Box, WindowBox }