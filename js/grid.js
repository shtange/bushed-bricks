/*
 *  "Bushed Bricks" JavaScript Game
 *  source code  : https://github.com/shtange/bushed-bricks
 *  play it here : https://shtange.github.io/bushed-bricks/
 *
 *  Copyright 2016, Yurii Shtanhei
 *  GitHub : https://github.com/shtange/
 *  Habr   : https://habrahabr.ru/users/shtange/
 *  email  : y.shtanhei@gmail.com
 *
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/MIT
 */

var Grid = function (config, shelters, gameAPI, callback) {
    this.config = config;
    this.shelters = shelters;
    this.gameAPI = gameAPI;
    this.callback = callback;

    this.cells = {};

    this.build();
}

Grid.prototype.API = function (action, method, data) {
    if (!this.gameAPI.hasOwnProperty(action) || !this.gameAPI[action].hasOwnProperty(method)) {
        return false;
    }
    (this.gameAPI[action][method]).call(this.callback, data || null);
}

Grid.prototype.build = function () {
    var cells = [];

    for (var row = 0; row < this.config.size; row++) {
        var arr = cells[row] = [];

        for (var col = 0; col < this.config.size; col++) {
            arr.push(null);
        }
    }

    this.cells = cells;
}

Grid.prototype.clear = function () {
    this.cells = {};

    this.build();
}

Grid.prototype.update = function (key, route) {
    if (!!route) {
        this.arrange(key, route.row || route.col, route.col !== 0);
    }
}

Grid.prototype.arrange = function (key, route, transpose) {
    var self = this;
    var rows, cells, empty,
        data = { combo: 0, colour: this.shelters[key] };

    cells = !!transpose ? this.transposeCells(this.cells) : this.cells;

    rows = [].map.call(cells, function(row) {
        row = row.filter(Boolean);

        if (row.length === 0) return this.emptyCells(this.config.size);

        // Merge tiles
        row = [].reduce.call(row, function (tiles, next) {
            next.merged = false;
            return tiles.length > 0 ? self.mergeTiles(tiles, next) : [next];
        }, []);

        // Move to shelter
        var num = route > 0 ? row.length - 1 : 0;
        if ((row[num]).colour === this.shelters[key] && (row[num]).combo >= this.config.combo && !(row[num]).merged) {
            data.combo += (row[num]).combo;
            row.splice(num, 1);
        }

        // Add empty cells
        empty = this.emptyCells(this.config.size - row.length);
        row = route > 0 ? empty.concat(row) : row.concat(empty);

        return row;
    }, this);

    if (data.combo > 0) {
        this.API("score", "update", data);
    }

    this.cells = !!transpose ? this.transposeCells(rows) : rows;
}

Grid.prototype.mergeTiles = function (tiles, next) {
    var row, last, combo;

    last = tiles.pop();

    if (last.colour === next.colour) {
        next.combo = last.combo + next.combo;
        next.merged = true;
        tiles.push(next);
    } else {
        tiles.push(last, next);
    }

    return tiles;
}

Grid.prototype.transposeCells = function (cells) {
    return cells[0].map(function(col, i) { 
        return cells.map(function(row) { 
            return row[i];
        });
    });
}

Grid.prototype.emptyCells = function (count) {
    var cells = [];

    for (var i = 0; i < count; i++) {
        cells.push(null);
    }

    return cells;
}

Grid.prototype.randomAvailableCell = function () {
    var cells = this.availableCells();

    if (cells.length) {
        return cells[Math.floor(Math.random() * cells.length)];
    }
}

Grid.prototype.availableCells = function () {
    var cells = [];

    this.eachCell(function (row, col, tile) {
        if (!tile) {
            cells.push({ row: row, col: col });
        }
    });

    return cells;
}

Grid.prototype.eachCell = function (callback) {
    for (var row = 0; row < this.config.size; row++) {
        for (var col = 0; col < this.config.size; col++) {
            callback(row, col, this.cells[row][col]);
        }
    }
}

Grid.prototype.cellsAvailable = function () {
    return this.availableCells().length >= this.config.count;
}
