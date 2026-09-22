# PASSWORD MANAGER
Codlean tarafından istenen, React ile geliştirilen Password Manager projesi.

Kullanılan Teknolojiler:
- React Router: Site yönlendirmesi ve Protected Route ile koruma sağlama
- Zustand: Şifreli verileri kaydetme ve depolanamsı gereken ile gerekmeyen bilgiler arasında ayrım sağlanma
- localStorage: Şifrelenmiş verileri tarayıcıda depolama
- Tailwind CSS: Stil
- Web Crypto API: Verileri şifreleme

## Nasıl Çalışıyor?

Siteye giriş yapınca erişim sağlamadan önce master password doğrulaması isteniyor. Aynı zamanda Protected Routes ile giriş sayfasını atlama önleniyor. 

Master Password: "codlean"

Veriler bu master password kullanılarak şifreleniyor, böylece giriş ekranı bir şekilde atlansa bile master password olmadan şifresiz veriye erişim mümkün değil.

Ana parola ne düz metin ne de hash olarak hiçbir şekilde diske kaydedilmiyor.

PBKDF2 ile ana parolaya "her seferinde rastgele belirlenen bir salt değeri" + 250,000 tur attırılıyor.
Master password'un doğruluğunu kontrol etmek için ise önceden belirlenen ve şifrelenmiş bir metini çözmeye çalışıyoruz, eğer çözüyorsa şifrenin doğru olduğu anlamına geliyor.

## Özellikler
- Parola ekleme, düzenleme, silme
- Kategoriye göre filtreleme ve arama
- Parolanın normalde gizli kalıp üzerine gelindiği zaman açığa çıkması, tıklandığı zaman kopyalanması.
- Rastgele parola oluşturucu
- Açık/Koyu mod tuşu
