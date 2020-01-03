const DATA = { GETINFOS:0, INFOS:1, MSG:2, CLICK:3, MOVE:4, IMAGE:5 }
class ClientClass {
	constructor() {
		this.infos = new Object();
		this.peer = new Peer({key: 'lwjd5qra8257b9'});
		this.infos.pseudo = "Anonymous"+Math.floor(Math.random() * 100000);
		console.log('Pseudo : ' + this.infos.pseudo);
		this.Players = [];
		this.isServer = false;
		//this.isServer = true;
		
		this.peer.on('open', function(id) {
			console.log('ID : ' + id);
			Client.infos.id = id;
			socket.emit('infos', Client.infos);
		});
		this.peer.on('error', function(err) { console.log('PEER ERROR :', err.message); });
		this.peer.on('connection', function(conn) { 
			conn.on('data', function(data) { Client.received(data, this); }); 
			conn.on('error', function(err) { console.log('CONNECTION ERROR :', err.message); });
		});
		
	}
	connectToPeer(infos) {
		infos.conn = this.peer.connect(infos.id);
		infos.conn.on('data', function(data) { Client.received(data, this); });
		infos.conn.on('error', function(err) { console.log('CONNECTION ERROR :', err.message); });
		this.Players.push(infos);
		var data = new Object();
		data.type = DATA.INFOS;
		data.ctn = Client.infos;
		infos.conn.on('open', function() { infos.conn.send(data); });
		console.log('Connected to : ', infos.pseudo);
	}
	received(data, conn) {
		if (data.type == DATA.INFOS) {
			data.ctn.conn = conn;
			this.Players.push(data.ctn);
			console.log('Connected to : ', data.ctn.pseudo);
			if (Client.isServer) {
				Draw.storeImageData();
				Client.send(DATA.IMAGE, Draw.data, conn);
			}
		} else if (data.type == DATA.MSG) {
			console.log('Message received : ', this.getInfos(conn.peer).pseudo+' : '+data.ctn);
			this.writeMessage(this.getInfos(conn.peer).pseudo,data.ctn);
		} else if (data.type == DATA.CLICK) {
			Draw.setTool(data.tool);
			Draw.setRadius(data.radius);
			Draw.setColor(data.r, data.g, data.b);
			if (Draw.tool == TOOL.BRUSH)
				Draw.circleNoAliasing(data.x, data.y);
			else if (Draw.tool == TOOL.BUCKET)
				Draw.bucket(data.x, data.y);
			else
				Draw.clearWhite()
		} else if (data.type == DATA.MOVE) {
			Draw.lineNoAliasing(data.oldX, data.oldY, data.x, data.y);
		} else if (data.type == DATA.IMAGE) {
			Draw.setData(data.ctn);
		}
	}
	disconnectPeer(id) {
		for(var i=0; i<this.Players.length; i++ )
			if (this.Players[i].id == id) {
				console.log(this.Players[i].pseudo+" disconnected.");
				this.Players[i].conn.close();
				this.Players.splice(i,1);
			}
	}
	getInfos(id) {
		for(var i=0; i<this.Players.length; i++)
			if (this.Players[i].id == id)
				return this.Players[i];
	}
	send(type, ctn, conn = null) {
		var data = new Object();
		data.type = type;
		data.ctn = ctn;
		this.sendData(data, conn);
	}
	sendData(data, conn) {
		if (conn != null)
			conn.send(data);
		else {
			for(var i=0; i<this.Players.length; i++)
				this.Players[i].conn.send(data);
		}
	}
	sendMessage(msg) {
		this.send(DATA.MSG, msg);
		this.writeMessage(this.infos.pseudo, msg);
	}
	writeMessage(pseudo, msg) { document.getElementById("ChatText").innerHTML+= "<b>"+pseudo+" : </b>"+msg+"<br />"; }
	drawClick() {
		if (this.isServer) {
			var data = new Object();
			data.type = DATA.CLICK;
			data.tool = Draw.tool;
			data.radius = Draw.radius;
			data.r = Draw.r;
			data.g = Draw.g;
			data.b = Draw.b;
			data.x = Mouse.x;
			data.y = Mouse.y;
			this.sendData(data);
			this.received(data);
		}
	}
	drawMove() {
		if (this.isServer) {
			var data = new Object();
			data.type = DATA.MOVE;
			data.x = Mouse.x;
			data.y = Mouse.y;
			data.oldX = Mouse.oldX;
			data.oldY = Mouse.oldY;
			this.sendData(data);
			this.received(data);
		}
	}
	youDraw(words) {
		this.isServer = true;
		console.log(words[0], words[1], words[2]);
		Game.setWords(words);
	}
}
const Client = new ClientClass();
document.getElementById("ChatMessage").onkeyup = function(e) {
	if (event.keyCode === 13) {
		var msg = document.getElementById("ChatMessage").value;
		Client.sendMessage(msg);
		document.getElementById("ChatMessage").value = "";
	}
};

var socket = io();
socket.on('new connection', function(infos){ Client.connectToPeer(infos); });
socket.on('end connection', function(id){ Client.disconnectPeer(id); });
socket.on('YOU DRAW', function(words){ Client.youDraw(words); });


