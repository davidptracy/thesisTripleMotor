//===========================================================
//=================== HTTP PORTION ==========================
//===========================================================

var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(4000, '0.0.0.0');

console.log("Listening on 4000");

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
	
	// Read index.html
	
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

//===========================================================
//====================== WS Portions ========================
//===========================================================

var WebSocket = require('ws')
  , ws = new WebSocket('ws://128.122.6.53:3000/');

ws.on('open', function() {
    ws.send('Server Here!');

});

ws.on('error', function(){
	console.log("An error occured");
})

function wsSendGamma(){
	ws.send(String(gam));
	console.log(typeof gam);
}

// setInterval(wsSendGamma,500);

//========================================================
//=============== SOCKET.IO PORTION ======================
//========================================================

var gyroVals = [0,0,0];

var io = require('socket.io').listen(httpServer);

var connectedSockets = [];

io.sockets.on('connection', function (socket){

	console.log("We have a new client: " + socket.id);

	//add it to the array of connected sockets
	connectedSockets.push(socket);

	// receives a random photo from a client
	socket.on('clientGyro', function(data){

		alpha = Math.floor(data[0]);
		beta = Math.floor(data[1]);
		gamma = Math.floor(data[2]);

		gyroVals[0] = alpha;
        gyroVals[1] = beta;
        gyroVals[2] = gamma;

		console.log("Received gyroVals from client: " + gyroVals);
		if(ws){
			ws.send(String(alpha)+','+String(beta)+','+String(gamma));
		}

	});

	socket.on('disconnect', function(){
		console.log("Client has disconnected!");
	})

});

