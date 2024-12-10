const { ActionRowBuilder, SelectMenuBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { getPokemonSet } = require('../../data/smogon');
const axios = require('axios');

async function CreateEmbed(pokemonName, gen, selectedFormat = null) {
    try {
        // Buscar os sets para a geração selecionada
        const movesets = await getPokemonSet(pokemonName, `${gen}.json`);
        if (!movesets || Object.keys(movesets).length === 0) {
            return {
                error: `Não há sets disponíveis para **${pokemonName}** na Geração **${gen.replace('gen', '')}**.`,
            };
        }

        // Buscar os nomes dos formatos
        const formatsResponse = await axios.get('https://pkmn.github.io/smogon/data/formats/index.json');
        const formatsMap = formatsResponse.data;

        // Obter a imagem do Pokémon pela PokéAPI
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonImage = pokemonResponse.data.sprites.other['official-artwork'].front_default;

        // Criar as opções para o SelectMenu
        const selectOptions = Object.keys(movesets).map(format => ({
            label: formatsMap[format] || format.toUpperCase(),
            description: `Movesets para ${formatsMap[format] || format.toUpperCase()}`,
            value: `${format}@${pokemonName}@${gen}`, // CustomId para identificar
        }));

        // Determinar o formato a ser exibido
        const formatToDisplay = selectedFormat || Object.keys(movesets)[0]; // Primeiro formato ou o selecionado
        const formatSets = movesets[formatToDisplay];
        const formatName = formatsMap[formatToDisplay] || formatToDisplay.toUpperCase();

        // Criar os embeds com os movesets do formato selecionado
        const embeds = Object.entries(formatSets).map(([setName, setDetails]) => {
            const moves = setDetails.moves.map(move =>
                Array.isArray(move) ? `- ${move.join(' / ')}` : `- ${move}`
            );

            const evs = setDetails.evs
                ? Object.entries(setDetails.evs)
                    .map(([stat, value]) => `${stat.toUpperCase()}: ${value}`)
                    .join('\n')
                : null;

            const ivs = setDetails.ivs
                ? Object.entries(setDetails.ivs)
                    .map(([stat, value]) => `${stat.toUpperCase()}: ${value}`)
                    .join('\n')
                : null;

            const abilities = Array.isArray(setDetails.ability)
                ? setDetails.ability.join(' / ')
                : setDetails.ability || null;

            const teraTypes = Array.isArray(setDetails.teratypes)
                ? setDetails.teratypes.join(' / ')
                : setDetails.teratypes || null;

            const embed = new EmbedBuilder()
                .setTitle(`${pokemonName.toUpperCase()} - ${setName}`)
                .setFooter({ text: `Smogon - Formato: ${formatName}`, })
                .setDescription(`[Detalhes](https://www.smogon.com/dex/sv/pokemon/${pokemonName}/${formatToDisplay}/)`)
                .setThumbnail(pokemonImage)
                .setColor(0x00ff00);
            if (abilities) embed.addFields({ name: 'Abilities', value: '```yaml\n- ' + abilities + '```', inline: true });
            if (moves) embed.addFields({ name: 'Moves', value: '```yaml\n' + moves.join('\n') + '```', inline: false });
            if (evs) embed.addFields({ name: 'EVs', value: '```yaml\n' + evs + '```', inline: true });
            if (ivs) embed.addFields({ name: 'IVs', value: '```yaml\n' + ivs + '```', inline: true });
            if (teraTypes) embed.addFields({ name: 'Tera Types', value: '```yaml\n' + teraTypes + '```', inline: true });
            return embed;
        });

        // Verificar se há embeds válidos
        if (!embeds.length) {
            return {
                error: `Nenhum moveset encontrado para **${pokemonName}** no formato **${formatName}**.`,
            };
        }

        // Criar o painel do SelectMenu
        const painel = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('moveset_selector')
                .setPlaceholder('Selecione um formato!')
                .addOptions(selectOptions)
        );

        return { embeds, painel };
    } catch (error) {
        return {
            error: `Nenhum moveset encontrado para **${pokemonName}** nessa geração!`,
        };
        console.error(error);
    }
}

module.exports = async (client, interaction) => {
    try {

        if (interaction.isButton()) {
            if (interaction.customId.startsWith("gen")) {
                const [generation, pokemonName] = interaction.customId.split('@');
                const { embeds, painel, error } = await CreateEmbed(pokemonName, generation);
                
                if (error) {
                    return interaction.reply({ content: error, ephemeral: true });
                }
                
                await interaction.update({
                    embeds: embeds,
                    components: [painel],
                });
            }
        }
        
        if (interaction.customId === 'moveset_selector') {
            const [format, pokemonName, gen] = interaction.values[0].split('@');
            const { embeds } = await CreateEmbed(pokemonName, gen, format);
            await interaction.update({ embeds: embeds });
        }
    } catch (error) {
        console.log(error)
    }
}