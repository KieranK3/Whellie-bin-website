// const { Z_ASCII } = require("zlib");

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const wbInput = document.querySelector('input')

var columnA = []
var columnB = []

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

async function actOnXlsx (file) {
    const fileReader = new FileReader();

    const data = await new Promise((resolve, reject) => {
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = reject;

        fileReader.readAsArrayBuffer(file);
    })
    .finally(() => {
        fileReader.onerror = fileReader.onload = null;
    })
    console.log(data)


    var workbook = XLSX.read(data)
    console.log(workbook)
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log(worksheet)
    for (let z in worksheet){
        if(z.toString()[0] === 'A') {
            columnA.push(worksheet[z].v)
            console.log(worksheet[z].v)
        }
        if(z.toString()[0] === 'B') {
            columnB.push(worksheet[z].v)
            // console.log(worksheet[z].v)
        }
    }
    console.log(columnA)
    columnA.shift();
    columnB.shift();
    addData();
}

wbInput.addEventListener("change", event => {
    if (wbInput.files.length === 0)
    return;
    console.log('test')
    actOnXlsx(wbInput.files[0]);
})

// const data = [];
//         let prev = 100;
//         for (let i = 0; i < 1000; i++) {
//             prev += 5 - Math.random() * 10;
//             data.push({x: i, y: prev});
//         }
//         console.log(data)

const data = []

function addData(){
    for (let i = 0; i < columnA.length; i++) {
        data.push({x: i, y: columnB[i]});
    }
    myChart.update();
}

console.log('testing')
console.log(data)
const totalDuration = 10000;
const delayBetweenPoints = totalDuration / 1000;
const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

var ctx = document.getElementById('myChart').getContext('2d');
console.log('test')
console.log(columnA)

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            borderColor: '#E12D2D',
            borderWidth: 1,
            // backgroundColor: rgba(20, 0, 0, 1),
            radius: 0,
            data: data,
            backgroundColor: '#E12D2D',
            // data: columnA,
        }]
    },
    options: {
        chartArea: {
            backgroundColor: 'rgba(103, 5, 85, 0.4)'
        },
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        },
        interaction: {
            intersect: false
        },
        plugins: {
            legend: false
        },
        scales: {
            x: {
                type: 'linear'
            }
        }
    }
});