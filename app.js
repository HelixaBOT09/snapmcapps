const STORAGE_KEY = "snapmc_demo_applications_v1";

const form = document.getElementById("applicationForm");
const message = document.getElementById("formMessage");
const dashboardContent = document.getElementById("dashboardContent");

function readApplications() {
try {
return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
} catch {
return [];
}
}

function saveApplications(items) {
localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Submit application to Netlify Forms and save a local demo copy.
form.addEventListener("submit", async (event) => {
event.preventDefault();

const submitButton = form.querySelector('button[type="submit"]');
submitButton.disabled = true;
message.textContent = "Submitting application...";

try {
const formData = new FormData(form);
formData.set("form-name", "staff-applications");

const response = await fetch("/", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: new URLSearchParams(formData).toString()
});

if (!response.ok) {
  throw new Error("Submission failed");
}

const items = readApplications();

items.push({
  id: Date.now().toString(),
  ign: formData.get("ign"),
  discord: formData.get("discord"),
  age: formData.get("age"),
  timezone: formData.get("timezone"),
  role: formData.get("role"),
  experience: formData.get("experience"),
  hours: formData.get("hours"),
  mic: formData.get("mic"),
  motivation: formData.get("motivation"),
  hacker: formData.get("hacker"),
  abuse: formData.get("abuse"),
  extra: formData.get("extra"),
  status: "Pending",
  submittedAt: new Date().toISOString()
});

saveApplications(items);
message.textContent = "Application submitted successfully!";
form.reset();

if (!dashboardContent.hidden) {
  renderDashboard();
}

} catch (error) {
message.textContent = "Submission failed. Please try again.";
} finally {
submitButton.disabled = false;
}
});

// Demo dashboard unlock.
document.getElementById("unlockBtn").addEventListener("click", () => {
const pin = document.getElementById("adminPin").value;

if (pin !== "snapdemo") {
alert("Demo PIN is incorrect. Try: snapdemo");
return;
}

dashboardContent.hidden = false;
renderDashboard();
});

// Render applications and Accept / Denied buttons.
function renderDashboard() {
const items = readApplications();

document.getElementById("totalCount").textContent = items.length;
document.getElementById("pendingCount").textContent =
items.filter(item => item.status === "Pending").length;
document.getElementById("acceptedCount").textContent =
items.filter(item => item.status === "Accepted").length;
document.getElementById("deniedCount").textContent =
items.filter(item => item.status === "Denied").length;

const tbody = document.getElementById("applicationsRows");
tbody.replaceChildren();

items.forEach(item => {
const tr = document.createElement("tr");

[item.ign, item.role, item.submittedAt
  ? new Date(item.submittedAt).toLocaleDateString()
  : "—"
].forEach(value => {
  const td = document.createElement("td");
  td.textContent = value || "—";
  tr.appendChild(td);
});

const statusTd = document.createElement("td");
const badge = document.createElement("span");
badge.className = "status " + item.status;
badge.textContent = item.status;
statusTd.appendChild(badge);
tr.appendChild(statusTd);

const actionTd = document.createElement("td");

const acceptButton = document.createElement("button");
acceptButton.type = "button";
acceptButton.textContent = "Accept ✓";
acceptButton.className = "btn";
acceptButton.style.margin = "3px";
acceptButton.disabled = item.status === "Accepted";

acceptButton.addEventListener("click", () => {
  updateStatus(item.id, "Accepted");
});

const denyButton = document.createElement("button");
denyButton.type = "button";
denyButton.textContent = "Denied ✕";
denyButton.className = "btn";
denyButton.style.margin = "3px";
denyButton.disabled = item.status === "Denied";

denyButton.addEventListener("click", () => {
  updateStatus(item.id, "Denied");
});

actionTd.append(acceptButton, denyButton);
tr.appendChild(actionTd);
tbody.appendChild(tr);

});

document.getElementById("emptyState").hidden = items.length > 0;
}

function updateStatus(id, status) {
const items = readApplications().map(item =>
item.id === id ? { ...item, status } : item
);

saveApplications(items);
renderDashboard();
}

// Export demo applications as CSV.
document.getElementById("exportBtn").addEventListener("click", () => {
const items = readApplications();

if (!items.length) {
alert("There are no demo applications to export yet.");
return;
}

const columns = [
"ign", "discord", "age", "timezone", "role", "experience",
"hours", "mic", "motivation", "hacker", "abuse", "extra",
"status", "submittedAt"
];

const csvCell = value =>
'"' + String(value ?? "").replaceAll('"', '""').replaceAll("\n", " ") + '"';

const csv = [
columns.join(","),
...items.map(item =>
columns.map(key => csvCell(item[key])).join(",")
)
].join("\n");

const blob = new Blob([csv], {
type: "text/csv;charset=utf-8"
});

const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "snapmc-demo-applications.csv";
link.click();
URL.revokeObjectURL(url);
});
