# Map Explorer
This project was made to fulfill the requirements of Code Louisville's May 2020 front-end web development class. It is an experimental survival exploration game that represents my first attempt at making a game.

## Gameplay
The goal of the game is to survive as long as possible. You will need to monitor your energy, hunger, and thirst. This will require you to search for food and water, sleep, and avoid animal attacks. The game world is randomly generated, and new terrain is generated as you move in each direction. When you return to a previous area, it will be generated anew, so be sure you are completely finished before leaving.

The game can be interacted with using the keyboard and on-screen controls. To move the player, use WASD, the arrow keys, or the on-screen directional pad. The space bar and on-screen 'A' button toggle the action prompt menu. From there you can carry out actions by clicking or tapping the menu buttons.

## Main features
The map's data is represented by a two-dimensional array, `mapArr`, which is displayed as a CSS grid, `mapContainer`. The values in `mapArr` are first selected at random, then larger areas of terrain are made using the `createChunks` function. This is done by giving each item in the array a chance to copy an adjacent vector. Then `createEntities` and `populateMap` are used to iterate through the array and add animals (called entities in the code) to some of its items. The map is finally displayed using `drawMap`, which creates a long HTML string based on `mapArr`'s values and assigns it to `mapContainer`'s inner HTML. The size of the map is determined by the CSS variable `--num-rows-and-columns`. This provides a way for the player to eventually be able to choose the map size (not yet implemented).

Whenever changes to the map are made by the player moving or doing an action, the array is modified and the map is redrawn. When the player moves in a direction, `mapArr`'s values are shifted in the opposite direction using `movePlayer`, and new terrain is generated using `drawHorizon`. 

The data for entities and terrain are stored in objects (`entityValues` and `terrainValues`). Entities are displayed as images, and terrain is indicated by background color. Each entity has unique loot, attack strength, habitat, and chance of winning battle. Each terrain has a different effect on the player's hunger and thirst, and also provides unique loot when searched. When time passes, entities have a chance to move. This is done by creating an array of adjacent map vectors for each entity and randomly selecting one with a suitable terrain (`moveEntities`). They may also attack if they are adjacent to the player (`checkForAttacks`).

In the search and attack sections of the action menu, a copy of the player and the adjacent vectors is taken from `mapArr` and redrawn in `searchPreview` and `attackPreview` using a similar method as before. If these copies are interacted with, the function `updateMap` is used to edit `mapArr` and redraw `mapContainer`.

## Requirements met
- Flexbox and CSS Grid are used throughout the site. Using grid and media queries, the site switches to a two-column layout depending on screen width. Additionally, the map is displayed entirely in grid.
- Several JavaScript functions, math operations, and arrays are used during gameplay.
- A mobile-friendly expandable footer can by found by clicking/tapping the button in the bottom-left corner.
- An `nth-child` selector is used.
- Additionally, the site makes use of CSS variables and JavaScript objects.
