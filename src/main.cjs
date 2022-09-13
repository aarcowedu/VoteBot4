const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { config } = require("dotenv");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const Database = require("better-sqlite3");
config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.db = new Database("data.sqlite");
client.db
  .prepare(
    "CREATE TABLE IF NOT EXISTS top_menus (message_id TEXT NOT NULL, channel_id TEXT NOT NULL, guild_id TEXT NOT NULL, role_id TEXT NOT NULL, mode INTEGER NOT NULL DEFAULT 0)"
  )
  .run();
client.db
  .prepare(
    "CREATE TABLE IF NOT EXISTS vote_menus (top_menu_id INTEGER NOT NULL, message_id TEXT NOT NULL, channel_id TEXT NOT NULL, guild_id TEXT NOT NULL, account_id TEXT NOT NULL, FOREIGN KEY (top_menu_id) REFERENCES top_menus (rowid) ON UPDATE CASCADE ON DELETE CASCADE)"
  )
  .run();
client.db
  .prepare(
    "CREATE TABLE IF NOT EXISTS admin_menus (top_menu_id INTEGER NOT NULL, message_id TEXT NOT NULL, channel_id TEXT NOT NULL, guild_id TEXT NOT NULL, FOREIGN KEY (top_menu_id) REFERENCES top_menus (rowid) ON UPDATE CASCADE ON DELETE CASCADE)"
  )
  .run();
client.db
  .prepare(
    "CREATE TABLE IF NOT EXISTS items (top_menu_id INTEGER NOT NULL, name TEXT NOT NULL, FOREIGN KEY (top_menu_id) REFERENCES top_menus (rowid) ON UPDATE CASCADE ON DELETE CASCADE)"
  )
  .run();
client.db
  .prepare(
    "CREATE TABLE IF NOT EXISTS votes (top_menu_id INTEGER NOT NULL, item_id INTEGER NOT NULL, account_id TEXT NOT NULL, FOREIGN KEY (top_menu_id) REFERENCES top_menus (rowid) ON UPDATE CASCADE ON DELETE CASCADE, FOREIGN KEY (item_id) REFERENCES items (rowid) ON UPDATE CASCADE ON DELETE CASCADE)"
  )
  .run();

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
