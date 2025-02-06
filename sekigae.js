// DOM Elements
// メンバーリスト管理
// DOM Elements
// DOM Elements
const memberList = document.getElementById('memberList');
const addMemberButton = document.getElementById('addMember');
const clearAllButton = document.getElementById('clearAll');
const saveMembersButton = document.getElementById('saveMembersData');
const restoreMembersButton = document.getElementById('restoreMembersData');
const memberCount = document.getElementById('memberCount');

const seatsGrid = document.getElementById('seats');
const shuffleButton = document.getElementById('shuffleButton');
const saveSeatingButton = document.getElementById('saveSeatingData');
const restoreSeatingButton = document.getElementById('restoreSeatingData');
const updateGridButton = document.getElementById('updateGrid');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Variables to store saved data
let savedMembers = [];
let savedSeating = { members: [], rows: 4, columns: 4 };

// Tab Switching
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    tabContents.forEach((content) => content.classList.remove('active'));

    button.classList.add('active');
    const tabId = button.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Add Member
addMemberButton.addEventListener('click', () => {
  const memberItem = document.createElement('div');
  memberItem.className = 'member-item';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Name';
  input.className = 'member-input';

  const removeButton = document.createElement('button');
  removeButton.textContent = '✖';
  removeButton.className = 'btn btn-remove';
  removeButton.addEventListener('click', () => {
    memberItem.remove();
    updateMemberCount();
  });

  memberItem.appendChild(input);
  memberItem.appendChild(removeButton);
  memberList.appendChild(memberItem);

  updateMemberCount();
});

// Clear All Members
clearAllButton.addEventListener('click', () => {
  memberList.innerHTML = '';
  updateMemberCount();
});

// Save Members
saveMembersButton.addEventListener('click', () => {
  savedMembers = Array.from(document.querySelectorAll('.member-input')).map((input) =>
    input.value.trim()
  );
  alert('Members have been saved!');
  console.log(savedMembers);
});

// Restore Members
restoreMembersButton.addEventListener('click', () => {
  if (savedMembers.length === 0) {
    alert('No saved members to restore.');
    return;
  }

  memberList.innerHTML = '';
  savedMembers.forEach((name) => {
    const memberItem = document.createElement('div');
    memberItem.className = 'member-item';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = name;
    input.className = 'member-input';

    const removeButton = document.createElement('button');
    removeButton.textContent = '✖';
    removeButton.className = 'btn btn-remove';
    removeButton.addEventListener('click', () => {
      memberItem.remove();
      updateMemberCount();
    });

    memberItem.appendChild(input);
    memberItem.appendChild(removeButton);
    memberList.appendChild(memberItem);
  });

  updateMemberCount();
});

// Update Member Count
function updateMemberCount() {
  memberCount.textContent = memberList.querySelectorAll('.member-item').length;
}

// Shuffle Seating
shuffleButton.addEventListener('click', () => {
  const members = Array.from(document.querySelectorAll('.member-input'))
    .map((input) => input.value.trim())
    .filter((name) => name !== '');

  const rows = parseInt(rowsInput.value, 10);
  const columns = parseInt(columnsInput.value, 10);

  if (members.length === 0) {
    alert('No members added!');
    return;
  }

  if (members.length > rows * columns) {
    alert('Not enough seats for all members.');
    return;
  }

  const shuffledMembers = shuffleArray(members);
  renderSeats(shuffledMembers, rows, columns);
});

// Save Seating Chart
saveSeatingButton.addEventListener('click', () => {
  const seatingData = Array.from(seatsGrid.children).map((seat) => seat.textContent.trim());
  const rows = parseInt(rowsInput.value, 10);
  const columns = parseInt(columnsInput.value, 10);

  // Save the data to localStorage
  const savedSeating = {
    seatingData,
    rows,
    columns,
  };

  localStorage.setItem('seatingChart', JSON.stringify(savedSeating));
  alert('Seating chart has been saved!');
  console.log(savedSeating); // Debugging: Log the saved data
});

// Restore Seating Chart
restoreSeatingButton.addEventListener('click', () => {
  const savedSeating = JSON.parse(localStorage.getItem('seatingChart'));

  if (!savedSeating) {
    alert('No saved seating chart to restore.');
    return;
  }

  const { seatingData, rows, columns } = savedSeating;

  // Update rows and columns inputs
  rowsInput.value = rows;
  columnsInput.value = columns;

  // Render the seating chart
  seatsGrid.innerHTML = '';
  seatsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  seatingData.forEach((name) => {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.textContent = name;
    seatsGrid.appendChild(seat);
  });

  alert('Seating chart has been restored!');
});


// Update Grid
updateGridButton.addEventListener('click', () => {
  const rows = parseInt(rowsInput.value, 10);
  const columns = parseInt(columnsInput.value, 10);

  if (rows < 1 || columns < 1) {
    alert('Rows and Columns must be at least 1.');
    return;
  }

  renderEmptyGrid(rows, columns);
});

// Render Empty Grid
function renderEmptyGrid(rows, columns) {
  const totalSeats = rows * columns;

  seatsGrid.innerHTML = '';
  seatsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let i = 0; i < totalSeats; i++) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.textContent = `Seat ${i + 1}`;
    seatsGrid.appendChild(seat);
  }
}

// Render Seats
function renderSeats(members, rows, columns) {
  seatsGrid.innerHTML = '';
  seatsGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  members.forEach((name) => {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.textContent = name;
    seatsGrid.appendChild(seat);
  });

  const totalSeats = rows * columns;
  for (let i = members.length; i < totalSeats; i++) {
    const seat = document.createElement('div');
    seat.className = 'seat';
    seat.textContent = '';
    seatsGrid.appendChild(seat);
  }
}

// Shuffle Array Utility
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize the default language
let currentLang = langEn;

// Function to update all UI text based on the selected language
function updateLanguage(lang) {
  currentLang = lang;

  // Update Tabs
  document.querySelector('[data-tab="seating"]').textContent = lang.tabs.seating;
  document.querySelector('[data-tab="members"]').textContent = lang.tabs.members;
  document.querySelector('[data-tab="customize"]').textContent = lang.tabs.customize;

  // Update Seating Section
  document.querySelector("#seating h2").textContent = lang.seating.title;
  document.getElementById("shuffleButton").textContent = lang.seating.shuffle;
  document.getElementById("saveSeatingData").textContent = lang.seating.save;
  document.getElementById("restoreSeatingData").textContent = lang.seating.restore;

  // Update Members Section
  document.querySelector("#members h2").textContent = lang.members.title;
  document.querySelector("#memberCount").previousSibling.textContent = lang.members.written;
  document.getElementById("addMember").textContent = lang.members.add;
  document.getElementById("clearAll").textContent = lang.members.clear;
  document.getElementById("saveMembersData").textContent = lang.members.save;
  document.getElementById("restoreMembersData").textContent = lang.members.restore;

  // Update Customize Section
  document.querySelector("#customize h2").textContent = lang.customize.title;
  document.querySelector('label[for="rows"]').textContent = lang.customize.rows;
  document.querySelector('label[for="columns"]').textContent = lang.customize.columns;
  document.getElementById("updateGrid").textContent = lang.customize.update;
}

// Add event listeners for language switch buttons
document.getElementById("lang-en").addEventListener("click", () => updateLanguage(langEn));
document.getElementById("lang-ja").addEventListener("click", () => updateLanguage(langJa));

// Initialize the page with the default language
updateLanguage(currentLang);