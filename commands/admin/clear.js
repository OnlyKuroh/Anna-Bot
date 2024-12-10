const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Limpa mensagens de um canal.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) // Permissão para gerenciar mensagens
    .addIntegerOption(option =>
      option
        .setName('quantidade')
        .setDescription('Número de mensagens a serem apagadas (entre 1 e 100)')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    const quantidade = interaction.options.getInteger('quantidade');

    // Validação de quantidade
    if (quantidade < 1 || quantidade > 100) {
      return interaction.reply({
        content: '❌ O número de mensagens deve estar entre 1 e 100.',
        ephemeral: true,
      });
    }

    // Limpar mensagens no canal
    const channel = interaction.channel;
    try {
      const deletedMessages = await channel.bulkDelete(quantidade, true);

      // Criar embed de confirmação
      const embed = new EmbedBuilder()
        .setColor(0x00FF00) // Verde para sucesso
        .setTitle('🧹 Limpeza concluída!')
        .setDescription(`Foram limpas **${deletedMessages.size}** mensagens por ${interaction.user}.`)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 512 })) // Exibe o avatar em destaque
        .setFooter({ text: 'Comando executado com sucesso' })
        .setTimestamp();

      // Enviar mensagem de confirmação
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Erro ao limpar mensagens:', error);

      // Mensagem de erro
      await interaction.reply({
        content: '❌ Ocorreu um erro ao tentar limpar as mensagens. Verifique minhas permissões.',
        ephemeral: true,
      });
    }
  },
};
