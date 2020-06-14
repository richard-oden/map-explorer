const mapContainer = document.getElementById('map');
const root = document.documentElement;
let mapArr = [];
let numRowsAndColumns = 21;
const terrain = ['plains', 'forest', 'desert', 'mountain', 'water'];
let player;
let adjVectors = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1] ];

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
const actionBtn = document.getElementById("action-button");

const actionPromptModal = document.getElementById("action-prompt-modal");
const closeActionPrompt = document.getElementById("close-action-prompt");
const searchBtn = document.getElementById("search");
const searchDrawer = document.querySelectorAll(".btn-drawer")[0];
const searchBack = document.querySelectorAll(".back-btn")[0];
const searchPreview = document.querySelectorAll(".preview")[0];
const attackBtn = document.getElementById("attack");
const attackDrawer = document.querySelectorAll(".btn-drawer")[1];
const attackBack = document.querySelectorAll(".back-btn")[1];
const attackPreview = document.querySelectorAll(".preview")[1];
const sleepBtn = document.getElementById("sleep");
const sleepDrawer = document.querySelectorAll(".btn-drawer")[2];
const sleepBack = document.querySelectorAll(".back-btn")[2];

function getRandArrItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function nthWord(string, n) {
    return string.split(' ')[n-1];
}

function numWords(string) {
    return string.split(' ').length;
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

function addEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

// Check if given vector is within the map's boundaries:
function inBounds(arr2d, x, y) {
    if ( (x >= 0 && y >= 0) && (x <= arr2d.length-1 && y <= arr2d[x].length-1) ) return true;
}

// Create random 2D array to hold terrain values:
function createArray(length) {
    for (let x = 0; x < length; x++) {
        mapArr[x] = []
        for (let y = 0; y < length; y++) {
            mapArr[x][y] = getRandArrItem(terrain);
        }
    }
}

// Make some vectors of array equal to adjacent vectors to create larger chunks of terrain:
function createChunks() {
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr.length; y++) {
            // Create array of all adjacent terrain in bounds:
            let adjTerrain = [];
            for (let v = 0; v < 8; v++) {
                xo = x + adjVectors[v][0];
                yo = y + adjVectors[v][1];
                if (inBounds(mapArr, xo, yo)) adjTerrain.push(mapArr[xo][yo]);
            }
            // Randomly select adjacent terrain to copy:
            mapArr[x][y] = getRandArrItem(adjTerrain);
        }
    }
}

// Add entities to vectors based on terrain if they succeed 4% chance:
function createEntities(vector) {
    if (vector === "plains" && chance(4)) {
        vector += " snake";
    } else if (vector === "forest" && chance(4)) {
        vector += " bear";
    } else if (vector === "desert" && chance(4)) {
        vector += " scorpion";
    } else if (vector === "mountain" && chance(4)) {

    } else if (vector === "water" && chance(4)) {
        vector += " shark";
    }
    return vector;
}

function populateMap() {
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr.length; y++) {
            mapArr[x][y] = createEntities(mapArr[x][y]);
        }
    }
}

function drawMap() {
    let html = '';
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr[x].length; y++) {
            // Apply class to element to indicate terrain:
            html += `<div class="${mapArr[x][y]}">`;
                // Draw entities (second word of each mapArr item):
                entity = nthWord(mapArr[x][y], 2);
                // Add player image if center of map:
                if (isCenter(mapArr, x, y)) {
                    html += `<img class="player" src="img/player.png" alt="player">`;
                // Add entity image if contains an entity (second word):
                } else if (entity !== undefined) {
                    html += `<img class="${entity}" src="img/${entity}.png" alt="${entity}">`;
                }
            html += `</div>`;
        }
    }
    print(html);
}

// Create new edge of map:
function drawHorizon(previousHorizon) {
    let newHorizon = [];
    previousHorizon.forEach(item => {
        index = previousHorizon.indexOf(item);
        // Copy terrain (first word) from previous horizon's item or adjacent item if in bounds and succeeds percentage chance:
        if (index === 0) {
            if (chance(75)) {
                newHorizon.push(nthWord(chance(50) ? previousHorizon[index] : previousHorizon[index+1], 1));
            } else {
                // Otherwise generate random terrain:
                newHorizon.push(getRandArrItem(terrain));
            }
        } else if (index === previousHorizon.length-1) {
            if (chance(75)) {
                newHorizon.push(nthWord(chance(50) ? previousHorizon[index] : previousHorizon[index-1], 1));
            } else {
                newHorizon.push(getRandArrItem(terrain));
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
                newHorizon.push(getRandArrItem(terrain));
            }
        }
    });

    // Add entities to new horizon:
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

// Deplete player meters depending on terrain:
function applyTerrainEffects() {
    player = document.querySelector("img.player");
    switch (player.parentElement.className) {
        case "plains":
            changePlayerMeters(0, -1, -2);
        break;
        case "forest":
            changePlayerMeters(0, -1, -2);
        break;
        case "desert":
            changePlayerMeters(0, -1, -5);
        break;
        case "mountain":
            changePlayerMeters(0, -2, -2);
        break;
        case "water":
            changePlayerMeters(0, -2, -1);
        break;
    }
}


// Move entities randomly:
function moveEntities() {
    // Iterate through all vectors in map array:
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr[x].length; y++) {
            // Check if vector has an entity and succeeds 50% chance:
            if (numWords(mapArr[x][y]) === 2 && chance(50)) {
                // Create list of possible adjacent vectors to move entity:
                let possibleDestinations = [];
                for (let v = 0; v < 8; v++) {
                    xo = x + adjVectors[v][0];
                    yo = y + adjVectors[v][1];
                    // Check if adjacent vectors are in bounds and have same terrain as current vector:
                    if (inBounds(mapArr, xo, yo) && mapArr[xo][yo] === nthWord(mapArr[x][y], 1)) {
                            possibleDestinations.push(adjVectors[v]);
                        }
                    }
                // If no possible destinations, do nothing:
                if (possibleDestinations.length !== 0) {
                    let destination;
                    if (possibleDestinations.length === 1) {
                        destination = possibleDestinations[0];
                    } else {
                        destination = getRandArrItem(possibleDestinations);
                    }
                    xo = x + destination[0];
                    yo = y + destination[1];
                    // Give destination same entity as current vector:
                    mapArr[xo][yo] += ' ' + nthWord(mapArr[x][y], 2);
                    // Remove entity from current vector:
                    mapArr[x][y] = nthWord(mapArr[x][y], 1);
                }
            }
        }
    }
}

// Increment time whenever player moves. Each move is considered 30 mins:
function addTime() {
    move++;
    // Set minutes to 30 on odd moves:
    if (move%2 != 0) {
        min.innerHTML = "30";
    } else {
        // On even moves, add one hour:
        newHr = parseInt(hr.innerHTML) + 1;
        // Change am to pm and vice versa if 12th hour:
        if (newHr === 12) {
            amPM.innerHTML = (amPM.innerHTML === "am" ? "pm" : "am");
            hr.innerHTML = newHr;
        // Reset hours to 1 after 12:
        } else if (newHr > 12) {
            hr.innerHTML = 1;
        } else {
            hr.innerHTML = newHr;
        }
        min.innerHTML = "00";

        // If 48 moves (24 hours) have occured, add one day:
        if (move%48 == 0) {
            day.innerHTML = parseInt(day.innerHTML) + 1;
        }
    }
}

function toggleActionPrompt() {
    if (actionPromptModal.style.display === "block") {
        actionPromptModal.style.display = "";
    } else {
        actionPromptModal.style.display = "block";
        printPlayerAdjVectors(searchPreview);
        printPlayerAdjVectors(attackPreview);
    }
}

function toggleDrawer(drawer) {
    drawer.style.transform = (drawer.style.transform === "translateX(0px)" ? "translateX(100%)" : "translateX(0px)");
}

function printPlayerAdjVectors(element) {
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr[x].length; y++) {
            if (isCenter(mapArr, x, y)) {
                html = "";
                html += `<div class="${nthWord(mapArr[x][y], 1)} player"><img class="player" src="img/player.png" alt="player"></div>`
                for (let v = 0; v < 8; v++) {
                    xo = x + adjVectors[v][0];
                    yo = y + adjVectors[v][1];
                    let terrain = nthWord(mapArr[xo][yo], 1);
                    let entity = nthWord(mapArr[xo][yo], 2);
                    html += `<div class="${terrain}">`
                    html += (entity !== undefined ? `<img class="${entity}" src="img/${entity}.png" alt="${entity}"></div>` : `</div>`); 
                }
            }
        }
    }
    element.innerHTML = html;
}

function movePlayer(direction) {
    // Don't move player if action prompt is displayed:
    if (actionPromptModal.style.display === "") {
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
        moveEntities();
        drawMap();
        applyTerrainEffects();
        addTime();
    }
}

root.style.setProperty('--num-rows-and-columns', `repeat(${numRowsAndColumns}, 1fr)`);

createArray(numRowsAndColumns);
createChunks();
populateMap();
drawMap();

// Move player using WASD, arrow keys, or dpad unless action prompt is open:
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

// Toggle action prompt if space is pressed:
window.addEventListener("keydown", function(event) {if (event.code === "Space") toggleActionPrompt()});
actionBtn.addEventListener("click", function() {toggleActionPrompt()});

// Close action prompt if exit button is pressed:
closeActionPrompt.addEventListener("click", function() {actionPromptModal.style.display = ""});

// Open drawers when action prompt buttons are pressed:
searchBtn.addEventListener("click", function() {toggleDrawer(searchDrawer)});
searchBack.addEventListener("click", function() {toggleDrawer(searchDrawer)});
attackBtn.addEventListener("click", function() {toggleDrawer(attackDrawer)});
attackBack.addEventListener("click", function() {toggleDrawer(attackDrawer)});
sleepBtn.addEventListener("click", function() {toggleDrawer(sleepDrawer)});
sleepBack.addEventListener("click", function() {toggleDrawer(sleepDrawer)});