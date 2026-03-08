# 👁️ Çılgın Gözler (Googly Eyes) Chrome Extension

Eğlenceli bir Chrome extension'ı! İçinde bulunduğunuz her web sayfasının sağ üst köşesinde iki çılgın göz belirir ve imlecinizi takip eder. Gözlere tıklandığında esprili bir animasyon oynatılır.

## ✨ Özellikler

- 👁️ **İmleci takip eden göz animasyonu** - Hareket ettikçe gözler seni izler
- 🎬 **Rastgele kırpışma** - Gözler doğal şekilde kırpışır
- 🌀 **Tıklama animasyonu** - Gözlere tıklandığında 3 katına büyüyüp pupilleri döner
- 🎨 **Güzel tasarım** - Profesyonel ve eğlenceli görünüm
- 🔧 **Kolay kontrol** - Popup'tan açıp kapatabilirsiniz
- 📱 **Tüm sitelerde çalışır** - YouTube, Twitter, Gmail vb. tüm sitelerde

## 🚀 Kurulum

### 1. Extension Dosyalarını İndirin
```bash
git clone https://github.com/tansuozcelebi/Eyes.git
cd Eyes
```

### 2. Chrome'da Yükleyin

1. Chrome tarayıcısını açın
2. Adres çubuğunda `chrome://extensions/` yazın
3. Sağ üst köşede **"Geliştirici modu"** açın
4. **"Açılı Uzantıyı Yükle"** butonuna tıklayın
5. İndirdiğiniz proje klasörünü seçin
6. Extension kuruldu! 🎉

### 3. Extension Simgesini Sabitleyin (İsteğe Bağlı)

Chrome araç çubuğundaki "Uzantılar" simgesine tıklayıp, Çılgın Gözler seçeneğini sabitleyin.

## 💡 Kullanım

### Popup Penceresi

1. Chrome araç çubuğundaki extension simgesine tıklayın
2. Popup penceresi açılacak
3. **"Gözleri Göster"** toggle'ı ile açıp kapatabilirsiniz

### Gözlerle Etkileşimde Bulunma

- **İmleci Takip**: Sayfada fare hareket ettirdikçe gözler seni izler
- **Tıkla**: Gözlerin üzerine tıklayarak esprili spin animasyonu tetikleyin
- **Kırpışma**: Gözler rastgele aralıklarla doğal şekilde kırpışır

## 📁 Dosya Yapısı

```
eye-extension/
├── manifest.json          # Extension yapılandırması
├── content.js             # Web sayfalarında çalışan script
├── popup.html             # Extension popup arayüzü
├── popup.js               # Popup işlevleri
└── README.md              # Bu dosya
```

### Dosya Açıklamaları

**manifest.json**
- Extension'ın temel bilgilerini içerir (ad, versiyon, izinler)
- Content script ve popup dosyalarının yollarını belirtir

**content.js**
- Web sayfaları içinde çalışır
- Göz HTML elemanlarını oluşturur
- İmleci takip eden animasyonu yönetir
- Kırpışma ve tıklama animasyonlarını kontrol eder

**popup.html & popup.js**
- Extension popup arayüzünü sağlar
- Gözleri açıp kapatmak için toggle switch'i bulundurur
- Ayarları yerel depolama ile kaydeder

## 🎨 Teknik Detaylar

### Animasyonlar

1. **İmleci Takip**
   - Her fare hareketi ile pupil konumu güncellenir
   - Trigonometri kullanarak hesaplanır

2. **Kırpışma**
   - Rastgele 2-7.5 saniye aralıklarında tetiklenir
   - Yumuşak cubic-bezier easing

3. **Tıklama Animasyonu**
   - Göz 3x büyütme (0.6s)
   - Pupil 360° döndürme animasyonu
   - Yuvarlatılmış corner animasyonu

### CSS & Styling

- Gradyan renk şemaları için radial-gradient kullanımı
- Drop-shadow efektleri
- Smooth transitions ve keyframe animasyonları
- Responsive ve çeşitli sayfalarla uyumlu

## ⚙️ Özelleştirme

Gözlerin görünümünü veya davranışını değiştirmek için:

1. **Boyut**: `content.js` içinde `.googly-eye` CSS'ini düzenleyin - `width` ve `height` değerlerini değiştirin
2. **Konumu**: `content.js` içinde `top` ve `right` CSS değerlerini değiştirin
3. **Renkler**: Style içindeki renk kod değerlerini (`#ff8c42`, `#4a3728` vb.) güncelleyin

Örnek:
```css
.googly-eye {
  width: 60px;  /* Boyutu 52px'den 60px'e değiştir */
  height: 60px;
}
```

## 🐛 Sorun Giderme

### Gözler görünmüyor
- Sayfayı yenileyin (F5)
- Popup'tan açıp kapatmayı deneyin
- Extension'ın etkin olduğunu kontrol edin

### Animasyon çalışmıyor
- Tarayıcı konsolunda (F12) hata var mı kontrol edin
- Sayfayı yenileyin
- Extension'ı yeniden yükleyin

### "ERR_BLOCKED_BY_CLIENT" hatası
- Bu ad blocker tarafından izleme scriptlerinin engellenmesidir
- Extension'ı etkilemez, ignorable bir uyarıdır

## 📝 Lisans

Bu proje açık kaynaklı olup, kişisel ve ticari kullanıma açıktır.

## 👤 Yapımcı

Tansu Özçelebi '26

## 🎯 Gelecek Fikirler

- Farklı göz stilleri
- Sesli efektler
- Ayarlanabilir boyut ve konum
- Koyu mod desteği
- Göz rengi özelleştirmesi

---

Keyif alın! 👀✨
