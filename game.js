// Rocket simulator game

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var rocket = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    acceleration: 0,
    direction: 45,
    mass: 1
};
var planets = [
    {
        x: 770,
        y: 999,
        mass: 11000,
        color: "blue",
        radius: 100
    },
    {
        x: -400,
        y: 220,
        mass: 12000,
        color: "red",
        radius: 120
    }
];

// Camera properties
var camera = {
    x: 0,
    y: 0
};

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Translate the canvas based on camera position
    ctx.save();
    ctx.translate(-camera.x + canvas.width / 2, -camera.y + canvas.height / 2);

    planets.forEach(function (planet) {
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
        ctx.fill();
    });



    ctx.restore(); // Restore the canvas to its original position
    var angle = rocket.direction * Math.PI / 180;

    // Draw the rocket
    ctx.beginPath();
    ctx.translate(rocket.x - camera.x, rocket.y - camera.y);
    ctx.rotate(angle);
    ctx.translate(-(rocket.x - camera.x), -(rocket.y - camera.y));
    ctx.moveTo(rocket.x - camera.x, rocket.y - camera.y);
    ctx.lineTo(rocket.x - camera.x - 5, rocket.y - camera.y + 10);
    ctx.lineTo(rocket.x - camera.x + 5, rocket.y - camera.y + 10);
    ctx.closePath();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "white";
    ctx.fill();

}
function render() {
  clearCanvas();

  translateCanvas();

  drawPlanets();

  restoreCanvas();

  drawRocket();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function translateCanvas() {
  ctx.save();
  const xTranslate = -camera.x + canvas.width / 2;
  const yTranslate = -camera.y + canvas.height / 2;
  ctx.translate(xTranslate, yTranslate);
}

function drawPlanets() {
  planets.forEach(function (planet) {
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function restoreCanvas() {
  ctx.restore();
}

function drawRocket() {
  const angle = rocket.direction * Math.PI / 180;
  const xTranslate = rocket.x - camera.x;
  const yTranslate = rocket.y - camera.y;

  ctx.beginPath();
  ctx.translate(xTranslate, yTranslate);
  ctx.rotate(angle);
  ctx.translate(-xTranslate, -yTranslate);
  ctx.moveTo(xTranslate, yTranslate);
  ctx.lineTo(xTranslate - 5, yTranslate + 10);
  ctx.lineTo(xTranslate + 5, yTranslate + 10);
  ctx.closePath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.fillStyle = "white";
  ctx.fill();
}

const info = document.getElementById("info");

function update() {
    rocket.x += rocket.vx;
    rocket.y += rocket.vy;

    // Apply gravity from each planet
    planets.forEach(function (planet) {
        var dx = planet.x - rocket.x;
        var dy = planet.y - rocket.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var gravityMagnitude = (planet.mass * rocket.mass) / (distance * distance);

        var gravityX = gravityMagnitude * (dx / distance);
        var gravityY = gravityMagnitude * (dy / distance);

        rocket.vx += gravityX;
        rocket.vy += gravityY;
    });

    // Apply acceleration from user input
    if (rocket.acceleration !== 0) {
        rocket.vx += Math.sin(rocket.direction * Math.PI / 180) * rocket.acceleration * 0.01;
        rocket.vy += Math.cos(rocket.direction * Math.PI / 180) * rocket.acceleration * 0.01;
    }

    // Update the camera position to focus on the rocket
    camera.x = rocket.x - canvas.width / 2;
    camera.y = rocket.y - canvas.height / 2;

    info.innerText = `Rocket info: x: ${rocket.x.toFixed(2)} y: ${rocket.y.toFixed(2)} vx: ${rocket.vx.toFixed(2)} vy: ${rocket.vy.toFixed(2)} direction: ${rocket.direction} acceleration: ${rocket.acceleration * 10}`;

    render();
}

document.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key === "ArrowLeft") {
        rocket.direction -= 10;
    }
    if (e.key === "ArrowRight") {
        rocket.direction += 10;
    }
    if (e.key === "ArrowUp") {
        rocket.acceleration = 0.1;
    }
    if (e.key === "ArrowDown") {
        rocket.acceleration = -0.1;
    }
});

document.addEventListener("keyup", function (e) {
    e.preventDefault();
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        rocket.acceleration = 0;
    }
});

setInterval(update, 1000 / 60);
