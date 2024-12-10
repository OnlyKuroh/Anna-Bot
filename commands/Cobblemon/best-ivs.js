const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('best-ivs')
        .setDescription('Exibe os melhores IVs para um Pokémon')
        .addStringOption(option =>
            option.setName('pokemon')
                .setDescription('Nome do Pokémon')
                .setRequired(true)),
    async execute(client, interaction) {
        const pokemonName = interaction.options.getString('pokemon');
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            // Calcular melhores IVs
            const stats = data.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat,
            }));
            const bestStats = stats.sort((a, b) => b.value - a.value).slice(0, 3);

            // Criar embed com os melhores IVs
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle(`Melhores IVs para ${data.name.toUpperCase()}`)
                .setThumbnail(data.sprites.front_default)
                .addFields(
                    { name: 'Melhores Stats', value: bestStats.map(stat => `${stat.name}: ${stat.value}`).join('\n') },
                )
                .setFooter({ text: 'Baseado nos stats base do Pokémon.' });

            // Enviar o embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui encontrar esse Pokémon. Por favor, tente novamente.', ephemeral: true });
        }
    },
};
