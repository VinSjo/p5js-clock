let clock;

document.onload = () => {
	randomBodyBackground();
};

function setup() {
	createCanvas(500, 500);
	pixelDensity(window.devicePixelRatio);
	frameRate(30);
	clock = new Clock(200, true);
	clock.onminutechange = () => {
		randomBodyBackground();
	};
}

function draw() {
	clear();
	clock.update();
	clock.draw();
}

function randomBodyBackground(min = 0, max = 255) {
	const rgb = [];
	for (let i = 0; i < 3; i++) {
		rgb.push(Math.round(Math.random() * (max - min)) + min);
	}
	document.body.style.backgroundColor = `rgb(${rgb.join(",")})`;
}
