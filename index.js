const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { Client, Intents, MessageEmbed, VoiceChannel, WebhookClient, Collection, MessageActionRow, MessageButton, MessageSelectMenu, Discord } = require("discord.js");
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    messageCacheLifetime: 60,
    fetchAllMembers: true,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    shards: "auto",
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true,
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: 32767,
});
const mongoose = require("mongoose");
const config = require("./json/config.json");
const fs = require("fs")
const moment = require("moment")
//////
const { text } = require('body-parser');
//////
let admin = ["2423432432432"];
client.admin = admin;
//////

const log = (message) => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
/////////////////////////////////////////
/////////////////////////////////////////
////
const mongo_hesaps = require("./mongoDB/web_hesap.js");
const mongo_planss = require("./mongoDB/plans.js");
const mongo_satin_alinmis_plans = require("./mongoDB/buy_plans.js");
/////////////////////////////////////////
client.on("ready", () => {
    client.user.setActivity(config.bot.ready);
    pre_kontrol();
});
/////////////////////////////////////////

async function pre_kontrol() {
    mongo_satin_alinmis_plans.find({}, async function (err, users) {
      if (err) console.log(err);
      if (!users) return;
      users.forEach(async (users) => {
        //console.log(users)
        var anlik_tarih = moment().format("YYYY-MM-DD");
        var sonkullanim = moment(users.son_kullanim);
        let sonuc = sonkullanim.diff(anlik_tarih, `days`);
        if (Number(sonuc) === 0) {
          //console.log(users)
          //console.log("Planın Süresi Bitti");
          ////////////////////////////////////////////////////
          let destek_verdigi_sunucu = client.guilds.cache.get(users.sunucuID) || "nope";
          let alici = await client.users.fetch(users.alan_kisi_ID).catch(() => null);
          if (!alici) return log("Kullanıcıyı Bulamadım");
          const planin_bitti_uyari = new MessageEmbed()
            .setColor("#FFA500")
            .setTitle("Hermosa Payments | Bildirim")
            .addField(`Mesaj;`,`Selam, **${alici.username}**! \n **${destek_verdigi_sunucu.name}** İçin Olan Destek Süreniz Sona Ermiştir. \n Üzülmeyin Sitenizden Tekrardan Sevdiğiniz Sunucuyu Destekleye Bilirsiniz!`)
            .setFooter("Team Hermosa Payments");
           await alici.send({ embeds: [planin_bitti_uyari] }).then(async function (message) {
            }).catch(async () => {
                log(users.alan_kisi_ID + " Kullanıcının DM'si Açık Değil");
            });
         //////////////////////////////////////////////////////
         let sunucu_db_verileri = await mongo_planss.findOne({ sunucuID: users.sunucuID, _id: users.alinan_plan_mongoDB_ID });
         //////////////////////////////////////////////////////
        const plan_sona_erdi = new MessageEmbed()
            .setColor("RED")
            .setTitle("Hermosa Payments | " + destek_verdigi_sunucu.name + " - Bildirim \n ")
            .addField(`İçerik Hakkında`,`Bir Kullanıcın'ın Sunucuya Olan Desteğinin Süresi Bitti!`)
            .addField(`Kullanıcı ID`,`${users.alan_kisi_ID}`)
            .addField(`Plan Adı`,`${sunucu_db_verileri.plan_adi}`)
            .addField(`Aldığı Tarih`,`${users.aldigi_tarih}`)
            .setFooter("Team Hermosa Payments");
        client.channels.cache.get(sunucu_db_verileri.log_channel_id).send({ embeds: [plan_sona_erdi] }).catch(async () => { console.log("Kanalı Bulamadım") });
         //////////////////////////////////////////////////////
        const plan_sona_erdi_sistem = new MessageEmbed()
            .setColor("RED")
            .setTitle("Hermosa Payments | " + destek_verdigi_sunucu.name + " - Bildirim \n ")
            .addField(`İçerik Hakkında`,`Bir Kullanıcın'ın Planı Bitti!`)
            .addField(`Kullanıcı ID`,`${users.alan_kisi_ID}`)
            .addField(`Plan Adı`,`${sunucu_db_verileri.plan_adi}`)
            .addField(`Sunucu ID`,`${users.sunucuID}`)
            .addField(`Aldığı Tarih`,`${users.aldigi_tarih}`)
            .setFooter("Team Hermosa Payments");
        client.channels.cache.get("990207214088233000").send({ embeds: [plan_sona_erdi_sistem] }).catch(async () => { console.log("Kanalı Bulamadım") });
         //////////////////////////////////////////////////////
        let rol_al = client.guilds.cache.get(users.sunucuID);
        rol_al.members.cache.get(users.alan_kisi_ID).roles.remove(sunucu_db_verileri.rol_id).then(async () => {
            await mongo_satin_alinmis_plans.deleteOne({ _id: users._id });
            }).catch(async () => {
                //console.log("Yetersiz Yetkim Var")
                client.channels.cache.get("990207214088233000").send({ content: `${users.sunucuID}'ID li Sunucuda Yeterli Yetkim Yok Rolü Alamıyorum.` }).catch(async () => { console.log("Kanalı Bulamadım") });
                client.channels.cache.get(sunucu_db_verileri.log_channel_id).send({ content: "Kulllanıcının Rolünü Alamıyorum Yetersiz Yetkim Var." }).catch(async () => { console.log("Kanalı Bulamadım") });
            });
        ////////////////////////////////////////////////////
        } else {
          //console.log("Planın Süresi Daha Bitmedi. Kalan Süre: "+sonuc);
        }
      });
    });
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
client.discord = Discord;
client.commands = new Collection();
client.slashCommands = new Collection();


client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return interaction.followUp({ content: 'an Erorr' });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === 'SUB_COMMAND') {
        if (option.name) args.push(option.name);
          option.options?.forEach(x =>  {
            if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    } try {
      command.run(client, interaction, args)
    } catch (e) {
      interaction.followUp({ content: e.message });
    }
  }
});

handler(client);
async function handler(client) {
  const slashCommands = await globPromise(
      `./commands/*.js`
  );

  const arrayOfSlashCommands = [];
  slashCommands.map((value) => {
      const file = require(value);
      console.log(`${file.name}, Yüklendi!`);
      if (!file.name) return;
      client.slashCommands.set(file.name, file);
      arrayOfSlashCommands.push(file);
  });
  client.on("ready", async () => {
      await client.application.commands.set(arrayOfSlashCommands).then(async () => {
            console.log("Slash Komutları Yüklendi");
        }).catch(async (e) => {
            console.log("Slash Komutları Yüklenemedi" + e);
        });
  });
}
/////////////////////////////////////
///////////////////////////////////
client.on("guildMemberAdd", async (member) => {
    let usermm = member.user.id;
    let oPlandakiUyeler = await mongo_satin_alinmis_plans.findOne({ sunucuID: member.guild.id, alan_kisi_ID: usermm }) || "yok";
    if(oPlandakiUyeler !== "yok"){
    let planMongoID = oPlandakiUyeler.alinan_plan_mongoDB_ID; 
    let planiCek = await mongo_planss.findOne({ sunucuID: member.guild.id, _id: planMongoID }) || "yok";
    ///////
    if(planiCek !== "yok") {
        let rolver = client.guilds.cache.get(member.guild.id);
        rolver.members.cache.get(usermm).roles.add(planiCek.rol_id).then(async () => {
        
        }).catch(async () => {
            console.log("Hata");
        });
    }
    }
});

///////////////////////////////////
client.on('guildCreate', guild => {
  client.channels.cache.get("935253697108262963").send({ content: `${guild.id}'ID li Sunucuya Eklendim! Kurucu ID ${guild.ownerId}` }).catch(async () => { console.log("Kanalı Bulamadım") });
});
///////////////////////////////////
client.on("ready", () => {
    console.log(`Giriş, ${client.user.tag}! ByCan`);
});

require("./www/server.js")(client)
client.login("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");