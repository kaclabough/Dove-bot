module.exports = (client, instance) => {
  client.on("guildMemberAdd", (member) => {
    const { guild } = member;

    const channel = guild.channels.cache.find(
      (channel) => channel.name === "welcome"
    );

    if (!channel) {
      return;
    }

    channel.send("welcome ${member} to the server!");
  });
};

module.exports.config = {
  displayName: "Welcome Message",
  dbName: "Welcome Message",
};
