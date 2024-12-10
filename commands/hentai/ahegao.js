const { SlashCommandBuilder } = require('discord.js');
const HMtai = require('hmtai');
const hmtai = new HMtai();
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ahegao')
    .setDescription('Eu envio uma imagem Ahegao especial para você 😈'),
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
         '😈 "Ah, rostos como este... são a minha especialidade. Aprecie o presente, alma atrevida~"',
         '🔥 "Você sabe que não pode resistir, não é? Um toque do meu charme só para você!"',
         '💋 "Você está prestes a experimentar algo **intenso**. Vamos lá~"',
         '🌟 "Perdido no meu encanto? Aproveite essa visão e deixe-me cuidar do resto... 😏"',
         '💖 "Com todo o meu charme e um toque de picante, aqui está algo que você não esquecerá tão cedo."',
       ];

      // Escolher uma mensagem aleatória
      const mensagemAleatoria =
        mensagensMeru[Math.floor(Math.random() * mensagensMeru.length)];

      // Criar o embed
      const embed = new EmbedBuilder()
        .setColor(0xFF69B4) // Rosa
        .setTitle('💖 Um presente da Anna!')
        .setDescription(mensagemAleatoria)
        .setImage(await hmtai.nsfw.ahegao()) // Define a imagem
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
      console.error('❌ Erro ao executar o comando /ahegao:', error);
      await interaction.reply({
        content:
          '❌ Ocorreu um erro ao gerar a embed. Por favor, tente novamente mais tarde.',
        ephemeral: true,
      });
    }
  },
};
