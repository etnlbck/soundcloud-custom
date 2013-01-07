


var scCustom = function(consumer_key, url, parent){

	soundManager.url = 'lib/swf/';
	soundManager.flashVersion = 9;
	soundManager.useFlashBlock = false;
	soundManager.useHighPerformance = true;
	soundManager.wmode = 'transparent';
	soundManager.useFastPolling = true;

	soundManager.onready(function(){
			$.getJSON('http://api.soundcloud.com/resolve?url='+url+'&format=json&consumer_key='+consumer_key+'&callback=?', function(playlist){
				console.log(playlist);
				$('.title').text(playlist.tracks[0].title);
				$.each(playlist.tracks, function(index, track){

					if(track.artwork_url != null){
						var artwork = '<img class="artwork" src="'+track.artwork_url+'">';
					} else {
						var artwork = '';
					}

					$('<li>'+artwork+track.title+'<a href="'+track.permalink_url+'" target="_blank">Link</a></li>').data('track',track).appendTo('.tracks');

					url = track.stream_url;
					(url.indexOf("secret_token") == -1) ? url = url + '?' : url = url + '&';
					url = url + 'consumer_key=' + consumer_key;

					soundManager.createSound({
						id: 'track_'+track.id,
						url: url,
						onplay:function(){$('.player').addClass('playing'); $('.title').text(track.title);},
						onresume:function(){$('.player').addClass('playing')},
						onpause:function(){$('.player').removeClass('playing')},
						onfinish:function(){nextTrack();}
					});
				});

			});

		var nextTrack = function(){
			soundManager.stopAll();

			if($('li.active').next().click().length == 0){
				$('.tracks li:first').click();
			}
		};

		var prevTrack = function(){
			soundManager.stopAll();

			if($('li.active').prev().click().length == 0){
				$('.tracks li:last').click();
			}
		};

		$(parent).on('click', '.tracks li', function(){
			var track = $(this), data = track.data('track'), playing = track.is('.active');

			if(playing) {
				soundManager.pause('track_'+data.id);
			} else {
				if (track.siblings('li').hasClass('active')) {
					soundManager.stopAll();
				}
				soundManager.play('track_'+data.id);
			}

			track.toggleClass('active').siblings('li').removeClass('active');


		});

		$(parent).on('click', '.play, .pause', function(){
			if ($('li').hasClass('active') == true){
				soundManager.togglePause('track_'+$('li.active').data('track').id);
			} else {
				$('li:first').click();
			}
		});

		$(parent).on('click','.next', function(){
			nextTrack();
		});

		$(parent).on('click', '.prev', function(){
			prevTrack();
		});

	});

};


$(document).ready(function(){

	scCustom('ZOTSMMxRp6HD7SOgRCNlw','http://soundcloud.com/scientwist/sets/developer-playtime','#player');
});

