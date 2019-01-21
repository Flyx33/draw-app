// Setup Canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Declare Variables
var paint = false;

// Check If User Is Painting
canvas.addEventListener("mousedown", (e)=> {
    paint = true;
    ctx.beginPath();
});

canvas.addEventListener("mouseup", (e)=> {
    paint = false;
    ctx.closePath();
});

canvas.addEventListener("mousemove", draw);

function draw(e){
    if(paint){
        // Line Configuration
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.strokeStyle = "pink";
        // Rendering
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }
}

// ctx.arc(100, 100, 10, 0, Math.PI * 2, false);
// ctx.stroke();