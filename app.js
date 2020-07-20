// Variables---------------------------------------------------------------------------------------------

// Important/misc:
const root = document.documentElement;
let numRowsAndColumns = 21;
const mapContainer = document.getElementById('map');
let mapArr = [];
const terrain = ['plains', 'forest', 'desert', 'mountain', 'water'];
let adjVectors = [ [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1] ];
// These are used to alternate images as part of drawMap:
let centerDiv;
let alternate;
let alternating = false;

// Game statistics:
let move = 12;
let day = document.getElementById("day");
let hr = document.getElementById("hr");
let min = document.getElementById("min");
let amPM = document.getElementById("am-pm");
let playerMeters = document.getElementsByClassName("meter-value");
let playerAlive = true;
let timeAwake = 0;
const terrainValues = {
    plains: {
        hunger: -0.5,
        thirst: -1,
        loot: [
            {
                name: "edible berries",
                terrain: "plains",
                energy: 0,
                hunger: 2,
                thirst: 1,
                minNum: 5,
                maxNum: 20,
                rarity: 33,
                img: "berries"
            },
            {
                name: "poisonous berries",
                terrain: "plains",
                energy: 0,
                hunger: -2,
                thirst: -1,
                energy: -2,
                minNum: 5,
                maxNum: 20,
                rarity: 10,
                img: "berries"
            },
            {
                name: "wild carrots",
                terrain: "plains",
                energy: 0,
                hunger: 4,
                thirst: 1,
                minNum: 3,
                maxNum: 10,
                rarity: 20,
                img: "carrots"
            },
            {
                name: "rabbits",
                terrain: "plains",
                energy: 0,
                hunger: 10,
                thirst: 1,
                minNum: 1,
                maxNum: 2,
                rarity: 5,
                img: "hunger"
            },
        ]
    },
    forest: {
        hunger: -0.5,
        thirst: -1,
        loot: [
            {
                name: "edible mushrooms",
                terrain: "forest",
                energy: 0,
                hunger: 2,
                thirst: 1,
                minNum: 1,
                maxNum: 10,
                rarity: 20,
                img: "mushrooms"
            },
            {
                name: "squirrels",
                terrain: "forest",
                energy: 0,
                hunger: 10,
                thirst: 1,
                minNum: 1,
                maxNum: 3,
                rarity: 5,
                img: "hunger"
            },
            {
                name: "poisonous mushrooms",
                terrain: "forest",
                energy: 0,
                hunger: 2,
                thirst: -1,
                energy: -2,
                minNum: 1,
                maxNum: 10,
                rarity: 20,
                img: "mushrooms"
            },
            {
                name: "wild greens",
                terrain: "forest",
                energy: 0,
                hunger: 1,
                thirst: 1,
                minNum: 10,
                maxNum: 30,
                rarity: 40,
                img: "greens"
            },
            {
                name: "medicinal plants",
                terrain: "forest",
                energy: 5,
                hunger: 1,
                thirst: 1,
                minNum: 3,
                maxNum: 8,
                rarity: 10,
                img: "aloe"
            }
        ]
    },
    desert: {
        hunger: -0.5,
        thirst: -3,
        loot: [
            {
                name: "cactus fruit",
                terrain: "desert",
                energy: 0,
                hunger: 2,
                thirst: 2,
                minNum: 3,
                maxNum: 15,
                rarity: 25,
                img: "cactus-fruit"
            },
            {
                name: "coconuts",
                terrain: "desert",
                energy: 0,
                hunger: 3,
                thirst: 5,
                minNum: 2,
                maxNum: 10,
                rarity: 20,
                img: "coconuts"
            }
        ]
    },
    mountain: {
        hunger: -1,
        thirst: -1,
        loot: [

        ]
    },
    water: {
        hunger: -1,
        thirst: -0.5,
        loot: [
            {
                name: "fish",
                terrain: "water",
                energy: 0,
                hunger: 10,
                thirst: 1,
                minNum: 1,
                maxNum: 5,
                rarity: 15,
                img: "fish"
            },
            {
                name: "seaweed",
                terrain: "water",
                energy: 0,
                hunger: 1,
                thirst: 1,
                minNum: 10,
                maxNum: 30,
                rarity: 60,
                img: "seaweed"
            },
            {
                name: "fresh water",
                terrain: "water",
                energy: 0,
                hunger: 0,
                thirst: 10,
                minNum: 1,
                maxNum: 5,
                rarity: 80,
                img: "thirst"
            },
            {
                name: "saltwater",
                terrain: "water",
                energy: 0,
                hunger: 0,
                thirst: -10,
                minNum: 1,
                maxNum: 5,
                rarity: 60,
                img: "thirst"
            }
        ]
    },
}
const entityValues = {
    scorpion: {
        damage: -25,
        aggroChance: 20,
        winChance: 90,
        loot: [{
            name: "scorpion meat",
            energy: 0,
            hunger: 5,
            thirst: 1,
            minNum: 1,
            maxNum: 2,
            rarity: 100,
            img: "hunger"
        }]
    },
    bear: {
        damage: -80,
        aggroChance: 60,
        winChance: 15,
        loot: [{
            name: "bear meat",
            energy: 0,
            hunger: 15,
            thirst: 1,
            minNum: 3,
            maxNum: 8,
            rarity: 100,
            img: "hunger"
        }]
    },
    snake: {
        damage: -50,
        aggroChance: 10,
        winChance: 65,
        loot: [{
            name: "snake meat",
            energy: 0,
            hunger: 8,
            thirst: 1,
            minNum: 1,
            maxNum: 3,
            rarity: 100,
            img: "hunger"
        }]
    },
    shark: {
        damage: -70,
        aggroChance: 90,
        winChance: 10,
        loot: [{
            name: "shark meat",
            energy: 0,
            hunger: 12,
            thirst: 1,
            minNum: 3,
            maxNum: 6,
            rarity: 100,
            img: "hunger"
        }]
    }
}

// Headings:
const mainHeading = document.getElementById("main-heading");
const subHeading = document.getElementById("sub-heading");
const hideHeadings = document.getElementById("hide-headings");

// Directional pad:
const dPadUp = document.getElementById("dpad-up");
const dPadLeft = document.getElementById("dpad-left");
const dPadRight = document.getElementById("dpad-right");
const dPadDown = document.getElementById("dpad-down");
const actionBtn = document.getElementById("action-button");

// Action prompt menu:
const actionPromptModal = document.getElementById("action-prompt-modal");
const closeActionPrompt = document.getElementById("close-action-prompt");
const actionPromptBox = document.getElementById("action-prompt-box");
    // Search:
    const searchBtn = document.getElementById("search");
    const searchPreviewDrawer = document.querySelectorAll(".preview-drawer")[0];
    const searchPreviewBack = document.querySelectorAll(".preview-back-btn")[0];
    const searchPreview = document.querySelectorAll(".preview")[0];
    const searchTargets = searchPreview.children;
    const searchLootDrawer = document.querySelectorAll(".loot-drawer")[0];
    const searchLootBack = document.querySelectorAll(".loot-back-btn")[0];
    const searchResults = document.querySelectorAll(".results")[0];
    // Attack:
    const attackBtn = document.getElementById("attack");
    const attackPreviewDrawer = document.querySelectorAll(".preview-drawer")[1];
    const attackPreviewBack = document.querySelectorAll(".preview-back-btn")[1];
    const attackPreview = document.querySelectorAll(".preview")[1];
    const attackTargets = attackPreview.children;
    const attackLootDrawer = document.querySelectorAll(".loot-drawer")[1];
    const attackLootBack = document.querySelectorAll(".loot-back-btn")[1];
    const attackResults = document.querySelectorAll(".results")[1];
    // Sleep:
    const sleepBtn = document.getElementById("sleep");
    const sleepDrawer = document.querySelectorAll(".preview-drawer")[2];
    const sleepBack = document.querySelectorAll(".preview-back-btn")[2];
    const sleepHr = document.getElementById("sleep-hr");
    const submitSleep = document.getElementById("submit-sleep");

// Map overlays:
const sleepTimer = document.getElementById("sleep-timer");
const nightOverlay = document.getElementById("night-overlay");
const deathScreen = document.getElementById("death-screen");

// Footer:
const footer = document.querySelector("footer");
const toggleFooter = document.getElementById("toggle-footer");

// General functions ---------------------------------------------------------------------------------------------
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

function getCenter(arr2d) {
    for (let x = 0; x < arr2d.length; x++) {
        for (let y = 0; y < arr2d.length; y++) {
            if (isCenter(arr2d, x, y)) return [x, y];
        }
    }
}

function chance(percent) {
    if (Math.random()*100 <= percent) return true;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isBetween(int, min, max) {
    return int > min && int < max ? true : false;
}

function print(message) {
    mapContainer.innerHTML = message;
}

function addEventListenerList(list, event, fn) {
    for (let el of list) el.addEventListener(event, fn, false);
}
// Project specific functions ---------------------------------------------------------------------------------------------

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

// When entity dies, replace image with gravestone, change class and alt:
function die(entity) {
    entity.src = 'img/dead.png';
    entity.className = 'dead';
    entity.alt = `dead ${nthWord(entity.className, 1)}`;
}

// Alternate player and entity images:
function alternatePlayerAndEntity() {
    const entity = nthWord(centerDiv.className, 2);
    if (centerDiv.firstChild.className === "player") {
        centerDiv.innerHTML = `<img class="${entity}" src="img/${entity}.png" alt="${entity}">`;
    } else {
        centerDiv.innerHTML = `<img class="player" src="img/player.png" alt="player">`;
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
    centerDiv = mapContainer.children[Math.floor(mapContainer.children.length / 2)];
    // If player and entity occupy same vector, alternate their images:
    if (numWords(centerDiv.className) === 2 && !alternating) {
        alternate = setInterval(alternatePlayerAndEntity, 500);
        alternating = true;
    } else if (numWords(centerDiv.className) === 1 && alternating) { 
        clearInterval(alternate);
        alternating = false;
    }
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

// Change an individual meter (Does not factor in dehydration or starvation):
function changeMeter(meter, value) {
    let changeAttempt = parseInt(meter.innerHTML) + value;
    if (changeAttempt > 0) {
        if (changeAttempt < 100) {
            meter.innerHTML = changeAttempt;
        } else meter.innerHTML = 100;
    } else meter.innerHTML = 0;
}

// Return message to be displayed on game over screen:
function getDeathMessage() {
    let message = "You"
    if (attackResults.innerHTML) {
        Object.keys(entityValues).forEach(entityName => {
            if (attackResults.innerHTML.includes(entityName)) message += ` were killed by a ${entityName}. :(`;
        });
    } else if (playerMeters[1].innerHTML == 0) {
        message += ` starved to death. :(`;
    } else if (playerMeters[2].innerHTML == 0) {
        message += ` died of dehydration. :(`;
    } else if (timeAwake > 36) {
        message += ` died of sleep deprivation. :(`
    } else {
        message += ` died. :(`
    }
    return message;
}

// Kill player and show game over screen:
function playerDie() {
    playerMeters[0].innerHTML = 0;
    playerAlive = false;
    die(mapContainer.querySelector('img.player'));
    actionPromptModal.style.display = "";
    sleepTimer.style.display = "";

    deathScreen.firstElementChild.innerHTML = getDeathMessage();
    deathScreen.style.display = "flex";
    window.setTimeout(function(){deathScreen.style.opacity = "0.7"}, 50);
}

// Change all player meters:
function changePlayerMeters(energy = 0, hunger = 0, thirst = 0) {
    let values = [];
    for (i = 0; i < 3; i++) {
        changeMeter(playerMeters[i], arguments[i]);
        values.push(parseInt(playerMeters[i].innerHTML));
    }
    // Deplete energy if dehydrated, starving, or sleep deprived:
    if (values[1] == 0) changeMeter(playerMeters[0], -2);
    if (values[2] == 0) changeMeter(playerMeters[0], -4);
    if (timeAwake > 36) changeMeter(playerMeters[0], -2);
    // Increase energy if hunger and thirst are above half:
    if (playerAlive && (values[1] > 50 && values[2] > 50)) changeMeter(playerMeters[0], 1);
    // If energy drops to 0, player dies:
    if (values[0] == 0) playerDie();
}

// Deplete player meters depending on terrain:
function applyTerrainEffects(multiplier) {
    if (playerAlive === true) {
    const playerTerrain = nthWord(mapContainer.querySelector('img.player').parentElement.className, 1);
    changePlayerMeters(0, terrainValues[playerTerrain].hunger*multiplier, terrainValues[playerTerrain].thirst*multiplier);
    }
}

// Move entities randomly:
function moveEntities() {
    // Iterate through all vectors in map array:
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr[x].length; y++) {
            // Check if vector has an entity and succeeds 50% chance:
            if (numWords(mapArr[x][y]) === 2 && chance(50)) {
                // Check if entity is not search or dead icon:
                if (['dead', 'search'].indexOf(nthWord(mapArr[x][y], 2)) === -1) {
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
    checkForAttacks();
}

// Check player adjacent vectors for entities and simulate attacks:
function checkForAttacks() {
    for (let x = 0; x < mapArr.length; x++) {
        for (let y = 0; y < mapArr[x].length; y++) {
            if (isCenter(mapArr, x, y)) {
                let adjEntities = [];
                if (numWords(mapArr[x][y]) === 2 && entityValues[nthWord(mapArr[x][y], 2)]) adjEntities.push(nthWord(mapArr[x][y], 2));
                for (let v = 0; v < 8; v++) {
                    let xo = x + adjVectors[v][0];
                    let yo = y + adjVectors[v][1];
                    if (numWords(mapArr[xo][yo]) === 2 && entityValues[nthWord(mapArr[xo][yo], 2)]) adjEntities.push(nthWord(mapArr[xo][yo], 2));
                }
                adjEntities.forEach(entity => {
                    if (chance(entityValues[entity].aggroChance)) {
                        actionPromptModal.style.display = "block";
                        sleepTimer.style.display = "";
                        attackResults.innerHTML = `<p>A ${entity} attacked!</p>`
                        if (chance(entityValues[entity].winChance)) {
                            attackResults.innerHTML += `<p>You scared it away!</p>`
                        } else {
                            attackResults.innerHTML += `<p>You were injured!</p>`
                            changePlayerMeters(entityValues[entity].damage, 0, 0);
                        }
                        printPlayerAdjVectors(searchPreview);
                        printPlayerAdjVectors(attackPreview);
                        addEventListenerList(searchTargets, 'click', search);
                        addEventListenerList(attackTargets, 'click', attack);
                        toggleDrawer(attackLootDrawer);
                    }
                });
            }
        }
    }
}

// Increment time for each move. Each move is considered 30 mins:
function addTime(numMoves) {
    move += numMoves;
    // Track time awake. Used to calculate sleep deprivation in changePlayerMeters:
    if (sleepTimer.style.display === "") timeAwake += numMoves;
    for (let m = 0; m < numMoves; m++) {
        min.innerHTML = parseInt(min.innerHTML) + 30;
        if (parseInt(min.innerHTML) === 60) {
            min.innerHTML = "00";
            hr.innerHTML = parseInt(hr.innerHTML) + 1;
            if (parseInt(hr.innerHTML) === 12) {
                if (amPM.innerHTML === "am") {
                    amPM.innerHTML = "pm";
                } else {
                    amPM.innerHTML = "am";
                    day.innerHTML = parseInt(day.innerHTML) + 1;
                }
            } else if (parseInt(hr.innerHTML) > 12) {
                hr.innerHTML = "1";
            }
        };
        moveEntities();
    }
    // Show night overlay between 9pm and 6am:
    if ((amPM.innerHTML === "pm" && isBetween(parseInt(hr.innerHTML), 8, 12)) || 
        (amPM.innerHTML === "am" && (isBetween(parseInt(hr.innerHTML), 0, 6) || parseInt(hr.innerHTML) === 12))) {
        if (nightOverlay.style.display !== "block") {
            nightOverlay.style.display = "block";
            window.setTimeout(function(){nightOverlay.style.opacity = "0.5"}, 50);
        }
    } else {
        if (nightOverlay.style.display === "block") {
            nightOverlay.style.opacity = "0";
            window.setTimeout(function(){nightOverlay.style.display = ""}, 3000);
        }
    }
}

// Return array of conditions that disable input. An array is returned instead of a single boolean because different input methods require different conditions.
function inputDisabled() {
    let allow = [];
    allow.push(actionPromptModal.style.display === "" ? true : false);
    allow.push(sleepTimer.style.display === "" ? true : false);
    allow.push(playerAlive);
    return allow;
}

function toggleActionPrompt() {
    if (!inputDisabled().slice(1, 3).includes(false)) {
        if (actionPromptModal.style.display === "block") {
            actionPromptModal.style.display = "";
            attackResults.innerHTML = '';
            searchResults.innerHTML = '';
            attackLootDrawer.style.transform = 'translateX(100%)';
            searchLootDrawer.style.transform = 'translateX(100%)';
        } else {
            printPlayerAdjVectors(searchPreview);
            printPlayerAdjVectors(attackPreview);
            addEventListenerList(searchTargets, 'click', search);
            addEventListenerList(attackTargets, 'click', attack);
            actionPromptModal.style.display = "block";
        }
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
                    let xo = x + adjVectors[v][0];
                    let yo = y + adjVectors[v][1];
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

// Copy target from preview to mapContainer:
function updateMap(target) {
    const preview = target.parentElement.children;
    for (let v = 0; v < 8; v++) {
        if (preview[v] === target);
            const center = getCenter(mapArr);
            let xo = center[0] + adjVectors[v][0];
            let yo = center[1] + adjVectors[v][1];
            let terrain = preview[v+1].className;
            let entity;
            if (preview[v+1].firstChild) entity = preview[v+1].firstChild.className;
            mapArr[xo][yo] = (entity ? `${terrain} ${entity}` : terrain);
    }
    drawMap();
}

function getAndPrintLoot(output, loot) {
    output.innerHTML = '<ul></ul>'
    loot.forEach(item => {
        if (chance(item.rarity)) {
            const quantity = randomIntFromInterval(item.minNum, item.maxNum);
            const newLi = document.createElement('li');
            newLi.className = "interactable tooltips";
            newLi.innerHTML = `<img class="fit-img" src="img/${item.img}.png" alt="${item.name}"><div class="quantity">x${quantity}</div><span>${item.name}</span>`
            output.querySelector('ul').appendChild(newLi);
            newLi.addEventListener('click', function() {
                changePlayerMeters(item.energy*quantity, item.hunger*quantity, item.thirst*quantity);
                event.target.parentElement.tagName === "LI" ? event.target.parentElement.remove() : event.target.remove();
                if (output.querySelector('ul').innerHTML === '') toggleDrawer(output.parentElement);
            });
        }
    });
    if (output.querySelector('ul').innerHTML === '') output.innerHTML = "Nothing here!";
}

function search(event) {
    let searchTarget;
    let entity;
    // If player clicks image:
    if (event.target.tagName === "IMG") {
        entity = event.target;
        searchTarget = entity.parentElement;
    // If player clicks div:
    } else {
        searchTarget = event.target;
        if (event.target.firstChild) entity = searchTarget.firstChild;
    }
    const terrainName = nthWord(searchTarget.className, 1);
    if (entity && entity.classList.contains('search')) {
        searchResults.innerHTML += "Already searched!"; 
    } else if (entity && Object.keys(entityValues).indexOf(entity.className) > -1) {
        searchResults.innerHTML += "It's too dangerous!"; 
    } else {
        getAndPrintLoot(searchResults, terrainValues[terrainName].loot);
        searchTarget.innerHTML = `<img class="search" src="img/search.png" alt="searched"></div>`;
        updateMap(searchTarget);
        addTime(2);
        applyTerrainEffects(2);
    }
    toggleDrawer(searchLootDrawer);
}

function simumlateCombat(entity) {
    entityName = entity.className;
    if (chance(entityValues[entityName].winChance)) {
        die(entity);
        // Display loot:
        attackResults.innerHTML += `<p>You won!</p><ul></ul>`
        getAndPrintLoot(attackResults.querySelector('ul'), entityValues[entityName].loot);
        toggleDrawer(attackLootDrawer);
    } else {
        attackResults.innerHTML += `<p>You lost to the ${entityName}!</p>`
        changePlayerMeters(entityValues[entityName].damage, 0, 0);
        toggleDrawer(attackLootDrawer);
    }
    addTime(1);
    applyTerrainEffects(3);
}

function attack(event) {
    // If player does not click player:
    if (!event.target.classList.contains('player')) {
    // If player clicks image:
        if (event.target.tagName === "IMG") {
            let entity = event.target;
            let attackTarget = entity.parentElement;
            simumlateCombat(entity);
            updateMap(attackTarget);
        // If player clicks div:
        } else if (event.target.firstChild) {
            let attackTarget = event.target;
            let entity = attackTarget.firstChild;
            simumlateCombat(entity);
            updateMap(attackTarget);
        }
    }
}

function sleep(move) {
    timeAwake = 0;
    for (let m = 0; m < move; m++) {
        setTimeout(function(){
            addTime(1);
            changePlayerMeters(2, 0, 0);
            applyTerrainEffects(0.5);
            drawMap();
        }, m * 500);
    }
}

function movePlayer(direction) {
    // Don't move player if movement disabled:
    if (!inputDisabled().includes(false)) {
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
        applyTerrainEffects(1);
        addTime(1);
    }
}
// Create size of map based on numRowsAndColumns:
root.style.setProperty('--num-rows-and-columns', `repeat(${numRowsAndColumns}, 1fr)`);

// Create map:
createArray(numRowsAndColumns);
createChunks();
populateMap();
drawMap();

hideHeadings.addEventListener("click", function(event) {
    if (mainHeading.style.display === "block" && subHeading.style.display === "block") {
        mainHeading.style.display = "none";
        subHeading.style.display = "none";
        hideHeadings.innerHTML = "Wait, how do I play?";
    } else {
        mainHeading.style.display = "block";
        subHeading.style.display = "block";
        hideHeadings.innerHTML = "OK, got it";
    }
});

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
closeActionPrompt.addEventListener("click", function() {toggleActionPrompt()});

// Open drawers when action prompt buttons are pressed:
searchBtn.addEventListener("click", function() {toggleDrawer(searchPreviewDrawer)});
searchPreviewBack.addEventListener("click", function() {toggleDrawer(searchPreviewDrawer)});
searchLootBack.addEventListener("click", function() {toggleDrawer(searchLootDrawer)});

attackBtn.addEventListener("click", function() {toggleDrawer(attackPreviewDrawer)});
attackPreviewBack.addEventListener("click", function() {toggleDrawer(attackPreviewDrawer)});
attackLootBack.addEventListener("click", function() {toggleDrawer(attackLootDrawer)});

sleepBtn.addEventListener("click", function() {toggleDrawer(sleepDrawer)});
sleepBack.addEventListener("click", function() {toggleDrawer(sleepDrawer)});
submitSleep.addEventListener("click", function() {
    toggleActionPrompt();
    sleepTimer.style.display = "block";
    sleep(parseInt(sleepHr.value)*2);
    setTimeout(function(){
        sleepTimer.style.display = "";
    }, sleepHr.value*1000);
});

toggleFooter.addEventListener("click", function() {
    footer.className = (footer.className === "collapsed" ? "expanded" : "collapsed");
});