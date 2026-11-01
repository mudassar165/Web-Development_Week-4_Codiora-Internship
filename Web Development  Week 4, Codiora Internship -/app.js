const jobs = [
  {
    id: "j1", title: "Build a thoughtful online home for a ceramics studio", category: "Web Development", budgetMin: 1800, budgetMax: 3200,
    skills: ["Shopify", "Liquid", "E-commerce", "UX"], level: "Intermediate", type: "One-time", duration: "1–3 months", proposals: 8, posted: 0, client: "Mina R.", initials: "MR", clientNote: "Owner at Good Earth Studio",
    description: "We're a small-batch ceramics studio getting ready to open our first online shop. Looking for a developer to build a simple, warm storefront that lets the work speak for itself, with thoughtful product pages and an easy-to-manage back end."
  },
  {
    id: "j2", title: "Design a calm, clear dashboard for our climate data", category: "Design & Creative", budgetMin: 900, budgetMax: 1500,
    skills: ["Figma", "Dashboard", "Data visualization", "UI design"], level: "Intermediate", type: "One-time", duration: "Less than 1 month", proposals: 12, posted: 1, client: "Alex T.", initials: "AT", clientNote: "Product lead at Fieldnotes", 
    description: "Fieldnotes helps local organizations understand their environmental footprint. We need an experienced product designer to turn our dense reporting into a legible dashboard people actually want to use. Existing flows and data are ready; we need your eye."
  },
  {
    id: "j3", title: "A sharp, human voice for a new independent journal", category: "Writing & Content", budgetMin: 400, budgetMax: 850,
    skills: ["Brand voice", "Editorial", "Copywriting", "Research"], level: "Entry level", type: "Ongoing", duration: "1–3 months", proposals: 6, posted: 2, client: "Jordan P.", initials: "JP", clientNote: "Editor at Open House Journal",
    description: "We're launching a small journal about the people making our cities more interesting. We need a writer to shape our newsletter voice, write a first run of short profiles, and help us set up a style guide that feels distinctly ours."
  },
  {
    id: "j4", title: "Make our React app feel quick, focused, and accessible", category: "Web Development", budgetMin: 2400, budgetMax: 4200,
    skills: ["React", "TypeScript", "Accessibility", "Performance"], level: "Expert", type: "One-time", duration: "1–3 months", proposals: 4, posted: 3, client: "Sam K.", initials: "SK", clientNote: "Founder at Common Thread",
    description: "Our small team has built a useful community platform, but it's time for a careful front-end pass. The work includes auditing our core flows, smoothing out interaction rough spots, and improving keyboard and screen-reader access. No redesign for redesign's sake."
  },
  {
    id: "j5", title: "Help a neighborhood food co-op find its people", category: "Marketing", budgetMin: 600, budgetMax: 1100,
    skills: ["Email marketing", "Community", "Strategy", "Analytics"], level: "Entry level", type: "Ongoing", duration: "Ongoing", proposals: 15, posted: 4, client: "Priya D.", initials: "PD", clientNote: "Community lead at The Table",
    description: "The Table is a new member-owned food co-op with a good story and a tiny marketing team. We'd love an independent marketer to help us build a warm welcome email series, improve local discovery, and make sense of our newsletter metrics."
  },
  {
    id: "j6", title: "Turn our founder interviews into a short film series", category: "Video & Animation", budgetMin: 1300, budgetMax: 2500,
    skills: ["Video editing", "Storytelling", "Motion graphics", "Premiere Pro"], level: "Expert", type: "One-time", duration: "1–3 months", proposals: 3, posted: 5, client: "Luca N.", initials: "LN", clientNote: "Producer at Small Hours Studio",
    description: "We have six hours of filmed conversations with the people who started some of our favorite independent businesses. Help us shape the footage into three honest, engaging short films for our upcoming launch. The footage is organized and ready."
  }
];

const profileImages = {
  "Mina R.": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces",
  "Alex T.": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces",
  "Jordan P.": "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=96&h=96&fit=crop&crop=faces",
  "Sam K.": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=faces",
  "Priya D.": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=faces",
  "Luca N.": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=96&h=96&fit=crop&crop=faces"
};

const storageKeys = { proposals: "codiora-proposals", saved: "codiora-saved", customJobs: "codiora-custom-jobs" };
const readStorage = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
let proposals = readStorage(storageKeys.proposals, []);
let savedJobIds = readStorage(storageKeys.saved, []);
let customJobs = readStorage(storageKeys.customJobs, []);
let activeView = "jobs";
let toastTimer;

const elements = {
  jobList: document.querySelector("#job-list"),
  emptyState: document.querySelector("#empty-state"),
  resultsCount: document.querySelector("#results-count"),
  category: document.querySelector("#category-filter"),
  search: document.querySelector("#search-input"),
  sort: document.querySelector("#sort-filter"),
  modalBackdrop: document.querySelector("#modal-backdrop"),
  modalContent: document.querySelector("#modal-content"),
  toast: document.querySelector("#toast")
};

const allJobs = () => [...customJobs, ...jobs];
const formatMoney = (amount) => `$${Number(amount).toLocaleString("en-US")}`;
const safeText = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const getJob = (id) => allJobs().find((job) => job.id === id);
const getProposalCount = (job) => job.proposals + proposals.filter((proposal) => proposal.jobId === job.id && proposal.status !== "Withdrawn").length;
const persist = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { showToast("Your changes could not be saved in this browser."); }
};

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 3000);
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".view").forEach((section) => {
    const active = section.id === `${view}-view`;
    section.classList.toggle("is-visible", active);
    section.hidden = !active;
  });
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("is-active", link.dataset.view === view));
  if (view === "proposals") renderProposals();
  if (view === "jobs") renderJobs();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function populateCategories() {
  const categories = [...new Set(allJobs().map((job) => job.category))].sort();
  document.querySelectorAll("[data-level-count]").forEach((count) => {
    count.textContent = String(allJobs().filter((job) => job.level === count.dataset.levelCount).length);
  });
  const current = elements.category.value;
  elements.category.innerHTML = '<option value="">All categories</option>' + categories.map((category) => `<option value="${safeText(category)}">${safeText(category)}</option>`).join("");
  if (categories.includes(current)) elements.category.value = current;
}

function getFilteredJobs() {
  const query = elements.search.value.trim().toLowerCase();
  const category = elements.category.value;
  const levels = [...document.querySelectorAll('input[name="level"]:checked')].map((input) => input.value);
  const types = [...document.querySelectorAll('input[name="type"]:checked')].map((input) => input.value);
  const minimum = Number(document.querySelector("#budget-min").value) || 0;
  const maximum = Number(document.querySelector("#budget-max").value) || Infinity;
  const results = allJobs().filter((job) => {
    const searchable = `${job.title} ${job.category} ${job.description} ${job.skills.join(" ")}`.toLowerCase();
    return (!query || searchable.includes(query)) && (!category || job.category === category) && (!levels.length || levels.includes(job.level)) && (!types.length || types.includes(job.type)) && job.budgetMax >= minimum && job.budgetMin <= maximum;
  });
  const sort = elements.sort.value;
  if (sort === "newest") results.sort((a, b) => a.posted - b.posted);
  if (sort === "budget-high") results.sort((a, b) => b.budgetMax - a.budgetMax);
  if (sort === "budget-low") results.sort((a, b) => a.budgetMin - b.budgetMin);
  if (sort === "proposals-low") results.sort((a, b) => a.proposals - b.proposals);
  return results;
}

function renderJobs() {
  populateCategories();
  const results = getFilteredJobs();
  elements.resultsCount.textContent = `${results.length} ${results.length === 1 ? "project" : "projects"} to explore`;
  elements.emptyState.hidden = results.length > 0;
  elements.jobList.hidden = results.length === 0;
  elements.jobList.innerHTML = results.map((job) => {
    const saved = savedJobIds.includes(job.id);
    const postedLabel = job.posted === 0 ? "Today" : `${job.posted} day${job.posted === 1 ? "" : "s"} ago`;
    return `<article class="job-card">
      <div class="job-card-top"><div class="job-heading"><p class="job-category">${safeText(job.category)} <span aria-hidden="true">·</span> ${safeText(job.level)}</p><button class="job-title-button" data-details="${safeText(job.id)}" type="button">${safeText(job.title)}</button></div><button class="bookmark-button${saved ? " is-saved" : ""}" data-save="${safeText(job.id)}" type="button" aria-label="${saved ? "Remove saved job" : "Save job"}" aria-pressed="${saved}">${saved ? "★" : "☆"}</button></div>
      <p class="job-budget"><span>Fixed price</span>${formatMoney(job.budgetMin)} – ${formatMoney(job.budgetMax)}</p>
      <p class="job-description">${safeText(job.description)}</p>
      <div class="skill-list">${job.skills.map((skill) => `<span class="skill-chip">${safeText(skill)}</span>`).join("")}</div>
      <div class="job-card-bottom"><div class="job-meta"><span class="client-meta"><img class="client-avatar" src="${profileImages[job.client] ?? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"}" alt="" loading="lazy">${safeText(job.client)}</span><span><i class="meta-dot"></i>${postedLabel}</span><span>${getProposalCount(job)} proposals</span><span>${safeText(job.duration)}</span></div><div class="card-actions"><button class="button button-outline" data-details="${safeText(job.id)}" type="button">Details</button><button class="button button-green" data-apply="${safeText(job.id)}" type="button">Apply <span aria-hidden="true">↗</span></button></div></div>
    </article>`;
  }).join("");
}

function openModal(content) {
  elements.modalContent.innerHTML = content;
  elements.modalBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#modal-close").focus();
}

function closeModal() {
  elements.modalBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function openJobDetails(jobId) {
  const job = getJob(jobId);
  if (!job) return showToast("This project is no longer available.");
  openModal(`<p class="modal-kicker">${safeText(job.category)} · ${safeText(job.level)}</p>
    <h2 class="modal-title" id="modal-title">${safeText(job.title)}</h2>
    <p class="modal-subtitle">Posted by ${safeText(job.client)} · ${safeText(job.clientNote)}</p>
    <div class="detail-budget"><div><span>Fixed price budget</span><br><strong>${formatMoney(job.budgetMin)} – ${formatMoney(job.budgetMax)}</strong></div><span>${safeText(job.type)}</span></div>
    <div class="detail-section"><h3>About the project</h3><p>${safeText(job.description)}</p></div>
    <div class="detail-section"><h3>Skills we're looking for</h3><div class="skill-list">${job.skills.map((skill) => `<span class="skill-chip">${safeText(skill)}</span>`).join("")}</div></div>
    <div class="detail-facts"><div class="detail-fact"><span>Experience</span><strong>${safeText(job.level)}</strong></div><div class="detail-fact"><span>Timeline</span><strong>${safeText(job.duration)}</strong></div><div class="detail-fact"><span>Proposals</span><strong>${getProposalCount(job)}</strong></div></div>
    <div class="modal-actions"><button class="button button-outline" data-save="${safeText(job.id)}" type="button">${savedJobIds.includes(job.id) ? "★ Saved" : "☆ Save project"}</button><button class="button button-green" data-apply="${safeText(job.id)}" type="button">Send a proposal <span aria-hidden="true">↗</span></button></div>`);
}

function openProposalForm(jobId) {
  const job = getJob(jobId);
  if (!job) return showToast("This project is no longer available.");
  const alreadyApplied = proposals.some((proposal) => proposal.jobId === job.id && proposal.status !== "Withdrawn");
  if (alreadyApplied) return showToast("You have already applied to this project.");
  openModal(`<p class="modal-kicker">YOUR NEXT STEP</p><h2 class="modal-title" id="modal-title">Send a proposal</h2><p class="modal-subtitle">For: ${safeText(job.title)}</p>
    <form class="proposal-form" id="proposal-form" novalidate data-job-id="${safeText(job.id)}">
      <label class="form-field"><span>Cover letter <b>*</b></span><textarea name="coverLetter" required minlength="40" maxlength="1800" rows="6" placeholder="Tell the client what you understand about the project, how you’d approach it, and why you’re a good fit."></textarea><small>At least 40 characters. A specific, thoughtful note goes a long way.</small></label>
      <div class="form-grid"><label class="form-field"><span>Your price (USD) <b>*</b></span><div class="input-with-prefix"><span>$</span><input name="price" type="number" required min="1" max="1000000" placeholder="1,200"></div></label><label class="form-field"><span>Delivery time <b>*</b></span><div class="input-with-prefix"><input name="delivery" type="number" required min="1" max="365" placeholder="14"><span>days</span></div></label></div>
      <label class="form-field"><span>Relevant experience & skills <b>*</b></span><textarea name="experience" required minlength="20" maxlength="800" rows="3" placeholder="Share related work, experience, or skills that make you a great fit."></textarea></label>
      <p class="proposal-tips">Your proposal is sent directly to the client. You can track its status in My proposals.</p>
      <div class="modal-actions"><button class="button button-outline" type="button" data-close-modal>Cancel</button><button class="button button-green" type="submit">Submit proposal <span aria-hidden="true">↗</span></button></div>
    </form>`);

  const proposalForm = document.getElementById("proposal-form");
  proposalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!proposalForm.checkValidity()) {
      proposalForm.reportValidity();
      return;
    }
    const formData = new FormData(proposalForm);
    proposals.push({
      id: `p-${Date.now()}`,
      jobId: proposalForm.dataset.jobId,
      status: "In review",
      price: Number(formData.get("price")),
      delivery: Number(formData.get("delivery")),
      skills: formData.get("experience").toString().trim(),
      coverLetter: formData.get("coverLetter").toString().trim(),
      experience: formData.get("experience").toString().trim(),
      submittedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
    });
    persist(storageKeys.proposals, proposals);
    closeModal();
    renderProposals();
    showToast("Your proposal has been sent.");
    renderJobs();
  });
}

function renderProposals() {
  const summary = document.querySelector("#proposal-summary");
  const list = document.querySelector("#proposal-list");
  const active = proposals.filter((proposal) => proposal.status !== "Withdrawn").length;
  const withdrawn = proposals.length - active;
  document.querySelector("#proposal-count").textContent = String(active);
  summary.innerHTML = `<div class="summary-item"><strong>${proposals.length}</strong><span>sent</span></div><div class="summary-item"><strong>${active}</strong><span>active</span></div><div class="summary-item"><strong>${withdrawn}</strong><span>withdrawn</span></div>`;
  if (!proposals.length) {
    list.innerHTML = '<div class="proposal-empty"><span class="proposal-empty-mark" aria-hidden="true">↗</span><h2>Your next opportunity starts here.</h2><p>You haven’t sent any proposals yet. Find a project that feels like a good fit and introduce yourself.</p><button class="button button-green" data-go-jobs type="button">Find a project <span aria-hidden="true">↗</span></button></div>';
    return;
  }
  list.innerHTML = [...proposals].reverse().map((proposal) => {
    const job = getJob(proposal.jobId);
    return `<article class="proposal-card"><div class="proposal-card-head"><div><h2>${safeText(job?.title ?? "Project no longer available")}</h2><p>Sent ${safeText(proposal.submittedAt)} · ${safeText(job?.category ?? "Project")}</p></div><span class="status-badge${proposal.status === "Withdrawn" ? " withdrawn" : ""}">${safeText(proposal.status)}</span></div><div class="proposal-card-bottom"><div class="proposal-card-meta"><span><strong>${formatMoney(proposal.price)}</strong> proposed</span><span>${safeText(proposal.delivery)} days delivery</span><span>${safeText(proposal.skills)}</span></div>${proposal.status !== "Withdrawn" ? `<button class="withdraw-button" data-withdraw="${safeText(proposal.id)}" type="button">Withdraw proposal</button>` : ""}</div></article>`;
  }).join("");
}

function validateForm(form) {
  form.querySelectorAll("[required]").forEach((field) => field.setCustomValidity(""));
  if (form.id === "post-form") {
    const minimum = Number(form.elements.budgetMin.value);
    const maximum = Number(form.elements.budgetMax.value);
    if (minimum && maximum && minimum > maximum) form.elements.budgetMax.setCustomValidity("Maximum budget must be at least the minimum budget.");
  }
  const invalid = form.querySelector(":invalid");
  if (invalid) {
    invalid.reportValidity();
    invalid.focus();
    return false;
  }
  return true;
}

document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", () => setView(link.dataset.view)));
document.querySelector("#open-post-job").addEventListener("click", () => setView("post"));
document.querySelectorAll("[data-go-jobs]").forEach((button) => button.addEventListener("click", () => setView("jobs")));
elements.search.addEventListener("input", renderJobs);
elements.category.addEventListener("change", renderJobs);
elements.sort.addEventListener("change", renderJobs);
document.querySelectorAll('input[name="level"], input[name="type"], #budget-min, #budget-max').forEach((input) => input.addEventListener("input", renderJobs));
document.querySelector("#search-button").addEventListener("click", renderJobs);

function clearFilters() {
  elements.search.value = "";
  elements.category.value = "";
  elements.sort.value = "newest";
  document.querySelectorAll('input[name="level"], input[name="type"]').forEach((input) => { input.checked = false; });
  document.querySelector("#budget-min").value = "";
  document.querySelector("#budget-max").value = "";
  renderJobs();
}

document.querySelector("#clear-filters").addEventListener("click", clearFilters);
document.querySelector("#empty-clear").addEventListener("click", clearFilters);
document.querySelector("#modal-close").addEventListener("click", closeModal);
elements.modalBackdrop.addEventListener("click", (event) => { if (event.target === elements.modalBackdrop) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !elements.modalBackdrop.hidden) closeModal(); });

document.addEventListener("click", (event) => {
  const details = event.target.closest("[data-details]");
  if (details) return openJobDetails(details.dataset.details);
  const apply = event.target.closest("[data-apply]");
  if (apply) return openProposalForm(apply.dataset.apply);
  const close = event.target.closest("[data-close-modal]");
  if (close) return closeModal();
  const save = event.target.closest("[data-save]");
  if (save) {
    const id = save.dataset.save;
    savedJobIds = savedJobIds.includes(id) ? savedJobIds.filter((savedId) => savedId !== id) : [...savedJobIds, id];
    persist(storageKeys.saved, savedJobIds);
    renderJobs();
    if (!elements.modalBackdrop.hidden) openJobDetails(id);
    showToast(savedJobIds.includes(id) ? "Project saved." : "Saved project removed.");
    return;
  }
  const withdraw = event.target.closest("[data-withdraw]");
  if (withdraw) {
    proposals = proposals.map((proposal) => proposal.id === withdraw.dataset.withdraw ? { ...proposal, status: "Withdrawn" } : proposal);
    persist(storageKeys.proposals, proposals);
    renderProposals();
    showToast("Proposal withdrawn.");
    return;
  }
});

document.getElementById("post-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateForm(form)) return;

  const formData = new FormData(form);
  const newJob = {
    id: `custom-${Date.now()}`,
    title: String(formData.get("title")).trim(),
    category: String(formData.get("category")),
    budgetMin: Number(formData.get("budgetMin")),
    budgetMax: Number(formData.get("budgetMax")),
    skills: String(formData.get("skills")).split(",").map((skill) => skill.trim()).filter(Boolean),
    level: String(formData.get("level")),
    type: String(formData.get("type")),
    duration: String(formData.get("duration")),
    proposals: 0,
    posted: 0,
    client: "You",
    initials: "YO",
    clientNote: "Project owner",
    description: String(formData.get("description")).trim()
  };

  customJobs = [newJob, ...customJobs];
  persist(storageKeys.customJobs, customJobs);
  form.reset();
  setView("jobs");
  renderJobs();
  showToast("Project published successfully.");
});

renderJobs();
setView("jobs");
