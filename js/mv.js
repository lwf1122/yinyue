var video = document.getElementById("video");
var playBtn = document.getElementById("playBtn");
var classVal = playBtn.getAttribute("class");
var ico = document.getElementById("icoPlay");
var fullScreen = document.getElementById("fullScreen");

//播放暂停
video.onclick = playBtn.onclick = ico.onclick = function(){
	playVideo();
}
function playVideo(){
	if(video.paused){
		video.play();
		//alert(classVal);
		classVal = classVal.replace("play","pause");
		playBtn.setAttribute("class",classVal );
		ico.style.display = "none";
	}else{
		video.pause();
		classVal = classVal.replace("pause","play");
		playBtn.setAttribute("class",classVal );
		ico.style.display = "block";
	}
}

//全屏
fullScreen.onclick = function(){
	if($(this).hasClass("full")){
		launchFullScreen(video);
		$("#fullScreen").addClass("exit").removeClass("full");
		$(".videoBox .videoCtr").css({
			"left": 0,
			"bottom": 0
		});	
	}else{
		$("#fullScreen").removeClass("exit").addClass("full");
		exitFullscreen()
	}
}
function launchFullScreen(element) { 
	if(element.requestFullscreen) { 
		element.requestFullscreen(); 
	} else if(element.mozRequestFullScreen) { 
		element.mozRequestFullScreen(); 
	} else if(element.webkitRequestFullscreen) { 
		element.webkitRequestFullscreen(); 
	} else if(element.msRequestFullscreen) { 
		element.msRequestFullscreen(); 
	}
} 
function exitFullscreen() { 
	if(document.exitFullscreen) { 
		document.exitFullscreen(); 
	} else if(document.mozExitFullScreen) { 
		document.mozExitFullScreen(); 
	} else if(document.webkitExitFullscreen) { 
		document.webkitExitFullscreen(); 
	} 
}
//键盘事件控制 keydown事件会在按下键盘按键并释放时触发
$(window).keydown(function(event){
	//event代表事件的状态，例如触发event对象的元素、鼠标的位置及状态、按下的键等等 
	//这里为了兼容IE、Firefox，在IE/Opera中是window.event，在Firefox中是event
	event = event || window.event;
	//空格键 控制播放
	/*if(event.keyCode == 32){
		playVideo();
		//取消事件的默认动作。
        event.preventDefault();
	}*/
	//Esc键 退出全屏
	if(event.keyCode == 27){
		$("#fullScreen").removeClass("exit").addClass("full");
	};
});

//时间及进度
video.onloadedmetadata = function(){
	//alert(video.duration);
	var durtime = document.getElementById("durTime");
	var m = parseInt(video.duration / 60);
	var s = parseInt(video.duration % 60);
	m=check(m);
	s=check(s);
	durtime.innerHTML = m+":"+s;
}
function check(i){
	if(i<10){
		i = "0"+i;
	}
	return i;
}
	
video.ontimeupdate = function(){
	//alert(video.currentTime);
	var curtime = document.getElementById("curTime");
	var m = parseInt(video.currentTime / 60);
	var s = parseInt(video.currentTime % 60);
	m=check(m);
	s=check(s);
	if(video.currentTime < video.duration){
		curtime.innerHTML = m+":"+s;
	}else{
		video.pause();
		classVal = classVal.replace("pause","play");
		playBtn.setAttribute("class",classVal );
		ico.style.display = "block";
	}
		
	//自动进度条
	var dur = video.duration;
	var cur = video.currentTime;
	var percentage = 100*cur/dur;
	var sld = document.getElementById("slider");
	sld.style.width = percentage+"%";
}

//视频进度
var prog = $("#prog");
var sld = $("#slider");
$("#prog").mousedown(function(e) {
	e = e || window.event;
	updatebar(e.pageX);
});
var updatebar = function(x) {
	var dur = video.duration;
	var positions = x - sld.offset().left; //点击位置
	var percentage = 100 * positions / $("#prog").width();
	//检查范围
	if (percentage > 100) {
		percentage = 100;
	}
	if (percentage < 0) {
		percentage = 0;
	}
	//更新进度条
	sld.css("width", percentage + "%");
	video.currentTime = dur * percentage / 100;
};

//音量
video.volume = 0.5;
var volumebar = $(".volumeWrap .progress").find(".volumeBar");
$("#volume").on("click", function(e) {
	e = e || window.event;
	$(".volumeWrap").toggle();
	e.stopPropagation();
});
$(".volumeWrap").on("click mousewheel DOMMouseScroll", function(e) {
	e = e || window.event;
	volumeControl(e);
	e.stopPropagation();
	return false;
});
//音量隐藏
$(document).click(function() {
	$(".volumeWrap").hide();
});
//音量控制
function volumeControl(e) {
	e = e || window.event;
	var eventype = e.type;
	var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
	var positions = 0;
	var percentage = 0;
	if (eventype == "click") {
		positions = volumebar.offset().top - e.pageY;
		percentage = 100 * (positions + volumebar.height()) / $(".volumeWrap .progress").height();
	} else if (eventype == "mousewheel" || eventype == "DOMMouseScroll") {
		percentage = 100 * (volumebar.height() + delta) / $(".volumeWrap .progress").height();
	}
	if (percentage < 0) {
		percentage = 0;
		$("#volume").attr("class", "b2 f volume-off");
	} else if (percentage > 50) {
		$("#volume").attr("class", "b2 f volume-up");
	} else if (percentage > 0 && percentage <= 50) {
		$("#volume").attr("class", "b2 f volume-down");
	} else if (percentage >= 100) {
		percentage = 100;
	}
	$(".volumeWrap .volumeBar").css("height", percentage + "%");
	video.volume = percentage / 100;
	e.stopPropagation();
	e.preventDefault();
}

//信息展开
$("#toggleBtn").on("click",function(){
	if($(this).text()=="展开"){
		$(".videoDes").css("height","auto");
		$(this).text("收起");
	}else{
		$(".videoDes").css("height","20px");
		$(this).text("展开");
	}
})