# Sistem Manajemen Tugas Kuliah

Mini project berbasis **Node.js CLI (Command-Line Interface)** untuk membantu pengguna mencatat dan mengelola tugas kuliah melalui terminal. Project ini dibuat untuk latihan JavaScript, CRUD, array of objects, modularisasi, array methods, spread operator, destructuring, template literals, validasi input, serta penyimpanan data menggunakan JSON.

## 1. Fitur

1. **Read** — menampilkan semua tugas dan detail tugas berdasarkan ID.
2. **Create** — menambahkan tugas baru.
3. **Update** — mengubah judul, mata kuliah, deadline, prioritas, atau status tugas.
4. **Delete** — menghapus tugas berdasarkan ID.
5. **Filter** — menyaring tugas berdasarkan status, prioritas, atau mata kuliah.
6. **Sort** — mengurutkan tugas berdasarkan deadline.
7. **Ringkasan** — menghitung jumlah tugas, tugas selesai, tugas belum selesai, serta memeriksa tugas prioritas tinggi.
8. **Penyimpanan JSON** — perubahan disimpan otomatis ke `tasks.json` dan dimuat kembali ketika program dijalankan.

## 2. Teknologi dan persyaratan

- Node.js (disarankan versi 18 atau lebih baru).
- Terminal, Command Prompt, PowerShell, atau terminal VS Code.
- Tidak memerlukan instalasi package eksternal.

## 3. Struktur folder

```text
sistem-manajemen-tugas-kuliah/
├── main.js        # Menu CLI dan input keyboard
├── functions.js   # Fungsi CRUD, validasi, filter, sort, dan ringkasan
├── data.js        # Array of objects untuk data awal
├── tasks.json     # Penyimpanan data; dibuat otomatis saat pertama dijalankan
├── package.json   # Konfigurasi proyek dan perintah npm start
└── README.md      # Dokumentasi proyek
```

## 4. Cara menjalankan

1. Pastikan Node.js sudah terpasang. Periksa dengan perintah:

   ```bash
   node --version
   ```

2. Buka terminal di folder project.

3. Jalankan program dengan salah satu perintah berikut:

   ```bash
   node main.js
   ```

   atau:

   ```bash
   npm start
   ```

   Di PowerShell Windows, jika perintah `npm` terhalang Execution Policy, coba `npm.cmd start`.

4. Pilih menu yang ditampilkan. Masukkan data sesuai pertanyaan terminal.
5. Pilih `0` untuk keluar. Data yang sudah berubah akan tersimpan otomatis di `tasks.json`.

## 5. Format data tugas

Setiap tugas disimpan sebagai object di dalam array dengan properti berikut:

```javascript
{
  id: 1,
  judul: "Membuat laporan praktikum",
  mataKuliah: "Sistem Operasi",
  deadline: "2026-10-25",
  prioritas: "Tinggi",
  status: "Belum selesai"
}
```

- `id`: nomor unik tugas.
- `judul`: nama atau deskripsi singkat tugas.
- `mataKuliah`: nama mata kuliah.
- `deadline`: tanggal dengan format `YYYY-MM-DD`.
- `prioritas`: `Tinggi`, `Sedang`, atau `Rendah`.
- `status`: `Belum selesai`, `Sedang dikerjakan`, atau `Selesai`.

## 6. Menu program

| Menu | Fungsi |
|---|---|
| 1 | Lihat semua tugas |
| 2 | Tambah tugas |
| 3 | Cari tugas berdasarkan ID |
| 4 | Ubah tugas |
| 5 | Hapus tugas |
| 6 | Filter tugas |
| 7 | Urutkan berdasarkan deadline |
| 8 | Lihat ringkasan tugas |
| 0 | Keluar |

## 7. Contoh output terminal

Contoh berikut menggambarkan tampilan saat program dijalankan. Data dapat berbeda jika isi `tasks.json` sudah diubah.

```text
Data tugas berhasil dimuat dari tasks.json.

========================================
     SISTEM MANAJEMEN TUGAS KULIAH
========================================
1. Lihat semua tugas
2. Tambah tugas
3. Cari tugas berdasarkan ID
4. Ubah tugas
5. Hapus tugas
6. Filter tugas
7. Urutkan berdasarkan deadline
8. Lihat ringkasan tugas
0. Keluar
========================================
Pilih menu (0-8): 1

DAFTAR SEMUA TUGAS
┌─────────┬────┬───────────────────────────────┬──────────────────────────────────┬──────────────┬──────────┬────────────────────┐
│ (index) │ ID │ Judul                         │ Mata Kuliah                      │ Deadline     │ Prioritas│ Status             │
└─────────┴────┴───────────────────────────────┴──────────────────────────────────┴──────────────┴──────────┴────────────────────┘
```

Contoh menambahkan tugas:

```text
Pilih menu (0-8): 2
Judul tugas: Membuat makalah
Mata kuliah: Basis Data
Deadline (YYYY-MM-DD): 2026-10-28
Prioritas (Tinggi/Sedang/Rendah) [Sedang]: Tinggi
Status (Belum selesai/Sedang dikerjakan/Selesai) [Belum selesai]:
Tugas "Membuat makalah" berhasil ditambahkan dengan ID 4.
```

Contoh validasi ID:

```text
Pilih menu (0-8): 5
Masukkan ID tugas yang ingin dihapus: 999
Gagal: tugas dengan ID 999 tidak ditemukan. Tidak ada data yang dihapus.
```

## 8. Penerapan materi JavaScript

### A. Input dan output keyboard
Modul bawaan `readline` digunakan untuk menerima input pengguna melalui terminal. `console.log()` dan `console.table()` digunakan untuk menampilkan menu, pesan, dan data.

### B. CRUD
- **Create:** `addTask()`
- **Read:** `getAllTasks()` dan `getTaskById()`
- **Update:** `updateTask()`
- **Delete:** `deleteTask()`

### C. Array of objects
Variabel `tasks` pada `data.js` berisi array yang setiap elemennya merupakan object tugas.

### D. Modularisasi
Kode dipisahkan berdasarkan tanggung jawab:
- `main.js` mengatur alur program dan input.
- `functions.js` mengatur operasi data dan validasi.
- `data.js` menyediakan data awal.

Fungsi diimpor dan diekspor dengan `import`/`export`, sehingga `package.json` menggunakan `"type": "module"`.

### E. Variabel, kondisi, dan operator logika
`const` digunakan untuk nilai yang tidak perlu ditugaskan ulang, sedangkan `let` digunakan untuk variabel yang berubah. `if`, `switch`, `&&`, `||`, `!`, `===`, dan `!==` dipakai untuk mengatur alur serta memvalidasi input.

### F. Arrow functions
Contoh:

```javascript
const isValidPriority = (priority) =>
  ["Tinggi", "Sedang", "Rendah"].includes(priority);
```

### G. Array methods
Project ini menggunakan lebih dari dua array methods:
- `.map()` menyusun ulang properti untuk tampilan tabel.
- `.filter()` mencari tugas berdasarkan kriteria dan menghapus tugas yang dipilih dari array hasil.
- `.reduce()` menghitung jumlah tugas berdasarkan status.
- `.some()` memeriksa apakah ada tugas prioritas tinggi yang belum selesai.
- `.every()` memeriksa apakah semua tugas sudah selesai.
- `.find()` mencari satu tugas berdasarkan ID.
- `.findIndex()` mencari posisi tugas yang akan diperbarui.

### H. Spread operator (`...`)
- `Math.max(...tasks.map(...))` meneruskan daftar ID sebagai argumen untuk mencari ID terbesar.
- `{ ...currentTask, ...updatedData, id }` membuat object baru dengan menggabungkan data lama dan perubahan.
- `[...tasks]` membuat salinan array sebelum pengurutan.
- `tasks.splice(0, tasks.length, ...remainingTasks)` memperbarui isi array aktif menggunakan elemen dari array hasil filter.

### I. Destructuring assignment
Contoh di `functions.js`:

```javascript
const { judul, mataKuliah, deadline, prioritas, status } = task;
```

Properti object diambil ke variabel agar lebih mudah diproses.

### J. Template literals
Pesan menggunakan backticks dan interpolasi `${...}`, misalnya:

```javascript
console.log(`Tugas ID ${id} berhasil diperbarui.`);
```

### K. Validasi
Program menolak judul atau mata kuliah kosong, format atau tanggal deadline yang tidak valid, prioritas/status yang tidak dikenal, ID bukan bilangan bulat positif, dan ID yang tidak ditemukan. Validasi membantu mencegah operasi yang tidak sesuai.

### L. Penyimpanan data JSON
Modul `fs` membaca dan menulis `tasks.json`. Dengan demikian, data tetap tersedia setelah program ditutup dan dibuka kembali.

## 9. Catatan

- Format tanggal deadline wajib `YYYY-MM-DD`, contohnya `2026-10-25`.
- Nilai prioritas dan status harus sesuai pilihan yang tersedia.
- File `tasks.json` dibuat otomatis pada saat pertama kali program dijalankan.
- Ini merupakan aplikasi CLI untuk latihan dasar, bukan aplikasi web atau sistem multi-pengguna.

## 10. Pengembang

- Nama: [Isi nama kamu]
- Tema: Sistem Manajemen Tugas Kuliah
- Teknologi: JavaScript dan Node.js
