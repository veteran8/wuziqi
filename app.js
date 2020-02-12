var chessGame = (function() {
  var canvas = document.getElementById("hh");
  var ctx = canvas.getContext("2d");
  var list = [];
  const size = 15;
  const chessWidth = 30;
  canvas.width = chessWidth * (size + 1);
  canvas.height = chessWidth * (size + 1);
  drawChessBoard();
  //点击棋盘事件
  canvas.addEventListener("click", play);
  //悔棋
  document.querySelector("button").addEventListener("click", withDraw);
  //点击开始下棋
  function play(e) {
    if (
      e.clientX <= chessWidth / 2 ||
      e.clientX >= chessWidth * size + chessWidth / 2 ||
      e.clientY >= chessWidth * size + chessWidth / 2 ||
      e.clientY <= chessWidth / 2
    ) {
      return;
    }
    let x = Math.round(e.clientX / chessWidth) * chessWidth;
    let y = Math.round(e.clientY / chessWidth) * chessWidth;
    let chessInfo = {
      x,
      y,
      color: list.length % 2 === 0 ? "black" : "white"
    };
    if (cannotDropChess(x, y)) {
      return;
    }
    list.push(chessInfo);
    drawChess(list[list.length - 1]);
    // socket.send(JSON.stringify(list));
    // console.log("list :", list);
    checkWin(chessInfo);
    window.dispatchEvent(new CustomEvent("sendList", { detail: list }));
  }
  //是否可以落子
  function cannotDropChess(x, y) {
    return (
      list.filter(item => {
        return item.x === x && item.y === y;
      }).length > 0
    );
  }
  //悔棋
  function withDraw() {
    list.pop();
    // socket.send(JSON.stringify(list));
    window.dispatchEvent("sendList", { detail: list });

    clearCanvas();
    drawChessBoard();
    list.forEach(item => {
      drawChess(item);
    });
  }
  //画出棋盘
  function drawChessBoard() {
    for (let i = 0; i < size + 1; i++) {
      ctx.beginPath();
      ctx.moveTo(chessWidth, i * chessWidth);
      ctx.lineTo(chessWidth * size, i * chessWidth);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * chessWidth, chessWidth);
      ctx.lineTo(i * chessWidth, chessWidth * size);
      ctx.stroke();
    }
  }
  //画旗子
  function drawChess(item) {
    ctx.beginPath();
    // console.log("item :", item);
    ctx.arc(item.x, item.y, chessWidth / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = item.color;
    ctx.fill();
  }
  //清除canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, chessWidth * (size + 1), chessWidth * (size + 1));
  }
  function getList() {
    return list;
  }
  function setList(data) {
    list = data;
  }
  //判断输赢
  function checkWin(chessInfo) {
    let winList = [];
    for (let k = 0; k < 4; k++) {
      winList[k] = winList[k] || [];
      for (let j = 0; j < 5; j++) {
        winList[k][j] = winList[k][j] || [];
        for (let i = -j; i < 5 - j; i++) {
          if (k === 0) {
            //横
            winList[k][j].push({
              x: chessInfo.x - chessWidth * i,
              y: chessInfo.y,
              color: chessInfo.color
            });
          } else if (k === 1) {
            //竖
            winList[k][j].push({
              x: chessInfo.x,
              y: chessInfo.y - chessWidth * i,
              color: chessInfo.color
            });
          } else if (k === 2) {
            //左斜
            winList[k][j].push({
              x: chessInfo.x - chessWidth * i,
              y: chessInfo.y - chessWidth * i,
              color: chessInfo.color
            });
          } else {
            //右斜
            winList[k][j].push({
              x: chessInfo.x + chessWidth * i,
              y: chessInfo.y - chessWidth * i,
              color: chessInfo.color
            });
          }
        }
      }
    }
    return winList.some(winPosition => {
      return winPosition.some(winCase => {
        return winCase.every(item => {
          return (
            list.filter(chess => {
              return (
                chess.x === item.x &&
                chess.y === item.y &&
                chess.color === item.color
              );
            }).length > 0
          );
        });
      });
    });
  }
  return {
    clearCanvas,
    drawChessBoard,
    drawChess,
    getList,
    setList
  };
})();
