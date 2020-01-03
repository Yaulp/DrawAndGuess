class Canvas {
	constructor(name) {
        this.name = name;
        this.canvas = document.getElementById(this.name);
		this.ctx = this.canvas.getContext("2d");
		//this.ctx = this.canvas.getContext("2d", {alpha: false});
		//this.ctx.webkitImageSmoothingEnabled = false;
    }
	getMousePos(e) {
		var rect = this.canvas.getBoundingClientRect();
		var x,y;
		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			var touch = e.touches[0] || e.changedTouches[0];
			x = touch.pageX;
			y = touch.pageY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			x = e.clientX;
			y = e.clientY;
		}
		return {
		  x: Math.floor((x - rect.left)*this.canvas.width/rect.width),
		  y: Math.floor((y - rect.top)*this.canvas.width/rect.width)
		};
	}
	circle(x, y) {
		this.ctx.fillStyle = Draw.color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, Draw.radius, 0, 2 * Math.PI, false);
		this.ctx.fill();
		this.ctx.strokeStyle = "black";
		this.ctx.stroke();
	}
}