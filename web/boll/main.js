var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
// 颜色组
var colorArr = [
    "#FF9966",
    "#FF6666",
    "#99CCFF",
    "#666633",
    "#6699CC",
    "#CCCCFF",
    "#CC3399",
    "#66CCCC",
    "#CC0066"
];
//  创建img以添加按钮时的图
var img = new Image();
img.src = "./preloadsheet.png";

// 随机颜色
function randomColor(c) {
    if (c) {
        var color = 'black';
        return color
    } else {
        return colorArr[Math.floor(Math.random() * colorArr.length)];
    }
}
// 随机数
function randomNum(m, n) {
    return Math.round(Math.random() * (n - m)) + m;
}

function randomFloor(m, n) {
    return Math.random() * (n - m) + m;
}
// 初始化game
var game = {
    stageW: 0,
    stageH: 0,
    score: 0,
    ruler: 0,
    rulueStyle: 'height',
    center: {
        x: 0,
        y: 0
    }
};
// 创建球的类
function Boll(m, h, c) {
    return new Boll.prototype.init(m, h, c);
}
Boll.prototype = {
    constructor: Boll,
    init: function(m, h, c) {
        this.r = randomNum(m, h),
            this.color = randomColor(c),
            this.over = false,
            this.x = 0,
            this.y = 0,
            this.sx = 0,
            this.sy = 0,
            this.loop = {
                r: this.r,
                minR: this.r,
                maxR: this.r + 10,
                color: randomColor(),
                zoom: true
            };
    },
    setColor: function(color) {
        this.color = color;
    },
    setSpeed: function() {
        if (this.x > game.stageW) {
            this.sx = -randomFloor(0, bollspeed);
            this.sy = randomFloor(-bollspeed, bollspeed);
        }
        if (this.x < 0) {
            this.sx = randomFloor(0, bollspeed);
            this.sy = randomFloor(-bollspeed, bollspeed);
        }
        if (this.y > game.stageH) {
            this.sx = randomFloor(-bollspeed, bollspeed);
            this.sy = -randomFloor(0, bollspeed);
        }
        if (this.y < 0) {
            this.sx = randomFloor(-bollspeed, bollspeed);
            this.sy = randomFloor(0, bollspeed);
        }

    },
    setPosition: function() {
        var num = randomNum(0, 3);
        switch (num) {
            case 0:
                // 从上面
                this.x = randomNum(-this.r, game.stageW + this.r);
                this.y = -this.r;
                break;
            case 1:
                // 从右面
                this.x = game.stageW + this.r;
                this.y = randomNum(-this.r, game.stageH + this.r);

                break;
            case 2:
                // 从下面
                this.x = randomNum(-this.r, game.stageW + this.r);
                this.y = game.stageH + this.r;
                break;

            case 3:
                // 左边
                this.x = -this.r;
                this.y = randomNum(-this.r, game.stageH + this.r);
                break;
        }
    },
    Move: function() {
        this.x = this.x + this.sx;
        this.y = this.y + this.sy;
    },
    checkOver: function() {
        var rightOver = this.x > game.stageW + this.r;
        var leftOver = this.x < -this.r;
        var bottomOver = this.y > game.stageH + this.r;
        var topOver = this.y < -this.r;
        this.over = rightOver || leftOver || topOver || bottomOver;
    },
    checkBox: function(o, callBack) {
        // 只对本体进行碰撞测试
        var s = Math.sqrt((this.x - o.x) * (this.x - o.x) + (this.y - o.y) * (this.y - o.y));
        if (s < this.r + o.r && !this.over) {
            // 反回一个true回调
            callBack(true);
        }
    },
    setXY: function(x, y) {
        this.x = x;
        this.y = y;
    }
}
Boll.prototype.init.prototype = Boll.prototype;
// 球的类END

// canvas长宽初始化
// 自适应的量 PC端3:2
// 我们UI出的图是750, 以iphone6为标准;
// 所以 375 / 750 = clientWidth / x;
gWinHeight = document.body.clientHeight;
gWinWidth = document.body.clientWidth;

// 元素大小自适应转换
function sizeChange(orinSize) {
    var x = 0;
    x = (gWinHeight * orinSize) / 937;
    return x;

}
if (gWinWidth > 992 || gWinWidth >= (gWinHeight / 1.5)) {
    var sWidth = gWinHeight / 1.5;
    game.stageW = sWidth;
    game.stageH = gWinHeight;
    game.center.x = sWidth / 2;
    game.center.y = gWinHeight / 2;
    game.ruler = gWinHeight;

} else if (gWinWidth > 460) {
    console.log(gWinWidth, gWinHeight);
    gWinHeight = gWinWidth * 1.5;
    game.stageW = gWinWidth;
    game.stageH = gWinHeight;
    game.center.x = gWinWidth / 2;
    game.center.y = gWinHeight / 2;
    game.ruler = gWinWidth;
    game.rulueStyle = 'width';
} else {
    game.stageW = gWinWidth;
    game.stageH = gWinHeight;
    game.center.x = gWinWidth / 2;
    game.center.y = gWinHeight / 2;
    gWinHeight = gWinWidth * 1.5;
}
canvas.width = game.stageW;
canvas.height = game.stageH;
// canvas长宽初始化End

// 圆心坐标 半径 颜色 是否填充
function drawCircle(x, y, r, color, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}
// 准备场景
// 绘制背景
function drawBg() {
    ctx.fillStyle = "#eaeaea";
    ctx.fillRect(0, 0, game.stageW, game.stageH);
}
var a = {
    r: sizeChange(105),
    maxR: sizeChange(105),
    minR: sizeChange(95),
    zoom: false,
    color: randomColor()
};
var b = {
    r: sizeChange(55),
    maxR: sizeChange(55),
    minR: sizeChange(45),
    zoom: false,
    color: randomColor()
};
// 伸缩函数
function updateZoom(obj) {
    if (!obj.zoom) {
        obj.r -= 0.3;
        obj.zoom = obj.r <= obj.minR ? true : false;
    } else {
        obj.r += 0.3;
        obj.zoom = obj.r >= obj.maxR ? false : true;
    }
    // drawCircle(game.center.x, game.center.y, obj.r, "red", true);
}
var startBtn = {
    name: 'start_btn_png',
    x: file.start_btn_png.x,
    y: file.start_btn_png.y,
    w: file.start_btn_png.w,
    h: file.start_btn_png.h,
    offX: sizeChange(120),
    offY: sizeChange(585),
    offH: sizeChange(50),
    offW: sizeChange(415)
}


function drawBtn(obj) {
    ctx.drawImage(
        img,
        obj.x,
        obj.y,
        obj.w,
        obj.h,
        obj.offX,
        obj.offY,
        obj.offW,
        obj.offH
    );
}

function ready() {
    // 更新两个小球 半径
    updateZoom(a);
    updateZoom(b);
    // 画出两个小球
    drawCircle(game.center.x - a.minR, game.center.y - a.maxR, a.r, a.color, true);
    drawCircle(game.center.x + b.minR, game.center.y - b.maxR, b.r, b.color, true);
    // 绘制按钮
    drawBtn(startBtn);
}

// 所有球球数组
var segements = [];
// 帧数
var frames = 0;
var score = 0;
// 开始游戏部分
// 创建本体小球
var ourBoll = Boll(5, 5, 1);
ourBoll.setXY(game.center.x, game.center.y);

function start() {

    frames++;
    // 更新我方小球 圆环动画
    updateZoom(ourBoll.loop);
    // 画本体
    drawCircle(ourBoll.x, ourBoll.y, ourBoll.r, ourBoll.color, true);
    drawCircle(ourBoll.x, ourBoll.y, ourBoll.loop.r, ourBoll.loop.color, false);
    if (!(frames % 10)) {
        var boll = Boll(ourBoll.r - 3, ourBoll.r + 10);
        boll.setPosition();
        boll.setSpeed();
        segements.push(boll);
    }
    segements.forEach(function(e, i) {
        // 移动所有 小球
        e.Move();
        drawCircle(e.x, e.y, e.r, e.color, true);


        // 检测碰撞
        e.checkBox(ourBoll, function(hit) {
                if (hit) {
                    if (e.r > ourBoll.r) {
                        // 进入游戏结束
                        gameover();
                        game.over = true;
                        return

                    } else {
                        e.die = true;
                        ourBoll.r += sizeChange(0.5);
                        score++
                    }
                }
            })
            // 检测超出视野的球
        e.checkOver();
    });
    // 删除数组里面已经超出的球球
    segements.forEach(function(boll, index) {
        if (boll.over || boll.die) {
            segements.splice(index, 1);
            // console.log('shanchu');
        }
    });

    // 更新得分
    ctx.font = "" + sizeChange(30) + "px Arial";
    ctx.fillStyle = "#333333";
    ctx.fillText(score, 10, 50);


}
var again_btn_png;

function scoreShow() {
    var balance_base_bg_png = {
        x: file.balance_base_bg_png.x,
        y: file.balance_base_bg_png.y,
        w: file.balance_base_bg_png.w,
        h: file.balance_base_bg_png.h,
        offX: sizeChange(25),
        offY: sizeChange(190),
        offH: sizeChange(500),
        offW: sizeChange(585)
    }
    again_btn_png = {
        x: file.again_btn_png.x,
        y: file.again_btn_png.y,
        w: file.again_btn_png.w,
        h: file.again_btn_png.h,
        offX: sizeChange(240),
        offY: sizeChange(725),
        offH: sizeChange(70),
        offW: sizeChange(190)
    }
    drawBtn(balance_base_bg_png);
    drawBtn(again_btn_png);

    ctx.font = "" + sizeChange(30) + "px Arial";
    ctx.fillStyle = "#333333";
    ctx.fillText(score, sizeChange(313), sizeChange(540));
}

function gameover() {
    clearInterval(id);
    scoreShow();
    if (localStorage.score) {
        var sum = 0;
        var beforeSum = 0;
        var oldArr = JSON.parse(localStorage.score);
        var rank = 0;
        // 循环数组
        for (var i = 0; i < oldArr.length; i++) {
            // 检查每一个得分数组对象
            for (key in oldArr[i]) {
                console.log('11');

                sum += Number(oldArr[i][key]);
                console.log('11', sum);
                // console.log(key);
                if (key < score) {
                    // 标记否到了自己的分段
                    beforeSum += Number(oldArr[i][key]);
                }
                if (key == score) {
                    console.log('22', sum + '   ' + beforeSum);
                    oldArr[i][key]++;
                    localStorage.score = JSON.stringify(oldArr);
                    break;
                }
            }
        }

        if (beforeSum && sum) {
            rank = parseInt((beforeSum / (sum + 1)) * 100) + '%';
        } else {
            rank = '0 %'
        }

        ctx.font = "" + sizeChange(30) + "px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText(rank, sizeChange(325), sizeChange(680));




        var newScore = {};
        newScore[score] = 1;
        oldArr.push(newScore);

        // 数据按照对象键名排序
        oldArr.sort(function(a, b) {
            for (keya in a) {
                for (keyb in b) {
                    return Number(keya) - Number(keyb);
                }
            }
        });
        // console.log(oldArr);


        // 新数组写入本地存储
        localStorage.score = JSON.stringify(oldArr);

        // 计算超过百分比
    } else {
        // console.log("第一次");
        var newScore = {};
        newScore[score] = 1;
        localStorage.score = JSON.stringify([newScore]);
    }

}
var bollspeed = 2;



var id = setInterval(function() {
        drawBg();
        if (!game.start) {
            ready();
        } else {
            // console.log('11');
            start();
        }

    }, 30)
    // 点击按钮事件
canvas.onclick = function(e) {
    // 准备页面的进入
    if (e.offsetX > startBtn.offX && e.offsetX < (startBtn.offW + startBtn.offX) && e.offsetY > startBtn.offY && e.offsetY < (startBtn.offH + startBtn.offY)) {
        game.start = true;

    }

    //游戏开始
    if (Math.abs(e.offsetX - game.center.x) < sizeChange(15) && Math.abs(e.offsetY - game.center.y) < sizeChange(15)) {

        canvas.onmousemove = function(event) {
            // console.log(event.offsetX, event.offsetY);
            // 根据鼠标移动位置 更新我方 位置
            ourBoll.x = event.offsetX;
            ourBoll.y = event.offsetY;
        };
    }

    if (navigator.maxTouchPoints) {
        canvas.ontouchmove = function(event) {
            // console.log(event);
            ourBoll.x = event.touches[0].pageX;
            ourBoll.y = event.touches[0].pageY;
        };
    }
    // again
    if (game.over && e.offsetX > again_btn_png.offX && e.offsetX < (again_btn_png.offW + again_btn_png.offX) && e.offsetY > again_btn_png.offY && e.offsetY < (again_btn_png.offH + again_btn_png.offY)) {
        location.reload();
    }

}