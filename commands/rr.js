const { fetchCache, addToCache } = require("../features/reaction-roles");
const messageSchema = require("../models/message");
const { description } = require("./ban");

module.exports = {
  category: "Reaction-Role",
  description: "Creates messages that users can react to to obtain roles",
  minArgs: 3,
  expectedArgs: "<Emoji> <role name, tag, or ID> <Role display name>",
  requiredPermission: ["ADMINISTRATOR"],
  callback: async ({ message, args }) => {
    const { guild } = message;

    if (!guild.me.permissions.has("MANAGE_ROLES")) {
      message.reply(
        "The bot requires access to manage roles to work correctly"
      );
      return;
    }

    let emoji = args.shift();
    let role = args.shift();
    const displayName = args.join(" ");

    if (role.startsWith("<@&")) {
      role = role.substring(3, role.length - 1);
    }

    const newRole =
      guild.roles.cache.find((r) => {
        return r.name === role || r.id === role;
      }) || null;

    if (!newRole) {
      message.reply(`Could not find a role for "${role}"`);
      return;
    }

    role = newRole;

    if (emoji.includes(":")) {
      const emojiName = emoji.split(":")[1];
      emoji = guild.emoji.cache.find((e) => {
        return e.name === emojiName;
      });
    }

    const [fetchedMessage] = fetchCache(guild.id);
    if (!fetchedMessage) {
      message.reply("An error occured, please try again");
      return;
    }

    const newLine = `${emoji} ${displayName}`;
    let { content } = fetchedMessage;

    if (content.includes(emoji)) {
      const split = content.split("/n");

      for (let a = 0; a < split.length; ++a) {
        if (split[a].include(emoji)) {
          split[a] = newLine;
        }
      }

      content = split.join("\n");
    } else {
      content += `\n${newLine}`;
      fetchedMessage.react(emoji);
    }

    fetchedMessage.edit(content);

    const obj = {
      guildId: guild.id,
      channelId: fetchedMessage.channel.id,
      messageId: fetchedMessage.id,
    };

    await messageSchema.findOneAndUpdate(
      obj,
      {
        ...obj,
        $addToSet: {
          roles: {
            emoji,
            roleId: role.id,
          },
        },
      },
      {
        upsert: true,
      }
    );

    addToCache(guild.id, fetchedMessage, emoji, role.id);
  },
};
