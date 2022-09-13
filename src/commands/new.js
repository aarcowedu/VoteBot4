const { SlashCommandBuilder, SlashCommandRoleOption } = require('discord.js')


module.exports = {
  data: new SlashCommandBuilder()
    .setName('new')
    .setDescription('Creates a new menu!')
    .addRoleOption(
      new SlashCommandRoleOption()
        .setName('adminrole')
        .setDescription('Declare the admin role for this menu!')
        .setRequired(true)
    ),
  async execute (interaction) {
    
  }
}
