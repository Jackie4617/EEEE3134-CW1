"use strict";

const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const navigation = document.querySelector(".site-nav");
const mobileLayout = window.matchMedia("(max-width: 850px)");
const themeKey = "jaewon-portfolio-v2-theme";
const navSections = [...navigation.querySelectorAll("a")].map((link) => ({
  link,
  section: document.getElementById(link.hash.slice(1))
}));
let activeLink;
let scrollFrame = 0;

function setTheme(dark) {
  root.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

try {
  setTheme(localStorage.getItem(themeKey) === "dark");
} catch {
  setTheme(false);
}

themeToggle.addEventListener("click", () => {
  const dark = themeToggle.getAttribute("aria-pressed") === "false";
  setTheme(dark);

  try {
    localStorage.setItem(themeKey, root.dataset.theme);
  } catch {
    // The current page still changes theme when storage is unavailable.
  }
});

function setMenu(open) {
  header.toggleAttribute("data-menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "false";
  setMenu(open);
  if (open) {
    navigation.querySelector("a").focus({ preventScroll: true });
  }
});

header.addEventListener("click", (event) => {
  if (event.target.closest('a[href^="#"]')) {
    setMenu(false);
  }
});

document.addEventListener("click", (event) => {
  if (!header.contains(event.target)) {
    setMenu(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header.hasAttribute("data-menu-open")) {
    setMenu(false);
    menuToggle.focus();
  }
});

mobileLayout.addEventListener("change", () => {
  setMenu(false);
  if (mobileLayout.matches && navigation.contains(document.activeElement)) {
    menuToggle.focus();
  }
});

function updateScrollState() {
  scrollFrame = 0;
  const scrollRange = root.scrollHeight - root.clientHeight;
  const scrollTop = Math.min(Math.max(window.scrollY, 0), scrollRange);
  const progress = scrollRange > 0 ? scrollTop / scrollRange : 0;
  const readingLine = header.offsetHeight + 24;
  let current = navSections[0].link;

  for (const { link, section } of navSections) {
    if (section.getBoundingClientRect().top > readingLine) break;
    current = link;
  }

  if (scrollRange > 0 && scrollRange - scrollTop < 2) {
    current = navSections[navSections.length - 1].link;
  }

  header.style.setProperty("--scroll-progress", progress);

  if (current !== activeLink) {
    activeLink?.removeAttribute("aria-current");
    current.setAttribute("aria-current", "location");
    activeLink = current;
  }
}

function scheduleScrollUpdate() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
window.addEventListener("resize", scheduleScrollUpdate);
window.addEventListener("pageshow", scheduleScrollUpdate);

const projectControls = document.querySelector(".project-controls");
const projectButtons = [...projectControls.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll(".project-card")];
const projectCount = projectControls.querySelector(".project-count");

function filterProjects(selectedButton) {
  const category = selectedButton.dataset.filter;
  let count = 0;

  for (const card of projectCards) {
    const matches = category === "all" || card.dataset.topics.split(" ").includes(category);
    card.hidden = !matches;
    count += Number(matches);
  }

  for (const button of projectButtons) {
    button.setAttribute("aria-pressed", String(button === selectedButton));
  }

  projectCount.textContent = count === 1 ? "1 project" : `${count} projects`;
  scheduleScrollUpdate();
}

for (const button of projectButtons) {
  button.addEventListener("click", () => filterProjects(button));
}

filterProjects(projectButtons[0]);
projectControls.hidden = false;
themeToggle.hidden = false;
menuToggle.hidden = false;
root.setAttribute("data-enhanced", "");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute("data-revealed", "");
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12 });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
}
