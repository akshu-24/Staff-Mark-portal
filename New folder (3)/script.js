// === Data ===
const students = [
  "Abdul latheef","Agalya","Akalya","Akshaya","Arivumathi","Aruman",
  "Asik danial","Atchaya","Balaji","Benistan","Chandhuru","Dharshini",
  "Dharun","Durga","Gayathri","Geethanjali","Gokul raj","Hariharan G",
  "Hariharan R","Harini","Harish","Harivarman","Jayasri","Jeris andro",
  "Kamalesh","Kanimozhi","Kapil","Karunyaa","Kavi brundha","Kaviya",
  "Keerthana","Keerthivasan","Kevin","Lakshman","Madhesh","Mahalakshmi",
  "Manoj","Mathavan","Mohammed Ajmal","Mohammed Aslam","Mohan rajamani",
  "Monika vathini","Muthu kumar","Neethimani","Nivitha","Pradeep","Prajin",
  "Akash","Arikaran","Krishna kumar","Madhumitha","Mohammed safik",
  "Mohammed tariq","Murthi"
];

const subjects = [
  "Multimedia and Animation",
  "Network Security",
  "Business Analytics",
  "Web Development",
  "Embedded Systems And Iot",
  "OOSE"
];

const allMarks = {};

// Initialize marks
subjects.forEach(s => {
  allMarks[s] = {};
  students.forEach((name, i) => {
    allMarks[s][i] = {a1:0, a2:0, mcq1:0, mcq2:0, iat:0, boost:0};
  });
});

// === Page Elements ===
const loginPage = document.getElementById("loginPage");
const studentListPage = document.getElementById("studentListPage");
const marksEntryPage = document.getElementById("marksEntryPage");
const portalPage = document.getElementById("portalPage");
const entrySubject = document.getElementById("entrySubject");
const subjectSelect = document.getElementById("subjectSelect");
const barChartCanvas = document.getElementById("barChartCanvas");
const pieChartCanvas = document.getElementById("pieChartCanvas");
const downloadPdf = document.getElementById("downloadPdf");

let barChart, pieChart;

// === Login ===
document.getElementById("loginForm").onsubmit = e => {
  e.preventDefault();
  if(username.value === "admin" && password.value === "12345"){
    loginPage.classList.add("hidden");
    studentListPage.classList.remove("hidden");
    loadStudentList();
  }
};

// === Load Student List ===
function loadStudentList(){
  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach((s,i)=>{
    const d = document.createElement("div");
    d.className = "student";
    d.innerText = (i+1) + " - " + s;
    list.appendChild(d);
  });
}

// === Go to Marks Entry ===
document.getElementById("goMarks").onclick = () => {
  studentListPage.classList.add("hidden");
  marksEntryPage.classList.remove("hidden");

  entrySubject.innerHTML = "";
  subjects.forEach(s => {
    const op = document.createElement("option");
    op.textContent = s;
    entrySubject.appendChild(op);
  });

  renderEntry();
};

// === Render Marks Entry Table ===
function renderEntry(){
  const body = document.getElementById("entryBody");
  body.innerHTML = "";
  const subject = entrySubject.value;

  students.forEach((s,i)=>{
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${s}</td>
      <td><input class="a1"></td>
      <td><input class="a2"></td>
      <td><input class="mcq1"></td>
      <td><input class="mcq2"></td>
    `;
    row.querySelector(".a1").oninput = e => allMarks[subject][i].a1 = e.target.value;
    row.querySelector(".a2").oninput = e => allMarks[subject][i].a2 = e.target.value;
    row.querySelector(".mcq1").oninput = e => allMarks[subject][i].mcq1 = e.target.value;
    row.querySelector(".mcq2").oninput = e => allMarks[subject][i].mcq2 = e.target.value;

    body.appendChild(row);
  });
}

entrySubject.onchange = renderEntry;

// === Go to Portal ===
document.getElementById("toPortal").onclick = () => {
  marksEntryPage.classList.add("hidden");
  portalPage.classList.remove("hidden");
  loadPortal();
};

// === Load Portal ===
function loadPortal(){
  subjectSelect.innerHTML = "";
  subjects.forEach(s => {
    const op = document.createElement("option");
    op.textContent = s;
    subjectSelect.appendChild(op);
  });
  renderPortal();
  subjectSelect.onchange = renderPortal;
}

// === Render Portal Table ===
function renderPortal(){
  const subject = subjectSelect.value;
  const body = document.getElementById("portalBody");
  body.innerHTML = "";

  let pass = 0, fail = 0, sum = 0;

  students.forEach((s,i)=>{
    const m = allMarks[subject][i];
    const a1 = Number(m.a1) || 0;
    const a2 = Number(m.a2) || 0;
    const mcq1 = Number(m.mcq1) || 0;
    const mcq2 = Number(m.mcq2) || 0;
    const iat = Number(m.iat) || 0;
    const boost = Number(m.boost) || 0;

    const iat60 = iat * 0.6;
    const total = iat60 + a1 + a2 + mcq1 + mcq2 + boost;
let grade = "*";

if(total){
   if(total >= 91) grade="O";
   else if(total >=81) grade="A+";
   else if(total >=71) grade="A";
   else if(total >=61) grade="B";
   else if(total >=51) grade="C";
   else if(total ==50) grade="PASS";
   else grade="FAIL";
}
    if(total >= 50) pass++; else fail++;
    sum += total;

    const row = document.createElement("tr");
    if(total < 50) row.classList.add("fail");

    row.innerHTML = `
      <td>${i+1}</td>
      <td>${s}</td>
      <td><input value="${iat}" onchange="allMarks['${subject}'][${i}].iat=this.value;renderPortal()"></td>
      <td>${iat60.toFixed(2)}</td>
      <td>${a1}</td>
      <td>${a2}</td>
      <td>${mcq1}</td>
      <td>${mcq2}</td>
      <td><input value="${boost}" onchange="allMarks['${subject}'][${i}].boost=this.value;renderPortal()"></td>
      <td>${total.toFixed(2)}</td>
      <td>${grade}</td>
    `;

    body.appendChild(row);
  });

  const avg = (sum / students.length).toFixed(2);
  document.getElementById("avg").innerText = "Average % : " + avg;
  document.getElementById("pass").innerText = "Pass : " + pass;
  document.getElementById("fail").innerText = "Fail : " + fail;

  updateCharts(pass, fail);
}

// === Update Charts ===
function updateCharts(pass, fail){
  if(barChart) barChart.destroy();
  if(pieChart) pieChart.destroy();

  // Bar Chart
  barChart = new Chart(barChartCanvas, {
    type: "bar",
    data: {
      labels: ["Pass", "Fail"],
      datasets: [{data:[pass, fail], backgroundColor:["#4caf50","#f44336"]}]
    },
    options: {
      responsive: true,
      plugins: { legend: { display:false } }
    }
  });

  // Pie Chart
  pieChart = new Chart(pieChartCanvas, {
    type: "pie",
    data: {
      labels: ["Pass", "Fail"],
      datasets: [{
        data:[pass, fail],
        backgroundColor:["#4caf50","#f44336"],
        borderColor:"#fff",
        borderWidth:1
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position:"bottom" } }
    }
  });
}

// === Download PDF ===
downloadPdf.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape");

  subjects.forEach((s,i)=>{
    if(i>0) doc.addPage();
    doc.text(s, 10, 10);

    const data = [];
    students.forEach((name,j)=>{
      const m = allMarks[s][j];
      const iat = Number(m.iat) || 0;
      const iat60 = iat * 0.6;
      const total = iat60 + Number(m.a1) + Number(m.a2) + Number(m.mcq1) + Number(m.mcq2) + Number(m.boost);
      data.push([j+1, name, iat, iat60, m.a1, m.a2, m.mcq1, m.mcq2, m.boost, total]);
    });

    doc.autoTable({
      head:[["ID","Name","IAT","IAT60","A1","A2","MCQ1","MCQ2","Boost","Total"]],
      body:data
    });
  });

  doc.save("StudentMarks.pdf");
};
const downloadExcel = document.getElementById("downloadExcel");

downloadExcel.onclick = () => {

const subject = subjectSelect.value;

let data = [
["ID","Name","IAT","IAT60","A1","A2","MCQ1","MCQ2","Boost","Total"]
];

students.forEach((name,i)=>{

const m = allMarks[subject][i];

const iat = Number(m.iat)||0;
const iat60 = iat*0.6;

const total = iat60 +
Number(m.a1) +
Number(m.a2) +
Number(m.mcq1) +
Number(m.mcq2) +
Number(m.boost);

data.push([
i+1,
name,
iat,
iat60,
m.a1,
m.a2,
m.mcq1,
m.mcq2,
m.boost,
total
]);

});

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, ws, "Marks");

XLSX.writeFile(wb, "StudentMarks.xlsx");

};
document.getElementById("backToEntry").onclick = () => {
  portalPage.classList.add("hidden");
  marksEntryPage.classList.remove("hidden");
};