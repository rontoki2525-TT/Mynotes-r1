function render() {
  const activeTable = document.getElementById("activeTable");
  const completedTable = document.getElementById("completedTable");

  activeTable.innerHTML = "";
  completedTable.innerHTML = "";

  const reversed = [...notes].reverse();

  // ===== Active =====
  categories.forEach(cat => {

    const filtered = reversed.filter(n => n.category === cat && !n.done);

    if (filtered.length > 0) {

      // カテゴリ見出し
      const header = document.createElement("tr");
      header.innerHTML = `<td colspan="3"><b>${cat}</b></td>`;
      activeTable.appendChild(header);

      filtered.forEach(note => {
        const index = notes.indexOf(note);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${note.text}</td>
          <td>${note.date}</td>
          <td>
            <button onclick="markDone(${index})">DONE</button>
          </td>
        `;

        activeTable.appendChild(tr);
      });
    }
  });

  // ===== Completed =====
  categories.forEach(cat => {

    const filtered = reversed.filter(n => n.category === cat && n.done);

    if (filtered.length > 0) {

      const header = document.createElement("tr");
      header.innerHTML = `<td colspan="3"><b>${cat}</b></td>`;
      completedTable.appendChild(header);

      filtered.forEach(note => {
        const index = notes.indexOf(note);

        const tr = document.createElement("tr");
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
      });
    }
  });
}