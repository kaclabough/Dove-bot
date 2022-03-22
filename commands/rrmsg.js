const messageSchema = require("../models/message");
const { addToCache } = require("../features/reaction-roles");
const { add } = require("winston");

module.exports = {
  minArgs: 1,
  category: "reaction-roles",
  description:
    "Assign roles based on reaction emojis to the designated message",
  expectedArgs: "[Channel tag] <message text>",
  requirePermissions: ["ADMINISTRATOR"],
  callback: async ({ message, args }) => {
    const { guild, mentions } = message;
    const { channels } = mentions;
    const targetChannel = channels.first() || message.channel;

    if (channels.first()) {
      args.shift();
    }

    const text = args.join(" ");

    const newMessage = await targetChannel.send(text);

    if (guild.me.permissions.has("MANAGE_MESSAGES")) {
      message.delete();
    }

    if (!guild.me.permissions.has("MANAGE_ROLES")) {
      message.reply(
        "The bot requires access to manage roles to be able to give or remove roles"
      );
      return;
    }

    addToCache(guild.id, newMessage);

    new messageSchema({
      guildId: guild.id,
      channelId: targetChannel.id,
      messageId: newMessage.id,
    })
      .save()
      .catch(() => {
        message.reply("Failed to save to the database").then((message) => {
          message.delete({
            timeout: 1000 * 60,
          });
        });
      });
  },
};
