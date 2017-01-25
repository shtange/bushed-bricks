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
        count    : params.count && [2, 3, 4].indexOf(params.count) > -1 ? params.count : params.size - 4,
        combo    : params.combo && [2, 3, 4, 5].indexOf(params.combo) > -1 ? params.combo : params.size - 3,
        mode     : params.mode && ['easy', 'hard'].indexOf(params.mode) > -1 ? params.mode : 'easy',
        lifeTime : 4,
        points   : 10,
        victory  : {
            steps: 400,
            points: 5000,
        },
    };

    this.score = 0;
    this.step = 1;
    this.gain = {};
    this.over = false;

    this.circle = 4;
    this.user = {
        steps   : [],
        penalty : 0
    };

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

            this.user.steps.push(key);
            if (this.user.steps.length > this.circle) {
                this.user.steps.shift();
                this.api.game.penalty.call(this);
            }

            switch (true) {
                case this.step >= this.config.victory.steps || this.score >= this.config.victory.points :
                    this.api.game.win.call(this);
                    break;
                case !this.grid.cellsAvailable() :
                    this.api.game.over.call(this);
                    break;
                default :
                    this.api.game.update.call(this, key, route);
                    break;
            }

            this.controls.position = [];
        }
    },
    modal: {
        display: function(action) {
            this.render.displayModal(action);
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
        penalty: function() {
            var self = this;

            // number of unique steps in the last four
            var unique = this.user.steps.filter(function(val, i, arr) { 
                return arr.indexOf(val) === i;
            }).length;

            if (unique === this.circle) {
                var count = 0;
                this.user.steps.reduce(function (prev, next, i) {
                    if (prev > -1) {
                        count += ( next === 0 && prev === self.circle - 1 ) || ( prev === 0 && next === self.circle - 1 ) ? 1 : Math.abs(next - prev);
                    }
                    return next;
                }, -1);

                // add penalty point for a pattern of actions
                if (count === this.circle - 1) {
                    this.user.penalty += 1;

                    this.user.steps = [];
                }
            }
        },
        step: function() {
            var cell, colour;

            for (var i = 0; i < ( this.config.count + Math.floor(this.user.penalty/10) ); i++) {
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

            this.user.penalty = 0;
            this.user.steps = [];

            this.grid.clear();
            this.render.clear();

            this.api.game.run.call(this);
        },
        win: function() {
            this.render.gameWin();
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
