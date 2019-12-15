//  https://api.ixiaowai.cn/api/api.php?return=json
var pageNum = 1;


function getNew(sum) {
    sum = sum == null ? 8 : sum;
    console.log(sum);

    $.ajax({
        type: "POST", //默认get
        url: "https://api.apiopen.top/getWangYiNews", //默认当前页
        data: {
            page: pageNum,
            count: sum
        }, //格式{key:value}
        dataType: "json",
        beforeSend: function() {
            // 插入loadding动画
            // $('.loadding-box').fadeIn(300);
        },
        success: function(response, status, xhr) { //请求成功回调
            add(response.result);

            pageNum++

        },
        error: function(xhr, status, error) { //请求超时回调
            if (e.statusText == "timeout") {
                alert("请求超时");
            }
        },
        complete: function(xhr, status) {
            // $('.loadding-box').fadeOut(300);
            console.log(status)
        }, //无论请求是成功还是失败都会执行的回调，常用全局成员的释放，或者页面状态的重置
    });
}

function add(params) {
    let flag = -1;
    $.each(params, (index, element) => {
        flag = index % 2 == 0 ? 'fadeInLeftBig' : 'fadeInRightBig';
        $('.main').append(`<div class="new-iteam ${flag} wow" data-wow-delay="0.1s">
        <a href="" class="img-box">
            <img src="${element.image}" alt="">
        </a>
        <div class="right">
            <p class="title">${element.title}</p>
            <h5 class="time">${element.passtime}</h5>
            <a href=${element.path} >了解详情</a>
        </div>
        </div>`)
    })
}
// 节流函数
function throttle(func, wait, type) {
    if (type === 1) {
        var previous = 0;
    } else if (type === 2) {
        var timeout;
    }
    return function() {
        let context = this;
        let args = arguments;
        if (type === 1) {
            let now = Date.now();

            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        } else if (type === 2) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(context, args)
                }, wait)
            }
        }
    }
}

// 滚动事件
document.onscroll = (throttle((e) => {
    console.log(window);
    let main = $('.main')[0];
    let view = Number(pageYOffset + innerHeight);
    let iteamH = main.clientHeight + main.offsetTop - 800;

    if (view > iteamH) {
        getNew(4);
    }

}, 500, 2))



$(function() {
    getNew();

});