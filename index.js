const { Client, Intents } = require("discord.js");
const DiscordJS = require("discord.js");
const WOKCommands = require("wokcommands");
require("dotenv").config();
const path = require("path");
const { Console } = require("console");

// const ReactionRole = require("discordjs-reaction-role").default;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const dbOptions = {
  // These are the default values
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

client.on("ready", () => {
  const wok = new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, "features"),
    testServers: [process.env.Guild_ID],
    dbOptions,
    mongoUri: process.env.MONGO_URI,
    botOwners: [process.env.OWNER_ID],
    testServers: [process.env.GUILD_ID],
  });

  wok.on("databaseConnected", async (connection, state) => {
    const model = connection.models["wokcommands-languages"];

    const results = await model.countDocuments();
    console.log(results);
  });
});

client.login(process.env.TOKEN);
