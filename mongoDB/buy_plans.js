
const monogoose = require('mongoose');
var hesaplar = monogoose.createConnection('XXXXXXXXXXXXXXXXXXXXXXXXXXX', {
  useNewUrlParser: true,
  autoIndex: false
});
const satin_alinmis_plan = new monogoose.Schema({
  sunucuID: String, //Sunucu ID
  alan_kisi_ID: String, //Satın Alan Kisi ID
  alinan_plan_rol_id: String, //Alınan Plan Rol ID
  alinan_plan_mongoDB_ID: String, //Alınan Plan Mongo DB ID
  gonderilmis_bildirim_sayisi: String, //Gönderilmiş Bildirim Sayısı Örn: son 3 gün kala bildirim gittiyse 1 olacak sayısı son 1 gün kala gittiyse 2 olacak
  aldigi_tarih: String, //Satın Aldığı Tarih
  son_kullanim: String, //Son Kullanım Tarihi
});

module.exports = hesaplar.model("satin_alinmis_planlar", satin_alinmis_plan);