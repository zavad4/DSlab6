'use strict';
const grafinfo = {};
let treeinfo = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

 ctx.font = '17px Times new Roman';
 ctx.textBaseline = 'middle';
 ctx.textAlign = 'center';

 const A = [
    [0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1],  
    [1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1], 
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1], 
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0], 
    [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0], 
    [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1], 
    [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1], 
    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1]
  ];

  const W  = [
    [0,  89, 5,  53, 0,  0,  92, 0,  90, 55, 69],  
    [89, 0,  0,  0,  41, 0,  0,  0,  15, 63, 41], 
    [5,  0,  0,  0,  39, 0,  0,  5,  80, 0,  68], 
    [53, 0,  0,  0,  25, 8,  50, 48, 6,  79, 98], 
    [0,  41, 39, 25, 0,  0,  60, 15, 66, 0,  0], 
    [0,  0,  0,  8,  0,  0,  3,  56, 61, 69, 0],  
    [92, 0,  0,  50, 60, 3,  0,  13, 14, 0,  31],  
    [0,  0,  5,  48, 15, 56, 13, 0,  86, 81, 67], 
    [90, 15, 80, 6,  66, 61, 14, 86, 0,  44, 44], 
    [55, 63, 0,  79, 0,  69, 0,  81, 44, 0,  62], 
    [69, 41, 68, 98, 0,  0,  31, 67, 44, 62, 0]
  ];
  

const fullCopy = x => JSON.parse(JSON.stringify(x));

const newMatrix = matrix => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j]) matrix[j][i] = 0;
    }
  }
  return matrix;
}

  ctx.font = '22px Times new Roman';
  ctx.fillText('Adjacency matrix', 800, 160);
  for (let i = 0; i < A.length; i++) {
    ctx.fillText(`${A[i]}`, 800, 160 + (i + 1) * 25);
  }

const r = 18;
const rloops = 3 * r / 4;
const arrr = 5;

const buildVertex = (n, P, x0, y0, obj) => {
  let step = P / n;
  const side = P / 4;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  for (vert; vert <=  Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY += step;
  }

  for (vert; vert <=  2 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX += step;
  }

  for (vert; vert <=  3 * Math.ceil(n / 4); vert++) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newY -= step;
  }
  for (vert; vert <=  n; vert++) {
    step = side / (n - 3 * Math.ceil(n / 4));
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num : vert,
      },
      enumerable: true,
      writable: true
    });
    newX -= step;
  }
};
buildVertex(11, 1900, 75, 50, grafinfo);

const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simplecon = [];
    obj[key].doublecon = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) { 
        const names = [`vert${i+1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simplecon.push(`vert${j + 1}`);
        }
        else {
          obj[names[0]].doublecon.push(`vert${j + 1}`);
        }
      }
    }
  }
}
const center = (x0, y0, p) =>{ 
  let x = x0 + p/8;
  let y = y0 + p/8;
  return {
    x : x,
    y : y
  }
}

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (let i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc)**2 + (obj[arr[i]].coords[1] - yc)**2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

  function simpleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : (r + 35) * Math.cos(Math.PI / 2 - alpha),
      dy : (r + 28) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  function doubleAdditionalDots(x0, y0, x1, y1) {
    const alpha = Math.atan2(y1 - y0, x1 - x0);
    return { 
      dx : -(r + 34) * Math.cos(Math.PI / 2 - alpha),
      dy : -(r + 19) * Math.sin(Math.PI / 2 - alpha)
      }
  }

  const drawDoubleCons = obj => {
    for (const key in obj) {
      for (let i = 0; i < obj[key].doublecon.length; i++) {
        const fromX = obj[key].coords[0];
        const fromY = obj[key].coords[1];
        const toX = obj[`${obj[key].doublecon[i]}`].coords[0];
        const toY = obj[`${obj[key].doublecon[i]}`].coords[1];
  
        if (obj[key].num <= obj[`${obj[key].doublecon[i]}`].num) {
        if (Math.abs(obj[key].num - obj[`${obj[key].doublecon[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].doublecon[i]}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(fromX, fromY);
          ctx.lineTo(toX, toY);
          ctx.stroke();
        } 
        else {
        const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX += dx;
        newY -= dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        }
      }
      }
    }
  }


  const drawVertex = obj => {
    for (let key in obj) {
      ctx.beginPath();
      ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
      ctx.fillStyle = "grey";
      ctx.fill();
      ctx.strokeStyle = "yellow";
      ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
      ctx.stroke();
    }
  }

  const drawWeigths = (matrix, obj) => {
  for(let i = 0; i < A.length; i++) {
    for(let j = i; j < A.length; j++) {
      if(matrix[i][j]) {
        const w = matrix[i][j];
        const fromX = obj[`vert${i+1}`].coords[0];
        const fromY = obj[`vert${i+1}`].coords[1];
        const toX = obj[`vert${j+1}`].coords[0];
        const toY = obj[`vert${j+1}`].coords[1];
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;

        if (Math.abs(obj[`vert${i+1}`].num - obj[`vert${j+1}`].num) === 1 || Math.abs(obj[`vert${i+1}`].num - obj[`vert${j+1}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.fillStyle = "white";
          ctx.arc((fromX + toX) / 2, (fromY + toY) / 2, 8,0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(w, (fromX + toX) / 2, (fromY + toY) / 2);
        } else {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.fillStyle = "white";
          ctx.arc(newX, newY, 8,0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(w, newX, newY);
        }
      }
    }
  }
}

function drawCircle(context, x, y, r, fillStyle, strokeStyle) {
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;
  context.arc(x, y, r, 0, Math.PI * 2);
  context.stroke();
  if (fillStyle) context.fill();
  context.closePath();
}

makeCons(A, grafinfo);
drawLoops(loops, grafinfo,75, 100);
drawDoubleCons(grafinfo);
drawVertex(grafinfo);
drawWeigths(W, grafinfo);

const DejkObj = {}
const STARTY = 1;
const infinity = Math.pow(10, 200);

for(let i = 1; i <= A.length; i++) {
  DejkObj[i] = {
    dist: i === STARTY ? 0 : infinity,
    cond: i === STARTY ? 'P' : 'T',
    ancestor: undefined
  }
}

const GetAdjacentLenghts = (obj, curr) => {
  W[curr - 1].forEach((weight, v) => {
    if(obj[v + 1].cond === 'T' && weight && weight + obj[curr].dist < obj[v + 1].dist)  {
      obj[v + 1].dist = weight + obj[curr].dist;
      obj[v + 1].ancestor = curr;
    } 
  })
}

const FindMinLength = obj => {
  const weights = [];
  for(let v in obj) {
    if(obj[v].cond === 'T') {
      const distObj = {};
      distObj.v = +v;
      distObj.dist = obj[v].dist;
      weights.push(distObj)
    }
  }
  const min = weights.reduce((a, b) => a.dist < b.dist ? a : b);
  return min;
}

const IsDejkstraDone = obj => {
  let done = true;
  for(let v in obj) {
    if(obj[v].cond === 'T') done = false;
  }
  return done;
} 


let counter = 0;
const Dejkstra = (obj, current = STARTY) => {
  ctx.font = '22px Times new Roman';
  ctx.strokeStyle = 'black';
  ctx.fillText('Pathes', 1020, 160);
  counter++;
  GetAdjacentLenghts(obj, current);
  const min = FindMinLength(obj);
  obj[min.v].cond = 'P';
  const newWay = [];
  for (let i = min.v; i; i = obj[i].ancestor) {
    newWay.unshift(i);
  }
  ctx.font = '22px Times new Roman';
  ctx.strokeStyle = 'black';
  ctx.fillText(newWay, 1020, 160 + counter * 25);
  console.log(min.v, newWay);
  return { obj, current: min.v };
};

let curr = STARTY;

const halt = (object, currentV) => {
  if (!IsDejkstraDone(object)) {
    const { obj, current } = Dejkstra(object, currentV);
    curr = current;
    ctx.clearRect(0, 0, 620, 600);
    const newWay = [];
    for (let i = current; i; i = obj[i].ancestor) { //find way
      newWay.unshift(i);
    }
    drawDoubleCons(grafinfo);
    ctx.strokeStyle = 'YellowGreen';
    ctx.lineWidth = 3;
    newWay.forEach((v, i, arr) => {
      if (arr[i + 1]) {
        const from = grafinfo[`vert${v}`];
        const to = grafinfo[`vert${arr[i + 1]}`];
        if (Math.abs(from.num - to.num) === 1 || Math.abs(from.num - to.num) === (Object.keys(grafinfo).length - 1)) {
          ctx.beginPath();
          ctx.moveTo(from.coords[0], from.coords[1]);
          ctx.lineTo(to.coords[0], to.coords[1]);
          ctx.stroke();
        } else {
          ctx.beginPath();
          if (from.num < to.num) {
            const { dx, dy } = doubleAdditionalDots(from.coords[0], from.coords[1], to.coords[0], to.coords[1]);
            let newX = (from.coords[0] + to.coords[0]) / 2;
            let newY = (from.coords[1] + to.coords[1]) / 2;
            newX += dx;
            newY -= dy;
            ctx.moveTo(from.coords[0], from.coords[1]);
            ctx.lineTo(newX, newY);
            ctx.lineTo(to.coords[0], to.coords[1]);
            ctx.stroke();
          } else {
            const { dx, dy } = doubleAdditionalDots(to.coords[0], to.coords[1], from.coords[0], from.coords[1],);
            let newX = (from.coords[0] + to.coords[0]) / 2;
            let newY = (from.coords[1] + to.coords[1]) / 2;
            newX += dx;
            newY -= dy;
            ctx.moveTo(to.coords[0], to.coords[1]);
            ctx.lineTo(newX, newY);
            ctx.lineTo(from.coords[0], from.coords[1]);
            ctx.stroke();
          }
        }
      }
    });
    ctx.strokeStyle = 'black';
    for (const v in obj) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      let color = obj[v].cond === 'T' ? 'MediumPurple' : 'crimson';
      if (+v === curr) color = 'MediumTurquoise';
      drawCircle(ctx, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1], r, color, 'black');
      //draw text
      ctx.lineWidth = 1;
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      //ctx.strokeStyle = 'white';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(`${v}(${obj[v].dist === infinity ? '∞' : obj[v].dist})`, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1]);
      ctx.fillText(`${v}(${obj[v].dist === infinity ? '∞' : obj[v].dist})`, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1]);
    }
    drawWeigths(W, grafinfo);
  }
};
