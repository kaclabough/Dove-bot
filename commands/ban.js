module.exports = {
  // Best practice for the built-in help menu
  category: "Moderation",
  description: "Bans a member",

  // For the correct usage of the command
  expectedArgs: "<target> [reason]",
  minArgs: 1,

  // Who can use this command
  // If you provide an incorrect string then WOKCommands will throw an error
  // This way you don't have to worry about about typos
  permissions: ["ADMINISTRATOR"],

  // A ban command should not be used in DMs
  guildOnly: true,

  // Invoked when the command is actually ran
  callback: ({ message, args }) => {
    const target = message.mentions.members.first();

    if (!target) {
      message.reply({
        content: "Please tag someone to ban!",
      });
      return;
    }

    if (!target.bannable) {
      message.reply({
        content: "This bot does not have the ability to ban that user!",
      });
      return;
    }

    // Get the reason of the ban
    // First remove the @ from the args array
    args.shift();
    const reason = args.join(" ");

    target.ban({
      reason,
      // How many days of messages to delete
      // Must be between 0-7
      days: 5,
    });

    message.reply({
      content: `Banned ${target}!`,
    });
  },
};
