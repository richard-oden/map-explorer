# Map Explorer
This project was made to fulfill the requirements of Code Louisville's May 2020 front-end web development class. It is an experimental survival exploration game that represents my first attempt at making a game.

## Gameplay
The goal of the game is to survive as long as possible. You will need to monitor your energy, hunger, and thirst. This will require you to search for food and water, sleep, and avoid animal attacks. The game world is randomly generated, and new terrain is generated as you move in each direction. When you return to a previous area, it will be generated anew, so be sure you are completely finished before leaving.

The game can be interacted with using the keyboard and on-screen controls. To move the player, use WASD, the arrow keys, or the on-screen directional pad. The space bar and on-screen 'A' button toggle the action prompt menu. From there you can carry out actions by clicking or tapping the menu buttons.

## Main features
The map's data is represented by a two-dimensional array, `mapArr` which is displayed as a CSS grid, `mapContainer`. Whenever changes to the map are made by the player moving or doing an action, the array is modified and the map is redrawn. The size of the map is determined by the CSS variable `--num-rows-and-columns`. This provides a way for the player to eventually be able to choose the map size. When the player moves in a direction, `mapArr`'s values are shifted in the opposite direction, and new terrain is generated. 

Animals (called entities in the code) and terrain are represented as objects (`entityValues` and `terrainValues`) and displayed as images. Each entity has unique loot, attack strength, habitat, and chance of winning battle. Each terrain has a different effect on the player's hunger and thirst, and also provides unique loot. When the player moves, entities also have a chance to move. This is done by creating an array of adjacent map vectors and randomly selecting one with the correct terrain.

In the search and attack sections of the action menu, a copy of the player and the adjacent vectors is taken from `mapArr` and redrawn using a similar method as before in `searchPreview` and `attackPreview`. If these copies are interacted with, the function `updateMap` is used to edit `mapArr` and redraw `mapContainer`.

## Requirements met
- Flexbox and CSS Grid are used throughout the site. Using grid and media queries, the site switches to a two-column layout depending on screen width. Additionally, the map is displayed entirely in grid.
- Several JavaScript functions, math operations, and arrays are used during gameplay.
- Additionally, the site makes use of CSS variables and JavaScript objects.
