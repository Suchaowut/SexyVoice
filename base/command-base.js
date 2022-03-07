const { prefix } = require('../config.json')
const Discord = require('discord.js');
const validPermissions = require('../base/permissions.js')

const validatePermissions = (permissions) => {
  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`ไม่รู้จักสิทธิ์ "${permission}"`)
    }
  }
}

let recentlyRan = [] // guildId-userId-command

module.exports = (client, commandOptions) => {
  let {
    commands,
    expectedArgs = '',
    //permissionError = 'You do not have permission to run this command.',
    minArgs = 0,
    maxArgs = null,
    cooldown = -1,
    requiredChannel = '',
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions

  // check command and aliases are in an array
  if (typeof commands === 'string') {
    commands = [commands]
  }

  console.log(`${commands[0]} ✔`)

  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  // Watch for messages
  client.on('message', (message) => {
    const { member, content, guild, channel } = message

    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`

      if (
        content.toLowerCase().startsWith(`${command} `) ||
        content.toLowerCase() === command
      ) {
        // When Command Use

        // Channel
        if (requiredChannel && requiredChannel !== channel.id) {
          const foundChannel = guild.channels.cache.find((channel) => {
            return channel.id === requiredChannel
          })
          message.reply(
          new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setDescription(`เกิดข้อผิดพลาด (CH)`)
          ).then(msg => { msg.delete({ timeout: 5000 }); });
          return
        }

        // Permission
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(
            new Discord.MessageEmbed()
              .setColor('#FF0000')
              .setDescription(`เกิดข้อผิดพลาด (PM)`)
            ).then(msg => { msg.delete({ timeout: 5000 }); });
            return
          }
        }

        // Role
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.id === requiredRole
          )

          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
            new Discord.MessageEmbed()
              .setColor('#FF0000')
              .setDescription(`เกิดข้อผิดพลาด (RO)`)
            ).then(msg => { msg.delete({ timeout: 5000 }); });
            return
          }
        }

        // Cooldown
        let cooldownString = `${guild.id} - ${member.id} - ${commands[0]}`

        if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
          message.reply(
            new Discord.MessageEmbed()
              .setColor('#FF0000')
              .setDescription(`เกิดข้อผิดพลาด (CD)`)
            ).then(msg => { msg.delete({ timeout: 5000 }); });
          return
        }

        // Split on any number of spaces
        const arguments = content.split(/[ ]+/)

        // Remove the command which is the first index
        arguments.shift()

        // Ensure we have the correct number of arguments
        if (
          arguments.length < minArgs ||
          (maxArgs !== null && arguments.length > maxArgs)
        ) {
          message.reply(
            `วิธีใช้ : ${prefix}${alias} ${expectedArgs}`
          )
          return
        }

        if (cooldown > 0) {
          recentlyRan.push(cooldownString)

          setTimeout(() => {

            recentlyRan = recentlyRan.filter((string) => {
              return string !== cooldownString
            })
          }, 100000 * cooldown)
        }

        callback(message, arguments, arguments.join(' '), client)

        return
      }
    }
  })
}
