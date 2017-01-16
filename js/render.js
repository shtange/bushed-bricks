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

var Render = function (config) {
    this.config = config;

    this.DOM = {
        page: document.querySelector('#page'),
        game: document.querySelector('#game'),
        score: document.querySelector('#score'),
        step: document.querySelector('#step'),
    };

    this.init();
}

Render.prototype.init = function () {
    this.DOM.page.setAttribute('data-size', this.config.size);

    this.DOM.table = document.createElement("table");
    this.DOM.table.setAttribute("cellspacing", "11");
    this.DOM.table.setAttribute("cellpadding", "0");

    this.DOM.game.appendChild(this.DOM.table);
}

Render.prototype.redraw = function (grid, score, gain, step) {
    var self = this;

    this.DOM.table.innerHTML = [].reduce.call(grid, function (tr, row) {
        return [].reduce.call(row, function (td, cell) {
            if (!cell) return td + '<td><div></div></td>';
            cell.attr = [
                { tag: "bgcolor",     value: cell.colour },
                { tag: "data-combo",  value: cell.combo },
                { tag: "data-digit",  value: (''+cell.combo).length + '' + Math.floor(cell.combo/10) },
                { tag: "data-status", value: cell.combo >= self.config.maxCombo ? 1 : 0 },
            ].map(function(attr){
                return '' + attr.tag + '="' + attr.value + '"';
            }).join(' ');
            return td + '<td ' + cell.attr + '><div>' + ( cell.combo >= self.config.maxCombo ? cell.combo : '' ) + '</div></td>';
        }, tr + '<tr>') + '</tr>';
    }, '');

    this.DOM.score.innerHTML = gain.points > 0 && !!gain.colour ? score + '<i style="border-color: ' + gain.colour + ';">' + gain.points + '</i>' : score;
    this.DOM.step.innerHTML = step || 1;
}

Render.prototype.gameOver = function () {
    this.DOM.page.setAttribute('data-over', 1);
}

Render.prototype.clear = function () {
    this.DOM.page.setAttribute('data-over', 0);
}
