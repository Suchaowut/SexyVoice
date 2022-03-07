const Discord = require('discord.js');

module.exports = {
    commands: ['meet','mc','m'],
    callback: async(message, args, client) => {
      if (!args.length) return message.channel.send('!meet <code>');
      const code = args[0]
      if(!args[0]) return message.channel.send('ไม่พบโค้ด')
      message.channel.send(`https://meet.google.com/${code}`)
    },
  }
