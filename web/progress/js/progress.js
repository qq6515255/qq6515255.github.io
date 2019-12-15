 var canvas = $('#progress');
 var ctx = canvas[0].getContext('2d');
 // 随机数
 function randomNum(m, n) {
     return Math.round(Math.random() * (n - m)) + m;
 }

 class Boll {
     constructor(x, y) {
         this.g = 1;
         this.x = x;
         this.y = y;
         this.sx = randomNum(1, -2);
         this.sy = randomNum(-10, -15);

     }
     drowDot() {
         ctx.beginPath();
         ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
         ctx.closePath();
         ctx.fillStyle = '#CDA69F';
         ctx.fill();
     }

     dotMove() {
         this.sy = this.sy + this.g;
         this.x = this.x + this.sx;
         this.y = this.y + this.sy;
     }

     dotCheck(line, h, callback) {
         if (this.y > (line.y + h)) {
             callback(true);
         };
     }

 }

 class Line {
     constructor(...values) {
         [this.x, this.y, this.l, this.colorDown, this.colorMain] = values
         this.activeLong = 0;
     }

     drowMainLine() {
         ctx.beginPath();
         ctx.moveTo(this.x, this.y);
         ctx.lineCap = 'round';
         ctx.lineTo(this.x + this.l, this.y);
         ctx.lineWidth = 10;
         ctx.strokeStyle = this.colorMain;
         ctx.stroke();
         ctx.closePath();
     }
     drowActiveLine(activeLong) {
         let long = (this.l / 100) * activeLong;
         this.activeLong = (this.l * activeLong / 100);
         ctx.beginPath();
         ctx.moveTo(this.x, this.y);
         ctx.lineCap = 'round';
         ctx.lineTo(this.x + long, this.y);
         ctx.lineWidth = 10;
         ctx.strokeStyle = this.colorDown;
         ctx.stroke();
         ctx.closePath();
     }
 }

 let l = new Line(60, 250, 650, '#ff7f50', '#a78d84');
 // 开始 百分比
 var i = 0;
 let arr = [];
 var fps = 0;

 function start() {
     l.drowMainLine();
     l.drowActiveLine(i);
     i = i >= 100 ? 100 : i + 0.1;
     // 生成
     if (fps % 2 == 0 && i < 100) {
         let boll = new Boll(l.x + l.activeLong, l.y);
         arr.push(boll);
     }
     if (i > 99 && arr.length == 0) {
         window.clearInterval(s)
     }
     // 遍历粒子
     arr.forEach(function(e, i) {
         e.dotMove();
         e.drowDot();
         e.dotCheck(l, 100, (flag) => {
             if (flag) {
                 arr.splice(i, 1);
             }
         })
     })

 }
 var s = setInterval(() => {
         ctx.clearRect(0, 0, 800, 500);
         fps++
         start();
         // 清空画布

     },
     30)