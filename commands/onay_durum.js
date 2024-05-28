/////////////////////////////////////////
const mongo_planss = require("../mongoDB/plans.js");
let admins = [
  "445142958447263747"
];
const { MessageEmbed } = require("discord.js");
/////////////////////////////////////////
module.exports = {
  name: "basvuru_durumu",
  usage: "/basvuru_durumu <basvuru_id>",
  options: [
    {
      name: "basvuru_id",
      description: "Başvuru ID.",
      type: "STRING",
      required: true,
    },
  ],
  category: "Bot",
  description: "Başvurunun Durumunu Gösterir.",
  run: async (client, interaction) => {
    let basvuru_id = interaction.options.getString("basvuru_id");
    if(basvuru_id.length !== 24) return interaction.reply({ content: "Başvuru ID'si hatalı." });
    let userID = interaction.user.id;
    let basvuru = await mongo_planss.findOne({ _id: basvuru_id }) || "NaN";
    if (basvuru === "NaN") return interaction.reply({ content: "Bu ID'ye sahip bir başvuru bulunamadı." });

    let renk_kodu;
    if(girilen_basvuru_id_dbb.onay_durumu === "Bekliyor") renk_kodu = "ORANGE";
    else if(girilen_basvuru_id_dbb.onay_durumu === "Onaylandi") renk_kodu = "GREEN";
    else if(girilen_basvuru_id_dbb.onay_durumu === "Onaylanmadi") renk_kodu = "RED";
    else renk_kodu = "RANDOM";
    //Bekliyor, Onaylandi, Onaylanmadi
    const sunucu = new MessageEmbed()
      .setColor(renk_kodu)
      .setTitle("Hermosa Payments")
      .addField("Başvuru Durumu", `${girilen_basvuru_id_dbb.onay_durumu}`);
    interaction.reply({ embeds: [sunucu] });
      
  },
};