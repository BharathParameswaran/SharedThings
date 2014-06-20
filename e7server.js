
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8002});

var worldState = {};
var numClients = 0;
var isMoved = 0;
wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function(ws) {
	numClients++;
	console.log("Client id: " + this.clients.length);
	if(isMoved == 1)
	wss.broadcast(JSON.stringify(worldState));
	ws.on('message', function(message) {
		worldState = JSON.parse(message);
			wss.broadcast(message);
			isMoved = 1;
			console.log("something sent");
		});
	});

