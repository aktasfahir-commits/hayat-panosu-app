# Hayat Panosu

Onboarding tabanlı kişisel kontrol merkezi. İlk açılışta seçtiğin alanlara göre aktif hedeflerini oluşturur, dashboard yalnızca bu hedeflere odaklanır.

## Akış

1. **Kategori seç** — Spor, Sağlık, Zihin, Gelişim, Yaşam.
2. **Hedef seç** — Seçtiğin kategorilerin hazır hedeflerinden seç ya da kendi hedefini ekle.
3. **Hedef değerlerini gir** — Her hedef için günlük ulaşmak istediğin değeri belirle.
4. **Aktif hedefler oluşur** — Seçimlerin `activeGoals` olarak kaydedilir.
5. **Dashboard** — Yalnızca aktif hedeflerini gösterir.

## Dashboard

Sade ve odaklı; ana metrik **günlük ilerleme** ve **streak**:

- **Günlük İlerleme** — Aktif hedeflerin ortalama tamamlanma yüzdesi
- **Streak** — Genel ve kategori bazlı gün serisi
- **Aktif Hedefler** — Kategorilere göre gruplanmış, gerçekleşen değer girişi
- **Yeni Hedef Ekle** — Tek hedeflik hızlı ekleme alanı

Puan sistemi arka planda korunur (her hedef kartında `+puan` olarak görünür) ama dashboard'un ana odağı değildir.

## Hazır Hedefler

| Kategori | Hedefler |
|----------|----------|
| Spor | Adım, Mekik, Koşu |
| Sağlık | Su, Uyku, Vitamin |
| Zihin | Nefes, Meditasyon, Şükür |
| Gelişim | Kitap, Dil, Ders |
| Yaşam | Para Biriktirme, Görevler, Düzen |

## Nasıl Çalıştırılır

### Yöntem 1: Doğrudan aç (en kolay)

`index.html` dosyasına çift tıklayın veya tarayıcıda açın:

```
c:\Users\Win\Desktop\reelsfikirapp\hayat-panosu\index.html
```

### Yöntem 2: Yerel sunucu

PowerShell:

```powershell
Set-Location "c:\Users\Win\Desktop\reelsfikirapp\hayat-panosu"
python -m http.server 8080
```

Ardından tarayıcıda [http://localhost:8080](http://localhost:8080) adresini açın.

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `index.html` | Uygulama yapısı |
| `styles.css` | Modern, mobil uyumlu tasarım |
| `app.js` | Mantık ve localStorage |

## Veri Saklama

Tüm veriler tarayıcınızın `localStorage` alanında `hayat-panosu` anahtarıyla saklanır. Veri modeli `version: 8`'dir; eski sürümlerden hedefler ve günlük ilerleme otomatik taşınır (ruh hali ve notlar bu sürümde kaldırılmıştır). Tarayıcı verilerini temizlerseniz kayıtlar silinir.
