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

function print(message) {
    mapContainer.innerHTML = message;
}

// Create 2D array of terrain:
for (let x = 0; x < 21; x++) {
    let mapArrY = []
    for (let y = 0; y < 21; y++) {
        mapArrY[y] = getRandTerrain();
    }
    mapArrX[x] = mapArrY;
}

// Create CSS variable to assign cell size relative to number of rows/columns:
root.style.setProperty('--cell-height', mapContainer.offsetHeight / mapArrX.length + 'px');
root.style.setProperty('--cell-width', mapContainer.offsetWidth / mapArrX[0].length + 'px');

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
        html += `</td>`;
    }
    html += `</tr>`;
}
print(html);

