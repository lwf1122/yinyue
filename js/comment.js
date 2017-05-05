$(function(){
	var username = localStorage.getItem('currentUser');
    var wrap = document.getElementById("wrap");
    var boxs = wrap.children;
    var t;
    
    //显示日期
    function showDate(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mi = date.getMinutes();
        m = m > 9 ? m : "0" + m;
		d = d > 9 ? d : "0" + d;
		mi = mi > 9 ? mi : "0" + mi;
        return y + "/" + m + "/" + d + " " + h + ":" + mi;
    }
	
	//发布评论
	var release = document.getElementById("release");
	var text = release.getElementsByClassName("releaseText")[0];
	text.onkeyup = function () {
        var val = this.value;
        var len = val.length;
        var els = this.parentNode.children;
		var btn = els[1];
        var word = els[2];
        if (len <=5 || len > 140) {
            btn.setAttribute("disabled","disabled");
			btn.className = "releaseBtn-off";
        }
        else {
            btn.removeAttribute("disabled");
			btn.className = "releaseBtn";
        }
        word.innerHTML = len + "/140";
    }
	$("#release .releaseBtn").on("click",function(){
		if(text.value!=""){
			//var firstBox = wrap.firstChild;
			var box = document.createElement("div");
			box.className = "box";
			box.innerHTML =
				"<a href='javascript:;' class='avatar'><img src='../img/avatar.png' width='50' height='50' alt='' /></a>"+
				"<div class='content'>"+
				"<div class='main'>"+
				"<a class='user' href='javascript:;'>"+
				username + "</a>"+
				"<p class='txt'>"+
				text.value +
				"</p>"+
				"</div>"+
				"<div class='info'>"+
				"<span class='time'>"+
				showDate(new Date()) +
				"</span>"+
				"<a class='reply op' href='javascript:;' title='回复'></a>"+
				"<a class='praise op' href='javascript:;' title='赞' total='0' my='0'><span></span></a>"+
				"</div>"+
				"<div class='comment-list'></div>"+
				"<div class='text-box'>"+
				"<textarea class='comment' autocomplete='off' placeholder='评论...'></textarea>"+
				"<button class='btn'>回复</button>"+
				"<span class='word'><span class='length'>0</span>/140</span>"+
				"</div>"+
				"</div>";
			wrap.appendChild(box);
			//wrap.insertBefore(box,firstBox);
			text.value = "";
		}
	});

    /*//赞评论
	$("#wrap").on("click",".praise",function(){
		var othis = $(this);
		var obox = othis.parent().parent().parent();
		var praise = obox.find("a.praise");
		var myPraise = parseInt(praise.attr("my"));
		var oldTotal = parseInt(praise.attr("total"));
        var newTotal;
        if (myPraise == 0) {
            newTotal = oldTotal + 1;
            praise.attr("total", newTotal);
			praise.attr("my", 1);
            othis.children("span").html(newTotal);
        }
        else {
            newTotal = oldTotal - 1;
            praise.attr("total", newTotal);
			praise.attr("my", 0);
            othis.children("span").html((newTotal == 0) ? "" : newTotal);
        }
	}) */

    //回复评论 回复图标
	function replyBtn(el) {
        var content = el.parentNode.parentNode;
        var textarea = content.getElementsByClassName("comment")[0];
        textarea.focus();
    }
	//回复评论 回复框
    function reply(box, el) {
        var commentList = box.getElementsByClassName("comment-list")[0];
        var textarea = box.getElementsByClassName("comment")[0];
        var commentBox = document.createElement("div");
        commentBox.className = "comment-box";
        commentBox.setAttribute("user", "self");
        commentBox.innerHTML =
            "<a href='javascript:;' class='myAvatar'><img src='../img/avatar.png' width='30' height='30' alt='' /></a>" +
                "<div class='comment-content'>" +
                "<p class='comment-text'><a href='javascript:;' class='user'>"+
				username + "：</a>" + 
				textarea.value + "</p>" +
                "<p class='comment-time'>" +
                showDate(new Date()) +
                "<a href='javascript:;' class='comment-praise' total='0' my='0' title='赞'><span></span></a>" +
                "<a href='javascript:;' class='comment-operate'>删除</a>" +
                "</p>" +
                "</div>"
        commentList.appendChild(commentBox);
        textarea.value = "";
        textarea.onblur();
    }
    
	//赞评论
    function praiseBox(box, el) {
        //var txt = el.innerHTML;
        var praise = box.getElementsByClassName("praise")[0];
		var myPraise = parseInt(praise.getAttribute("my"));
        var oldTotal = parseInt(praise.getAttribute("total"));
        var newTotal;
		var span = el.getElementsByTagName("span")[0];
        if (myPraise == 0) {
            newTotal = oldTotal + 1;
            praise.setAttribute("total", newTotal);
			praise.setAttribute("my", 1);
            //praise.innerHTML = (newTotal == 1) ? "我觉得很赞" : "我和" + oldTotal + "个人觉得很赞";
            span.innerHTML = newTotal;
        }
        else {
            newTotal = oldTotal - 1;
            praise.setAttribute("total", newTotal);
			praise.setAttribute("my", 0);
            //praise.innerHTML = (newTotal == 0) ? "" : newTotal + "个人觉得很赞";
            span.innerHTML = (newTotal == 0) ? "" : newTotal;
        }
        //praise.style.display = (newTotal == 0) ? "none" : "block";
    }

	//赞回复
    function praiseReply(el) {
        var myPraise = parseInt(el.getAttribute("my"));
        var oldTotal = parseInt(el.getAttribute("total"));
        var newTotal;
		var span = el.getElementsByTagName("span")[0];
        if (myPraise == 0) {
            newTotal = oldTotal + 1;
            el.setAttribute("total", newTotal);
            el.setAttribute("my", 1);
            span.innerHTML = newTotal;
        }
        else {
            newTotal = oldTotal - 1;
            el.setAttribute("total", newTotal);
            el.setAttribute("my", 0);
            span.innerHTML = (newTotal == 0) ? "" : newTotal;
        }
        //span.style.display = (newTotal == 0) ? "" : "block"
    }
	
	//删除回复
    function removeNode(node) {
        node.parentNode.removeChild(node);
    }
	
    //回复或删除回复
    function operate(el) {
        var commentBox = el.parentNode.parentNode.parentNode;
        var box = commentBox.parentNode.parentNode.parentNode;
        var txt = el.innerHTML;
        var user = commentBox.getElementsByClassName("user")[0].innerHTML;
        var textarea = box.getElementsByClassName("comment")[0];
        if (txt == "回复") {
            textarea.focus();
            textarea.value = "回复 " + user;
            textarea.onkeyup();
        }
        else {
            removeNode(commentBox);
        }
    }

    //把事件代理到每条评论div容器
    for (var i = 0; i < boxs.length; i++) {

        //点击
        boxs[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            switch (el.className) {
                //赞评论
                case "praise op":
                    praiseBox(el.parentNode.parentNode.parentNode, el);
                    break;
					
                //图标回复评论
				case "reply op":
				    replyBtn(el);
					break;
				
                //回复按钮蓝
                case "btn":
                    reply(el.parentNode.parentNode.parentNode, el);
                    break

                //回复按钮灰
                case "btn btn-off":
                    clearTimeout(t);
                    break;

                //赞回复
                case "comment-praise":
                    praiseReply(el);
                    break;

                //回复或删除回复
                case "comment-operate":
                    operate(el);
                    break;
            }
        }

        //评论
        var textArea = boxs[i].getElementsByClassName("comment")[0];

        //评论获取焦点
        textArea.onfocus = function () {
            this.parentNode.className = "text-box text-box-on";
            this.onkeyup();
        }

        //评论失去焦点
        textArea.onblur = function () {
            var me = this;
            var val = me.value;
            if (val == "") {
                t = setTimeout(function () {
                    me.parentNode.className = "text-box";
                }, 200);
            }
        }

        //评论按键事件
        textArea.onkeyup = function () {
            var val = this.value;
            var len = val.length;
            var els = this.parentNode.children;
            var btn = els[1];
            var word = els[2];
            if (len <=0 || len > 140) {
                btn.className = "btn btn-off";
            }
            else {
                btn.className = "btn";
            }
            word.innerHTML = len + "/140";
        }
    }
})