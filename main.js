(function(aGlobal) {
	/*
	 *
	 *    function recorder()
	 *    {
	 */

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

	//var audioCtx = new (window.AudioContext || webkitAudioContext)();
	/*
	 *    if (navigator.mediaDevices.getUserMedia) {
	 *        console.log('支持getUserMedia属性');
	 *        var constraints = {audio: true};
	 *        var chunks = [];
	 *
	 *        var onSuccess = function(stream) {
	 *
	 *
	 *            var mediaRecorder = new MediaRecorder(stream);
	 *            record.onclick = function(){
	 *                mediaRecorder.start();
	 *                console.log(mediaRecorder.state);
	 *                console.log("开始录音");
	 *                record.style.background = "red";
	 *
	 *                stop.disabled = false;
	 *                record.disabled = true;
	 *            }
	 *            stop.onclick = function(){
	 *                mediaRecorder.stop();
	 *                console.log(mediaRecorder.state);
	 *                console.log("停止录音");
	 *                record.style.background = "";
	 *                record.style.color = "";
	 *
	 *                stop.disabled = true;
	 *                record.disabled = false;
	 *            }
	 *
	 *            //onstop
	 *            mediaRecorder.onstop = function(e) {
	 *                console.log("可保存数据");
	 *                var clipName = prompt('给你的新录音命个名：','新录音');
	 *                console.log(clipName);
	 *                var clipContainer = document.createElement('article');
	 *                var clipLabel = document.createElement('p');
	 *                var audio = document.createElement('audio');
	 *                var deleteButton = document.createElement('button');
	 *
	 *                clipContainer.classList.add('clip');
	 *                audio.setAttribute('controls','');
	 *                deleteButton.textContent = 'Delete';
	 *                deleteButton.className = 'delete';
	 *
	 *                if(clipName === null) {
	 *                    clipLabel.textContent = '未命名录音';
	 *                } else {
	 *                    clipLabel.textContent = clipName;
	 *                }
	 *
	 *                clipContainer.appendChild(audio);
	 *                clipContainer.appendChild(clipLabel);
	 *                clipContainer.appendChild(deleteButton);
	 *                soundClips.appendChild(clipContainer);
	 *
	 *                audio.controls = true;
	 *                var blob = new Blob(chunks,{ 'type' : 'audio/ogg; codecs=opus' });
	 *                chunks = [];
	 *                var audioURL = window.URL.createObjectURL(blob);
	 *                audio.src = audioURL;
	 *                console.log("录音完成");
	 *
	 *                deleteButton.onclick = function(e) {
	 *                    evtTgt = e.target;
	 *                    evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
	 *                }
	 *                clipLabel.onclick = function(){
	 *                    var existingName = clipLabel.textContent;
	 *                    var newClipName = prompt("给你的录音起个新名字：");
	 *                    if (newClipName === null){
	*                        clipLabel.textContent = existingName;
	*                    } else {
		*                        clipLabel.textContent = newClipName;
		*                    }
*                }
*            }
*
	*            //ondataavailable
	*            mediaRecorder.ondataavailable = function(e) {
		*                chunks.push(e.data);
		*                //console.log(e.data);
		*            }
*        }
*        var onError = function(err) {
	*            console.log("错误出现在：　"　+ err);
	*        }
*        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess,onError);
*    } else {
	*        console.log('浏览器不支持getUserMedia!');
	*    }
*/

	//}
	var audio_file_play;
	function recorder(){
		var onSuccess = function(stream) {

			start.onclick = function(){
				mediaRecorder.start();
				//console.log(mediaRecorder.state);//recording
				console.log("开始录音");
				record.style.background = "red";

				stop.disabled = false;
				record.disabled = true;
			}
			stop.onclick = function(){
				mediaRecorder.stop();
				//console.log(mediaRecorder.state);//inactive
				console.log("停止录音");
				record.style.background = "";
				record.style.color = "";

				stop.disabled = true;
				record.disabled = false;
			}
			var mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.onstop = function(e) {
				console.log("data available after MediaRecorder.stop() called.");
				var audio = document.createElement('audio');
				audio.controls = true;

				var sdcard = navigator.getDeviceStorage("sdcard");
				var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
				//var file   = new Blob(["This is a text file."], {type: "text/plain"});
				console.log(blob);
				//console.log(file);
				var request = sdcard.addNamed(blob, "audio_file1.ogg");
				request.onsuccess = function () {
					var name = this.result;
					console.log('File "' + name + '" successfully wrote on the sdcard storage area');
				}

				// An error typically occur if a file with the same name already exist
				request.onerror = function () {
					console.warn('Unable to write the file: ' + this.error);
				}

				/*
				 *
				 *                if(clipName === null) {
				 *                    clipLabel.textContent = '未命名录音';
				 *                } else {
				 *                    clipLabel.textContent = clipName;
				 *                }
				 */

				clipContainer.appendChild(audio);
				clipContainer.appendChild(clipLabel);
				clipContainer.appendChild(deleteButton);
				soundClips.appendChild(clipContainer);

				var request_get = sdcard.get("audio_file1.ogg");

				request_get.onsuccess = function () {
					audio_file_play = this.result;
					console.log("Get the file: " + audio_file_play.name);
					console.log(audio_file_play);
					var audioURL = window.URL.createObjectURL(audio_file_play);
					console.log(audioURL);
					audio.src = audioURL;
			audio.play();
				}

				request_get.onerror = function () {
					console.warn("Unable to get the file: " + this.error);
				}

				audio.controls = true;
				console.log("recorder stopped");
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
			console.log("Get the file: " + audio_file_play.name);
			var audioURL = window.URL.createObjectURL(audio_file_play);
			audio.src = audioURL;
			audio.play();
		}

		request.onerror = function () {
			console.warn("Unable to get the file: " + this.error);
		}
	}

	function test()
	{

		recorder();
	}

	$(document).ready(function () {
		$("#Start").on('click',function(e){
			//test();
			console.log("start");
		});

		test();

		$("#Stop").on('click',function(e){

			console.log("stop");
		});


		$("#Save").on('click',function(e){
			//save_audio_file();
			console.log("save");
		}); 


		$("#Send").on('click',function(e){

			//send_audio_file();
			console.log("send");
		});



		$("#Play").on('click',function(e){

			console.log("play");
			play_audio_file();
		});




	});


})(window);











