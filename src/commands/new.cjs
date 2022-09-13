const { SlashCommandBuilder, SlashCommandRoleOption } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("new")
    .setDescription("Creates a new menu!")
    .addRoleOption(
      new SlashCommandRoleOption()
        .setName("adminrole")
        .setDescription("Declare the admin role for this menu!")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply({ content: "yeet" });
    const message = await interaction.fetchReply();
    await interaction.client.db
      .prepare(
        `INSERT INTO top_menus (message_id, channel_id, guild_id, role_id) VALUES ('${
          message.id
        }', '${message.channelId}', '${message.guildId}', '${
          interaction.options.getRole("adminrole").id
        }')`
      )
      .run();
  },
};
