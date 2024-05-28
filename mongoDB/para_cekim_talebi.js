
const monogoose = require('mongoose');
var hesaplar = monogoose.createConnection('XXXXXXXXXXXXXXXXXXXXXXXXXXX', {
  useNewUrlParser: true,
  autoIndex: false
});
const hpara_cekme_talebi = new monogoose.Schema({
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

module.exports = hesaplar.model("hermosa_paracekme_talebi", hpara_cekme_talebi);