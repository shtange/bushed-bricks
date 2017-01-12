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

var Shelter = function () {
    this.list = ["#FFE082", "#AED581", "#81D4FA", "#FF8A65"];
}

Shelter.prototype.random = function () {
    var index = Math.floor(Math.random() * this.list.length);

    return this.list[index];
}
