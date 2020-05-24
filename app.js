const mapContainer = document.getElementById('map');
const root = document.documentElement;
let mapArr = [];
const terrain = ['#B0ED38', '#41B30C', '#EED869', '#CFCCBC', '#66B2EF'];
let adjVectors = [ [0, -1], [0, 1], [-1, 0], [-1, -1], [-1, 1], [1, 0], [1, -1], [1, 1] ];

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

function drawMap() {
    // Draw terrain:
    let html = '';
    for (let x = 0; x < mapArr.length; x++) {
        html += `<tr>`;
        for (let y = 0; y < mapArr[x].length; y++) {
            html += `<td style="background-color:${mapArr[x][y]};"`;
            // Draw player character if td is in center of map:
            if (x === getCenter(mapArr) && y === getCenter(mapArr[x])) {
                html += ` id="player"><img src="img/player.png" alt="player">`;
            }
            // Draw locations based on terrain:
            // Plains
            else if (mapArr[x][y] === terrain[0]) {
                if (chance(5)) html += ` class="snake"><img src="img/snake.png" alt="snake">`;
            // Forest
            } else if (mapArr[x][y] === terrain[1]) {
                if (chance(5)) html += ` class="bear"><img src="img/bear.png" alt="bear">`;
            // Desert
            } else if (mapArr[x][y] === terrain[2]) {
                if (chance(5)) html += ` class="scorpion"><img src="img/scorpion.png" alt="scorpion">`;
            // Mountain
            } else if (mapArr[x][y] === terrain[3]) {

            // Water
            } else if (mapArr[x][y] === terrain[4]) {
                if (chance(5)) html += ` class="shark"><img src="img/shark.png" alt="shark">`;
            } 
            html += `</td>`;
        }
        html += `</tr>`;
    }
    print(html);
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
        console.log(adjTerrain);
        mapArr[x][y] = adjTerrain[Math.floor(Math.random() * adjTerrain.length)];
    }
}

// Create CSS variable to assign cell size relative to number of rows/columns:
root.style.setProperty('--cell-height', mapContainer.offsetHeight / mapArr.length + 'px');
root.style.setProperty('--cell-width', mapContainer.offsetWidth / mapArr[0].length + 'px');

drawMap();