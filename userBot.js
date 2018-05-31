const Discord=require('discord.js');
const bot=new Discord.Client();
const config=require('./files/config.json');
const roleValues=require('./files/RoleValues.json');
const raidList=require('./files/RaidList.json');
const ontime = require('ontime');
const Emojis = require("./Emojis.js");
const request = require('request');


const emojis = new Emojis.DiscordEmojis();


var countyRoles = [];
var localRoles = [];
var countyRoleValues = [];
var localRoleValues = [];
var donorRoles = [];
var donorRoleValues = [];


const currentPokeDexSize = 802;
const baseStats=require('./files/base_stats.json');
const pokemonNames=require('./files/pokemon.json');
var pokeDex = [];
var pokedexNames = [];

var activeRaids = [];
var raidCount = 1000;



bot.on('ready', () => {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
    console.info(timeStampSys + '-- WI POGO Bot IS READY --'); console.log(console.error);

	bot.user.setActivity(config.botName);	


	emojis.Load(bot);	
	InitializeRoles();
	InitializePokeDex();	
	
});

// CLEAR THE RESEARCH CHANNEL EVERY NIGHT at 11:55PM
ontime({ 
	cycle: '23:55:00'
}, function(ot) {

	
	let guild = bot.guilds.find("id", config.serverID);

	let researchChannel = guild.channels.find("name",config.researchChannel);
	researchChannel.fetchMessages({limit : 99}).then(messages => {
		researchChannel.bulkDelete(messages);				
	});	

	

	ot.done();
	return;
})




// ##########################################################################
// ############################## TEXT MESSAGE ##############################
// ##########################################################################
bot.on('message', message => {
	
	// STOP SCRIPT IF TEXT IS PRIVATE MESSAGE
	if (message.channel.type == "dm") { return }
    
	
		
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	
		
	// COMMON VARIABLES
	let g=message.guild; let c=message.channel; let m=message.member; let msg=message.content; let cmds="";
	let mentioned=""; if(message.mentions.users.first()){mentioned=message.mentions.users.first();}
	
	// GET ROLES FROM CONFIG
	let AdminR=g.roles.find("name", config.adminRoleName);
	let ModR=g.roles.find("name", config.modRoleName);
	
	// REMOVE LETTER CASE (MAKE ALL LOWERCASE)
	let command=msg.toLowerCase(); command=command.split(" ")[0]; command=command.slice(config.cmdPrefix.length);
	
	// GET ARGUMENTS AND REPLACE NEW LINE WITH SPACE TO HANDLE MULTIPLE LINE MESSAGES
	msg = msg.replace(/\n/gi, ' ');
	let args=msg.split(" ").slice(1);
	
	// REMOVE ANY BLANK ARGS
	while(args.indexOf("")!==-1)
	{
		args.splice(args.indexOf(""),1);
	}

	
	//STOP SCRIPT IF MESSAGE IS A WEBHOOK MESSAGE
	if(m===null) { return; }

	// STOP SCRIPT IF SENDER IS THIS BOT
	if (m.id===config.botID) return;
	
	
	// MAKE SURE MESSAGE IS IN PROPER SERVER
	if(g.id!=config.serverID) { return }



// ################### Check for ignored channels ################
	if(IgnoredChannel(c.id)) { return }
	
	
// ######################### COMMANDS #############################



// MAKE SURE ITS A COMMAND
if(!message.content.startsWith(config.cmdPrefix)) { return }

	if(command==="commands" || command==="help") {
		if(args[0]==="mods") {
			if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)) {
				cmds="--- ** COMMANDS FOR MODS ** ---\n"
					+"`!info server`   \\\u00BB   to display server's info\n"
					+"`!info @mention`   \\\u00BB   to display user's info\n"
					+"`!roles`   \\\u00BB   ROLES multiple options\n"
					+"`!role <ROLE-NAME> @mention`   \\\u00BB   to assign roles\n"
					+"`!temprole`   \\\u00BB   ROLES multiple options\n"
					+"`!temprole <ROLE-NAME> @mention <DAYS>`   \\\u00BB   to assign temporary roles\n"
					+"`!warn @mention spam/foul/troll/pics/adv`   \\\u00BB   preset warning or:\n"
					+"`!timeout @mention Put someone on a time out"
					+"`!warn @mention REASON`   \\\u00BB   for custom reasons\n"
					+"`!mute @mention REASON`   \\\u00BB   to mute an user\n"
					+"`!unmute @mention`   \\\u00BB   to unmute an user\n"
					+"`!kick @mention REASON`   \\\u00BB   to kick an user\n"
					+"`!ban @mention REASON`   \\\u00BB   to ban an user";
				return c.send(cmds).catch(console.error);
			}
			else {
				return message.reply("you are **NOT** allowed to use this command! \ntry using: `!commands`").catch(console.error); 
			}
		}
		if(c.id!==config.botsupportChannelID){
			return message.reply("this command can only be used at: <#"+config.botsupportChannelID+">");
		}
		if(!args[0]) {
				c.send("!join <ROLE-NAME> \\\u00BB Join a rank use this in <#"+config.regionsortingChannelID+">");
				c.send("!raid time target description   \\\u00BB   Create a raid post with the specified start time, raid boss and location/description");
				c.send("!regions   \\\u00BB   list of all joinable areas on our server");
				c.send("!pd Name or Number  \\\u00BB Useful Pokemon information, \nOptional flags after name or number: Attack Defense Stamina Level All Shiny or Alolan");
				c.send("!appraise Name or Number  \\\u00BB This will print a string that you can paste in to the pokemon search in game to spit out all possible CP values");
				c.send("!cp Pokemon CPValue              \\\u00BB    Prints out a list of possible Level and IV ranges for a pokemon with a specific CP value");
				c.send("!research Description        \\\u00BB   Posts a research description/location to <#"+config.researchChannel+">");
				return; 
		}
		
		return;
	}

	
	
	
	// ######################### RULES #############################	
	if(command==="rules") {
		message.delete();
		if(!mentioned) {
			return c.send("Please __READ__ our **RULES** at \\\u00BB <#"+config.rulesChannelID+">").catch(console.error);
		} 
		else {
			return c.send("Hey "+mentioned+", Please __READ__ the **RULES** at \\\u00BB <#"+config.rulesChannelID+"> in order to avoid **MUTE** <(^.^<)").catch(console.error);
		}
	}

	// ################### FIELD RESEARCH REPORT ####################
	if(command==="research")
	{
		if(!args)
		{
			return c.send("Proper use is !research County <location/reward>");
		}
		else
		{

					
			let researchString = "";
			let researchURL = "";
			let attachmentURL = ""
			
			for(var i = 0; i < args.length; i++)
			{
				if(args[i].match(/http/gi))
				{
					researchURL = args[i];
				}
				else
				{
					researchString += args[i];
					researchString += " ";
				}
			}

			researchString.slice(0,-1);

			let attachment = message.attachments.values().next().value;
			if(attachment) { attachmentURL = attachment.url }

			let submittedBy = message.member.nickname;

			if(submittedBy==null) {submittedBy = message.author.username}

			var color = Math.floor(Math.random()*16777215);
			

			
			let researchChannel = g.channels.find("name",config.researchChannel);
			

			if(!researchChannel)
			{
				return c.send("I could not locate a channel by the name of: "+config.researchChannel);
			}
			else
			{
				

				let webhookMessage = {
					'username': submittedBy,
					'avatarURL': message.member.user.displayAvatarURL,
					'embeds': [{
						'color': color,
						'url': researchURL,
						'image' : {'url': attachmentURL},
						'title': researchString
					}]};

				SendWebhookMessage(webhookMessage,researchChannel, "Research Channel");

				DelayedDeleteMessage(message, 30000);
			}			
			
		}
	}

	
	if(command==="faq")
	{
		if(m.roles.has(ModR.id) || m.roles.has(AdminR.id))
		{
			if(!args[0]) { return c.send("Please specify a message ID to post to the faq channel") }
			
			c.fetchMessage(args[0]).then(message => {

				
				let submittedBy = message.member.nickname;
				if(submittedBy==null) {submittedBy = message.author.username}

				let attachments = message.attachments;

				let embeddedAttachments = [];
				var attachedFiles;
				let send = false;

				attachments.forEach(function(attachment) {
					var newEmbed;
					let newAttachment = {'url':attachment.url};
					if(attachment.height)
					{
						newEmbed = {'image': newAttachment };
						embeddedAttachments.push(newEmbed);	
						send = true;	
					}
					else
					{
						attachedFiles=newAttachment;
					}
							
				});

				let webhookMessage = {
					'content': message.content,
					'username': submittedBy,
					'avatarURL': message.member.user.displayAvatarURL,					
					'embeds': embeddedAttachments
				};

				let faqChannel = g.channels.find("name",config.faqChannel);

				
				if(send)
				{
					SendWebhookMessage(webhookMessage, faqChannel, "faq Webhook");
					DelayedDeleteMessage(message,30000);
					return;
				}
				else
				{
					return c.send("I can only post messages with pictures in to the "+faqChannel);
				}

			}).catch(function(error) {console.error(error); c.send("I could not find that message ID");});
			
		}
		else
		{
			return c.send("That command is only available to moderators");
		}
	}	
	

	// #################### CP COMBINATIONS #########################
	if(command==="cp")
	{
		if(c.id != config.botsupportChannelID) { return c.send("This command can only be used in <#"+config.botsupportChannelID+">")};
		if(!args[0] || !args[1])
		{
			return c.send("Proper use is !cp Name or Dex# CP alolan");
		}
		else
		{
			//FIRST ARGUMENT NEEDS TO BE POKEDEX NAME OR NUMBER
			let dexNumber = args[0];

			let alolan = false;

			//IF Pokemon passes is a name rather than a number retrieve the corresponding number
			if(isNaN(dexNumber))
			{
				dexNumber = dexNumber.toLowerCase();
				dexNumber = pokedexNames.indexOf(dexNumber) + 1;
			}

			if(dexNumber == 0) { return c.send("I could not find a Pokemon with the name: "+args[0])}

			//PULL DATA FROM CONFIG FILES AND SET DEFAULT IV/LEVEL to MAX
			let pokemon = pokeDex[dexNumber - 1];
			let imgURL =config.imgURL+dexNumber+config.imgFormat;

			let CP = parseInt(args[1]);			
			if(isNaN(CP))
			{
				return c.send("I could not read this CP as a proper number: "+CP);
			}
			if(args[2]==="alolan" || args[2]==="alola")
			{
				alolan = true;
				imgURL = config.imgURL+dexNumber+"-alola"+config.imgFormat;
			}
			
			let possibleIVs = "Possible combinations for: "+pokemon.name+" with a CP value of: "+CP+"\n";			

			for(var level=1; level <= 35; level++)
			{				
				let lowerRange = -1;
				let upperRange = 0;

				for(var attack = 0; attack <= 15; attack++)
				{
					for(var defense = 0; defense <= 15; defense++)
					{
						for(var stamina = 0; stamina <= 15; stamina++)
						{
							let currentCP = CalculateCP(pokemon,level,attack,defense,stamina, alolan);

							if(currentCP===CP)
							{
								let foundCPPercent = (attack+defense+stamina) / 45;
								foundCPPercent *= 100;
								foundCPPercent = PrecisionRound(foundCPPercent,1);

								if(foundCPPercent < lowerRange || lowerRange==-1) { lowerRange = foundCPPercent }
								if(foundCPPercent > upperRange) { upperRange = foundCPPercent }
							}
						}
					}

				}

				if(lowerRange >= 0) 
				{ 
					if(lowerRange == upperRange)
					{
						possibleIVs += "Level "+level+": "+lowerRange+"%\n";
					}
					else
					{
						possibleIVs += "Level "+level+": "+lowerRange+"% - "+upperRange+"%\n";
					}
				}

			}

			possibleIVs.slice(0,-1);

			if(possibleIVs.length > 2000)
			{
					possibleIVs = "There are too many combinations at that CP value to output";
			}

			var color = Math.floor(Math.random()*16777215);

			embedMSG={
				'color': color,
				'title': pokemon.name,
				'thumbnail': {'url': imgURL},
				'description': possibleIVs
			};


			return c.send({embed: embedMSG});

		}
		
	}


	// ######################### Appraisal ##############################
	if(command==="appraisal" || command==="appraise")
	{
		if(c.id != config.botsupportChannelID) { return c.send("This command can only be used in <#"+config.botsupportChannelID+">")};
		if(!args[0])
		{
			c.send("Proper use !appraisal Name or Dex#");
			c.send("Optional flags: Attack: Defense: Stamina: Level:");
			c.send("Must have a colon between command and number to modify A/D/S/L");
			return;
		}
		else
		{
			//FIRST ARGUMENT NEEDS TO BE POKEDEX NAME OR NUMBER
			let dexNumber = args[0];

			//IF Pokemon passes is a name rather than a number retrieve the corresponding number
			if(isNaN(dexNumber))
			{
				dexNumber = dexNumber.toLowerCase();
				dexNumber = pokedexNames.indexOf(dexNumber) + 1;
			}

			if(dexNumber == 0) { return c.send("I could not find a Pokemon with the name: "+args[0])}

			//PULL DATA FROM CONFIG FILES AND SET DEFAULT IV/LEVEL to MAX
			let pokemon = pokeDex[dexNumber - 1];
			let pokemonName = pokedexNames[dexNumber - 1];
			let attack = 15;
			let defense = 15;
			let stamina = 15;		
			let level = 35;	
			let CP = 10;
			//NORMAL SPRITE URL
			let imgURL =config.imgURL+dexNumber+config.imgFormat;
			let alolan = false;
			let alolanString = "";

			

			

			if(pokemon){

				for(i = 1; i < args.length; i++)
				{
					let currentArg = args[i].split(":",2);

					currentArg[0] = currentArg[0].toLowerCase();

					switch(currentArg[0])
					{
						case "l":
						{
							
							if(isNaN(currentArg[1])) { return c.send("Error Level must be a number") }
							level = currentArg[1];
							break;
						}
						case "level":
						{
							if(isNaN(currentArg[1])) { return c.send("Error Level must be a number") }
							level = currentArg[1];
							break;
						}
						case "a":
						{
							attack = currentArg[1];
							break;
						}
						case "attack":
						{
							attack = currentArg[1];
							break;
						}
						case "d":
						{
							defense = currentArg[1];
							break;
						}
						case "defense":
						{
							defense = currentArg[1];
							break;
						}
						case "s":
						{
							stamina = currentArg[1];
							break;
						}
						case "stamina":
						{
							stamina = currentArg[1];
							break;
						}		
						case "alolan":
						{
							alolan = true;
							alolanString = "ALOLAN ";
							break;
						}	
						case "alola":
						{
							alolan = true;
							alolanString = "ALOLAN ";
							break;
						}			
						default:
						return c.send("I don't recognize your command: "+args[i]);
						break;
					}
				}

				let attackRange = ParseRange(attack);
				let defenseRange = ParseRange(defense);
				let staminaRange = ParseRange(stamina);

				if(attackRange==="unknown"||defenseRange==="unknown"||staminaRange==="uknown")
				{
					return c.send("I could not properly read your IV range input");
				}

				//CHECK FOR VALID IV RANGE
				if(attackRange[0] < 0 || attackRange[0] > 15 || attackRange[1] < 0 || attackRange[1] > 15 
					|| defenseRange[0] < 0 || defenseRange[0] > 15 || defenseRange[1] < 0 || defenseRange[1] > 15 
					|| staminaRange[0] < 0 || staminaRange[0] > 15 || staminaRange[1] < 0 || staminaRange[1] > 15 )
				{
					return c.send("All IV stats must be between 0 and 15");
				}

				let outputString = +dexNumber+"&";

				let cpValues = [];
				
				for(var l = 1; l <= level; l++)
				{
					for(var a = attackRange[0]; a <= attackRange[1]; a++)
					{
						for(var d = defenseRange[0]; d <= defenseRange[1]; d++)
						{
							for(var s = staminaRange[0]; s <= staminaRange[1]; s++)
							{
								let CP = CalculateCP(pokemon, l, a, d, s,alolan);

								CP = "cp"+CP;
								if(cpValues.indexOf(CP)===-1) {cpValues.push(CP)}
							}
						}
					}					
				}
				outputString = outputString + cpValues.join(",");				
				

				if(outputString.length > 2000)
				{
					outputString = "You have too wide of a range of IV values and I cannot output that string";
				}

				
				
				c.send("To find all CP values for "+alolanString+pokemonName.toUpperCase()+" enter the following string:");
				return c.send(outputString);
				
			}
			else {return c.send("I did not find an acceptable Pokemon with that index number");}
		}
				
	}
	



	// ######################### PokeDex #############################
	if(command==="pd" || command==="pokedex") {

		if(c.id != config.botsupportChannelID) { return c.send("This command can only be used in <#"+config.botsupportChannelID+">")};
		if(!args[0])
		{
			c.send("Proper use !pd Name or Dex#");
			c.send("Optional flags: Attack, Defense, Stamina, Level, All, or Shiny");			
			return;
		}
		else
		{
			//FIRST ARGUMENT NEEDS TO BE POKEDEX NAME OR NUMBER
			let dexNumber = args[0];

			//IF Pokemon passes is a name rather than a number retrieve the corresponding number
			if(isNaN(dexNumber))
			{
				dexNumber = dexNumber.toLowerCase();
				dexNumber = pokedexNames.indexOf(dexNumber) + 1;
			}

			if(dexNumber == 0) { return c.send("I could not find a Pokemon with the name: "+args[0])}

			//PULL DATA FROM CONFIG FILES AND SET DEFAULT IV/LEVEL to MAX
			let pokemon = pokeDex[dexNumber - 1];
			let pokemonName = pokedexNames[dexNumber - 1];
			let attack = 15;
			let defense = 15;
			let stamina = 15;
			let level = 40;
			let CP = 10;
			//NORMAL SPRITE URL
			let imgURL = "";

			

			if(pokemon)
			{

				// REMOVE POKEMON NAME
				args.splice(0,1);

				args = CombineArgs(args);
				let shiny = false;
				let alolan = false;
				let alolanString ="";
				

				for(var i = 0; i < args.length; i=i+2)
				{
					let currentArg = parsePDArg(args[i], args[i+1]);

					switch(currentArg[0])
					{
						case "error":
						{
							return c.send("Error: "+currentArg[1]);
							break;
						}
						case "attack":
						{
							attack = currentArg[1];
							break;
						}
						case "defense":
						{
							defense = currentArg[1];
							break;
						}
						case "stamina":
						{
							stamina = currentArg[1];
							break;
						}
						case "level":
						{
							level = currentArg[1];
							break;
						}
						case "halflevel":
						{
							level = parseInt(level);
							level += .5;
							break;
						}
						case "all":
						{
							attack = currentArg[1];
							defense = currentArg[1];
							stamina = currentArg[1];
							break;
						}
						case "shiny":
						{
							shiny = true;
							if(currentArg[1]==="alolan") { alolanString = "-alola"; alolan=true; }
							break;
						}
						case "alola":
						{
							alolan=true;
							alolanString = "-alola";
							break;
						}
					}
					
				}
				if(shiny)
				{
					imgURL = config.shinyimgURL+dexNumber+alolanString+config.imgFormat;	
				}	
				else
				{
					imgURL = config.imgURL+dexNumber+alolanString+config.imgFormat;
				}	
				if(alolan && !pokemon.alolan)	
				{
					return c.send("I do not have an Alolan form in my database for that Pokemon");
				}
				

				//CHECK FOR VALID LEVEL RANGE
				if(level > 40 || level < 1){ return c.send("Please enter a valid level between 1 and 40")};

				//CHECK FOR VALID IV RANGE
				if(attack < 0 || attack > 15 || defense < 0 || defense > 15 || stamina < 0 || stamina > 15)
				{
					return c.send("All IV stats must be between 0 and 15");
				}
			

				CP = CalculateCP(pokemon, level, attack, defense, stamina, alolan);

				let pokemonTypeString = GetTypeString(pokemon.types);				
				let defending = pokemon.defending;
				let baseAttack = pokemon.attack;
				let baseDefense = pokemon.defense;
				let baseStamina = pokemon.stamina;

				if(alolan)
				{
					pokemonTypeString = GetTypeString(pokemon.alolantypes);					
					defending = pokemon.alolandefending;
					baseAttack = pokemon.alolanattack;
					baseDefense = pokemon.alolandefense;
					baseStamina = pokemon.alolanstamina;
				}

				var color = Math.floor(Math.random()*16777215);

				let description = 	'**Type**: '+pokemonTypeString+'\n'+'**PokeDex#**: '+dexNumber+'\n**Attack**: '+baseAttack+'\n'
									+'**Defense**: '+baseDefense+'\n**Stamina**: '+baseStamina+'\n**Level**: '+level+'\n'
									+'**A/D/S**: '+attack+'/'+defense+'/'+stamina+' **CP**: '+CP+'\n\n'+"**As defender**:\n"+defending+"\n";
									

				
				return ScrapePokemonMoves(pokemon,description,imgURL,c);

				/*embedMSG={
					'color': color,
					'title': pokemon.name,
					'thumbnail': {'url': imgURL},
					'description': description
				};*/

				

				
				
			}
			else {return c.send("I did not find an acceptable Pokemon with that index number");}
		}
				
	}
	
// ######################### AGREE #############################
if(command==="agree") {
	if(c.id!==config.rulesreadChannelID)
	{
		return;
	}
	else
	{
		return m.addRole(config.rulesAgreedRole);
	}
}	
	
// ######################### DONATE #############################
	if(command==="paypal" || command==="donate") {
		
			var color = Math.floor(Math.random()*16777215);
			let embedMSG={
				'color': color,
				'title': '\u00BB\u00BB One time PayPal donation without benefit \u00AB \u00AB',
				'url': config.paypalURL,				
				'description': "Thank you for your continued support",
			};
			
			c.send("To make a donation with benefits see: <#"+config.donationChannelID+">");
			return c.send({embed: embedMSG}).catch(console.error);
			
		
	}	
	
	
	

	


// ######################### JOIN ROLES ###############################
	if(command==="join") {
		if(!args[0]) { return c.send("Proper useage !join <ROLE NAME> see <#"+config.regionsortingInfoChannelID+"> for more info")}
	

	//ROLES WITH SPACES
	let daRoles="";if(!args[1]){daRoles=args[0]}else{daRoles="";for(var x=0;x<args.length;x++){daRoles+=args[x]+" ";}daRoles=daRoles.slice(0,-1);}
	
	daRoles = daRoles.toLowerCase();

	let rName=g.roles.find('name', daRoles); 
		if(!rName){
			return c.send("I could not find that role, see <#"+config.regionsortingInfoChannelID+"> for more info");
		}	
		
		let roleText = rName.name;
		let isDonor = false;

		for(donors in config.donorRoleNames)
		{
			let donorRole = g.roles.find("name",config.donorRoleNames[donors]);
			isDonor = m.roles.has(donorRole.id);
			if(isDonor) { break }
			
		}
		
		
		let isDonorRole = false;

		if(donorRoles.indexOf(roleText) >= 0)
		{
			isDonorRole = true;		

		}
		
		
		if(isDonorRole && !isDonor)
		{
			return c.send("Sorry this role is only available to donors see <#"+config.donationChannelID+"> for more info");
		}

		var currentRoleValue = CalculateRoleValue(m);
		var newRoleValue = GetNewRoleValue(roleText);
		
		//IF ROLE ISN'T IN SORTING CONFIG
		if(newRoleValue == -1)
		{
			return c.send("Sorry that role is not a joinable role see <#"+config.regionsortingInfoChannelID+"> for more info");
		}

		//CHECK IF NEW POINT TOTAL IS REDUNDANT DUE TO DONOR/NON DONOR COUNTYWIDE
		if(countyRoles.indexOf(daRoles) >= 0 || donorRoles.indexOf(daRoles) >= 0)
		{
			let index = countyRoles.indexOf(daRoles);
			if(index >= 0)
			{
				if(m.roles.find("name",donorRoles[index]))
				{
					newRoleValue = 0;
				}
			}
			index = donorRoles.indexOf(daRoles)
			if(index >= 0 && index < countyRoles.length)
			{
				if(m.roles.find("name",countyRoles[index]))
				{
					newRoleValue = 0;
				}
			}
		}

		var newTotal = currentRoleValue + newRoleValue;


		if(newTotal > roleValues.totalAllowed && newRoleValue > 0)
		{
			return c.send("Sorry "+m+" you are already sorted to too many roles, we only allow up to 4 total counties worth of scans per user");
		}
		
		m.addRole(rName).catch(console.error);
		return c.send("👍 You have been given the role of: **"+daRoles+"**, "+m+" enjoy! 🎉");
	}

	// ######################### LEAVE ROLES ###############################
	if(command==="leave") {
		if(!args[0]) { return c.send("Proper useage !leave <ROLE NAME> see <#"+config.regionsortingInfoChannelID+"> for more info")}
	

	//ROLES WITH SPACES
	let daRoles="";if(!args[1]){daRoles=args[0]}else{daRoles="";for(var x=0;x<args.length;x++){daRoles+=args[x]+" ";}daRoles=daRoles.slice(0,-1);}
	daRoles = daRoles.toLowerCase();
	

	let rName=g.roles.find('name', daRoles); 
		if(!rName){
			return c.send("I could not find that role, see <#"+config.regionsortingInfoChannelID+"> for more info");
		}		
		
		if(!g.members.get(m.id).roles.has(rName.id)){
			return c.send("Member doesnt have this role");
		}
		else {
			m.removeRole(rName).catch(console.error);
			return c.send("⚠ You have left the role of: **"+daRoles+"** "+m+" 😅 ");
		}
	}

	if(command==="leaveall") {
		
		let mRolesName=""; let userRoleCount=""; let roleNames="";

		mRolesName=m.roles.map(r => r.name); mRolesName=mRolesName.slice(1); userRoleCount=mRolesName.length; if(!mRolesName){userRoleCount=0} roleNames="NONE "; 
		if(userRoleCount!==0){ roleNames=mRolesName }

		for(i = 0; i < userRoleCount; i++)
		{
			var remove = false;
			let currentRole = g.roles.find("name",roleNames[i]);	

			if(donorRoles.indexOf(roleNames[i]) >= 0) {remove = true;}
			if(countyRoles.indexOf(roleNames[i]) >= 0) {remove = true;}
			if(localRoles.indexOf(roleNames[i]) >= 0) {remove = true;}

			if(remove)
			{
				m.removeRole(currentRole).catch(console.error);
			}
		}

		return c.send("I have removed you from all joinable ranks");
	}

	// ########################## LIST ALL JOINABLE REJOINS ################################

	if (command==="regions") {
		
		var message = "County Roles:\n";
		
		
		for(role in countyRoles)
		{
			message = message + countyRoles[role] + "\n";
		}
		message += "\nDonor Roles:\n";
		for(role in donorRoles)
		{
			message = message + donorRoles[role] + "\n";
		}
		message += "\nLocal Roles:\n";
		for(role in localRoles)
		{
			message = message + localRoles[role] + "\n";
		}

		message = message + "\n\nTo join any of these roles type !join <rolename>";

		return c.send(message);
	  }

	  // ##################### CREATE RAID MESSAGE #############################
	if(command==="raid")
	{
		if(args.length < 2) { return c.send("Proper format is !raid time Pokemon gym URL\nOr !raid edit # stuff to edit") }

		if(args[0]==="edit")
		{
			let raidNumber = args[1];
			args = args.slice(2);

			return c.send(EditActiveRaid(raidNumber,args));
		}
		
		let time = ParseTime(args[0]);

		if(time==="unknown") { return c.send("That is an unknown time\nProper format is !raid time Pokemon gym URL") }

		let currentDate = new Date();
		
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

			timeString += ":";
			
			if(time[1] < 10) { timeString += "0" }
			timeString += time[1];
			

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

			timeString += ":";

			if(time[1] < 10) { timeString += "0" }

			timeString += time[1];
			

			timeString += "pm";
		}

		// dateSplit[2] = YEAR; dateSplit[1] = DAY; dateSplit[0] = MONTH, time[0] = HOUR end time should be +1 hour after raid start; time[1] = minutes
		let endDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(), time[0], time[1] + 30, 0, 0);
		let startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(), time[0], time[1], 0, 0);

		// Make sure date is in the future
		if(currentDate > endDate) { return c.send("That time has already passed") }

		let dexNumber = args[1];
		let raidEgg = false;
		let tier = 0;

		if(dexNumber.startsWith("tier"))
		{
			raidEgg = true;			
			dexNumber = dexNumber. split(/(\d+)/).filter(Boolean);
			if(dexNumber.length!=2) { return c.send("I cannot read this raid target: "+args[1])}
			tier = parseInt(dexNumber[1]);	
			
			
		}

		//IF Pokemon passes is a name rather than a number retrieve the corresponding number
		if(isNaN(dexNumber) && !raidEgg)
		{
			dexNumber = dexNumber.toLowerCase();
			 dexNumber = pokedexNames.indexOf(dexNumber) + 1;
		}

		if((dexNumber <= 0 || dexNumber > currentPokeDexSize) && !raidEgg) { return c.send("I could not find a Pokemon with the name/number: "+args[1])}

		let imgURL = config.imgURL+dexNumber+config.imgFormat;
		

		
		
		let stamina = GetRaidBossStamina(dexNumber);
		let pokemon = pokeDex[dexNumber - 1];
		if(raidEgg)
		{
			pokemon = pokeDex[15];
			imgURL = "https://raw.githubusercontent.com/apavlinovic/pokemon-go-imagery/master/Sprite/ic_raid_egg_legendary.png";
			if(tier <= 4) { imgURL = "https://raw.githubusercontent.com/apavlinovic/pokemon-go-imagery/master/Sprite/ic_raid_egg_rare.png"; }
			if(tier <= 2) { imgURL = "https://raw.githubusercontent.com/apavlinovic/pokemon-go-imagery/master/Sprite/ic_raid_egg_normal.png";}
		}

		if(!pokemon || !pokemon.attack) { return c.send("I could not find a pokemon for "+args[1]); }

		let CP = ((pokemon.attack + 15) * Math.sqrt(pokemon.defense + 15) * Math.sqrt(stamina)) / 10;

		CP = Math.floor(CP);

		let raidTitle = "";
		let raidURL = "";


		for(var i = 2; i < args.length; i++)
		{
			if(args[i].match(/http/gi))
			{
				raidURL = args[i];
			}
			else
			{
				raidTitle += args[i];
				raidTitle += " ";
			}
		}

		if(raidTitle==="") { raidTitle = "Unspecified Gym" }

		raidCount++;

		var activeRaid = 
		{
			name:raidTitle,
			URL:raidURL,
			messageID:message.id,
			channel:c,
			raidTime:timeString,
			endTime:endDate,
			startTime:startDate,
			attending:[],
			arrived:[],
			raidBoss:pokemon,
			bossCP:CP,
			img:imgURL,
			raidNumber:raidCount,
			reposted:false,
			egg:raidEgg,
			tier:tier

		}

		let embedMSG = GenerateRaidEmbed(activeRaid);
		

		
		

		c.send({embed: embedMSG}).then(message => {

			
			activeRaid.messageID = message.id;
			

			// EMOJIS for USER TO REACT IN SET ORDER
			message.react(emojis.valorEmoji).then(reaction => {
				message.react(emojis.mysticEmoji).then(reaction => {
					message.react(emojis.instinctEmoji).then(reaction => {
						message.react("✅")})})});

			activeRaids.push(activeRaid);

			
		});
		
	}
	


	    
	
});

// REACTIONS FOR RAID LOBBIES
bot.on('messageReactionAdd', (reaction,user) => {
	if(user.bot) { return; }
	
	var reactedRaid;

	
	for(var i = 0; i < activeRaids.length; i++)
	{
		if(reaction.message.id===activeRaids[i].messageID)
		{
			if(reaction.emoji.name==="✅")
			{
				let index = activeRaids[i].attending.indexOf(user.username);
				if(index !== -1) { activeRaids[i].attending.splice(index,1) }

				if(activeRaids[i].arrived.indexOf(user.username)===-1)
				{
					activeRaids[i].arrived.push(user.username);
				}

				reactedRaid = activeRaids[i];
				
			}

			if(reaction.emoji.id===emojis.valorEmoji.id || reaction.emoji.id===emojis.mysticEmoji.id || reaction.emoji.id===emojis.instinctEmoji.id)
			{
				
				

				// Don't allow the same user to attend twice
				if(activeRaids[i].attending.indexOf(user.username) == -1 && activeRaids[i].arrived.indexOf(user.username) == -1)
				{
					activeRaids[i].attending.push(user.username);
				}

				reactedRaid = activeRaids[i];
				
			}

			break;
		}
	}

	// IF THIS WASN'T A RAID REACT
	if(!reactedRaid) { return; }
	
	let embedMSG = GenerateRaidEmbed(reactedRaid);

	reaction.message.edit({embed: embedMSG});

	
	
});

bot.on('messageReactionRemove', (reaction,user) => {
	if(user.bot) { return; }
	
	var reactedRaid;

	
	for(var i = 0; i < activeRaids.length; i++)
	{
		if(reaction.message.id===activeRaids[i].messageID)
		{
			if(reaction.emoji.name==="✅")
			{
				let index = activeRaids[i].arrived.indexOf(user.username);
				if(index !== -1) { activeRaids[i].arrived.splice(index,1) }

				let valorReact = reaction.message.reactions.get(emojis.valorEmoji.identifier).users.get(user.id);
				let mysticReact = reaction.message.reactions.get(emojis.mysticEmoji.identifier).users.get(user.id);
				let instinctReact = reaction.message.reactions.get(emojis.instinctEmoji.identifier).users.get(user.id);


				if(valorReact || mysticReact || instinctReact)
				{
					activeRaids[i].attending.push(user.username);
				}

				reactedRaid = activeRaids[i];
				
			}

			if(reaction.emoji.id===emojis.valor.id || reaction.emoji.id===emojis.mystic.id || reaction.emoji.id===emojis.instinct.id)
			{

				let valorReact = reaction.message.reactions.get(emojis.valorEmoji.identifier).users.get(user.id);
				let mysticReact = reaction.message.reactions.get(emojis.mysticEmoji.identifier).users.get(user.id);
				let instinctReact = reaction.message.reactions.get(emojis.instinctEmoji.identifier).users.get(user.id);
				

				let index = activeRaids[i].attending.indexOf(user.username);
				if(index !== -1 && !(valorReact || mysticReact || instinctReact)) { activeRaids[i].attending.splice(index,1) }

				reactedRaid = activeRaids[i];
				
			}

			break;
		}
	}

	// IF THIS WASN'T A RAID REACT
	if(!reactedRaid) { return; }

	let embedMSG= GenerateRaidEmbed(reactedRaid);

	reaction.message.edit({embed: embedMSG});

	
	
});





function PrecisionRound(number, precision) 
{
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
}

//Fill out Pokemon in to an array from the json data files
function InitializePokeDex()
{

	for(var i = 1; i <= currentPokeDexSize; i++)
	{
		var newPokemon =
		{
			name:pokemonNames[i].name,
			attack:baseStats[i].attack,
			defense:baseStats[i].defense,
			stamina:baseStats[i].stamina,
			alolan:baseStats[i].alolan,
			alolanattack:baseStats[i].alolanattack,
			alolandefense:baseStats[i].alolandefense,
			alolanstamina:baseStats[i].alolanstamina,
			height:baseStats[i].height,
			weight:baseStats[i].weight,			
			gen:baseStats[i].generation,
			isLegendary:baseStats[i].legendary,
			type1:baseStats[i].type1,
			type2:baseStats[i].type2,
			types:pokemonNames[i].types,
			alolantypes:pokemonNames[i].alolantypes,
			defending:GetDefendingString(pokemonNames[i].types),			
			alolandefending:GetDefendingString(pokemonNames[i].alolantypes)			
		};

		pokedexNames.push(pokemonNames[i].name.toLowerCase());

		pokeDex.push(newPokemon);
	
	}

	return;
}

function GetDefendingString(types)
{
	if(!types) { return "" }
	let bug = 1;
	let dark = 1;
	let dragon = 1;
	let electric = 1;
	let fairy = 1;
	let fighting = 1;
	let fire = 1;
	let flying = 1;
	let ghost = 1;
	let grass = 1;
	let ground = 1;
	let ice = 1;
	let normal = 1;
	let poison = 1;
	let psychic = 1;
	let rock = 1;
	let steel = 1;
	let water = 1;

	let weak = baseStats.weak;
	let strong = baseStats.strong;
	let immune = baseStats.immune;
	

	for(var i = 0; i < types.length; i++)
	{
		
		
		switch(types[i].toLowerCase())
		{
			case "bug":
				fighting *= weak;
				fire *= strong;
				flying *= strong;
				grass *= weak;
				ground *= weak;
				rock *= strong;
				break;
			case "dark":
				bug *= strong;
				dark *= weak;
				fairy *= strong;
				fighting *= strong;
				ghost *= weak;
				psychic *= immune;
				break;
			case "dragon":
				dragon *= strong;
				electric *= weak;
				fairy *= strong;
				fire *= weak;
				grass *= weak;
				ice *= strong;
				water *= weak;
				break;
			case "electric":
				electric *= weak;
				flying *= weak;
				ground *= strong;
				steel *= weak;				
				break;
			case "fairy":
				bug *= weak;
				dark *= weak;
				dragon *= immune;				
				fighting *= weak;
				poison *= strong;
				steel *= strong;
				break;
			case "fighting":
				bug *= weak;
				dark *= weak;
				fairy *= strong;
				flying *= strong;
				psychic *= strong;
				rock *= weak;
				break;
			case "fire":
				bug *= weak;
				fairy *= weak;
				fire *= weak;
				grass *= weak;
				ground *= strong;
				ice *= weak;
				rock *= strong;
				steel *= weak;
				water *= strong;			
				break;
			case "flying":
				bug *= weak;
				electric *= strong;
				fighting *= weak;
				grass *= weak;
				ground *= immune;
				ice *= strong;
				rock *= strong;				
				break;
			case "ghost":
				bug *= weak;
				dark *= strong;
				fighting *= immune;
				ghost *= strong;
				normal *= immune;
				poison *= weak;				
				break;
			case "grass":
				bug *= strong;
				electric *= weak;
				fire *= strong;
				flying *= strong;
				grass *= weak;
				ground *= weak;
				ice *= strong;
				poison *= strong;
				water *= weak;				
				break;
			case "ground":
				electric *= immune;
				grass *= strong;
				ice *= strong;
				poison *= weak;
				rock *= weak;
				water *= strong;				
				break;
			case "ice":
				fighting *= strong;
				fire *= strong;
				ice *= weak;
				rock *= strong;
				steel *= strong;				
				break;
			case "normal":
				fighting *= strong;
				ghost *= immune;				
				break;
			case "poison":
				bug *= weak;
				fairy *= weak;
				fighting *= weak;
				grass *= weak;
				ground *= strong;
				poison *= weak;
				psychic *= strong;				
				break;
			case "psychic":
				bug *= strong;
				dark *= strong;
				fighting *= weak;
				ghost *= strong;
				psychic *= weak;
				break;
			case "rock":
				fighting *= strong;
				fire *= weak;
				flying *= weak;
				grass *= strong;
				ground *= strong;
				normal *= weak;
				poison *= weak;
				steel *= strong;
				water *= strong;				
				break;
			case "steel":
				bug *= weak;
				dragon *= weak;
				fairy *= weak;
				fighting *= strong;
				fire *= strong;
				flying *= weak;
				grass *= weak;
				ground *= strong;
				ice *= weak;
				normal *= weak;
				poison *= immune;
				psychic *= weak;
				rock *= weak;
				steel *= weak;				
				break;
			case "water":
				electric *= strong;
				fire *= weak;
				grass *= strong;
				ice *= weak;
				steel *= weak;
				water *= weak;				
				break;
			
		}

		

		
	}	

	bug = PrecisionRound(bug,3);
	dark = PrecisionRound(dark,3);
	dragon = PrecisionRound(dragon,3);
	electric = PrecisionRound(electric,3);
	fairy = PrecisionRound(fairy,3);
	fighting = PrecisionRound(fighting,3);
	fire = PrecisionRound(fire,3);
	flying = PrecisionRound(flying,3);
	ghost = PrecisionRound(ghost,3);
	grass = PrecisionRound(grass,3);
	ground = PrecisionRound(ground,3);
	ice = PrecisionRound(ice,3);
	normal = PrecisionRound(normal,3);
	poison = PrecisionRound(poison,3);
	psychic = PrecisionRound(psychic,3);
	rock = PrecisionRound(rock,3);
	steel = PrecisionRound(steel,3);
	water = PrecisionRound(water,3);

	let defendingString = "";


		if(bug!=1)
		{
			defendingString += emojis.bug;
			defendingString += bug;
			defendingString += "x";
		}
		if(dark!=1)
		{
			defendingString += emojis.dark;
			defendingString += dark;
			defendingString += "x";
		}
		if(dragon!=1)
		{
			defendingString += emojis.dragon;
			defendingString += dragon;
			defendingString += "x";
		}
		if(electric!=1)
		{
			defendingString += emojis.electric;
			defendingString += electric;
			defendingString += "x";
		}
		if(fairy!=1)
		{
			defendingString += emojis.fairy;
			defendingString += fairy;
			defendingString += "x";
		}
		if(fighting!=1)
		{
			defendingString += emojis.fighting;
			defendingString += fighting;
			defendingString += "x";
		}
		if(fire!=1)
		{
			defendingString += emojis.fire;
			defendingString += fire;
			defendingString += "x";
		}
		if(flying!=1)
		{
			defendingString += emojis.flying;
			defendingString += flying;
			defendingString += "x";
		}
		if(ghost!=1)
		{
			defendingString += emojis.ghost;
			defendingString += ghost;
			defendingString += "x";
		}
		if(grass!=1)
		{
			defendingString += emojis.grass;
			defendingString += grass;
			defendingString += "x";
		}
		if(ground!=1)
		{
			defendingString += emojis.ground;
			defendingString += ground;
			defendingString += "x";
		}
		if(ice!=1)
		{
			defendingString += emojis.ice;
			defendingString += ice;
			defendingString += "x";
		}
		if(normal!=1)
		{
			defendingString += emojis.normal;
			defendingString += normal;
			defendingString += "x";
		}
		if(poison!=1)
		{
			defendingString += emojis.poison;
			defendingString += poison;
			defendingString += "x";
		}
		if(psychic!=1)
		{
			defendingString += emojis.psychic;
			defendingString += psychic;
			defendingString += "x";
		}
		if(rock!=1)
		{
			defendingString += emojis.rock;
			defendingString += rock;
			defendingString += "x";
		}
		if(steel!=1)
		{
			defendingString += emojis.steel;
			defendingString += steel;
			defendingString += "x";
		}
		if(water!=1)
		{
			defendingString += emojis.water;
			defendingString += water;
			defendingString += "x";
		}

	return defendingString;
}

function GetAttackingString(types)
{
	if(!types) { return "" }
	let bug = 1;
	let dark = 1;
	let dragon = 1;
	let electric = 1;
	let fairy = 1;
	let fighting = 1;
	let fire = 1;
	let flying = 1;
	let ghost = 1;
	let grass = 1;
	let ground = 1;
	let ice = 1;
	let normal = 1;
	let poison = 1;
	let psychic = 1;
	let rock = 1;
	let steel = 1;
	let water = 1;

	
	let weak = baseStats.weak;
	let strong = baseStats.strong;
	let immune = baseStats.immune;

	for(var i = 0; i < types.length; i++)
	{
		
		
		switch(types[i].toLowerCase())
		{
			case "bug":
				dark *= strong;
				fairy *= weak;
				fighting *= weak;
				fire *= weak;
				flying *= weak;
				ghost *= weak;
				grass *= strong;
				poison *= weak;
				psychic *= strong;
				steel *= weak;
				break;
			case "dark":
				dark *= weak;
				fairy *= weak;
				fighting *= weak;
				ghost *= strong;
				psychic *= strong;				
				break;
			case "dragon":
				dragon *= strong;
				fairy *= immune;
				steel *= weak;				
				break;
			case "electric":
				dragon *= weak;
				electric *= weak;
				flying *= strong;
				grass *= weak;
				ground *= immune;
				water *= strong;				
				break;
			case "fairy":
				dark *= strong;
				dragon *= strong;
				fighting *= strong;
				fire *= weak;
				poison *= weak;
				steel *= weak;				
				break;
			case "fighting":
				bug *= weak;
				dark *= strong;
				fairy *= weak;
				flying *= weak;
				ghost *= immune;
				ice *= strong;
				normal *= strong;
				poison *= weak;
				psychic *= weak;
				rock *= strong;
				steel *= strong;				
				break;
			case "fire":
				bug *= strong;
				dragon *= weak;
				fire *= weak;
				grass *= strong;
				ice *= strong;
				rock *= weak;
				steel *= strong;
				water *= weak;				
				break;
			case "flying":
				bug *= strong;
				electric *= weak;
				fighting *= strong;
				grass *= strong;
				rock *= weak;
				steel *= weak;				
				break;
			case "ghost":
				dark *= weak;
				ghost *= strong;
				normal *= immune;
				psychic *= strong;				
				break;
			case "grass":
				bug *= weak;
				dragon *= weak;
				fire *= weak;
				flying *= weak;
				grass *= weak;
				ground *= strong;
				poison *= weak;
				rock *= strong;
				steel *= weak;
				water *= strong;				
				break;
			case "ground":
				bug *= weak;
				electric *= strong;
				fire *= strong;
				flying *= immune;
				grass *= weak;
				poison *= strong;
				rock *= strong;
				steel *= strong;				
				break;
			case "ice":
				dragon *= strong;
				fire *= weak;
				flying *= strong;
				grass *= strong;
				ground *= strong;
				ice *= weak;
				steel *= weak;
				water *= weak;				
				break;
			case "normal":
				ghost *= immune;
				rock *= weak;
				steel *= weak;				
				break;
			case "poison":
				fairy *= strong;
				ghost *= weak;
				grass *= strong;
				ground *= weak;
				poison *= weak;
				rock *= weak;
				steel *= immune;				
				break;
			case "psychic":
				dark *= immune;
				fighting *= strong;
				poison *= strong;
				psychic *= weak;
				steel *= weak;				
				break;
			case "rock":
				bug *= strong;
				fighting *= weak;
				fire *= strong;
				flying *= strong;
				ground *= weak;
				ice *= strong;
				steel *= weak;				
				break;
			case "steel":
				electric *= weak;
				fairy *= strong;
				fire *= weak;
				ice *= strong;
				rock *= strong;
				steel *= weak;
				water *= weak;				
				break;
			case "water":
				dragon *= weak;
				fire *= strong;
				grass *= weak;
				ground *= strong;
				rock *= strong;
				water *= weak;				
				break;
						
		}

		
	}

	bug = PrecisionRound(bug,3);
	dark = PrecisionRound(dark,3);
	dragon = PrecisionRound(dragon,3);
	electric = PrecisionRound(electric,3);
	fairy = PrecisionRound(fairy,3);
	fighting = PrecisionRound(fighting,3);
	fire = PrecisionRound(fire,3);
	flying = PrecisionRound(flying,3);
	ghost = PrecisionRound(ghost,3);
	grass = PrecisionRound(grass,3);
	ground = PrecisionRound(ground,3);
	ice = PrecisionRound(ice,3);
	normal = PrecisionRound(normal,3);
	poison = PrecisionRound(poison,3);
	psychic = PrecisionRound(psychic,3);
	rock = PrecisionRound(rock,3);
	steel = PrecisionRound(steel,3);
	water = PrecisionRound(water,3);

	let attackingString = "";


	if(bug!=1)
	{
		attackingString += emojis.bug;
		attackingString += bug;
		attackingString += "x";
	}
	if(dark!=1)
	{
		attackingString += emojis.dark;
		attackingString += dark;
		attackingString += "x";
	}
	if(dragon!=1)
	{
		attackingString += emojis.dragon;
		attackingString += dragon;
		attackingString += "x";
	}
	if(electric!=1)
	{
		attackingString += emojis.electric;
		attackingString += electric;
		attackingString += "x";
	}
	if(fairy!=1)
	{
		attackingString += emojis.fairy;
		attackingString += fairy;
		attackingString += "x";
	}
	if(fighting!=1)
	{
		attackingString += emojis.fighting;
		attackingString += fighting;
		attackingString += "x";
	}
	if(fire!=1)
	{
		attackingString += emojis.fire;
		attackingString += fire;
		attackingString += "x";
	}
	if(flying!=1)
	{
		attackingString += emojis.flying;
		attackingString += flying;
		attackingString += "x";
	}
	if(ghost!=1)
	{
		attackingString += emojis.ghost;
		attackingString += ghost;
		attackingString += "x";
	}
	if(grass!=1)
	{
		attackingString += emojis.grass;
		attackingString += grass;
		attackingString += "x";
	}
	if(ground!=1)
	{
		attackingString += emojis.ground;
		attackingString += ground;
		attackingString += "x";
	}
	if(ice!=1)
	{
		attackingString += emojis.ice;
		attackingString += ice;
		attackingString += "x";
	}
	if(normal!=1)
	{
		attackingString += emojis.normal;
		attackingString += normal;
		attackingString += "x";
	}
	if(poison!=1)
	{
		attackingString += emojis.poison;
		attackingString += poison;
		attackingString += "x";
	}
	if(psychic!=1)
	{
		attackingString += emojis.psychic;
		attackingString += psychic;
		attackingString += "x";
	}
	if(rock!=1)
	{
		attackingString += emojis.rock;
		attackingString += rock;
		attackingString += "x";
	}
	if(steel!=1)
	{
		attackingString += emojis.steel;
		attackingString += steel;
		attackingString += "x";
	}
	if(water!=1)
	{
		attackingString += emojis.water;
		attackingString += water;
		attackingString += "x";
	}

	return attackingString;
}

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

	//PULL DONOR ROLE VALUES
	for(var i = 0; i < roleValues.donorRoles.length; i = i + 2)
	{
		donorRoles.push(roleValues.donorRoles[i]);
	}
	for(var i = 1; i < roleValues.donorRoles.length; i = i +2)
	{
		donorRoleValues.push(roleValues.donorRoles[i]);
	}


	return;
}

function SendWebhookMessage(message, channel, reason)
{
	if(!channel) { return }

	channel.fetchWebhooks().then(webhooks => {
		let webhook = webhooks.values().next().value;
		if(webhook)
		{
			let webhookChannel = new Discord.WebhookClient(webhook.id, webhook.token);
			webhookChannel.send(message).catch(console.error);
		}
		else
		{
			channel.createWebhook(reason).then(newWebhook =>
			{
				let webhookChannel = new Discord.WebhookClient(newWebhook.id, newWebhook.token);
				webhookChannel.send(message).catch(console.error);
			});
		}
			
	});
}

function GetNewRoleValue(rName)
{	
	let newValue= -1;

	var index= -1;

	
	
	index = countyRoles.indexOf(rName);
	if(index >= 0)
	{
		newValue = countyRoleValues[index];
		return newValue;
	}

	index = donorRoles.indexOf(rName);
	if(index >=0)
	{		
		newValue = donorRoleValues[index];
		return newValue;
	}

	index = localRoles.indexOf(rName);
	if(index >= 0)
	{
		newValue = localRoleValues[index];
		return newValue;
	}


	return newValue;
}


function CalculateRoleValue(user)
{
	let totalPoints=0;	

	
	var hasCountyRoles = [];

	//CHECK BASE COUNTY ROLE VALUE
	for(var i=0; i < countyRoles.length; i++)
	{
		var has = false;
		if(user.roles.find("name",countyRoles[i]))
		{
			has = true;
			totalPoints += countyRoleValues[i];			
		}
		
		hasCountyRoles.push(has);
	}

	//CHECK DONOR COUNTY ROLES AND DON'T COUNT DUPLICATE
	for(var i = 0; i < donorRoles.length; i++)
	{
		if(i < countyRoles.length && hasCountyRoles[i])
		{

		}
		else if(user.roles.find("name",donorRoles[i]))
		{
			totalPoints += countyRoleValues[i];
		}
	}

	//CHECK BASE ROLE VALUE
	for(var i = 0; i < localRoles.length; i++)
	{
		if(user.roles.find("name",localRoles[i]))
		{
			totalPoints += localRoleValues[i];
		}
	}

	return totalPoints;
}

function parsePDArg(arg1,arg2)
{
	let currentArg = [arg1, arg2];
	
	currentArg[0] = currentArg[0].toLowerCase();

	let returnValue = ["error","unknown error"];


	if(currentArg[0]==="l" || currentArg[0]==="level" || currentArg[0]==="l:" || currentArg[0]==="level:")
	{	
		if(isNaN(currentArg[1])) { returnValue = ["error", "Error Level must be a number"] }
		returnValue = ["level", currentArg[1]];			
		
	}
	if(currentArg[0]==="a" || currentArg[0]==="attack" || currentArg[0]==="a:" || currentArg[0]==="attack:")
	{	
		if(isNaN(currentArg[1])) { returnValue = ["error", "Error attack must be a number"] }
		returnValue = ["attack", currentArg[1]];			
		
	}	
	if(currentArg[0]==="d" || currentArg[0]==="defense" || currentArg[0]==="d:" || currentArg[0]==="defense:")
	{	
		if(isNaN(currentArg[1])) { returnValue = ["error", "Error defense must be a number"] }
		returnValue = ["defense", currentArg[1]];			
		
	}
	if(currentArg[0]==="s" || currentArg[0]==="stamina" || currentArg[0]==="s:" || currentArg[0]==="stamina:")
	{	
		if(isNaN(currentArg[1])) { returnValue = ["error", "Error stamina must be a number"] }
		returnValue = ["stamina", currentArg[1]];			
		
	}
	if(currentArg[0]==="all" || currentArg[0]==="all:")
	{	
		if(isNaN(currentArg[1])) { returnValue = ["error", "Error all must be a number"] }
		returnValue = ["all", currentArg[1]];			
		
	}
	if(currentArg[0]==="shiny" || currentArg[0]==="shiny:")
	{	
		var returnArg2 = "";
		if(currentArg[1]==="alolan" || currentArg[1]==="alolan:" || currentArg[1]==="alola" || currentArg[1]==="alola:") {returnArg2 = "alola" }
		returnValue = ["shiny",returnArg2];			
		
	}
	if(currentArg[0]==="alolan" || currentArg[0]==="alolan:" || currentArg[0]==="alola" || currentArg[0]==="alola:")
	{	
		var returnArg2 = "alola";
		if(currentArg[1]==="shiny" || currentArg[1]==="shiny:")
		{
			returnValue = ["shiny",returnArg2];			
		}
		else
		{
			returnValue = ["alola",""];
		}
		
	}
	if(currentArg[0]===".")
	{
		returnValue = ["halflevel",.5];
	}

	return returnValue;
}

function GetTypeString(types)
{
	let typeString = "";

	for(var i = 0; i < types.length; i++)
	{
		typeString += types[i];

				
		switch(types[i].toLowerCase())
		{
			case "bug":
				
				typeString += emojis.bug;
				break;
			case "dark":
				typeString += emojis.dark;
				break;
			case "dragon":;
				typeString += emojis.dragon
				break;
			case "electric":
				typeString += emojis.electric;
				break;
			case "ground":
				typeString += emojis.ground;
				break;
			case "fire":
				typeString += emojis.fire;
				break;
			case "water":
				typeString += emojis.water;
				break;
			case "rock":
				typeString += emojis.rock;
				break;
			case "fighting":
				typeString += emojis.fighting;
				break;
			case "flying":
				typeString += emojis.flying;
				break;
			case "fairy":
				typeString += emojis.fairy;
				break;
			case "normal":
				typeString += emojis.normal;
				break;
			case "ice":
				typeString += emojis.ice;
				break;
			case "grass":
				typeString += emojis.grass;
				break;
			case "steel":
				typeString += emojis.steel;
				break;
			case "poison":
				typeString += emojis.poison;
				break;
			case "ghost":
				typeString += emojis.ghost;
				break;
			case "psychic":
				typeString += emojis.psychic;
				break;
		}

		typeString += ",";
	}

	typeString = typeString.slice(0, -1);

	return typeString;
}

function IgnoredChannel(channelID)
{
	for(id in config.ignoredChannels)
	{
		if(channelID===config.ignoredChannels[id]) { return true }
	}
	return false;
}



function ParseRange(value)
{

	value = value.toString();

	if(value.length <= 2)
	{
		return [Number(value), Number(value)];
	}
	let range = value.split('-');

	if(range.length != 2)
	{
		return "unknown";
	}

	range[0] = Number(range[0]);
	range[1] = Number(range[1]);

	if(range[0] < range[1])
	{
		
		if(isNaN(range[0]) || isNaN(range[1]))
		{
			return "unknown";
		}
		else
		{
			return range;
		}
	}
	else
	{
		let lowerRange = range[1];
		let upperRange = range[0];

		range = [Number(lowerRange), Number(upperRange)];
		if(isNaN(range[0]) || isNaN(range[1]))
		{
			return "unknown";
		}
		else
		{
			return range;
		}
	}
	
	return "unknown";

}



function CombineArgs(args)
{
			

	// COMBINE TO A STRING AND MAKE LOWERCASE
	args = args.join();

	args = args.toLowerCase();


	//REMOVE COMMAS FROM NEW STRING
	args = args.replace(/,/g,"");
	

	//SPLIT IN TO INPUT AND NUMBERS AND REMOVE EMPTY SPACES
	args = args.split(/(\d+)/).filter(Boolean);

	// SHINY IS A SPECIAL CASE SINCE IT COULD END UP WITH TWO COMMANDS NEXT TO EACHOTHER, BREAK THESE IN TO SEPARATE COMMANDS
	for(var i = 0; i < args.length; i++)
	{
		if(args[i].startsWith("shiny"))
		{
			let newArg = args[i].split(/shiny/).filter(Boolean);
			// ADD A 0 FOR THE SHINY NUMBER, DOESN'T DO ANYTHING BUT KEEPS ALL COMMANDS AT TWO VARIABLES NAME AND NUMBER
			if(newArg.length > 0)
			{
				args.splice(i+1,0,"0",newArg[0]);
			}
			else
			{
				args.splice(i+1,0,"0");
			}
			args[i] = "shiny";
		}
		if(args[i].startsWith("alolan"))
		{
			let newArg = args[i].split(/alolan/).filter(Boolean);
			// ADD A 0 FOR THE SHINY NUMBER, DOESN'T DO ANYTHING BUT KEEPS ALL COMMANDS AT TWO VARIABLES NAME AND NUMBER
			if(newArg.length > 0)
			{
				args.splice(i+1,0,"0",newArg[0]);
			}
			else
			{
				args.splice(i+1,0,"0");
			}
			args[i] = "alolan";
		}
	}

	return args;
}

function CalculateCP(pokemon, level, attack, defense, stamina, alolan)
{
	let CP = 0;

	let remainder = level % 1;
	level = Math.floor(level);
	if(remainder!==0 || remainder!==.5)
	{ let pause = true; }
	
	let cpIndex = ((level * 2) - 2) + (remainder * 2);
	let CPMultiplier = baseStats.CPMultiplier[cpIndex];

	let pokemonAttack = alolan ? pokemon.alolanattack : pokemon.attack;
	let pokemonDefense = alolan ? pokemon.alolandefense : pokemon.defense;
	let pokemonStamina = alolan ? pokemon.alolanstamina : pokemon.stamina;

	let attackMultiplier = pokemonAttack + parseInt(attack);
	let defenseMultiplier = Math.pow(pokemonDefense + parseInt(defense),.5);
	let staminaMultiplier = Math.pow(pokemonStamina + parseInt(stamina),.5);
	CPMultiplier = Math.pow(CPMultiplier,2);

	CP = (attackMultiplier * defenseMultiplier * staminaMultiplier * CPMultiplier) / 10;

	CP = Math.floor(CP);

	//CP floor is 10
	if(CP < 10)  {CP = 10}
	

	return CP;
}

function DelayedDeleteMessage(message, delay)
{
	setTimeout(function() {
		if(message) { message.delete()}
		return;
	}, delay);
}

function ScrapePokemonMoves(pokemon,description,imgURL, channel)
{
	let dexNumber = pokeDex.indexOf(pokemon) + 1;
	
	request({ uri: "https://db.pokemongohub.net/pokemon/"+dexNumber,
		}, function(error, response, body) {
		var HTMLdata=body.replace(/<\/?[^>]+(>|$)/g, "");
		PokeStart=HTMLdata.indexOf("next");
		PokeEnds=HTMLdata.indexOf("Min and Max CP Per Level");
		HTMLdata=HTMLdata.slice(PokeStart,PokeEnds);
		HTMLdata=HTMLdata.split("\n"); var dataOut="";
		for (var x=0;x<HTMLdata.length;x++){
			if(HTMLdata[x]!==""){ 
				if(HTMLdata[x]!==" "){
					if(HTMLdata[x]!=="-"){
						dataOut += HTMLdata[x]+"\n";
					}
				}
			}
		}
		dataOut=dataOut.split("\n"); let newData="";
		for (var x=0; x<dataOut.length; x++) {
			newData += "["+x+"] ["+dataOut[x]+"]\n";
		}
		
		// console.info(newData);
		
		let pTypes=["water","steel","rock","psychic","poison","normal","ice","ground","grass","ghost","flying","fire","fighting","fairy","electric","dragon","dark","bug"];
		
		let pokeCP=dataOut.indexOf("Max CP"); pokeCP++;
		let pokeAtk=dataOut.indexOf("ATK"); pokeAtk++;
		let pokeDef=dataOut.indexOf("DEF"); pokeDef++;
		let pokeSta=dataOut.indexOf("STA"); pokeSta++;
		
		let pokeType=dataOut[3]; if(pTypes.some(t=>dataOut[4]===t)){ pokeType+=","+dataOut[4] }
		
		let pokeWeather=dataOut.indexOf("boosted by"); pokeWeather++; dataOut[pokeWeather]=dataOut[pokeWeather].replace("and ",""); pokeWeather=dataOut[pokeWeather].split(" ");
		
		let pokeMoves=dataOut.indexOf("Charge Move"); pokeMoves++; pokeMoves++; pokeMoves++; pokeMoves++;
		let totalMoves=dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves]; pokeMoves++; pokeMoves++; pokeMoves++;
		if(dataOut[pokeMoves]==="I" || dataOut[pokeMoves]==="II" || dataOut[pokeMoves]==="III"){
			pokeMoves++; totalMoves+=", "+dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves];pokeMoves++; pokeMoves++; pokeMoves++;
		}
		if(dataOut[pokeMoves]==="I" || dataOut[pokeMoves]==="II" || dataOut[pokeMoves]==="III"){
			pokeMoves++; totalMoves+=","+dataOut[pokeMoves]; pokeMoves++; totalMoves+="/"+dataOut[pokeMoves];
		}
		
		let returnMessage = '```json\n'
			+'	"'+dexNumber+'": {\n'
			+'		"name": "'+dataOut[1]+'",\n'
			+'		"types": "'+pokeType+'",\n'
			+'		"max_cp": "'+dataOut[pokeCP]+'",\n'
			+'		"atk": "'+dataOut[pokeAtk]+'",\n'
			+'		"def": "'+dataOut[pokeDef]+'",\n'
			+'		"sta": "'+dataOut[pokeSta]+'",\n'
			+'		"top_moves": "'+totalMoves+'"\n'
			+'	}```';

		var color = Math.floor(Math.random()*16777215);

		embedMSG={
			'color': color,
			'title': pokemon.name,
			'thumbnail': {'url': imgURL},
			'description': description+"\n**Top Moves(From Go Hub):** "+totalMoves
		};

			return channel.send({embed: embedMSG});
	});

	
}

function EditActiveRaid(raidNumber, args)
{

	let found = false;

	if(!args) { return "Please enter values for what you want me to edit"}

	raidNumber = parseInt(raidNumber);

	activeRaids.forEach(function(raid)
	{
		if(raid.raidNumber===raidNumber)
		{
			found = true;
			for(var i = 0; i < args.length; i++)
			{
				let currentArg = args[i].split(":");
				if(currentArg.length===1) { return "I could not figure out what you wanted me to edit with: "+currentArg}
				if(currentArg[0]==="time" || currentArg[0]==="starttime")
				{
					if(currentArg.length > 1)
					{
						currentArg = currentArg.slice(1);
						let time = currentArg.join("");
						time = ParseTime(time);
						if(time==="unknown") {return "I couldn't figure out what time you wanted me to change this to"}
						var timeString = "";

						if(time[0] < 12)
						{
							if(time[0]===0)
							{
								timeString += "12";
							}
							else{
								timeString += time[0];
							}

							timeString += ":";
							
							if(time[1] < 10) { timeString += "0" }
							timeString += time[1];
							

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

							timeString += ":";

							if(time[1] < 10) { timeString += "0" }

							timeString += time[1];
							

							timeString += "pm";
						}

						let currentDate = new Date();
						// dateSplit[2] = YEAR; dateSplit[1] = DAY; dateSplit[0] = MONTH, time[0] = HOUR end time should be +1 hour after raid start; time[1] = minutes
						let endDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(), time[0], time[1] + 30, 0, 0);
						let startDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate(), time[0], time[1], 0, 0);
						
						raid.raidTime = timeString;
						raid.startTime = startDate;
						raid.endTime = endDate;
					}
				}
				if(currentArg[0]==="boss" || currentArg[0]==="raidboss")
				{
					let dexNumber = currentArg[1];
					let raidEgg = false;
					let tier = 0;

					if(dexNumber.startsWith("tier"))
					{
						raidEgg = true;			
						dexNumber = dexNumber. split(/(\d+)/).filter(Boolean);
						if(dexNumber.length!=2) { return "I cannot read this raid target: "+currentArg[1]}
						tier = parseInt(dexNumber[1]);	
						
						
					}

					//IF Pokemon passes is a name rather than a number retrieve the corresponding number
					if(isNaN(dexNumber) && !raidEgg)
					{
						dexNumber = dexNumber.toLowerCase();
						dexNumber = pokedexNames.indexOf(dexNumber) + 1;
					}

					if((dexNumber <= 0 || dexNumber > currentPokeDexSize) && !raidEgg) { return "I could not find a Pokemon with the name/number: "+currentArg[1]}

					let imgURL = config.imgURL+dexNumber+config.imgFormat;
					

					
					
					let stamina = GetRaidBossStamina(dexNumber);
					let pokemon = pokeDex[dexNumber - 1];
					if(raidEgg)
					{
						pokemon = pokeDex[15];
						imgURL = "https://raw.githubusercontent.com/apavlinovic/pokemon-go-imagery/master/Sprite/ic_raid_egg_legendary.png";
						if(tier <= 4) { imgURL = "https://raw.githubusercontent.com/apavlinovic/pokemon-go-imagery/master/Sprite/ic_raid_egg_rare.png"; }
						if(tier <= 2) { imgURL = "https://raw.githubusercontent.com/apavlinovic/pokemon-go-imagery/master/Sprite/ic_raid_egg_normal.png";}
					}

					if(!pokemon || !pokemon.attack) { return "I could not find a pokemon for "+currentArg[1] }

					let CP = ((pokemon.attack + 15) * Math.sqrt(pokemon.defense + 15) * Math.sqrt(stamina)) / 10;

					CP = Math.floor(CP);

					raid.egg = raidEgg;
					raid.bossCP = CP;
					raid.raidBoss = pokemon;
					raid.img=imgURL;
					
				}
			}
		}

		let embedMSG = GenerateRaidEmbed(raid);
		raid.channel.fetchMessage(raid.messageID).then(message =>
		{
			message.edit({embed: embedMSG});
		});
	});

	if(found) { return "Your raid lobby has been edited with any new values that were valid"}

	return "I could not find an active raid with your ID: "+raidNumber;
}

function ParseTime(time)
{

	time = time.toLowerCase();
	var am = time.includes("am");
	var pm = time.includes("pm");
	var parsedTime = [];

	if(am && pm) { return "unknown" }

	if(am || pm)
	{
		time = time.slice(0,-2);
	}

	time = time.split(":");

	let newTime = "";

	for(var i = 0; i < time.length; i++)
	{
		newTime += time[i];
	}

	time = newTime;
	
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

		default:
		return "unknown";
		break;
	}

	if(pm && parsedTime[0]!==12) { parsedTime[0] += 12 }
	if(am && parsedTime[0]===12) { parsedTime[0] = 0 }

	if(parsedTime[0] < 0 || parsedTime[0] > 23 || parsedTime[1] < 0 ||  parsedTime[1] > 60) { return "unknown" }

	return parsedTime;
}

function GetRaidBossStamina(dexNumber)
{
	for(raidBoss in raidList.tier5)
	{		
		if(raidList.tier5[raidBoss]===pokedexNames[dexNumber-1])
		{
			
			return 12500;
		}
	}

	for(raidBoss in raidList.tier4)
	{		
		if(raidList.tier4[raidBoss]===pokedexNames[dexNumber-1])
		{
			
			return 7500;
		}
	}

	for(raidBoss in raidList.tier3)
	{		
		if(raidList.tier3[raidBoss]===pokedexNames[dexNumber-1])
		{
			
			return 3000;
		}
	}

	for(raidBoss in raidList.tier2)
	{		
		if(raidList.tier2[raidBoss]===pokedexNames[dexNumber-1])
		{
			
			return 1800;
		}
	}

	for(raidBoss in raidList.tier1)
	{		
		if(raidList.tier1[raidBoss]===pokedexNames[dexNumber-1])
		{
			
			return 600;
		}
	}

	return 0;
}

function GenerateRaidEmbed(raidObject)
{
	let	embedMSG={
		'color': 0xFF0000,
		'title': raidObject.name,
		'url':raidObject.URL,
		'footer': {
            'text':"Raid Lobby #    "+raidObject.raidNumber
        },
		'thumbnail': {'url': raidObject.img},
		'description': '**Name**: '+raidObject.raidBoss.name+'\n'+'**CP**: '+raidObject.bossCP+'\n'+'**Raid Time**: '+raidObject.raidTime+"\n**As defender**:\n"+raidObject.raidBoss.defending
			+'\n**En Route**: '+raidObject.attending+'\n\n**Arrived**: '+raidObject.arrived+'\n\n***React with your team emoji to indicate you are attending\n\nReact with ✅ to indicate you have arrived***'
			
	};

	if(raidObject.egg)
	{
		embedMSG={
			'color': 0xFF0000,
			'title': raidObject.name,
			'url':raidObject.URL,
			'footer': {
				'text':"Raid Lobby #    "+raidObject.raidNumber
			},
			'thumbnail': {'url': raidObject.img},
			'description': '**Name**: Tier '+raidObject.tier+'\n'+'**CP**: '+raidObject.bossCP+'\n'+'**Raid Time**: '+raidObject.raidTime
				+'\n**En Route**: '+raidObject.attending+'\n\n**Arrived**: '+raidObject.arrived+'\n\n***React with your team emoji to indicate you are attending\n\nReact with ✅ to indicate you have arrived***'
				
		};
	}

	return embedMSG;
	
}

//
// TIMER TO REPOST AND DELETE CURRENT RAIDS
//
setInterval(function(){
	let currentTime = new Date();
	let timeDelay = 5000;

	activeRaids.forEach(function(currentRaid) {
			

		if(currentRaid)
		{
			let timeToStart = currentRaid.startTime - currentTime;
			

			setTimeout(function(){
				if(timeToStart < 300000 && !currentRaid.reposted)
				{
					currentRaid.channel.fetchMessage(currentRaid.messageID).then(message => {
						
						let embedMSG=GenerateRaidEmbed(currentRaid);

						message.channel.send({embed: embedMSG}).then(newMessage => {
							// EMOJIS for USER TO REACT IN SET ORDER
							newMessage.react(emojis.valorEmoji).then(reaction => {
								// update ID and reposted status
								currentRaid.messageID = newMessage.id;
								currentRaid.reposted = true;
								
								// REACT to new raid
								newMessage.react(emojis.mysticEmoji).then(reaction => {
									newMessage.react(emojis.instinctEmoji).then(reaction => {
										newMessage.react("✅")})})}).then(reaction => {
											newMessage.channel.send("@here this raid will begin in under 5 minutes");
											message.delete();										
										});
						});

						
					});
				}
				else if(currentTime > currentRaid.endTime)
				{
					currentRaid.channel.fetchMessage(currentRaid.messageID).then(message => {
						let index = activeRaids.indexOf(currentRaid);
						activeRaids.splice(index,1);					
					});
					
				}
			},timeDelay)
		}		

		timeDelay += 5000;
	
	});

	
},15000);

// log our bot in
bot.login(config.token);

bot.on('disconnected', function () {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	console.info(timeStampSys+'-- Disconnected --');console.log(console.error);
	process.exit(1);
});