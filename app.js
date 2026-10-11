const STORAGE_KEY = "snapmc_demo_applications_v1";
const form = document.getElementById("applicationForm");
const message = document.getElementById("formMessage");
const dashboardContent = document.getElementById("dashboardContent");

function readApplications() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveApplications(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  data.id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  data.status = "Pending";
  data.submittedAt = new Date().toISOString();
  const items = readApplications();
  items.unshift(data);
  saveApplications(items);
  form.reset();
  message.textContent = "Demo application saved on this device. It has not been sent to a real staff team.";
  renderDashboard();
});
document.getElementById("unlockBtn").addEventListener("click", () => {
  if (document.getElementById("adminPin").value !== "snapdemo") {
    alert("Demo PIN incorrect. For this local prototype, use: snapdemo");
    return;
  }
  dashboardContent.hidden = false;
  renderDashboard();
});
function renderDashboard() {
  const items = readApplications();
  document.getElementById("totalCount").textContent = items.length;
  document.getElementById("pendingCount").textContent = items.filter(x => x.status === "Pending").length;
  document.getElementById("acceptedCount").textContent = items.filter(x => x.status === "Accepted").length;
  document.getElementById("deniedCount").textContent = items.filter(x => x.status === "Denied").length;
  const tbody = document.getElementById("applicationsRows");
  tbody.replaceChildren();
  items.forEach(item => {
    if (item.status === "Pending") return;
    const tr = document.createElement("tr");
    const values = [item.ign, item.role, new Date(item.submittedAt).toLocaleDateString()];
    values.forEach(value => { const td = document.createElement("td"); td.textContent = value || "—"; tr.appendChild(td); });
    const statusTd = document.createElement("td");
    const badge = document.createElement("span"); badge.className = "status " + item.status; badge.textContent = item.status; statusTd.appendChild(badge); tr.appendChild(statusTd);
    const actionTd = document.createElement("td");
    const select = document.createElement("select");
    ["Pending","Interview","Accepted","Denied"].forEach(status => {
      const option = document.createElement("option"); option.value = status; option.textContent = status; option.selected = item.status === status; select.appendChild(option);
    });
    select.addEventListener("change", () => {
      const updated = readApplications().map(x => x.id === item.id ? {...x, status: select.value} : x);
      saveApplications(updated); renderDashboard();
    });
    actionTd.appendChild(select); tr.appendChild(actionTd); tbody.appendChild(tr);
  });
  document.getElementById("emptyState").hidden = items.length > 0;
}
document.getElementById("exportBtn").addEventListener("click", () => {
  const items = readApplications();
  if (!items.length) { alert("There are no demo applications to export yet."); return; }
  const columns = ["ign","discord","age","timezone","role","experience","hours","mic","motivation","hacker","abuse","extra","status","submittedAt"];
  const csvCell = value => '"' + String(value ?? "").replaceAll('"','""').replaceAll("\n"," ") + '"';
  const csv = [columns.join(","), ...items.map(item => columns.map(key => csvCell(item[key])).join(","))].join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "snapmc-demo-applications.csv"; a.click();
  URL.revokeObjectURL(url);
});
