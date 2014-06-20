// Remember to require config.js for the port number
var nconf = require('nconf');
nconf.file({ file: 'config.js' });
nconf.argv().env();
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: port});

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
	console.log("Client id: " + numClients);
	if(isMoved == 1)
	wss.broadcast(JSON.stringify(worldState));
	ws.on('message', function(message) {
		worldState = JSON.parse(message);
			wss.broadcast(message);
			isMoved = 1;
			console.log("something sent");
		});
	});

