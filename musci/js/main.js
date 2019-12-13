var music = {
        data: [{
                albumid: 1,
                songname: '打上花火',
                singer: [{ id: 66666, name: 'DAOKO,米津玄師' }],
                songUrl: './music/DAOKO,米津玄師 - 打上花火.mp3',
                bgImg: './img/21a4462309f7905278c0209a07f3d7ca7acbd5b3.jpg',
                albumname: ''
            },
            {
                albumid: 2,
                songname: 'キリマンジャロだね',
                singer: [{ id: 55555, name: '川田瑠夏' }],
                songUrl: './music/川田瑠夏 - キリマンジャロだね.mp3',
                bgImg: './img/6626756582033872.jpg',
                albumname: ''
            }
        ]

    }
    // 时间处理
function formatTime(seconds) {
    return [
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
        ]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
}
//判断当前歌的索引
var songNum = {
    local: -1,
    net: -1
};
var online = false;

var netList = {};
// ES6对象长度判断，会返回一个返回值也是对象中属性名组成的数组
// console.log(Object.keys(netList).length);

//加载歌单
$.each(music.data, function(i, e) {
    $('#list-ul').append('<li><span class="songId left">' + e
        .albumid + '</span><span class="fa fa-heart-o left"></span><span class="list-songName left">' + e
        .songname + '</span><span class="list-songAuthor left">' + e.singer[0].name + '</span></li>');
})

// audio标签
var audio = $("audio")[0];

class Progress {
    constructor($mainLine, $ball, $activeLine) {
            this.$mainLine = $mainLine;
            this.$ball = $ball;
            this.$activeLine = $activeLine;
        }
        // 初始化函数
    progressMove(callBack) {
        // console.log(this.$voiceLine);
        var $this = this;
        this.$mainLine.mousedown((e) => {
            this.isMove = true;

            var ox = $(e.currentTarget).offset().left;
            $(document).mousemove((e) => {
                var left = (e.pageX - ox) * 100 / this.$mainLine.width();
                if (left > 100) {
                    left = 100;
                } else if (left < 0) {
                    left = 0;
                }
                var present = left / 100;
                // 声量百分比
                // left - ($('.voice-line .ball').width()) + 'px'
                this.$ball.css('left', left + '%').css('left', '-=' + this.$ball.width() + 'px');
                this.$activeLine.width(left + '%');
                // audio.volume = present;
                // 回调函数
                callBack(left);
            })
        });
        $(document).mouseup(() => {
            this.isMove = false;
            $(document).off('mousemove');
        });
    }

    progressClick(callBack) {

        this.isMove = true;

        this.$mainLine.click((e) => {

            var ox = $(e.currentTarget).offset().left;
            var left = (e.pageX - ox) * 100 / this.$mainLine.width();
            if (left > 100) {
                left = 100;
            } else if (left < 0) {
                left = 0;
            }
            this.$ball.css('left', left + '%').css('left', '-=' + this.$ball.width() + 'px');
            this.$activeLine.width(left + '%');
            callBack(left);
        });
        this.isMove = false;
    }

    setProgress(left) {
        if (this.isMove) {
            return
        }
        this.$ball.css('left', left * 100 + '%');
        this.$activeLine.width(left * 100 + '%');
    }



}



// 按钮事件绑定函数
function playBtn() {
    $('#play-btn').click(function(e) {
        e.preventDefault();
        var x = document.getElementById('mu');

        if ($(this).hasClass('fa-play-circle')) {
            playSong();
            // 绑定时间时间
        } else {
            $(this).addClass("fa-play-circle").removeClass("fa-pause-circle");
            $('.cd-heard').removeClass('play');
            $('.music-img').removeClass('play');
            $('#mu')[0].pause();
        }
    });

    // 点击本地歌单
    $("#list-ul li").click(function() {
        current = $(this).index();
        playControl(this);
        playSong(current);
        online = false;
    });
    // 点击在线歌单
    $('#ch-list').delegate('li', 'click', function() {
        online = true;
        // 获取url拼接的链接
        // console.log(this.dataset.index);
        // playControl(this);
        let index = this.dataset.index;
        var token = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq&cid=205361747&songmid=' + netList[this.dataset.index].
        songmid + '&filename=C400' + netList[this.dataset.index].
        songmid + '.m4a&guid=126548448';
        // 判断是否获取过src 获取过直接播放
        if (netList[index].songUrl) {
            playSong(index, true);
        } else {
            $.ajax({
                type: "GET", //默认get
                url: token, //默认当前页
                dataType: "jsonp",
                beforeSend: function() {
                    console.log('索取vkey');
                }, //请求发送前回调,常用验证
                success: function(response) { //请求成功回调
                    if (response.data.items[0].vkey.length > 20) {
                        console.log('成功获取vkey');
                        let src = 'http://ws.stream.qqmusic.qq.com/C400' + netList[index].
                        songmid + '.m4a?fromtag=0&guid=126548448&vkey=' + response.data.items[0].vkey + '';
                        netList[index].songUrl = src;
                        playSong(index, true);

                    } else {
                        alert('此歌不能播放哦')
                    }

                },
                error: function(e) { //请求超时回调
                    if (e.statusText == "timeout") {
                        alert("请求超时");
                    }
                },
                complete: function() {
                    console.log('请求完成');
                }, //无论请求是成功还是失败都会执行的回调，常用全局成员的释放，或者页面状态的重置
            });
        }

    }).find('li').triggerHandler('click');
    // 关键click事件的持有者
    //上一首
    $('#backward').click(function(e) {

        let flagUP = songNum.net;
        if (online) {
            if (songNum.net - 1 < 0) {
                flagUP = $("#ch-list li").length - 1;
            } else {
                flagUP--;
            }
            $($("#ch-list li")[flagUP]).trigger('click');


        } else {
            if (songNum.local - 1 < 0) {
                songNum.local = $("#list-ul li").length - 1;
            } else {
                songNum.local--;
            }

            playSong(songNum.local);
        }

    });

    //下一首
    $('#forward').click(function(e) {
        let flagDown = -1;
        flagDown = Number(songNum.net);

        // 在线播放
        if (online) {
            if ((flagDown + 1) > ($("#ch-list li").length - 1)) {
                flagDown = 0;
            } else {
                flagDown++;
            }

            $($("#ch-list li")[flagDown]).trigger('click');

        } else {
            if (songNum.local + 1 > $("#list-ul li").length - 1) {
                songNum.local = 0;
            } else {
                songNum.local++;
            }
            playSong(songNum.local);
        }

    });

}

// 列表激活事件
function playControl(obj) {
    $('#list-ul li').removeClass('active1');
    $('#ch-list li').removeClass('active1');
    $(obj).addClass('active1');
}

// 播放事件
function playSong(i, netPlay) {
    let musicObj = {};
    let flag = 0;


    flag = i ? i : 0;

    if (netPlay) {
        musicObj = {
            songname: netList[i].songname,
            bgImg: netList[i].bgImg,
            singer: netList[i].singer[0].name,
            albumname: netList[i].albumname,
            songUrl: netList[i].songUrl
        }
    } else {
        musicObj = {
            songname: music.data[flag].songname,
            bgImg: music.data[flag].bgImg,
            singer: music.data[flag].singer[0].name,
            albumname: music.data[flag].albumname,
            songUrl: music.data[flag].songUrl
        }
    }
    //判断播放按钮状态
    if ($('#play-btn').hasClass('fa-play-circle')) {
        $('.music-img').addClass('play');
        $('.cd-heard').addClass('play');
        $('#play-btn').addClass("fa-pause-circle").removeClass("fa-play-circle");
    }
    // 第一次播放默认播放第一个
    if (i == null && songNum.local == -1 && songNum.net == -1) {
        $(audio).attr('src', music.data[0].songUrl);
        $('.music-img').find('img').attr('src', music.data[0].bgImg);
        $('.songName').html(music.data[0].songname);
        $('.songAuthor').html(music.data[0].singer[0].name);
        $('.bg-bulr').css('backgroundImage', 'url(' + music.data[0].bgImg + ')')
        playControl($('#list-ul li')[0]);
        songNum.local = 0;
    } else if (i != null) {
        if (netPlay) {
            songNum.net = i;
            playControl($('#ch-list li')[i]);
        } else {
            songNum.local = i;
            online = false;
            playControl($('#list-ul li')[i]);
        }

        $(audio).attr('src', musicObj.songUrl);
        $('.music-img').find('img').attr('src', musicObj.bgImg);
        $('.songName').html(musicObj.songname);
        $('.songAuthor').html(musicObj.singer);
        $('.bg-bulr').css('backgroundImage', 'url(' + musicObj.bgImg + ')')
            // console.log('除第一以外的播放', musicObj);

    }
    audio.play();
    console.log(songNum);
}


// 用于拖动时的截停
var flag = false;
var playModel = 3;
// 歌曲类事件监听
audio.ontimeupdate = function(e) {
    $('.now-time').html(formatTime(this.currentTime));
    // $('.end-time').html(formatTime(this.duration));
    if (this.duration != NaN && this.currentTime != NaN) {
        progressMain.setProgress(this.currentTime / this.duration);
    }
}

audio.onloadedmetadata = function() {
    $('.end-time').html(formatTime(this.duration));
}


//播放模式
// audio.onended = function() {
//     console.log(songNum, 'num');
//     console.log(($('#list-ul').length - 1), 'long');

//     // 列表循环
//     if (playModel == 1) {
//         $('audio')[0].loop = false;
//         $('#forward').triggerHandler("click")
//     } else if (playModel == 2) {
//         $('audio')[0].loop = true;
//         // 单曲循环
//     } else if (playModel == 3) {
//         // 列表单次
//         if ((songNum + 1) > ($('#list-ul').length - 1)) {
//             return;
//         } else {
//             $('#forward').triggerHandler("click")
//         }
//     }
// }


//初始化函数

playBtn();
//  构建音量滑动条类
var progress = new Progress($('.right-box .voice-line'), $('.right-box .ball'), $('.right-box .active-line'));
var progressMain = new Progress($('.lineBox .song-line'), $('.lineBox .ball'), $('.lineBox .active-line'));
// 音量条实例
progress.progressMove(function(left) {
    audio.volume = left / 100;
});
progress.progressClick(function(left) {
    audio.volume = left / 100;
});

// 进度条实例
progressMain.progressMove(function(left) {
    var long = Math.floor((left * 100)) / 100;
    audio.currentTime = long * audio.duration / 100;
});
progressMain.progressClick(function(left) {
    var long = ((left * 100)) / 100;
    audio.currentTime = long * audio.duration / 100;
});


window.onload = function() {

    var card = document.querySelector('#card');
    // this.console.log(music.data[0].songUrl);
    document.addEventListener("mousemove", function(e) {
        var x = e.screenX - ($(this).width() / 2);
        var y = e.screenY - ($(this).height() / 2);
        card.style.transform = 'rotateX(' + -y / 80 + 'deg) rotateY(' + x / 150 + 'deg) ';
    });


}　