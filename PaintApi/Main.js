//document.body.style.zoom = screen.width/1400*100+"%";


const Draw = new DrawCanvas("cDraw");
const Tools = new ToolsCanvas("cTools");
const Mouse = new MousePos();
const ColorPick = new ColorCanvas();
const Game = new GameManager();
Draw.reset();


var colorMouseDown = false;
ColorPick.canvas.onmousemove = function(e) { if (colorMouseDown) ColorPick.selectColor(e); }
ColorPick.canvas.onmousedown = function(e) { ColorPick.selectColor(e); colorMouseDown = true }



Tools.canvas.onmousedown = function(e) {
	if (!Mouse.rDown) {
		if (window.event.button == 0) {
			down(e);
		} else if (window.event.button == 2)
			Mouse.rDown = true;
	} else
		Mouse.rDown = false;
};
Tools.canvas.ontouchstart = down;
function down(e) { 
		Mouse.down = true;
		Mouse.update(e);
		Client.drawClick();
};

Tools.canvas.onmousemove = function(e) {
	move(e);
	Tools.clear();
	Tools.ctx.fillText("X: "+Mouse.x+", Y: "+Mouse.y, 10, 20);
	if (Draw.tool == TOOL.BRUSH)
		Tools.circle(Mouse.x,Mouse.y);
};
Tools.canvas.ontouchmove = move;
function move(e) {
	Mouse.update(e);		
	if (Draw.tool == TOOL.BRUSH && Mouse.down)
		Client.drawMove();
}

document.onmouseup = function() { if (window.event.button == 0) { up(); } };
document.ontouchend = up;
function up() { Mouse.down = false; colorMouseDown = false;  };


function erase() {
	var tool = Draw.tool;
	Draw.setTool(TOOL.ERASE); 
	Client.drawClick();
	Draw.setTool(tool);
}


//screen.orientation.lock("landscape");
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}