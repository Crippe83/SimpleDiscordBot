const Discord=require('discord.js');
const sql = require("sqlite");
const config=require('./files/config.json');
sql.open("./files/"+config.sqlDB);
const bot=new Discord.Client();

// COMMON VARIABLES
var embedMSG=""; var skip=""; var msg1=""; var msg2="";


//ROLE INFO
const roleValues=require('./files/RoleValues.json');
var countyRoles = [];
var localRoles = [];
var countyRoleValues = [];
var localRoleValues = [];




bot.on('ready', () => {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	console.info(timeStampSys+'-- DISCORD HELPBOT [ADMIN] IS READY --');console.log(console.error);

	bot.user.setActivity(`Nightwing Bot`);

	InitializeRoles();

	// CREATE DATABASE TABLE 
	sql.run("CREATE TABLE IF NOT EXISTS last_seen (userID TEXT, lastMessage TEXT, date TEXT)").catch(console.error);
	sql.run("CREATE TABLE IF NOT EXISTS ex_channels (channelName TEXT, endDate TEXT)").catch(console.error);
});






// ##########################################################################
// ############################# SERVER LISTNER #############################
// ##########################################################################
bot.on("guildBanAdd", (guild,user) => {

	// MAKE SURE MESSAGE IS IN PROPER SERVER
	if(guild.id!=config.serverID) { return }
	
	// POST BAN EVENTS TO MODLOG; WHEN USER BANS MANUALLY INSTEAD OF THROUGH COMMANDS
	if(config.banEvents==="yes") {
		let CurrTime=new Date();
		let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
		let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
		let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";

		guild.fetchAuditLogs({limit: 1,type: 22})
		.then(auditLog => {
			let masterName=auditLog.entries.map(u=>u.executor.username),masterID=auditLog.entries.map(u=>u.executor.id),
				minionName=auditLog.entries.map(u=>u.target.username),minionID=auditLog.entries.map(u=>u.target.id),
				reason=auditLog.entries.map(u=>u.reason);reason="."+String(reason)+".";
				if(reason===".."){reason="It was **not** __defined__"}else{reason=reason.slice(1,-1)}
			embedMSG={
				'color': 0xFF0000,
				'title': '🔨 "'+minionName+'" WAS BANNED',
				'thumbnail': {'url': config.bannedImg},
				'description': '**UserID**: `'+minionID+'`\n**UserTag**: <@'+minionID+'>\n'
					+'**Reason**: '+reason+'\n**By**: <@'+masterID+'>\n\n**On**: '+timeStamp
			};
			console.log(timeStampSys+"[ADMIN] [BANNED] \""+minionName+"\" ("+minionID+") was banned from "+guild.name);
			return bot.channels.get(config.modlogChannelID).send({embed: embedMSG}).catch(console.error);
		})
		.catch(console.error)
	}
});

bot.on("guildMemberAdd", member => {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";

	let guild=member.guild; let user=member.user;
	// MAKE SURE MESSAGE IS IN PROPER SERVER
	if(guild.id!=config.serverID) { return }
	console.log(timeStampSys+"[ADMIN] [JOIN] \""+user.username+"\" ("+user.id+") has joined server: "+guild.name);
	bot.channels.get(config.modlogChannelID).send(timeStampSys+" \""+user.username+"\" ("+user.id+") has joined server: "+guild.name);
});

bot.on("guildMemberRemove", member => {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";

	let g=member.guild; let u=member.user;
	// MAKE SURE MESSAGE IS IN PROPER SERVER
	if(g.id!=config.serverID) { return }
	console.log(timeStampSys+"[ADMIN] [QUIT] \""+u.username+"\" ("+u.id+") has left server: "+g.name);
	bot.channels.get(config.modlogChannelID).send(timeStampSys+" \""+u.username+"\" ("+u.id+") has left server: "+g.name);
});


//
// DATABASE TIMER FOR TEMPORARY ROLES
//
setInterval(function(){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	
	let timeNow=new Date().getTime(); let dbTime=""; let daysLeft="";
	sql.all(`SELECT * FROM temporary_roles`).then(rows => {
		if (!rows) {
			return console.info("No one is in the DataBase");
		}
		else {
			for(rowNumber="0"; rowNumber<rows.length; rowNumber++){
				dbTime=rows[rowNumber].endDate; daysLeft=(dbTime*1)-(timeNow*1);
				if(daysLeft<1){
					member=bot.guilds.get(config.serverID).members.get(rows[rowNumber].userID); if(!member){ member.user.username="<@"+rows[rowNumber].userID+">"; member.id=""; }
					console.log(timeStampSys+"[ADMIN] [TEMPORARY-ROLE] \""+member.user.username+"\" ("+member.id+") have lost their role: "+rows[rowNumber].temporaryRole+"... time EXPIRED");
					bot.channels.get(config.modlogChannelID).send("⚠ <@"+rows[rowNumber].userID+"> have **lost** their role of: **"
						+rows[rowNumber].temporaryRole+"** - their **temporary** access has __EXPIRED__ 😭 ").catch(console.error);
					
					// REMOVE ROLE FROM MEMBER IN GUILD
					let rName=bot.guilds.get(config.serverID).roles.find('name', rows[rowNumber].temporaryRole); 
					bot.guilds.get(config.serverID).members.get(rows[rowNumber].userID).removeRole(rName).catch(console.error);
					
					// REMOVE DATABASE ENTRY
					sql.get(`DELETE FROM temporary_roles WHERE userID="${rows[rowNumber].userID}"`).catch(console.error);
				}
			}
		}
	}).catch(console.error);
},900000);
// 86400000 = 24hrs
// 43200000 = 12hrs
// 21600000 = 6hrs
// 10800000 = 3hrs 
// 3600000 = 1hr


//
// END
//


//
// DATABASE TIMER FOR EX Channels
//
setInterval(function(){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	
	let timeNow=new Date().getTime(); let dbTime=""; let daysLeft="";
	sql.all(`SELECT * FROM ex_channels`).then(rows => {
		if (!rows) {
			return console.info("No EX channels exist");
		}
		else {
			for(rowNumber="0"; rowNumber<rows.length; rowNumber++){
				dbTime=rows[rowNumber].endDate;
				if(timeNow > dbTime){
					let channel=bot.guilds.get(config.serverID).channels.find("name", rows[rowNumber].channelName);
					let role = bot.guilds.get(config.serverID).roles.find("name", rows[rowNumber].channelName);
											

					bot.channels.get(config.modlogChannelID).send("Channel "+ rows[rowNumber].channelName + " deleted, raid has ended");

					if(channel) { channel.delete() }
					if(role) {role.delete() }
					
					// REMOVE DATABASE ENTRY
					sql.get(`DELETE FROM ex_channels WHERE channelName="${rows[rowNumber].channelName}"`).catch(console.error);
				}
			}
		}
	}).catch(console.error);
},300000);
// 86400000 = 24hrs
// 43200000 = 12hrs
// 21600000 = 6hrs
// 10800000 = 3hrs 
// 3600000 = 1hr
// 900000 = 15 min
// 300000 = 5 min


// ##########################################################################
// ############################## TEXT MESSAGE ##############################
// ##########################################################################
bot.on('message', message => {
	
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	
	//STOP SCRIPT IF DM/PM
	if(message.channel.type=="dm"){ return }
	
	
	// GET CHANNEL INFO
	let g=message.guild; let c=message.channel; let m=message.member; let msg=message.content; msg=msg.toLowerCase();
	
	// GET TAGGED USER
	let mentioned=""; if(message.mentions.users.first()){mentioned=message.mentions.users.first();}
	
	// REMOVE LETTER CASE (MAKE ALL LOWERCASE)
	let command=msg.toLowerCase(); command=command.split(" ")[0]; command=command.slice(config.cmdPrefix.length);

	// MAKE SURE MESSAGE IS IN PROPER SERVER
	if(g.id!=config.serverID) { return }

	// ################### Check for ignored channels ################
	if(IgnoredChannel(c.id)) { return }
	
	// GET ARGUMENTS
	let args=msg.split(" ").slice(1); skip="no";
	
	// GET ROLES FROM CONFIG
	let AdminR=g.roles.find("name", config.adminRoleName); if(!AdminR){ AdminR.id=111111111111111111; console.info("[ERROR] [CONFIG] I could not find role: "+config.adminRoleName); }
	let ModR=g.roles.find("name", config.modRoleName); if(!ModR){ ModR.id=111111111111111111; console.info("[ERROR] [CONFIG] I could not find role: "+config.modRoleName); }
	let RaidLeaderR=g.roles.find("name", config.raidLeaderRoleName); if(!RaidLeaderR){ RaidLeaderR.id=111111111111111111; console.info("[ERROR] [CONFIG] I could not find role: "+config.raidLeaderRoleName); }

	//STOP SCRIPT IF MESSAGE IS A WEBHOOK MESSAGE
	if(m===null) { return; }

	// STOP SCRIPT IF SENDER IS THIS BOT
	if (m.id===config.botID) return;
	
	

	
// 	LOG USERS LAST MESSAGE

sql.get(`SELECT * FROM last_seen WHERE userID="${m.id}"`).then(row => {
	if(!row){
		let curDate=new Date().getTime(); 						
		
		sql.run("INSERT INTO last_seen (userID, lastMessage, date) VALUES (?, ?, ?)", 
							[m.id, msg, curDate]);
	}
	else {
		let curDate=new Date().getTime();
		
		sql.run('UPDATE last_seen SET lastMessage = ?, date = ? WHERE userID = ?', [msg, curDate,m.id]);
	}
}).catch(console.error);


// ##########################################################################
// ############################## SPAM CONTROL ##############################
// ##########################################################################
	
	// DATE&TIME VALUES
	const DTdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	const DTmonths=["January","February","March","April","May","June","July","August","September","October","November","December"];
	
	
// ############################## NO OTHER INVITES EXCEPT ONES POSTED BY BOT OR STAFF ##############################
	let invLinks=msg.match(/discord.gg/g);
	if(invLinks){
		if(m.id===config.botID || m.roles.has(ModR.id) || m.roles.has(AdminR.id)){skip="yes"}
		
		if(skip==="no"){
			message.delete();
			embedMSG={
				'color': 0xFF0000,
				'title': '⚠ WARNING: No Invites ⚠',
				'thumbnail': {'url': config.warningImg},
				'description': 'You are being **WARNED** about an __invite__ code or link... '
					+'Advertising of other servers is **NOT** allowed in our server.\n**OffenseDate**: '+timeStamp
			};
			console.log(timeStampSys+"[ADMIN] [INVITE-TXT] \""+m.user.username+"\" ("+m.id+") said: "+message.content);
			m.send({embed: embedMSG}).catch(console.error);
			return m.send("Please **Read/Review Our Rules** at: <#"+config.rulesChannelID+"> ... in order to avoid Mute/Kick/Ban");
		}
	}
	
	
	


// ############################################################################
// ############################## COMMANDS BEGIN ##############################
// ############################################################################

	// MAKE SURE ITS A COMMAND
	if(!message.content.startsWith(config.cmdPrefix)){ return }
	


	
	
// ############################## STATS ##############################
	if(command==="stats"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			let onlineM=g.members.filter(m=>m.presence.status==="online").size;
			let idleM=g.members.filter(m=>m.presence.status==="idle").size;
			let busyM=g.members.filter(m=>m.presence.status==="dnd").size;
			let totalM=onlineM+idleM+busyM;
			
			embedMSG={
				'color': 0x00FF00,
				'title': '📊 SERVER STATS 📈',
				'description': ''
					+'🗨 **Online** members: **'+onlineM+'**\n'
					+'📵 **Idle** members: **'+idleM+'**\n'
					+'🔴 **Busy** members: **'+busyM+'**\n'
					+'🚫 **Invisible** members: **'+g.members.filter(m=>m.presence.status==="offline").size+'**\n'
					+'💚 **Total Online** members: **'+totalM+'**\n'
					+'📋 **Total** members __Today__: **'+g.members.size+'**\n'
					+'📜 **Registered** members: **'+g.memberCount+'**'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	

	
	
// ############################## INFO ##############################
	if(command==="info"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			if(args[0]==="server"){
				let gDate=g.createdAt; let gCreatedDate=DTdays[gDate.getDay()].slice(0,3)+" "+DTmonths[gDate.getMonth()]+" "+gDate.getDate()+", "+gDate.getFullYear();
				let userBots=message.guild.members.filter(b => b.user.bot);
				embedMSG={
					'color': 0x00FF00,
					'title': '📊 '+g.name+' » ServerInfo 📈',
					'thumbnail': {'url': g.iconURL},
					'fields': [
						{'name': '👤 ServerOwner:', 'value': '<@'+g.owner.id+'>', 'inline': true},
						{'name': '📆 DateCreated:','value': gCreatedDate,'inline': true},
						{'name': '📝 RolesCount:','value': g.roles.size,'inline': true},
						{'name': '👥 MemberCount:','value': g.memberCount,'inline': true},
						{'name': '🤖 UserBots:','value': userBots.size,'inline': true},
						{'name': '🗒 Channels:','value': g.channels.size,'inline': true}
					]
				};
				return c.send({embed: embedMSG}).catch(console.error);
			}
			if(mentioned){
				let gMember=g.members.get(mentioned.id);
				
				let joinedAt=""; let joinedDT=""; let joinedDate=""; let mRolesName=""; let userRoleCount=""; let roleNames="";
				
				// MEMBER NICKNAME
				if(!gMember.nickname){gMember.nickname="No \"/Nick\" yet"}
				
				// JOINED DATE()
				joinedAt=gMember.joinedTimestamp; joinedDT=new Date(); joinedDT.setTime(joinedAt);
				joinedDate=DTdays[joinedDT.getDay()].slice(0,3)+" "+DTmonths[joinedDT.getMonth()]+" "+joinedDT.getDate()+", "+joinedDT.getFullYear();
				
				// MEMBER ROLES
				mRolesName=gMember.roles.map(r => r.name); mRolesName=mRolesName.slice(1); userRoleCount=mRolesName.length; if(!mRolesName){userRoleCount=0} roleNames="NONE "; 
				if(userRoleCount!==0){ roleNames=mRolesName }
				
				embedMSG={
					'color': 0x00FF00,
					'title': '👤 '+mentioned.username+'\'s UserInfo',
					'thumbnail': {'url': 'https://cdn.discordapp.com/avatars/'+mentioned.id+'/'+mentioned.avatar+'.png'},
					'fields': [
						{'name': '⚠ Warning:', 'value': 'The member is inactive! The info I found is limited!', 'inline': false},
						{'name': '👥 Nick/AKA', 'value': '`'+gMember.nickname+'`', 'inline': true},
						{'name': '🕵 UserID', 'value': '`'+mentioned.id+'`', 'inline': true},
						{'name': '📝 Roles ('+userRoleCount+')', 'value': '`'+roleNames+'`', 'inline': true},
						{'name': '📆 JoinedDate', 'value': '`'+joinedDate+'`', 'inline': true}
					]
				};
				
				// LAST SEEN INFO - ONLY AVAILABLE IF MEMBER TYPED SOMETHING IN THE LAST 60 SECONDS - PER DISCORD DEFAULTS
				if(mentioned.lastMessage!==null){
					// LAST SEEN DATE
					let seenDT=new Date(); seenDT.setTime(mentioned.lastMessage.createdTimestamp); 
					let seenHr=seenDT.getHours(); if(seenHr<10){seenHr="0"+seenHr} let seenMin=seenDT.getMinutes(); if(seenMin<10){seenMin="0"+seenMin}
					let seenDate=seenDT.getDate()+"/"+DTmonths[seenDT.getMonth()].slice(0,3)+"/"+seenDT.getFullYear()+" @ "+seenHr+":"+seenMin+"hrs";
					
					embedMSG={
						'color': 0x00FF00,
						'title': '👤 '+mentioned.username+'\'s UserInfo',
						'thumbnail': {'url': 'https://cdn.discordapp.com/avatars/'+mentioned.id+'/'+mentioned.avatar+'.png'},
						'fields': [
							{'name': '👥 Nick/AKA', 'value': '`'+gMember.nickname+'`', 'inline': true},
							{'name': '🕵 UserID', 'value': '`'+mentioned.id+'`', 'inline': true},
							{'name': '📝 Roles ('+userRoleCount+'):', 'value': '`'+roleNames+'`', 'inline': true},
							{'name': '📆 JoinedDate:', 'value': '`'+joinedDate+'`', 'inline': true},
							{'name': '👁‍ LastSeenChannel:', 'value': '`#'+mentioned.lastMessage.channel.name+'`', 'inline': true},
							{'name': '⏲ LastSeenDate:', 'value': '`'+seenDate+'`', 'inline': true},
							{'name': '🗨 LastMessageSent:', 'value': '`'+mentioned.lastMessage.content+'`', 'inline': true}
						]
					};
				}
				return c.send({embed: embedMSG}).catch(console.error);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	
	
	
// ############################## DELETE ##############################
	if(command==="del"){ 
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			let amt=parseInt(msg.split(" ").slice(1))+1;
			let deleted=amt-1;
			c.fetchMessages({ limit: amt })
			.then(messages => c.bulkDelete(amt), console.log(timeStampSys+"[ADMIN] [DELETE] \""+m.user.username+"\" deleted: "+deleted+" messages from: "+g.name+" in: #"+c.name)).catch(console.error);
			return;
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}


	
	
	
// ############################## OFFLINE ##############################
	if(command==="offline"){
		let damsg; if(!args[0]){damsg="UnKnown";}
		else {damsg="";} for (var x=1; x<args.length; x++){ damsg += " "+args[x]; }
		if(m.roles.has(AdminR.id)){
			message.delete();
			c.send("⚠ @everyone ⚠\nWe're going **Offline** for: __"+args[0]+"__; "+damsg);

			embedMSG={
				'color': 0xFF0000,
				'title': 'WE ARE GOING OFFLINE',
				'thumbnail': {'url': config.offlineImg},
				'description': '\n__Reason__: **'+damsg
					+'**\n__Estimated Time__: **'+args[0]+'**\n\nSorry for the inconvenience'
			};
			return bot.channels.get(config.announcementChannelID).send({embed: embedMSG}).catch(console.error);
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	
	
	
// ############################## ROLES ##############################
	if(command.startsWith("role")){
		
		// ROLES ARE CASE SENSITIVE TO RESET MESSAGE AND ARGUMENTS
		msg=message.content; args=msg.split(" ").slice(1);
		
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			message.delete();
			if(!args[0]){
				return message.reply("usage: `!roles count`,\n or `!roles find <ROLE-NAME>`,\n or `!role @mention <ROLE-NAME>`,\n or `!role remove @mention <ROLE-NAME>`");
			}
			if(args[0]==="count"){
				return c.send("There are **"+g.roles.size+"** roles on this server");
			}
			if(args[0]==="find"){
				let daRolesN=g.roles.map(r => r.name); let meantThis="";
				
				if(!args[1]) { return c.send("Please enter a role name"); }
				// ROLES WITH SPACES
				let daRoles="";if(!args[2]){daRoles=args[1]}else{daRoles="";for(var x=1;x<args.length;x++){daRoles+=args[x]+" ";}daRoles=daRoles.slice(0,-1);}
				
				let rName=g.roles.find('name', daRoles); 
				if(!rName){
					let startWord=args[1].slice(0,3);
					for (var i=0;i<daRolesN.length;i++){
						if(daRolesN[i].startsWith(startWord)){
							meantThis += daRolesN[i] +", ";
						}
					}
					if(!meantThis){
						startWord=args[1].slice(0,2); meantThis="";
						for (var i=0;i<daRolesN.length;i++){
							if(daRolesN[i].startsWith(startWord)){
								meantThis += daRolesN[i] +", ";
							}
						}
					}
					if(!meantThis){
						startWord=args[1].slice(0,1); meantThis="";
						for (var i=0;i<daRolesN.length;i++){
							if(daRolesN[i].startsWith(startWord)){
								meantThis += daRolesN[i] +", ";
							}
						}
					}
					if(meantThis){
						return message.reply("I couldn't find such role, but I found these **roles**: "+meantThis.slice(0,-2));
					}
					return message.reply("I couldn't find such role, please try again! syntax: `!roles find <ROLE-NAME>`");
				}
				else {
					return message.reply("found it! who would you like to assign this role to? IE: `!role @mention "+daRoles+"`");
				}
			}
			if(args[0]==="remove"){
				let daRolesN=g.roles.map(r => r.name); let meantThis="";
				
				// ROLES WITH SPACES - NEW
				let daRoles="";if(!args[3]){daRoles=args[2]}else{daRoles="";for(var x=2;x<args.length;x++){daRoles+=args[x]+" ";}daRoles=daRoles.slice(0,-1);}
				
				if(!mentioned){
					return message.reply("please `@mention` a person you want me to remove `!role` from...");
				}
				if(!args[2]){
					return message.reply("what role do you want me to remove from "+mentioned+" 🤔 ?");
				}
				
				// CHECK ROLE EXIST
				let rName=g.roles.find('name', daRoles); 
				if(!rName){
					return message.reply("I couldn't find such role, please try searching for it first: `!roles find <ROLE-NAME>`");
				}
				
				// CHECK MEMBER HAS ROLE
				if(!g.members.get(mentioned.id).roles.has(rName.id)){
					return c.send("Member doesnt have this role");
				}
				else {
					mentioned=message.mentions.members.first();
					mentioned.removeRole(rName).catch(console.error);
					return c.send("⚠ "+mentioned+" have **lost** their role of: **"+daRoles+"** 😅 ");
				}
			}
			if(args[0] && !mentioned){
				return message.reply("please `@mention` a person you want me to give/remove `!role` to...");
			}
			else {
				let daRoles="";if(!args[2]){daRoles=args[1]}else{daRoles="";for(var x=1;x<args.length;x++){daRoles+=args[x]+" ";}daRoles=daRoles.slice(0,-1);}
				mentioned=message.mentions.members.first();
				
				let rName=g.roles.find('name', daRoles); 
				if(!rName){
					return message.reply("I couldn't find such role, please try searching for it first: `!roles find <ROLE-NAME>`");
				}
				mentioned.addRole(rName).catch(console.error);
				return c.send("👍 "+mentioned+", has been given the role of: **"+daRoles+"**, enjoy! 🎉");
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	
	
	
// ############################## TEMPORARY ROLES ##############################
	if(command.startsWith("temprole") || command==="tr" || command==="trole"){
		
		// ROLES ARE CASE SENSITIVE TO RESET MESSAGE AND ARGUMENTS
		msg=message.content; args=msg.split(" ").slice(1);
		
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			// message.delete();
			if(!args[0]){
				return message.reply("syntax:\n `!temprole @mention <DAYS> <ROLE-NAME>`,\n or `!temprole remove @mention`\n or `!temprole check @mention`");
			}
			if(args[0] && !mentioned){
				return message.reply("please `@mention` a person you want me to give/remove `!temprole` to...");
			}
			if(!args[1] && mentioned){
				return message.reply("imcomplete data, please try: \n `!temprole @mention <DAYS> <ROLE-NAME>`,\n or `!temprole remove @mention`\n or `!temprole check @mention`");
			}
			else {
				let dateMultiplier=86400000; mentioned=message.mentions.members.first(); 
				
				// CREATE DATABASE TABLE 
				sql.run("CREATE TABLE IF NOT EXISTS temporary_roles (userID TEXT, temporaryRole TEXT, startDate TEXT, endDate TEXT, addedBy TEXT)").catch(console.error);
				
				// CHECK DATABASE FOR ROLES
				if(args[0]==="check"){
					mentioned=message.mentions.members.first(); 
					sql.get(`SELECT * FROM temporary_roles WHERE userID="${mentioned.id}"`).then(row => {
						if(!row){
							return message.reply("⚠ [ERROR] "+mentioned+" is __NOT__ in my `DataBase`");
						}
						else {
							let startDateVal=new Date(); startDateVal.setTime(row.startDate); 
							startDateVal=(startDateVal.getMonth()+1)+"/"+startDateVal.getDate()+"/"+startDateVal.getFullYear();
							let endDateVal=new Date(); endDateVal.setTime(row.endDate); 
							finalDate=(endDateVal.getMonth()+1)+"/"+endDateVal.getDate()+"/"+endDateVal.getFullYear();
							return c.send("✅ "+mentioned+" will lose the role: **"+row.temporaryRole+"** on: `"+finalDate+"`! They were added by: <@"+row.addedBy+"> on: `"+startDateVal+"`");
						}
					}).catch(console.error); return
				}
				
				// REMOVE MEMBER FROM DATABASE
				if(args[0]==="remove"){
					mentioned=message.mentions.members.first(); 
					sql.get(`SELECT * FROM temporary_roles WHERE userID="${mentioned.id}"`).then(row => {
						if(!row){
							return message.reply("⚠ [ERROR] "+mentioned+" is __NOT__ in my `DataBase`");
						}
						else {
							let theirRole=g.roles.find('name', row.temporaryRole);
							mentioned.removeRole(theirRole).catch(console.error);
							sql.get(`DELETE FROM temporary_roles WHERE userID="${mentioned.id}"`).then(row => {
								return c.send("⚠ "+mentioned+" have **lost** their role of: **"+theirRole.name+"** and has been removed from my `DataBase`");
							});
						}
					}).catch(console.error); return
				}
				
				// CHECK AMOUNT OF DAYS WERE ADDED
				if(!args[1]){
					return message.reply("for how **many** days do you want "+mentioned+" to have this role?");
				}
				
				if(!args[2]){
					return message.reply("what role do you want to assign to "+mentioned+"?");
				}
				
				// ROLES WITH SPACES - NEW
				let daRoles="";if(!args[3]){daRoles=args[2]}else{daRoles="";for(var x=2;x<args.length;x++){daRoles+=args[x]+" ";}daRoles=daRoles.slice(0,-1);}
				
				if(!parseInt(args[1])){
					return message.reply("Error: second value has to be **X** number of days, IE:\n`!"+command+" @"+mentioned.user.username+" 90 "+daRoles+"`");
				}
				
				// CHECK ROLE EXIST
				let rName=g.roles.find('name', daRoles);
				if(!rName){
					return message.reply("I couldn't find such role, please try searching for it first: `!roles find <ROLE-NAME>`");
				}
				
				// ADD MEMBER TO DATASE, AND ADD THE ROLE TO MEMBER
				sql.get(`SELECT * FROM temporary_roles WHERE userID="${mentioned.id}"`).then(row => {
					mentioned=message.mentions.members.first(); 
					if (!row) {
						let curDate=new Date().getTime(); let finalDateDisplay=new Date(); 
						let finalDate=((args[1])*(dateMultiplier)); finalDate=((curDate)+(finalDate));
						finalDateDisplay.setTime(finalDate); finalDateDisplay=(finalDateDisplay.getMonth()+1)+"/"+finalDateDisplay.getDate()+"/"+finalDateDisplay.getFullYear();
						
						// DEBUG
						// return c.send(" curDate: `"+curDate+"`\n finalDate: `"+finalDate+"`\n dateMultiplier: `"+dateMultiplier+"`\n finalDateDisplay: "+finalDateDisplay);
						sql.run("INSERT INTO temporary_roles (userID, temporaryRole, startDate, endDate, addedBy) VALUES (?, ?, ?, ?, ?)", 
							[mentioned.id, daRoles, curDate, finalDate, m.id]);
						let theirRole=g.roles.find('name', daRoles);
						mentioned.addRole(theirRole).catch(console.error);
						console.log(timeStampSys+"[ADMIN] [TEMPORARY-ROLE] \""+mentioned.user.username+"\" ("+mentioned.id+") was given role: "+daRoles+" by: "+m.user.username+" ("+m.id+")");
						return c.send("🎉 "+mentioned+" has been given a **temporary** role of: **"+daRoles+"**, enjoy! They will lose this role on: `"+finalDateDisplay+"`");
					}
					else {
						return message.reply("this user already has a **temporary** role... try using `!temprole remove @"+mentioned.user.username+"` if you want to **change** their role.");
					}
				}).catch(console.error);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}

// ######################### CREATE EX CHANNEL #########################
	if(command==="ex"){
		if(m.roles.has(ModR.id) || m.roles.hasj(AdminR.id)){

			sql.run("CREATE TABLE IF NOT EXISTS ex_channels (channelName TEXT, endDate TEXT)").catch(console.error);
			
			if(args.length < 3) { return c.send("Proper format for !ex is:\n !ex m/d/y time gym name") }

			let currentDate = new Date();

			let dateSplit = args[0].split("/");

			// IF USER ONLY ENTERS M/D add in Y - TO DO HANDLE END OF YEAR WHEN NEED TO ADD NEXT YEAR
			if(dateSplit.length == 2) { dateSplit.push(currentDate.getFullYear()) }


			if(dateSplit.length != 3) { return c.send("Date must be in the format m/d/y") }

			let time = ParseTime(args[1]);

			if(time==="unknown") { return c.send("That is an unknown time") }

			let timeString = "";

			if(time[0] < 12)
			{
				if(time[0]===0)
				{
					timeString += "12";
				}
				else{
					timeString += time[0];
				}

				if(time[1] > 0)
				{
					timeString += time[1];
				}

				timeString += "am";

			}
			if(time[0] >= 12)
			{
				if(time[0]===12)
				{
					timeString += time[0];
				}
				else
				{
					timeString += time[0]-12;
				}

				if(time[1] > 0)
				{ 
					timeString += time[1];
				}

				timeString += "pm";
			}

			// dateSplit[2] = YEAR; dateSplit[1] = DAY; dateSplit[0] = MONTH, time[0] = HOUR end time should be +1 hour after raid start; time[1] = minutes
			let endDate = new Date(dateSplit[2],dateSplit[0]-1,dateSplit[1], time[0] + 1, time[1], 0, 0);

			// Make sure date is in the future
			if(currentDate > endDate) { return c.send("That date has already passed") }

			// CHANNEL name will be M-D_Time(pm || am)_gym_name - put it together 
			let newChannelName = dateSplit[0] + "-" + dateSplit[1] + "_" + timeString;

			for(var i = 2; i < args.length; i++)
			{
				newChannelName += "_";
				newChannelName += args[i];				
			}
							

			// Second Parameter is in the function to allow for user inputed category in the future, would need to adjust above parameter parsing
			CreateEXChannel(newChannelName,config.EXRaidCategory, g, c);

			sql.run("INSERT INTO ex_channels (channelName, endDate) VALUES (?, ?)", 
							[newChannelName, endDate]);

			return;

		}
		else
		{
			return c.send("That command can only be used by mods and admins");
		}
	}


// ########################### LAST SEEN ###############################
	if(command==="lastseen"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			if(!mentioned){
				message.delete();
				return message.reply("please `@mention` a person you want me to check for activity`");
			}
			else {
				message.delete();
				sql.get(`SELECT * FROM last_seen WHERE userID="${mentioned.id}"`).then(row => {
				if(!row){
					return c.send("User "+mentioned+" has not been seen since we started tracking");
				}
				else {
					let dateVal=new Date(); dateVal.setTime(row.date); 
					dateVal=(dateVal.getMonth()+1)+"/"+dateVal.getDate()+"/"+dateVal.getFullYear();
							

					return c.send("User "+mentioned+" was last seen on "+dateVal+" with a message of \""+row.lastMessage+"\"");

				}
				}).catch(console.error);
			}
		}
		else{
			return c.send("This command is only available to moderators and administrators");
		}
	}

// ############################# VERIFY ###################################
	if(command==="verify"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id) || m.roles.has(RaidLeaderR.id)){
			let mentioned = message.mentions.members.first();
			if(!mentioned){
				message.delete();
				return message.reply("please `@mention` a person you want me to mark as verified`");
			}
			else {				
				let verifiedRole = g.roles.find("name",config.verifiedRoleName);
				mentioned.addRole(verifiedRole).catch(console.error);
				return c.send(mentioned+" Your pictures have been approved, please proceed to the <#"+config.rulesChannelID+">");
				
			}
		}
		else{
			return c.send("This command is only available to moderators and administrators");
		}

	}
	
	
	
// ############################## WARNING ##############################
	if(command==="warn"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			if(!mentioned){
				message.delete();
				return message.reply("please `@mention` a person you want me to `!warn`");
			}
			else {
				message.delete();
				
				// IMPROVED WAY TO GRAB REASONS:
					let msgReasons;if(message.content.indexOf(" ")===-1){return}
					else{msgReasons=message.content.slice(message.content.indexOf(" "));msgReasons=msgReasons.trim();
					if(msgReasons.indexOf(" ")===-1){msgReasons="Check yourself!"}
					else{msgReasons=msgReasons.trim();msgReasons=msgReasons.slice(msgReasons.indexOf(" "));msgReasons=msgReasons.trim();}}
				
				embedMSG={
					'color': 0xFF0000,
					'title': '⚠ THIS IS A WARNING ⚠',
					'thumbnail': {'url': config.warningImg},
					'description': '**From Server**: '+config.serverName+'\n**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
				};
				bot.users.get(mentioned.id).send({embed: embedMSG}).catch(console.error);
				embedMSG={
					'color': 0xFF0000,
					'title': '⚠ "'+mentioned.username+'" WAS WARNED',
					'thumbnail': {'url': config.warningImg},
					'description': '**UserID**: '+mentioned.id+'\n**UserTag**: '+mentioned+'\n'
						+'**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
				};
				c.send("⚠ "+mentioned+", you are being **WARNED** about: **"+msgReasons+'**');
				return bot.channels.get(config.modlogChannelID).send({embed: embedMSG}).catch(console.error);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	
	
	
// ############################## MUTE ##############################
	if(command==="mute"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
			if(!mentioned){
				message.delete();
				return message.reply("please `@mention` a person you want me to `!mute`");
			}
			else {
				message.delete();
				
				// IMPROVED WAY TO GRAB REASONS:
					let msgReasons;if(message.content.indexOf(" ")===-1){return}
					else{msgReasons=message.content.slice(message.content.indexOf(" "));msgReasons=msgReasons.trim();
					if(msgReasons.indexOf(" ")===-1){msgReasons="Check yourself!"}
					else{msgReasons=msgReasons.trim();msgReasons=msgReasons.slice(msgReasons.indexOf(" "));msgReasons=msgReasons.trim();}}
				
				mentioned=message.mentions.users.first();
				c.overwritePermissions(mentioned, {SEND_MESSAGES: false})
				.then(() => {
					embedMSG={
						'color': 0xFF0000,
						'title': '🤐 "'+mentioned.username+'" WAS MUTED',
						'thumbnail': {'url': config.mutedImg},
						'description': '**UserID**: '+mentioned.id+'\n**UserTag**: '+mentioned+'\n'
							+'**Channel**: <#'+c.id+'>\n**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
					};
					bot.channels.get(config.modlogChannelID).send({embed: embedMSG}).catch(console.error);
					console.log(timeStampSys+"[ADMIN] [MUTE] \""+mentioned.username+"\" ("+mentioned.id+") was MUTED in guild: "+g.name+", channel: #"+c.name+" due to: "+msgReasons);
					return c.send("⚠ "+mentioned+" has been 🤐 **MUTED** for: **"+msgReasons+'**');
				}).catch(console.error);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	
	
	
// ############################## Time Out ##############################
	if(command==="pidgey" || command==="timeout"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){

			if(!mentioned){				
				return message.reply("please `@mention` a person you want me to discipline");
			}
			else {								
				let gMember=g.members.get(mentioned.id);

				let mRolesName=""; let userRoleCount=""; let roleNames="";

				mRolesName=gMember.roles.map(r => r.name); mRolesName=mRolesName.slice(1); userRoleCount=mRolesName.length; if(!mRolesName){userRoleCount=0} roleNames="NONE "; 
				if(userRoleCount!==0){ roleNames=mRolesName }
								
				for(i = 0; i < userRoleCount; i++)
				{
					var remove = false;
					let currentRole = g.roles.find("name",roleNames[i]);	

					if(countyRoles.indexOf(roleNames[i]) >= 0) {remove = true;}
					if(localRoles.indexOf(roleNames[i]) >= 0) {remove = true;}

					if(remove)
					{
						gMember.removeRole(currentRole).catch(console.error);
					}
				}
								
				gMember.removeRole(config.rulesAgreedRole);
				
				let timeOutRole = g.roles.find("name", config.timeOutRoleName);
				gMember.addRole(timeOutRole);

				return c.send(mentioned+"now has the role of "+config.timeOutRoleName);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	

// ############################## MUTE ##############################
if(command==="mute"){
	if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){
		if(!mentioned){
			message.delete();
			return message.reply("please `@mention` a person you want me to `!mute`");
		}
		else {
			message.delete();
			
			// IMPROVED WAY TO GRAB REASONS:
				let msgReasons;if(message.content.indexOf(" ")===-1){return}
				else{msgReasons=message.content.slice(message.content.indexOf(" "));msgReasons=msgReasons.trim();
				if(msgReasons.indexOf(" ")===-1){msgReasons="Check yourself!"}
				else{msgReasons=msgReasons.trim();msgReasons=msgReasons.slice(msgReasons.indexOf(" "));msgReasons=msgReasons.trim();}}
			
			mentioned=message.mentions.users.first();
			c.overwritePermissions(mentioned, {SEND_MESSAGES: false})
			.then(() => {
				embedMSG={
					'color': 0xFF0000,
					'title': '🤐 "'+mentioned.username+'" WAS MUTED',
					'thumbnail': {'url': config.mutedImg},
					'description': '**UserID**: '+mentioned.id+'\n**UserTag**: '+mentioned+'\n'
						+'**Channel**: <#'+c.id+'>\n**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
				};
				bot.channels.get(config.modlogChannelID).send({embed: embedMSG}).catch(console.error);
				console.log(timeStampSys+"[ADMIN] [MUTE] \""+mentioned.username+"\" ("+mentioned.id+") was MUTED in guild: "+g.name+", channel: #"+c.name+" due to: "+msgReasons);
				return c.send("⚠ "+mentioned+" has been 🤐 **MUTED** for: **"+msgReasons+'**');
			}).catch(console.error);
		}
	}
	else {
		message.delete();
		return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
	}
}



// ############################## UNMUTE ##############################
if(command==="unmute"){
	if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){

		if(!mentioned){
			message.delete();
			return message.reply("please `@mention` a person you want me to `!unmute`");
		}
		else {
			message.delete();
			mentioned=message.mentions.users.first();
			c.permissionOverwrites.get(mentioned.id).delete().catch(console.error);
			return c.send(mentioned+" can now **type/send** messages again 👍 ... but **don't** abuse it!");
		}
	}
	else {
		message.delete();
		return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
	}
}	
	
	
// ############################## KICK ##############################
	if(command==="kick"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){

			if(!mentioned){
				message.delete();
				return message.reply("please `@mention` a person you want me to `!kick`");
			}
			else {
				message.delete();
				
				// IMPROVED WAY TO GRAB REASONS:
					let msgReasons;if(message.content.indexOf(" ")===-1){return}
					else{msgReasons=message.content.slice(message.content.indexOf(" "));msgReasons=msgReasons.trim();
					if(msgReasons.indexOf(" ")===-1){msgReasons="Check yourself!"}
					else{msgReasons=msgReasons.trim();msgReasons=msgReasons.slice(msgReasons.indexOf(" "));msgReasons=msgReasons.trim();}}
				
				mentioned=message.mentions.users.first();
				console.log(timeStampSys+"[ADMIN] [KICK] \""+mentioned.username+"\" ("+mentioned.id+") was KICKED from guild: "+g.name+", channel: #"+c.name+" due to: "+msgReasons);
				c.send("⚠ "+mentioned+" has been 👢 __**kicked**__ from server for: **"+msgReasons+"**").catch(console.error);
				embedMSG={
					'color': 0xFF0000,
					'title': 'YOU HAVE BEEN KICKED',
					'thumbnail': {'url': config.kickedImg},
					'description': '**From Server**: '+config.serverName+'\n**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
				};
				bot.users.get(mentioned.id).send({embed: embedMSG}).then(()=>{
					embedMSG={
						'color': 0xFF0000,
						'title': '👢 "'+mentioned.username+'" WAS KICKED',
						'thumbnail': {'url': config.kickedImg},
						'description': '**UserID**: '+mentioned.id+'\n**UserTag**: '+mentioned+'\n'
							+'**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
					};
					bot.channels.get(config.modlogChannelID).send({embed: embedMSG}).catch(console.error);
					return g.member(mentioned.id).kick().catch(console.error);
				}).catch(console.error);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}
	
	
	
// ############################## BAN ##############################
	if(command==="ban"){
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)){

			if(!mentioned){
				message.delete();
				return message.reply("please `@mention` a person you want me to `!ban`");
			}
			else {
				
				// IMPROVED WAY TO GRAB REASONS:
					let msgReasons;if(message.content.indexOf(" ")===-1){return}
					else{msgReasons=message.content.slice(message.content.indexOf(" "));msgReasons=msgReasons.trim();
					if(msgReasons.indexOf(" ")===-1){msgReasons="Check yourself!"}
					else{msgReasons=msgReasons.trim();msgReasons=msgReasons.slice(msgReasons.indexOf(" "));msgReasons=msgReasons.trim();}}
				
				console.log(timeStampSys+"[ADMIN] [BAN] \""+mentioned.username+"\" ("+mentioned.id+") was BANNED from guild: "+g.name+", channel: #"+c.name+" due to: "+msgReasons);
				c.send("⛔ "+mentioned+" has been __**banned**__ 🔨 from server for: **"+msgReasons+"**").catch(console.error);
				embedMSG={
					'color': 0xFF0000,
					'title': 'YOU HAVE BEEN BANNED',
					'thumbnail': {'url': config.bannedImg},
					'description': '**From Server**: '+config.serverName+'\n**Reason**: '+msgReasons+'\n\n**By**: '+m.user+'\n**On**: '+timeStamp
				};
				bot.users.get(mentioned.id).send({embed: embedMSG}).then(()=>{
					return g.member(mentioned.id).ban({days: 7, reason: msgReasons}).catch(console.error);
				}).catch(console.error);
			}
		}
		else {
			message.delete();
			return message.reply("you are **NOT** allowed to use this command!").catch(console.error); 
		}
	}	
	
	
	
	if(command==="restart"){
		if(m.roles.has(AdminR.id)){
			if(args[0]==="admin"){
				message.reply("Restarting **Admin** (`adminBot.js`) module... please wait `5` to `10` seconds").then(()=>{ process.exit(1) }).catch(console.error);
			}
		}
	}	
});

//Values stored in an array alternating between title and value, pull them to two separate arrays
function InitializeRoles()
{
	//FIRST MAKE SURE DATA WAS LOADED
	if(roleValues.countyRoles.length <= 0)
	{
		console.log("Error no county role values set");
		return;		
	}
	if(roleValues.localRoles.length <= 0)
	{
		console.log("Error no local role values set");
		return;
	}

	//PULL COUNTY ROLE VALUES
	for(var i = 0; i < roleValues.countyRoles.length; i = i + 2)
	{
		countyRoles.push(roleValues.countyRoles[i]);
	}
	for(var i = 1; i < roleValues.countyRoles.length; i = i + 2)
	{
		countyRoleValues.push(roleValues.countyRoles[i]);
	}

	//PULL SUBSECTION ROLE VALUES
	for(var i = 0; i < roleValues.localRoles.length; i = i + 2)
	{
		localRoles.push(roleValues.localRoles[i]);
	}
	for(var i = 1; i < roleValues.localRoles.length; i = i + 2)
	{
		localRoleValues.push(roleValues.localRoles[i]);
	}

	


	return;
}

function CreateEXChannel(channelName, categoryName, guild, msgChannel)
{
	
	let newCategory = guild.channels.find("name", categoryName);
	
	// CREATE CHANNEL
	guild.createChannel(channelName, "text").then(channel => {
		// MOVE CHANNEL TO REQUESTED CATEGORY
		channel.setParent(newCategory);	
		// HIDE THE CHANNEL FROM @EVERYONE IN ORDER TO HAVE A JOINABLE LOBBY
		let everyone = guild.roles.find("name", "@everyone")	;
		channel.overwritePermissions(everyone, {READ_MESSAGES: false, READ_MESSAGE_HISTORY: false});
		// CREATE ROLE WITH THE SAME NAME AS THE CHANNEL AND GIVE IT PERMISSION TO READ, READ HISTORY and SEND MESSAGES
		guild.createRole({name: channelName}).then(role => {
			channel.overwritePermissions(role, {READ_MESSAGES: true, READ_MESSAGE_HISTORY: true, SEND_MESSAGES: true});
		});
		// SEND A MESSAGE TO THE CHANNEL SO USERS CAN FIND AND JOIN THE EX LOBBY
		let exListChannel = guild.channels.find("id", config.exListChannel);
		exListChannel.send("To join the lobby for <#"+channel.id+"> react to this message with ✅").then(function(message){
			message.react("✅");
		});
		return msgChannel.send("I have created channel <#"+channel.id+">");
	});
	
}


function ParseTime(time)
{
	var am = time.includes("am");
	var pm = time.includes("pm");
	var parsedTime = [];

	if(am && pm) { return "unknown" }

	if(am || pm)
	{
		time = time.slice(0,-2);
	}

	
	
	switch(time.length)
	{
		case 1:
		parsedTime[0] = Number(time);
		parsedTime[1] = 0;
		break;

		case 2:
		parsedTime[0] = Number(time);
		parsedTime[1] = 0;
		break;

		case 3:
		parsedTime[0] = Number(time.slice(0,-2));
		parsedTime[1] = Number(time.slice(1,3));
		break;

		case 4:
		parsedTime[0] = Number(time.slice(0,-2));
		parsedTime[1] = Number(time.slice(2,4));
		break;
	}

	if(pm && parsedTime[0]!==12) { parsedTime[0] += 12 }
	if(am && parsedTime[0]===12) { parsedTime[0] = 0 }

	if(parsedTime[0] < 0 || parsedTime[0] > 23 || parsedTime[1] < 0 ||  parsedTime[1] > 60) { return "unknown" }

	return parsedTime;
}

// ################ WATCH FOR EX REACTIONS
bot.on('messageReactionAdd', (reaction, user) => {
	if(reaction.message.channel.id!==config.exListChannel) { return }
	if(user.bot) { return }
	if(reaction.emoji.name === "✅")
	{
		let channelID = ParseChannelName(reaction.message.content);

		let channel = reaction.message.channel.guild.channels.find("id", channelID);

		let exRole = reaction.message.channel.guild.roles.find("name", channel.name);

		if(!exRole) { return reaction.message.channel.send("That raid appears to have ended") }

		let member = reaction.message.channel.guild.members.get(user.id);

		member.addRole(exRole);


	}
});

// ################ WATCH FOR EX REACTION REMOVAL 
bot.on('messageReactionRemove', (reaction, user) => {
	if(reaction.message.channel.id!==config.exListChannel) { return }
	if(user.bot) { return }
	if(reaction.emoji.name === "✅")
	{
		let channelID = ParseChannelName(reaction.message.content);

		let channel = reaction.message.channel.guild.channels.find("id", channelID);

		let exRole = reaction.message.channel.guild.roles.find("name", channel.name);

		if(!exRole) { return reaction.message.channel.send("That raid appears to have ended") }

		let member = reaction.message.channel.guild.members.get(user.id);

		member.removeRole(exRole);


	}
});
	

function ParseChannelName(message)
{
	
	message = message.split("#");
	message = message[1].split(">");
	message = message[0];

	return message;
	
}

function IgnoredChannel(channelID)
{
	for(id in config.ignoredChannels)
	{
		if(channelID===config.ignoredChannels[id]) { return true }
	}
	return false;
}



// log our bot in
bot.login(config.token);



bot.on('disconnected', function (){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	console.info(timeStampSys+'-- Disconnected --');console.log(console.error);
	process.exit(1);
});