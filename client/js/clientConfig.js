// khai bao cac bien Config
likeCountToGetTopComment = 2;


maxPost     = 0;
loadStep    = 50;
pageOffset  = 15;
fromPostID	= 0;
joinTime    = Date.now();
currentPath = "";
_buzzArr    = [];
_currentBuzz=undefined;

/**Khai bao session*/

Session.set('currentPage',"");
Session.set('currentIndex', loadStep); 
Session.set('pageIndex',1);
Session.set('currentRoom',"");
Session.set('reviewRoom',"");
Session.set('currentSong',"");
Session.set('currentSongSource',"");
Session.set('isAdmin',false);
Session.set('edit',false);

// Cau hinh url ung dung
AbsoluteUrl = function(){	
	//return "http://"+$.url().attr("host")+":"+$.url().attr("port") + "/";
	return Meteor.absoluteUrl();
}


listSongInMyListeningAlbum=[];

isActive = true;
onRoom = false;

defaultTitle = 'FAV.VN - Favorite music';
