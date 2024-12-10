const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { searchPokemon, getPokeGeneration, getPokemonSet } = require('../../data/smogon')

const RAID_CHANNEL_ID = '1313761421007523900';

const Discord = require("discord.js")
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = async (client, message) => {
    if (message.channel.id !== RAID_CHANNEL_ID) return;
    if (message.author.bot) return;

    const inputName = message.content.toLowerCase().trim().replace(/\s+/g, '-');
    const allPokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=10000`;

    try {
        const bestMatch = await searchPokemon(inputName);
        if (!bestMatch) return message.reply('Coloca um nome certo porra!')
        const generations = await getPokeGeneration(bestMatch.name);
        if (!generations) return message.reply('Coloca um nome certo porra!')

        // Gerar botões dinamicamente com base nas gerações (divididos em linhas)
        const rows = [];
        let currentRow = new ActionRowBuilder();

        generations.forEach((gen, index) => {
            // Adiciona botão ao `currentRow`
            currentRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`gen${gen.gen}@${bestMatch.name}`) // Custom ID único para cada geração
                    .setLabel(`${gen.name} (gen${gen.gen})`) // Nome da geração (ex.: "RB", "GS")
                    .setStyle(ButtonStyle.Secondary)
            );

            // Se o `currentRow` atinge o limite de 5 botões, adiciona-o à lista e cria um novo
            if ((index + 1) % 5 === 0 || index === generations.length - 1) {
                rows.push(currentRow);
                currentRow = new ActionRowBuilder(); // Reinicia a linha
            }
        });

        // Enviar a mensagem com os botões
        await message.channel.send({
            content: `Escolha a geração para ver os movesets de **${bestMatch.name}**:`,
            components: rows,
        });


    } catch (error) {
        console.error(error);
        //message.reply('Ocorreu um erro ao buscar os dados do Pokémon. Tente novamente mais tarde.');
    }
};
