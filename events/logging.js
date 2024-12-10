const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction, client, message) => {
  // Caminho do arquivo de configuração
  const configPath = path.join(__dirname, '../data/logsConfig.json');
  const config = fs.existsSync(configPath) ? require(configPath) : {};

  const getLogChannel = (guildId) => {
    const guildConfig = config[guildId];
    if (!guildConfig || !guildConfig.logChannel) return null;
    return client.channels.cache.get(guildConfig.logChannel);
  };

  // Evento: Mensagem Deletada
  client.on('messageDelete', async (message) => {
    if (!message.guild || !message.author || message.author.bot) return;
    const logChannel = getLogChannel(message.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('🗑️ Mensagem Deletada')
      .addFields(
        { name: 'Autor', value: message.author.tag, inline: true },
        { name: 'Canal', value: message.channel.name, inline: true },
        { name: 'Mensagem', value: message.content || 'Nenhum conteúdo disponível', inline: false }
      )
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }) || null)
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Evento: Mensagem Editada
  client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!oldMessage.guild || !oldMessage.author || oldMessage.author.bot) return;
    const logChannel = getLogChannel(oldMessage.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#ffa500')
      .setTitle('✏️ Mensagem Editada')
      .addFields(
        { name: 'Autor', value: oldMessage.author.tag, inline: true },
        { name: 'Canal', value: oldMessage.channel.name, inline: true },
        { name: 'Antes', value: oldMessage.content || 'Nenhum conteúdo', inline: false },
        { name: 'Depois', value: newMessage.content || 'Nenhum conteúdo', inline: false }
      )
      .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }) || null)
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Evento: Novo Membro
  client.on('guildMemberAdd', async (member) => {
    const logChannel = getLogChannel(member.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('✅ Novo Membro')
      .addFields(
        { name: 'Usuário', value: member.user.tag, inline: true },
        { name: 'ID', value: member.id, inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }) || null)
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Evento: Membro Saiu
  client.on('guildMemberRemove', async (member) => {
    const logChannel = getLogChannel(member.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#ff4500')
      .setTitle('❌ Membro Saiu')
      .addFields(
        { name: 'Usuário', value: member.user.tag, inline: true },
        { name: 'ID', value: member.id, inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }) || null)
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Evento: Alteração de Nickname
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const logChannel = getLogChannel(newMember.guild.id);
    if (!logChannel) return;

    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setColor('#1e90ff')
        .setTitle('🔄 Alteração de Nickname')
        .addFields(
          { name: 'Usuário', value: newMember.user.tag, inline: true },
          { name: 'Antes', value: oldMember.nickname || 'Nenhum', inline: true },
          { name: 'Depois', value: newMember.nickname || 'Nenhum', inline: true }
        )
        .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }) || null)
        .setTimestamp();

      logChannel.send({ embeds: [embed] }).catch(console.error);
    }
  });

  // Evento: Criação de Canal
  client.on('channelCreate', async (channel) => {
    if (!channel.guild) return;
    const logChannel = getLogChannel(channel.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#32cd32')
      .setTitle('➕ Canal Criado')
      .addFields(
        { name: 'Nome', value: channel.name, inline: true },
        { name: 'Tipo', value: channel.type, inline: true }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Evento: Exclusão de Canal
  client.on('channelDelete', async (channel) => {
    if (!channel.guild) return;
    const logChannel = getLogChannel(channel.guild.id);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('➖ Canal Deletado')
      .addFields(
        { name: 'Nome', value: channel.name, inline: true },
        { name: 'Tipo', value: channel.type, inline: true }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] }).catch(console.error);
  });

  // Evento: Alteração de Avatar
  client.on('userUpdate', async (oldUser, newUser) => {
    const logChannel = getLogChannel(newUser.guild?.id);
    if (!logChannel) return;

    if (oldUser.avatar !== newUser.avatar) {
      const embed = new EmbedBuilder()
        .setColor('#9370db')
        .setTitle('🖼️ Alteração de Avatar')
        .addFields({ name: 'Usuário', value: newUser.tag, inline: true })
        .setImage(newUser.displayAvatarURL({ dynamic: true }) || null)
        .setTimestamp();

      logChannel.send({ embeds: [embed] }).catch(console.error);
    }
  });
};
