# Sistem Manajemen Tugas Kuliah

Aplikasi CLI (Command Line Interface) berbasis Node.js untuk mengelola tugas kuliah.

## Gambaran Umum

Sistem Manajemen Tugas Kuliah adalah aplikasi terminal yang membantu mahasiswa mencatat dan memantau tugas-tugas kuliahnya. Pengguna dapat menambah, melihat, mengubah, dan menghapus tugas, lalu memfilter berdasarkan status, prioritas, atau mata kuliah, mengurutkan berdasarkan deadline, dan melihat ringkasan progres. Data disimpan secara permanen di file `tasks.json`, sehingga tetap ada setelah program ditutup.

Fitur utama:

- CRUD tugas (Create, Read, Update, Delete)
- Pencarian tugas berdasarkan ID
- Filter berdasarkan status, prioritas, atau mata kuliah
- Pengurutan tugas berdasarkan deadline
- Ringkasan tugas (total, selesai, belum selesai, lewat deadline, dan lainnya)
- Validasi input (format tanggal `YYYY-MM-DD`, prioritas, status, dan ID)
- Penyimpanan data otomatis ke file JSON

## Cara Menjalankan Program (How to Run)

Prasyarat: [Node.js](https://nodejs.org/) versi 18 atau lebih baru terpasang di komputer.

1. Clone repository ini:

   ```bash
   git clone https://github.com/NaurahMM/Mini-Project_TSC-Backend_Sistem-Management-Tugas-Kuliah-Berbasis-CLI.git
   cd <nama-folder-repository>
   ```

2. Jalankan program di terminal:

   ```bash
   node main.js
   ```

   atau menggunakan npm script:

   ```bash
   npm start
   ```

3. Pilih menu dengan mengetikkan angka `0` sampai `8`, lalu tekan Enter.

Saat pertama kali dijalankan, jika `tasks.json` belum ada, file tersebut akan dibuat otomatis dari data awal di `data.js`.

### Struktur File

| File | Fungsi |
|------|--------|
| `main.js` | Antarmuka menu interaktif di terminal |
| `functions.js` | Seluruh logika aplikasi (CRUD, filter, sort, ringkasan, simpan/muat file) |
| `data.js` | Data awal berupa array of objects |
| `tasks.json` | Penyimpanan data tugas |
| `package.json` | Konfigurasi project |

## Format Data (Array of Objects)

Data tugas disimpan sebagai array yang berisi object. Contoh satu object:

```json
{
  "id": 1,
  "judul": "Membuat laporan praktikum",
  "mataKuliah": "Sistem Operasi",
  "deadline": "2026-10-25",
  "prioritas": "Tinggi",
  "status": "Belum selesai"
}
```

Penjelasan setiap `key`:

| Key | Tipe | Keterangan |
|-----|------|------------|
| `id` | Number | ID unik tugas, dibuat otomatis (ID terbesar + 1) |
| `judul` | String | Judul atau nama tugas |
| `mataKuliah` | String | Nama mata kuliah yang terkait dengan tugas |
| `deadline` | String | Batas pengumpulan, format `YYYY-MM-DD` |
| `prioritas` | String | `Tinggi`, `Sedang`, atau `Rendah` |
| `status` | String | `Belum selesai`, `Sedang dikerjakan`, atau `Selesai` |

## Penjelasan Function CRUD

Semua function berada di `functions.js`.

### Create

- **`addTask(newTask)`**: Menambah tugas baru. Fungsi ini memvalidasi judul, mata kuliah, deadline, prioritas, dan status, membuat ID otomatis, memasukkan tugas ke array, lalu menyimpannya ke `tasks.json`.

### Read

- **`getAllTasks()`**: Menampilkan seluruh tugas dalam bentuk tabel dan mengembalikan salinan array tugas.
- **`getTaskById(id)`**: Mencari dan menampilkan satu tugas berdasarkan ID. Mengembalikan `null` jika ID tidak valid atau tidak ditemukan.

### Update

- **`updateTask(id, updatedData)`**: Mengubah data tugas berdasarkan ID. Field yang tidak diubah tetap memakai nilai lama. Data hasil penggabungan divalidasi ulang sebelum disimpan ke `tasks.json`.

### Delete

- **`deleteTask(id)`**: Menghapus tugas berdasarkan ID dari array, lalu menyimpan perubahan ke `tasks.json`. Di menu, pengguna diminta konfirmasi (`y/n`) sebelum penghapusan dilakukan.

### Fungsi Pendukung

- **`filterTasks(criteria, value)`**: Menyaring tugas berdasarkan `status`, `prioritas`, atau `mataKuliah`.
- **`sortTasksByDeadline()`**: Mengurutkan tugas dari deadline terdekat.
- **`showTaskSummary()`**: Menampilkan ringkasan tugas menggunakan `reduce()`, `some()`, dan `every()`.
- **`loadTasksFromFile()`** dan **`saveTasksToFile()`**: Memuat dan menyimpan data ke `tasks.json`.
