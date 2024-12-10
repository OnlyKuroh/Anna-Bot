const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async (client, member) => {
   try {
       // ID do cargo a ser atribuído automaticamente
       const autoRoleId = '1269665880988712982';
 
       // Buscar o cargo no servidor
       const role = member.guild.roles.cache.get(autoRoleId);
       if (!role) {
         console.error(`⚠️ O cargo com ID ${autoRoleId} não foi encontrado no servidor ${member.guild.name}.`);
         return;
       }
 
       // Atribuir o cargo ao novo membro
       await member.roles.add(role);
       console.log(`✅ Cargo '${role.name}' atribuído ao novo membro '${member.user.tag}' no servidor '${member.guild.name}'.`);
     } catch (error) {
       console.error('❌ Erro ao adicionar o cargo automaticamente:', error);
     }
   }
 