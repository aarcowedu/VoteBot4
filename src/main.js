const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { config } = require("dotenv");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const Database = require("better-sqlite3");
config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.db = new Database("data.sqlite");
// TODO initiate tables

client.commands = new Collection();

const commandsPath = join(__dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) => {
  return file.endsWith(".js");
});
for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter((file) =>
  file.endsWith(".js")
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord with your client's token
client.login(process.env.TOKEN);
