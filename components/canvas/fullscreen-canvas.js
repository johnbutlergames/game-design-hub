class FullscreenCanvas {
    constructor() {
        this.element = document.createElement("canvas");
        this.ctx = this.element.getContext("2d");
        this.resize();

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

        window.addEventListener("resize", event => {
            this.resize();
        })
    }
    resize() {
        this.element.width = window.innerWidth;
        this.element.height = window.innerHeight;
    }
    get width() {
        return this.element.width;
    }
    get height() {
        return this.element.height;
    }
}

export default FullscreenCanvas;