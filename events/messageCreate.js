const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Fuse = require('fuse.js');
const RAID_CHANNEL_ID = '1313727080424542248';

const fuseOptions = {
    threshold: 0.4,
    keys: ['name'],
    includeScore: true
};

const typeEmojis = {
    normal: '<:Normal:1314967318543204404>',
    fire: '<:Fire:1314967284384534580>',
    water: '<:Water:1314967305633140768>',
    electric: '<:Electric:1314967292836057159>',
    grass: '<:Grass:1314967275081564160>',
    ice: '<:Ice:1314967269926764614>',
    fighting: '<:Fighting:1314967286880276590>',
    poison: '<:Poison:1314967315992936539>',
    ground: '<:Ground:1314967272787411084>',
    flying: '<:Flying:1314967280337158185>',
    psychic: '<:Psychic:1314967313572954192>',
    bug: '<:Bug:1314967301099094086>',
    rock: '<:Rock:1314967310846656563>',
    ghost: '<:Ghost:1314967277233373184>',
    dragon: '<:Dragon:1314967295285657651>',
    dark: '<:Dark:1314967298435711009>',
    steel: '<:Steel:1314967308514627584>',
    fairy: '<:Fairy:1314967289753501786>',
};

module.exports = async (client, message) => {
    if (message.channel.id !== RAID_CHANNEL_ID) return;
    if (message.author.bot) return;

    const inputName = message.content.toLowerCase().trim().replace(/\s+/g, '-');
    const allPokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=10000`;

    try {
        const allPokemonResponse = await axios.get(allPokemonUrl);
        const allPokemonNames = allPokemonResponse.data.results.map(p => p.name);
        const fuse = new Fuse(allPokemonNames, fuseOptions);
        const results = fuse.search(inputName);

        if (results.length === 0 || results[0].score > 0.4) {
            return { error: `Não consegui encontrar um Pokémon com o nome "${inputName}". Tente novamente.` };
        }

        const correctedName = results[0].item;

        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${correctedName}`;
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${correctedName}`;
        const typeUrl = `https://pokeapi.co/api/v2/type`;

        const [pokemonResponse, speciesResponse, typeResponse] = await Promise.all([
            axios.get(apiUrl),
            axios.get(speciesUrl).catch(() => null), // Permitir falha sem quebrar o código
            axios.get(typeUrl),
        ]);

        const pokemonData = pokemonResponse.data;
        const speciesData = speciesResponse ? speciesResponse.data : null;
        const typeData = typeResponse.data;

        const types = pokemonData.types
            .map(type => `${typeEmojis[type.type.name] || ''}`)
            .join(' ');
        const abilities = pokemonData.abilities
            .map(ability => `${ability.ability.name}${ability.is_hidden ? ' (HA)' : ''}`)
            .join(', ');

        // Egg Groups
        const eggGroups = speciesData?.egg_groups
            ? speciesData.egg_groups.map(group => group.name).join(', ')
            : 'Desconhecido';

        // Gender Rate
        const genderRate = speciesData?.gender_rate;
        let genderInfo = 'Sem gênero';
        if (genderRate !== undefined && genderRate >= 0) {
            const femalePercentage = (genderRate / 8) * 100;
            const malePercentage = 100 - femalePercentage;
            genderInfo = `Macho: ${malePercentage.toFixed(1)}% | Fêmea: ${femalePercentage.toFixed(1)}%`;
        }

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
            .map(([key]) => `${typeEmojis[key] || ''}`)
            .join(' ');

        const resistances = Object.entries(typeEffectiveness)
            .filter(([_, value]) => value < 1 && value > 0)
            .map(([key]) => `${typeEmojis[key] || ''}`)
            .join(' ');

        const level100Moves = pokemonData.moves
            .filter(move => move.version_group_details.some(detail => detail.level_learned_at === 100))
            .map(move => move.move.name)
            .join(', ') || 'Nenhum';

        const level100Stats = pokemonData.stats
            .map(stat => `${stat.stat.name}: ${Math.floor(((2 * stat.base_stat + 252 / 4) * 100) / 100 + 5)}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle(`${pokemonData.name.toUpperCase()} (#${speciesData ? speciesData.pokedex_numbers[0]?.entry_number : '???'})`)
            .setThumbnail(pokemonData.sprites.other['official-artwork'].front_default)
            .addFields(
                { name: 'Tipo', value: types || 'Nenhum', inline: true },
                { name: 'Habilidades', value: abilities || 'Nenhuma', inline: true },
                { name: 'Fraquezas', value: weaknesses || 'Nenhuma', inline: false },
                { name: 'Resistências', value: resistances || 'Nenhuma', inline: false },
                { name: 'Principais Ataques', value: level100Moves, inline: false },
                { name: 'Stats (Level 100)', value: `\`\`\`${level100Stats}\`\`\``, inline: false },
                { name: 'Egg Grupo', value: eggGroups || 'Nenhum', inline: true },
                { name: 'Gênero', value: genderInfo, inline: true },
            )
            .setFooter({ text: 'Dados fornecidos pela PokéAPI' });

        await message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        message.reply('Ocorreu um erro ao buscar os dados do Pokémon. Tente novamente mais tarde.');
    }
};
