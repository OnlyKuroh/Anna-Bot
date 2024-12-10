const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async (client, member) => {
   try {
       // ID do canal onde a mensagem de boas-vindas será enviada
       const welcomeChannelId = '1313476500485570641';

       // Obtém o canal do servidor pelo ID
       const channel = member.guild.channels.cache.get(welcomeChannelId);

       // Verifica se o canal existe
       if (!channel) {
           console.error(`😈 O canal com ID ${welcomeChannelId} não foi encontrado no servidor ${member.guild.name}`);
           return;
       }

       // Carrega a imagem local de "Bem-vindo"
       const welcomeImagePath = path.join(__dirname, '../data/BEM-VINDO.png');
       const welcomeImage = new AttachmentBuilder(welcomeImagePath);

       // Cria a mensagem de boas-vindas
       const welcomeEmbed = new EmbedBuilder()
           .setTitle('🌙 Bem-vindo(a) à Anna Community!')
           .setDescription(
               `Olá, ${member.user}! 😈\n\nA **Anna Community** é um lugar onde magia, sedução e diversão se encontram. ` +
               `Sinta-se à vontade para explorar os canais e interagir com nossa comunidade! Lembre-se, você agora faz parte do nosso domínio.` +
               `\n\n**Deixe sua marca, mas cuidado para não se apaixonar demais!** ❤️‍🔥`
           )
           .setColor(0x8B0000) // Vermelho escuro
           .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
           .setImage('attachment://BEM-VINDO.png') // Referencia a imagem anexada
           .setFooter({ text: 'A sedução é apenas o começo... 💋', iconURL: member.guild.iconURL() });

       // Envia a mensagem de boas-vindas no canal com a imagem anexada
       await channel.send({ embeds: [welcomeEmbed], files: [welcomeImage] });

       console.log(`😈 Mensagem de boas-vindas enviada para ${member.user.tag} no servidor ${member.guild.name}`);
   } catch (error) {
       console.error('😈 Erro no evento guildMemberAdd:', error);
   }
};
