;(function () {
  "use strict";

  var boardPositions = "br bk bb bq bK bb bk br " +
                       "bp bp bp bp bp bp bp bp " +
                       ".. .. .. .. .. .. .. .. " +
                       ".. .. .. .. .. .. .. .. " +
                       ".. .. .. .. .. .. .. .. " +
                       ".. .. .. .. .. .. .. .. " +
                       "wp wp wp wp wp wp wp wp " +
                       "wr wk wb wq wK wb wk wr";

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
  };

  function Square(file, rank) {
    this.file = file;
    this.rank = rank;
  }

  Square.prototype = {
    draw: function(screen) {
    }
  }

  function stepChar(c, step) {
    return String.fromCharCode(c.charCodeAt(0) + step);
  }

  function stringRange(start, end, step) {
    var startCode = start.charCodeAt(0);
    var endCode   = end.charCodeAt(0);

    var length = Math.max((endCode - startCode) / step + 1, 0);

    var a = [];
    var c = start;

    for (var i = 0; i < length; i++) {
      a.push(c);
      c = stepChar(c, step);
    }

    return a;
  }

  function crossProduct(a, b) {
    var product = [];

    for (var x of a) {
      for (var y of b) {
        product.push([x, y]);
      }
    }

    return product;
  }

  function createSquares() {
    var ranks = stringRange("8", "1", -1);
    var files = stringRange("a", "h", 1);

    return crossProduct(ranks, files).map(function(pair) {
      var rank = pair[0];
      var file = pair[1];
      var name = file + rank;

      //return new Square(rank, file, initialPositions[name])
      return pair.reverse().join("");
    });
  }

  function Board(width, height) {
    this.width  = width;
    this.height = height;

    this.squares = createSquares();
    console.log(this.squares);
  }

  function identity(x) {
    return x;
  }

  function mapProp(a, prop) {
    return a.map(function (o) { return o[prop]; });
  }

  function compact(a) {
    return a.filter(identity);
  }

  Board.prototype = {
    draw: function (screen) {
      for (var square of this.squares) {
        //square.draw(screen);
      }
    },

    pieces: function () {
      return compact(mapProp(this.squares, "piece"));
    }
  };

  var game = new Game(document.getElementById("chess-canvas"));
  game.redraw();
})();
