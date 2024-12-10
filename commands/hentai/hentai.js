const { SlashCommandBuilder } = require('discord.js');
const HMtai = require('hmtai');
const hmtai = new HMtai();
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hentai')
    .setDescription('Eu envio um imagem Hentai especial para você 😈'),
  execute: async (client, interaction) => {
    try {
      // Verificar se o canal é NSFW
      if (!interaction.channel.nsfw) {
        return interaction.reply({
          content: '❌ Este comando só pode ser usado em canais NSFW! 😈',
          ephemeral: true,
        });
      }

      // Mensagens temáticas aleatórias da Meru
      const mensagensMeru = [
        '😈 "Você tem algum desejo? Deixe a Anna realizá-lo para você~"',
        '💋 "Cuidado! Minhas imagens podem ser **altamente sedutoras**... não diga que não avisei!"',
        '🌟 "Eu sei exatamente o que você gosta~ Vamos nos divertir juntos!"',
        '🔥 "Atenção, alma pecadora! Prepare-se para algo **picante**."',
        '💖 "Você pediu, e eu entrego... com todo meu charme e elegância."',
      ];

      // Escolher uma mensagem aleatória
      const mensagemAleatoria =
        mensagensMeru[Math.floor(Math.random() * mensagensMeru.length)];

      // Criar o embed
      const embed = new EmbedBuilder()
        .setColor(0xFF69B4) // Rosa
        .setTitle('💖 Um presente da Anna!')
        .setDescription(mensagemAleatoria)
        .setImage(await hmtai.nsfw.nsfwNeko()) // Define a imagem
        .setFooter({
          text: 'Gerado com amor pela Anna 💜',
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      // Enviar a embed
      await interaction.reply({
        embeds: [embed],
        ephemeral: false, // False para que todos possam ver
      });
    } catch (error) {
      console.error('❌ Erro ao executar o comando /hentai:', error);
      await interaction.reply({
        content:
          '❌ Ocorreu um erro ao gerar a embed. Por favor, tente novamente mais tarde.',
        ephemeral: true,
      });
    }
  },
};
