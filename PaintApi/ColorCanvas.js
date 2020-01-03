class ColorCanvas extends Canvas {
    constructor() {
        super("cColor");
		this.ctx.lineWidth = 2;
		var gradient = new Image();
		gradient.onload = function() { ColorPick.init(this); };
		gradient.src = 'ColorPicker.png';
    }
	
	drawColorSquare(c) {
		var colorSquareSize = this.canvas.height;
		var context = this.canvas.getContext('2d');
		var squareX = this.canvas.width - colorSquareSize;
		var squareY = this.canvas.height - colorSquareSize;

		this.ctx.beginPath();
		this.ctx.fillStyle = c;
		this.ctx.fillRect(squareX, squareY, colorSquareSize, colorSquareSize);
		this.ctx.strokeRect(squareX, squareY, colorSquareSize, colorSquareSize);
	}
	drawColor() {
		this.drawColorSquare(Draw.color);
		this.circle(this.canvas.width - this.canvas.height/2, this.canvas.height/2);
	}
	selectColor(e) {
		var mousePos = this.getMousePos(e);
		if(mousePos !== null && mousePos.x < this.canvas.width - this.canvas.height) {
			var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			var data = imageData.data, x = mousePos.x, y = mousePos.y;
			Draw.setColor( data[Math.floor((this.canvas.width * y) + x) * 4],
				data[Math.floor((this.canvas.width * y) + x) * 4 + 1],
				data[Math.floor((this.canvas.width * y) + x) * 4 + 2]);
		}
	}
	
	init(grad) {
		this.ctx.drawImage(grad,0,0,ColorPick.canvas.width-ColorPick.canvas.height,ColorPick.canvas.height);
	}
}

