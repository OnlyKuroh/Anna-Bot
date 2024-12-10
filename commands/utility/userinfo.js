const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo JSON
const configPath = path.join(__dirname, '../../data/autoRoleConfig.json');

// Função para salvar a configuração no JSON
function saveAutoRole(guildId, roleId) {
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath))
    : { guilds: {} };

  config.guilds[guildId] = { autoRoleId: roleId };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('Define um cargo para ser atribuído automaticamente a novos membros.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles) // Apenas administradores podem usar
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('O cargo que será atribuído automaticamente a novos membros.')
        .setRequired(true)
    ),
  execute: async (client, interaction) => {
    try {
      const role = interaction.options.getRole('role');

      // Verificar permissões
      if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return interaction.reply({
          content: '❌ Eu não tenho permissão para gerenciar cargos neste servidor.',
          ephemeral: true,
        });
      }

      // Salvar a configuração no arquivo JSON
      saveAutoRole(interaction.guild.id, role.id);

      await interaction.reply({
        content: `✅ Cargo **${role.name}** configurado com sucesso para auto-role.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('❌ Erro ao configurar auto-role:', error);
      interaction.reply({
        content: '❌ Ocorreu um erro ao configurar o auto-role. Por favor, tente novamente.',
        ephemeral: true,
      });
    }
  },
};
