//创建连接
var connection = new WebIM.connection({
    url: WebIM.config.xmppURL
});

// console.log('connection ==> ', connection);
//我的id
var myid = null;

//申请人
var applyid = null;

//保存好友花名册
var allRoster = null;

//监听
connection.listen({

    //监听用户登录
    onOpened: function(message) {
        console.log('message ==> ', message);
        console.log('登录成功');

        //获取好友列表
        connection.getRoster({

            success: function(roster) {

                //获取本地存储聊天记录
                var chatMsg = localStorage.getItem(myid);

                chatMsg = chatMsg ? JSON.parse(chatMsg) : [];
                console.log('chatMsg ==> ', chatMsg);
                console.log('roster ==> ', roster);
                //roster: 好友花名册
                allRoster = roster;
                //both: 双方都是好友
                //to: 你是我的好友，你拉黑我
                //from: 我是你的好友，我拉黑你

                var fragment = document.createDocumentFragment();
                for (var i = 0; i < roster.length; i++) {

                    //添加好友消息字段
                    allRoster[i].allMsg = {};

                    if (chatMsg.length == 0) {
                        allRoster[i].allMsg[roster[i].name] = [];
                    } else {
                        for (var j = 0; j < chatMsg.length; j++) {
                            //查找当前好友的聊天信息
                            if (roster[i].name == chatMsg[j].name) {
                                allRoster[i].allMsg[roster[i].name] = chatMsg[j].allMsg[chatMsg[j].name];
                                break;
                            }
                        }
                    }

                    if (roster[i].name == WebIM.config.appkey) {
                        continue;
                    }

                    if (roster[i].subscription == 'both' || roster[i].subscription == 'to') {
                        //调用产生好友列表的函数
                        var li = createFriedList(roster[i].name);

                        fragment.appendChild(li);
                    }
                }

                //将fragment添加到 ul.innerbox
                getId('innerbox').appendChild(fragment);

                //好友列表事件
                addFriendListEvent();

                //将allRoster写入到本地存储中
                localStorage.setItem(myid, JSON.stringify(allRoster));

                console.log('allRoster ppp ==> ', allRoster);

            }

        })

    },

    //监听好友申请
    onPresence: function(e) {

        //（发送者希望订阅接收者的出席信息），即别人申请加你为好友
        if (e.type === 'subscribe') {
            //若e.status中含有[resp:true],则表示为对方同意好友后反向添加自己为好友的消息，demo中发现此类消息，默认同意操作，完成双方互为好友；如果不含有[resp:true]，则表示为正常的对方请求添加自己为好友的申请消息。
            console.log('有人加你为好友');

            //写入好友申请信息
            getId('uname').textContent = e.from;

            getId('uinfo').textContent = e.status;

            //显示好友申请框
            getId('friend-apply').style.display = 'block';

            //保存申请人id
            applyid = e.from;

        } else if (e.type === 'subscribed') {
            //(发送者允许接收者接收他们的出席信息)，即别人同意你加他为好友
            console.log('别人同意你的申请');

            //更新我的好友列表
            var li = createFriedList(e.from);
            //将li添加到 ul.innerbox
            getId('innerbox').appendChild(li);

            //好友列表事件
            addFriendListEvent();

            //构造新加好友
            var ros = {
                jid: e.fromJid,
                groups: [],
                name: e.from,
                subscription: 'both',
                allMsg: {}
            };

            //初始化当前好友消息列表
            ros.allMsg[e.from] = [];

            allRoster.push(ros);

            //写入本地存储
            localStorage.setItem(myid, JSON.stringify(allRoster));
            console.log('allRoster ==> ', allRoster);

        } else if (e.type === 'unsubscribe') {
            //（发送者取消订阅另一个实体的出席信息）,即删除现有好友

        } else if (e.type === 'unsubscribed') {
            //（订阅者的请求被拒绝或以前的订阅被取消），即对方单向的删除了好友

        }
    },

    //监听文本消息
    onTextMessage: function(message) {
        console.log('消息message ==> ', message);

        //保存聊天消息
        // 获取发消息人的id
        var sendMsgId = message.from;

        for (var i = 0; i < allRoster.length; i++) {
            if (allRoster[i].name == sendMsgId) {
                //保存当前好友发送的消息
                allRoster[i].allMsg[sendMsgId].push({
                    id: sendMsgId,
                    msg: message.data
                })
                break;
            }
        }

        var musci = getId('voice');
        if (musci.paused) { //判断音乐是否在播放中，暂停状态
            musci.play(); //音乐播放               
        }

        //创建他人气泡框 

        //			console.log(ul.children.length);

        var li_friend = document.querySelector('#innerbox>li[data-id="' + sendMsgId + '"]');
        console.log(li_friend.classList.contains('active'));
        if (li_friend.classList.contains('active') == false) {
            //显示当前列表的小点
            li_friend.classList.add('noRead');
        } else {

            //添加气泡框
            var div = creatOtherword(message.data);
            var cont = getId('chat-content');
            console.log('div==> ', div);
            cont.appendChild(div);
            //底部
            getId('chat-content').scrollTop = getId('chat-content').scrollHeight;
        }

        console.log('allRoster ==> ', allRoster);
        //写入本地存储
        localStorage.setItem(myid, JSON.stringify(allRoster));

    }

})

//创建单个好友列表
function createFriedList(rosterName) {
    var li = document.createElement('li');
    li.className = 'clearfix';
    li.dataset.id = rosterName;

    var str = `
  					<i class="line"></i>
            <div class="user-img fl">
              <img class="auto-img" src="./img/timg.gif" alt="">
            </div>
            <div class="fl user-text">
              <div class="user-name one-text">${rosterName}</div>
              <div class="one-text"></div>
            </div>`;

    li.innerHTML = str;
    //<div class="noRead"><div>
    return li;
}

//给好友列表添加点击事件
function addFriendListEvent() {
    //好友列表事件
    var lis = document.querySelectorAll('#innerbox>li');

    for (var i = 0; i < lis.length; i++) {
        lis[i].onclick = function() {
            if (this.className == 'clearfix active') {
                console.log('当前已是激活的');
                return;
            }

            getId('title').innerHTML = this.getAttribute('data-id');
            var activeLi = document.querySelector('#innerbox>li.active');
            if (activeLi) {
                activeLi.className = 'clearfix';
            }
            this.className = 'clearfix active';

            getId('chat-right').style.display = 'block';
            //清空聊天内容
            getId('chat-content').innerHTML = '';

            //显示消息 从allroster中取
            // 获取列表id
            var id = this.dataset.id;
            for (var i = 0; i < allRoster.length; i++) {
                if (allRoster[i].name == id) {
                    var msgData = allRoster[i].allMsg[id];

                    console.log('msgData ==> ', msgData);

                    //创建一个临时文档片段，减少DOM操作次数
                    var fragment = document.createDocumentFragment();
                    var div = null;
                    for (var j = 0; j < msgData.length; j++) {

                        if (id == msgData[j].id) {

                            //生成他人的气泡框
                            div = creatOtherword(msgData[j].msg);

                        } else {

                            //生成自己的气泡框
                            div = creatMyword(msgData[j].msg);

                        }

                        fragment.appendChild(div);

                    }

                    getId('chat-content').appendChild(fragment);

                    break;

                }
            }

            //滚动栏最低
            getId('chat-content').scrollTop = getId('chat-content').scrollHeight;

            //隐藏小红点
            this.classList.remove('noRead');

        }
    }
}
//创建他人气泡框
function creatOtherword(word) {
    var div = document.createElement('div');
    div.className = 'other clearfix';
    var str = `<div class="other-content fl clearfix">
								<div class="avatar fl">
									<img class="auto-img" src="img/timg.gif" alt="" />
								</div>
								<div class="fl bubble l-bubble">
									<i class="caret l-caret"></i> ${word}
								</div>
							</div>`;
    div.innerHTML = str;

    return div;

}

//创建自己的气泡框
function creatMyword(word) {
    var div = document.createElement('div');
    div.className = 'other clearfix';
    var str = `<div class="other-content fr clearfix">
								<div class="fl bubble r-bublle">
									<i class="caret r-caret"></i>
									${word}
								</div>
								<div class="avatar fl">
									<img class="auto-img" src="img/bb.jpg" alt="" />
								</div>
							</div>`;
    div.innerHTML = str;

    return div;

}

function getId(id) {
    return document.getElementById(id);
}
window.onload = function() {
    var inp = getId('input-content');
    inp.onfocus = function() {
        document.onkeydown = function(e) {
            if (e.keyCode == 13) {
                var textElem = getId('input-content');

                var sendMsg = textElem.innerHTML;

                console.log('sendMsg ==> ', sendMsg);

                //获取接收消息的用户id
                var userid = document.querySelector('#innerbox>li.active').dataset.id;

                var id = connection.getUniqueId(); // 生成本地消息id
                var msg = new WebIM.message('txt', id); // 创建文本消息
                msg.set({
                    msg: sendMsg, // 消息内容
                    to: userid, // 接收消息对象（用户id）
                    roomType: false,
                    success: function(id, serverMsgId) {
                        console.log('发送消息成功');

                        //清除输入文本内容
                        textElem.innerHTML = '';

                        //调用创建函数
                        var div = creatMyword(sendMsg);

                        getId('chat-content').appendChild(div);
                        //滚动到底
                        getId('chat-content').scrollTop = getId('chat-content').scrollHeight;

                        //保存自己发送的消息
                        for (var i = 0; i < allRoster.length; i++) {
                            if (allRoster[i].name == userid) {
                                console.log('执行');
                                allRoster[i].allMsg[userid].push({
                                    id: myid,
                                    msg: sendMsg
                                });
                                break;
                            }
                        }

                        //写入本地存储
                        localStorage.setItem(myid, JSON.stringify(allRoster));

                        console.log('allRoster 发送消息==> ', allRoster);

                    },
                    error: function() {

                        console.log('发送消息失败');

                    }
                });

                //单聊：singleChat
                msg.body.chatType = 'singleChat';

                //发送消息
                connection.send(msg.body);

            }
        }
    }

    //初始化聊天表情	

    function initFaces() {
        var faces = 35;
        var fragment = document.createDocumentFragment();
        for (var i = 1; i <= faces; i++) {
            var li = document.createElement('li');
            li.dataset.face = './img/face/ee_' + i + '.png';

            //创建图片对象
            var img = new Image();
            img.className = 'auto-img';
            img.src = './img/face/ee_' + i + '.png';

            li.appendChild(img);
            fragment.appendChild(li);
        }

        document.getElementsByClassName('faces')[0].appendChild(fragment);

        var facesLi = document.querySelectorAll('#ul-faces>li');
        for (var i = 0; i < facesLi.length; i++) {
            facesLi[i].onclick = function() {
                var faceUrl = this.dataset.face;
                var img = new Image();
                img.className = 'ff';
                img.src = faceUrl;
                img.style.width = '20px';
                img.style.height = '20px';

                console.log('img ==> ', img);

                getId('input-content').appendChild(img);
            }
        }
    }

    initFaces();

    //显示隐藏表情
    getId('faces-icons').onclick = function() {
            var ulfaces = getId('ul-faces');
            //设置name属性标记表情元素是否显示，name = 1表示显示
            if (ulfaces.getAttribute('name') == 1) {
                ulfaces.style.display = 'none';
                ulfaces.removeAttribute('name');
            } else {
                ulfaces.setAttribute('name', 1);
                ulfaces.style.display = 'block';
            }

        }
        //切换登录
    getId('gologin').onclick = function() {
        //进入登录页面
        getId('login-box').classList.remove('no');

        //隐藏注册页面
        getId('register-box').className = 'main no';
    }

    //切换注册
    getId('goregister').onclick = function() {
            //隐藏登录页面
            getId('register-box').classList.remove('no');

            //进入注册页面
            getId('login-box').className = 'main no';
        }
        // 切换注册
    this.getId('register').onclick = function() {
        //隐藏登录页面
        getId('register-box').classList.remove('no');

        //进入注册页面
        getId('login-box').className = 'main no';
    }

    //注册
    getId('register_btn').onclick = function() {

        var self = this;

        var username = getId('userName_register').value;
        var pwd = getId('pwd_register').value;
        var nickname = getId('nickname_register').value;

        this.textContent = '正在注册中...';

        //注册用户
        connection.registerUser({
            username: username,
            password: pwd,
            nickname: nickname,
            appKey: WebIM.config.appkey,

            //注册成功后执行的回调函数
            success: function(data) {
                //后台响应的数据
                console.log('data ==> ', data);

                self.textContent = '注册';

                //进入登录页面
                getId('login-box').style.display = 'block';

                //隐藏注册页面
                getId('register-box').style.display = 'none';

            },

            //注册失败后执行的回调函数
            error: function(err) {
                //后台响应的数据
                console.log('err ==> ', err);
                self.textContent = '注册';
            },

            apiUrl: WebIM.config.apiURL
        });
    }

    //登录
    getId('login').onclick = function() {

        var username = getId('userName').value;
        var pwd = getId('pwd').value;

        this.textContent = '正在登录中...';

        //用户登录
        connection.open({
            apiUrl: WebIM.config.apiURL,
            user: username,
            pwd: pwd,
            appKey: WebIM.config.appkey,
            //保存我的id

            //登录成功执行
            success: function(data) {
                console.log('data ==> ', data);
                self.textContent = '登录';
                getId('login-box').className = 'main no';
                getId('chat-box').style.display = 'block';
                myid = data.user.username;
            }
        });

    }

    //	添加好友
    getId('find_btn').onclick = function() {

        getId('add_friend').style.display = 'none';
        var userid = getId('add_inp').value;
        //发送添加好友请求
        connection.subscribe({
            to: userid,
            message: "嘤嘤嘤,一起来van♂啊!"
        });

    }

    //同意好友申请
    getId('agree').onclick = function() {

        //同意好友申请
        connection.subscribed({
            to: applyid,
            message: '[resp:true]'
        });

        getId('friend-apply').style.display = 'none';

    }

    //发送消息
    getId('send').onclick = function() {
        var textElem = getId('input-content');

        var sendMsg = textElem.innerHTML;

        console.log('sendMsg ==> ', sendMsg);

        //获取接收消息的用户id
        var userid = document.querySelector('#innerbox>li.active').dataset.id;

        var id = connection.getUniqueId(); // 生成本地消息id
        var msg = new WebIM.message('txt', id); // 创建文本消息
        msg.set({
            msg: sendMsg, // 消息内容
            to: userid, // 接收消息对象（用户id）
            roomType: false,
            success: function(id, serverMsgId) {
                console.log('发送消息成功');

                //清除输入文本内容
                textElem.innerHTML = '';

                //调用创建函数
                var div = creatMyword(sendMsg);

                getId('chat-content').appendChild(div);
                //滚动到底
                getId('chat-content').scrollTop = getId('chat-content').scrollHeight;

                //保存自己发送的消息
                for (var i = 0; i < allRoster.length; i++) {
                    if (allRoster[i].name == userid) {
                        console.log('执行');
                        allRoster[i].allMsg[userid].push({
                            id: myid,
                            msg: sendMsg
                        });
                        break;
                    }
                }

                //写入本地存储
                localStorage.setItem(myid, JSON.stringify(allRoster));

                console.log('allRoster 发送消息==> ', allRoster);

            },
            error: function() {

                console.log('发送消息失败');

            }
        });

        //单聊：singleChat
        msg.body.chatType = 'singleChat';

        //发送消息
        connection.send(msg.body);
    }

}