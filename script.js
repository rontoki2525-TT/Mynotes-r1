// ===== データ取得 =====
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];

// 初期カテゴリ
if (categories.length === 0) {
  categories = ["Default"];
}

// ===== 日付 =====
function getFormattedDate() {
  const now = new Date();
  return `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;
}

// ===== カテゴリ表示 =====
function renderCategory() {
  const select = document.getElementById("categorySelect");
  select.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.text = cat;
    select.appendChild(option);
  });
}

// ===== カテゴリ追加 =====
function addCategory() {
  const input = document.getElementById("newCategory");

  if (input.value === "") return;

  categories.push(input.value);

  localStorage.setItem("categories", JSON.stringify(categories));

  input.value = "";

  renderCategory();
}

// ===== 描画 =====
function render() {
  const activeTable = document.getElementById("activeTable");
  const completedTable = document.getElementById("completedTable");

  activeTable.innerHTML = "";
  completedTable.innerHTML = "";

  const reversed = [...notes].reverse();

  reversed.forEach((note, index) => {
    const tr = document.createElement("tr");

    if (note.done) {
      tr.classList.add("completed");
      tr.innerHTML = `
        <td>${note.text}</td>
        <td>${note.date}</td>
        <td>
          <button onclick="undoDone(${index})">UNDO</button>
          <button onclick="deleteNote(${index})">DELETE</button>
        </td>
      `;
      completedTable.appendChild(tr);

    } else {
      tr.innerHTML = `
        <td>${note.text}</td>
        <td>${note.date}</td>
        <td>
          <button onclick="markDone(${index})">DONE</button>
        </td>
      `;
      activeTable.appendChild(tr);
    }
  });
}

// ===== メモ追加 =====
function addNote() {
  const input = document.getElementById("noteInput");
  const category = document.getElementById("categorySelect").value;

  if (input.value === "") return;

  notes.push({
    text: input.value,
    date: getFormattedDate(),
    done: false,
    category: category
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  input.value = "";

  render();
}

// ===== 完了 =====
function markDone(index) {
  notes[index].done = true;
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

// ===== 戻す =====
function undoDone(index) {
  notes[index].done = false;
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

// ===== 削除 =====
function deleteNote(index) {
  if (!confirm("Delete this note?")) return;

  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

// Enterで追加
document.addEventListener("DOMContentLoaded", function() {

  renderCategory();
  render();

  document.getElementById("noteInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") addNote();
  });

});