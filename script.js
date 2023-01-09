const canvaSizeInPx = 600;
let drawActivated = false;

let fieldset = document.querySelector('fieldset');
let colorPicker = document.getElementById('color-picker');
let grid = document.querySelector('.grid');
let randomSelector = document.getElementById('color-random');
let increasingSelector = document.getElementById('color-increasing');
let cellsPerRow = document.getElementById('cells-per-row');
let clearButton = document.getElementById('clear-all');
let cellsPerRowLabel = document.getElementById('cells-per-row-label');

let fixedColor = {get color() {return colorPicker.value;}}
let randColor = {get color() {return getRandomColor()}};
let color = fixedColor;

fieldset.addEventListener('change', (e) => {
    if (e.target.id === 'color-picker') {
        if (!randomSelector.checked) color = fixedColor;
    } else if (e.target.id === 'color-fixed' || e.target.id === 'color-increasing') {
        color = fixedColor;
    } else if (e.target.id === 'color-random') {
        color = randColor;
    }
})

grid.addEventListener('click', () => {
    drawActivated = !drawActivated
    grid.toggleAttribute('draw');
});

cellsPerRow.addEventListener('change', () => drawCanva(cellsPerRow.value));

cellsPerRow.addEventListener('input', () => cellsPerRowLabel.textContent = `${cellsPerRow.value} x ${cellsPerRow.value}`);

clearButton.addEventListener('click', () => drawCanva(cellsPerRow.value));

function drawCanva(numOfCellsPerRow) {
    if (grid.children) grid.innerHTML='';
    numOfCellsPerRow = Math.min(Math.max(numOfCellsPerRow, 10), 100);
    for (let i = 0; i < numOfCellsPerRow; i++) {
        let row = document.createElement('div')
        row.setAttribute('class', 'row');
        for (let j = 0; j < numOfCellsPerRow; j++) {
            const cellSize = canvaSizeInPx / numOfCellsPerRow;
            let div = document.createElement('div')
            div.setAttribute('class', 'cell');
            div.style.width = `${cellSize}px`;
            div.style.height = `${cellSize}px`;
            div.style.backgroundColor = '#fff';
            div.addEventListener('mouseenter', () => {
                if (!drawActivated) return;
                if (increasingSelector.checked) {
                    let res = getPercentOfColor(div.style.backgroundColor, color.color)
                    div.style.backgroundColor = res
                } else {
                    div.style.backgroundColor = color.color; 
                } 
            })
            row.appendChild(div);
        }
        grid.appendChild(row)
    }
    cellsPerRowLabel.textContent = `${numOfCellsPerRow} x ${numOfCellsPerRow}`;
}

// Utils
function randomBetweenInclusive (min, max) {
    return (Math.floor(Math.random() * (max-min)) + min).toString(16);
}

function getRandomColor() {
    return '#' + randomBetweenInclusive(0,255) + randomBetweenInclusive(0,255) + randomBetweenInclusive(0,255);
}

function getPercentOfColor(currentColor, color, per=0.1) {
    let currentColorArray = currentColor.substring(4, currentColor.length - 1).split(', ');
    let red = Math.ceil((255 - parseInt(color.substring(1,3), 16)) * per);
    let green = Math.ceil((255 - parseInt(color.substring(3,5), 16)) * per);
    let blue = Math.ceil((255 - parseInt(color.substring(5), 16)) * per);
    red = Math.max(parseInt(currentColorArray[0]) - red, 0).toString(16);
    green = Math.max(parseInt(currentColorArray[1]) - green,0).toString(16);
    blue = Math.max(parseInt(currentColorArray[2]) - blue, 0).toString(16);
    return `#${red}${green}${blue}`
}

// main
drawCanva(cellsPerRow.value);
