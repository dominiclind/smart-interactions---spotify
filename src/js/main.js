var select = function(selector){
	return document.querySelector(selector);
};

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


var spotifyScrollView = {

	iscroll : null,
	element : '.spotify-scroll-view',
	bg_image : select('.bg'),
	bg_height : 0,
	bg_threshold : 100,
	artist_info : select('.info'),
	height : 0,
	width : 0,

	initIscroll : function() {
		this.iscroll = new IScroll(this.element, {
			probeType: 3, 
			mouseWheel: true , 
			useTransition : false
		});
		
		this.iscroll.on('scroll', this.onScroll);
		this.iscroll.on('scrollEnd', this.onScroll);
	},

	onScroll : function(end){
		// animate that bg on down scroll
		if(this.y < spotifyScrollView.bg_height){

			$(spotifyScrollView.bg_image).css({
				'background-position-y' : -(this.y / 2) + 'px'
			});
		}

		// make portrait fixed
		if(this.y < 0){
			$(spotifyScrollView.artist_info).css({
				'-webkit-transform' : 'translateY('+ Math.abs(this.y) +'px)'
			});
		}else{
			$(spotifyScrollView.artist_info).css({
				'-webkit-transform' : 'translateY(0px)'
			});
		}

		// animate away portrait & make bg big and not blurry
		if(this.y > 0){
			var percent = Math.abs(this.y) / spotifyScrollView.bg_threshold;

			// fade artist

			$(spotifyScrollView.artist_info).css({
				'opacity' : 1 - (0.1 + percent)
			});

			// bg pic
			$(spotifyScrollView.bg_image).css({
				//'-webkit-filter' : 'blur(' + (12 - (12 * percent) ) + 'px)',
				'background-position-y' : '0px',
				'-webkit-transform' : 'translateY('+ -( Math.abs(this.y) / 2) +'px) scale('+ (1 + (0.5 * percent) )+')',
				'opacity' : (0.4 + percent)
			});
		}


		// stick tat shuffle btn
		if(Math.abs(this.y) > spotifyScrollView.bg_height - 55){
			$('.shuffle').addClass('sticky');
			$('.shuffle').css({
				'-webkit-transform' : 'translateY('+ ( Math.abs(this.y) - ( spotifyScrollView.bg_height - 55) ) +'px)'
			})

			// remove unnessesary stuffs
			$(spotifyScrollView.bg_image).css({
				//'-webkit-filter' : 'blur(' + (12 - (12 * percent) ) + 'px)',
				'background-position-y' : '0px',
				'-webkit-transform' : 'translateY(0px)',
			});
			$(spotifyScrollView.artist_info).css({
				'opacity' : 1,
				'-webkit-transform' : 'translateY(0px)'
			});


		}else{
			$('.shuffle').removeClass('sticky');
			$('.shuffle').css({
				'-webkit-transform' : 'translateY(0px)'
			})
		}
		
	},

	getSongListItem : function(songName) {
		var html = '<li class="song">';
				html += '<p class="title">' + songName + '</p>';
				html += '<span class="more-icon entypo three-dots"></span>';
				html += '<p class="listens">'+ Math.floor(Math.random() * 5) + 1 +' ' + Math.floor(Math.random() * 500) + 1 +'</p>';
			html += '</li>';

		return html;
	},


	populateSongList : function(){

		var songs = ['Happy', 'Brand New', 'Marilyn Monroe', 'Gust Of Wind',
		'Can I Have It Like That', 'How Does It Feel', 'Number One','Gust Of Wind',
		'Can I Have It Like That', 'How Does It Feel', 'Number One'];

		var t = '';
		for(key in songs){
			console.log(t);
			t += this.getSongListItem(songs[key]);

		}

		$('.section.list').append(t);

	},


	getDimensions : function() {
		this.height = select(this.element).clientHeight,
		this.width  = select(this.element).clientWidth;
		this.bg_height = select('.section.artist').clientHeight;

	},

    init : function() {
    	this.populateSongList();
    	this.getDimensions();
    	this.initIscroll();
    }

}




// init the scrollview
spotifyScrollView.init();