class Canvas {
    constructor() {
        this.element = document.createElement("canvas");
        this.ctx = this.element.getContext("2d");
        this._width = 1000;
        this._height = 1000;
        this.resize(this.width, this.height);

        document.body.style.backgroundColor = "rgb(50,50,50)";
        document.body.style.margin = 0;
        document.body.style.overflow = "hidden";

        this.element.style.backgroundColor = "white";
        this.element.style.margin = 0;
        this.element.style.position = "absolute";
        this.element.style.top = "50%";
        this.element.style.left = "50%";
        this.element.style["-ms-transform"] = "translate(-50%,-50%)";
        this.element.style.transform = "translate(-50%,-50%)";

        document.body.appendChild(this.element);
    }
    resize(width, height) {
        let ratio = width / height;
        if (ratio > 1) {
            this.element.style.width = `calc(min(${100 / ratio}vw,100vh) * ${ratio})`;
            this.element.style.height = `min(${100 / ratio}vw,100vh)`;
        } else if (ratio < 1) {
            this.element.style.width = `min(100vw,${100 * ratio}vh)`;
            this.element.style.height = `calc(min(100vw,${100 * ratio}vh) * ${1 / ratio})`;
        } else if (ratio === 1) {
            this.element.style.width = "min(100vw,100vh)";
            this.element.style.height = "min(100vw,100vh)";
        }
        this.element.width = width;
        this.element.height = height;
    }
    set width(width) {
        this._width = width;
        this.resize(this._width, this._height);
    }
    set height(height) {
        this._height = height;
        this.resize(this._width, this._height);
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
}

export default Canvas;