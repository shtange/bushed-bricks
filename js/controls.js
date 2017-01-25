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

function ControlsManager(gameAPI, callback) {
    this.gameAPI = gameAPI;
    this.callback = callback;

    this.position = [];
    this.keyboardMap = { 38: 0, 39: 1, 40: 2, 37: 3 };

    this.listen();
}

ControlsManager.prototype.API = function (action, method, key) {
    if (!this.gameAPI.hasOwnProperty(action) || !this.gameAPI[action].hasOwnProperty(method)) {
        return false;
    }
    (this.gameAPI[action][method]).call(this.callback, key || 0);
}

ControlsManager.prototype.listen = function () {
    var self = this;

    // listen keyboard
    document.addEventListener("keydown", function (event) {
        var modifiers = event.altKey && event.ctrlKey && event.metaKey && event.shiftKey;

        if (!modifiers && !!self.keyboardMap.hasOwnProperty(event.which)) {
            event.preventDefault();
            self.API("controls", "move", self.keyboardMap[event.which]);
        }
    });

    // listen touching
    ["touchstart", "touchmove"].map(function(e, i) {
        document.addEventListener(e, function(event) {
            self.position[i] = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        }, false);
    });

    document.addEventListener("touchend", function(event) {
        if (self.position.length < 2) return false;

        var key = self.position.reduce(function (start, end) {
            var offset = { x: end.x - start.x, y: end.y - start.y };

            if (Math.max(Math.abs(offset.x), Math.abs(offset.y)) < 40) {
                return false;
            }

            return Math.abs(offset.x) > Math.abs(offset.y) ? ( offset.x < 0 ? 3 : 1 ) : ( offset.y < 0 ? 0 : 2 );
        });

        if (key !== false) {
            self.API("controls", "move", key);
        }
    });

    // Listen restart button
    document.querySelector('#restart').addEventListener('click', function(event) {
        event.preventDefault();
        self.API("game", "reload");
        event.stopPropagation();
    }, false);

    // Listen modal buttons
    document.querySelectorAll('.modal-action').forEach(function(elem, i) {
        elem.addEventListener('click', function(event) {
            event.preventDefault();
            self.API("modal", "display", this.getAttribute("data-action"));
            event.stopPropagation();
        }, false);
    });
}
