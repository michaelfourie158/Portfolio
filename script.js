const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* mobile menu */
const btn = $(".menu-btn"), links = $(".nav-links");
btn.addEventListener("click", () => btn.setAttribute("aria-expanded", links.classList.toggle("open")));
links.addEventListener("click", (e) => {
  if (e.target.closest("a")) { links.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
});
$("#year").textContent = new Date().getFullYear();

/* scroll reveal + animated counters */
function countUp(el) {
  const end = +el.dataset.count;
  if (reduce) { el.textContent = end; return; }
  const t0 = performance.now(), dur = 1400;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  $$("[data-count]", e.target).forEach(countUp);
  io.unobserve(e.target);
}), { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));
const barIO = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("on"); barIO.unobserve(e.target); }
}), { threshold: 0.3 });
$$(".skills").forEach((el) => barIO.observe(el));

/* typing line */
const phrases = ["financial software.", "clean, fast websites.", "ETL pipelines.", "things that solve problems."];
const typed = $("#typed");
if (reduce) { typed.textContent = phrases[0]; }
else {
  let p = 0, c = 0, del = false;
  (function type() {
    const word = phrases[p];
    typed.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(type, 1500); }
    if (del && c === 0) { del = false; p = (p + 1) % phrases.length; return setTimeout(type, 350); }
    c += del ? -1 : 1;
    setTimeout(type, del ? 35 : 70);
  })();
}

/* cursor glow in hero */
const hero = $("#profile");
if (!reduce && matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", e.clientX - r.left + "px");
    hero.style.setProperty("--my", e.clientY - r.top + "px");
  });
}

/* tilt project cards */
if (!reduce && matchMedia("(pointer: fine)").matches) {
  $$(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });
}

/* demo modal */
const modal = $("#demo-modal"), frame = $("#demo-frame");
$$(".demo").forEach((b) => b.addEventListener("click", () => {
  if (typeof modal.showModal !== "function") { window.open(b.dataset.src, "_blank", "noopener"); return; }
  $("#demo-title").textContent = b.dataset.title;
  frame.src = b.dataset.src;
  modal.showModal();
}));
function closeDemo() { modal.close(); frame.src = "about:blank"; }
$("#demo-close").addEventListener("click", closeDemo);
modal.addEventListener("click", (e) => { if (e.target === modal) closeDemo(); });
modal.addEventListener("cancel", () => (frame.src = "about:blank"));

/* quick jump palette */
const pal = $("#palette"), input = $("#palette-input"), list = $("#palette-list");
const items = [
  ["About", "#about"], ["Skills", "#experience"], ["Projects", "#projects"], ["Contact", "#contact"],
  ["Download CV", "./assets/Michael-Fourie-CV.pdf", true], ["GitHub", "https://github.com/michaelfourie158", true],
  ["LinkedIn", "https://www.linkedin.com/in/michaelfourie158/", true], ["Send an email", "mailto:michaelfourie115588@gmail.com"],
];
let sel = 0, shown = items;
function render() {
  const q = input.value.trim().toLowerCase();
  shown = items.filter((i) => i[0].toLowerCase().includes(q));
  sel = Math.min(sel, Math.max(shown.length - 1, 0));
  list.innerHTML = shown.map((i, n) => `<li class="${n === sel ? "sel" : ""}" data-n="${n}">${i[0]}</li>`).join("") || "<li>No matches</li>";
}
function go(i) {
  if (!i) return;
  pal.close();
  if (i[2]) window.open(i[1], "_blank", "noopener");
  else if (i[1].startsWith("#")) { location.hash = i[1]; }
  else location.href = i[1];
}
function openPalette() { input.value = ""; sel = 0; render(); pal.showModal(); input.focus(); }
$("#open-palette").addEventListener("click", openPalette);
document.addEventListener("keydown", (e) => {
  const typing = /input|textarea/i.test(document.activeElement.tagName);
  if ((e.key === "/" && !typing && !pal.open && !modal.open) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
    e.preventDefault(); openPalette();
  }
});
input.addEventListener("input", () => { sel = 0; render(); });
input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { sel = (sel + 1) % Math.max(shown.length, 1); render(); e.preventDefault(); }
  else if (e.key === "ArrowUp") { sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); render(); e.preventDefault(); }
  else if (e.key === "Enter") go(shown[sel]);
});
list.addEventListener("click", (e) => { const li = e.target.closest("li[data-n]"); if (li) go(shown[+li.dataset.n]); });
pal.addEventListener("click", (e) => { if (e.target === pal) pal.close(); });
