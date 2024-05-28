/////////////////////////////////////////
const mongo_planss = require("../mongoDB/plans.js");
let admins = [
  "445142958447263747"
];
const { MessageEmbed } = require("discord.js");
/////////////////////////////////////////
module.exports = {
  name: "basvurular",
  usage: "/basvurular",
  category: "Bot",
  description: "Başvuruyu Onaylar.",
  run: async (client, interaction) => {
    let userID = interaction.user.id;
    if (!userID.includes(admins)) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkili olmanız gerekmektedir." });
    let basvuru = await mongo_planss.find({ onay_durumu: "Bekliyor" }).limit(10);
    if (basvuru.length === 0) return interaction.reply({ content: "Başvuru Bulunamadı." });
    const basvuru_listesi = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Hermosa Payments | Başvurular")
      .setDescription(`${basvuru.map(basvuru => `${basvuru.plan_adi}(${basvuru._id}) - ${basvuru.sunucuSahibiID}`).join("\n")}`)
      .setFooter("Team Hermosa Payments");
    interaction.reply({ embeds: [basvuru_listesi] });
  },
};