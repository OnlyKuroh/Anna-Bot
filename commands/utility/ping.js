const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Cria um embed com as informações fornecidas.'),
  execute: async (client, interaction) => {
    const message = await interaction.deferReply({
      fetchReply: true,
    });

    const newMessage = `Client Ping: ${message.createdTimestamp - interaction.createdTimestamp}`

    await interaction.editReply({ content: newMessage, ephemeral: true });
  },
};