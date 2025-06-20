import UI from "./ui/everything.js";

class BuildEnvironment {
    cam = {
        x: 0,
        y: 0,
        zoom: 1.0000000000001,
        movingOrigin: null,
        alignViewport: () => {
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.scale(this.cam.zoom, this.cam.zoom);
            this.ctx.translate(this.cam.x, this.cam.y);
        },
        screenToGlobal: (x, y) => {
            return {
                x: (x - this.canvas.width / 2) / this.cam.zoom - this.cam.x,
                y: (y - this.canvas.height / 2) / this.cam.zoom - this.cam.y
            };
        },
        globalToScreen: (x, y) => {
            return {
                x: (x + this.cam.x) * this.cam.zoom + this.canvas.width / 2,
                y: (y + this.cam.y) * this.cam.zoom + this.canvas.height / 2
            };
        },
        update: () => {
            this.cam.updateScroll();
            this.cam.updateMove();
        },
        updateScroll: () => {
            if (!this.mouse.scrollY) return;
            let scaleFactor = Math.max(Math.min(1 - this.mouse.scrollY * 0.002, 2), 0.5);
            let oldZoom = this.cam.zoom;
            let newZoom = this.cam.zoom * scaleFactor;
            newZoom = Math.min(Math.max(newZoom, 0.01), 50);
            let deltaX = (this.mouse.x - this.canvas.width / 2) / newZoom - (this.mouse.x - this.canvas.width / 2) / oldZoom;
            let deltaY = (this.mouse.y - this.canvas.height / 2) / newZoom - (this.mouse.y - this.canvas.height / 2) / oldZoom;
            this.cam.x += deltaX;
            this.cam.y += deltaY;
            this.cam.zoom = newZoom;
        },
        updateMove: () => {
            if (this.mouse.startButtons[1]) {
                this.cam.movingOrigin = { x: this.cam.x, y: this.cam.y, mouseX: this.mouse.x, mouseY: this.mouse.y };
            }
            if (this.mouse.buttons[1]) {
                let deltaX = this.mouse.x - this.cam.movingOrigin.mouseX;
                let deltaY = this.mouse.y - this.cam.movingOrigin.mouseY;
                this.cam.x = this.cam.movingOrigin.x + deltaX / this.cam.zoom;
                this.cam.y = this.cam.movingOrigin.y + deltaY / this.cam.zoom;
            } else {
                this.cam.movingOrigin = null;
            }
        },
        getViewport: () => {
            let x1 = (-this.canvas.width / 2) / this.cam.zoom - this.cam.x;
            let y1 = (-this.canvas.height / 2) / this.cam.zoom - this.cam.y;
            let x2 = (this.canvas.width / 2) / this.cam.zoom - this.cam.x;
            let y2 = (this.canvas.height / 2) / this.cam.zoom - this.cam.y;
            return { x: x1, y: y1, w: x2 - x1, h: y2 - y1, x1: x1, y1: y1, x2: x2, y2: y2 };
        }
    }
    adaptiveGrid = {
        draw: () => {
            let viewport = this.cam.getViewport();
            let step = 50 * 0.5 ** Math.ceil(Math.log(this.cam.zoom) / Math.log(2));
            let percent = ((Math.log(this.cam.zoom) / Math.log(2)) % 1 + 1) % 1;
            let lineWidth = 0.5;
            this.ctx.strokeStyle = "black";

            for (var x = Math.floor(viewport.x1 / step) * step; x <= viewport.x2; x += step) {
                this.ctx.save();
                let currentVisibility = 0;
                let nextVisibility = 0.25;
                if ((x / step) % 2 === 0) {
                    currentVisibility = 0.25;
                    nextVisibility = 0.5;
                }
                if ((x / step) % 4 === 0) {
                    currentVisibility = 0.5;
                    nextVisibility = 0.75;
                }
                if ((x / step) % 8 === 0) {
                    currentVisibility = 0.75;
                    nextVisibility = 1;
                }
                if ((x / step) % 16 === 0) {
                    currentVisibility = 1;
                    nextVisibility = 1;
                }
                let visibility = currentVisibility * (1 - percent) + nextVisibility * percent;
                this.ctx.globalAlpha = visibility ** 2 * 0.6 + visibility * 0.4;
                this.ctx.lineWidth = (visibility * 0.5 + 0.5) * lineWidth / this.cam.zoom;
                this.ctx.beginPath();
                this.ctx.moveTo(x, viewport.y1);
                this.ctx.lineTo(x, viewport.y2);
                this.ctx.stroke();
                this.ctx.restore();
            }
            for (var y = Math.floor(viewport.y1 / step) * step; y <= viewport.y2; y += step) {
                this.ctx.save();
                let currentVisibility = 0;
                let nextVisibility = 0.25;
                if ((y / step) % 2 === 0) {
                    currentVisibility = 0.25;
                    nextVisibility = 0.5;
                }
                if ((y / step) % 4 === 0) {
                    currentVisibility = 0.5;
                    nextVisibility = 0.75;
                }
                if ((y / step) % 8 === 0) {
                    currentVisibility = 0.75;
                    nextVisibility = 1;
                }
                if ((y / step) % 16 === 0) {
                    currentVisibility = 1;
                    nextVisibility = 1;
                }
                let visibility = currentVisibility * (1 - percent) + nextVisibility * percent;
                this.ctx.globalAlpha = visibility ** 2 * 0.6 + visibility * 0.4;
                this.ctx.lineWidth = (visibility * 0.5 + 0.5) * lineWidth / this.cam.zoom;
                this.ctx.beginPath();
                this.ctx.moveTo(viewport.x1, y);
                this.ctx.lineTo(viewport.x2, y);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
    }
    selection = {
        selectedObject: null,
        update: function() {

        },
        draw: function() {

        }
    }
    constructor() {
        this.ctx = null;
        this.canvas = null;
        this.mouse = null;
        this.objects = [];
    }
    linkCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.ctx;
    }
    linkMouse(mouse) {
        this.mouse = mouse;
    }
    get globalMouse() {
        if (!this.mouse) return null;
        return this.cam.screenToGlobal(this.mouse.x, this.mouse.y);
    }
    update() {
        this.cam.update();
    }
    draw() {
        this.ctx.save();
        this.cam.alignViewport();

        this.adaptiveGrid.draw();

        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.globalMouse.x, this.globalMouse.y, 10, 10);
        for (var o of this.objects) {

        }

        this.ctx.restore();
    }

}

export default BuildEnvironment;