;(function () {
  "use strict";

  var STANDARD_BOARD = "br bk bb bq bK bb bk br " +
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
    this.board  = new Board(STANDARD_BOARD, canvas.width, canvas.height);
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

  function range(size) {
    var a = [];

    for (var i = 0; i < size; i++) {
      a.push(i);
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

  function assert(bool, message) {
    if (!bool) {
      throw message;
    }
  }

  function zip(a, b) {
    var length = Math.min(a.length, b.length);

    return range(length).map(function (i) {
      return [a[i], b[i]];
    });
  }

  function parseBoardString(boardString) {
    var placements = boardString.split(" ").map(function (s) {
      if (s === "..") {
        return null;
      } else {
        return Piece.fromString(s);
      }
    });

    assert(placements.size === 64, "parseBoardString: boardString must have 64 squares");

    var ranks = stringRange("8", "1", -1);
    var files = stringRange("a", "h", 1);

    var names = crossProduct(ranks, files).map(function (pair) {
      return pair.reverse().join("");
    });

    return zip(names, placements).map(function(a) {
      var name = a[0];
      var piece = a[1];

      return new Space(name, piece);
    });
  }

  function Board(boardString, width, height) {
    this.width  = width;
    this.height = height;

    this.squares = parseBoardString(boardString);
    console.log(this.squares);
  }

  function identity(x) {
    return x;
  }

  function compact(a) {
    return a.filter(identity);
  }

  function mapProp(a, prop) {
    return a.map(function (o) { return o[prop]; });
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
