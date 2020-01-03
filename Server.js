// Invite de commande : node Server.js
// Lien : http://localhost:3000/

var fs = require('fs');
var Words = fs.readFileSync('Words[FR].txt').toString().split("\n");
/*for (var i=0; i<textByLine.length;i++)
	console.log(Words[i]);*/


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.use(express.static(__dirname+'/'));
 
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});
http.listen(port, '0.0.0.0', function(){ console.log('Listening on port : ' + port); });



class Room {
	constructor(name) {
		this.name = name;
		this.Players = [];
		this.max = 3;
		this.drawer = 0;
	}
	isFull() { return this.Players.length >= this.max; }
	add(infos, socket) {
		this.Players.push(infos);
		console.log(infos.pseudo+' connected.');
		if (this.drawer == this.Players.length - 1)
			this.youDraw(this.Players.length - 1);
	}
	remove(id) {
		for(var i=0; i<this.Players.length; ++i ) {
			if(this.Players[i].socket == id){
				io.emit('end connection', this.Players[i].id);
				console.log(this.Players[i].pseudo+' disconnected.');
				this.Players.splice(i,1);
				if (this.drawer == i)
					this.youDraw(i);
				break;
			}
		}
	}
	youDraw(i) {
		if (this.Players.length > i) {
			var r1 = Math.floor(Math.random() * Words.length), r2=0, r3=0;
			do {
				r2 = Math.floor(Math.random() * Words.length);
			} while(r1==r2)
			do {
				r3 = Math.floor(Math.random() * Words.length);
			} while(r3==r1 || r3 == r2)
			var chosenWords = [Words[r1], Words[r2], Words[r3]];
			io.to(this.Players[i].socket).emit('YOU DRAW', chosenWords);
			console.log(this.Players[i].pseudo+' is drawing !');
		}
	}
}
class RoomManager {
	constructor() {
		this.Rooms = [];
	}
	add(infos, socket) {
		var i=0;
		for(; i<this.Rooms.length;i++)
			if (!this.Rooms[i].isFull())
				break;
		if (i == this.Rooms.length) {
			this.Rooms.push(new Room('Room '+i));
			console.log('Room opened : '+this.Rooms[i].name);
		}
		for(var j=0; j<this.Rooms[i].Players.length; j++ )
            socket.emit('new connection',this.Rooms[i].Players[j]);
		socket.join(this.Rooms[i].name);
		this.Rooms[i].add(infos, socket);
	}
	remove(roomName, id) {
		for(var i=0; i<this.Rooms.length; ++i ) 
			if(this.Rooms[i].name == roomName)
				this.Rooms[i].remove(id);
	}
}
var Rooms = new RoomManager();
io.on('connection', function(socket){
	socket.on('disconnecting', function(){
		let rooms = Object.keys(socket.rooms);
		console.log(rooms);
		if (rooms.length>1)
			Rooms.remove(rooms[1], socket.id);
	});
	socket.on('infos', function(infos){
		infos.socket = socket.id;
		Rooms.add(infos, socket);
	});
});

