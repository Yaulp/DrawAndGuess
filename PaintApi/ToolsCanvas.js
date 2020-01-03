class ToolsCanvas extends Canvas {
    constructor(name) {
        super(name);
		this.clear();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
	/*line(x, y, X, Y) {
		this.ctx.strokeStyle = Draw.color;
		this.ctx.beginPath();
		this.ctx.moveTo(x, y);
		this.ctx.lineTo(X, Y);
		this.ctx.lineWidth = Draw.radius*2;
		this.ctx.lineCap = 'round';
		this.ctx.stroke();
	}*/
	
}