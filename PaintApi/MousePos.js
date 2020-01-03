class MousePos {
    constructor() {
		this.x = 0;
		this.y = 0;
		this.down = false;
		this.rDown = false;
    }

    update(e) {
		this.oldX = this.x;
		this.oldY = this.y;
		var pos = Tools.getMousePos(e);
        this.x = pos.x;
		this.y = pos.y;
    }
}