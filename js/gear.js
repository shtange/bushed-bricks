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

var Gear = function (params) {
    this.config = {
        size     : params.size && [5, 6, 7, 8, 9, 10].indexOf(params.size) > -1 ? params.size : 7,
        count    : params.count && [2, 3, 4].indexOf(params.count) > -1 ? params.count : 2,
        maxCombo : params.combo && [2, 3, 4, 5].indexOf(params.combo) > -1 ? params.combo : 4,
        mode     : params.mode && ['easy', 'hard'].indexOf(params.mode) > -1 ? params.mode : 'easy',
        lifeTime : 4,
        points   : 10,
    };

    this.score = 0;
    this.step = 1;
    this.gain = {};
    this.over = false;

    this.colour = new Colour();
    this.shelter = new Shelter();
    this.render = new Render(this.config);
    this.controls = new ControlsManager(this.api, this);
    this.grid = new Grid(this.config, this.shelter.list, this.api, this);

    this.api.game.run.call(this);
}

Gear.prototype.api = {
    score: {
        update: function(data) {
            var points = this.config.points * ( data.combo || 1 );

            this.score += points;
            this.gain.points = points;
            this.gain.colour = data.colour;
        }
    },
    controls: {
        move: function(key) {
            var route = { row: 0, col: 0 };

            if (key%2 === 0) {
                route.col = key > 0 ? 1 : -1; // up, down
            } else {
                route.row = key > 2 ? -1 : 1; // left, right
            }

            if (!this.grid.cellsAvailable()) {
                this.api.game.over.call(this);
            } else {
                this.api.game.update.call(this, key, route);
            }

            this.controls.position = [];
        }
    },
    game: {
        run: function() {
            var cell = {};

            [].map.call(this.colour.list, function(colour) {
                cell = this.grid.randomAvailableCell();
                this.grid.cells[cell.row][cell.col] = new Tile(colour);
            }, this);

            this.render.redraw(this.grid.cells, this.score, this.gain);
        },
        update: function(key, route) {
            this.grid.update(key, route);

            this.api.game.step.call(this);
            this.api.game.redraw.call(this, this.grid.cells, this.score, this.gain, this.step);

            this.gain = {};
        },
        step: function() {
            var cell, colour;

            for (var i = 0; i < this.config.count; i++) {
                cell = this.grid.randomAvailableCell();
                colour = this.colour.randomByWeight();
                this.grid.cells[cell.row][cell.col] = new Tile(colour);
            }

            this.step++
        },
        reload: function() {
            this.score = 0;
            this.step = 1;
            this.over = false;

            this.grid.clear();
            this.render.clear();

            this.api.game.run.call(this);
        },
        over: function() {
            this.over = true;
            this.render.gameOver();
        },
        redraw: function(cells, score, gain, step) {
            this.render.redraw(cells, score, gain, step);
        }
    }
}
