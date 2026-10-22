import fs from "fs";
import { tasks } from "./data.js";

const DATA_FILE = new URL("./tasks.json", import.meta.url);

const PRIORITIES = ["Tinggi", "Sedang", "Rendah"];
const STATUSES = ["Belum selesai", "Sedang dikerjakan", "Selesai"];

// Helper function: rapikan teks (hapus spasi di awal/akhir)
function normalizeText(value) {
  return String(value ?? "").trim();
}

// Helper function: validasi tanggal format YYYY-MM-DD dan pastikan tanggalnya nyata
export function isValidDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// Helper function: cocokkan teks tanpa peduli huruf besar/kecil
function findIgnoreCase(list, value) {
  const text = normalizeText(value).toLowerCase();
  return list.find((item) => item.toLowerCase() === text) ?? null;
}

// Helper function: validasi prioritas (return nilai baku atau null)
export function normalizePriority(value) {
  return findIgnoreCase(PRIORITIES, value);
}

// Helper function: validasi status (return nilai baku atau null)
export function normalizeStatus(value) {
  return findIgnoreCase(STATUSES, value);
}

// Helper function: ID harus berupa angka bulat positif
function parseId(input) {
  const text = normalizeText(input);
  if (!/^\d+$/.test(text)) return null;

  const id = Number(text);
  return id > 0 ? id : null;
}

// Helper function: tanggal hari ini (waktu lokal) format YYYY-MM-DD
function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Save data ke file JSON
export function saveTasksToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
    console.log("Data tugas berhasil disimpan ke tasks.json");
  } catch (error) {
    console.log(`Gagal menyimpan data ke file (${error.message}).`);
  }
}

// Load data dari file JSON (jika ada)
export function loadTasksFromFile() {
  if (!fs.existsSync(DATA_FILE)) {
    console.log("Belum ada file data. tasks.json dibuat dari data awal.");
    saveTasksToFile();
    return;
  }

  try {
    const loaded = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (!Array.isArray(loaded)) {
      throw new Error("Format data harus berupa array.");
    }
    tasks.splice(0, tasks.length, ...loaded); // replace isi array
    console.log("Data tugas berhasil dimuat dari file.");
  } catch (error) {
    // File lama TIDAK ditimpa, jadi isinya masih bisa diperbaiki manual.
    console.log(`File tasks.json tidak bisa dibaca (${error.message}).`);
    console.log("Data awal dipakai sementara. Perbaiki atau hapus tasks.json lalu jalankan ulang.");
  }
}

// CREATE
export function addTask(newTask = {}) {
  const judul = normalizeText(newTask.judul);
  const mataKuliah = normalizeText(newTask.mataKuliah);
  const deadline = normalizeText(newTask.deadline);
  const prioritas = normalizePriority(newTask.prioritas ?? "Sedang");
  const status = normalizeStatus(newTask.status ?? "Belum selesai");

  // Validasi data
  if (!judul || !mataKuliah || !deadline) {
    console.log("Judul, mata kuliah, dan deadline wajib diisi!");
    return;
  }

  if (!isValidDate(deadline)) {
    console.log("Format deadline tidak valid! Gunakan format: YYYY-MM-DD");
    return;
  }

  if (!prioritas) {
    console.log("Prioritas harus Tinggi, Sedang, atau Rendah!");
    return;
  }

  if (!status) {
    console.log("Status harus Belum selesai, Sedang dikerjakan, atau Selesai!");
    return;
  }

  // Generate ID otomatis
  const id = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.id)) + 1;

  tasks.push({ id, judul, mataKuliah, deadline, prioritas, status });
  saveTasksToFile();
  console.log(`Tugas "${judul}" berhasil ditambahkan dengan ID ${id}.`);
}

// READ ALL
export function getAllTasks() {
  if (tasks.length === 0) {
    console.log("Belum ada data tugas.");
    return [];
  }

  console.log("Daftar Semua Tugas:");
  console.table(tasks);
  return [...tasks];
}

// READ BY ID
export function getTaskById(idInput) {
  const id = parseId(idInput);
  if (id === null) {
    console.log("ID harus berupa bilangan bulat positif.");
    return null;
  }

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`Tugas dengan ID ${id} tidak ditemukan.`);
    return null;
  }

  console.table([task]);
  return { ...task };
}

// UPDATE
export function updateTask(idInput, updatedData = {}) {
  const id = parseId(idInput);
  if (id === null) {
    console.log("ID harus berupa bilangan bulat positif.");
    return;
  }

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    console.log(`Tidak ada tugas dengan ID ${id}.`);
    return;
  }

  const merged = { ...tasks[index], ...updatedData };
  const judul = normalizeText(merged.judul);
  const mataKuliah = normalizeText(merged.mataKuliah);
  const deadline = normalizeText(merged.deadline);
  const prioritas = normalizePriority(merged.prioritas);
  const status = normalizeStatus(merged.status);

  if (!judul || !mataKuliah) {
    console.log("Judul dan mata kuliah tidak boleh kosong!");
    return;
  }

  if (!isValidDate(deadline)) {
    console.log("Format deadline tidak valid! Gunakan format: YYYY-MM-DD");
    return;
  }

  if (!prioritas || !status) {
    console.log("Periksa kembali nilai prioritas atau status!");
    return;
  }

  tasks[index] = { id, judul, mataKuliah, deadline, prioritas, status };
  saveTasksToFile();
  console.log(`Data tugas ID ${id} berhasil diperbarui.`);
}

// DELETE
export function deleteTask(idInput) {
  const id = parseId(idInput);
  if (id === null) {
    console.log("ID harus berupa bilangan bulat positif.");
    return;
  }

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    console.log(`Tidak ada tugas dengan ID ${id}.`);
    return;
  }

  tasks.splice(index, 1);
  saveTasksToFile();
  console.log(`Tugas ID ${id} berhasil dihapus.`);
}

// FILTER (status / prioritas / mataKuliah)
export function filterTasks(criteria, value) {
  const allowedCriteria = ["status", "prioritas", "mataKuliah"];
  if (!allowedCriteria.includes(criteria)) {
    console.log("Kriteria filter tidak valid.");
    return [];
  }

  const keyword = normalizeText(value).toLowerCase();
  if (!keyword) {
    console.log("Nilai filter tidak boleh kosong.");
    return [];
  }

  // mataKuliah dicari sebagian (includes), status & prioritas harus cocok persis
  const filtered = tasks.filter((t) => {
    const field = String(t[criteria]).toLowerCase();
    return criteria === "mataKuliah" ? field.includes(keyword) : field === keyword;
  });

  console.log(`Hasil filter ${criteria} = "${normalizeText(value)}":`);
  if (filtered.length === 0) {
    console.log("Tidak ada tugas yang cocok.");
  } else {
    console.table(filtered);
  }
  return filtered;
}

// SORT BY DEADLINE
export function sortTasksByDeadline() {
  if (tasks.length === 0) {
    console.log("Belum ada data tugas.");
    return [];
  }

  // Format YYYY-MM-DD bisa dibandingkan langsung sebagai string
  const sorted = [...tasks].sort(
    (a, b) => a.deadline.localeCompare(b.deadline) || a.id - b.id
  );
  console.log("Tugas diurutkan berdasarkan deadline:");
  console.table(sorted);
  return sorted;
}

// SUMMARY (reduce, some, every)
export function showTaskSummary() {
  const total = tasks.length;
  const selesai = tasks.filter((t) => t.status === "Selesai").length;
  const belumSelesai = tasks.filter((t) => t.status !== "Selesai").length;

  const today = getToday();
  const terlambat = tasks.filter(
    (t) => t.status !== "Selesai" && t.deadline < today
  ).length;

  // reduce() menghitung jumlah tugas untuk setiap status
  const countByStatus = tasks.reduce((summary, t) => {
    summary[t.status] = (summary[t.status] ?? 0) + 1;
    return summary;
  }, {});

  // some() cek apakah ada tugas prioritas tinggi yang belum selesai
  const hasUrgentTask = tasks.some(
    (t) => t.prioritas === "Tinggi" && t.status !== "Selesai"
  );

  // every() cek apakah semua tugas sudah selesai
  const allCompleted = total > 0 && tasks.every((t) => t.status === "Selesai");

  const statusDetail =
    Object.entries(countByStatus)
      .map(([status, jumlah]) => `${status}: ${jumlah}`)
      .join(", ") || "Belum ada data";

  console.log(`
RINGKASAN TUGAS
Total tugas                          : ${total}
Tugas selesai                        : ${selesai}
Tugas belum selesai                  : ${belumSelesai}
Tugas lewat deadline                 : ${terlambat}
Tugas prioritas tinggi belum selesai : ${hasUrgentTask ? "Ada" : "Tidak ada"}
Semua tugas selesai                  : ${allCompleted ? "Ya" : "Belum"}
Rincian status                       : ${statusDetail}`);
}