const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async (client) => {
    var servidores = client.guilds.cache.size;
    console.log(`✨ Conectada ao Discord! Pronta para seduzir ${servidores} comunidades.`);

    const commands = [];
    const foldersPath = path.join(__dirname, '../commands');
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                console.log(`🔥 O comando '${command.data.name}' foi aperfeiçoado para encantar!`);
            } else {
                console.log(`⚠️ [Aviso] O comando em ${filePath} precisa de ajustes. Onde está minha magia?`);
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(client.config.TOKEN);

    (async () => {
        try {
            console.log(`💃 Atualizando ${commands.length} comandos (/) para a comunidade.`);
            const data = await rest.put(
                Routes.applicationCommands(client.user.id, '1044631041085816963'),
                { body: commands },
            );
            console.log(`💋 ${data.length} comandos (/) atualizados com sucesso. Vamos seduzir o caos!`);
        } catch (error) {
            console.error(`🔮 Algo deu errado na atualização dos comandos. Foi você que mexeu nos feitiços?`, error);
        }
    })();

    console.log(`🌟 ${client.user.username} está no controle. Vamos brincar, meus doces?`);

    // Atualizar o status com informações picantes sobre a comunidade
    try {
        const updatePresence = () => {
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

            client.user.setActivity({
                details: "💔 Dançando entre os corações",
                state: `Sussurrando segredos para ${servidores} reinos de prazer`,
                name: `Cuidando de ${totalMembers} almas deliciosas`,
                type: 2, // Listening
                url: "https://anna-succubus.com/",
            });
        };

        // Atualizar presença ao iniciar
        updatePresence();

        // Atualizar presença a cada 5 minutos
        setInterval(updatePresence, 5 * 60 * 1000);

        // Atividades rotativas inspiradas na sedução
        setInterval(() => {
            const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const activityIndex = Math.floor(Math.random() * 5);

            if (activityIndex === 0) {
                client.user.setActivity({
                    details: "👁️ Observando seus desejos mais profundos",
                    state: "Trazendo seus segredos à luz",
                    name: `Cativando ${totalMembers} corações pulsantes`,
                    type: 2,
                    url: "https://anna-succubus.com/",
                });
            } else if (activityIndex === 1) {
                client.user.setActivity({
                    details: "🖤 Tocando o âmago de sua alma",
                    state: "Liberando sua imaginação sombria",
                    name: `Inspirando ${totalMembers} adoradores fiéis`,
                    type: 2,
                    url: "https://anna-succubus.com/",
                });
            } else if (activityIndex === 2) {
                client.user.setActivity({
                    details: "🎭 Encenando suas fantasias",
                    state: "Realizando desejos não ditos",
                    name: `Guiando ${totalMembers} corações apaixonados`,
                    type: 2,
                    url: "https://anna-succubus.com/",
                });
            } else if (activityIndex === 3) {
                client.user.setActivity({
                    details: "💋 Sussurrando em seus ouvidos",
                    state: "Mantendo todos sob meu encanto",
                    name: `Encantando ${totalMembers} devotos especiais`,
                    type: 2,
                    url: "https://anna-succubus.com/",
                });
            } else if (activityIndex === 4) {
                client.user.setActivity({
                    details: "✨ Despertando prazeres secretos",
                    state: "Conectando almas em busca de diversão",
                    name: `Espalhando magia para ${totalMembers} servos leais`,
                    type: 2,
                    url: "https://anna-succubus.com/",
                });
            }
        }, client.config.delayPresence);
    } catch (error) {
        console.log(`❌ Algo deu errado com a presença de Anna:`, error);
    }
};
