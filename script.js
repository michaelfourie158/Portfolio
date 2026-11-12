const btn = document.querySelector(".menu-btn"), links = document.querySelector(".nav-links");
btn.addEventListener("click", () => btn.setAttribute("aria-expanded", links.classList.toggle("open")));
links.addEventListener("click", (e) => { if (e.target.tagName === "A") { links.classList.remove("open"); btn.setAttribute("aria-expanded", false); } });
document.getElementById("year").textContent = new Date().getFullYear();
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
