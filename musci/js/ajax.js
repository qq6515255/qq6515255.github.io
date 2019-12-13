function callback(params) {
    console.log(params.data.song.list);
    netList = params.data.song.list;
    $('#ch-list').html('');
    params.data.song.list.forEach(function(e, index) {
        netList[index].bgImg = 'http://imgcache.qq.com/music/photo/album_300/17/300_albumpic_' + e.albumid + '_0.jpg'
        $('#ch-list').append('<li class="wow rubberBand" data-index=' + index + '> <span class = "songId left" > ' + Number(index + 1) +
            ' </span> <span class = "fa fa-heart-o left" > </span> <span class = "list-songName left" >' + e.songname + ' </span> <span class = "list-songAuthor left" >' + e.singer[0].name + ' </span> <span class = "list-songSum left" >' + e.albumname + ' </span> </li>')
    });
}

$('#input').bind('change', function(e) {
    $.ajax({
        type: "GET", //默认get
        url: "https://c.y.qq.com/soso/fcgi-bin/client_search_cp", //默认当前页
        data: {
            p: 1,
            n: 30,
            w: this.value,
            aggr: 1,
            cr: 1,
            flag_qc: 0
        },
        dataType: "jsonp",
        jsonpCallback: 'callback',
        success: function(response) { //请求成功回调
            console.log('数据返回成功');

        },
        error: function(e) {

        }

    });

});

$('#btn').bind('search', function(e) {
    $.ajax({
        type: "GET", //默认get
        url: "https://c.y.qq.com/soso/fcgi-bin/client_search_cp", //默认当前页
        data: {
            p: 1,
            n: 30,
            w: this.value,
            aggr: 1,
            cr: 1,
            flag_qc: 0
        },
        dataType: "jsonp",
        jsonpCallback: 'callback',
        success: function(response) { //请求成功回调
            console.log('数据返回成功');
        },

    });

});

//AJAX获取歌的方法
// function getSongs(url, page, count, word) {
//     return new Promise((resolve, reject) => {
//         $.ajax({
//             type: "GET", //默认get
//             url: url, //默认当前页
//             data: {
//                 p: page,
//                 n: count,
//                 w: word,
//                 aggr: 1,
//                 cr: 1,
//                 flag_qc: 0
//             },
//             dataType: "jsonp",
//             // jsonpCallback: 'callback',
//             // beforeSend: () => {}, //请求发送前回调,常用验证
//             // success: (response) => { //请求成功回调
//             //     resolve(response.result)
//             // },
//             error: (e) => { //请求超时回调
//                 reject(e)
//             },
//         })
//     })
// }