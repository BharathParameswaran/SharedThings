/* Run this in the current directory via 

nodejs echoServer.js

I have the websockets libraries installed in node_modules */

var config = require('./config_node.js');

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: config.port});
var messages=[];

wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function(ws) {
	for(var i=0;i<messages.length;i++){
		ws.send(messages[i]); // careful!
	}
	ws.on('message', function(message) {
		console.log('received: %s', message);
		messages.push(message);
		wss.broadcast(message);
		if(message=="delay"){
			console.log('delaying');
			while(1);
		}
	});
});
