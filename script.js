// CUSTOM CURSOR
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top  = my + "px";
});
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll("a, button, .project-card, .edu-card, .work-item, .cert-card, .contact-card").forEach(el => {
  el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
});

// HERO CANVAS — floating particles
const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? "139,127,255" : "0,229,160";
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,127,255,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// NAV
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  highlightNav();
});
function highlightNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  let current = "";
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
}

// HAMBURGER
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// WORK ACCORDION
function toggleWork(el) {
  const isOpen = el.classList.contains("open");
  document.querySelectorAll(".work-item").forEach(i => i.classList.remove("open"));
  if (!isOpen) el.classList.add("open");
}

// SCROLL REVEAL
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal, .work-item, .project-card, .edu-card, .cert-card, .skill-group, .contact-card").forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = `opacity 0.55s ${i * 0.05}s ease, transform 0.55s ${i * 0.05}s ease`;
  revealObs.observe(el);
});
const style = document.createElement("style");
style.textContent = `.visible{opacity:1!important;transform:translateY(0)!important}`;
document.head.appendChild(style);

// PROJECT DATA
const projects = {
  trendscout: {
    title: "📡 TrendScout",
    overview: "A serverless trend-analytics platform built in production at Edstem Technologies. Ingests real-time data from Twitter/X, Reddit, YouTube, and RSS feeds across 35+ AWS Lambda functions.",
    what: [
      "Built core REST API endpoints (trend listings, dashboard summaries, saved-posts with point-in-time snapshots) on AWS Lambda backed by DynamoDB and OpenSearch",
      "Designed a surge-detection pipeline consuming DynamoDB Streams, comparing OldImage/NewImage deltas in-memory to flag percentage-based engagement spikes with zero additional reads",
      "Used conditional compare-and-swap writes to guarantee exactly-once alert firing per keyword",
      "Designed tiered storage — Hot (OpenSearch), Warm (S3), Cold (Glacier) — with lifecycle policies and restore procedures",
      "Provisioned DynamoDB with Streams + GSI for real-time trending queries and hourly rollups",
      "Designed Step Functions state machines orchestrating trend-ranking and surge-detection workflows",
      "Authored Terraform modules (S3, IAM, Lambda, EventBridge/Pipes) and CI/CD via GitHub Actions with AWS OIDC federation",
      "Integrated Gemini API for real-time topic classification with time-boxing logic to meet Lambda execution deadlines",
      "Used Claude Code across the full SDLC — scaffolding, debugging, test coverage, code review",
      "Cut read cost on a high-traffic write path by replacing full table scan with a targeted COUNT query",
      "Diagnosed and fixed production defects including a re-fetch overwrite bug and OpenSearch concurrency/field-mapping conflicts",
      "Rolled out versioned API routes with deprecation headers with zero disruption to existing clients",
      "Set up rate limiting, IAM least-privilege access controls, and CloudWatch alarms for production"
    ],
    stack: ["AWS Lambda","DynamoDB Streams","OpenSearch","S3","Glacier","Step Functions","EventBridge Pipes","API Gateway","Gemini API","Terraform","GitHub Actions","AWS OIDC","CloudWatch","IAM","Python"]
  },
  library: {
    title: "📚 Library Checkout Pipeline",
    overview: "An AWS data pipeline to ingest and manage library checkout data with both full-load and incremental CDC processing.",
    what: [
      "Designed staging and primary data layers in MySQL on Amazon RDS",
      "Supported both full-load and incremental (CDC) processing patterns",
      "Automated ETL workflows using AWS Lambda triggered on schedule",
      "Tracked metadata and lineage through AWS Glue Data Catalog",
      "Used S3 as intermediate staging layer between ingestion and transformation",
      "Secured networking via VPC with private subnets and security groups"
    ],
    stack: ["AWS Lambda","Amazon RDS","Amazon S3","AWS Glue","MySQL","VPC","Python"]
  },
  physio: {
    title: "💓 Physiological Data Pipeline",
    overview: "A pipeline to synchronize and process 2.7GB of multi-rate physiological sensor data from chest- and wrist-worn devices.",
    what: [
      "Synchronized 4 sampling rates: 700Hz ECG/respiration/chest accelerometer, 64Hz PPG, 32Hz wrist accelerometer, 4Hz EDA/temperature",
      "Implemented device-specific parsing and clock-drift-aware time alignment",
      "Built resampling and epoch summarization at 1-second and 30-second windows",
      "Derived metrics including ECG-based heart rate and movement intensity",
      "Built a quality-control layer to detect sensor disconnections and motion artifacts",
      "Generated per-subject data quality reports",
      "Memory-efficient batch processing for 2.7GB of multi-format sensor data"
    ],
    stack: ["Python","Pandas","NumPy","Signal Processing","Batch Processing"]
  },
  retail: {
    title: "🛒 Retail Store Chain Analysis",
    overview: "A large-scale retail analytics pipeline analyzing sales patterns, customer behavior, and regional trends.",
    what: [
      "Built end-to-end data pipeline for retail sales and customer behavior data",
      "Cleaned and processed large-scale datasets using Python and PySpark",
      "Stored and queried structured data using PostgreSQL",
      "Applied exploratory data analysis to identify regional trends",
      "Used forecasting techniques to surface business insights"
    ],
    stack: ["Python","PySpark","PostgreSQL","Pandas","Matplotlib"]
  },
  essay: {
    title: "✍️ Automated Essay Scoring",
    overview: "An automated essay scoring system using machine learning, deep learning, and NLP with a Flask web interface.",
    what: [
      "Built and evaluated an LSTM-based neural network for essay quality scoring",
      "Applied NLP preprocessing: tokenization, stopword removal, feature engineering",
      "Evaluated model performance using regression and ranking metrics",
      "Compared LSTM performance against traditional ML baselines",
      "Built a Flask web app to make scoring accessible through a simple UI"
    ],
    stack: ["Python","TensorFlow","LSTM","NLP","Scikit-learn","Flask"]
  },
  olympics: {
    title: "🏅 Olympics Medal Predictor",
    overview: "A machine learning app analyzing historical Olympics data to predict medal outcomes with an interactive Streamlit dashboard.",
    what: [
      "Performed data cleaning, EDA, and feature engineering on historical Olympics dataset",
      "Built ML models to predict medal outcomes by country and athlete",
      "Evaluated model accuracy and feature importance",
      "Built an interactive Streamlit app to visualize insights and predictions",
      "Included filters by year, country, sport, and event"
    ],
    stack: ["Python","Scikit-learn","Pandas","Streamlit","Matplotlib","Seaborn"]
  }
};

// EDUCATION DATA
const education = {
  mca: {
    title: "Master of Computer Applications",
    uni: "APJ Abdul Kalam Technological University · 2022 – 2024",
    score: "90% · Top 5 of class",
    about: "Two-year postgraduate program covering advanced computer science, machine learning, cloud computing, and software engineering.",
    subjects: [
      {name:"Machine Learning",score:"A+"},{name:"Deep Learning",score:"A+"},
      {name:"Natural Language Processing",score:"A+"},{name:"Cloud Computing",score:"A"},
      {name:"Data Structures & Algorithms",score:"A+"},{name:"Database Management",score:"A+"},
      {name:"Software Engineering",score:"A"},{name:"Computer Networks",score:"A"},
      {name:"Operating Systems",score:"A+"},{name:"Python Programming",score:"A+"},
      {name:"Web Technologies",score:"A"},{name:"Research Methodology",score:"A"}
    ]
  },
  bca: {
    title: "Bachelor of Computer Applications",
    uni: "Calicut University · 2019 – 2022",
    score: "91% · University 3rd Rank · Chief Minister's Student Excellence Award",
    about: "Three-year undergraduate program covering core computer science, programming, mathematics, and databases.",
    subjects: [
      {name:"C Programming",score:"A+"},{name:"Data Structures",score:"A+"},
      {name:"Java Programming",score:"A+"},{name:"Database Management",score:"A+"},
      {name:"Mathematics",score:"A+"},{name:"Computer Networks",score:"A"},
      {name:"Operating Systems",score:"A+"},{name:"Web Design",score:"A"},
      {name:"Software Engineering",score:"A+"},{name:"Python",score:"A+"},
      {name:"Statistics",score:"A"},{name:"Computer Architecture",score:"A"}
    ]
  }
};

// OPEN MODAL
function openModal(key) {
  const p = projects[key];
  const e = education[key];
  if (p) {
    document.getElementById("projectModalContent").innerHTML = `
      <div class="modal-title">${p.title}</div>
      <div class="modal-section"><h4>Overview</h4><p>${p.overview}</p></div>
      <div class="modal-section"><h4>What I did</h4><ul>${p.what.map(w=>`<li>${w}</li>`).join("")}</ul></div>
      <div class="modal-section"><h4>Stack</h4><div class="modal-tags">${p.stack.map(s=>`<span>${s}</span>`).join("")}</div></div>
    `;
    document.getElementById("projectModal").classList.add("open");
  }
  if (e) {
    document.getElementById("eduModalContent").innerHTML = `
      <div class="modal-title">${e.title}</div>
      <div style="font-size:0.85rem;color:var(--muted);margin-bottom:0.3rem;">${e.uni}</div>
      <div style="font-size:0.9rem;color:var(--accent);font-weight:700;margin-bottom:1.75rem;">${e.score}</div>
      <div class="modal-section"><h4>About</h4><p>${e.about}</p></div>
      <div class="modal-section">
        <h4>Subjects & Grades</h4>
        <div class="subject-grid">${e.subjects.map(s=>`
          <div class="subject-item">
            <div class="subject-name">${s.name}</div>
            <div class="subject-score">${s.score}</div>
          </div>`).join("")}
        </div>
      </div>
    `;
    document.getElementById("eduModal").classList.add("open");
  }
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeModal("projectModal"); closeModal("eduModal"); }
});
