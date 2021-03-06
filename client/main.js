Template.albumItem.created=function(){
	//if(this.data)console.log("on create > albumItem ",this.data.title);	
}

Template.albumItem.rendered=function(){
	if(this.data){
		//console.log("on rendered > albumItem ",this.data.title);
		$('#albumList').slimScroll({
			width: '540px',		
			height: '470px',
			position:'left',
			wheelStep : 30
		});
	}
}

Template.albumItem.events = {
	'click .albumItem':function(e){
		e.preventDefault();	
		//gotoAlbum($(e.currentTarget).find(".albump").attr("href"));	
		
		console.log("select album",$(e.currentTarget).parent().attr("id"));
		
		if($(e.currentTarget).parent().attr("id")=="myAlbumList"){
			Router.navigate($(e.currentTarget).find(".albump").attr("href"),{trigger: true}); 
			return;
		}
		
		if(Session.get("reviewRoom")!=$(e.currentTarget).find(".albump").attr("room-id"))
			openReview($(e.currentTarget).find(".albump").attr("room-id"));
		else	
			Router.navigate($(e.currentTarget).find(".albump").attr("href"),{trigger: true}); 
	}
}

/**
#################################################################################
*/


Template.playlistInfo.info=function(){
	if(Session.get("currentRoom")=="")return null;
	
	var _album =  Album.findOne({_id:Session.get("currentRoom")});	
		_album.artist		= _album.artist==''?'unknow':_album.artist;
		_album.timeAgo 		=  timeAgo(_album.createTime);		
		_album.length 		= _album.numSong;
		_album.cover 		= (_album.cover)?_album.cover:getCoverAlbum(_album.genre);
		_album.isAdmin   	= Session.get("isAdmin");		
		_album.url   		= AbsoluteUrl() + "a/"+title2Alias(_album.title) +"."+_album._id;
				
	return _album;
}

Template.playlistInfo.created=function(){
	//console.log(" --- > playlistInfo Created");
}

Template.playlistInfo.rendered=function(){
	if(Session.get("currentRoom")=="")return false;
	
	
	var album = Album.findOne({_id:Session.get('currentRoom')});
		album.url = Meteor.absoluteUrl('a/') + title2Alias(album.title) + '.' + album._id; 
		
		console.log(" --- > playlistInfo rendered",album.url);
		
	setTimeout(function(){
		var fbLikeDiv = $("#albumTitle #fbLike");	
			fbLikeDiv.html('');
			fbLikeDiv.html('<div class="fb-like" data-href="'+ album.url +'" data-send="true" data-layout="button_count" data-width="100" data-show-faces="false"></div>');
			if(FB)FB.XFBML.parse(fbLikeDiv[0]); 
	},1000);
	
}


Template.playlistInfo.events = {
	'keydown #changeCover':function(e){				
		if(e.keyCode==13){			
			if($(e.currentTarget).val()!="")
				Meteor.call("updateAlbumCover",$(e.currentTarget).val(),Session.get("currentRoom"));
		}	
	}
	
	,'click #changeCover':function(e){	
		$(e.currentTarget).select();
	}
	
	,'click #albumEditBtn':function(e){	
		e.preventDefault();
		
		if(isAdmin()){
			// Hide playlist
			$('#page2 #gallery').hide();
			Session.set('edit',true);			
		}		
	}
}

/**
##############################################################################################
*/

Template.albumEdit.edit=function(){	
	return Session.get('edit');	
}

Template.albumEdit.created=function(){	
	console.log('Template albumEdit created');
}

Template.albumEdit.rendered=function(){
	
	if(isAdmin() == true && Session.get('currentRoom') != '' && Session.get('edit')==true){		
		var album = Album.findOne({_id:Session.get('currentRoom')})
		if(album){
			//console.log('Template albumEdit rendered',title2Alias(album.genre),album.policy,album.live);
			
			$("#albumEdit #title").val(album.title);
			//$("#albumEdit #genre option:selected").val(title2Alias(this.data.genre));
			
			$('#albumEdit input:radio[name=policy][value='+album.policy+']').prop('checked', true);		
			$('#albumEdit input:checkbox[name=live]').prop('checked', album.live);
			$('#albumEdit input:checkbox[name=addSong]').prop('checked', album.allowAddSong);
			
			$('#albumEdit input:checkbox[name=activeSong]').prop('checked', album.allowActiveSong);
			
			if(album.allowAddSong)$('#albumEdit #activeSong').css('opacity',1);
			else $('#albumEdit #activeSong').css('opacity',0.1);	
			
			$("#albumEdit input:checkbox[name=addSong]").change(function() {				
				if(this.checked){
					$('#albumEdit #activeSong').css('opacity',1);					
				}else{
					$('#albumEdit #activeSong').css('opacity',0.1);	
					$('#albumEdit input:checkbox[name=activeSong]').prop('checked', false);
				}
			});
			
		}
	}
	
}

Template.albumEdit.destroyed=function(){
	console.log('Remove album edit html');
}

Template.albumEdit.events = {
	'click .cancel':function(e){	
		e.preventDefault();
		console.log('Khong luu thay doi');
		// remove this template		
		Session.set('edit',false);
		// Tro lai playlist
		$('#page2 #gallery').show();
	}
	
	,'click .save':function(e){	
		e.preventDefault();
				
		if(isAdmin()){			
		
			var _album={};
				_album.id = Session.get('currentRoom');
				_album.title = $("#albumEdit #title").val();
				_album.policy= parseInt($('#albumEdit input:radio[name=policy]:checked').val());
				_album.live = $('#albumEdit input:checkbox[name=live]').is(':checked') ? true : false;
				
				_album.allowAddSong = $('#albumEdit input:checkbox[name=addSong]').is(':checked') ? true : false;
				_album.allowActiveSong = $('#albumEdit input:checkbox[name=activeSong]').is(':checked') ? true : false;
							
				Meteor.call('updateAlbumInfo', _album, function(err, res){
					if(res){
						console.log('Đã cập nhật thay đổi', res);
						Session.set('edit',false);						
						// Tro lai playlist
						$('#page2 #gallery').show();
					}				
				});
		}
	}
}

/**
##############################################################################################
*/
Template.songInfo.data = function(){		
	if(Session.get("currentRoom")=="" || Session.get("currentSong")=="")return null;	
	if(listSongInMyListeningAlbum.length==0) return;
	return Song.findOne({_id:Session.get("currentSong")});
}

Template.songInfo.created = function(){		
	//console.log("-----> songInfo created");
}

Template.songInfo.rendered = function(){		
	//console.log("-----> songInfo rendered");
	setTimeout(function(){
		var fbLikeDiv = $("#songInfo #fbLike");	
			fbLikeDiv.html('');
			fbLikeDiv.html('<div class="fb-like" data-href="'+window.location.href+'" data-layout="button_count" data-width="100" data-show-faces="false"></div>');
			if(FB)FB.XFBML.parse(fbLikeDiv[0]); 
	},1000);
}

/**
##############################################################################################
*/

Template.playlist.data=function(){	
	if(Session.get("currentRoom")=="")return null;		
	
	var playlist = Song.find({albumID:Session.get("currentRoom")},{	sort:{ignore:1,createTime:1}}).fetch();
	listSongInMyListeningAlbum = [];
	var song;
	for (var i=0;i<playlist.length;i++) {
		song 				= playlist[i];		
		song.index			= i;
		song.index1 		= i+1;
		song.isAdmin 		= Session.get("isAdmin");
		song.allow 			= song.ignore==true && Session.get("isAdmin")==true ? true :false;
		song.allowRemove  	= (Session.get("isAdmin") || (Meteor.user() && Meteor.user().username == song.shareBy.username))?true:false;		
		song.timeAgo		= timeAgo(song.createTime);	
			
		listSongInMyListeningAlbum.push(song);
	}	
	return listSongInMyListeningAlbum;
}

Template.playlist.created=function(){	
	//console.log("-------------------------> playlist created");
}

Template.playlist.rendered=function(){	
	//console.log("-------------------------> Template.playlist.rendered");	
	$('#albumPlaylist').slimScroll({			
		width: $('#albumPlaylist').width() +'px',
		height: '380px',
		position:'left',		
		distance : '-20px',
		wheelStep : 10
	});
	
	// active lại item khi reActive ( như thêm hoặc xóa bài hát)
	activePlaylistItem();
}

/**
#################################################################################
*/

Template.playlistItem.created=function(){	
	//console.log("playlistItem created",this.data.title);
	
}

Template.playlistItem.rendered=function(){	
	//console.log(" >> playlistItem rendered",this.data.title);
}

Template.playlistItem.destroyed=function(){	
	//console.log(" >>Template.playlistItem.destroyed");
}

Template.playlistItem.events = {
	'click li':function(e){
		e.preventDefault();		
		
		console.log("Template.playlistItem.events --> ",$(e.target).attr("class"),Session.get("isAdmin"));
		
		
		
		if(Meteor.userId()==null){
			// Nếu không có id > chưa active bài hát
			if($(e.currentTarget).attr("id")==undefined)return false;		
			changeSong($(e.currentTarget).attr("id"));
		}else{
			
			if($(e.target).attr("class")=="remove"){
				var song = Song.findOne({_id:$(e.target).attr("id")});
				if(song){
					if(song.shareBy.username==Meteor.user().username || isAdmin()){
						console.log("remove song from playlist",$(e.target).attr("id"));
						Meteor.call("removeSongFromPlaylist", $(e.target).attr("id"),Session.get("currentRoom"));
					}
				}
			
			}else if($(e.target).attr("class")=="allow btn"){
				if(isAdmin()){
					Meteor.call('allowSongToList',$(e.target).attr("id"),Session.get('currentRoom'),function(err, res){
						console.log("allow song --> SUCCESS");
					});
				}
			}else{			
				// change song
				changeSong($(e.currentTarget).attr("id"));
			}	
		}		
	}
}

/**
#################################################################################
*/

Template.createAlbumForm.events={
	'click #saveBtn':function(e){
		e.preventDefault();

		
		// Chỉ được tạo album nếu đăng nhập
		if(Meteor.userId()){
			
			/*console.log("1.genre",$("#createAlbumForm #genre option:selected").val());
			console.log("2.genre",$("#createAlbumForm #genre option:selected").attr("value"));
			console.log("3.genre",$("#createAlbumForm #genre").attr("value"));
			console.log("4.genre", $("#createAlbumForm #genre").val());
			console.log("5.genre", $("#createAlbumForm #genre option:selected").text());*/
			
			var _album={};
				_album.title = $("#createAlbumForm #title").val();
				_album.genre = $("#createAlbumForm #genre option:selected").text();
				_album.policy= parseInt($('input:radio[name=policy]:checked').val());
				_album.owner = Meteor.user().profile.name;
				_album.cover = getCoverAlbum(_album.genre);

			if(_album.title==""){
				$("#createAlbumForm .alert-error").css('display','block');
				return false;
			}
			
			$("#createAlbumForm .alert-error").css('display','none');
			 
			Meteor.call("createAlbum", _album,function(err,res){
				if(res){				
					// close modal
					$('#createAlbumForm').modal('hide')
					
					// goto Album
					console.log("goto album", res);
					Router.navigate("a/"+title2Alias(_album.title)+"."+res,{trigger: true});
				}else{
					
				}	
			});
		}
	}
}


Template.animationBG.rendered=function(){
	
	$(".cloud").each(function(i){
				
		var _scale  = 0.7 + Math.random();
		var _opacity = Math.min(0.8, 0.7 + _scale - 1);
		var _ran	= $(window).width()*Math.random();
		var _time 	= (20 + 10*Math.random())/_opacity;
		var _depth  = parseInt(20*_opacity);
		var _blur   = 30 - _depth;
		var _css = { 
						"left"				: (i-1) * (60 + Math.random() * 60) + "px"
						,"top"				:  Math.random() * $(window).height() + "px"
						
						,"opacity"			:_opacity
						,"-webkit-transform": "scale("+_scale+")"
						,"-moz-transform"	: "scale("+_scale+")"
						,"transform"		: "scale("+_scale+")"
						
						/*,"-webkit-animation": "moveclouds "+_time+"s linear infinite"
						,"-moz-animation"	: "moveclouds "+_time+"s linear infinite"
						,"-o-animation"		: "moveclouds "+_time+"s linear infinite"*/
						,"position"			: "absolute"
						,"z-index"			: _depth
		};
		$(this).css(_css);
	})
	
}


Template.currentRoomLogged.data= function(){
	if(Session.get("currentRoom")=="")return null;
	
	var _album =  Album.findOne({_id:Session.get("currentRoom")});
	var _info = {};
		_info.title 	= _album.title;
		_info.alias 	= "a/"+title2Alias(_album.title) +"."+_album._id;
		_info.timeAgo 	=  timeAgo(_album.createTime);
		_info.owner 	= _album.owner;
		_info.genre 	= _album.genre;
		_info.length 	= _album.numSong;
	return _info;
}

Template.currentRoomLogged.events={
	'click #showAlbum':function(e){
		e.preventDefault();
		// show Room				
		if(Session.get('currentSong')!='')
			Router.navigate($(e.currentTarget).attr("href")+'/'+Session.get('currentRoom'),{trigger: true});  
		else 
			Router.navigate($(e.currentTarget).attr("href"),{trigger: true});  
	}
}
		
/**
#################################################################################
*/

Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {    
   
	console.log("#############################################",lvalue,rvalue,lvalue!=rvalue);
	
	if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

/**
#################################################################################
*/

Deps.autorun(function () {
	// Update mỗi lần trong phòng có thay đổi
	var album = Album.findOne({_id:Session.get('currentRoom')});
	if (album){
		
		if(album.live){		
			// start play bai hát
			if(album.currentSong!=''){				
				Session.set('currentSong', album.currentSong);
				playCurrentSong();
			}
		}
			
		// Set quyền Admin cho user
		if(Meteor.user() && album.owner.username == Meteor.user().username)
			Session.set('isAdmin',true);
		else 
			Session.set('isAdmin',false);
		
	}
});


/**
#################################################################################
*/
// start-up when load all js
Meteor.startup(function () {	 
	Session.set('currentPage',"home");
	loadTopAlbumList();		
});

