// Remember to require config.js for the port number

var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8002});
var universe = {};
var clientPositions = [];
var worldNames = [];
var numWorlds = 0;
var numClients = 0;
wss.on('close', function() {
    console.log('disconnected');
});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};
wss.on('connection', function(ws) {
	console.log("new client");
	var clientId = numClients;
	numClients++;

	var toBeSent = {"worldInfo" : worldNames, "id" : clientId, "newClient" : "Y"};
	wss.broadcast(JSON.stringify(toBeSent));
	
	ws.on('message', function(message) {
		var dataReceived = JSON.parse(message);
		if(dataReceived["newWorld"] == "Y"){		
			var world = JSON.parse(dataReceived["world"]);
			console.log(world);
			var worldName = dataReceived["name"];
			var clientId = dataReceived["id"];
			var worldId = numWorlds;
			var postionClient = dataReceived["position"];

			clientPositions[worldId] = [];
			clientPositions[worldId].push(postionClient);
		
			universe[numWorlds] = world;
			worldNames[numWorlds] = worldName;
			console.log(worldNames[numWorlds]);

			var send = {"worldId" : worldId, "id" : clientId, "worldName" : worldName, "newWorld" : "Y" };
			numWorlds++;
		    wss.broadcast(JSON.stringify(send));
			
		}
		else if (dataReceived["joinWorld"] == "Y"){
			var worldId = dataReceived["worldId"];
			var world = universe[worldId];
			var clientId = dataReceived["id"];
			var postionClient = dataReceived["position"];
	
			clientPositions[worldId].push(postionClient);
			
			var send = {"world" : world ,"worldId" : worldId, "id" : clientId, "position" : clientPositions[worldId], "joinWorld" : "Y"};
			wss.broadcast(JSON.stringify(send));

		}
		else if (dataReceived["changeWorld"] == "Y"){
			var worldId = dataReceived["worldId"];
			var world = dataReceived["world"];
			
			universe[worldId] = world;
			var broadcastWorld = {"worldId" : worldId, "world" : world, "changeWorld" : "Y"};
			wss.broadcast(JSON.stringify(broadcastWorld));
		}
		});
	});
