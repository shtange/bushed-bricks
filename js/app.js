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

String.prototype.parseQueries = function (params) {
    return this.length > 0 ? [0].map.call(this.replace(/(^\?)/,'').split("&"), function(query) {
        return query = query.split("="), this[query[0]] = isNaN(query[1]) ? query[1] : +query[1], this;
    }, params || {})[0] : params || {};
}

document.addEventListener("DOMContentLoaded", function() {
    var params = (document.location.search || "").parseQueries({ size: window.innerWidth < 640 ? 6 : 7 });

    new Gear(params);
});
