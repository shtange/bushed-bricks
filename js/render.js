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
        page    : document.querySelector('#page'),
        game    : document.querySelector('#game'),
        score   : document.querySelector('#score'),
        step    : document.querySelector('#step'),
        message : document.querySelector('#message'),
        modal   : document.querySelector('#modal'),
    };

    this.init();
}

Render.prototype.init = function () {
    this.DOM.page.setAttribute('data-size', this.config.size);
    this.DOM.table = document.createElement("table");
    this.DOM.game.appendChild(this.DOM.table);

    this.setMessage([
        { tag: "h4", caption: "Rules" },
        { tag: "p",  caption: "Combine tiles of same color. Once tile has reached <b>x" + this.config.combo + "</b> or above, it can be placed on appropriate color line. You'll get game points for that" },
        { tag: "p",  caption: "You need to hold <b>" + this.config.victory.steps + "</b> steps or earn <b>" + this.config.victory.points.toLocaleString('en-US') + "</b> points to win" },
        { tag: "h4", caption: "Controls" },
        { tag: "p",  caption: "Navigation keys for desktop" },
        { tag: "p",  caption: "Swipe for tablet/mobile" },
    ], this.DOM.modal);
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
                { tag: "data-status", value: cell.combo >= self.config.combo ? 1 : 0 },
            ].map(function(attr){
                return '' + attr.tag + '="' + attr.value + '"';
            }).join(' ');
            return td + '<td ' + cell.attr + '><div>' + ( cell.combo >= self.config.combo ? cell.combo : '' ) + '</div></td>';
        }, tr + '<tr>') + '</tr>';
    }, '');

    this.DOM.score.innerHTML = gain.points > 0 && !!gain.colour ? score + '<i style="border-color: ' + gain.colour + ';">' + gain.points + '</i>' : score;
    this.DOM.step.innerHTML = step || 1;
}

Render.prototype.clear = function () {
    this.DOM.message.innerHTML = "";
    
    this.hideMessage();
}

Render.prototype.gameOver = function() {
    this.setMessage([
        { tag: "h3", caption: "Game Over" }
    ], this.DOM.message);

    this.showMessage();
}

Render.prototype.gameWin = function() {
    this.setMessage([
        { tag: "h3", caption: "You\'ve Won!" }
    ], this.DOM.message);

    this.showMessage();
}

Render.prototype.setMessage = function(data, target) {
    var message = document.createElement('div');

    data.forEach(function(val, i) {
        var elem = document.createElement(val.tag);
        elem.innerHTML = val.caption;
        message.appendChild(elem);
    });

    target.appendChild(message);
};

Render.prototype.showMessage = function() {
    this.DOM.table.style.opacity = "0.2";
    this.DOM.message.style.display = "block";
}

Render.prototype.hideMessage = function() {
    this.DOM.table.style.opacity = "1";
    this.DOM.message.style.display = "none";
}

Render.prototype.displayModal = function(action) {
    this.DOM.modal.className = action || "hide";
}
