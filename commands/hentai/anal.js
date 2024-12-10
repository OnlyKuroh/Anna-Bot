const { SlashCommandBuilder } = require('discord.js');
const HMtai = require('hmtai');
const hmtai = new HMtai();
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anal')
    .setDescription('Eu envio algo uma imagem anal especial para você 😈'),
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
         '🔥 "Ah, eu sei que você gosta de algo... intenso. Aqui está um presente que você não esquecerá tão cedo~"',
         '😈 "Prepare-se para um toque do meu lado mais atrevido. Aproveite cada detalhe!"',
         '💋 "Você pediu, e a Anna entrega... com todo o charme e um toque de **luxúria**."',
         '🌟 "Algumas coisas são tão picantes que só podem ser compartilhadas com almas como a sua~"',
         '💖 "Meu presente especial para você. Não diga que eu não avisei sobre o quão sedutor seria..."',
       ];

      // Escolher uma mensagem aleatória
      const mensagemAleatoria =
        mensagensMeru[Math.floor(Math.random() * mensagensMeru.length)];

      // Criar o embed
      const embed = new EmbedBuilder()
        .setColor(0xFF69B4) // Rosa
        .setTitle('💖 Um presente da Anna!')
        .setDescription(mensagemAleatoria)
        .setImage(await hmtai.nsfw.anal()) // Define a imagem
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
