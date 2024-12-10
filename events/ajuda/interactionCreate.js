const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const hentai = require('../../commands/hentai/hentai');

// Caminhos das imagens
const cobblemonImagePath = path.join(__dirname, "../../data/cobblemon.png");
const utilityImagePath = path.join(__dirname, "../../data/Utility.png");
const adminImagePath = path.join(__dirname, "../../data/admin.png");
const hentaiImagePath = path.join(__dirname, "../../data/hentai.png");

// Caminho de construção da Imagem
const cobblemonImage = new AttachmentBuilder(cobblemonImagePath);
const utilityImage = new AttachmentBuilder(utilityImagePath);
const adminImage = new AttachmentBuilder(adminImagePath);
const hentaiImage = new AttachmentBuilder(hentaiImagePath);


// Carrega comandos dinamicamente
function getCommandsByCategory(folderPath) {
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
  const commands = commandFiles.map(file => {
    const command = require(path.join(folderPath, file));
    return { name: command.data.name, description: command.data.description };
  });
  return commands;
}

// Carregar os comandos de cada categoria
const cobblemonCommands = getCommandsByCategory(path.join(__dirname, '../../commands/Cobblemon'));
const utilityCommands = getCommandsByCategory(path.join(__dirname, '../../commands/utility'));
const adminCommands = getCommandsByCategory(path.join(__dirname, '../../commands/utility'));
const hentaiCommands = getCommandsByCategory(path.join(__dirname, '../../commands/hentai'));

module.exports = async (client, interaction) => {
  if (interaction.customId === "help_menu") {
    const selectedCategory = interaction.values[0];

    let embedResponse;
    let imageAttachment;
    const guildIcon = interaction.guild?.iconURL() || "https://via.placeholder.com/150";

    try {
      if (selectedCategory === "cobblemon") {
        embedResponse = new EmbedBuilder()
          .setColor(0x00aeff)
          .setTitle("🎮 Comandos - Cobblemon")
          .setDescription(
            "Aqui estão os comandos de Cobblemon disponíveis para o servidor:\n\n" +
            cobblemonCommands.map(cmd => `• \`/${cmd.name}\` - ${cmd.description}`).join('\n')
          )
          .setImage("attachment://cobblemon.png")
          .setFooter({ text: "Anna Community - Cobblemon", iconURL: guildIcon })
          .setTimestamp();
        imageAttachment = cobblemonImage;
      } else if (selectedCategory === "utility") {
        embedResponse = new EmbedBuilder()
          .setColor(0x00aeff)
          .setTitle("⚙️ Comandos - Utilidade")
          .setDescription(
            "Aqui estão os comandos de Utilidade disponíveis para o servidor:\n\n" +
            utilityCommands.map(cmd => `• \`/${cmd.name}\` - ${cmd.description}`).join('\n')
          )
          .setImage("attachment://Utility.png")
          .setFooter({ text: "Anna Community - Utilidade", iconURL: guildIcon })
          .setTimestamp();
        imageAttachment = utilityImage;
      } else if (selectedCategory === "admin") {
        embedResponse = new EmbedBuilder()
          .setColor(0xff4500)
          .setTitle("🛠️ Comandos - Administração")
          .setDescription(
            "Aqui estão os comandos de Administração disponíveis para o servidor:\n\n" +
            adminCommands.map(cmd => `• \`/${cmd.name}\` - ${cmd.description}`).join('\n')
          )
          .setImage("attachment://admin.png")
          .setFooter({ text: "Anna Community - Administração", iconURL: guildIcon })
          .setTimestamp();
        imageAttachment = adminImage;
      } else if (selectedCategory === "hentai") {
        embedResponse = new EmbedBuilder()
          .setColor(0xff4500)
          .setTitle("🔞 Comandos - Hentai")
          .setDescription(
            "Aqui estão os comandos de Hentai disponíveis para o servidor:\n\n" +
            hentaiCommands.map(cmd => `• \`/${cmd.name}\` - ${cmd.description}`).join('\n')
          )
          .setImage("attachment://hentai.png")
          .setFooter({ text: "Anna Community - Hentai", iconURL: guildIcon })
          .setTimestamp();
        imageAttachment = hentaiImage;
      }

      // Atualizar a mensagem com o embed e a imagem da categoria selecionada
      await interaction.update({
        embeds: [embedResponse],
        files: [imageAttachment],
      });
    } catch (error) {
      console.error("Erro ao processar interação do menu:", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.",
        ephemeral: true,
      });
    }
  }
};
