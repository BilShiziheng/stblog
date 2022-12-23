//bbtalkLunboer v2.0 By Ariasaka
AV.init({
    appId: "fthHfNOeaXkY9N5qptunnPop-MdYXbMMI",
    appKey: "jN7LhFTcloHmt1rWfWP6e1jm",
    serverURL: "https://fthhfnoe.api.lncldglobal.com", //�ĳ��Լ��ģ�������->������
});
function lunbo() {
    var speaks = [];
    const query = new AV.Query('content');
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //�·�
            "d+": this.getDate(), //��
            "H+": this.getHours(), //Сʱ
            "m+": this.getMinutes(), //��
            "s+": this.getSeconds(), //��
            "q+": Math.floor((this.getMonth() + 3) / 3), //����
            "S": this.getMilliseconds() //����
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    query.find().then((talks) => {
        dat = new Date()
        for (i = talks.length; i >= talks.length - 31; i--) {
            var usedTime = Date.parse(dat) - Date.parse(talks[i]["createdAt"]);
            var days = Math.floor(usedTime / (24 * 3600 * 1000));
            var leave1 = usedTime % (24 * 3600 * 1000);
            var hours = Math.floor(leave1 / (3600 * 1000));
            var leave2 = leave1 % (3600 * 1000);
            var minutes = Math.floor(leave2 / (60 * 1000));
            var bbcontent = talks[i]["attributes"]["content"].replace(/<[^>]+>/g, "").replace(/<[^>]+>/g, "").replace(/(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+\.(png|jpg|jpeg|webp)/g, "[ͼƬ]").replace(/(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/g, "[����]");
            if (days > 31) {
                speaks.push(String(talks[i]["createdAt"].Format("yyyy-MM-dd")) + "��" + bbcontent)
            }
            else if (days > 0) {
                speaks.push(String(days) + " ��ǰ��" + bbcontent);
            }
            else if (hours > 0) {
                speaks.push(String(hours) + " Сʱǰ��" + bbcontent);
            }
            else {
                speaks.push(String(minutes) + " ����ǰ��" + bbcontent);
            }
        }
        document.querySelector(".shuoshuo").innerHTML = ""
        for (i = 1; i < speaks.length; i++) {
            var ch = document.createElement("div");
            ch.className = "swiper-slide bbtalks";
            ch.innerHTML = speaks[i];
            document.querySelector(".shuoshuo").appendChild(ch)
        }
        var fxxkccf = new Swiper("#speaks-content", {
            loop: true,
            direction: "vertical",
            autoplay: {
                delay: 5000,
                disableOnInteraction: false, //�������� ����������Ϊ[doge]
            },
            mousewheel: true,
        })
        fxxkccf.el.onmouseover = function () {
            fxxkccf.autoplay.stop();
        }
        fxxkccf.el.onmouseout = function () {
            fxxkccf.autoplay.start();
        }
    });

}
document.addEventListener('pjax:complete', (e) => {
    lunbo();
})
document.addEventListener('DOMContentLoaded', (e) => {
    lunbo();
})
