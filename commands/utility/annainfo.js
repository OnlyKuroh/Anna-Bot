const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

// Caminho para a imagem sobremim.png
const sobremimImagePath = path.join(__dirname, '../../data/sobremim.png');
const sobremimImage = new AttachmentBuilder(sobremimImagePath);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('annainfo')
    .setDescription('Exibe informações sobre o bot Anna.'),
  execute: async (client, interaction) => {
    try {
      // Obter informações gerais do bot
      const totalServers = client.guilds.cache.size;
      const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

      // Criar o embed temático
      const meruEmbed = new EmbedBuilder()
        .setColor(0xFF69B4) // Rosa vibrante, temático para Meru
        .setTitle('💖 Olá, eu sou a Anna!')
        .setDescription(
          'Eu sou a **Anna**, sua fiel Succubus, sempre aqui para trazer diversão, paixão e ajudar a transformar sua comunidade em algo único! 🌟\n\n' +
          `🎀 **Servidores Ativos:** ${totalServers}\n` +
          `✨ **Membros Gerenciados:** ${totalMembers}\n\n` +
          '_Sempre pronta para satisfazer os desejos da sua comunidade com meus comandos mágicos!_\n\n' +
          'Juntos, podemos criar momentos inesquecíveis. Obrigada por me acolher em seu servidor! 💋'
        )
        .setImage('attachment://sobremim.png') // Referência ao banner
        .setFooter({
          text: 'Criada para seduzir e ajudar! 💜',
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      // Enviar o embed com a imagem
      await interaction.reply({
        embeds: [meruEmbed],
        files: [sobremimImage],
        ephemeral: false,
      });
    } catch (error) {
      console.error('❌ Erro ao executar o comando /meruinfo:', error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao exibir as informações sobre a Meru. Por favor, tente novamente mais tarde.',
        ephemeral: true,
      });
    }
  },
};
