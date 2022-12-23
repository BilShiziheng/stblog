
const commentBarrageConfig = {
    //ǳɫģʽ����ɫģʽ��ɫ����ر���һ�³��ȣ�ǰ���Ǳ�����ɫ�����������壬���ѡ��Ĭ�������ɫ����
    lightColors: [
        ['var(--lyx-white-acrylic2)', 'var(--lyx-black)'],
    ],
    darkColors: [
        ['var(--lyx-black-acrylic2)', 'var(--lyx-white)'],
    ],
    //ͬʱ�����ʾ��Ļ��
    maxBarrage: 1,
    //��Ļ��ʾ���ʱ�䣬��λms
    barrageTime: 3000,
    //twikoo�����ַ��Vercel��˽�в��𣩣���Ѷ�Ƶ�Ϊ����ID
    twikooUrl: "https://twikoo-bay-ten.vercel.app",
    //token��ȡ��ǰ��
    accessToken: "1e093d69d3ed0f9617a464786f1b41a9",
    pageUrl: window.location.pathname,
    barrageTimer: [],
    barrageList: [],
    barrageIndex: 0,
    // û�����ù�ͷ��ʱ���ص�Ĭ��ͷ�񣬼�cravatar�ĵ� https://cravatar.cn/developers/api�����Բ����������
    noAvatarType: "retro",
    dom: document.querySelector('.comment-barrage'),
    //�Ƿ�Ĭ����ʾ���Ե�Ļ
    displayBarrage: true,
    //ͷ��cdn��Ĭ��cravatar
    avatarCDN: "cravatar.cn",
}

function isInViewPortOfOne(el) {
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    const offsetTop = el.offsetTop
    const scrollTop = document.documentElement.scrollTop
    const top = offsetTop - scrollTop
    return top <= viewPortHeight
}
document.onscroll = function () {
    if (commentBarrageConfig.displayBarrage) {
        if (isInViewPortOfOne(document.getElementById("post-comment"))) {
            document.getElementsByClassName("comment-barrage")[0].setAttribute("style", `display:none;`)
        }
        else {
            document.getElementsByClassName("comment-barrage")[0].setAttribute("style", "")
        }
    }
}
function initCommentBarrage() {
    var data = JSON.stringify({
        "event": "COMMENT_GET",
        "commentBarrageConfig.accessToken": commentBarrageConfig.accessToken,
        "url": commentBarrageConfig.pageUrl
    });
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            commentBarrageConfig.barrageList = commentLinkFilter(JSON.parse(this.responseText).data);
            commentBarrageConfig.dom.innerHTML = '';
        }
    });
    xhr.open("POST", commentBarrageConfig.twikooUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    setInterval(() => {
        if (commentBarrageConfig.barrageList.length) {
            popCommentBarrage(commentBarrageConfig.barrageList[commentBarrageConfig.barrageIndex]);
            commentBarrageConfig.barrageIndex += 1;
            commentBarrageConfig.barrageIndex %= commentBarrageConfig.barrageList.length;
        }
        if (commentBarrageConfig.barrageTimer.length > (commentBarrageConfig.barrageList.length > commentBarrageConfig.maxBarrage ? commentBarrageConfig.maxBarrage : commentBarrageConfig.barrageList.length)) {
            removeCommentBarrage(commentBarrageConfig.barrageTimer.shift())
        }
    }, commentBarrageConfig.barrageTime)

}
function commentLinkFilter(data) {
    data.sort((a, b) => {
        return a.created - b.created;
    })
    let newData = [];
    data.forEach(item => {
        newData.push(...getCommentReplies(item));
    });
    return newData;
}
function getCommentReplies(item) {
    if (item.replies) {
        let replies = [item];
        item.replies.forEach(item => {
            replies.push(...getCommentReplies(item));
        })
        return replies;
    } else {
        return [];
    }
}
function popCommentBarrage(data) {
    let barrage = document.createElement('div');
    let width = commentBarrageConfig.dom.clientWidth;
    let height = commentBarrageConfig.dom.clientHeight;
    barrage.className = 'comment-barrage-item'
    let ran = Math.floor(Math.random() * commentBarrageConfig.lightColors.length)
    document.getElementById("barragesColor").innerHTML = `[data-theme='light'] .comment-barrage-item { background-color:${commentBarrageConfig.lightColors[ran][0]};color:${commentBarrageConfig.lightColors[ran][1]}}[data-theme='dark'] .comment-barrage-item{ background-color:${commentBarrageConfig.darkColors[ran][0]};color:${commentBarrageConfig.darkColors[ran][1]}}`;

    barrage.innerHTML = `
        <div class="barrageHead">
            <img class="barrageAvatar" src="https://${commentBarrageConfig.avatarCDN}/avatar/${data.mailMd5}?d=${commentBarrageConfig.noAvatarType}"/>
            <div class="barrageNick">${data.nick}</div>
            <a href="javascript:switchCommentBarrage()" style="font-size:20px">��</a>
        </div>
        <div class="barrageContent">${data.comment}</div>
    `
    commentBarrageConfig.barrageTimer.push(barrage);
    commentBarrageConfig.dom.append(barrage);
}
function removeCommentBarrage(barrage) {
    barrage.className = 'comment-barrage-item out';

    if (commentBarrageConfig.maxBarrage != 1) {
        setTimeout(() => {
            commentBarrageConfig.dom.removeChild(barrage);
        }, 1000)
    } else {
        commentBarrageConfig.dom.removeChild(barrage);
    }
}
switchCommentBarrage = function () {
    localStorage.setItem("isBarrageToggle", Number(!Number(localStorage.getItem("isBarrageToggle"))))
    if (!isInViewPortOfOne(document.getElementById("post-comment"))) {
        commentBarrageConfig.displayBarrage = !(commentBarrageConfig.displayBarrage);
        let commentBarrage = document.querySelector('.comment-barrage');
        if (commentBarrage) {
            $(commentBarrage).fadeToggle()
        }
    }
}
$(".comment-barrage").hover(function () {
    clearInterval(timer);
}, function () {
    timer = setInterval(() => {
        if (commentBarrageConfig.barrageList.length) {
            popCommentBarrage(commentBarrageConfig.barrageList[commentBarrageConfig.barrageIndex]);
            commentBarrageConfig.barrageIndex += 1;
            commentBarrageConfig.barrageIndex %= commentBarrageConfig.barrageList.length;
        }
        if (commentBarrageConfig.barrageTimer.length > (commentBarrageConfig.barrageList.length > commentBarrageConfig.maxBarrage ? commentBarrageConfig.maxBarrage : commentBarrageConfig.barrageList.length)) {
            removeCommentBarrage(commentBarrageConfig.barrageTimer.shift())
        }
    }, commentBarrageConfig.barrageTime)
})
if (localStorage.getItem("isBarrageToggle") == undefined) {
    localStorage.setItem("isBarrageToggle", "0");
} else if (localStorage.getItem("isBarrageToggle") == "1") {
    localStorage.setItem("isBarrageToggle", "0");
    switchCommentBarrage()
}
initCommentBarrage()
