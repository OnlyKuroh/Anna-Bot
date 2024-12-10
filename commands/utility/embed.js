const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Cria um embed com as informações fornecidas.'),
  execute: async (client, interaction) => {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Comando de Embed Personalizada')
            .setDescription(
                'Envie uma mensagem com o texto para a embed e depois um link da imagem ou GIF.'
            )
            .setImage('https://media.giphy.com/media/Ju7l5y9osyymQ/giphy.gif') // Banner de exemplo
            .setFooter({ text: 'Envie o texto primeiro e, em seguida, o link da imagem/GIF.' });

        // Responde com o embed explicativo
        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });

        // Coleta as próximas duas mensagens do autor do comando
        const filter = (msg) => msg.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, max: 2, time: 60000 });

        const userMessages = [];

        collector.on('collect', (message) => {
            userMessages.push(message.content);
            if (userMessages.length === 2) collector.stop(); // Para após duas mensagens
        });

        collector.on('end', async (collected, reason) => {
            if (reason !== 'user') return;

            const [embedText, embedImage] = userMessages;

            if (!embedText || !embedImage) {
                return interaction.followUp({
                    content: 'Você não forneceu as duas mensagens necessárias (texto e imagem/GIF).',
                    ephemeral: true,
                });
            }

            // Cria a embed com as mensagens fornecidas
            const userEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(embedText)
                .setImage(embedImage);

            // Envia a embed para o canal
            await interaction.channel.send({ embeds: [userEmbed] });
        });
    },
};
