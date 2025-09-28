var validation = require('./libs/unalib');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// Root: presentar HTML
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Escuchar una conexión por socket
io.on('connection', function(socket){
  // Si se escucha "chat message"
  socket.on('Evento-Mensaje-Server', function(msg){
    msg = validation.validateMessage(msg);
    // Volver a emitir el mismo mensaje
    io.emit('Evento-Mensaje-Server', msg);
  });
});

http.listen(port, function(){
  console.log('Escuchando en *:' + port);
});
