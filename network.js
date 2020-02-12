let socket = new WebSocket("ws://localhost:8080");
// Listen for messages
socket.addEventListener("message", function(event) {
  // console.log("Message from server ", event.data);
  chessGame.clearCanvas();
  chessGame.drawChessBoard();
  chessGame.setList(JSON.parse(event.data));
  list = JSON.parse(event.data);
  // console.log(list, "list");
  chessGame.getList().forEach(item => {
    chessGame.drawChess(item);
  });
});

socket.addEventListener("open", function() {
  window.addEventListener("sendList", function(data) {
    // console.log(data, 111);
    socket.send(JSON.stringify(data.detail));
  });
});
