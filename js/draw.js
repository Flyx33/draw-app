// Setup Canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    load(JSON.stringify(strokeHistory));
});

// Find Inputs
var brushSlider = document.querySelector("#brushSlider"),
resetButton = document.querySelector("#resetButton"),
colorButton = document.querySelector("#colorButton"),
colorPicker = document.querySelector("#colorPicker");
colorSamples = document.querySelectorAll(".colorSample");
// Declare Variables
var paint = false,
brushColor = "#ffc0cb",
strokeData = "";


// Check If User Is Painting
// -- Mouse Controls --
canvas.addEventListener("mousedown", (e)=> {
    paint = true;
    ctx.beginPath();
    strokeHistory.push({strokeBegin: true});
});

canvas.addEventListener("mouseup", (e)=> {
    paint = false;
    ctx.closePath();
    strokeHistory.push({strokeEnd: true});
});

canvas.addEventListener("mouseout", (e) => {
    paint = false;
    ctx.closePath();
    strokeHistory.push({strokeEnd: true});
});

// -- Touch Controls --
canvas.addEventListener("touchstart", (e)=> {
    paint = true;
    ctx.beginPath();
    strokeHistory.push({strokeBegin: true});
});

canvas.addEventListener("touchend", (e)=> {
    paint = false;
    ctx.closePath();
    strokeHistory.push({strokeEnd: true});
});

canvas.addEventListener("touchcancel", (e) => {
    paint = false;
    ctx.closePath();
    strokeHistory.push({strokeEnd: true});
});

// Draw
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchmove", draw);

function draw(e){
    if(paint){
        // History
        // Line Configuration
        ctx.lineWidth = brushSlider.value;
        ctx.lineCap = "round";
        ctx.strokeStyle = brushColor;
        // Rendering
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);

        strokeHistory.push({x: e.clientX, y: e.clientY, color: brushColor, width: brushSlider.value});
    }
}

function load(data){
    var h = JSON.parse(data);
    h.forEach((e) => {
        if(e.strokeEnd === true){
            ctx.closePath();
        }else if(e.strokeBegin === true){
            ctx.beginPath();
        }else{
            // Line Configuration
            ctx.lineWidth = e.width;
            ctx.lineCap = "round";
            ctx.strokeStyle = e.color;
            // Rendering
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
        }
    });
}

function save(h){
    strokeData = JSON.stringify(h);
    return strokeData;
}

// === Options Functionality ===
// Brush Size
brushSlider.addEventListener("dblclick", (e) => {
    brushSlider.value = 10;
});

// Reset
resetButton.addEventListener("click", (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokeHistory = [];
});

// Color Picker
var v = "hidden";
colorButton.addEventListener("click", (e) => {
    colorPicker.classList.toggle("nonvisible");
});

colorSamples.forEach((e) => {
    e.addEventListener("click", (e) => {
        brushColor = e.target.style.backgroundColor;
        colorButton.style.backgroundColor = e.target.style.backgroundColor;
    });
});

// === History Functionality ===
var strokeHistory = [];

