const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Fuse = require('fuse.js');
const generationData = require('./gen.json');

const fuseOptions = {
    threshold: 0.4, // Define a similaridade mínima (quanto menor, mais precisa)
    keys: ['name'], // Procurar no campo "name"
    includeScore: true // Incluir o score no resultado
};

const RAID_CHANNEL_ID = '1313761421007523900';

function romanToArabic(roman) {
    const romanMap = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0;

    for (let i = 0; i < roman.length; i++) {
        const current = romanMap[roman[i]];
        const next = romanMap[roman[i + 1]];

        if (next > current) {
            result += next - current; // Subtração para casos como IV, IX
            i++; // Pula o próximo caractere
        } else {
            result += current; // Soma normal
        }
    }

    return result;
}

async function getPokeGeneration(pokemonName) {
    try {

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar os dados do Pokemon: ${response.statusText}`);
        }
        const data = await response.json();

        if(!data?.generation) throw new Error(`Erro ao buscar os dados do Pokemon: ${response.statusText}`);
        
        // Determina a geração inicial
        const introductionGeneration = data.generation.name; // ex.: "generation-iv"
        const roman = introductionGeneration.replace('generation-', '').toUpperCase(); // "iv" -> "IV"
        
        // Converte o número romano para arábico
        const generationNumber = romanToArabic(roman);
        
        // Gera a lista de gerações subsequentes
        const generations = [];
        for (let i = generationNumber; i <= 9; i++) { // 9 é a geração atual
            const genData = generationData.find(gen => gen.gen === i);
            generations.push(genData);
        }
        
        return generations;
    } catch (error) {
        return null;
    }
}

async function searchPokemon(name) {
    try {

        const allPokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=10000`;
        
        // Obter todos os nomes de Pokémon
        const allPokemonResponse = await axios.get(allPokemonUrl);
        const allPokemon = allPokemonResponse.data.results; // Obtemos o nome e URL de cada Pokémon
        
        // Inicializar o Fuse.js com os dados de Pokémon
        const fuse = new Fuse(allPokemon, fuseOptions);
        
        // Buscar o Pokémon com base na entrada
        const results = fuse.search(name);
        
        if (results.length === 0 || results[0].score > 0.4) {
            throw new Error(`Não consegui encontrar um Pokémon com o nome "${name}". Tente novamente.`)
        }
        
        // Nome corrigido mais próximo
        const bestMatch = results[0].item;
        return bestMatch
    } catch (error) {
        return null;
    }
}

// Normalização do Nome
function normalizeName(name) {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

async function getPokemonSet(pokemonName, generation) {
    try {
        const url = `https://pkmn.github.io/smogon/data/sets/${generation}`;
        const response = await axios.get(url);

        const data = response.data;

        // Normalizar os nomes dos Pokémon no dataset
        const normalizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [normalizeName(key), value])
        );

        if (!normalizedData[pokemonName]) {
            return `Não há movesets disponíveis para ${pokemonName} na geração ${generation}.`;
        }

        const movesets = normalizedData[pokemonName];

        return movesets

    } catch (error) {
        console.error(`Erro ao buscar movesets para ${pokemonName} na geração ${generation}:`, error.message);
        return `Não foi possível buscar os movesets de ${pokemonName} na geração ${generation}.`;
    }
}

async function getPokemonAnalyses(pokemonName, generation) {
    try {
        const url = `https://pkmn.github.io/smogon/data/analyses/${generation}`;
        const response = await axios.get(url);
        const data = response.data;

        // Normalizar os nomes dos Pokémon no dataset
        const normalizedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [normalizeName(key), value])
        );

        // Buscar as análises para o Pokémon
        const pokemonData = normalizedData[pokemonName.toLowerCase()];
        if (!pokemonData) {
            return null
        }

        // Processar as análises por formato
        const analyses = Object.entries(pokemonData).map(([format, formatData]) => {
            const sets = Object.entries(formatData.sets).map(([setName, setDetails]) => ({
                name: setName,
                description: setDetails.description
                    ? setDetails.description.replace(/<\/?[^>]+(>|$)/g, '') // Remove tags HTML
                    : 'Nenhuma descrição disponível.',
            }));

            const credits = formatData.credits?.teams?.map(team => ({
                name: team.name,
                members: team.members.map(member => ({
                    id: member.user_id,
                    username: member.username,
                })),
            })) || [];

            const writtenBy = formatData.credits?.writtenBy?.map(writer => ({
                id: writer.user_id,
                username: writer.username,
            })) || [];

            return {
                format,
                outdated: !!formatData.outdated,
                sets,
                credits,
                writtenBy,
            };
        });

        return { pokemon: pokemonName, generation, analyses };
    } catch (error) {
        console.error(error);
        return { error: `Erro ao buscar análises para **${pokemonName}** na geração **${generation}**.` };
    }
}

module.exports = {
    searchPokemon,
    getPokeGeneration,
    getPokemonSet,
    getPokemonAnalyses
}