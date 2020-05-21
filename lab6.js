/* eslint-disable max-len */
'use strict';
const grafinfo = {};
const treeinfo = {};
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
        num: vert,
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
        num: vert,
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
        num: vert,
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
        num: vert,
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
        const names = [`vert${i + 1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simplecon.push(`vert${j + 1}`);
        } else {
          obj[names[0]].doublecon.push(`vert${j + 1}`);
        }
      }
    }
  }
};
const center = (x0, y0, p) => {
  const x = x0 + p / 8;
  const y = y0 + p / 8;
  return {
    x,
    y
  };
};

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (const i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc) ** 2 + (obj[arr[i]].coords[1] - yc) ** 2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
};

function simpleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r + 35) * Math.cos(Math.PI / 2 - alpha),
    dy: (r + 28) * Math.sin(Math.PI / 2 - alpha)
  };
}

function doubleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: -(r + 34) * Math.cos(Math.PI / 2 - alpha),
    dy: -(r + 19) * Math.sin(Math.PI / 2 - alpha)
  };
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
        } else {
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
};


const drawVertex = obj => {
  for (const key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.strokeStyle = 'yellow';
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.stroke();
  }
};

const drawWeigths = (matrix, obj) => {
  for (let i = 0; i < A.length; i++) {
    for (let j = i; j < A.length; j++) {
      if (matrix[i][j]) {
        const w = matrix[i][j];
        const fromX = obj[`vert${i + 1}`].coords[0];
        const fromY = obj[`vert${i + 1}`].coords[1];
        const toX = obj[`vert${j + 1}`].coords[0];
        const toY = obj[`vert${j + 1}`].coords[1];
        const { dx, dy } = simpleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;

        if (Math.abs(obj[`vert${i + 1}`].num - obj[`vert${j + 1}`].num) === 1 || Math.abs(obj[`vert${i + 1}`].num - obj[`vert${j + 1}`].num) === (Object.keys(obj).length - 1)) {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.fillStyle = 'white';
          ctx.arc((fromX + toX) / 2, (fromY + toY) / 2, 8, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.fillText(w, (fromX + toX) / 2, (fromY + toY) / 2);
        } else {
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.fillStyle = 'white';
          ctx.arc(newX, newY, 8, 0, 2 * Math.PI, false);
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
};

function drawCircle(context, x, y, r, fillStyle, strokeStyle) {
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;
  context.arc(x, y, r, 0, Math.PI * 2);
  context.stroke();
  if (fillStyle) context.fill();
  context.closePath();
}

makeCons(A, grafinfo);
drawLoops(loops, grafinfo, 75, 100);
drawDoubleCons(grafinfo);
drawVertex(grafinfo);
drawWeigths(W, grafinfo);

const DejkObj = {};
const START_VERT = 1;
const inf = Math.pow(10, 200);

for (let i = 1; i <= A.length; i++) {
  DejkObj[i] = {
    dist: i === START_VERT ? 0 : inf,
    mark: i === START_VERT ? 'P' : 'T',
    prev: undefined
  };
}

const GetAdjacentLenghts = (obj, curr) => {
  W[curr - 1].forEach((weight, v) => {
    if (obj[v + 1].mark === 'T' && weight && weight + obj[curr].dist < obj[v + 1].dist)  {
      obj[v + 1].dist = weight + obj[curr].dist;
      obj[v + 1].prev = curr;
    }
  });
};

const GetMinLength = obj => {
  const weights = [];
  for (const v in obj) {
    if (obj[v].mark === 'T') {
      const distObj = {};
      distObj.v = +v;
      distObj.dist = obj[v].dist;
      weights.push(distObj);
    }
  }
  const min = weights.reduce((a, b) => (a.dist < b.dist ? a : b));
  return min;
};

const IsDejkstraDone = obj => {
  let done = true;
  for (const v in obj) {
    if (obj[v].mark === 'T') done = false;
  }
  return done;
};

const lengthsArray = [];
const doneArray = [START_VERT];
let usingBorders = [];

const Dejkstra = (obj, current = START_VERT) => {
  for (let i = 0; i < A.length; i++) { //GetAdjacentLenghts(obj, current);
    const weight = W[current - 1][i];
    const v = i + 1;
    if (weight) {
      if (obj[v].mark === 'T')  {
        if (weight + obj[current].dist < obj[v].dist) {
          if (obj[v].prev) {
            usingBorders = usingBorders.filter(x => JSON.stringify(x) !== JSON.stringify([obj[v].prev, v]));
          }
          obj[v].dist = weight + obj[current].dist;
          obj[v].prev = current;
          usingBorders.push([current, v]);
        }
        lengthsArray.push([current, v, fullCopy(doneArray), fullCopy(usingBorders), fullCopy(obj)]);
      }
    }
  }
  const min = GetMinLength(obj);
  obj[min.v].mark = 'P';
  doneArray.push(min.v);

  if (!IsDejkstraDone(obj)) Dejkstra(obj, min.v);
};

Dejkstra(DejkObj);

const current = START_VERT;

const iterDejk = lengthsArray[Symbol.iterator]();

const halt = () => {
  const { value, done } = iterDejk.next();
  if (!done) {
    ctx.clearRect(0, 0, 700, 700);
    const current = value[0],
      to = value[1],
      doneArray = value[2],
      usingArray = value[3],
      obj = value[4];
    ctx.beginPath();
    console.log(current, to);
    const keyCurr = 'vert' + current;
    const keyTo = 'vert' + to;
    drawDoubleCons(grafinfo);
    ctx.strokeStyle = 'black';
    drawWeigths(W, grafinfo);
    drawLoops(loops, grafinfo, 75, 100);
    ctx.lineWidth = 2;
    usingArray.forEach(arr => {
      ctx.beginPath();
      const fromV = arr[0],
        toV = arr[1];
      ctx.strokeStyle = '#48C9B0';
      ctx.strokeStyle = 'YellowGreen';
      const from = grafinfo['vert' + fromV];
      const to = grafinfo['vert' + toV];

      if (Math.abs(from.num - to.num) === 1 || Math.abs(from.num - to.num) === (Object.keys(grafinfo).length - 1)) {
        ctx.beginPath();
        ctx.moveTo(from.coords[0], from.coords[1]);
        ctx.lineTo(to.coords[0], to.coords[1]);
        ctx.stroke();
      } else {
        ctx.beginPath();
        if (from.num > to.num) {
          const { dx, dy } = doubleAdditionalDots(from.coords[0], from.coords[1], to.coords[0], to.coords[1]);
          let newX = (from.coords[0] + to.coords[0]) / 2;
          let newY = (from.coords[1] + to.coords[1]) / 2;
          newX -= dx;
          newY += dy;
          ctx.moveTo(from.coords[0], from.coords[1]);
          ctx.lineTo(newX, newY);
          ctx.lineTo(to.coords[0], to.coords[1]);
          ctx.stroke();
        } else {
          const { dx, dy } = doubleAdditionalDots(to.coords[0], to.coords[1], from.coords[0], from.coords[1],);
          let newX = (from.coords[0] + to.coords[0]) / 2;
          let newY = (from.coords[1] + to.coords[1]) / 2;
          newX -= dx;
          newY += dy;
          ctx.moveTo(to.coords[0], to.coords[1]);
          ctx.lineTo(newX, newY);
          ctx.lineTo(from.coords[0], from.coords[1]);
          ctx.stroke();
        }

      }


    });
    ctx.lineWidth = 1;
    for (let i = 1; i <= A.length; i++) { //draw vertics
      ctx.beginPath();
      let color = doneArray.includes(i) ? 'MediumPurple' : 'crimson';
      if (current === i) color = 'MediumTurquoise';
      drawCircle(ctx, grafinfo[`vert${i}`].coords[0], grafinfo[`vert${i}`].coords[1], r, color, 'black');
    }
    for (const v in DejkObj) {
    //draw vertics
      ctx.beginPath();
      //draw text
      ctx.lineWidth = 1;
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(`${v}(${DejkObj[v].dist === inf ? '∞' : DejkObj[v].dist})`, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1]);
      ctx.fillText(`${v}(${DejkObj[v].dist === inf ? '∞' : DejkObj[v].dist})`, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1]);
    }
  } else {
    for (let i = 1; i <= A.length; i++) { //draw vertics
      ctx.beginPath();
      const color = '#3498DB';
      drawCircle(ctx, grafinfo[`vert${i}`].coords[0], grafinfo[`vert${i}`].coords[1], r, color, 'black');
    }
    for (const v in DejkObj) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.strokeText(`${v}(${DejkObj[v].dist === inf ? '∞' : DejkObj[v].dist})`, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1]);
      ctx.fillText(`${v}(${DejkObj[v].dist === inf ? '∞' : DejkObj[v].dist})`, grafinfo[`vert${v}`].coords[0], grafinfo[`vert${v}`].coords[1]);
    }
  }
};

ctx.font = '24px Times new Roman';
ctx.fillText('Pathes', 930, 150);
for (const v in DejkObj) {
  const newWay = [];
  if (v === 1) continue;
  for (let i = v; i; i = DejkObj[i].prev) {
    newWay.unshift(i);
  }
  ctx.font = '22px Times new Roman';
  ctx.fillText(`${v} : ${newWay.join('-')} distance: ${DejkObj[v].dist}`, 930, 150 + 25 * (v));
}

