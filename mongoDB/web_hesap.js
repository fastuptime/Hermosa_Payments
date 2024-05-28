
const monogoose = require('mongoose');
var hesaplar = monogoose.createConnection('XXXXXXXXXXXXXXXXXXXXXXXXXXX', {
  useNewUrlParser: true,
  autoIndex: false
});
const web_hesap = new monogoose.Schema({
    userName: String, //Discord Kullanıcı Adı
    discriminator: String, //# den sonrası
    email: String, //EMail Discord
    userID: String, //User ID Discord
    giris_sayisi: String, //Siteye Kaç Kere Girdiğini Kayıt Edecek
    ip: String, //İp 1
    bakiye: String, //Site Bakiyesi
    referans_toplam: String, //Referansları
    dil: String, //Ödeme İçin
    bildirim_dil: String, //Mail vs için
    adi: String, ///Ödeme İçin Adı
    soy_adi: String, ///Ödeme İçin SoyAdı
    adresi: String, ///Ödeme İçin Açık Adresi
    telefon: String, ///Ödeme İçin Telefon Numarası
    mail: String, ///Ödeme İçin Mail Adresi
    para_birimi: String, ///Ödeme İçin Para Birimi
    beyaz_liste: String, //İp Kontrolüne Girmez Değer Evet/NaN
    ban_durumu: String, //Ban Durum Evet/Nan
    ban_sebebi: String, //Ban Sebebi
    uyari_sayisi: String, //Uyarı Sayısı Limit 5
    plan_durumu: String, //Pre veya free
    plan_son_kullanma_tarihi: String, //Planın Son Geçerlilik Tarihi
    son_giris: String, //Açık Kapalı Monitör İçin
    ilk_giris: String, //İlk Giriş Tarihi
});

module.exports = hesaplar.model("hesaplar", web_hesap);