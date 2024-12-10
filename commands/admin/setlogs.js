const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlogs')
    .setDescription('Define o canal de logs.')
    .addChannelOption(option =>
      option.setName('canal')
        .setDescription('Canal para enviar os logs.')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(client, interaction) {
    const canal = interaction.options.getChannel('canal');

    if (!canal.isTextBased()) {
      return interaction.reply({
        content: 'Por favor, selecione um canal de texto.',
        ephemeral: true,
      });
    }

    // Salvar o ID do canal no arquivo de configuração
    const configPath = path.join(__dirname, '../../data/logsConfig.json');
    const config = fs.existsSync(configPath) ? require(configPath) : {};

    config[interaction.guild.id] = { logChannel: canal.id };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    await interaction.reply({
      content: `Canal de logs definido para ${canal}.`,
      ephemeral: true,
    });
  },
};
