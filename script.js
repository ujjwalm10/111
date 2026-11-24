// 1. Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// 2. Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// 3. Dark / light theme (remembered between visits)
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
  themeBtn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
applyTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// 4. Typing effect in the hero
const words = ["clean websites", "responsive layouts", "interactive pages"];
const typed = document.getElementById("typed");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let w = 0, c = 0, deleting = false;

function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; return setTimeout(type, 1400); }
  if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 90);
}
if (reduceMotion) typed.textContent = words[0]; else type();

// 5. Skill bars fill when scrolled into view
const skillObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelector(".fill").style.width = entry.target.dataset.level + "%";
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll(".skill").forEach(s => skillObserver.observe(s));

// 6. Project filter
const chips = document.querySelectorAll(".chip");
const projects = document.querySelectorAll(".project");
chips.forEach(chip =>
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    projects.forEach(p => { p.hidden = filter !== "all" && p.dataset.type !== filter; });
  })
);

// 7. Highlight the current section in the nav
const navLinks = document.querySelectorAll(".nav a");
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

// 8. Contact form validation
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

function check(input, errId, message, valid) {
  const err = document.getElementById(errId);
  err.textContent = valid ? "" : message;
  input.classList.toggle("invalid", !valid);
  return valid;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = form.name, email = form.email, msg = form.message;
  const okName = check(name, "nameErr", "Enter your name.", name.value.trim().length >= 2);
  const okEmail = check(email, "emailErr", "Enter a valid email address.", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
  const okMsg = check(msg, "msgErr", "Write at least 10 characters.", msg.value.trim().length >= 10);

  if (okName && okEmail && okMsg) {
    // Opens the visitor's email app. Change the address to your own.
    const subject = encodeURIComponent("Portfolio message from " + name.value.trim());
    const body = encodeURIComponent(msg.value.trim() + "\n\nFrom: " + email.value.trim());
    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
    status.textContent = "Thanks. Your email app should open with your message ready to send.";
    form.reset();
  } else {
    status.textContent = "";
  }
});
