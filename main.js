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

	function send_audio(audiofile)
	{
		return new Promise((resolve, reject) => {
			adhoc.sendPcmVoice(audiofile);//发送话音数据
			console.log("nnn1");
			resolve(1);
		});
	}


	function get_audio()
	{
		console.log("nnn3");
		adhoc.addPcmVoiceListener(function(status, data) {
			//setTimeout(
			dump("============================================adhoc,addPcmVoiceListener==========================================");
			dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener addr="+status);
			dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener data="+data);
			//2000);
		});//添加接收话音回调监听器

	}



	var audio_file_play;
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
				//console.log("data available after MediaRecorder.stop() called.");
				var audio = document.createElement('audio');
				audio.controls = true;

				//var sdcard = navigator.getDeviceStorage("sdcard");
				var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });//get audio data
				//var file   = new Blob(["This is a text file."], {type: "text/plain"});
				//console.log(blob);
				//console.log(file);

				chunks = [];
				var reader=new FileReader();
				reader.readAsText(blob,'utf-8');
				reader.onload=function(e)
				{
					var textfile=reader.result;
					//console.log(textfile);
					//console.log(reader);
					
					send_audio(textfile).then(() => {
						console.log("nnn2");
						get_audio();
					});
				}

				//将Blob 对象转换成 ArrayBuffer
/*
 *                reader.readAsArrayBuffer(blob);
 *                reader.onload = function (e) { //将 ArrayBufferView  转换成Blob
 *                    var buf = new Uint8Array(reader.result);
 *                    console.info(buf); //[228, 184, 173, 230, 150, 135, 229, 173, 151, 231, 172, 166, 228, 184, 178]
 *
 *                    reader.readAsText(new Blob([buf]), 'utf-8');
 *                    reader.onload = function () {
 *
 *                        var string2blob = new Blob([buf], {
 *                            type: 'text/plain'
 *                        });
 *
 *                        console.info(string2blob); //中文字符串
 *                        adhoc.sendPcmVoice(string2blob);//发送话音数据
 *                    };
 *
 *                    var buf = new DataView(reader.result); //将 ArrayBufferView  转换成Blob
 *                    console.info(buf); //DataView {}
 *                    reader.readAsText(new Blob([buf]), 'utf-8');
 *                    reader.onload = function () {
 *                        console.info(reader.result); //中文字符串
 *                    };
 *                }
 */



				/*
				 *var request = sdcard.addNamed(blob, "audio_file1.ogg");
				 *request.onsuccess = function () {
				 *    var name = this.result;
				 *    console.log('File "' + name + '" successfully wrote on the sdcard storage area');
				 *}
				 */

				// An error typically occur if a file with the same name already exist
				/*
				 *request.onerror = function () {
				 *    console.warn('Unable to write the file: ' + this.error);
				 *}
				 */

				/*
				 *                var request_get = sdcard.get("audio_file1.ogg");
				 *
				 *                request_get.onsuccess = function () {
				 *                    audio_file_play = this.result;
				 *                    console.log("Get the file: " + audio_file_play.name);
				 *                    console.log(audio_file_play);
				 *                    var audioURL = window.URL.createObjectURL(audio_file_play);
				 *                    console.log(audioURL);
				 *                    audio.src = audioURL;
				 *                    audio.play();
				 *                }
				 *                request_get.onerror = function () {
				 *                    console.warn("Unable to get the file: " + this.error);
				 *                }
				 *
				 */

				clipContainer.appendChild(audio);
				clipContainer.appendChild(clipLabel);
				clipContainer.appendChild(deleteButton);
				soundClips.appendChild(clipContainer);

				deleteButton.onclick = function(e) {
					evtTgt = e.target;
					evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
				}

				audio.controls = true;
				//console.log("recorder stopped");
			}

			mediaRecorder.ondataavailable = function(e) {
				chunks.push(e.data);
				var textfile1=chunks;
				//console.log("\ntextfile1:\n"+textfile1);
				//console.log("reader\n"+reader.result);
				console.log(chunks);
			}
		}//onsuceed


		var onError = function(err) {
			console.log("错误出现在：　"　+ err);
		}
		navigator.mediaDevices.getUserMedia(constraints).then(onSuccess,onError);
	}//recorder

	function save_audio_file()
	{

		var sdcard = navigator.getDeviceStorage("sdcard");
		var file   = new Blob(["This is a text file."], {type: "text/plain"});

		//console.log(sdcard);
		var request = sdcard.addNamed(file, "my-file.txt");

		request.onsuccess = function () {
			var name = this.result;
			console.log('File "' + name + '" successfully wrote on the sdcard storage area');
		}

		// An error typically occur if a file with the same name already exist
		request.onerror = function () {
			console.warn('Unable to write the file: ' + this.error);
		}

	}

	function send_audio_file()
	{
		//将字符串转换成 Blob对象
		var blob = new Blob(['中文字符串'], {
			type: 'text/plain'
		});
		console.log(blob);
		//将Blob 对象转换成 ArrayBuffer
		var reader = new FileReader();
		reader.readAsArrayBuffer(blob);
		reader.onload = function (e) {
			//console.info(reader.result); //ArrayBuffer {}


			//将 ArrayBufferView  转换成Blob
			var buf = new Uint8Array(reader.result);
			console.info(buf); //[228, 184, 173, 230, 150, 135, 229, 173, 151, 231, 172, 166, 228, 184, 178]

			reader.readAsText(new Blob([buf]), 'utf-8');
			reader.onload = function () {

				var string2blob = new Blob([buf], {
					type: 'text/plain'
				});

				//console.info(reader.result); //中文字符串
				console.info(string2blob); //中文字符串
				adhoc.sendPcmVoice(string2blob);//发送话音数据
			};

			//将 ArrayBufferView  转换成Blob
			/*
			 *var buf = new DataView(reader.result);
			 *console.info(buf); //DataView {}
			 *reader.readAsText(new Blob([buf]), 'utf-8');
			 *reader.onload = function () {
			 *    console.info(reader.result); //中文字符串
			 *};
			 */
		}

	}

	function play_audio_file()
	{
		clipContainer.appendChild(audio);
		clipContainer.appendChild(clipLabel);
		clipContainer.appendChild(deleteButton);
		soundClips.appendChild(clipContainer);
		//var audio_file_play;

		var sdcard = navigator.getDeviceStorage('sdcard');
		//console.log(sdcard);
		var request = sdcard.get("audio_file1.ogg");

		audio.controls = true;
		request.onsuccess = function () {
			audio_file_play = this.result;
			//console.log("Get the file: " + audio_file_play.name);
			var audioURL = window.URL.createObjectURL(audio_file_play);
			audio.src = audioURL;
			audio.play();
		}
		deleteButton.onclick = function(e) {
			evtTgt = e.target;
			evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
		}


		request.onerror = function () {
			console.warn("Unable to get the file: " + this.error);
		}



		adhoc.addPcmVoiceListener(function(status, data) {
			dump("============================================adhoc,addPcmVoiceListener==========================================");
			dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener addr="+status);
			dump("js callback22  navigator.mozAdhoc.addPcmVoiceListener data="+data);
		});//添加接收话音回调监听器


	}

	function test()
	{
		var peerConnection = new mozRTCPeerConnection();
		console.log(peerConnection);
		//recorder();
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

			send_audio_file();
			console.log("send");
		});



		$("#Play").on('click',function(e){

			console.log("play");
			play_audio_file();
		});

		$("#Test").on('click',function(e){
			//console.log("test");
			//recorder();
			//test();
		});



	});


})(window);











