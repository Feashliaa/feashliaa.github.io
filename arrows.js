var canvas;
var c;
var width;
var height;
var mouseX = 0;
var mouseY = 0;
var mouseFlag = false;
var pointers = [];
var animationId;
var lastFrame = 0;
var fps = 60;
var frameInterval = 1000 / fps;
var heroSection;

function initializeArrows() {
    canvas = document.getElementById("arrows-canvas");
    heroSection = document.getElementById("home");
    if (!canvas || !canvas.getContext) return;
    
    c = canvas.getContext("2d");
    
    resizeCanvas();
    
    var resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    });
    
    // Listen on the hero section for mouse movement
    heroSection.addEventListener("mousemove", mouseMove, { passive: true });
    
    // Pause when not visible (IntersectionObserver)
    var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            if (!animationId) {
                lastFrame = 0;
                animationId = requestAnimationFrame(drawScreen);
            }
        } else {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
    }, { threshold: 0.1 });
    observer.observe(heroSection);
    
    drawScreen(0);
}

function resizeCanvas() {
    // Size to hero section, not full window
    width = heroSection.offsetWidth;
    height = heroSection.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    pointers = [];
    
    var radius = 14;
    var padding = 5;
    var delta = radius * 2 + padding;
    
    for (var y = radius + padding; y < height; y += delta) {
        for (var x = radius + padding; x < width; x += delta) {
            pointers.push({
                x: x,
                y: y,
                radius: radius,
                angle: 0,
                hue: 0
            });
        }
    }
    
    mouseFlag = false;
}

function drawScreen(timestamp) {
    animationId = requestAnimationFrame(drawScreen);
    
    var delta = timestamp - lastFrame;
    if (delta < frameInterval) return;
    lastFrame = timestamp - (delta % frameInterval);
    
    // Transparent background to show section's original bg color
    c.clearRect(0, 0, width, height);
    
    c.lineWidth = 2;
    c.lineCap = "round";
    c.lineJoin = "round";
    
    for (var i = 0; i < pointers.length; i++) {
        var pt = pointers[i];
        
        if (mouseFlag) {
            var dx = mouseX - pt.x;
            var dy = mouseY - pt.y;
            var radians = Math.atan2(dy, dx);
            pt.angle = radians;
            pt.hue = radians * 57.2958 + 180;
        }
        
        var r = pt.radius;
        var r2 = r * 0.5;
        
        c.save();
        c.beginPath();
        // Subtle, semi-transparent arrows
        c.strokeStyle = "hsla(" + pt.hue + ", 70%, 50%, 0.4)";
        c.translate(pt.x, pt.y);
        c.rotate(pt.angle);
        c.moveTo(-r, 0);
        c.lineTo(r, 0);
        c.moveTo(r - r2, -r2);
        c.lineTo(r, 0);
        c.lineTo(r - r2, r2);
        c.stroke();
        c.restore();
    }
}

function mouseMove(e) {
    var rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    mouseFlag = true;
}

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
        animationId = null;
    } else {
        lastFrame = 0;
        animationId = requestAnimationFrame(drawScreen);
    }
});

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", initializeArrows);
