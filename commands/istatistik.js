const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "istatistik",
  usage: "/istatistik",
  category: "Bot",
  description: "Istatistikleri gösterir.",
  run: async (client, interaction) => {
     try {
        const onaylandi = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Veriler")
          .addField('Sunucu Sayısı',`${client.guilds.cache.size}`)
          .addField('Toplam Kullanıcı Sayısı',`${client.users.cache.size}`);
        interaction.reply({ embeds: [onaylandi] });
     } catch (e) {
        interaction.reply({ content: "Bir Hata Oluştu", emphemeral: true });
     }
  },
};