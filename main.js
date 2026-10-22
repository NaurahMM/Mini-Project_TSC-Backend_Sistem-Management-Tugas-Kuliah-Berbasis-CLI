import { createInterface } from "readline/promises";
import {
  addTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  filterTasks,
  sortTasksByDeadline,
  showTaskSummary,
  loadTasksFromFile,
  isValidDate,
  normalizePriority,
  normalizeStatus
} from "./functions.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Jika input ditutup (Ctrl+C / Ctrl+D), hentikan program dengan rapi.
let isExiting = false;
rl.on("close", () => {
  if (!isExiting) {
    console.log("\nInput ditutup. Program dihentikan.");
    process.exit(0);
  }
});

// readline/promises sudah mengembalikan Promise, jadi bisa langsung dipakai dengan await.
const ask = (question) => rl.question(question);

// Terus bertanya sampai jawaban valid.
// - parse(answer) mengembalikan nilai yang sudah bersih, atau null jika tidak valid.
// - Jika defaultValue diberikan, jawaban kosong akan memakai nilai tersebut.
async function askUntilValid(question, parse, errorMessage, defaultValue) {
  while (true) {
    const answer = (await ask(question)).trim();

    if (answer === "" && defaultValue !== undefined) return defaultValue;

    const result = parse(answer);
    if (result !== null && result !== undefined) return result;

    console.log(errorMessage);
  }
}

// Parser yang dipakai ulang.
const parseText = (value) => value || null;
const parseDate = (value) => (isValidDate(value) ? value : null);

const showMenu = () => {
  console.log(`
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
========================================`);
};

async function addTaskMenu() {
  const judul = await askUntilValid(
    "Judul tugas: ",
    parseText,
    "Judul tidak boleh kosong."
  );
  const mataKuliah = await askUntilValid(
    "Mata kuliah: ",
    parseText,
    "Mata kuliah tidak boleh kosong."
  );
  const deadline = await askUntilValid(
    "Deadline (YYYY-MM-DD): ",
    parseDate,
    "Deadline harus tanggal nyata dengan format YYYY-MM-DD."
  );
  const prioritas = await askUntilValid(
    "Prioritas (Tinggi/Sedang/Rendah) [Sedang]: ",
    normalizePriority,
    "Prioritas harus Tinggi, Sedang, atau Rendah.",
    "Sedang"
  );
  const status = await askUntilValid(
    "Status (Belum selesai/Sedang dikerjakan/Selesai) [Belum selesai]: ",
    normalizeStatus,
    "Status harus Belum selesai, Sedang dikerjakan, atau Selesai.",
    "Belum selesai"
  );

  addTask({ judul, mataKuliah, deadline, prioritas, status });
}

async function updateTaskMenu() {
  const id = (await ask("Masukkan ID tugas yang ingin diubah: ")).trim();
  const currentTask = getTaskById(id);
  if (!currentTask) return;

  console.log("Kosongkan field jika ingin mempertahankan nilai saat ini.");

  const judul = await askUntilValid(
    `Judul baru [${currentTask.judul}]: `,
    parseText,
    "Judul tidak boleh kosong.",
    currentTask.judul
  );
  const mataKuliah = await askUntilValid(
    `Mata kuliah baru [${currentTask.mataKuliah}]: `,
    parseText,
    "Mata kuliah tidak boleh kosong.",
    currentTask.mataKuliah
  );
  const deadline = await askUntilValid(
    `Deadline baru [${currentTask.deadline}]: `,
    parseDate,
    "Deadline harus tanggal nyata dengan format YYYY-MM-DD.",
    currentTask.deadline
  );
  const prioritas = await askUntilValid(
    `Prioritas baru (Tinggi/Sedang/Rendah) [${currentTask.prioritas}]: `,
    normalizePriority,
    "Prioritas harus Tinggi, Sedang, atau Rendah.",
    currentTask.prioritas
  );
  const status = await askUntilValid(
    `Status baru (Belum selesai/Sedang dikerjakan/Selesai) [${currentTask.status}]: `,
    normalizeStatus,
    "Status harus Belum selesai, Sedang dikerjakan, atau Selesai.",
    currentTask.status
  );

  updateTask(id, { judul, mataKuliah, deadline, prioritas, status });
}

async function deleteTaskMenu() {
  const id = (await ask("Masukkan ID tugas yang ingin dihapus: ")).trim();

  // Tampilkan detail dulu; jika ID tidak valid/tidak ada, berhenti di sini.
  const task = getTaskById(id);
  if (!task) return;

  const confirmation = (await ask("Yakin ingin menghapus tugas ini? (y/n): "))
    .trim()
    .toLowerCase();

  if (confirmation === "y" || confirmation === "ya") {
    deleteTask(id);
  } else {
    console.log("Penghapusan dibatalkan.");
  }
}

async function filterTaskMenu() {
  console.log(`
Filter berdasarkan:
1. Status
2. Prioritas
3. Mata kuliah`);
  const choice = (await ask("Pilih kriteria (1-3): ")).trim();

  const criteriaMap = {
    "1": "status",
    "2": "prioritas",
    "3": "mataKuliah"
  };
  const criteria = criteriaMap[choice];

  if (!criteria) {
    console.log("Pilihan filter tidak valid.");
    return;
  }

  const value = await ask(`Masukkan nilai ${criteria}: `);
  if (!value.trim()) {
    console.log("Nilai filter tidak boleh kosong.");
    return;
  }
  filterTasks(criteria, value);
}

async function main() {
  loadTasksFromFile();

  let running = true;
  while (running) {
    showMenu();
    const choice = (await ask("Pilih menu (0-8): ")).trim();

    switch (choice) {
      case "1":
        getAllTasks();
        break;
      case "2":
        await addTaskMenu();
        break;
      case "3": {
        const id = await ask("Masukkan ID tugas: ");
        getTaskById(id);
        break;
      }
      case "4":
        await updateTaskMenu();
        break;
      case "5":
        await deleteTaskMenu();
        break;
      case "6":
        await filterTaskMenu();
        break;
      case "7":
        sortTasksByDeadline();
        break;
      case "8":
        showTaskSummary();
        break;
      case "0":
        console.log("Program selesai. Semangat menyelesaikan tugas kuliah!");
        running = false;
        break;
      default:
        console.log("Pilihan tidak valid. Masukkan angka 0 sampai 8.");
    }

    if (running) {
      await ask("\nTekan Enter untuk kembali ke menu...");
    }
  }

  isExiting = true;
  rl.close();
}

main().catch((error) => {
  console.error(`Terjadi kesalahan: ${error.message}`);
  isExiting = true;
  rl.close();
});