;(function () {
  "use strict";

  function Game(canvas) {
    this.screen = canvas.getContext("2d");
    this.width  = canvas.width;
    this.height = canvas.height;
    this.board  = new Board(canvas.width, canvas.height);
  }

  Game.prototype = {
    redraw: function () {
      this.screen.clearRect(0, 0, this.width, this.height);
      this.board.draw(this.screen);
    }
  }

  function Board(width, height) {
    this.width  = width;
    this.height = height;
  }

  Board.prototype = {
    draw: function(screen) {
      screen.fillRect(0, 0, this.width, this.height);
    }
  }

  var game = new Game(document.getElementById("chess-canvas"));
  game.redraw();
})();
