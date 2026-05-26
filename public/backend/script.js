// script.js

let students = [
  {
    id:1,
    studentId:"2024-0001",
    fullName:"Juan Dela Cruz",
    course:"BS Computer Science",
    year:"3rd Year",
    email:"juan@gmail.com"
  },

  {
    id:2,
    studentId:"2024-0002",
    fullName:"Maria Santos",
    course:"BS Information Technology",
    year:"2nd Year",
    email:"maria@gmail.com"
  }
];

let nextId = 3;

/* Pages */

function showPage(pageId){

  document.querySelectorAll(".page").forEach(page=>{
    page.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");
}

/* Render */

function renderStudents(){

  const table = document.getElementById("studentTable");

  table.innerHTML = "";

  students.forEach(student=>{

    table.innerHTML += `
      <tr>

        <td>${student.studentId}</td>

        <td>${student.fullName}</td>

        <td>${student.course}</td>

        <td>${student.year}</td>

        <td>${student.email}</td>

        <td>
          <button
            class="action-btn edit"
            onclick="editStudent(${student.id})"
          >
            Edit
          </button>

          <button
            class="action-btn delete"
            onclick="deleteStudent(${student.id})"
          >
            Delete
          </button>
        </td>

      </tr>
    `;
  });

  document.getElementById("totalStudents").textContent = students.length;
}

/* Register */

document.getElementById("studentForm")
.addEventListener("submit",function(e){

  e.preventDefault();

  const student = {

    id:nextId++,

    studentId:document.getElementById("studentId").value,

    fullName:document.getElementById("fullName").value,

    course:document.getElementById("course").value,

    year:document.getElementById("yearLevel").value,

    email:document.getElementById("email").value
  };

  students.push(student);

  renderStudents();

  alert("Student Registered!");

  this.reset();

  showPage("students");
});

/* Delete */

function deleteStudent(id){

  if(confirm("Delete this student?")){

    students = students.filter(student=>student.id !== id);

    renderStudents();
  }
}

/* Edit */

function editStudent(id){

  const student = students.find(student=>student.id === id);

  const name = prompt("Edit Name:",student.fullName);

  if(name){

    student.fullName = name;

    renderStudents();
  }
}

/* Search */

function searchStudents(){

  const value = document
    .getElementById("search")
    .value
    .toLowerCase();

  const rows = document.querySelectorAll("#studentTable tr");

  rows.forEach(row=>{

    row.style.display =
      row.innerText.toLowerCase().includes(value)
      ? ""
      : "none";
  });
}

/* Init */

renderStudents();
