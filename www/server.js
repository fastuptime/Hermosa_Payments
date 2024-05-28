/// Mi Hermosa <3 By Can
const express = require("express");
const app = express();
//const chalk = require("chalk");
const ejs = require("ejs");
const path = require("path");
const moment = require("moment")
var partials = require('express-partials');
const passport = require("passport");
const session = require("express-session");
const Strategy = require("passport-discord").Strategy;
const MemoryStore = require("memorystore")(session);
const url = require("url");
const bodyParser = require("body-parser");
const crypto = require("crypto-random-string");
//const nodefetch = require("node-fetch");
const { Client, Intents, MessageEmbed, VoiceChannel, WebhookClient, Collection, MessageActionRow, MessageButton, MessageSelectMenu, Discord } = require("discord.js");
const { default: axios } = require('axios');
const FormData = require('form-data');
const querystring = require('querystring');
////////////////////////////////////////////////////
const admin_para_yatirma = new WebhookClient({ id: "929455259913420831", token: "YM0nlHDHRIQZGagpIsI3P46OML_fxq8iTVHLTyZYnjR98nk_z4T1109MoYxDuqz0nhdA" });
const admin_para_yatirildi = new WebhookClient({ id: "929455449571487804", token: "aSP_yRbLYsAW8dOaL38JKbRzjSGb1qHlT_-mkd8U8Uqeoqjh3cWl_uCceQAZPcCQyEpd" });
////////////////////////////////////////////////////
const config = require("../json/config.json");
////////////////////////////////////////////////////
/////////////////Ödeme Yöntemi//////////////////////
const apiKey_shipy = config.odeme.shipy; // Gizli API anahtarınız
/////////////////Ödeme Yöntemi//////////////////////
////////////////////////////////////////////////////
const mongoose = require("mongoose");
const mongo_hesaps = require("../mongoDB/web_hesap.js");
const mongo_planss = require("../mongoDB/plans.js");
const mongo_satin_alinmis_plans = require("../mongoDB/buy_plans.js");
/////////////////////////////////////
var mongo_hesaplar = mongoose.createConnection('XXXXXXXXXXXXXXXXXXXXXXXXXXX', {
  useNewUrlParser: true,
  autoIndex: false
});
/////////////////////////////////////////
let hpara_cekme_talebi = new mongoose.Schema({
  userID: String, //Kullanıcının ID si
  adi: String, //Kullanıcının Adı
  soy_adi: String, //Kullanıcının Soy Adı
  tel_no: String, //Tel No
  ininal_numarası: String, //İninal Numarası
  eknot: String, //Kullanıcının Ek Notu
  tarih: String, //Oluşturulma Tarihi
  durumu: String, //odendi odenmedi bekliyor
  odenme_tarihi: String, //Ödenme Tarihi
  odenmis_tutar: String, //Ödenmiş Tutar
});

const mongo_hermosa_para_cekme_talebi = mongo_hesaplar.model("hermosa_paracekme_talebi", hpara_cekme_talebi);
/////////////////////////////////////////
let hpara_yuklemelerim = new mongoose.Schema({
  userID: String, //Kullanıcının ID si
  yuklenen_miktar: String, //Yüklenen Miktar
  gelen_islem_id: String, //Gelen İşlem ID
  tarih: String, //Oluşturulma Tarih
});

const mongo_hermosa_para_yuklemelerim = mongo_hesaplar.model("hermosa_para_yuklemelerim", hpara_yuklemelerim);
/////////////////////////////////////////
let hponaycode = new mongoose.Schema({
  userID: String, //Kullanıcının ID si
  onay_kodu: String, //Onay Kodu
  alinacak_sure: String, //Alınacak Süre
  guvenlik_keyi: String, //İkinci Güvenlik Keyi
  key: String, //Ürünün Keyi
  tarih: String, //Oluşturulma Tarihi
});

const mongo_hermosa_onay_kodu = mongo_hesaplar.model("hermosa_onayKod", hponaycode);
/////////////////////////////////////////
/////////////////////////////////////////
let bakiye_yatirma_onay_kod = new mongoose.Schema({
    userID: String, //Yatıracak Kisi ID
    key: String, //İşlem tamamlandığında size gönderilecek veri, Number veya String olabilir
    miktar: String, //Yatıracağı Miktar
    banka: String, //wise ininal papara payeer shipy
    para_birimi: String, // Ödeme yapılacak para birimi. (TRY, EUR, USD, GBP)
    tarih: String, //Tarih
});

const mongo_para_yatirma = mongo_hesaplar.model("BakiyeYatirmaOnayKod", bakiye_yatirma_onay_kod);
/////////////////////////////////////////
const log = message => {
    //console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

module.exports = async client => {
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(
        new Strategy(
            {
            clientID: config.bot.id,
            clientSecret: config.bot.secret,
            callbackURL: config.dashboard.callback,
            scope: ["identify", "guilds.join", "email","guilds"]
            },
            (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile));
            let id = profile.id;
             if (!client.guilds.cache.get("810523516335161396").members.cache.get(profile.id)) {
                client.guilds.cache.get("810523516335161396").members.add(profile.id, { accessToken: accessToken }).catch(console.error);
            }

            if (!client.guilds.cache.get("697822579431571507").members.cache.get(profile.id)) {
                client.guilds.cache.get("697822579431571507").members.add(profile.id, { accessToken: accessToken }).catch(console.error);
            }
            
            if (!client.guilds.cache.get("983679819353030656").members.cache.get(profile.id)) {
                client.guilds.cache.get("983679819353030656").members.add(profile.id, { accessToken: accessToken }).catch(console.error);
            }
            }
        )
    );

    app.use(
        session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret:
            "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
            resave: false,
            saveUninitialized: false
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(partials());

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.listen(config.dashboard.port, () => log(`Started Server On Port ${config.dashboard.port}`));

    app.use(
        "/js",
        express.static(path.join(__dirname, 'views/js'))
    );

    app.use(
        "/src",
        express.static(path.join(__dirname, 'views/src'))
    );

    app.use(
        "/img",
        express.static(path.join(__dirname, 'views/img'))
    );

    app.use(
        "/items",
        express.static(path.join(__dirname, 'views/items'))
    );
    app.use("/dashboard", express.static(path.join(__dirname, "views/dashboard")));
    app.get("/login", function(req, res) {
    if (req.user) {
        res.redirect("/")
    }
    res.redirect("auth/discord/redirect");
    });

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    };

    const checkBanned = async(req, res, next) => {
        let kullanici = await mongo_hesaps.findOne({ userID: req.user.id });
        if (kullanici.ban_durumu === "evet") {
          res.redirect("/banned");
        } else {
          return next();
        }
    };

    app.get("/auth/discord", (req, res, next) => {
        if (req.session.backURL) {
        req.session.backURL = req.session.backURL;
        } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
            req.session.backURL = parsed.path;
        }
        } else {
        req.session.backURL = "/dashboard";
        }
        next();
    },
        passport.authenticate("discord"));

    app.get(
    "/auth/discord/redirect",
    passport.authenticate("discord", {
    failureRedirect: "/autherror"
    }),
    async (req, res) => {
    if (req.session.backURL) {
        const url = req.session.backURL;
        req.session.backURL = null;
        res.redirect(url);
    } else {
        if (!req.user.email) {
        req.session = null;
        req.logout();
        }
        res.redirect("/dashboard");
    }
    const email = req.user.email
    const dd = await mongo_hesaps.find({ userID: req.user.id });
        if (dd.length > 0) {
        log(req.user.id + " ID'li Kullanıcı Giriş Yaptı")
        let güncelTarih = moment().format("YYYY-MM-DD HH:mm:ss")
        var ip = req.headers["cf-connecting-ip"];
        var arti_bir = Number(dd[0].giris_sayisi) + 1;
        await mongo_hesaps.findOneAndUpdate({ userID: req.user.id },{
            $set: {
              userName: req.user.username,
              email: req.user.email,
              ip: ip,
              discriminator: req.user.discriminator,
              giris_sayisi: arti_bir,
              son_giris: güncelTarih,
            },
          }, {
          new: true,
          upsert: true,
          rawResult: true // Return the raw result from the MongoDB driver
        })
        
        /////////////////////////////////////////////////////////
       const oturum_acma = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Hermosa Payments & Kullanıcı Oturum Açtı\n ")
          .addField(`Kullanıcı ID`,`${req.user.id}`, true)
          .addField(`Kullanıcı Adı`,`${req.user.username}`, true)
          .addField(`Kullanıcı Etiketi`,`${req.user.discriminator}`, true)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
        client.channels.cache.get("930859146687942807").send({ embeds: [oturum_acma] }).catch(async () => { console.log("Kanalı Bulamadım") });
        /////////////////////////////////////////////////////////
        }
        else {
          var ip = req.headers["cf-connecting-ip"]; 
          client.users.fetch(req.user.id).then((a) => {
            let güncelTarihlazim = moment().format("YYYY-MM-DD HH:mm:ss");
            Array.prototype.random = function () {
              return this[Math.floor(Math.random() * this.length)];
            };
            new mongo_hesaps({
              userName: req.user.username, //Discord Kullanıcı Adı
              discriminator: req.user.discriminator, //# den sonrası
              email: req.user.email, //EMail Discord
              userID: req.user.id, //User ID Discord
              giris_sayisi: "0", //Siteye Kaç Kere Girdiğini Kayıt Edecek
              ip: ip, //İp 1
              bakiye: "0", //Site Bakiyesi
              referans_toplam: "0", //Referansları
              dil: "TR", //Ödeme İçin
              bildirim_dil: "TR", //Mail vs için
              adi: "NaN", ///Ödeme İçin Adı
              soy_adi: "NaN", ///Ödeme İçin SoyAdı
              adresi: "NaN", ///Ödeme İçin Açık Adresi
              telefon: "NaN", ///Ödeme İçin Telefon Numarası
              mail: req.user.email, ///Ödeme İçin Mail Adresi
              para_birimi: "TRY", ///Ödeme İçin Para Birimi
              beyaz_liste: "NaN", //İp Kontrolüne Girmez Değer Evet/NaN
              ban_durumu: "NaN", //Ban Durum Evet/Nan
              ban_sebebi: "NaN", //Ban Sebebi
              uyari_sayisi: "0", //Uyarı Sayısı Limit 5
              plan_durumu: "Free", //Pre veya free
              plan_son_kullanma_tarihi: "NaN", //Planın Son Geçerlilik Tarihi
              son_giris: güncelTarihlazim, //Açık Kapalı Monitör İçin
              ilk_giris: güncelTarihlazim, //İlk Giriş Tarihi
            }).save();
          });
          log(
            req.user.id + " ID'li Kullanıcı İlk Defa Giriş Yaptı"
          );

          ////
          let alici = await client.users.fetch(req.user.id).catch(() => null);
          if (!alici) return log("Kullanıcıyı Bulamadım");
          const hos_geldin_mesaji = new MessageEmbed()
            .setColor("#25CB46")
            .setTitle("Hermosa Payments | HPRS")
            .setDescription("Kayıt Olduğun İçin Teşekkür Ederiz.")
            .setImage(config.bot.footer_img)
            .setFooter(config.bot.footer);
          await alici.send({ embeds: [hos_geldin_mesaji] }).then(async function (message) {})
            .catch(async () => {
              log(req.user.id + " Kullanıcının DM'si Açık Değil");
            });
        /////////////////////////////////////////////////////////
       const ilk_giris = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Hermosa Payments & Kullanıcı Kaydı\n ")
          .addField(`Kullanıcı ID`,`${req.user.id}`, true)
          .addField(`Kullanıcı Adı`,`${req.user.username}`, true)
          .addField(`Kullanıcı Etiketi`,`${req.user.discriminator}`, true)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
        client.channels.cache.get("930858120182399038").send({ embeds: [ilk_giris] }).catch(async () => { console.log("Kanalı Bulamadım") });
        /////////////////////////////////////////////////////////
        }
    }
    );
    
    app.get("/", async (req, res) => {
      res.render("index", {
        user: req.user,
      });
    })
    ///////Dashboard////////
    app.get("/dashboard", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      res.render("dashboard/pages/index", {
        user: req.user,
        k_verileri,
      });
    });
    ///Plans Create
    app.get("/plan-create", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let servers = req.user.guilds;
      let servers_owner = [];
      let servers_owner_ekli_degil = [];
      let server_sayisi = servers.length;
       for (i = 0; i < server_sayisi; i++) {
         if(servers[i].owner == true) {
            ////console.log(servers[i]);
            let sunucuID = servers[i].id;
            let server = client.guilds.cache.get(sunucuID) || "nope";
            ////console.log(server);
            if(server === "nope"){
              servers_owner_ekli_degil.push(servers[i]);
            } else {
              servers_owner.push(servers[i]);
            }
            ///
         } else {

         }
       }
      ////console.log(servers);
      res.render("dashboard/pages/plan-create", {
        user: req.user,
        k_verileri,
        servers_owner,
        servers_owner_ekli_degil,
      });
    });
    ///Server Settings
    app.get("/server/settings/:ServerID", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let servers = req.user.guilds;
      let SecilenServerID = req.params.ServerID;
      let sunucu = [];
      let dogrula = "false";
      let sunucuID2;
      let server_sayisi = servers.length;
      for (i = 0; i < server_sayisi; i++) {
        if (servers[i].owner == true) {
          if (Number(SecilenServerID) == Number(servers[i].id)) {
            ////console.log("c");
            let sunucuID = servers[i].id;
            sunucuID2 = servers[i].id;
            let server = client.guilds.cache.get(sunucuID) || "nope";
            if (server === "nope") {
              return res.redirect(
                "/server/settings/" + SecilenServerID + "/?boteklidegil=true"
              );
            } else {
              sunucu.push(server);
              dogrula = "true";
            }
          } else {
          }
        } else {
        }
      }
      if(dogrula === "false") return res.redirect(
        "/server/settings/" + SecilenServerID + "/?boteklidegil=true"
      );
      let server = client.guilds.cache.get(sunucuID2) || "nope";
      let sunucu_pre_roller = await mongo_planss.find({ sunucuID: SecilenServerID });
      let sunucu_roller = server.roles.cache;
      let sunucu_kanallar = server.channels.cache;
      ////console.log(servers);
      res.render("dashboard/pages/server/settings", {
        user: req.user,
        k_verileri,
        sunucu,
        sunucu_roller,
        sunucu_kanallar,
        sunucu_pre_roller,
      });
    });
    /////Plan Oluştur/////
    app.post("/create/plan", checkAuth, checkBanned, async (req, res) => {
      //console.log(req.body);
      if(isNaN(req.body.yillik)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.aylik)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.genel_thx_kanal_id)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.log_kanal_id)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.rol_id)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.server_id)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.yillik < 2) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.yillik > 2000) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.aylik < 2) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.aylik > 2000) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      let server = client.guilds.cache.get(req.body.server_id) || "nope";
      if(server === "nope") return res.redirect("/dashboard/?boteklidegil=true");
      let rol_kontrol = server.roles.cache.get(req.body.rol_id) || "nope";
      if(rol_kontrol === "nope") return res.redirect("/dashboard/?rolu-bulamıyorum=true");
      let log_kanali_kontrol = server.channels.cache.get(req.body.log_kanal_id) || "nope";
      if(log_kanali_kontrol === "nope") return res.redirect("/dashboard/?kanali-bulamıyorum=true");
      let genel_kanali_kontrol = server.channels.cache.get(req.body.genel_thx_kanal_id) || "nope";
      if(genel_kanali_kontrol === "nope") return res.redirect("/dashboard/?kanali-bulamıyorum=true");
      ////Botun Yetkisini Kontrol Etme
      let guild = client.guilds.cache.get(req.body.server_id);
      let member = guild.members.cache.get(config.bot.id)
      if (!member.hasPermission("ADMINISTRATOR")) return res.redirect("/dashboard/?yonetici-iznim-yok=true");
      ////Botun Yetkisini Kontrol Etme
      ///Sunucu Sahibi Kontrol Son Kez
      let sunucu_sahibi_misin = guild.ownerID;
      if(!Number(sunucu_sahibi_misin) == Number(req.user.id)) return res.redirect("/dashboard/?bu-sunucunun-sahibi-degilsin=true");
      ///Sunucu Sahibi Kontrol Son Kez
      let k_bul_sayisi = await mongo_planss.find({ sunucuSahibiID: req.user.id, sunucuID: req.body.server_id });
      if(k_bul_sayisi.length > 3) return res.redirect("/dashboard?plan-ekleme-sinirina-ulastin=true");
      let güncelTarihlazim = moment().format("YYYY-MM-DD HH:mm:ss");
      new mongo_planss({
        sunucuID: req.body.server_id, //Sunucu ID
        sunucuSahibiID: req.user.id, //Sunucu Sahibi ID
        onay_durumu: "Bekliyor", //Bekliyor, Onaylandi, Onaylanmadi
        plani_alan_kisi_toplam: "0", //Toplam Planı Satın Alan Kişi Sayısı
        olusturulma_tarihi: güncelTarihlazim, //Oluşturulma Tarihi
        son_satis_tarihi: güncelTarihlazim, //Son Satış Tarihi
        plan_adi: req.body.plan_name, //Planın Adı
        plan_desc: req.body.plan_aciklama, //Plan Açıklama
        yillik: req.body.yillik, //Yillik Fiyat
        aylik: req.body.aylik, //Aylik Fiyat
        plan_img: req.body.plan_img, //Plan Resmi
        thx_dm_msg: req.body.thx_msg_dm, //Dm Teşekkür Mesajı
        thx_genel_msg: req.body.thx_msg_genel, //Teşekkür Mesajı Genel
        genel_thx_msg_channel_id: req.body.genel_thx_kanal_id, //Genel Teşekkür Mesajı Kanal ID
        log_channel_id: req.body.log_kanal_id, //Log Kanalı ID
        rol_id: req.body.rol_id, //Verilecek Rol ID
        ozellik_1: req.body.rol_ozellik_1, //Rol Özellik 1
        ozellik_2: req.body.rol_ozellik_2, //Rol Özellik 2
        ozellik_3: req.body.rol_ozellik_3, //Rol Özellik 3
      }).save().then(async () => {
         await basvuru_bilgilendirme(req, client);
      });
      //////
      //////
       const yeni_plan = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Hermosa Payments & " + guild.name + " | Yeni Plan \n ")
          .setThumbnail(req.body.plan_img)
          .addField(`Plan Adı`,`${req.body.plan_name}`, true)
          .addField(`Yıllık Fiyatı`,`${req.body.yillik}`, true)
          .addField(`Aylık Fiyatı`,`${req.body.aylik}`, true)
          .addField(`Not:`,`Plan'ın Hermosa Payments Yetkilileri Tarafından Onaylanması Gerekli Kontrol İçin Yakında Sunucunuz'a Gelecekler!`)
          .addField(`Diğer Detaylar`,`Kalan Tüm Detaylara Site Üzerinden Ulaşabilirsiniz!`)
          .addField(`Tavsiye`,`Planın Satılma Oranını Artırmak İstiyor İseniz Duyuru Atmanız Önerilir. \n Bizi Tercih Ettiğiniz İçin Teşekkür Ederiz! \n Hermosa Payments Bycan.`)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
      client.channels.cache.get(req.body.log_kanal_id).send({ embeds: [yeni_plan] }).catch(async () => { console.log("Kanalı Bulamadım") });
      //////Admin Log
      const yeni_plan_admin = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Hermosa Payments & " + guild.name + " | Yeni Plan \n ")
          .setThumbnail(req.body.plan_img)
          .addField(`Sunucu ID`,`${guild.name}`, true)
          .addField(`Oluşturan ID`,`${req.user.id}`, true)
          .addField(`Plan Adı`,`${req.body.plan_name}`, true)
          .addField(`Yıllık Fiyatı`,`${req.body.yillik}`, true)
          .addField(`Aylık Fiyatı`,`${req.body.aylik}`, true)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
      client.channels.cache.get("990201273527726094").send({ embeds: [yeni_plan_admin] }).catch(async () => { console.log("Kanalı Bulamadım") });
      ////////////////////////////////////
      async function basvuru_bilgilendirme(req, client) {
      let girilen_basvuru_id_dbb = await mongo_planss.findOne({ sunucuID: req.body.server_id, sunucuSahibiID: req.user.id, onay_durumu: "Bekliyor", rol_id: req.body.rol_id, log_channel_id: req.body.log_kanal_id });
      //console.log(girilen_basvuru_id_dbb)
      ////Admin Log
      const yeni_plan_basvuru = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Hermosa Payments & " + guild.name + " | Yeni Plan Başvuru\n ")
          .setThumbnail(req.body.plan_img)
          .addField(`Sunucu ID`,`${guild.name}`, true)
          .addField(`Basvuru ID`,`${girilen_basvuru_id_dbb._id}`, true)
          .addField(`Oluşturan ID`,`${req.user.id}`, true)
          .addField(`Plan Adı`,`${req.body.plan_name}`, true)
          .addField(`Yıllık Fiyatı`,`${req.body.yillik}`, true)
          .addField(`Aylık Fiyatı`,`${req.body.aylik}`, true)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
      client.channels.cache.get("990201273527726094").send({ embeds: [yeni_plan_basvuru] }).catch(async () => { console.log("Kanalı Bulamadım") });
      client.channels.cache.get("990201273527726094").send({ content: `${girilen_basvuru_id_dbb._id}` }).catch(async () => { console.log("Kanalı Bulamadım") });
      ///////////
      client.channels.cache.get(req.body.log_kanal_id).send({ content: `/basvuru_durumu ${girilen_basvuru_id_dbb._id}` }).catch(async () => { console.log("Kanalı Bulamadım") });
      ///////////
      }
      /////////////
      res.redirect("/dashboard?plan-olusturuldu=true")
    });
    ///Role Settings
     app.get("/role/settings/:ServerID/:PlanID", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let SecilenServerID = req.params.ServerID;
      let planID = req.params.PlanID;
      let sunucu_pre_ayar = await mongo_planss.findOne({ sunucuID: SecilenServerID, _id: planID }) || "NaN";
      if(sunucu_pre_ayar === "NaN") return res.redirect("/dashboard?boyle-bir-plan-yok=true");
      sunucu_pre_ayar = await mongo_planss.find({ sunucuID: SecilenServerID, _id: planID }) || "NaN"; //Elleme Gerekli
      let servers = req.user.guilds;
      let sunucu = [];
      let dogrula = "false";
      let sunucuID2;
      let server_sayisi = servers.length;
      for (i = 0; i < server_sayisi; i++) {
        if (servers[i].owner == true) {
          if (Number(SecilenServerID) == Number(servers[i].id)) {
            ////console.log("c");
            let sunucuID = servers[i].id;
            sunucuID2 = servers[i].id;
            let server = client.guilds.cache.get(sunucuID) || "nope";
            if (server === "nope") {
              return res.redirect(
                "/server/settings/" + SecilenServerID + "/?boteklidegil=true"
              );
            } else {
              sunucu.push(server);
              dogrula = "true";
            }
          } else {
          }
        } else {
        }
      }
      if(dogrula === "false") return res.redirect(
        "/server/settings/" + SecilenServerID + "/?boteklidegil=true"
      );
      let server = client.guilds.cache.get(sunucuID2) || "nope";
      let sunucu_roller = server.roles.cache;
      let sunucu_kanallar = server.channels.cache;
      res.render("dashboard/pages/server/role-settings", {
        user: req.user,
        k_verileri,
        sunucu,
        sunucu_roller,
        sunucu_kanallar,
        sunucu_pre_ayar,
      });
    });
    ////Rol Edit
     app.post("/role/settings/:ServerID/:PlanID", checkAuth, checkBanned, async (req, res) => {
      let planID = req.params.PlanID;
      if(isNaN(req.body.plan_yillik)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.plan_aylik)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.genel_thx_kanal_id)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.body.log_kanal_id)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(isNaN(req.params.ServerID)) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.plan_yillik < 2) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.plan_yillik > 2000) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.plan_aylik < 2) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      if(req.body.plan_aylik > 2000) return res.redirect("/dashboard?ayarlar-ile-oynama=true");
      let server = client.guilds.cache.get(req.params.ServerID) || "nope";
      if(server === "nope") return res.redirect("/dashboard/?boteklidegil=true");
      let log_kanali_kontrol = server.channels.cache.get(req.body.log_kanal_id) || "nope";
      if(log_kanali_kontrol === "nope") return res.redirect("/dashboard/?kanali-bulamıyorum=true");
      let genel_kanali_kontrol = server.channels.cache.get(req.body.genel_thx_kanal_id) || "nope";
      if(genel_kanali_kontrol === "nope") return res.redirect("/dashboard/?kanali-bulamıyorum=true");
      ////Botun Yetkisini Kontrol Etme
      let guild = client.guilds.cache.get(req.params.ServerID);
      let member = guild.members.cache.get(config.bot.id)
      if (!member.hasPermission("ADMINISTRATOR")) return res.redirect("/dashboard/?yonetici-iznim-yok=true");
      ////Botun Yetkisini Kontrol Etme
      ///Sunucu Sahibi Kontrol Son Kez
      let sunucu_sahibi_misin = guild.ownerID;
      if(!Number(sunucu_sahibi_misin) == Number(req.user.id)) return res.redirect("/dashboard/?bu-sunucunun-sahibi-degilsin=true");
      ///Sunucu Sahibi Kontrol Son Kez
      let güncelTarihlazim = moment().format("YYYY-MM-DD HH:mm:ss");
      await mongo_planss.findOneAndUpdate({ _id: planID },{
          $set: {
            sunucuSahibiID: guild.ownerID, //Sunucu Sahibi ID
            plan_adi: req.body.plan_name, //Planın Adı
            plan_desc: req.body.plan_des, //Plan Açıklama
            yillik: req.body.plan_yillik, //Yillik Fiyat
            aylik: req.body.plan_aylik, //Aylik Fiyat
            plan_img: req.body.plan_resmi, //Plan Resmi
            thx_dm_msg: req.body.plan_thx_dm_msg, //Dm Teşekkür Mesajı
            thx_genel_msg: req.body.plan_thx_genel_msg, //Teşekkür Mesajı Genel
            genel_thx_msg_channel_id: req.body.genel_thx_kanal_id, //Genel Teşekkür Mesajı Kanal ID
            log_channel_id: req.body.log_kanal_id, //Log Kanalı ID
            ozellik_1: req.body.plan_ozellik1, //Rol Özellik 1
            ozellik_2: req.body.plan_ozellik2, //Rol Özellik 2
            ozellik_3: req.body.plan_ozellik3, //Rol Özellik 3
          },
        }, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
      })
       const plan_edit = new MessageEmbed()
          .setColor("#800080")
          .setTitle("Hermosa Payments & " + guild.name + " | Plan Düzenleme \n ")
          .setThumbnail(req.body.plan_resmi)
          .addField(`Plan Adı`,`${req.body.plan_name}`, true)
          .addField(`Yıllık Fiyatı`,`${req.body.plan_yillik}`, true)
          .addField(`Aylık Fiyatı`,`${req.body.plan_aylik}`, true)
          .addField(`Diğer Detaylar`,`Kalan Tüm Detaylara Site Üzerinden Ulaşabilirsiniz!`)
          .addField(`Tavsiye`,`Planın Satılma Oranını Artırmak İstiyor İseniz Duyuru Atmanız Önerilir. \n Bizi Tercih Ettiğiniz İçin Teşekkür Ederiz! \n Hermosa Payments Bycan.`)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
      client.channels.cache.get(req.body.log_kanal_id).send({ embeds: [plan_edit] }).catch(async () => { console.log("Kanalı Bulamadım") });
      res.redirect("?plan-duzenlendi=true")
    });
    ///subscribe pre
    app.get("/subscribe-pre", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let servers = req.user.guilds;
      let sunucular_pre_olan = [];
      let sunucular_sahibi_oldugu_pre_olamayan = [];
      let sunucular_pre_olamayan = [];
      let server_sayisi = servers.length;
      ////Mi Hermosa ByCan
       for (i = 0; i < server_sayisi; i++) {
        let sunucuID = servers[i].id;
        sunucuID2 = servers[i].id;
        let server = client.guilds.cache.get(sunucuID) || "nope";
        let sunucumuz = await mongo_planss.findOne({ sunucuID: servers[i].id, onay_durumu: "Onaylandi" }) || "NaN"; //Planı Bul
        if(server === "nope") sunucumuz = "NaN"; //Plan Var Ama Bot Sunucuda Ekli Değil İse
        if(sunucumuz === "NaN"){
          if(servers[i].owner == true){
            sunucular_sahibi_oldugu_pre_olamayan.push(servers[i]);
          } else {
            sunucular_pre_olamayan.push(servers[i]);
          }
        } else {
          sunucular_pre_olan.push(servers[i]);
        }
      }
      ////Mi Hermosa ByCan
      res.render("dashboard/pages/subscribe/subscribe-pre", {
        user: req.user,
        k_verileri,
        sunucular_pre_olamayan,
        sunucular_sahibi_oldugu_pre_olamayan,
        sunucular_pre_olan,
      });
    });
    ///sunucuya abone ol planlar
    app.get("/subscribe-pre/server/:SunucuID", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      ////Mi Hermosa ByCan
      let sunucuIDGelen = req.params.SunucuID;
      let server = client.guilds.cache.get(sunucuIDGelen) || "nope";
      let sunucumuz = await mongo_planss.findOne({ sunucuID: sunucuIDGelen, onay_durumu: "Onaylandi"}) || "NaN"; //Planı Bul
      if(server === "nope") sunucumuz = "NaN"; //Plan Var Ama Bot Sunucuda Ekli Değil İse
      if(sunucumuz === "NaN") return res.redirect("/dashboard?bot-sunucuda-ekli-degil=true")
      let planss = await mongo_planss.find({ sunucuID: sunucuIDGelen, onay_durumu: "Onaylandi" }) || "NaN"; //Planları Bul
      ////Mi Hermosa ByCan
      res.render("dashboard/pages/subscribe/plans", {
        user: req.user,
        k_verileri,
        planss,
        server,
      });
    });
    ///sunucuya abone ol plan fiyatı aylık yıllık
    app.get("/subscribe-pre/server/:SunucuID/role/:RolID", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      ////Mi Hermosa ByCan
      let sunucuIDGelen = req.params.SunucuID;
      let mongo_ID = req.params.RolID;
      let server = client.guilds.cache.get(sunucuIDGelen) || "nope";
      let sunucumuzz = await mongo_planss.findOne({ sunucuID: sunucuIDGelen, _id: mongo_ID, onay_durumu: "Onaylandi" }) || "NaN"; //Planı Bul
      if(server === "nope") sunucumuzz = "NaN"; //Plan Var Ama Bot Sunucuda Ekli Değil İse
      if(sunucumuzz === "NaN") return res.redirect("/dashboard?bot-sunucuda-ekli-degil=true")
      let sunucumuz = await mongo_planss.find({ sunucuID: sunucuIDGelen, _id: mongo_ID, onay_durumu: "Onaylandi" }) || "NaN"; //Planı Bul
      ////Mi Hermosa ByCan
      res.render("dashboard/pages/subscribe/plan-pricing", {
        user: req.user,
        k_verileri,
        sunucumuz,
        server,
      });
    });
    ///sunucuya abone ol onay
    app.post("/bakiye/onay/:key", checkAuth, checkBanned, async (req, res) => {
      let onay_koduu = onay_kodu_icin_sayi(6);
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let fiyat_listesi = await mongo_planss.find({ _id: req.params.key });
      ///
      let ikinci_güvenlik_key = crypto(16);
      let kullanici_id = req.user.id;
      let urun_id = req.params.key;
      ///
      //console.log(req.body.customOptionsCheckableRadios);
      let plan_suresi = "NaN";
      if(req.body.customOptionsCheckableRadios === "yillik") plan_suresi = "Yillik";
      if(req.body.customOptionsCheckableRadios === "aylik") plan_suresi = "Aylik";
      ///
      let planin_fiyati = "NaN";
      if(plan_suresi === "Yillik") planin_fiyati = fiyat_listesi[0].yillik;
      if(plan_suresi === "Aylik") planin_fiyati = fiyat_listesi[0].aylik;
      ///
      if(Number(k_verileri[0].bakiye) >= Number(planin_fiyati)){
        let alici = await client.users.fetch(req.user.id).catch(() => null);
        if (!alici) return log("Kullanıcıyı Bulamadım");
        const onay_kodu = new MessageEmbed()
          .setColor("GREEN")
          .setTitle("Hermosa Payments | HPAPS")
          .addField("Uyarı", "Lütfen Bu Kodu Her Hangi Bir Kullanıcı İle Paylaşmayın. Eğer Bir Kişi Sizden Bunu Yapmanızı İstiyor İse Yetkili Ekibe Bildiriniz.")
          .addField("Almak Üzere Olduğunuz Plan", `${fiyat_listesi[0].plan_adi}`)
          .addField("Sunucu", `${fiyat_listesi[0].sunucuID}`)
          .addField("Plan Süresi", `${plan_suresi}`)
          .addField("Onay Kodu", `||${onay_koduu}||`)
          .setTimestamp()
          .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
        await alici.send({ embeds: [onay_kodu] }).then(async function (message) {})
          .catch(async () => {
            log(req.user.id + " Kullanıcının DM'si Açık Değil");
          });
          //VeriTabanı
          let anliktarih = moment().format("YYYY-MM-DD HH:mm:ss");
          new mongo_hermosa_onay_kodu({
            userID: kullanici_id, //Kullanıcı ID
            onay_kodu: onay_koduu, //Gönderilmiş 6 Haneli Onay Kodu
            alinacak_sure: req.body.customOptionsCheckableRadios, //Alinacak Süre
            guvenlik_keyi: ikinci_güvenlik_key, //İkinci Güvenlik Keyi
            key: urun_id, //Ürünün Keyi
            tarih: anliktarih,
          }).save();

        res.redirect("/bakiye/onayla/"+ kullanici_id + "/" + req.body.customOptionsCheckableRadios + "/" + ikinci_güvenlik_key + "/" + urun_id);
      } else{
        res.redirect("/dashboard?yerersizbakiye=true");
      }
    });
    ////Bakiye Onay
     app.get("/bakiye/onayla/:kullaniciID/:plan_suresi/:ikinci_key/:urunID", checkAuth, checkBanned, async (req, res) => {
      let kullaniciID = req.params.kullaniciID;
      let ikinci_key = req.params.ikinci_key;
      let urunID = req.params.urunID;
      res.render("dashboard/pages/subscribe/pricing-onay", {
        user: req.user,
        kullaniciID,
        ikinci_key,
        urunID,
      });
    });
        //Onay
    app.post("/bakiye/onayla/:ikinci_key/:urunID", checkAuth, checkBanned, async (req, res) => {
      ////console.log(req.body)
      let onaykodu = req.body.key_1 + req.body.key_2 + req.body.key_3 + req.body.key_4 + req.body.key_5 + req.body.key_6;
      let kullanici_verileri = await mongo_hesaps.findOne({ userID: req.user.id });
      let k_verileri = await mongo_hermosa_onay_kodu.findOne({ userID: req.user.id, onay_kodu: onaykodu }) || "NaN";
      if(k_verileri === "NaN") {
        //console.log("Geçersiz Onay Kodu")
        res.redirect("/dashboard?gecersizonaykodu=true")
      } else {
        let fiyat_listesi = await mongo_planss.find({ _id: k_verileri.key });
        let Kesilecek_tutar = "NaN";
        if(k_verileri.alinacak_sure === "aylik") Kesilecek_tutar = fiyat_listesi[0].aylik;
        if(k_verileri.alinacak_sure === "yillik") Kesilecek_tutar = fiyat_listesi[0].yillik;
        //hangi planda
        let hangi_plan = fiyat_listesi[0].plan_adi;
        ///Aylik
        var bugunden_bir_cikar = moment().add(1, "months");
        let son_kullanim_aylik = bugunden_bir_cikar.format("YYYY-MM-DD");
        ///Yıllık
        var x = new Date();
        x.setFullYear(x.getFullYear() + 1);
        var mm_yillik = String(x.getMonth() + 2).padStart(2, "0");
        var dd_yillik = x.getDate();
        var yy_yillik = x.getFullYear();
        let son_kullanim_yillik = yy_yillik + "-" + mm_yillik + "-" + dd_yillik;
        ///Son Kullanım Tarihi
        let son_kullanim_tarihi = "NaN";
        if(k_verileri.alinacak_sure === "aylik") son_kullanim_tarihi = son_kullanim_aylik;
        if(k_verileri.alinacak_sure === "yillik") son_kullanim_tarihi = son_kullanim_yillik;
        ///
        ///
        let güncelTarih = moment().format("YYYY-MM-DD HH:mm:ss");
        var yeni_bakiye = Number(kullanici_verileri.bakiye) - Number(Kesilecek_tutar);
        ///Bakiye Kontrolü
        //console.log(kullanici_verileri.bakiye);
        //console.log(Kesilecek_tutar);
        if(Number(kullanici_verileri.bakiye) >= Number(Kesilecek_tutar)) {
          //Rol verme
          let rolver = client.guilds.cache.get(fiyat_listesi[0].sunucuID);
          rolver.members.cache.get(req.user.id).roles.add(fiyat_listesi[0].rol_id).then(async () => {
            yetkim_yeterli(res, req, rolver, fiyat_listesi, son_kullanim_tarihi);
          }).catch(async () => {
            yetersiz_yetkim_sad(res);
          });
          ///////
          async function yetersiz_yetkim_sad(res) {
            let sunucu_sahibi = await client.users.fetch(rolver.ownerID).catch(() => null);
            if (!sunucu_sahibi) return log("Kullanıcıyı Bulamadım");
            const yeterli_yetkim_yko = new MessageEmbed()
              .setColor("RED")
              .setTitle("Hermosa Payments | " + rolver.name)
              .setURL(config.dashboard.url)
              .setDescription("Hey Selam!\n Görüşe Göre Sunucuda Yeterli Yetkim Yok.\n Lütfen Rolümü Vereceğim Rolün Üstüne Çekiniz!\n Eğer Yetkim Yetersiz İse Yetkimi Yükseltiniz. \n\n Not: Bu Uyarı Bir Kullanıcı Plan Almaya Çalıştığı Zaman Botun Yetkisi Yetersiz Olur İse Gelir.")
              .setTimestamp()
              .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
            await sunucu_sahibi.send({ embeds: [yeterli_yetkim_yko] }).then(async function (message) {})
              .catch(async () => {
                //console.log(" Kullanıcının DM'si Açık Değil");
            });
            //console.log("Yeterli Yetkim Yok!");
            res.redirect("/dashboard?yetkimyok=true");
          }
          //////////////////
          async function yetkim_yeterli(res, req, rolver, fiyat_listesi, son_kullanim_tarihi) {
            
            var ip = req.headers["cf-connecting-ip"];
            ///////
            let güncel_Tarih = moment().format("YYYY-MM-DD HH:mm:ss");
            new mongo_satin_alinmis_plans({
              sunucuID: fiyat_listesi[0].sunucuID, //Sunucu ID
              alan_kisi_ID: req.user.id, //Satın Alan Kisi ID
              alinan_plan_rol_id: fiyat_listesi[0].rol_id, //Alınan Plan Rol ID
              alinan_plan_mongoDB_ID: fiyat_listesi[0]._id, //Alınan Plan Mongo DB ID
              gonderilmis_bildirim_sayisi: "0", //Gönderilmiş Bildirim Sayısı Örn: son 3 gün kala bildirim gittiyse 1 olacak sayısı son 1 gün kala gittiyse 2 olacak
              aldigi_tarih: güncel_Tarih, //Satın Aldığı Tarih
              son_kullanim: son_kullanim_tarihi, //Son Kullanım Tarihi
            }).save();

            /////////////////////////////////////////////
            let yuzde_kac = "10";
            var yuzde = (Number(Kesilecek_tutar) * Number(yuzde_kac) / 100);
            ////console.log("Yuzde: " + yuzde);
            var sonuc = Number(Kesilecek_tutar) - Number(yuzde);
            var sunucu_sahibine_gidecek_miktar = Number(sonuc).toFixed(0);
            var siteye_kalacak_para = Number(Kesilecek_tutar) - Number(sunucu_sahibine_gidecek_miktar);
            ////console.log("Küsratlı Sonuç: " + sunucu_sahibine_gidecek_miktar);
            //console.log("Küsüratsız sonuc: " + sunucu_sahibine_gidecek_miktar);
            //console.log("Sisteme Kalacak Para: " + siteye_kalacak_para);
            /////////////////////////////////////////////

            await mongo_hesaps.findOneAndUpdate({ userID: req.user.id },{
                $set: {
                  bakiye: yeni_bakiye,
                  ip: ip,
                },
              }, {
              new: true,
              upsert: true,
              rawResult: true // Return the raw result from the MongoDB driver
            })
            ///
            ////console.log(rolver.ownerID);
            let kullanici_verileri_sunucu_sahibi = await mongo_hesaps.findOne({ userID: rolver.ownerID });
            ////console.log(kullanici_verileri_sunucu_sahibi.bakiye);
            var yeni_bakiye_sunucu_sahibi = Number(kullanici_verileri_sunucu_sahibi.bakiye) + Number(sunucu_sahibine_gidecek_miktar);
            ////console.log(sunucu_sahibine_gidecek_miktar);
            await mongo_hesaps.findOneAndUpdate({ userID: rolver.ownerID },{
                $set: {
                  bakiye: yeni_bakiye_sunucu_sahibi,
                },
              }, {
              new: true,
              upsert: true,
              rawResult: true // Return the raw result from the MongoDB driver
            })
            ///
            let sistem_hesabi = "445142958447263747";
            let kullanici_verileri_sistem = await mongo_hesaps.findOne({ userID: sistem_hesabi });
            var yeni_bakiye_sistem = Number(kullanici_verileri_sistem.bakiye) + Number(siteye_kalacak_para);
            await mongo_hesaps.findOneAndUpdate({ userID: sistem_hesabi },{
                $set: {
                  bakiye: yeni_bakiye_sistem,
                },
              }, {
              new: true,
              upsert: true,
              rawResult: true // Return the raw result from the MongoDB driver
            })
            ///
            var yeni_satin_alan_kisi_toplam = Number(fiyat_listesi[0].plani_alan_kisi_toplam) + 1;
            await mongo_planss.findOneAndUpdate({ _id: k_verileri.key },{
                $set: {
                  son_satis_tarihi: güncelTarih,
                  plani_alan_kisi_toplam: yeni_satin_alan_kisi_toplam,
                },
              }, {
              new: true,
              upsert: true,
              rawResult: true // Return the raw result from the MongoDB driver
            })
            //
            let alici = await client.users.fetch(req.user.id).catch(() => null);
            if (!alici) return log("Kullanıcıyı Bulamadım");
            const thx_msg_dm_iste = new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Hermosa Payments | " + rolver.name)
              .setURL(config.dashboard.url)
              .setDescription(fiyat_listesi[0].thx_dm_msg)
              .setTimestamp()
              .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
            await alici.send({ embeds: [thx_msg_dm_iste] }).then(async function (message) {})
              .catch(async () => {
                //console.log(req.user.id + " Kullanıcının DM'si Açık Değil");
            });
            /////
            const plan_alindi_logs = new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Hermosa Payments | " + rolver.name + " - Plan Alındı ")
              .addField(`Planı Satın Alan ID`,`${req.user.id}`)
              .addField(`Satın Aldığı Plan`,`${hangi_plan}`)
              .addField(`Planın Süresi`,`${k_verileri.alinacak_sure}`)
              .addField(`Son Kullanım Tarihi`,`${son_kullanim_tarihi}`)
              .setTimestamp()
              .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
            client.channels.cache.get(fiyat_listesi[0].log_channel_id).send({ embeds: [plan_alindi_logs] }).catch(async () => { console.log("Kanalı Bulamadım") });
            ////
            const plan_alindi_genel = new MessageEmbed()
              .setColor("GREEN")
              .setTitle("Hermosa Payments | " + rolver.name)
              .setDescription(`Hey, ${req.user.username}! \n ${fiyat_listesi[0].thx_genel_msg}`)
              .setTimestamp()
              .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
            client.channels.cache.get(fiyat_listesi[0].genel_thx_msg_channel_id).send({ embeds: [plan_alindi_genel] }).catch(async () => { console.log("Kanalı Bulamadım") });
            ////
             //////////////////////////////////////////////////////
            const plan_satin_aldi_oley = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Hermosa Payments | " + rolver.name + " - Bildirim \n ")
                .addField(`Planı Satın Alan ID`,`${req.user.id}`)
                .addField(`Satın Aldığı Plan`,`${hangi_plan}`)
                .addField(`Planın Süresi`,`${k_verileri.alinacak_sure}`)
                .addField(`Son Kullanım Tarihi`,`${son_kullanim_tarihi}`)
                .addField(`Harcanan Bakiye`,`${Kesilecek_tutar}`)
                .addField(`Sunucu Sahibine Kalan Pay`,`${sunucu_sahibine_gidecek_miktar}`)
                .addField(`Sunucu Sahibi Toplam Bakiye`,`${yeni_bakiye_sunucu_sahibi}`)
                .addField(`Sisteme Kalan Pay`,`${siteye_kalacak_para}`)
                .addField(`Sisteme Toplam`,`${yeni_bakiye_sistem}`)
                .setTimestamp()
                .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
            client.channels.cache.get("990201273527726094").send({ embeds: [plan_satin_aldi_oley] }).catch(async () => { console.log("Kanalı Bulamadım") });
            //////////////////////////////////////////////////////

            await mongo_hermosa_onay_kodu.deleteOne({ userID: req.user.id, onay_kodu: k_verileri.onay_kodu});
              res.redirect("/dashboard?thxx=true");
          }
          //////////////////
        } else {
          res.redirect("/dashboard?yerersizbakiye=true");
        }
        ///
      }
    });
    ///////////Settings
    app.get("/settings", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      res.render("dashboard/pages/settings", {
        user: req.user,
        k_veriler: k_verileri,
      });
    });

    app.post("/settings", checkAuth, checkBanned, async (req, res) => {
      await mongo_hesaps.findOneAndUpdate({ userID: req.user.id }, {
      $set: {
          adi: req.body.firstName,
          soy_adi: req.body.lastName,
          adresi: req.body.address,
          telefon: req.body.phoneNumber,
          mail: req.body.email,
          para_birimi: req.body.currency,
      }
      }, {
          new: true,
          upsert: true,
          rawResult: true // Return the raw result from the MongoDB driver
      })
      res.redirect("/settings");
    });
    
    ///Bakiye Yükle///
    app.get("/bakiye", checkAuth, checkBanned, async (req, res) => {
        let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
        res.render("dashboard/pages/bakiye-yatir", {
          user: req.user,
          k_veriler: k_verileri,
        });
    });
    ///Ödeme Başarılı///
    app.get("/payment/success", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      res.render("dashboard/pages/odeme/success", {
        user: req.user,
        k_veriler: k_verileri,
      });
    });
    ///Ödeme Başarısız///
    app.get("/payment/fail", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      res.render("dashboard/pages/odeme/fail", {
        user: req.user,
        k_veriler: k_verileri,
      });
    });
    /////
    app.get("/terms-of-service", async (req, res) => {
      res.render("policy", {
      });
    });
    ////
    app.get("/privacy-policy", async (req, res) => {
      res.redirect("/terms-of-service");
    });
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    app.post('/paymax/odeme', checkAuth, checkBanned, async (req, res) => {
    if(Number(req.body.Amount) < 5) return res.redirect("/balance_load?error_type=true&error=true&message=Minimum 5 TL");
        if(req.body.name === "" || req.body.surname === "" || req.body.email === "" || req.body.phonenumber === "") return res.redirect("/balance_load?error_type=true&error=true&message=Lütfen tüm alanları doldurunuz.");
        var data = new FormData();
        let retrunKey = crypto(24);
        let gelen_hash = "";
        let hash = await axios.get(`https://remorsefultemptingDigits.fevehex882.repl.co/?id=${retrunKey}&ucret=${Number(req.body.Amount)}`).then(async (response) => {
            gelen_hash = response.data;
        }).catch();
        let ip_adress = req.headers['cf-connecting-ip'];
        let request_data = {
            userName: "caner_api",
            password: "297ee5711a13dddbb1ddfeee3932ffeea12852b6",
            shopCode: "1340",
            productName: "Bakiye Yükleme - " + req.body.Amount + ".00 TL",
            productData: "dd",
            productType: "DIJITAL_URUN",
            productsTotalPrice: Number(req.body.Amount),
            orderPrice: Number(req.body.Amount),
            currency: "TRY",
            orderId: retrunKey,
            locale: "tr",
            conversationId: retrunKey,
            buyerName: req.body.name,
            buyerSurName: req.body.surname,
            buyerGsmNo: req.body.phonenumber,
            buyerIp: ip_adress || "185.107.132.175",
            buyerMail: req.body.email,
            buyerAdress: req.body.address || "Bilinmiyor",
            callbackOkUrl: "https://hermosa-pay.xyz/payment/success",
            callbackFailUrl: "https://hermosa-pay.xyz/payment/fail",
            hash: gelen_hash
        };
        let anliktarih = moment().format("YYYY-MM-DD HH:mm:ss");
        new mongo_para_yatirma({
          userID: req.user.id, //Yatıracak Kisi ID
          key: retrunKey, //İşlem tamamlandığında size gönderilecek veri, Number veya String olabilir
          miktar: Number(req.body.Amount), //Yatıracağı Miktar
          banka: "paylith", //wise ininal papara payeer shipy
          para_birimi: req.body.currency, // Ödeme yapılacak para birimi. (TRY, EUR, USD, GBP)
          tarih: anliktarih, //Tarih
        }).save();

        axios.post(
            "https://apiv1.paymax.com.tr/api/create-payment-link",
            querystring.stringify(request_data),
            {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Referer: "hermosa-pay.xyz",
            },
            }).then(function (response) {
            if (response.data.status == "success" && response.data.payment_page_url) {
            let odeme_link = response.data.payment_page_url;
            res.redirect(odeme_link);
            console.log(odeme_link);
            } else {
            console.log("Ödeme linki üretilirken bir sorun oluştu");
            console.log(response.data);
            res.redirect("/balance_load?error_type=true&error=true&message=Ödeme linki üretilirken bir sorun oluştu. Detaylar" + response.data);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    ///VeriTabanı İşlemleri
    });


     app.post('/callback/paymax', async (req, res) => {
        let conversationId = req.body.conversationId;
        let paymentAmount = req.body.paymentAmount;
        let paymentStatus = req.body.paymentStatus;
        if(req.body.status === "error") return;
        if(paymentStatus === "paymentOk"){
            let siparis = await mongo_para_yatirma.findOne({ key: conversationId });
            if(!siparis) return;
            let kullanici = await mongo_hesaps.findOne({ userID: siparis.userID });
            if(!kullanici) return;
            new mongo_hermosa_para_yuklemelerim({
              userID: req.user.id, //Kullanıcının ID si
              yuklenen_miktar: req.body.paymentAmount, //Yüklenen Miktar
              gelen_islem_id: req.body.orderId, //İşlem ID
              tarih: moment().format("YYYY-MM-DD HH:mm:ss"), //Oluşturulma Tarih
            }).save();
             admin_para_yatirildi.send({ content: `${kullanici._id} ' ID li kullanıcı bakiye yükledi. miktar ${paymentAmount} <@445142958447263747>  SMM PANEL` });
             var yeni_bakiye = Number(kullanici.bakiye) + Number(paymentAmount);
            await mongo_hesaps.findOneAndUpdate({ userID: kullanici.userID }, { 
            $set: {
                bakiye: yeni_bakiye
            }});
            await mongo_para_yatirma.deleteOne({ key: conversationId });
            res.send("OK");
        } else {
            
        }
    });

    
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    ///////////////////////////////////////////////ÖDEME SHİPY///////////////////////////////////////////////
    app.get("/para-cek", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      ////console.log(servers);
      res.render("dashboard/pages/para-cek", {
        user: req.user,
        k_verileri,
      });
    });
    app.post("/para-cek", async (req, res) => {
      const kullanici = await mongo_hermosa_para_cekme_talebi.find({ userID: req.user.id, durumu: "bekliyor" });
      if(Number(kullanici.length) >= 1) return res.redirect("/para-cek?error=true");
      let k_verileri = await mongo_hesaps.findOne({ userID: req.user.id });
      //Bakiyesi 50 den aşağıda ise
      if (Number(k_verileri.bakiye) < 50) return res.redirect("/para-cek?error=true");
      ///
      let anliktarih = moment().format("YYYY-MM-DD HH:mm:ss");
      new mongo_hermosa_para_cekme_talebi({
        userID: req.user.id, //Kullanıcının ID si
        adi: req.body.adi, //Kullanıcının Adı
        soy_adi: req.body.soy_adii, //Kullanıcının Soy Adı
        tel_no: req.body.tel_no, //Tel No
        ininal_numarası: req.body.ininal_numarası, //İninal Numarası
        eknot: req.body.eknot, //Kullanıcının Ek Notu
        tarih: anliktarih, //Oluşturulma Tarihi
        durumu: "bekliyor", //odendi odenmedi bekliyor
        odenme_tarihi: "bekliyor", //Ödenme Tarihi
        odenmis_tutar: "bekliyor", //Ödenmiş Tutar
      }).save();
      ////////////////////////////
      const para_cekme = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Hermosa Payments & Para Çekme Talebi\n ")
        .addField(`Kullanıcı ID`,`${req.user.id}`, true)
        .addField(`Adı`,`${req.body.adi}`, true)
        .addField(`Soy Adı`,`${req.body.soy_adii}`, true)
        .setTimestamp()
        .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
      client.channels.cache.get("990201273527726094").send({ embeds: [para_cekme] }).catch(async () => { console.log("Kanalı Bulamadım") });
      client.channels.cache.get("990201273527726094").send({ content: "<@445142958447263747> Talebe Bakmak İçin Lütfen Admin Paneline Giriş Yapın!" }).catch(async () => { console.log("Kanalı Bulamadım") });
      //////////////////////
      let alici = await client.users.fetch(req.user.id).catch(() => null);
      if (!alici) return log("Kullanıcıyı Bulamadım");
      const talep_alindi = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Hermosa Payments")
        .setDescription("İsteğiniz Yetkili Ekibimize Ulaştı! \n Yakında Talebinizi İnceleyecekler! \n Bizi Tercih Ettiğiniz İçin Teşekkür Ederiz <3")
        .setTimestamp()
        .setFooter("Team Hermosa Payments", "https://i.hizliresim.com/mgpxlwb.jpg");
      await alici.send({ embeds: [talep_alindi] }).then(async function (message) {})
        .catch(async () => {
          log(req.user.id + " Kullanıcının DM'si Açık Değil");
        });
      //Herşey doğru ise
      res.redirect("/para-cek?success=true");
    });
    //////
    app.get("/odeme-taleplerim", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let odemeler = await mongo_hermosa_para_cekme_talebi.find({ userID: req.user.id });
      ////console.log(servers);
      res.render("dashboard/pages/odeme-taleplerim", {
        user: req.user,
        k_verileri,
        odemeler,
      });
    });
    //////
    app.get("/para-yuklemelerim", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let odemeler = await mongo_hermosa_para_yuklemelerim.find({ userID: req.user.id });
      ////console.log(servers);
      res.render("dashboard/pages/para-yuklemeler", {
        user: req.user,
        k_verileri,
        odemeler,
      });
    });
    //////
    app.get("/pre-uyelikler", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let preSunucular = await mongo_planss.find({ sunucuSahibiID: req.user.id });
      let server_sayisi = preSunucular.length;
      let preUyeler = [];
      /////
       for (i = 0; i < Number(server_sayisi); i++) {
         let sunucuIDmiz = preSunucular[i].sunucuID;
         let oPlandakiUyeler = await mongo_satin_alinmis_plans.find({ sunucuID: sunucuIDmiz });
         if(oPlandakiUyeler.length > 0) {
          for (x = 0; x < Number(oPlandakiUyeler.length); x++) {
            preUyeler.push(oPlandakiUyeler[i]);
          }

         }
       }
      //console.log(preUyeler);
      res.render("dashboard/pages/pre-uyelikler", {
        user: req.user,
        k_verileri,
        preUyeler,
      });
    });
    
    //////
    app.get("/uyeliklerim", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      let uyeliklerim = await mongo_satin_alinmis_plans.find({ alan_kisi_ID: req.user.id });
      ////console.log(servers);
      res.render("dashboard/pages/uyeliklerim", {
        user: req.user,
        k_verileri,
        uyeliklerim,
      });
    });
    ///Discord///
    app.get("/discord", (req, res) => {
      res.redirect(config.discord);
    });
    ///İnsta///
    app.get("/insta", (req, res) => {
      res.redirect(config.insta);
    });
    ///Github///
    app.get("/github", (req, res) => {
      res.redirect(config.github);
    });
    ///YT///
    app.get("/youtube", (req, res) => {
      res.redirect(config.youtube);
    });
    ///Sponsor///
    app.get("/sponsor", (req, res) => {
      res.redirect(config.sponsor);
    });
    app.get("/govizyon", (req, res) => {
      res.redirect(config.govizyon);
    });
    //////LogOut///////
    app.get("/logout", (req, res) => {
      req.logOut();
      return res.redirect("/?logout_bycan=true");
    });
    ///Bakiye Yükle///
    ///404
    app.get("/404", async (req, res) => {
      res.render("dashboard/pages/404", {
      });
    });
    ////Bakim////
    app.get("/bakim", checkAuth, checkBanned, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      res.render("dashboard/pages/bakim", {
        user: req.user,
        k_veriler: k_verileri,
      });
    });
    ////Banned////
    app.get("/banned", checkAuth, async (req, res) => {
      let k_verileri = await mongo_hesaps.find({ userID: req.user.id });
      res.render("dashboard/pages/banned", {
        user: req.user,
        k_veriler: k_verileri,
      });
    });
    ////////////////////////
    if(config.dashboard.arc.enabled === "true"){
        app.get("/arc-sw.js", (req, res) => {
            res.type(".js")
            res.send(`!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=100)}({100:function(t,e,r){"use strict";r.r(e);var n=r(2);if("undefined"!=typeof ServiceWorkerGlobalScope){var o="https://arc.io"+n.k;importScripts(o)}else if("undefined"!=typeof SharedWorkerGlobalScope){var c="https://arc.io"+n.i;importScripts(c)}else if("undefined"!=typeof DedicatedWorkerGlobalScope){var i="https://arc.io"+n.b;importScripts(i)}},2:function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"f",(function(){return c})),r.d(e,"j",(function(){return i})),r.d(e,"i",(function(){return a})),r.d(e,"b",(function(){return d})),r.d(e,"k",(function(){return f})),r.d(e,"c",(function(){return u})),r.d(e,"d",(function(){return s})),r.d(e,"e",(function(){return l})),r.d(e,"h",(function(){return m})),r.d(e,"g",(function(){return v}));var n={images:["bmp","jpeg","jpg","ttf","pict","svg","webp","eps","svgz","gif","png","ico","tif","tiff","bpg","avif","jxl"],video:["mp4","3gp","webm","mkv","flv","f4v","f4p","f4bogv","drc","avi","mov","qt","wmv","amv","mpg","mp2","mpeg","mpe","m2v","m4v","3g2","gifv","mpv","av1"],audio:["mid","midi","aac","aiff","flac","m4a","m4p","mp3","ogg","oga","mogg","opus","ra","rm","wav","webm","f4a","pat"],interchange:["json","yaml","xml","csv","toml","ini","bson","asn1","ubj"],archives:["jar","iso","tar","tgz","tbz2","tlz","gz","bz2","xz","lz","z","7z","apk","dmg","rar","lzma","txz","zip","zipx"],documents:["pdf","ps","doc","docx","ppt","pptx","xls","otf","xlsx"],other:["srt","swf"]},o="arc:",c={COMLINK_INIT:"".concat(o,"comlink:init"),NODE_ID:"".concat(o,":nodeId"),CDN_CONFIG:"".concat(o,"cdn:config"),P2P_CLIENT_READY:"".concat(o,"cdn:ready"),STORED_FIDS:"".concat(o,"cdn:storedFids"),SW_HEALTH_CHECK:"".concat(o,"cdn:healthCheck"),WIDGET_CONFIG:"".concat(o,"widget:config"),WIDGET_INIT:"".concat(o,"widget:init"),WIDGET_UI_LOAD:"".concat(o,"widget:load"),BROKER_LOAD:"".concat(o,"broker:load"),RENDER_FILE:"".concat(o,"inlay:renderFile"),FILE_RENDERED:"".concat(o,"inlay:fileRendered")},i="serviceWorker",a="/".concat("shared-worker",".js"),d="/".concat("dedicated-worker",".js"),f="/".concat("arc-sw-core",".js"),p="".concat("arc-sw",".js"),u=("/".concat(p),"/".concat("arc-sw"),"arc-db"),s="key-val-store",l=2**17,m="".concat("https://overmind.arc.io","/api/propertySession"),v="".concat("https://warden.arc.io","/mailbox/propertySession")}});`)
        })
    }


    app.use((req, res) => {
        res.status(404).redirect("/404");
    });

    function rasgelesayicek(length) {
    var result = "";
    var characters =
        "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
    }

    function onay_kodu_icin_sayi(length) {
    var result = "";
    var characters = "1234567890";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
    }
}
/// Mi Hermosa <3 By Can