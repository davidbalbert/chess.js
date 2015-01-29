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

  function identity(x) {
    return x;
  }

  function compact(a) {
    return a.filter(identity);
  }

  function mapProp(a, prop) {
    return a.map(function (o) { return o[prop]; });
  }

  function Pawn(color) {
    this.color = color;
  }

  function Rook(color) {
    this.color = color;
  }

  function Knight(color) {
    this.color = color;
  }

  function Bishop(color) {
    this.color = color;
  }

  function Queen(color) {
    this.color = color;
  }

  function King(color) {
    this.color = color;
  }

  var COLORS = {w: "white", b: "black"};
  var PIECES = {
    p: Pawn,
    r: Rook,
    k: Knight,
    b: Bishop,
    q: Queen,
    K: King
  };

  function parsePiece(s) {
    var parts = s.split("");

    var color = COLORS[parts[0]];
    assert(color, "color must be 'b' or 'w'");

    var constructor = PIECES[parts[1]];
    assert(constructor,  "'" + parts[1] + "' is not a valid piece");

    return new constructor(color);
  };

  function Square(name, piece) {
    this.name = name;
    this.piece = piece;
  }

  Square.prototype = {
    draw: function (screen, size) {
      var pos = this.getPosition(size);

      screen.fillStyle = this.getColor();
      screen.fillRect(pos.x, pos.y, size, size);

      if (this.piece) {
        //this.piece.draw(screen, pos, side);
      }
    },

    // Given the size of the square, return an object that represents the upper
    // left corner of the square.
    getPosition: function (size) {
      return {
        x: this.col() * size,
        y: this.row() * size
      };
    },

    getColor: function () {
      var parts   = this.name.split("");
      var rank    = parseInt(parts[1]);
      var fileNum = parts[0].charCodeAt(0) - "a".charCodeAt(0) + 1; // a => 1, b => 2, etc.

      if (this.row() % 2 === this.col() % 2) {
        return "#ffffe0";
      } else {
        return "#556b2f";
      }
    },

    // Zero indexed, starting from the top
    row: function () {
      var rank = parseInt(this.name.split("")[1]);

      return 8 - rank;
    },

    // Zero indexed, starting from the left
    col: function () {
      var file = this.name.split("")[0];

      return file.charCodeAt(0) - "a".charCodeAt(0);
    }
  };

  function parseBoardString(boardString) {
    var placements = boardString.split(" ").map(function (s) {
      if (s === "..") {
        return null;
      } else {
        return parsePiece(s);
      }
    });

    assert(placements.length === 64, "parseBoardString: boardString must have 64 squares");

    var ranks = stringRange("8", "1", -1);
    var files = stringRange("a", "h", 1);

    var names = crossProduct(ranks, files).map(function (pair) {
      return pair.reverse().join("");
    });

    return zip(names, placements).map(function(a) {
      var name = a[0];
      var piece = a[1];

      return new Square(name, piece);
    });
  }

  function Board(boardString, width, height) {
    assert(width === height, "board width must equal height");
    assert(width % 8 == 0, "board size must be a multiple of 8");

    this.side = width;

    this.squares = parseBoardString(boardString);
  }

  Board.prototype = {
    draw: function (screen) {
      for (var square of this.squares) {
        square.draw(screen, this.sideLength());
      }
    },

    sideLength: function () {
      return this.side / 8;
    },

    pieces: function () {
      return compact(mapProp(this.squares, "piece"));
    }
  };

  var IMAGE_NAMES = [
    "images/black_bishop.png",
    "images/black_king.png",
    "images/black_knight.png",
    "images/black_pawn.png",
    "images/black_queen.png",
    "images/black_rook.png",
    "images/white_bishop.png",
    "images/white_king.png",
    "images/white_knight.png",
    "images/white_pawn.png",
    "images/white_queen.png",
    "images/white_rook.png"
  ];

  loadImages(IMAGE_NAMES, function (images) {
    var game = new Game(document.getElementById("chess-canvas"), images);
    game.redraw();
  });
})();
