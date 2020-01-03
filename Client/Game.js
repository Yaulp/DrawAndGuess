
class GameManager {
	constructor() {
		
	}
	setWords(words) {
		Draw.reset();
		document.getElementById("Words").style.display = "block";
		Tools.canvas.style.backgroundColor = "rgba(120, 120, 120, .5)";
		for (var i=0;i<3;i++) {
			document.getElementById("Word"+(i+1)).value=words[i];
			document.getElementById("Word"+(i+1)).onmouseup = function() { 
				document.getElementById("Words").style.display = "none";
				Tools.canvas.style.backgroundColor = "transparent";
				//alert(this.value); 
			};
		}
	}
}