function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    env.update();
    env.draw();

    mouse.update();
}