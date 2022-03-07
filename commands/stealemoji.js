const Discord = require('discord.js');

module.exports = {
    commands: ['add-emoji','steal-emoji','moji'],
    permissions: ["ADMINISTRATOR"],
    callback: async(message, args, client) => {
      if (!args.length) return message.channel.send('add-emoji <emoji>');
      for (const emojis of args) {
        const getEmoji = Discord.Util.parseEmoji(emojis);

        if (getEmoji.id) {
          const emojiExt = getEmoji.animated ? '.gif' : '.png';
          const emojiURL = `https://cdn.discordapp.com/emojis/${getEmoji.id + emojiExt}`;
			  	message.guild.emojis
				    .create(emojiURL, getEmoji.name)
            .then((emoji) => message.channel.send(`Add Sucess : ${emoji.name}`));
        }
      }
    },
  }
