
const monogoose = require('mongoose');
var hesaplar = monogoose.createConnection('XXXXXXXXXXXXXXXXXXXXXXXXXXX', {
  useNewUrlParser: true,
  autoIndex: false
});
const plan_sunucu = new monogoose.Schema({
    sunucuID: String, //Sunucu ID
    sunucuSahibiID: String, //Sunucu Sahibi ID
    onay_durumu: String, //Bekliyor, Onaylandi, Onaylanmadi
    plani_alan_kisi_toplam: String, //Toplam Planı Satın Alan Kişi Sayısı
    olusturulma_tarihi: String, //Oluşturulma Tarihi
    son_satis_tarihi: String, //Son Satış Tarihi
    plan_adi: String, //Planın Adı
    plan_desc: String, //Plan Açıklama
    yillik: String, //Yillik Fiyat
    aylik: String, //Aylik Fiyat
    plan_img: String, //Plan Resmi
    thx_dm_msg: String, //Dm Teşekkür Mesajı
    thx_genel_msg: String, //Teşekkür Mesajı Genel
    genel_thx_msg_channel_id: String, //Genel Teşekkür Mesajı Kanal ID
    log_channel_id: String, //Log Kanalı ID
    rol_id: String, //Verilecek Rol ID
    ozellik_1: String, //Rol Özellik 1
    ozellik_2: String, //Rol Özellik 2
    ozellik_3: String, //Rol Özellik 3
});

module.exports = hesaplar.model("planlar", plan_sunucu);