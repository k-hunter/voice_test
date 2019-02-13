(function(aGlobal) {

	var adhoc = navigator.mozAdhoc;
	var record = document.getElementById('Start');
	//var start = $("#Start");
	var start = document.getElementById('Start');
	var stop = document.getElementById('Stop');

	var constraints = {audio: true};
	var chunks = [];
	stop.disabled = true;

	function str2arry(Str2arry)
	{// string with ','
		return Str2arry.split(',');//str2arry
	}

	function arry2str(Arry2str)
	{// string with ','
		return Arry2str.join(',');//arry2str
	}

	function blob_creator(blob_source)
	{
		var blob = new Blob(blob_source, { 'type' : 'audio/ogg; codecs=opus' });//get audio data{type:"text/plain"}
		return blob;
	}


	function voicedatacallback(status, data) {//回调中的data中返回的就是底层的语音数据
		dump("============================================adhoc,addPcmVoiceListener==========================================");
		dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener addr="+status);
		dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener data="+data);
		console.log("callback from C so "+data);
		
		var arr_convertest = str2arry(data);//str2arry
		console.log(arr_convertest);

		var typedArray = new Uint8Array(arr_convertest);
		var string2blob = blob_creator([typedArray]);//create blob
		var audio = document.createElement('audio');
		audio.controls = true;
		var audioURL = window.URL.createObjectURL(string2blob);
		audio.src = audioURL;
		audio.play();

	}//添加接收话音回调监听器

	function arrybuffer_voice_send_recv_play(blob_exch)
	{
		console.log(blob_exch);
		//将Blob 对象转换成 ArrayBuffer
		var reader = new FileReader();
		//reader.readAsArrayBuffer(blob_exch,'utf-16');
		reader.readAsArrayBuffer(blob_exch,'utf-8');
		reader.onload = function (e) {
			var abf=reader.result;
			var typedArray = new Uint8Array(abf);
			console.log(typedArray); 
			var str_vt = arry2str(typedArray);//arrybuffer to string 
			console.log(str_vt);
			adhoc.addPcmVoiceListener_spe_api(voicedatacallback,str_vt);//发送语音数据并通过voicedatacallback回调回来，播放语音
		}
	}//处理语音blob数据成字符串，通过接口传到so库


	function recorder(){
		var onSuccess = function(stream) {

			start.onclick = function(){
				mediaRecorder.start();//begin to record
				//console.log(mediaRecorder.state);//recording
				console.log("开始录音");
				record.style.background = "red";
				stop.disabled = false;
				record.disabled = true;
			}
			stop.onclick = function(){
				mediaRecorder.stop();//stop recording
				//console.log(mediaRecorder.state);//inactive
				console.log("停止录音");
				record.style.background = "";
				record.style.color = "";
				stop.disabled = true;
				record.disabled = false;
			}
			var mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.onstop = function(e) {//when stop happen, do this 
				var audio = document.createElement('audio');
				audio.controls = true;
				var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });//get audio data{type:"text/plain"}
				//实际调用,测试转换情况及是否可用，
				arrybuffer_voice_send_recv_play(blob);//将语音blob传给函数
				//arrybuffer_voice_play(blob);//well done
				chunks = [];
			}

			mediaRecorder.ondataavailable = function(e) {
				chunks.push(e.data);
			}
		}//onsuceed

		var onError = function(err) {
			console.log("错误出现在：　"　+ err);
		}
		navigator.mediaDevices.getUserMedia(constraints).then(onSuccess,onError);
	}//recorder

	////////////////////////////////////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////
		//关注以下函数及注释
	////////////////////////////////////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////
	function sendvoicedata_example()
	{
		var audio_data_string;//将你的语音数据转成字符串，上面的arrybuffer_voice_send_recv_play()函数，请参考写法，然后自由发挥
		//测试专用
		//此接口数据不经过自组网硬件设备间的传递，到libadhocd.so就返回了
		adhoc.addPcmVoiceListener_spe_api(voicedatacallback,audio_data_string);//此接口测试专用，我这边为调试语音数据解析过程添加的接口，后期可直接删除

		//标准用法:
		adhoc.addPcmVoiceListener(voicedatacallback);//添加语音数据监听，请自由发挥
		adhoc.sendPcmVoice(audio_data_string);//发送话音数据
	}
		
	////////////////////////////////////////////////////////////////////////////////// //////////////////////////////////////////////////////////////////////////////////
		
		
		

		function test()
	{	
		var convertest="hia hia hia from js";
		//var convertest="hia hie hiahhdjhakjhjkafsdfhsjkafhkjahfjskahfjskhfhjsafkjahfkjahfjkshfdjksahfjkashfjkshfjkahfjksa";//压力测试
		dump("i                                                   adhoc js :"+convertest);
		adhoc.addPcmVoiceListener_spe_api(voicedatacallback,convertest);
		adhoc.sendDataPri(convertest,  convertest,  convertest, 222);//发送数据
		//adhoc.setIsNeedHeadForUserData(true);//设置用户数据是否需要头部
		//adhoc.setEnabled (false);//设置数据传输模式，ip或非ip true :非ip模式，false :ip模式
	}


	$(document).ready(function () {

		recorder();

		$("#Start").on('click',function(e){
			//console.log("start");
			//alert("采集音频已开启... 请对着话筒讲话，结束请点'stop'按钮!")
		});

		$("#Stop").on('click',function(e){
			//console.log("stop");
			//alert("采集音频结束！");
		});

		$("#Save").on('click',function(e){
			//console.log("save");
			alert("打开源码，自由发挥！");
		}); 

		$("#Send").on('click',function(e){
			//console.log("send");
			alert("发送语音或打开源码，自由发挥！");
			sendvoicedata_example();
		});

		$("#Play").on('click',function(e){
			//console.log("play");
			alert("打开源码，自由发挥！");
		});

		$("#Test").on('click',function(e){
			console.log("test");
			//alert("点击'start'按钮对着话筒讲话，结束请点'stop'按钮! 或打开源码，自由发挥！");
			//test();
		});
	});


})(window);



