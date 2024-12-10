const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const path = require('node:path');
const fs = require('fs');
const chalk = require('chalk');

const client = new Client({
    partials: [
        Partials.User, // for discord user
        Partials.Reaction, // for message reaction
        Partials.Message, // for message
        Partials.Channel, // for text channel
        Partials.GuildMember, // for guild member
    ],
    intents: [
        GatewayIntentBits.Guilds, // for guild related things
        GatewayIntentBits.GuildMembers, // for guild members related things
        GatewayIntentBits.GuildIntegrations, // for discord Integrations
        GatewayIntentBits.GuildVoiceStates, // for voice related things
        GatewayIntentBits.GuildMessages, // for guild messages
        GatewayIntentBits.MessageContent, // Conteudo?
        GatewayIntentBits.GuildMessageReactions, // for message reactions
    ],
})

const config = require('./config.js');
client.config = config

// Load all Events from the ./events folder
function loadEvents(folder, client, type) {
    // Lê os conteúdos da pasta
    const files = fs.readdirSync(path.resolve(folder));

    for (const fileName of files) {
        const filePath = path.join(folder, fileName);
        const stats = fs.statSync(filePath);
        // Se for um subdiretório, chama a função recursivamente
        const folderName = path.basename(path.resolve(folder));
        if (stats.isDirectory()) {
            loadEvents(filePath, client);
        } else if (filePath.endsWith('.js')) {
            // Se for um arquivo JavaScript, carrega o evento
            const event = require(path.resolve(filePath));
            const eventName = path.basename(fileName, '.js');
            if (folderName == 'player') {
                console.log(chalk.cyan(`[ Bot ] `) + chalk.yellow('Player Event Loaded: ') + chalk.green(eventName));
                player.on(eventName, event.bind(null, client));
            } else {
                console.log(chalk.cyan(`[ Bot ] `) + chalk.yellow('Bot Event Loaded: ') + chalk.green(eventName));
                client.on(eventName, event.bind(null, client));
            }
        }
    }
}
// Uso da função
loadEvents('./events', client);

// Load all Commands from the "./commands" folder.
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            command.category = folder;
            client.commands.set(command.data.name, command);
            console.log(chalk.cyan(`[ Bot ] `) + chalk.yellow('Command Loaded: ') + chalk.red(`[${folder}] `) + chalk.green(command.data.name));
            //console.log(`Comando carregado: [${folder}] ${command.data.name}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Bot Login
client.login(config.TOKEN).catch((e) => {
    console.log("Token inválido ou expirado!", e);
})

const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);

module.exports = client;