// ── TYPED TEXT ──
const titles = [
  "Data Engineer",
  "AWS Specialist",
  "Pipeline Builder",
  "GenAI Practitioner"
];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.querySelector(".typed-text");

function type() {
  const current = titles[ti];
  typedEl.textContent = deleting
    ? current.slice(0, --ci)
    : current.slice(0, ++ci);

  let delay = deleting ? 60 : 100;
  if (!deleting && ci === current.length) { delay = 1800; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % titles.length; delay = 400; }
  setTimeout(type, delay);
}
type();

// ── NAV SCROLL ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  highlightNav();
});

// ── ACTIVE NAV LINK ──
function highlightNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  let current = "";
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  links.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}

// ── HAMBURGER ──
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".timeline-item, .project-card, .cert-card, .edu-card, .stat-card").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".visible, [style*='opacity: 0']").forEach(() => {});
});

// add visible class via CSS
const style = document.createElement("style");
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);
