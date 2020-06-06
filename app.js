const mapContainer = document.getElementById('map');
const root = document.documentElement;
let mapArr = [];
let numRowsAndColumns = 21;
const terrain = ['plains', 'forest', 'desert', 'mountain', 'water'];
let player;
let adjVectors = [ [0, -1], [0, 1], [-1, 0], [-1, -1], [-1, 1], [1, 0], [1, -1], [1, 1] ];
let move = 12;
let day = document.getElementById("day");
let hr = document.getElementById("hr");
let min = document.getElementById("min");
let amPM = document.getElementById("am-pm");
let playerEnergy = document.getElementById("player-energy");
let playerHunger = document.getElementById("player-hunger");
let playerThirst = document.getElementById("player-thirst");

const dPadUp = document.getElementById("dpad-up");
const dPadLeft = document.getElementById("dpad-left");
const dPadRight = document.getElementById("dpad-right");
const dPadDown = document.getElementById("dpad-down");

function getRandTerrain() {
    return terrain[Math.floor(Math.random() * terrain.length)];
}

function nthWord(string, n) {
    return string.split(' ')[n-1];
}

function isCenter(arr2d, x, y) {
    if (x === Math.floor(arr2d.length / 2) && y === Math.floor(arr2d.length / 2)) return true;
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

function createArray(length) {
    for (let x = 0; x < length; x++) {
        mapArr[x] = []
        for (let y = 0; y < length; y++) {
            mapArr[x][y] = getRandTerrain();
        }
    }
}

function createChunks() {
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
}

function createEntities(cell) {
    if (cell === "plains" && chance(4)) {
        cell += " snake";
    } else if (cell === "forest" && chance(4)) {
        cell += " bear";
    } else if (cell === "desert" && chance(4)) {
        cell += " scorpion";
    } else if (cell === "mountain" && chance(4)) {

    } else if (cell === "water" && chance(4)) {
        cell += " shark";
    }
    return cell;
}

function populateMap() {
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr.length; y++) {
            mapArr[x][y] = createEntities(mapArr[x][y]);
        }
    }
}

function drawMap() {
    // Draw terrain:
    let html = '';
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr[x].length; y++) {
            html += `<div class="${mapArr[x][y]}">`;
                entity = nthWord(mapArr[x][y], 2);
                if (entity !== undefined) {
                   html += `<img class="${entity}" src="img/${entity}.png" alt="${entity}">`;
                } else if (isCenter(mapArr, x, y)) {
                   html += `<img class="player" src="img/player.png" alt="player">`;
                }
            html += `</div>`;
        }
    }
    print(html);
}

function drawHorizon(previousHorizon) {
    let newHorizon = [];
    previousHorizon.forEach(item => {
        index = previousHorizon.indexOf(item);
        if (index === 0) {
            if (chance(75)) {
                newHorizon.push(nthWord(chance(50) ? previousHorizon[index] : previousHorizon[index+1], 1));
            } else {
                newHorizon.push(getRandTerrain());
            }
        } else if (index === previousHorizon.length-1) {
            if (chance(75)) {
                newHorizon.push(nthWord(chance(50) ? previousHorizon[index] : previousHorizon[index-1], 1));
            } else {
                newHorizon.push(getRandTerrain());
            }
        } else {
            if (chance(75)) {
                if (chance(50)) {
                    newHorizon.push(nthWord(previousHorizon[index+1], 1));
                } else if (chance(50)) {
                    newHorizon.push(nthWord(previousHorizon[index-1], 1));
                } else {
                    newHorizon.push(nthWord(previousHorizon[index], 1));
                }
            } else {
                newHorizon.push(getRandTerrain());
            }
        }
    });
     for (let i = 0; i < newHorizon.length; i++) {
         newHorizon[i] = createEntities(newHorizon[i]);
     }
    return newHorizon;
}

function changePlayerMeters(energy, hunger, thirst) {
    playerEnergy.innerHTML = parseInt(playerEnergy.innerHTML) + energy;
    playerHunger.innerHTML = parseInt(playerHunger.innerHTML) + hunger;
    playerThirst.innerHTML = parseInt(playerThirst.innerHTML) + thirst;
}

function applyTerrainEffects() {
    player = document.querySelector("img.player");
    switch (player.parentElement.className) {
        case "plains":
            changePlayerMeters(-1, -2, -3);
        break;
        case "forest":
            changePlayerMeters(-2, -2, -3);
        break;
        case "desert":
            changePlayerMeters(-1, -2, -5);
        break;
        case "mountain":
            changePlayerMeters(-3, -2, -3);
        break;
        case "water":
            changePlayerMeters(-5, -2, -1);
        break;
    }
}

function addTime() {
    move++;
    if (move%2 != 0) {
        min.innerHTML = "30";
    } else {
        newHr = parseInt(hr.innerHTML) + 1;
        if (newHr === 12) {
            amPM.innerHTML = (amPM.innerHTML === "am" ? "pm" : "am");
            hr.innerHTML = newHr;
        } else if (newHr > 12) {
            hr.innerHTML = 1;
        } else {
            hr.innerHTML = newHr;
        }

        min.innerHTML = "00";

        if (move%48 == 0) {
            day.innerHTML = parseInt(day.innerHTML) + 1;
        }
    }
}

function movePlayer(direction) {
    switch (direction) {
        case "up":
            for (let x = mapArr.length-1; x > 0; x--) {
                mapArr[x] = mapArr[x-1];
            }
            mapArr[0] = drawHorizon(mapArr[0]);
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

            case "down":
                for (let x = 0; x < mapArr.length-1; x++) {
                    mapArr[x] = mapArr[x+1];
            }
            mapArr[mapArr.length-1] = drawHorizon(mapArr[mapArr.length-1]);
            break;
    }
    drawMap();
    applyTerrainEffects();
    addTime();
}

root.style.setProperty('--num-rows-and-columns', `repeat(${numRowsAndColumns}, 1fr)`);

createArray(numRowsAndColumns);
createChunks();
populateMap();
drawMap();


// Capture input and move player:
window.addEventListener("keydown", function(event) {
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }
    switch (event.code) {
        case "KeyW":
        case "ArrowUp":
            movePlayer("up");
            break;
        case "KeyA":
        case "ArrowLeft":
            movePlayer("left");
            break;
        case "KeyD":
        case "ArrowRight":
            movePlayer("right");
            break;
        case "KeyS":
        case "ArrowDown":
            movePlayer("down");
            break;
    }
});
dPadUp.addEventListener("click", function() {movePlayer("up")});
dPadLeft.addEventListener("click", function() {movePlayer("left")});
dPadRight.addEventListener("click", function() {movePlayer("right")});
dPadDown.addEventListener("click", function() {movePlayer("down")});