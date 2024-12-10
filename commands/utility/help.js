const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mostra a lista de comandos e categorias do bot.'),

  execute: async (client, interaction) => {
    try {
      // Caminhos das imagens para cada categoria
      const comandosImagePath = path.join(__dirname, '../../data/comandos.png'); // Banner inicial

      const comandosImage = new AttachmentBuilder(comandosImagePath);

      // Obter o ícone do servidor ou um fallback caso não exista
      const guildIcon = interaction.guild?.iconURL() || 'https://via.placeholder.com/150';

      // Embed inicial de apresentação
      const helpEmbed = new EmbedBuilder()
        .setColor(0x00AEFF) // Azul
        .setTitle('Anna - Seu Bot Completo! 💫')
        .setDescription(
          'Bem-vindo ao **Anna Community**! Aqui está uma lista das categorias de comandos disponíveis. Use o menu abaixo para navegar entre as opções.'
        )
        .addFields(
          { name: '📂 Categorias de Comando:', value: '• 🎮 **Cobblemon**\n• ⚙️ **Utilidade**\n• 🛠️ **Administração**' },
          { name: '📜 Como usar:', value: 'Selecione uma categoria no menu abaixo para ver os comandos correspondentes.' }
        )
        .setImage('attachment://comandos.png')
        .setFooter({ text: 'Anna Community - Sempre pronta para ajudar!', iconURL: guildIcon })
        .setTimestamp();

      // Menu de seleção
      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('Selecione uma categoria')
          .addOptions(
            {
              label: 'Cobblemon',
              description: 'Comandos para interações no Cobblemon.',
              value: 'cobblemon',
              emoji: '🎮',
            },
            {
              label: 'Utilidade',
              description: 'Comandos úteis para o dia a dia.',
              value: 'utility',
              emoji: '⚙️',
            },
            {
              label: 'Administração',
              description: 'Comandos para gerenciar o servidor.',
              value: 'admin',
              emoji: '🛠️',
            },
            {
              label: 'Hentai',
              description: 'Comandos para divertimento +18 no servidor.',
              value: 'hentai',
              emoji: '🔞',
            }
          )
      );

      // Enviar a mensagem inicial com o embed e o menu
      await interaction.reply({ embeds: [helpEmbed], components: [menu], files: [comandosImage] });
    } catch (error) {
      console.error('Erro ao executar o comando help:', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao executar o comando. Por favor, tente novamente mais tarde.',
        ephemeral: true,
      });
    }
  },
};
