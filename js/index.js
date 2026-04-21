document.addEventListener("DOMContentLoaded", () => {
  // ── Shapes ─────────────────────────────────────────────────────────────
  // Inject SVG markup into any element that has a data-shape attribute
  document.querySelectorAll("[data-shape]").forEach((el) => {
    const svg = SHAPES[el.dataset.shape];
    if (svg) el.innerHTML = svg;
  });

  // ── Theme ──────────────────────────────────────────────────────────────
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const favicon = document.getElementById("favicon");

  // Check local storage for theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    if (favicon) favicon.href = "./assets/images/logo.png";
  } else {
    // Default is dark
    document.documentElement.setAttribute("data-theme", "dark");
    if (favicon) favicon.href = "./assets/images/logo_white.png";
  }

  themeToggleBtn.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    let targetTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);

    if (targetTheme === "light") {
      themeIcon.classList.replace("fa-sun", "fa-moon");
      if (favicon) favicon.href = "./assets/images/logo.png";
    } else {
      themeIcon.classList.replace("fa-moon", "fa-sun");
      if (favicon) favicon.href = "./assets/images/logo_white.png";
    }
  });

  // ── Back To Top ──────────────────────────────────────────────────────────
  const backToTopBtn = document.getElementById("back-to-top");

  function toggleBackToTopButton() {
    if (!backToTopBtn) return;
    backToTopBtn.classList.toggle("is-visible", window.scrollY > 280);
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleBackToTopButton, { passive: true });
    toggleBackToTopButton();
  }

  // ── Projects ───────────────────────────────────────────────────────────
  function createProjectCard(project) {
    const techList = project.technologies.join(" ");

    const imageSection = project.image
      ? `<img src="${project.image}" alt="${project.title}" class="card-img-top border-bottom border-secondary" style="height:200px;object-fit:cover;">`
      : `<div class="card-img-top border-bottom border-secondary d-flex align-items-center justify-content-center text-secondary-light" style="height:200px;">
           <i class="fa-solid fa-image fa-3x"></i>
         </div>`;

    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card bg-transparent border-secondary project-card h-100">
          ${imageSection}
          <div class="card-body p-0">
            <p class="text-secondary-light mb-0 small p-3 border-bottom border-secondary">${techList}</p>
            <div class="p-3">
              <h5 class="card-title fw-bold text-primary">${project.title}</h5>
              <p class="card-text text-secondary-light">${project.description}</p>
              <a href="${project.liveUrl}" class="btn btn-primary-outline mt-2">Live &lt;~&gt;</a>
            </div>
          </div>
        </div>
      </div>`;
  }

  const grid = document.getElementById("projects-grid");
  if (grid) {
    grid.innerHTML = PROJECTS.map(createProjectCard).join("");
  }

  // ── Social Links ────────────────────────────────────────────────────────
  function renderSocialLinks(containerId, linkClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = SOCIAL_LINKS.map(
      (link) =>
        `<a href="${link.url}" class="${linkClass}" aria-label="${link.label}" target="_blank" rel="noopener noreferrer">
          <i class="${link.icon}"></i>
        </a>`,
    ).join("");
  }

  renderSocialLinks("social-sidebar-links", "social-icon");
  renderSocialLinks("social-mobile-links", "text-secondary-light fs-1");
  renderSocialLinks("footer-social-links", "footer-social-icon");

  // ── Skills ─────────────────────────────────────────────────────────────
  function createSkillBox(skill) {
    return `
      <div class="col-6 col-md-4">
        <div class="skill-box">
          <div class="skill-box-header">${skill.category}</div>
          <div class="skill-box-body">${skill.items.join(" ")}</div>
        </div>
      </div>`;
  }

  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid) {
    skillsGrid.innerHTML = SKILLS.map(createSkillBox).join("");
  }

  // ── Random Quote ────────────────────────────────────────────────────────
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");

  if (quoteTextEl && quoteAuthorEl && typeof QUOTES !== "undefined" && QUOTES.length) {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteTextEl.textContent = randomQuote.text;
    quoteAuthorEl.textContent = `- ${randomQuote.author}`;
  }

  // ── Footer Year ──────────────────────────────────────────────────────────
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
