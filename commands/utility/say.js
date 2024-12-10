const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('O bot pergunta e repete a mensagem enviada pelo usuário.'),
  execute: async (client, interaction) => {
    // Pergunta inicial ao usuário
    await interaction.reply({
      content: 'Qual mensagem você quer que eu diga? (Você também pode incluir um link de imagem)',
      ephemeral: true, // Mensagem privada
    });

    // Criar um coletor de mensagens para capturar a resposta do usuário
    const filter = (message) => message.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      max: 1, // Apenas uma mensagem será coletada
      time: 30000, // Tempo limite de 30 segundos
    });

    collector.on('collect', async (message) => {
      const content = message.content;
      const imageUrl = message.attachments.first()?.url; // Pega o link da imagem, se houver

      // Envia a mensagem do usuário com ou sem a imagem
      await interaction.channel.send({
        content,
        files: imageUrl ? [imageUrl] : undefined,
      });

      // Confirmação ao usuário
      await interaction.followUp({
        content: 'Mensagem enviada!',
        ephemeral: true,
      });
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        interaction.followUp({
          content: 'Você não enviou nenhuma mensagem a tempo.',
          ephemeral: true,
        });
      }
    });
  },
};
