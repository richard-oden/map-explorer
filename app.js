const mapContainer = document.getElementById('map');
const root = document.documentElement;
let mapArrX = [];
const terrain = ['#B0ED38', '#41B30C', '#EED869', '#CFCCBC', '#66B2EF'];

function getRandTerrain() {
    return terrain[Math.floor(Math.random() * terrain.length)];
}

function getCenter(arr) {
    return Math.floor(arr.length / 2);
}

function roll(num) {
    result = Math.floor(Math.random() * num) + 1;
    if (num === result) return true;
}

function print(message) {
    mapContainer.innerHTML = message;
}

function drawMap() {
    // Draw terrain:
    let html = '';
    for (let x = 0; x < mapArrX.length; x++) {
        html += `<tr>`;
        for (let y = 0; y < mapArrX[x].length; y++) {
            html += `<td style="background-color:${mapArrX[x][y]};"`;
            // Draw player character if td is in center of map:
            if (x === getCenter(mapArrX) && y === getCenter(mapArrX[x])) {
                html += ` id="player"><img src="img/player.png" alt="player">`;
            }
            // Plains:
            else if (mapArrX[x][y] === terrain[0]) {
                if (roll(15)) html += ` class="snake"><img src="img/snake.png" alt="snake">`;
            // Forest:
            } else if (mapArrX[x][y] === terrain[1]) {
                if (roll(15)) html += ` class="bear"><img src="img/bear.png" alt="bear">`;
            // Desert:
            } else if (mapArrX[x][y] === terrain[2]) {
                if (roll(15)) html += ` class="scorpion"><img src="img/scorpion.png" alt="scorpion">`;
            // Mountain:
            } else if (mapArrX[x][y] === terrain[3]) {

            // Water:
            } else if (mapArrX[x][y] === terrain[4]) {
                if (roll(15)) html += ` class="shark"><img src="img/shark.png" alt="shark">`;
            } 
            html += `</td>`;
        }
        html += `</tr>`;
    }
    print(html);
}

// Create 2D array of terrain:
for (let x = 0; x < 21; x++) {
    let mapArrY = []
    for (let y = 0; y < 21; y++) {
        // Randomly copy adjacent cell to create larger patches of terrain:
        // let adjTerrain = [];
        // if (roll(5) && y - 1 > -1) adjTerrain.push(mapArr[x][y - 1]);
        // if (roll(5) && x - 1 > -1) adjTerrain.push(mapArr[x - 1][y]);
        // if (roll(5) && (x - 1 > -1 && y - 1 > -1)) adjTerrain.push(mapArr[x - 1][y - 1]);
        // if (roll(5) && (x - 1 > -1 && y < mapArrX[x].length)) adjTerrain.push(mapArr[x - 1][y + 1]);
        // if (roll(5) && y + 1 < mapArrX[x].length) adjTerrain.push(mapArr[x][y + 1]);
        // if (roll(5) && x + 1 < mapArrX.length) adjTerrain.push(mapArr[x + 1][y]);
        // if (roll(5) && (x + 1 < mapArrX.length && y - 1 > -1)) adjTerrain.push(mapArr[x + 1][y - 1]);
        // if (roll(5) && (x + 1 < mapArrX.length && y < mapArrX[x].length)) adjTerrain.push(mapArr[x + 1][y + 1]);

        // if (roll(2)) {
        //     mapArrY[y] = adjTerrain[Math.floor(Math.random() * adjTerrain.length)];
        // } else {
        //     mapArrY[y] = getRandTerrain();
        // }
        mapArrY[y] = getRandTerrain();
    }
    mapArrX[x] = mapArrY;
}

// Create CSS variable to assign cell size relative to number of rows/columns:
root.style.setProperty('--cell-height', mapContainer.offsetHeight / mapArrX.length + 'px');
root.style.setProperty('--cell-width', mapContainer.offsetWidth / mapArrX[0].length + 'px');

drawMap();