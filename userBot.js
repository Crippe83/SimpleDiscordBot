const Discord=require('discord.js');
const bot=new Discord.Client();
const config=require('./files/config.json');
const roleValues=require('./files/RoleValues.json');
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

//Global server emojis
var bugEmoji;
var darkEmoji;
var dragonEmoji;
var electricEmoji;
var groundEmoji;
var fireEmoji;
var waterEmoji;
var rockEmoji;
var fairyEmoji;
var flyingEmoji;
var fightingEmoji;
var normalEmoji;
var iceEmoji;
var grassEmoji;
var steelEmoji;
var poisonEmoji;
var ghostEmoji;
var psychicEmoji;



bot.on('ready', () => {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
    console.info(timeStampSys + '-- WI POGO Bot IS READY --'); console.log(console.error);

	bot.user.setActivity(config.botName);	


	LoadEmojis();
	InitializeRoles();
	InitializePokeDex();
	
});



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
	
	// GET ARGUMENTS
	let args=msg.split(" ").slice(1);
	
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
					+"`!ex m/d/y time gym name` \\\u00BB to create an ex channel\n"
					+"`!warn @mention spam/foul/troll/pics/adv`   \\\u00BB   preset warning or:\n"
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
				c.send("!leave <ROLE-NAME>  \\\u00BB Leave a rank use this in <#"+config.regionsortingChannelID+">");
				c.send("!leaveall   \\\u00BB   leave all joinable ranks");
				c.send("!raids   \\\u00BB   a link to join the raid server");
				c.send("!regions   \\\u00BB   list of all joinable areas on our server");
				c.send("!pd Name or Number  \\\u00BB Useful Pokemon information, \nOptional flags after name or number: A: D: S: L: Shiny");
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



	// ######################### PokeDex #############################
	if(command==="pd" || command==="pokedex") {

		if(c.id != config.botsupportChannelID) { return c.send("This command can only be used in <#"+config.botsupportChannelID+">")};
		if(!args[0])
		{
			c.send("Proper use !pd Name or Dex#");
			c.send("Optional flags: Attack: Defense: Stamina: Level: Shiny");
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
			let level = 40;
			let CP = 10;
			//NORMAL SPRITE URL
			let imgURL =config.imgURL+dexNumber+config.imgFormat;

			

			

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
							if(isNaN(currentArg[1])) { return c.send("Error Attack must be a number") }
							attack = currentArg[1];
							break;
						}
						case "attack":
						{
							if(isNaN(currentArg[1])) { return c.send("Error Attack must be a number") }
							attack = currentArg[1];
							break;
						}
						case "d":
						{
							if(isNaN(currentArg[1])) { return c.send("Error Defense must be a number") }
							defense = currentArg[1];
							break;
						}
						case "defense":
						{
							if(isNaN(currentArg[1])) { return c.send("Error Defense must be a number") }
							defense = currentArg[1];
							break;
						}
						case "s":
						{
							if(isNaN(currentArg[1])) { return c.send("Error Stamina must be a number") }
							stamina = currentArg[1];
							break;
						}
						case "stamina":
						{
							if(isNaN(currentArg[1])) { return c.send("Error Stamina must be a number") }
							stamina = currentArg[1];
							break;
						}
						case "shiny":
						{
							imgURL =config.shinyimgURL+dexNumber+config.imgFormat;
							break;
						}
						default:
						return c.send("I don't recognize your command: "+args[i]);
					}
				}

				let remainder = level % 1;
				level = Math.floor(level);
				

				//CHECK FOR VALID LEVEL RANGE
				if(level > 40 || level < 1){ return c.send("Please enter a valid level between 1 and 40")};

				//CHECK FOR VALID IV RANGE
				if(attack < 0 || attack > 15 || defense < 0 || defense > 15 || stamina < 0 || stamina > 15)
				{
					return c.send("All IV stats must be between 0 and 15");
				}

				if(remainder===0 || remainder===0.5) {
					let cpIndex = (level * 2) - 2 + (remainder * 2);
					let CPMultiplier = baseStats.CPMultiplier[cpIndex];

					let attackMultiplier = pokemon.attack + parseInt(attack);
					let defenseMultiplier = Math.pow(pokemon.defense + parseInt(defense),.5);
					let staminaMultiplier = Math.pow(pokemon.stamina + parseInt(stamina),.5);
					CPMultiplier = Math.pow(CPMultiplier,2);

					CP = (attackMultiplier * defenseMultiplier * staminaMultiplier * CPMultiplier) / 10;

					CP = Math.floor(CP);

					//CP floor is 10
					if(CP < 10)  {CP = 10}
				}

				let pokemonTypeString = GetTypeString(pokemon.types, g);

				embedMSG={
					'color': 0xFF0000,
					'title': pokemon.name,
					'thumbnail': {'url': imgURL},
					'description': '**Type**: '+pokemonTypeString+'\n'+'**PokeDex#**: '+dexNumber+'\n**Attack**: '+pokemon.attack+'\n'
						+'**Defense**: '+pokemon.defense+'\n**Stamina**: '+pokemon.stamina+'\n**Level**: '+level+'\n'
						+'**A/D/S**: '+attack+'/'+defense+'/'+stamina+' **CP**: '+CP+'\n\n'+"**As defender**:\n"+pokemon.defending
						+'\n\n**As attacker**:\n'+pokemon.attacking
				};

				return c.send({embed: embedMSG});
				
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
		
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB One time PayPal donation without benefit \u00AB \u00AB',
				'url': config.paypalURL,				
				'description': "Thank you for your continued support",
			};
			
			c.send("To make a donation with benefits see: <#"+config.donationChannelID+">");
			return c.send({embed: embedMSG}).catch(console.error);
			
		
	}

	
	
	
	
	
// ######################### OTHER LINKS #############################
	if(command==="raids") {
		return c.send("``` "+config.raidURL+" ```").catch(console.error);
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
	
	    
	
});

function PrecisionRound(number, precision) {
	var factor = Math.pow(10, precision);
	return Math.round(number * factor) / factor;
  }

//Fill out Pokemon in to an array from the json data files
function InitializePokeDex()
{

	// POKEDEX GOES FROM 1 to MAX
	for(var i = 1; i <= currentPokeDexSize; i++)
	{
		var newPokemon =
		{
			name:pokemonNames[i].name,
			attack:baseStats[i].attack,
			defense:baseStats[i].defense,
			stamina:baseStats[i].stamina,
			height:baseStats[i].height,
			weight:baseStats[i].weight,
			gen:baseStats[i].generation,
			isLegendary:baseStats[i].legendary,
			type1:baseStats[i].type1,
			type2:baseStats[i].type2,
			types:pokemonNames[i].types,
			defending:GetDefendingString(pokemonNames[i].types),
			attacking:GetAttackingString(pokemonNames[i].types)
		};

		pokedexNames.push(pokemonNames[i].name.toLowerCase());

		pokeDex.push(newPokemon);
	
	}

	return;
}



function GetDefendingString(types)
{
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
			defendingString += bugEmoji;
			defendingString += bug;
			defendingString += "x";
		}
		if(dark!=1)
		{
			defendingString += darkEmoji;
			defendingString += dark;
			defendingString += "x";
		}
		if(dragon!=1)
		{
			defendingString += dragonEmoji;
			defendingString += dragon;
			defendingString += "x";
		}
		if(electric!=1)
		{
			defendingString += electricEmoji;
			defendingString += electric;
			defendingString += "x";
		}
		if(fairy!=1)
		{
			defendingString += fairyEmoji;
			defendingString += fairy;
			defendingString += "x";
		}
		if(fighting!=1)
		{
			defendingString += fightingEmoji;
			defendingString += fighting;
			defendingString += "x";
		}
		if(fire!=1)
		{
			defendingString += fireEmoji;
			defendingString += fire;
			defendingString += "x";
		}
		if(flying!=1)
		{
			defendingString += flyingEmoji;
			defendingString += flying;
			defendingString += "x";
		}
		if(ghost!=1)
		{
			defendingString += ghostEmoji;
			defendingString += ghost;
			defendingString += "x";
		}
		if(grass!=1)
		{
			defendingString += grassEmoji;
			defendingString += grass;
			defendingString += "x";
		}
		if(ground!=1)
		{
			defendingString += groundEmoji;
			defendingString += ground;
			defendingString += "x";
		}
		if(ice!=1)
		{
			defendingString += iceEmoji;
			defendingString += ice;
			defendingString += "x";
		}
		if(normal!=1)
		{
			defendingString += normalEmoji;
			defendingString += normal;
			defendingString += "x";
		}
		if(poison!=1)
		{
			defendingString += poisonEmoji;
			defendingString += poison;
			defendingString += "x";
		}
		if(psychic!=1)
		{
			defendingString += psychicEmoji;
			defendingString += psychic;
			defendingString += "x";
		}
		if(rock!=1)
		{
			defendingString += rockEmoji;
			defendingString += rock;
			defendingString += "x";
		}
		if(steel!=1)
		{
			defendingString += steelEmoji;
			defendingString += steel;
			defendingString += "x";
		}
		if(water!=1)
		{
			defendingString += waterEmoji;
			defendingString += water;
			defendingString += "x";
		}

	return defendingString;
}

function GetAttackingString(types)
{
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
		attackingString += bugEmoji;
		attackingString += bug;
		attackingString += "x";
	}
	if(dark!=1)
	{
		attackingString += darkEmoji;
		attackingString += dark;
		attackingString += "x";
	}
	if(dragon!=1)
	{
		attackingString += dragonEmoji;
		attackingString += dragon;
		attackingString += "x";
	}
	if(electric!=1)
	{
		attackingString += electricEmoji;
		attackingString += electric;
		attackingString += "x";
	}
	if(fairy!=1)
	{
		attackingString += fairyEmoji;
		attackingString += fairy;
		attackingString += "x";
	}
	if(fighting!=1)
	{
		attackingString += fightingEmoji;
		attackingString += fighting;
		attackingString += "x";
	}
	if(fire!=1)
	{
		attackingString += fireEmoji;
		attackingString += fire;
		attackingString += "x";
	}
	if(flying!=1)
	{
		attackingString += flyingEmoji;
		attackingString += flying;
		attackingString += "x";
	}
	if(ghost!=1)
	{
		attackingString += ghostEmoji;
		attackingString += ghost;
		attackingString += "x";
	}
	if(grass!=1)
	{
		attackingString += grassEmoji;
		attackingString += grass;
		attackingString += "x";
	}
	if(ground!=1)
	{
		attackingString += groundEmoji;
		attackingString += ground;
		attackingString += "x";
	}
	if(ice!=1)
	{
		attackingString += iceEmoji;
		attackingString += ice;
		attackingString += "x";
	}
	if(normal!=1)
	{
		attackingString += normalEmoji;
		attackingString += normal;
		attackingString += "x";
	}
	if(poison!=1)
	{
		attackingString += poisonEmoji;
		attackingString += poison;
		attackingString += "x";
	}
	if(psychic!=1)
	{
		attackingString += psychicEmoji;
		attackingString += psychic;
		attackingString += "x";
	}
	if(rock!=1)
	{
		attackingString += rockEmoji;
		attackingString += rock;
		attackingString += "x";
	}
	if(steel!=1)
	{
		attackingString += steelEmoji;
		attackingString += steel;
		attackingString += "x";
	}
	if(water!=1)
	{
		attackingString += waterEmoji;
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

function GetTypeString(types)
{
	let typeString = "";

	for(var i = 0; i < types.length; i++)
	{
		typeString += types[i];

				
		switch(types[i].toLowerCase())
		{
			case "bug":
				
				typeString += bugEmoji;
				break;
			case "dark":
				typeString += darkEmoji;
				break;
			case "dragon":;
				typeString += dragonEmoji
				break;
			case "electric":
				typeString += electricEmoji;
				break;
			case "ground":
				typeString += groundEmoji;
				break;
			case "fire":
				typeString += fireEmoji;
				break;
			case "water":
				typeString += waterEmoji;
				break;
			case "rock":
				typeString += rockEmoji;
				break;
			case "fighting":
				typeString += fightingEmoji;
				break;
			case "flying":
				typeString += flyingEmoji;
				break;
			case "fairy":
				typeString += fairyEmoji;
				break;
			case "normal":
				typeString += normalEmoji;
				break;
			case "ice":
				typeString += iceEmoji;
				break;
			case "grass":
				typeString += grassEmoji;
				break;
			case "steel":
				typeString += steelEmoji;
				break;
			case "poison":
				typeString += poisonEmoji;
				break;
			case "ghost":
				typeString += ghostEmoji;
				break;
			case "psychic":
				typeString += psychicEmoji;
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


// CHECK BOT FOR APPROPRIATE EMOJIS IN ALL SERVERS, THIS ALLOWS TO GRAB EMOJIS FROM A DIFFERENT SERVER AND SAVE EMOJI SPACE ON MAIN SERVER
// ALL EMOJIS ARE IN THIS SERVER: https://discord.gg/zqVCfPy
function LoadEmojis()
{
	let guildArray = bot.guilds;

	guildArray = Array.from(guildArray);

	for(var i = 0; i < guildArray.length; i++)
	{
		let guild = bot.guilds.find("id",guildArray[i][0]);
		if(!bugEmoji)
		{
			bugEmoji = guild.emojis.find("name","bugtype");
			if(bugEmoji) { bugEmoji = bugEmoji.toString() }
		}
		
		if(!darkEmoji)
		{
			darkEmoji = guild.emojis.find("name","dark");
			if(darkEmoji) { darkEmoji = darkEmoji.toString() }
		}

		if(!dragonEmoji)
		{
			dragonEmoji = guild.emojis.find("name","dragontype");
			if(dragonEmoji) { dragonEmoji = dragonEmoji.toString() }
		}

		if(!electricEmoji)
		{
			electricEmoji = guild.emojis.find("name","electric");
			if(electricEmoji) { electricEmoji = electricEmoji.toString() }
		}
		if(!groundEmoji)
		{
			groundEmoji = guild.emojis.find("name","ground");
			if(groundEmoji) { groundEmoji = groundEmoji.toString() }
		}
		if(!fireEmoji)
		{
			fireEmoji = guild.emojis.find("name","firetype");
			if(fireEmoji) { fireEmoji = fireEmoji.toString() }
		}
		if(!waterEmoji)
		{
			waterEmoji = guild.emojis.find("name","water");
			if(waterEmoji) { waterEmoji = waterEmoji.toString() }
		}
		
		if(!rockEmoji)
		{
			rockEmoji = guild.emojis.find("name", "rock");
			if(rockEmoji) { rockEmoji = rockEmoji.toString() }
		}
		
		if(!fairyEmoji)
		{
			fairyEmoji = guild.emojis.find("name","fairy");
			if(fairyEmoji) { fairyEmoji = fairyEmoji.toString() }
		}
		
		if(!flyingEmoji)
		{
			flyingEmoji = guild.emojis.find("name","flying");
			if(flyingEmoji) { flyingEmoji = flyingEmoji.toString() }
		}

		if(!fightingEmoji)
		{
			fightingEmoji = guild.emojis.find("name","fighting");
			if(fightingEmoji) { fightingEmoji = fightingEmoji.toString() }
		}

		if(!normalEmoji)
		{
			normalEmoji = guild.emojis.find("name","normal");
			if(normalEmoji) { normalEmoji = normalEmoji.toString() }
		}

		if(!iceEmoji)
		{
			iceEmoji = guild.emojis.find("name","ice");
			if(iceEmoji) { iceEmoji = iceEmoji.toString() }
		}

		if(!grassEmoji)
		{
			grassEmoji = guild.emojis.find("name","grass");
			if(grassEmoji) { grassEmoji = grassEmoji.toString() }
		}

		if(!steelEmoji)
		{
			steelEmoji = guild.emojis.find("name","steel");
			if(steelEmoji) { steelEmoji = steelEmoji.toString() }
		}

		if(!poisonEmoji)
		{
			poisonEmoji = guild.emojis.find("name","poison");
			if(poisonEmoji) { poisonEmoji = poisonEmoji.toString() }
		}

		if(!ghostEmoji)
		{
			ghostEmoji = guild.emojis.find("name","ghosttype");
			if(ghostEmoji) { ghostEmoji = ghostEmoji.toString() }
		}

		if(!psychicEmoji)
		{
			psychicEmoji = guild.emojis.find("name","psychic");
			if(psychicEmoji) { psychicEmoji = psychicEmoji.toString() }
		}
	}
	
}



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