function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    env.update();
    env.draw();
    ui.draw();

    mouse.update();

    ui.update();
}

let ui, box, box2, box3;

function loadUI() {
    ui = new GameDesign.UI.WindowBox();
    ui.ctx = ctx;
    box = new GameDesign.UI.Box();
    box.width = 100;
    box.height = 100;
    box.color = "blue";
    ui.addElement(box);

    box2 = new GameDesign.UI.Box();
    box.addElement(box2);
    box2.width = 50;
    box2.height = 50;
    box2.color = "red";
    box2.horizontalAlignment = "outside left";
    box2.verticalAlignment = "top";
    box2.margin.right = 20;

    box3 = new GameDesign.UI.Box();
    box2.addElement(box3);
    box3.width = 25;
    box3.height = 25;
    box3.color = "green";
    box3.horizontalAlignment = "outside right";
}