const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('raid-pokemon')
        .setDescription('Ativa a funcionalidade para obter informações de Pokémon no canal fixo.')
        .addStringOption(option =>
            option.setName('pokemon')
                .setDescription('Nome do Pokémon')
                .setRequired(true)),
    async execute(interaction) {
        const inputName = interaction.options.getString('pokemon').toLowerCase();
        const allPokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=10000`;

        try {
            // Buscar todos os nomes de Pokémon
            const allPokemonResponse = await axios.get(allPokemonUrl);
            const allPokemonNames = allPokemonResponse.data.results.map(p => p.name);

            // Encontrar o nome mais próximo
            const bestMatch = stringSimilarity.findBestMatch(inputName, allPokemonNames);
            const correctedName = bestMatch.bestMatch.target;

            if (bestMatch.bestMatch.rating < 0.3) {
                return interaction.reply({ content: `Não consegui encontrar um Pokémon com o nome "${inputName}". Tente novamente.`, ephemeral: true });
            }

            const apiUrl = `https://pokeapi.co/api/v2/pokemon/${correctedName}`;
            const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${correctedName}`;
            const typeUrl = `https://pokeapi.co/api/v2/type`;

            // Obter informações do Pokémon
            const [pokemonResponse, speciesResponse, typeResponse] = await Promise.all([
                axios.get(apiUrl),
                axios.get(speciesUrl),
                axios.get(typeUrl),
            ]);

            const pokemonData = pokemonResponse.data;
            const speciesData = speciesResponse.data;
            const typeData = typeResponse.data;

            // **Tipo e Habilidades**
            const types = pokemonData.types.map(type => type.type.name).join(', ');
            const abilities = pokemonData.abilities
                .map(ability => `${ability.ability.name}${ability.is_hidden ? ' (HA)' : ''}`)
                .join(', ');

            // **Fraquezas e Resistências**
            const typeEffectiveness = {};
            typeData.results.forEach(t => {
                typeEffectiveness[t.name] = 1;
            });

            for (const type of pokemonData.types) {
                const typeDetails = await axios.get(type.type.url);
                const damageRelations = typeDetails.data.damage_relations;

                damageRelations.double_damage_from.forEach(t => (typeEffectiveness[t.name] *= 2));
                damageRelations.half_damage_from.forEach(t => (typeEffectiveness[t.name] /= 2));
                damageRelations.no_damage_from.forEach(t => (typeEffectiveness[t.name] = 0));
            }

            const weaknesses = Object.entries(typeEffectiveness)
                .filter(([_, value]) => value > 1)
                .map(([key]) => key)
                .join(', ');

            const resistances = Object.entries(typeEffectiveness)
                .filter(([_, value]) => value < 1 && value > 0)
                .map(([key]) => key)
                .join(', ');

            // **Ataques Aprendidos**
            const level100Moves = pokemonData.moves
                .filter(move => move.version_group_details.some(detail => detail.level_learned_at === 100))
                .map(move => move.move.name)
                .join(', ') || 'Nenhum';

            // **Stats como Level 100**
            const level100Stats = pokemonData.stats
                .map(stat => `${stat.stat.name}: ${Math.floor(((2 * stat.base_stat + 252 / 4) * 100) / 100 + 5)}`)
                .join('\n');

            // Criar o embed
            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle(`${pokemonData.name.toUpperCase()} (#${speciesData.pokedex_numbers[0]?.entry_number || '???'})`)
                .setThumbnail(pokemonData.sprites.other['official-artwork'].front_default)
                .addFields(
                    { name: 'Tipo', value: types, inline: true },
                    { name: 'Habilidades', value: abilities, inline: true },
                    { name: 'Fraquezas', value: weaknesses || 'Nenhuma', inline: false },
                    { name: 'Resistências', value: resistances || 'Nenhuma', inline: false },
                    { name: 'Principais Ataques', value: level100Moves, inline: false },
                    { name: 'Stats (Level 100)', value: `\`\`\`${level100Stats}\`\`\``, inline: false },
                )
                .setFooter({ text: 'Dados fornecidos pela PokéAPI' });

            // Responder na interação
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Ocorreu um erro ao buscar os dados do Pokémon. Tente novamente mais tarde.', ephemeral: true });
        }
    },
}