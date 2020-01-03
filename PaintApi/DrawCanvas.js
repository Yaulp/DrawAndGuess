const TOOL = { BRUSH:0, BUCKET:1, ERASE:2 }
class DrawCanvas extends ToolsCanvas {
    constructor(name) {
        super(name);
		this.storeImageData();
    }
	clearWhite() {
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fill();
	}
	reset() {
		this.clearWhite();
		this.setTool(TOOL.BRUSH);
		this.setColor(0, 0, 255);
		this.setRadius(10);
	}
	setColor(r, g, b) { 
		this.r = r;
		this.g = g;
		this.b = b;
		this.color = 'rgb(' + r + ',' + g + ',' + b + ')';
		ColorPick.drawColor(this.color);
	}
	/*pickColor(e) {
		var mousePos = this.getMousePos(e);
		if(mousePos !== null) {
			this.storeImageData();
			var x = mousePos.x, y = mousePos.y;
			this.startR = this.data[Math.floor((this.canvas.width * y) + x) * 4];
			this.startG = this.data[Math.floor((this.canvas.width * y) + x) * 4 + 1];
			this.startB = this.data[Math.floor((this.canvas.width * y) + x) * 4 + 2];
		}
	}*/
	pickColor(x, y) {
		this.storeImageData();
		this.startR = this.data[Math.floor((this.canvas.width * y) + x) * 4];
		this.startG = this.data[Math.floor((this.canvas.width * y) + x) * 4 + 1];
		this.startB = this.data[Math.floor((this.canvas.width * y) + x) * 4 + 2];
	}
	matchStartColor(pixelPos) { 
		return (this.startR == this.data[pixelPos] && this.startG == this.data[pixelPos+1] && this.startB == this.data[pixelPos+2]);
	}
	bucket(x, y) {
		this.pickColor(x, y);
		if (this.red == this.startR && this.green == this.startG && this.blue == this.startB)
			return;
		
		this.storeImageData();
			
		var pixelStack = [[x, y]];
		while(pixelStack.length) {
			var newPos, x, y, pixelPos, reachLeft, reachRight;
			newPos = pixelStack.pop();
			x = newPos[0];
			y = newPos[1];
			  
			pixelPos = (y*this.canvas.width + x) * 4;
			while(y-- >= 0 && this.matchStartColor(pixelPos))
				pixelPos -= this.canvas.width * 4;
			
			pixelPos += this.canvas.width * 4;
			++y;
			reachLeft = false;
			reachRight = false;
			while(y++ < this.canvas.height-1 && this.matchStartColor(pixelPos)) {
				this.colorPixel(pixelPos);

				if(x > 0) {
					if(this.matchStartColor(pixelPos - 4)) {
						if(!reachLeft){
							pixelStack.push([x - 1, y]);
							reachLeft = true;
						}
					} else if (reachLeft)
						reachLeft = false;
				}
				
				if(x < this.canvas.width-1) {
					if(this.matchStartColor(pixelPos + 4)) {
						if(!reachRight) {
							pixelStack.push([x + 1, y]);
							reachRight = true;
						}
					} else if(reachRight)
						reachRight = false;
				}
				
				pixelPos += this.canvas.width * 4;
			}
		}
		this.setImageData();
	}
	
	length(x1,y1,x2,y2) { return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); }
	getAngle(x,y) { return Math.atan(y/(x==0?0.01:x))+(x<0?Math.PI:0); }
	lineNoAliasing(x, y, X, Y) {
		this.ctx.fillStyle = Draw.color;
		var dist = this.length(x, y, X, Y);
		var ang = this.getAngle(X-x,Y-y);
		for(var i=0;i<dist;i++) {
			this.circleNoAliasing(Math.round(x + Math.cos(ang)*i),
						 Math.round(y + Math.sin(ang)*i));
		}
	}
	colorPixel(pixelPos) {
		this.data[pixelPos] = this.r;
		this.data[pixelPos+1] = this.g;
		this.data[pixelPos+2] = this.b;
		this.data[pixelPos+3] = 255;
	}
	circleNoAliasing(x,y) {
		this.imageData = this.ctx.getImageData(x-this.radius, y-this.radius, 2*this.radius, 2*this.radius);
		this.data = this.imageData.data;
		
		for (var i = 0; i<this.radius*2 ; i++)
			for (var j = 0; j<this.radius*2 ; j++)
				if ((i-this.radius)*(i-this.radius) + (j-this.radius)*(j-this.radius) <= this.radius*this.radius)
					this.colorPixel(i*4+j*8*this.radius);
				
		this.ctx.putImageData(this.imageData, x-this.radius, y-this.radius);
	}
	storeImageData() {
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.data = this.imageData.data;
	}
	setImageData() { this.ctx.putImageData(this.imageData, 0, 0); }
	setData(bytes) {
		var data = new Uint8Array(bytes);
		Draw.imageData.data.set(data);
		this.setImageData();
	}
	
	setTool(t) {
		this.tool = t;
		switch(t){
			case TOOL.BRUSH:
				Tools.canvas.style.cursor = "none";
				break;
			default:
				Tools.canvas.style.cursor = "default";
				break;
		}
	}
	setRadius(r) {
		this.radius = r; 
		ColorPick.drawColor();
		document.getElementById("DrawSize").value = r;
	}
	
}