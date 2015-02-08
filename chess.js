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

  var IMAGES;

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

  function assert(bool, message) {
    if (!bool) {
      throw message;
    }
  }

  function mapProp(a, prop) {
    return a.map(function (o) { return o[prop]; });
  }

  function Game(canvas) {
    this.canvas = canvas;
    this.screen = canvas.getContext("2d");
    this.width  = canvas.width;
    this.height = canvas.height;
    this.board  = new Board(STANDARD_BOARD, canvas.width, canvas.height);
  }

  function highlightSquare(e) {
    this.board.highlight({x: e.offsetX, y: e.offsetY});
  }

  function unhighlightSquare(e) {
    this.board.unhighlight();
  }

  _.extend(Game.prototype, {
    run: function () {
      $(this.canvas).on("mousemove", highlightSquare.bind(this));
      $(this.canvas).on("mouseleave", unhighlightSquare.bind(this));

      requestAnimationFrame(this.redraw.bind(this));
    },

    redraw: function () {
      this.screen.clearRect(0, 0, this.width, this.height);
      this.board.draw(this.screen);

      requestAnimationFrame(this.redraw.bind(this));
    }
  });

  var piecePrototype = {
    draw: function (screen, pos, side) {
      screen.drawImage(IMAGES[this.imageName()], pos.x, pos.y, side, side);
    },

    imageName: function () {
      return "images/" + this.color + "_" + this.constructor.name.toLowerCase() + ".png";
    }
  }

  function Pawn(color) {
    this.color = color;
  }
  _.extend(Pawn.prototype, piecePrototype);

  function Rook(color) {
    this.color = color;
  }
  _.extend(Rook.prototype, piecePrototype);

  function Knight(color) {
    this.color = color;
  }
  _.extend(Knight.prototype, piecePrototype);

  function Bishop(color) {
    this.color = color;
  }
  _.extend(Bishop.prototype, piecePrototype);

  function Queen(color) {
    this.color = color;
  }
  _.extend(Queen.prototype, piecePrototype);

  function King(color) {
    this.color = color;
  }
  _.extend(King.prototype, piecePrototype);

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
    this.highlighted = false;
  }

  _.extend(Square.prototype, {
    draw: function (screen, size) {
      var pos = this.getPosition(size);

      screen.fillStyle = this.getColor();
      screen.fillRect(pos.x, pos.y, size, size);

      if (this.piece) {
        this.piece.draw(screen, pos, size);
      }

      if (this.highlighted) {
        screen.fillStyle = "rgba(255,255,0,0.5)";
        screen.fillRect(pos.x, pos.y, size, size);
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
    },

    highlight: function () {
      this.highlighted = true;
    },

    unhighlight: function () {
      this.highlighted = false;
    }
  });

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

    return _.zip(names, placements).map(function(a) {
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

  _.extend(Board.prototype, {
    draw: function (screen) {
      for (var square of this.squares) {
        square.draw(screen, this.squareSize());
      }
    },

    squareSize: function () {
      return this.side / 8;
    },

    pieces: function () {
      return _.compact(mapProp(this.squares, "piece"));
    },

    highlight: function (point) {
      this.unhighlight();

      var square = this.pointToSquare(point);
      square.highlight();
    },

    unhighlight: function () {
      for (var square of this.squares) {
        square.unhighlight();
      }
    },

    pointToSquare: function(p) {
      var col = Math.floor(p.x / this.squareSize());
      var row = Math.floor(p.y / this.squareSize());

      var index = row * 8 + col;

      return this.squares[index];
    }
  });

  function withImages(names, cb) {
    var completed = []

    function checkComplete(e) {
      completed.push(e.target.src);

      if (completed.length === names.length) {
        cb(images);
      }
    }

    var images = _.object(names.map(function (name) {
      var img = new Image();
      img.addEventListener("load", checkComplete);
      img.src = name;
      return [name, img];
    }));
  }

  withImages(IMAGE_NAMES, function (images) {
    IMAGES = images;
    var game = new Game(document.getElementById("chess-canvas"));
    game.run();
  });
})();
