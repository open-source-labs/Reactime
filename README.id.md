<h1 align="center">
    <img src ="./assets/logos/marqueePromoTitle.png"/>
    <br>
  Alat Kinerja React
    <br>
    <a href="https://osawards.com/react/">🏆 Dinominasikan untuk React Open Source Awards 2020</a>
  <br>
</h1>

<h4 align="center">Ekstensi Chrome yang kuat untuk meningkatkan pengembangan React dengan debugging lintas-waktu dan pemantauan kinerja lanjutan</h4>

<h4 align="center"><a href="https://medium.com/@elliesimens/reactime-reimagined-a-major-leap-forward-in-react-debugging-7b76a0a66f42">Baca Artikel Kami di Medium</a> untuk mempelajari lebih lanjut tentang proses di balik layar dan pengembangan Reactime!</h4>
<br>

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/v/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/users/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store Users" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/rating/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store Rating" />
  </a>
</p>

<h5 align="center">
<br>
  <a href="./README.rus.md">🇷🇺  &nbsp; ВЕРСИ РUSIA</a> &nbsp; • &nbsp;  <a href="./README.fr.md">🇫🇷  &nbsp; VERSI PRANCIS</a> &nbsp; • &nbsp; <a href='./src/DEVELOPER_README.md'>👩‍💻 README Pengembang</a>
  <br>
</h5>
<br>

<p align="center">
<img src="./assets/gifs/GeneralDemoGif_V26.gif" />
</p>

## <h1>✨ Fitur Utama</h1>

### 🔍 Visualisasi State

- **Beberapa Tampilan**: Visualisasikan state aplikasi Anda melalui Component Graphs, JSON Trees, Performance Graphs, dan Accessibility Trees  
- **History Timeline**: Lacak perubahan state seiring waktu melalui tampilan riwayat yang intuitif  
- **Web Metrics**: Pantau metrik kinerja penting secara real-time  
- **Insight Aksesibilitas**: Analisis accessibility tree aplikasi Anda pada setiap perubahan state  
  <br>

<p>Pada halaman utama, terdapat dua pilihan utama di panel dropdown:</p>

- **Timejump**: Melihat dan menavigasi riwayat snapshot state aplikasi Anda. Anda dapat melompat ke titik mana pun dalam waktu untuk melihat bagaimana state berubah di setiap perubahan. Anda juga dapat menggunakan tombol play untuk memutar ulang setiap perubahan state secara otomatis.
- **Providers / Consumers**: Memahami dependensi context aplikasi Anda dan bagaimana elemen-elemen tersebut berinteraksi, melalui visualisasi hubungan provider dan consumer.
  <br>

<p align="center">
<img src="./assets/gifs/ProviderConsumer_V26.gif" />
</p>
<br>

### ⏱️ Debugging Lintas-Waktu

- **Snapshot State**: Tangkap dan navigasi riwayat state aplikasi Anda  
- **Playback Controls**: Putar ulang perubahan state secara otomatis dengan kecepatan yang dapat disesuaikan  
- **Jump Points**: Langsung menuju state yang sebelumnya  
- **Perbandingan Diff**: Bandingkan state antar snapshot  
  <br>

<p align="center">
<img src="./assets/gifs/TimeTravelGif_V26.gif" />
</p>
<br>

### 📊 Analisis Kinerja

- **Metrik Komponen**: Lacak waktu render dan potensi bottleneck pada kinerja  
- **Perbandingan Seri**: Bandingkan kinerja di berbagai set perubahan state  
- **Deteksi Re-render**: Identifikasi dan perbaiki siklus render yang tidak diperlukan  
- **Web Vitals**: Pantau Core Web Vitals dan metrik kinerja lainnya  
  <br>
  <br>

### 🔄 Dukungan Framework Modern

<ul>
  <li>
    Kompatibilitas penuh dengan <strong>Next.js, Remix, Recoil, dan Gatsby</strong>
  </li>
  <li>
    Dukungan TypeScript untuk komponen berbasis class dan fungsional
  </li>
  <li>
    Dukungan untuk React Hooks dan Context API
  </li>
</ul>
<br>

### 💾 Persistensi & Berbagi State

Reactime memudahkan proses menyimpan dan berbagi riwayat state aplikasi Anda:

- **Ekspor Riwayat State**: Simpan snapshot yang direkam sebagai berkas JSON untuk analisis lebih lanjut atau dibagikan  
- **Impor Sesi Sebelumnya**: Unggah snapshot yang telah disimpan untuk membandingkan perubahan state di sesi yang berbeda  
- **Analisis Lintas-Sesi**: Bandingkan kinerja dan perubahan state antara berbagai sesi pengembangan  
  <br>

<p align="center">
<img src="./assets/gifs/ImportExportGif_V26.gif" />
</p>
<br>

### 📚 Dokumentasi Interaktif

Reactime menyediakan dokumentasi komprehensif untuk membantu pengembang memahami arsitektur dan API-nya:
Setelah melakukan clone pada repositori ini, pengembang dapat menjalankan `npm run docs` di
level root, dan menyajikan `/docs/index.html` yang dihasilkan secara dinamis, yang menyediakan:

<ul>
  <li>Diagram komponen interaktif</li>
  <li>Definisi tipe dan interface</li>
  <li>Gambaran umum arsitektur codebase</li>
  <li>Referensi dan contoh API</li>
</ul>
<br>

<h1>🎉 Apa yang Baru!</h1>

Reactime 26.0 menghadirkan perombakan total pada pengalaman debugging React, dengan fitur-fitur:

- **Tampilan Data Context Baru**  
  - Visualisasi pertama untuk perubahan state hook useContext  
  - Pemetaan jelas hubungan provider-consumer  
  - Pemantauan nilai state context secara real-time  
  - Visualisasi data provider yang terperinci  

- **Debugging Lintas-Waktu yang Ditingkatkan**  
  - Antarmuka slider yang didesain ulang, ditempatkan di samping snapshot  
  - Kontrol kecepatan pemutaran yang bervariasi  
  - Navigasi state yang lebih intuitif  
  - Visualisasi snapshot yang lebih baik  

- **Perombakan UI Modern**  
  - Desain yang lebih segar dengan komponen membulat  
  - Peningkatan tata letak yang intuitif  
  - Dukungan mode gelap baru  
  - Hierarki visual yang diperbarui  

- **Peningkatan Teknis Besar**  
  - Mengatasi masalah koneksi yang terputus saat idle dan perpindahan tab  
  - Mengembalikan visualisasi accessibility tree  
  - Memperbaiki masalah penangkapan state pada useState berbasis fungsi  
  - Meningkatkan keandalan dan kinerja ekstensi secara keseluruhan  

Pembaruan ini membuat Reactime lebih kuat, andal, dan ramah pengguna dari sebelumnya, menetapkan standar baru bagi alat debugging React.
<br>
<br>

<h1>🚀 Memulai</h1>

### Instalasi

1. Pasang [Ekstensi Reactime](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga) dari Chrome Web Store  
2. Pasang ekstensi [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) yang diperlukan jika Anda belum memasangnya

### Prasyarat

- Aplikasi React Anda harus berjalan dalam **mode development**  
- Ekstensi React Developer Tools harus terpasang  
- Peramban Chrome (disarankan versi 80 atau lebih tinggi)

### Menjalankan Reactime

Ada dua cara untuk membuka panel Reactime:

1. **DevTools**  
   - Buka Chrome DevTools (F12 atau ⌘+⌥+I)  
   - Buka tab "Reactime"  
   - Ini akan membuka Reactime sebagai panel di dalam Chrome DevTools, terintegrasi bersama alat pengembangan Anda yang lain

2. **Context Menu**  
   - Klik kanan di mana saja pada aplikasi React Anda  
   - Pilih "Reactime" dari context menu  
   - Ini akan membuka Reactime di jendela popup terpisah yang dapat Anda ubah ukuran dan posisinya secara mandiri

Setelah diluncurkan, Reactime secara otomatis akan mulai memantau perubahan state dan metrik kinerja aplikasi Anda.
<br>
<br>

<h1>🤝 Berkontribusi di Reactime</h1>

Kami menyambut kontribusi dari pengembang di semua tingkatan! Untuk panduan terperinci tentang cara berkontribusi:

1. **Mulai**  
   - Fork repositori  
   - Pelajari README Pengembang kami yang komprehensif  
   - Siapkan lingkungan pengembangan lokal Anda

2. **Proses Build**  
   - Ikuti petunjuk build di README Pengembang kami  
   - Uji perubahan Anda secara menyeluruh  
   - Ajukan pull request

Bergabunglah dengan komunitas kontributor kami yang terus berkembang dan bantu membentuk masa depan alat debugging React! Untuk panduan kontribusi dan informasi arsitektur proyek yang lebih rinci, silakan lihat <a href='./src/DEVELOPER_README.md'>👩‍💻 README Pengembang</a> dan <a href='./CONTRIBUTING.md'>🙋 Contributing README</a>.
<br>
<br>

<h1>🛠️ Pemecahan Masalah</h1>

### ❓ <b>Mengapa Reactime tidak merekam perubahan state baru?</b>

Reactime kehilangan koneksi dengan tab yang Anda pantau. Cukup klik tombol "reconnect" untuk melanjutkan pekerjaan Anda.

### ❓ <b>Mengapa Reactime tidak menemukan hooks saya?</b>

Reactime mendeteksi dan memantau hooks dengan menelusuri kode React Anda yang belum di-minify di mode development. Jika proses build Anda meminifikasi atau meng-uglify kode—even untuk build development—Reactime mungkin tidak bisa mendeteksi dan melacak hooks Anda dengan benar. Untuk memperbaikinya:

1. **Pastikan build benar-benar development**: Periksa konfigurasi bundler atau build tool Anda (misalnya, Webpack, Babel, Vite, dll.) untuk memastikan aplikasi tidak di-minify atau di-uglify dalam mode development.
   - Misalnya, dengan Webpack, pastikan Anda menjalankan mode: 'development' yang menonaktifkan minification default.
   - Pada proyek Create React App, cukup jalankan npm start atau yarn start yang secara otomatis mengonfigurasi build development yang tidak di-minify.
2. **Periksa override**: Pastikan tidak ada plugin Babel atau Webpack kustom yang meminifikasi kode Anda, terutama jika Anda menggunakan framework seperti Next.js atau Gatsby. Terkadang ada plugin atau skrip tambahan yang berjalan di belakang layar.
3. **Restart & rebuild**: Setelah mengubah konfigurasi build, lakukan rebuild atau restart server development Anda agar konfigurasi baru diterapkan. Lalu segarkan tab peramban Anda agar Reactime dapat mendeteksi hooks yang tidak di-minify.

Setelah mengubah konfigurasi build, rebuild atau restart server pengembangan Anda agar konfigurasi baru diterapkan. Kemudian, refresh tab peramban sehingga Reactime dapat mendeteksi hooks Anda yang tidak di-minify.

### ❓ <b>Mengapa Reactime mengatakan bahwa tidak ada aplikasi React yang ditemukan?</b>

Reactime awalnya dijalankan menggunakan dev tools global hook dari API Chrome. Proses ini memerlukan waktu untuk dimuat. Coba refresh aplikasi Anda beberapa kali hingga Reactime muncul.

### ❓ <b>Mengapa saya harus mengaktifkan React Dev Tools?</b>

Reactime bekerja berdampingan dengan React Developer Tools untuk mengakses Fiber tree aplikasi React; di balik layar, Reactime menjelajahi Fiber tree melalui global hook dari React Developer Tools, dan mengambil semua informasi relevan yang diperlukan untuk ditampilkan kepada pengembang.

### ❓ <b>Saya menemukan bug di Reactime</b>

Reactime adalah proyek open-source, dan kami ingin mendengar masukan Anda untuk meningkatkan pengalaman pengguna. Silakan baca <a href='./src/DEVELOPER_README.md'>👩‍💻 README Pengembang</a>,
dan buat pull request (atau issue) untuk mengusulkan dan berkolaborasi dalam perubahan pada Reactime.

### ❓ <b>Kecocokan versi Node</b>

Dengan rilis Node v18.12.1 (LTS) pada 4/11/22, skrip telah diperbarui menjadi
'npm run dev' | 'npm run build' untuk menjaga kompatibilitas mundur.  
Untuk versi Node v16.16.0, silakan gunakan skrip 'npm run devlegacy' | 'npm run buildlegacy'
<br>
<br>

<h1>✍️ Penulis</h1>

- **Garrett Chow** - [@garrettlchow](https://github.com/garrettlchow)
- **Ellie Simens** - [@elliesimens](https://github.com/elliesimens)
- **Ragad Mohammed** - [@ragad-mohammed](https://github.com/ragad-mohammed)
- **Daniel Ryczek** - [@dryczek14](https://github.com/dryczek01)
- **Patrice Pinardo** - [@pinardo88](https://github.com/pinardo88)
- **Haider Ali** - [@hali03](https://github.com/hali03)
- **Jose Luis Sanchez** - [@JoseSanchez1996](https://github.com/JoseSanchez1996)
- **Logan Nelsen** - [@ljn16](https://github.com/ljn16)
- **Mel Koppens** - [@MelKoppens](https://github.com/MelKoppens)
- **Amy Yang** - [@ay7991](https://github.com/ay7991)
- **Eva Ury** - [@evaSUry](https://github.com/evaSUry)
- **Jesse Guerrero** - [@jguerrero35](https://github.com/jguerrero35)
- **Oliver Cho** - [@Oliver-Cho](https://github.com/Oliver-Cho)
- **Ben Margolius** - [@benmarg](https://github.com/benmarg)
- **Eric Yun** - [@ericsngyun](https://github.com/ericsngyun)
- **James Nghiem** - [@jemzir](https://github.com/jemzir)
- **Wilton Lee** - [@wiltonlee948](https://github.com/wiltonlee948)
- **Louis Lam** - [@llam722](https://github.com/llam722)
- **Samuel Tran** - [@leumastr](https://github.com/leumastr)
- **Brian Yang** - [@yangbrian310](https://github.com/yangbrian310)
- **Emin Tahirov** - [@eminthrv](https://github.com/eminthrv)
- **Peng Dong** - [@d28601581](https://github.com/d28601581)
- **Ozair Ghulam** - [@ozairgh](https://github.com/ozairgh)
- **Christina Or** - [@christinaor](https://github.com/christinaor)
- **Khanh Bui** - [@AndyB909](https://github.com/AndyB909)
- **David Kim** - [@codejunkie7](https://github.com/codejunkie7)
- **Robby Tipton** - [@RobbyTipton](https://github.com/RobbyTipton)
- **Kevin HoEun Lee** - [@khobread](https://github.com/khobread)
- **Christopher LeBrett** - [@fscgolden](https://github.com/fscgolden)
- **Joseph Park** - [@joeepark](https://github.com/joeepark)
- **Kris Sorensen** - [@kris-sorensen](https://github.com/kris-sorensen)
- **Daljit Gill** - [@dgill05](https://github.com/dgill05)
- **Ben Michareune** - [@bmichare](https://github.com/bmichare)
- **Dane Corpion** - [@danecorpion](https://github.com/danecorpion)
- **Harry Fox** - [@StackOverFlowWhereArtThou](https://github.com/StackOverFlowWhereArtThou)
- **Nathan Richardson** - [@BagelEnthusiast](https://github.com/BagelEnthusiast)
- **David Bernstein** - [@dangitbobbeh](https://github.com/dangitbobbeh)
- **Joseph Stern** - [@josephiswhere](https://github.com/josephiswhere)
- **Dennis Lopez** - [@DennisLpz](https://github.com/DennisLpz)
- **Cole Styron** - [@C-STYR](https://github.com/C-STYR)
- **Ali Rahman** - [@CourageWolf](https://github.com/CourageWolf)
- **Caner Demir** - [@demircaner](https://github.com/demircaner)
- **Kevin Ngo** - [@kev-ngo](https://github.com/kev-ngo)
- **Becca Viner** - [@rtviner](https://github.com/rtviner)
- **Caitlin Chan** - [@caitlinchan23](https://github.com/caitlinchan23)
- **Kim Mai Nguyen** - [@Nkmai](https://github.com/Nkmai)
- **Tania Lind** - [@lind-tania](https://github.com/lind-tania)
- **Alex Landeros** - [@AlexanderLanderos](https://github.com/AlexanderLanderos)
- **Chris Guizzetti** - [@guizzettic](https://github.com/guizzettic)
- **Jason Victor** - [@Theqwertypusher](https://github.com/Theqwertypusher)
- **Sanjay Lavingia** - [@sanjaylavingia](https://github.com/sanjaylavingia)
- **Vincent Nguyen** - [@VNguyenCode](https://github.com/VNguyenCode)
- **Haejin Jo** - [@haejinjo](https://github.com/haejinjo)
- **Hien Nguyen** - [@hienqn](https://github.com/hienqn)
- **Jack Crish** - [@JackC27](https://github.com/JackC27)
- **Kevin Fey** - [@kevinfey](https://github.com/kevinfey)
- **Carlos Perez** - [@crperezt](https://github.com/crperezt)
- **Edwin Menendez** - [@edwinjmenendez](https://github.com/edwinjmenendez)
- **Gabriela Jardim Aquino** - [@aquinojardim](https://github.com/aquinojardim)
- **Greg Panciera** - [@gpanciera](https://github.com/gpanciera)
- **Nathanael Wa Mwenze** - [@nmwenz90](https://github.com/nmwenz90)
- **Ryan Dang** - [@rydang](https://github.com/rydang)
- **Bryan Lee** - [@mylee1995](https://github.com/mylee1995)
- **Josh Kim** - [@joshua0308](https://github.com/joshua0308)
- **Sierra Swaby** - [@starkspark](https://github.com/starkspark)
- **Ruth Anam** - [@nusanam](https://github.com/nusanam)
- **David Chai** - [@davidchai717](https://github.com/davidchai717)
- **Yujin Kang** - [@yujinkay](https://github.com/yujinkay)
- **Andy Wong** - [@andynullwong](https://github.com/andynullwong)
- **Chris Flannery** - [@chriswillsflannery](https://github.com/chriswillsflannery)
- **Rajeeb Banstola** - [@rajeebthegreat](https://github.com/rajeebthegreat)
- **Prasanna Malla** - [@prasmalla](https://github.com/prasmalla)
- **Rocky Lin** - [@rocky9413](https://github.com/rocky9413)
- **Abaas Khorrami** - [@dubalol](https://github.com/dubalol)
- **Ergi Shehu** - [@ergi516](https://github.com/ergi516)
- **Raymond Kwan** - [@rkwn](https://github.com/rkwn)
- **Joshua Howard** - [@joshua-howard](https://github.com/joshua-howard)
- **Lina Shin** - [@rxlina](https://github.com/rxlina)
- **Andy Tsou** - [@andytsou19](https://github.com/andytsou19)
- **Feiyi Wu** - [@FreyaWu](https://github.com/FreyaWu)
- **Viet Nguyen** - [@vnguyen95](https://github.com/vnguyen95)
- **Alex Gomez** - [@alexgomez9](https://github.com/alexgomez9)
- **Edar Liu** - [@liuedar](https://github.com/liuedar)
- **Kristina Wallen** - [@kristinawallen](https://github.com/kristinawallen)
- **Quan Le** - [@Blachfog](https://github.com/Blachfog)
- **Robert Maeda** - [@robmaeda](https://github.com/robmaeda)
- **Lance Ziegler** - [@lanceziegler](https://github.com/lanceziegler)
- **Ngoc Zwolinski** - [@ngoczwolinski](https://github.com/ngoczwolinski)
- **Peter Lam** - [@dev-plam](https://github.com/dev-plam)
- **Zachary Freeman** - [@zacharydfreeman](https://github.com/zacharydfreeman/)
- **Jackie Yuan** - [@yuanjackie1](https://github.com/yuanjackie1)
- **Jasmine Noor** - [@jasnoo](https://github.com/jasnoo)
- **Minzo Kim** - [@minzo-kim](https://github.com/minzo-kim)
- **Mark Teets** - [@MarkTeets](https://github.com/MarkTeets)
- **Nick Huemmer** - [@ElDuke717](https://github.com/ElDuke717)
- **James McCollough** - [@j-mccoll](https://github.com/j-mccoll)
- **Mike Bednarz** - [@mikebednarz](https://github.com/mikebednarz)
- **Sergei Liubchenko** - [@sergeylvq](https://github.com/sergeylvq)
- **Yididia Ketema** - [@yididiaketema](https://github.com/yididiaketema)
- **Morah Geist** - [@morahgeist](https://github.com/morahgeist)
- **Eivind Del Fierro** - [@EivindDelFierro](https://github.com/EivindDelFierro)
- **Kyle Bell** - [@KyEBell](https://github.com/KyEBell)
- **Sean Kelly** - [@brok3turtl3](https://github.com/brok3turtl3)
- **Christopher Stamper** - [@ctstamper](https://github.com/ctstamper)
- **Jimmy Phy** - [@jimmally](https://github.com/jimmally)
- **Andrew Byun** - [@AndrewByun](https://github.com/AndrewByun)
- **Kelvin Mirhan** - [@kelvinmirhan](https://github.com/kelvinmirhan)
- **Jesse Rosengrant** - [@jrosengrant](https://github.com/jrosengrant)
- **Liam Donaher** - [@leebology](https://github.com/leebology)
- **David Moore** - [@Solodt55](https://github.com/Solodt55)
- **John Banks** - [@Jbanks123](https://github.com/Jbanks123)
  <br>

<h1>⚖️ Lisensi</h1>

Proyek ini dilisensikan di bawah MIT License - lihat berkas [LICENSE](LICENSE) untuk detail selengkapnya.
