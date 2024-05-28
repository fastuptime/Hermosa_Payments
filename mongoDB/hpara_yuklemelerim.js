
const monogoose = require('mongoose');
var hesaplar = monogoose.createConnection('XXXXXXXXXXXXXXXXXXXXXXXXXXX', {
  useNewUrlParser: true,
  autoIndex: false
});
const hpara_yuklemelerim = new monogoose.Schema({
  userID: String, //Kullanıcının ID si
  yuklenen_miktar: String, //Yüklenen Miktar
  gelen_islem_id: String, //Gelen İşlem ID
  tarih: String, //Oluşturulma Tarih
});

module.exports = hesaplar.model("hermosa_para_yuklemelerim", hpara_yuklemelerim);