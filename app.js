const mapContainer = document.getElementById('map');
const root = document.documentElement;
let mapArr = [];
const terrain = ['#B0ED38', '#41B30C', '#EED869', '#CFCCBC', '#66B2EF'];
let adjVectors = [ [0, -1], [0, 1], [-1, 0], [-1, -1], [-1, 1], [1, 0], [1, -1], [1, 1] ];
let turnCounter = document.querySelector('#turn-counter > span');
let turn = 1;
let initalizing = true;

function getRandTerrain() {
    return terrain[Math.floor(Math.random() * terrain.length)];
}

function getCenter(arr) {
    return Math.floor(arr.length / 2);
}

function chance(percent) {
    result = Math.floor(Math.random() * 100) + 1;
    if (result <= percent) return true;
}

function print(message) {
    mapContainer.innerHTML = message;
}

function inBounds(arr2d, x, y) {
    if ( (x > 0 && y > 0) && (x < arr2d.length-1 && y < arr2d[x].length-1) ) return true;
}

// function populateMap() {
//     // Populate map based on terrain:
//         // Plains
//         spawnEntity(2,  terrain[0], "snake");
//         // Forest
//         spawnEntity(2,  terrain[1], "bear");
//         // Desert
//         spawnEntity(2,  terrain[2], "scorpion");
//         // Mountain
        
//         // Water
//         spawnEntity(2,  terrain[4], "shark");
// }

function drawMap() {
    // Draw terrain:
    let html = '';
    for (let x = 0; x < mapArr.length; x++) {
        html += `<tr>`;
        for (let y = 0; y < mapArr[x].length; y++) {
            html += `<td style="background-color: ${mapArr[x][y]};"`;
            // Draw player character if td is in center of map:
            if (x === getCenter(mapArr) && y === getCenter(mapArr[x])) {
                html += ` id="player">`;
            // } else if (initalizing === true) {
            //     populateMap();
            } else {
                html += `>`;
            }
            html += `</td>`;
        }
        html += `</tr>`;
    }
    print(html);
}

function drawHorizon(previousHorizon) {
    let newHorizon = [];
    previousHorizon.forEach(function(item) {
        index = previousHorizon.indexOf(item);
        if (index === 0) {
            if (chance(75)) {
                newHorizon.push(chance(50) ? previousHorizon[index] : previousHorizon[index+1]);
            } else {
                newHorizon.push(getRandTerrain());
            }
        } else if (index === previousHorizon.length-1) {
            if (chance(75)) {
                newHorizon.push(chance(50) ? previousHorizon[index] : previousHorizon[index-1]);
            } else {
                newHorizon.push(getRandTerrain());
            }
        } else {
            if (chance(75)) {
                if (chance(50)) {
                    newHorizon.push(previousHorizon[index+1]);
                } else if (chance(50)) {
                    newHorizon.push(previousHorizon[index-1]);
                } else {
                    newHorizon.push(previousHorizon[index]);
                }
            } else {
                newHorizon.push(getRandTerrain());
            }
        }
    });
    console.log(newHorizon);
    return newHorizon;
}

function movePlayer(direction) {
    switch (direction) {
        case "up":
            for (let x = mapArr.length-1; x > 0; x--) {
                mapArr[x] = mapArr[x-1];
            }
            mapArr[0] = drawHorizon(mapArr[0]);
            break;

        case "down":
            for (let x = 0; x < mapArr.length-1; x++) {
                mapArr[x] = mapArr[x+1];
            }
            mapArr[mapArr.length-1] = drawHorizon(mapArr[mapArr.length-1]);
            break;

        case "left":
            let oldHorizonLeft = [];
            for (let x = 0; x < mapArr.length; x++) {
                oldHorizonLeft.push(mapArr[x][0]);
            }
            let newHorizonLeft = drawHorizon(oldHorizonLeft);
            for (let x = 0; x < mapArr.length; x++) {
                mapArr[x].unshift(newHorizonLeft[x]);
                mapArr[x].pop();
            }
            break;

        case "right":
            let oldHorizonRight = [];
            for (let x = 0; x < mapArr.length; x++) {
                oldHorizonRight.push(mapArr[x][mapArr.length-1]);
            }
            let newHorizonRight = drawHorizon(oldHorizonRight);
            for (let x = 0; x < mapArr.length; x++) {
                mapArr[x].push(newHorizonRight[x]);
                mapArr[x].shift();
            }
            break;
    }
    drawMap();
}

// Create 2D array of terrain:
for (let x = 0; x < 21; x++) {
    mapArr[x] = []
    for (let y = 0; y < 21; y++) {
        mapArr[x][y] = getRandTerrain();
    }
}

// Create larger chunks of terrain:
for (let x = 0; x < mapArr.length; x++) {
    for (let y = 0; y < mapArr.length; y++) {
        let adjTerrain = [];
        for (let v = 0; v < 8; v++) {
            xo = x + adjVectors[v][0];
            yo = y + adjVectors[v][1];
            if (inBounds(mapArr, xo, yo)) adjTerrain.push(mapArr[xo][yo]);
        }
        mapArr[x][y] = adjTerrain[Math.floor(Math.random() * adjTerrain.length)];
    }
}

// Create CSS variable to assign cell size relative to number of rows/columns:
root.style.setProperty('--cell-height', mapContainer.offsetHeight / mapArr.length + 'px');
root.style.setProperty('--cell-width', mapContainer.offsetWidth / mapArr[0].length + 'px');

drawMap();

let player = document.getElementById('player');
let snakes = document.getElementsByClassName('snake');
let bears = document.getElementsByClassName('bear');
let scorpions = document.getElementsByClassName('scorpion');
let sharks = document.getElementsByClassName('shark');

// Capture input and move player:
window.addEventListener("keydown", function(event) {
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }
    switch (event.code) {
        case "KeyS":
        case "ArrowDown":
            console.log("Moved down");
            movePlayer("down");
            break;
        case "KeyW":
        case "ArrowUp":
            console.log("Moved up");
            movePlayer("up");
            break;
        case "KeyA":
        case "ArrowLeft":
            console.log("Moved left");
            movePlayer("left");
            break;
        case "KeyD":
        case "ArrowRight":
            console.log("Moved right");
            movePlayer("right");
            break;
    }
    turn++;
    turnCounter.innerHTML = turn;
});