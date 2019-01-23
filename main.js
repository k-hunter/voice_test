(function(aGlobal) {

	var adhoc = navigator.mozAdhoc;
	var record = document.getElementById('Start');
	//var start = $("#Start");
	var start = document.getElementById('Start');
	var stop = document.getElementById('Stop');
	var soundClips = document.querySelector('.sound-clips');

	var constraints = {audio: true};
	var chunks = [];
	var audio_file;
	stop.disabled = true;

	var clipContainer = document.createElement('article');
	var clipLabel = document.createElement('p');
	var audio = document.createElement('audio');
	var deleteButton = document.createElement('button');

	clipContainer.classList.add('clip');
	audio.setAttribute('controls','');
	deleteButton.textContent = 'Delete';
	deleteButton.className = 'delete';

	var buf,str;
	// ArrayBuffer转为字符串，参数为ArrayBuffer对象
	function ab2str(buf)
	{
		//return String.fromCharCode.apply(null, new Uint16Array(buf));
		return String.fromCharCode.apply(null, new Uint8Array(buf));
	}

	// 字符串转为ArrayBuffer对象，参数为字符串
	function str2ab(str)
	{
		//var buf = new ArrayBuffer(str.length*3); // 每个字符占用2个字节
		var buf = new ArrayBuffer(str.length); // 每个字符占用2个字节
		//var bufView = new Uint16Array(buf);
		var bufView = new Uint8Array(buf);
		for (var i=0, strLen=str.length; i<strLen; i++) {
			bufView[i] = str.charCodeAt(i);
		}
		return buf;
	}

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

	function voicedatacallback(status, data) {
		dump("============================================adhoc,addPcmVoiceListener==========================================");
		dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener addr="+status);
		dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener data="+data);
		console.log("callback from C so "+data);
		
		//var arr_convertest = data.split(',');//str2arry
		var arr_convertest = str2arry(data);//str2arry
		console.log(arr_convertest);

		var typedArray = new Uint8Array(arr_convertest);
		//console.log("voicedata.length:"+typedArray.length+" data="+typedArray); 

		//var string2blob = new Blob([typedArray],{ 'type' : 'audio/ogg; codecs=opus' } );//arry to blob ,and play this blob
		var string2blob = blob_creator([typedArray]);//create blob
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
			adhoc.addPcmVoiceListener_spe_api(voicedatacallback,str_vt);
		}
	}


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
				arrybuffer_voice_send_recv_play(blob);
				//arrybuffer_voice_play(blob);//well done
				chunks = [];

				/*
				 *clipContainer.appendChild(audio);
				 *clipContainer.appendChild(clipLabel);
				 *clipContainer.appendChild(deleteButton);
				 *soundClips.appendChild(clipContainer);
				 */

				deleteButton.onclick = function(e) {
					evtTgt = e.target;
					evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
				}
				audio.controls = true;
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

	function arrybuffer_voice_play(blob_exch)
	{//test,可正常播放,不经过so库，原地转换测试
		console.log(blob_exch);
		var ab_exch,str_exch;
		//将Blob 对象转换成 ArrayBuffer
		var reader = new FileReader();
		//reader.readAsArrayBuffer(blob_exch,'utf-16');
		reader.readAsArrayBuffer(blob_exch,'utf-8');
		reader.onload = function (e) {
			var abf=reader.result;
			console.log(abf); 
			var typedArray = new Uint8Array(abf);
			console.log(typedArray); 
			console.log("voicedata.length:"+typedArray.length); // 3
			var string1=ab2str(abf);
			ab_exch=str2ab(string1);
			console.log(ab_exch);

			//var string2blob = new Blob([ab_exch],{ 'type' : 'audio/ogg; codecs=opus' } );
			var string2blob = new Blob([typedArray],{ 'type' : 'audio/ogg; codecs=opus' } );
			audio.controls = true;
			var audioURL = window.URL.createObjectURL(string2blob);
			audio.src = audioURL;
			audio.play();
		}
	}
	
	
	function adhoc_tellip()
	{
		var convertest = "hellohhahahahahahahahhsffffffffffanananananananiiiiiiiiiiiiiii";
		//var convertest = "hellohhahahahahahahahh from jsffffffffffanananananananiiiiiiiiiiiiiii";
		//adhoc.tellLocalIpAddr(convertest);//设置本机自组网ip
		//adhoc.sendPcmVoice(convertest);//发送话音数据
		console.log(convertest);
		adhoc.addPcmVoiceListener_spe_api(voicedatacallback,convertest);
	}

	function fkab_voice(){

		var convertest = "11,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66,44,77,008,66";
		var arr_convertest = convertest.split(',');//str2arry
		console.log(arr_convertest);
		adhoc.addPcmVoiceListener_spe_api(voicedatacallback,convertest);
		//var str_vt = arr_convertest.join(',');
		//console.log(str_vt);
	}

	function fkab_test(){

		var typedArray = new Uint8Array([0,1,2]);
		console.log(typedArray); 
		console.log(typedArray.length); // 3
		typedArray[0] = 5;
		console.log(typedArray); // [5, 1, 2]
	}





	function test()
	{	
		//var test_string="hia hie hia";
		//dump("i                                                   adhoc js :"+test_string);
		//adhoc.addPcmVoiceListener_spe_api(voicedatacallback,test_string);
		//adhoc_tellip();
		//fkab_test();
		fkab_voice();
	}



	$(document).ready(function () {

		recorder();

		$("#Start").on('click',function(e){
			//test();
			//console.log("start");
		});

		$("#Stop").on('click',function(e){

			//console.log("stop");
		});


		$("#Save").on('click',function(e){
			//save_audio_file();
			console.log("save");
		}); 


		$("#Send").on('click',function(e){

			console.log("send");
		});


		$("#Play").on('click',function(e){

			console.log("play");
		});

		$("#Test").on('click',function(e){
			//console.log("test");
			test();
		});

	});


})(window);











