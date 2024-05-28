/////////////////////////////////////////
const mongo_planss = require("../mongoDB/plans.js");
let admins = [
  "445142958447263747"
];
const { MessageEmbed } = require("discord.js");
/////////////////////////////////////////
module.exports = {
  name: "basvuru_reddet",
  usage: "/basvuru_reddet <basvuru_id>",
  options: [
    {
      name: "basvuru_id",
      description: "Başvuru ID.",
      type: "STRING",
      required: true,
    },
  ],
  category: "Bot",
  description: "Başvuruyu Kabul Etmez.",
  run: async (client, interaction) => {
    let basvuru_id = interaction.options.getString("basvuru_id");
    if(basvuru_id.length !== 24) return interaction.reply({ content: "Başvuru ID'si hatalı." });
    let userID = interaction.user.id;
    if (!userID.includes(admins)) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkili olmanız gerekmektedir." });
    let basvuru = await mongo_planss.findOne({ _id: basvuru_id }) || "NaN";
    if (basvuru === "NaN") return interaction.reply({ content: "Bu ID'ye sahip bir başvuru bulunamadı." });

    if(basvuru.onay_durumu === "Onaylandi") {
        const iptal_edildi = new MessageEmbed()
          .setColor("RED")
          .setTitle("Uyarı")
          .setDescription("Bu Başvuru Zaten Onaylanmış!");
        interaction.reply({ embeds: [iptal_edildi] });
      } else if(basvuru.onay_durumu === "Onaylanmadi") {
        const iptal_edildi = new MessageEmbed()
          .setColor("RED")
          .setTitle("Uyarı")
          .setDescription("Bu Başvuru Kabul Edilmemiş!");
        await interaction.reply({ embeds: [iptal_edildi] });
      } else if(basvuru.onay_durumu === "Bekliyor") {
        await mongo_planss.findOneAndUpdate({ _id: basvuru_id },{
            $set: {
              onay_durumu: "Onaylanmadi",
            },
          }, {
          new: true,
          upsert: true,
          rawResult: true 
        });
        //////////////////////
        const plan_basvurunuz_onaylandi = new MessageEmbed()
           .setColor("RED")
          .setTitle("Hermosa Payments | Başvurunuz Kabul Edilmedi!")
          .setDescription(`**${basvuru.plan_adi}** Adlı Plan İçin Başvurunuz Kabul Edilmedi!\n Üzgünüz :( \n \n İlgili birimlerimiz tarafından yapılan kontrol ve değerlendirmeler sonrasında başvurunuzun kabul edilmediğini bildirmek isteriz. İlginiz için teşekkür eder, iyi çalışmalar dileriz. \n Gerekli şartları yerine getirdiyseniz ya da hali hazırda yerine getirdiğinizi düşünüyorsanız tekrar başvuru yapabilirsiniz.`)
          .setFooter("Team Hermosa Payments");
        
        client.channels.cache.get(basvuru.log_channel_id).send({ embeds: [plan_basvurunuz_onaylandi] }).catch(async () => { console.log("Kanalı Bulamadım") });
        //////////////////////
        const plan_basvurunuz_onaylandi_fastlogs = new MessageEmbed()
          .setColor("RED")
          .setTitle("Hermosa Payments | Başvurunuz Kabul Edilmedi!")
          .addField('Plan Adı',`${basvuru.plan_adi}`)
          .addField('Yetkili ID',`${userID}`)
          .addField('Sunucu ID',`${basvuru.sunucuID}`)
          .addField('Sunucu Sahibi ID',`${basvuru.sunucuSahibiID}`)
          .setTimestamp()
          .setFooter("Team Hermosa Payments");
        client.channels.cache.get("932236505651499069").send({ embeds: [plan_basvurunuz_onaylandi_fastlogs] }).catch(async () => { console.log("Kanalı Bulamadım") });
        //////////////////////
        let alici = await client.users.fetch(basvuru.sunucuSahibiID).catch(() => null);
        if (!alici) return log("Kullanıcıyı Bulamadım");
        const basvuru_onaylandi_sunucu_sahibi = new MessageEmbed()
          .setColor("#FFA500")
          .setTitle("Hermosa Payments | Bildirim")
          .addField(`Mesaj;`,`Selam, **${alici.username}**! \n **${basvuru.plan_adi}** Adlı Plan İçin Başvurunuz Kabul Edilmedi. \n Üzgünüz :( \n \n İlgili birimlerimiz tarafından yapılan kontrol ve değerlendirmeler sonrasında başvurunuzun kabul edilmediğini bildirmek isteriz. İlginiz için teşekkür eder, iyi çalışmalar dileriz. \n Gerekli şartları yerine getirdiyseniz ya da hali hazırda yerine getirdiğinizi düşünüyorsanız tekrar başvuru yapabilirsiniz.`)
          .setFooter("Team Hermosa Payments");
        await alici.send({ embeds: [basvuru_onaylandi_sunucu_sahibi] }).then(async function (message) {
        }).catch(async () => {
            //console.log(girilen_basvuru_id_dbb.sunucuSahibiID + " Kullanıcının DM'si Açık Değil");
        });
        //////////////////////
        const basvuru_onaylandi = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("İşlem Başarılı!")
          .setDescription("Başvurusu Kabul Edilmedi Ve Sunucu Sahibine Detaylı Bilgiler İletildi!");
        interaction.reply({ embeds: [basvuru_onaylandi] });
      } else {
        interaction.reply({ content: "Bu ID'ye sahip bir başvuru bulunamadı." });
      }
      
  },
};