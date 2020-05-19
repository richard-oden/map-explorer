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
    mapContainer.innerHTML += message;
}

// Create 2D array of terrain:
for (let x = 0; x < 21; x++) {
    let mapArrY = []
    for (let y = 0; y < 21; y++) {
        mapArrY[y] = getRandTerrain();
    }
    mapArrX[x] = mapArrY;
}

// Create CSS variable to assign cell size relative to number of rows:
root.style.setProperty('--grid-cell-size', mapContainer.offsetHeight / mapArrX.length + 'px');

// Draw terrain:
for (let x = 0; x < mapArrX.length; x++) {
    let tr = document.createElement('tr');
    mapContainer.appendChild(tr);
    for (let y = 0; y < mapArrX[x].length; y++) {
        let td = document.createElement("td");
        td.style.backgroundColor = mapArrX[x][y];
        root.style.setProperty('--grid-cell-size', mapContainer.offsetHeight / mapArrX.length + 'px');
        // Draw player character if td is in center of map:
        if (x === getCenter(mapArrX) && y === getCenter(mapArrX[x])) {
            td.setAttribute("id", "player");
            let playerIMG = document.createElement("img");
            playerIMG.setAttribute("src", "img/player.png");
            playerIMG.setAttribute("alt", "player");
            td.appendChild(playerIMG);
            console.log(td.style.height);
        }
        tr.appendChild(td);
    }
}

