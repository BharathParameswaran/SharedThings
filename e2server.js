// Remember to require config.js for the port number
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8002});

var worldState = {};
wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: ' +  message);
		//console.log(' after decoding: ' +  worldState);
		});
	});

