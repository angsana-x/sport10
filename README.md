# SPORT10 · RW 10 Bukit Angsana

**One Community, One Sporting Spirit.**
Jadwal, hasil, klasemen, dan juara pesta olahraga warga: catur, bola voli, tenis meja, dan futsal.

Buka aplikasi: **https://angsana-x.github.io/sport10/**

## Cara kerja (kenapa cepat)

| Lapisan | Isi | Waktu tampil |
|---|---|---|
| 1. Data terakhir di HP | Disimpan otomatis setiap kali aplikasi dibuka | ± 0,5 detik |
| 2. `data.json` (snapshot) | Diterbitkan Apps Script ke repo ini tiap 10 menit bila data berubah | ± 1 detik |
| 3. Server Apps Script | Data langsung, menyusul di latar | 2–6 detik |

Label di kanan atas menunjukkan sumber data:
- **Data 14.20**: menampilkan data pukul 14.20, versi terbaru sedang dimuat.
- **Live**: sudah tersambung, skor diperbarui otomatis.
- **Terputus**: server belum terjangkau. Ketuk label untuk mencoba lagi.

## Isi repo

| File | Fungsi |
|---|---|
| `index.html` | Aplikasi lengkap. Membaca dan menyimpan data lewat API Apps Script. |
| `404.html` | Salinan `index.html`, supaya link yang salah ketik tetap membuka aplikasi. |
| `sw.js` | Service worker: kunjungan ulang langsung terbuka walau sinyal lemah. |
| `data.json` | Snapshot data publik. **Jangan diedit manual**, karena isinya ditimpa otomatis. |
| `logo.webp`, `icon-*.png`, `og-image.jpg`, `manifest.webmanifest` | Logo, ikon aplikasi, dan gambar pratinjau saat link dibagikan di WhatsApp. |
| `.nojekyll` | Supaya GitHub Pages menyajikan file apa adanya. |

## Privasi

`data.json` bersifat publik dan tersimpan di riwayat repo. Isinya hanya nama tim, nama pemain, jadwal, dan hasil.

Yang tidak pernah ikut ke `data.json`:
- nomor HP;
- nama pendamping;
- kelas/sekolah anak;
- akun dan PIN;
- log aktivitas.

## Pengaturan di Apps Script (Script Properties)

| Kunci | Isi |
|---|---|
| `GH_TOKEN` | Fine-grained token GitHub: hanya repo `sport10`, izin **Contents: Read and write**. |
| `GH_REPO` | `angsana-x/sport10` (terisi otomatis) |
| `GH_BRANCH` | `main` (terisi otomatis) |
| `PUBLIC_URL` | `https://angsana-x.github.io/sport10/` (terisi otomatis) |

Setelah mengisi `GH_TOKEN`, jalankan fungsi **`pasangOtomatis`** sekali dari editor Apps Script.
