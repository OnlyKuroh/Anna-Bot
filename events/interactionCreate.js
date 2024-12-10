
const { EmbedBuilder, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const fs = require("fs")
//const db = require('../data/database');
module.exports = async (client, interaction) => {
    try {
        if (!interaction?.guild) {
            //return interaction?.reply({ content: "This bot is only for servers and can be used on servers.", ephemeral: true })
        } else {
            async function cmd_loader() {
                if (interaction?.type === InteractionType.ApplicationCommand) {
                    // Search in array commands.
                    let cmd = client.commands.find(c => c.name === interaction.commandName)
                    // Catch informations about.. and your run command.
                    let props = interaction.client.commands.get(interaction.commandName);
                    //let props = require(`.${config.commandsDir}/${cmd.category}/${cmd.name}`);
                    if (interaction.commandName === props.data.name) {
                        try {
                            if (interaction?.member?.permissions?.has(props?.permissions || "0x0000000000000800")) {
                                if (props && props.voiceChannel) {
                                    if (!interaction?.member?.voice?.channelId) return interaction?.reply({ content: "Você não está conectado a um canal de voz. ❌", ephemeral: true }).catch(e => { })
                                    const guild_me = interaction?.guild?.members?.cache?.get(client?.user?.id);
                                    if (guild_me?.voice?.channelId) {
                                        if (guild_me?.voice?.channelId !== interaction?.member?.voice?.channelId) {
                                            return interaction?.reply({ content: "Você não está no mesmo canal de voz que eu. ❌", ephemeral: true }).catch(e => { })
                                        }
                                    }
                                }
                                return props.execute(
                                    client, 
                                    interaction,
                                    //db // Descomenta caso queira passar db
                                );

                            } else {
                                return interaction?.reply({ content: `Sem permissão: **${props?.permissions?.replace("0x0000000000000020", "MANAGE GUILD")?.replace("0x0000000000000800", "SEND MESSAGES") || "SEND MESSAGES"}**`, ephemeral: true });
                            }
                        } catch (e) {
                            return interaction?.reply({ content: `Algo deu errado...\n\n\`\`\`${e?.message}\`\`\``, ephemeral: true });
                        }
                    }
                }
            }

            cmd_loader()
        }
    } catch (e) {
        if (client?.errorLog) {
            let embed = new EmbedBuilder()
                .setColor(client.config?.embedColor)
                .setTimestamp()
                .addFields([
                    { name: "Command", value: `${interaction?.commandName}` },
                    { name: "Error", value: `${e?.stack}` },
                    { name: "User", value: `${interaction?.user?.tag} \`(${interaction?.user?.id})\``, inline: true },
                    { name: "Guild", value: `${interaction?.guild?.name} \`(${interaction?.guild?.id})\``, inline: true },
                    { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                    { name: "Command Usage Channel", value: `${interaction?.channel?.name} \`(${interaction?.channel?.id})\``, inline: true },
                    { name: "User Voice Channel", value: `${interaction?.member?.voice?.channel?.name} \`(${interaction?.member?.voice?.channel?.id})\``, inline: true },
                ])
            await client?.errorLog?.send({ embeds: [embed] }).catch(e => { })
        } else {
            console.log(`
Command: ${interaction?.commandName}
Error: ${e}
User: ${interaction?.user?.tag} (${interaction?.user?.id})
Guild: ${interaction?.guild?.name} (${interaction?.guild?.id})
Command Usage Channel: ${interaction?.channel?.name} (${interaction?.channel?.id})
User Voice Channel: ${interaction?.member?.voice?.channel?.name} (${interaction?.member?.voice?.channel?.id})
`)
        }
        return interaction?.reply({ content: "Por favor tente esse comando novamente mais tarde. Possível bug reportado para os desenvolvedores.", ephemeral: true }).catch(e => { })
    }
};