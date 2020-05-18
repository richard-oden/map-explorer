const mapContainer = document.getElementById('map');
let mapArrX = [];
const terrain = ['#B0ED38', '#41B30C', '#EED869', '#CFCCBC', '#66B2EF'];

function getRandTerrain() {
    return terrain[Math.floor(Math.random() * terrain.length)];
}

function print(message) {
    mapContainer.innerHTML += message;
}

for (let x = 0; x < 20; x++) {
    let mapArrY = []
    for (let y = 0; y < 20; y++) {
        mapArrY[y] = getRandTerrain();
    }
    mapArrX[x] = mapArrY;
}

for (let x = 0; x < mapArrX.length; x++) {
    for (let y = 0; y < mapArrX[x].length; y++) {
        let div = document.createElement("div");
        div.style.backgroundColor = mapArrX[x][y];
        mapContainer.appendChild(div);
    }
}