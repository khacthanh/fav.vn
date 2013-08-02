Album 	= new Meteor.Collection("albums");
Song 	= new Meteor.Collection("songs");
Message = new Meteor.Collection("message");

/**
Song = {};
					
	title
	artist
	shareBy
	domain
	source
	albumID 
	createTime 
	like 
	unlike 
*/

/**
Message = {};
		owner 		: {userID, username, name}
		message		: text ..		
		objectID	:String ID
		roomID 		:String ID
		createTime	:Date.now();
*/

UsersConnect = new Meteor.Collection('users_connect');