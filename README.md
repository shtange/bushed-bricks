# Bushed Bricks
Simple and fun game on JavaScript. [Play it here!](https://shtange.github.io/bushed-bricks/)

![alt text](https://raw.githubusercontent.com/shtange/bushed-bricks/master/screenshot.jpg "Bushed Bricks screenshot")

## Rules
Combine the blocks of the same color. Once the block has reached a certain level, it can be placed on the appropriate color line. You'll get game points for that.

## Controls
Use navigation keys (← ↑↓→) for desktop or swipe for tablet/mobile.

## Options
Options can be passed as url query parameters.


| Parameter | Type |	Default | Valid values |	Description |
| ---- |:----:|:-------:|:-------:|:----------- |
| size | number | 7 | 6, 7, 8, 9, 10 | size of the game field, number of rows and columns |
| combo | number | 4 | 2, 3, 4, 5 | required level when brick can be placed on the appropriate line color |
| count | number | 2 | 2, 3, 4 | number of blocks to be added per step in the game |

For example: https://shtange.github.io/bushed-bricks/?size=8&count=4&combo=3

## License
Released under the [MIT License](https://raw.githubusercontent.com/shtange/bushed-bricks/master/LICENSE)
