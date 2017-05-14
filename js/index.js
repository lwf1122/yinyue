//回到顶部
window.onload=function(){
	var gTop = document.getElementById("goTop");
	var cHeight = document.documentElement.clientHeight;
	var timer = null;
	var isTop = true;
	
	window.onscroll = function(){
		var sTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(sTop >= cHeight){
			gTop.style.display = "block";
		}else{
			gTop.style.display = "none";
		}
		
		if(!isTop){
			clearInterval(timer);
		}
		isTop = false;
    }
	
	gTop.onclick=function(){
		timer = setInterval(function(){
			var sTop = document.documentElement.scrollTop || document.body.scrollTop;
			var speed = Math.floor(-sTop/5);
			document.documentElement.scrollTop = document.body.scrollTop = sTop + speed;
			
			isTop = true;
			//console.log(sTop - speed);
			if(sTop == 0){
				clearInterval(timer);
			}
		},30)
	}
}

//注册登录弹出
$("#nologin").on("click",function(){
	openNew();
	tabShow();
	userlogin();
})
//弹出层
function openNew(){
	//获取页面的高度和宽度
	var sWidth=document.body.scrollWidth;
	var sHeight=document.body.scrollHeight;
	
	//可视区域的高度和宽度
	var cHeight=document.documentElement.clientHeight;
	
	var oMask=document.createElement("div");
	oMask.id="mask";
	oMask.style.width=sWidth+"px";
	oMask.style.height=sHeight+"px";
	document.body.appendChild(oMask);
	
	var oLogin=document.createElement("div");
	oLogin.id="dialog";
	oLogin.innerHTML="<div id='logReg'><div id='tab'><a href='javascript:;' class='tab_log select'>登录</a><a href='javascript:;' class='tab_reg'>注册</a></div><div id='msg'></div><div id='userWrap'><div class='log userInput'><input type='text' name='username' id='logUser' class='textInput' placeholder='请输入账号' /><input type='password' name='password' id='logPass' class='textInput' placeholder='请输入密码' /><input type='button' id='logBtn' class='userBtn' value='登录' /></div><div class='reg userInput'><input type='text' name='username' id='regUser' class='textInput' placeholder='请输入账号' /><input type='password' name='password' id='regPass' class='textInput' placeholder='密码为6-20位字符' /><input type='button' id='regBtn' class='userBtn' value='注册' /></div></div></div><a href='javascript:;' id='close'></a>";
	document.body.appendChild(oLogin);
	
	//获取登陆框的宽和高
	var oWidth=oLogin.offsetWidth;
	var oHeight=oLogin.offsetHeight;
	oLogin.style.left=(sWidth-oWidth)/2+"px";
	oLogin.style.top=(cHeight-oHeight)/2+"px";
	
	var oClose=document.getElementById("close");
	oClose.onclick=oMask.onclick=function(){
		document.body.removeChild(oLogin);
		document.body.removeChild(oMask);
	};
}
//注册登录切换
function tabShow(){
	$("#userWrap .userInput").eq(0).show();
	$("#tab a").on('click',function(){
		$(this).addClass("select").siblings().removeClass("select");
		var index=$(this).index();
		$("#userWrap .userInput").eq(index).show().siblings().hide();
	})
}

//注册登录
function userlogin(){
	$("#regBtn").on("click", function () {
		var username = $("#regUser").val();
		var password = $("#regPass").val();
		if(localStorage.getItem(username)==undefined){
			//添加key-value 数据到 sessionStorage
			localStorage.setItem(username, password);
			//alert('注册成功！');
			localStorage.setItem('currentUser',username);
			//window.location.href=window.location.href; 
            //window.location.reload; 
			window.location.reload();
		}else if(username==""){
			$("#msg").text('请先注册账号！');
		}else{
			$("#msg").text('该用户已注册！');
		}
	});
	
	$("#logBtn").on("click", function () {
		var username = $("#logUser").val();
		var password = $("#logPass").val();
		if (localStorage.getItem(username)) {
			if (localStorage.getItem(username) != password) {
				$("#msg").text('用户名或密码错误！');
			} else {
				localStorage.setItem('currentUser', username);//把当前用户存下来
				//alert('登陆成功！');
				//window.location.href=window.location.href; 
                //window.location.reload;
				window.location.reload();
			}
		} else if(username==""){
			$("#msg").text('请输入用户名！');
		} else {
			$("#msg").text('用户名不存在！');
		}
	});
}
//退出登录
$("#userQuit").on("click", function (){
	localStorage.setItem("currentUser","游客");
	userShow();
	window.location.reload();
});
function userShow() {
	var username = localStorage.getItem('currentUser');
	//console.log(username);
	if (username == undefined || username == "游客"){
		$("#islogin").hide();
		$("#nologin").show();
		//console.log('not login');
	} else {
		$("#nologin").hide();
		$("#islogin").show();
		$("#userName").html(username);
		//console.log('is login');
	}
}
userShow();

//下拉菜单
$(function(){
	$(".nav .slideNav").mouseover(function(){
		$(".innerNav").stop().slideDown("fast");
	})
	
	$(".nav .slideNav").mouseout(function(){
		$(".innerNav").stop().slideUp("fast");
	})
})

//焦点图
$(function(){
	var num=$(".list li").length;
	
	//手动
	$(".list li").eq(0).show();
	$(".page li").mouseover(function(){
		$(this).addClass("active").siblings().removeClass("active");
		var index=$(this).index();
		i=index;
		$(".list li").eq(index).stop().fadeIn(600).siblings().stop().fadeOut(600);
	})
	
	//自动
	var i=0;
	var t=setInterval(moveR,2000);
	
	//向左函数
	function moveL(){
		i--;
		if(i==-1){
			i=num-1;
		}
		$(".page li").eq(i).addClass("active").siblings().removeClass("active");
		$(".list li").eq(i).fadeIn(600).siblings().fadeOut(600);
	}
	
	//向右函数
	function moveR(){
		i++;
		if(i==num){
			i=0;
		}
		$(".page li").eq(i).addClass("active").siblings().removeClass("active");
		$(".list li").eq(i).fadeIn(600).siblings().fadeOut(600);
	}
	
	//左右按钮
	$("#focus .prev").click(function(){
		moveL();
	})
	$("#focus .next").click(function(){
		moveR();
	})
	
	//定时器的开始与结束
	$("#focus").hover(function(){
		clearInterval(t);
	},function(){
		t=setInterval(moveR,2000);
	})
})

//MV首播 Tab
$(function(){
	$(".sb_list li").eq(0).show();
	$(".sb_tab li").click(function(){
		$(this).addClass("select").siblings().removeClass("select");
		var index=$(this).index();
		$(".sb_list li").eq(index).stop().fadeIn(500).siblings().stop().fadeOut(500);
	})
})

//正在流行 Tab
$(function(){
	$(".lx_list li").eq(0).show();
	$(".lx_tab li").click(function(){
		$(this).addClass("select").siblings().removeClass("select");
		var index=$(this).index();
		$(".lx_list li").eq(index).stop().fadeIn(500).siblings().stop().fadeOut(500);
	})
})

//音悦V榜 Tab
$(function(){
	$(".vb_list li").eq(0).show();
	$(".vb_tab li").click(function(){
		$(this).addClass("select").siblings().removeClass("select");
		var index=$(this).index();
		$(".vb_list li").eq(index).stop().fadeIn(500).siblings().stop().fadeOut(500);
	})
})