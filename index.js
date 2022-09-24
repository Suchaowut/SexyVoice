const path = require('path');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const config = require("./config.json");

client.on('ready', () => {
  console.log('The client is ready!');

  client.user.setPresence({
      activity: { 
          name: 'SexyVoice',
          type: 'WATCHING'
      },
      status: 'dnd'
  })

	const channel = client.channels.cache.get("883278397239853136");
	if (!channel) return;
	const embed = new Discord.MessageEmbed()
		.setDescription(`SexyVoice is **Online**\n\n***สามารถสร้างห้องได้แล้ว ณ ตอนนี้***`)
		.setTimestamp()
		.setColor('#198c19');
	channel.send(embed);
	
	//  Command-Base
	const baseFile = 'command-base.js';
	const commandBase = require(`./base/${baseFile}`);

	const readCommands = dir => {
		const files = fs.readdirSync(path.join(__dirname, dir));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file));
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file));
			} else if (file !== baseFile) {
				const option = require(path.join(__dirname, dir, file));
				commandBase(client, option);
			}
		}
	};

	readCommands('commands');
})

const jointocreategame = require("./jointocreate/CreateGame.js");
jointocreategame(client);

const jointocreatemusic = require("./jointocreate/CreateMusic.js");
jointocreatemusic(client);

const jointocreateprivate = require("./jointocreate/CreatePrivate.js");
jointocreateprivate(client);

const jointocreatetalk = require("./jointocreate/CreateTalk.js");
jointocreatetalk(client);

client.login('ODc4OTg3OTI2Njg2NTU2MjAy.GtKA95.bvgrKVPll84yu-D-EEETfC0BNDSpbXpsufCRQI');
