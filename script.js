let notes = JSON.parse(localStorage.getItem("notes")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];

if (categories.length === 0) {
  categories = ["Default"];
}

function getFormattedDate() {
  const now = new Date();
  return `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;
}

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

function addCategory() {
  const input = document.getElementById("newCategory");
  if (input.value === "") return;

  categories.push(input.value);

  localStorage.setItem("categories", JSON.stringify(categories));
  input.value = "";

  renderCategory();
}

function deleteCategory() {
  const select = document.getElementById("categorySelect");
  const selected = select.value;

  if (!confirm("Delete this category?")) return;

  categories = categories.filter(c => c !== selected);

  notes = notes.map(n => {
    if (n.category === selected) n.category = "Default";
    return n;
  });

  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("notes", JSON.stringify(notes));

  renderCategory();
  render();
}

function render() {
  const activeTable = document.getElementById("activeTable");
  const completedTable = document.getElementById("completedTable");

  activeTable.innerHTML = "";
  completedTable.innerHTML = "";

  const reversed = [...notes].reverse();

  categories.forEach(cat => {

    const active = reversed.filter(n => n.category === cat && !n.done);
    const completed = reversed.filter(n => n.category === cat && n.done);

    active.forEach(note => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${note.category}</td>
        <td>${note.text}</td>
        <td>${note.date}</td>
        <td><button onclick="markDone(${note.id})">DONE</button></td>
      `;

      activeTable.appendChild(tr);
    });

    completed.forEach(note => {
      const tr = document.createElement("tr");
      tr.classList.add("completed");

      tr.innerHTML = `
        <td>${note.category}</td>
        <td>${note.text}</td>
        <td>${note.date}</td>
        <td>
          <button onclick="undoDone(${note.id})">UNDO</button>
          <button onclick="deleteNote(${note.id})">DELETE</button>
        </td>
      `;

      completedTable.appendChild(tr);
    });

  });
}

function addNote() {
  const input = document.getElementById("noteInput");
  const category = document.getElementById("categorySelect").value;

  if (input.value === "") return;

  notes.push({
    id: Date.now(),
    text: input.value,
    date: getFormattedDate(),
    done: false,
    category: category
  });

  localStorage.setItem("notes", JSON.stringify(notes));

  input.value = "";
  render();
}

function markDone(id) {
  notes = notes.map(n => {
    if (n.id === id) n.done = true;
    return n;
  });

  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

function undoDone(id) {
  notes = notes.map(n => {
    if (n.id === id) n.done = false;
    return n;
  });

  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

function deleteNote(id) {
  if (!confirm("Delete this note?")) return;

  notes = notes.filter(n => n.id !== id);

  localStorage.setItem("notes", JSON.stringify(notes));
  render();
}

document.addEventListener("DOMContentLoaded", function() {
  renderCategory();
  render();

  document.getElementById("noteInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") addNote();
  });
});