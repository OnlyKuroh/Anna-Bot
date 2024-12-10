const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pong')
    .setDescription('Um pong só que só com permissão.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (client, interaction) => {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const newMessage = `Client Ping: ${message.createdTimestamp - interaction.createdTimestamp}`

    await interaction.editReply({ content: newMessage, ephemeral: true });
  },
};