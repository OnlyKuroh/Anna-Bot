const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = async (client, message) => {
  // Função para obter o canal de logs
  const getLogChannel = (guildId) => {
    const configPath = path.join(__dirname, "../../data/logsConfig.json"); // Caminho correto do arquivo de configuração
    const config = fs.existsSync(configPath) ? require(configPath) : {};
    const guildConfig = config[guildId];
    if (!guildConfig || !guildConfig.logChannel) return null;
    return client.channels.cache.get(guildConfig.logChannel);
  };

  // Verificar se a mensagem e a guilda estão disponíveis
  if (!message || !message.guild) return;

  // Obter o canal de logs
  const logChannel = getLogChannel(message.guild.id);
  if (!logChannel) return;

  // Verificar se a mensagem tem um autor
  const author = message.author || {
    tag: "Desconhecido",
    id: "N/A",
    displayAvatarURL: () => null,
  };

  // Criar o embed de log para mensagem apagada
  const embed = new EmbedBuilder()
    .setColor("#FF6F61")
    .setTitle("🗑️ **Mensagem Deletada**")
    .setThumbnail(author.displayAvatarURL({ dynamic: true }) || "")
    .addFields(
      { name: "👤 **Autor**", value: `\`${author.tag}\``, inline: true },
      {
        name: "📍 **Canal**",
        value: `\`${message.channel.name}\``,
        inline: true,
      },
      {
        name: "📝 **Mensagem**",
        value: message.content
          ? `\`\`\`${message.content}\`\`\``
          : "Nenhum conteúdo disponível",
      }
    )
    .setFooter({ text: `ID do Autor: ${author.id}` })
    .setTimestamp();

  logChannel.send({ embeds: [embed] }).catch(console.error);

  // Mensagem Editada
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (oldMessage.author?.bot || !oldMessage.guild) return;

    const logChannel = getLogChannel(oldMessage.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("✏️ **Mensagem Editada**")
      .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }) || "")
      .addFields(
        {
          name: "👤 **Autor**",
          value: `\`${oldMessage.author.tag}\``,
          inline: true,
        },
        {
          name: "📍 **Canal**",
          value: `\`${oldMessage.channel.name}\``,
          inline: true,
        },
        {
          name: "🔷 **Antes**",
          value: oldMessage.content
            ? `\`\`\`${oldMessage.content}\`\`\``
            : "Nenhum conteúdo",
          inline: false,
        },
        {
          name: "🔶 **Depois**",
          value: newMessage.content
            ? `\`\`\`${newMessage.content}\`\`\``
            : "Nenhum conteúdo",
          inline: false,
        }
      )
      .setFooter({ text: `ID do Autor: ${oldMessage.author.id}` })
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Alteração de Nickname
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const logChannel = getLogChannel(newMember.guild.id);
    if (!logChannel) return;

    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setColor("#00BFFF")
        .setTitle("🔄 **Alteração de Nickname**")
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }) || "")
        .addFields(
          {
            name: "👤 **Usuário**",
            value: `\`${newMember.user.tag}\``,
            inline: true,
          },
          {
            name: "🛠️ **Antes**",
            value: oldMember.nickname || "`Nenhum`",
            inline: true,
          },
          {
            name: "🔧 **Depois**",
            value: newMember.nickname || "`Nenhum`",
            inline: true,
          }
        )
        .setFooter({ text: `ID do Usuário: ${newMember.id}` })
        .setTimestamp();

      logChannel.send({ embeds: [embed] }).catch(console.error);
    }
  });

  // Alteração de Avatar
  client.on("userUpdate", async (oldUser, newUser) => {
    const logChannel = getLogChannel(newUser.guild?.id);
    if (!logChannel) return;

    if (oldUser.avatar !== newUser.avatar) {
      const embed = new EmbedBuilder()
        .setColor("#9370DB")
        .setTitle("🖼️ **Alteração de Avatar**")
        .setThumbnail(newUser.displayAvatarURL({ dynamic: true }) || "")
        .addFields({ name: "👤 **Usuário**", value: `\`${newUser.tag}\`` })
        .setFooter({ text: `ID do Usuário: ${newUser.id}` })
        .setTimestamp();

      logChannel.send({ embeds: [embed] }).catch(console.error);
    }
  });

  // Criação de Canal
  client.on("channelCreate", async (channel) => {
    if (!channel.guild) return;
    const logChannel = getLogChannel(channel.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("#32CD32")
      .setTitle("➕ **Canal Criado**")
      .addFields(
        { name: "📋 **Nome**", value: `\`${channel.name}\``, inline: true },
        { name: "📂 **Tipo**", value: `\`${channel.type}\``, inline: true }
      )
      .setFooter({ text: `ID do Canal: ${channel.id}` })
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Exclusão de Canal
  client.on("channelDelete", async (channel) => {
    if (!channel.guild) return;
    const logChannel = getLogChannel(channel.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor("#FF4500")
      .setTitle("➖ **Canal Deletado**")
      .addFields(
        { name: "📋 **Nome**", value: `\`${channel.name}\``, inline: true },
        { name: "📂 **Tipo**", value: `\`${channel.type}\``, inline: true }
      )
      .setFooter({ text: `ID do Canal: ${channel.id}` })
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });
};
