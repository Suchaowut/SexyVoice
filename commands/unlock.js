const Discord = require('discord.js');

module.exports = {
    commands: ['unlock'],
    permissions: ["ADMINISTRATOR"],
    callback: async(message, args, text, client) => {
      if(message.deletable) {message.delete();}
      const { guild } = message
      const channelId = args[0]
      if (!channelId) {  message.reply('ลืมใส่ ID ห้องรึเปล่าคะ').then(msg => { msg.delete({ timeout: 5000 }); }); return }
      const channel = guild.channels.cache.get(channelId)
      if (!channel) { message.reply('ไม่พบห้องค่ะ').then(msg => { msg.delete({ timeout: 5000 }); }); return }

      const roleId = '840832663022469182'
      const role = guild.roles.cache.get(roleId)
      if (!role) { message.reply('ไม่พบยศนี้นะคะ').then(msg => { msg.delete({ timeout: 5000 }); }); return }

      message.reply(`🔓ปลดล็อคห้อง <#${channelId}> เรียบร้อยแล้วงับ❤`)
      channel.overwritePermissions([
        {
          id: roleId,
          allow: "CONNECT",
        }
      ])
    },
  }
