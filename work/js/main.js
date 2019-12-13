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
// 滚动监听事件
document.onscroll = (throttle((e) => {
    if (pageYOffset > 50) {
        $('.header').addClass("down");
    } else {
        $('.header').removeClass("down");
    }

}, 500, 2))