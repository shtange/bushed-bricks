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

var Colour = function () {
    this.list = ["#FFE082", "#FF8A65", "#AED581", "#81D4FA", "#A1887F"]; // yellow, red, green, blue, brown
    this.weight = [0.23, 0.23, 0.23, 0.23, 0.08];
}

Colour.prototype.random = function () {
    var index = Math.floor(Math.random() * this.list.length);

    return this.list[index];
}

Colour.prototype.randomByWeight = function () {
    var data = this.weight.reduce(function (prev, curr, i) {
        return prev.sum < prev.rand ? { sum: prev.sum + curr, index: i, rand: prev.rand } : prev;
    }, { sum: 0, index: -1, rand: Math.random() });

    return this.list[data.index];
}
