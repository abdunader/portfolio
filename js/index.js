document.addEventListener("DOMContentLoaded", () => {
  // Replace these placeholders with your EmailJS values from dashboard.
  const EMAILJS_CONFIG = {
    publicKey: "3hP4KRI5AHiUNsiqp",
    serviceId: "service_uz5uexj",
    templateId: "template_qu9nr99",
  };

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
    const actionButtons = [];
    if (project.liveUrl) {
      actionButtons.push(
        `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-outline mt-2">Live &lt;~&gt;</a>`,
      );
    }
    if (project.githubUrl) {
      actionButtons.push(
        `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary-outline mt-2">GitHub</a>`,
      );
    }

    const imageSection = project.image
      ? `<img src="${project.image}" alt="${project.title}" class="card-img-top border-bottom border-secondary" style="height:200px;object-fit:cover;">`
      : "";

    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card bg-transparent border-secondary project-card">
          ${imageSection}
          <div class="card-body p-0">
            <p class="text-secondary-light mb-0 small p-3 border-bottom border-secondary">${techList}</p>
            <div class="p-3">
              <h5 class="card-title fw-bold text-primary">${project.title}</h5>
              <p class="card-text text-secondary-light">${project.description}</p>
              ${actionButtons.length ? `<div class="d-flex flex-wrap gap-2">${actionButtons.join("")}</div>` : ""}
            </div>
          </div>
        </div>
      </div>`;
  }

  function initMasonry(elementId) {
    const el = document.getElementById(elementId);
    if (el && window.Masonry) {
      // Masonry configuration
      new Masonry(el, {
        percentPosition: true,
      });
    }
  }

  const grid = document.getElementById("projects-grid");
  if (grid && typeof PROJECTS !== "undefined") {
    grid.innerHTML = PROJECTS.map(createProjectCard).join("");
    // Give images a moment to calculate height before running layout,
    // though object-fit CSS already establishes sizing nicely.
    setTimeout(() => initMasonry("projects-grid"), 50);
  }

  const completeAppsGrid = document.getElementById("complete-apps-grid");
  if (completeAppsGrid && typeof PROJECTS !== "undefined") {
    completeAppsGrid.innerHTML = PROJECTS.map(createProjectCard).join("");
    setTimeout(() => initMasonry("complete-apps-grid"), 50);
  }

  const smallProjectsGrid = document.getElementById("small-projects-grid");
  if (smallProjectsGrid && typeof SMALL_PROJECTS !== "undefined") {
    smallProjectsGrid.innerHTML =
      SMALL_PROJECTS.map(createProjectCard).join("");
    setTimeout(() => initMasonry("small-projects-grid"), 50);
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
          <div class="skill-box-body">${skill.items.join(", ")}</div>
        </div>
      </div>`;
  }

  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid) {
    skillsGrid.innerHTML = SKILLS.map(createSkillBox).join("");
    setTimeout(() => initMasonry("skills-grid"), 50);
  }

  // ── About Page Content ───────────────────────────────────────────────────
  const aboutIntro = document.getElementById("about-intro");
  if (aboutIntro && typeof ABOUT_CONTENT !== "undefined") {
    aboutIntro.innerHTML = ABOUT_CONTENT.intro
      .map(
        (paragraph, index) =>
          `<p class="text-secondary-light mb-4">${paragraph}</p>`,
      )
      .join("");
  }

  const aboutHighlights = document.getElementById("about-highlights");
  if (aboutHighlights && typeof ABOUT_CONTENT !== "undefined") {
    aboutHighlights.innerHTML = ABOUT_CONTENT.funFacts
      .map(
        (item) => `<div class="col-auto"><div class="about-pill">${item}</div></div>`,
      )
      .join("");
  }

  // ── Random Quote ────────────────────────────────────────────────────────
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");

  if (
    quoteTextEl &&
    quoteAuthorEl &&
    typeof QUOTES !== "undefined" &&
    QUOTES.length
  ) {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteTextEl.textContent = randomQuote.text;
    quoteAuthorEl.textContent = `- ${randomQuote.author}`;
  }

  // ── Footer Year ──────────────────────────────────────────────────────────
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // ── Contact Form (EmailJS) ─────────────────────────────────────────────
  const contactForm = document.getElementById("contact-form");
  const contactSubmitBtn = document.getElementById("contact-submit-btn");
  const contactStatus = document.getElementById("contact-form-status");
  const contactName = document.getElementById("contact-name");
  const contactEmail = document.getElementById("contact-email");
  const contactTitle = document.getElementById("contact-title");
  const contactMessage = document.getElementById("contact-message");
  const contactHoneypot = document.getElementById("contact-company");

  const requiredFields = [
    contactName,
    contactEmail,
    contactTitle,
    contactMessage,
  ].filter(Boolean);
  const hasEmailJsConfig = Object.values(EMAILJS_CONFIG).every(
    (value) => value && !value.startsWith("YOUR_EMAILJS_"),
  );

  function showContactStatus(message, type = "error") {
    if (!contactStatus) return;
    contactStatus.textContent = message;
    contactStatus.classList.remove("is-success", "is-error");
    contactStatus.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function clearContactStatus() {
    if (!contactStatus) return;
    contactStatus.textContent = "";
    contactStatus.classList.remove("is-success", "is-error");
  }

  function setFieldState(field, isInvalid) {
    if (!field) return;
    field.classList.toggle("is-invalid", isInvalid);
  }

  function validateContactForm() {
    let isValid = true;

    requiredFields.forEach((field) => {
      const value = field.value.trim();
      let invalid = false;

      if (!value) invalid = true;
      if (!invalid && field === contactEmail)
        invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!invalid && field === contactName) invalid = value.length < 2;
      if (!invalid && field === contactTitle) invalid = value.length < 3;
      if (!invalid && field === contactMessage) invalid = value.length < 10;

      setFieldState(field, invalid);
      if (invalid) isValid = false;
    });

    return isValid;
  }

  function setSubmitLoading(isLoading) {
    if (!contactSubmitBtn) return;
    contactSubmitBtn.disabled = isLoading;
    contactSubmitBtn.textContent = isLoading ? "Sending..." : "Send";
  }

  if (window.emailjs && hasEmailJsConfig) {
    window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  if (contactForm) {
    requiredFields.forEach((field) => {
      field.addEventListener("input", () => {
        setFieldState(field, false);
        clearContactStatus();
      });
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearContactStatus();

      if (contactHoneypot && contactHoneypot.value.trim()) {
        showContactStatus(
          "Unable to send your message right now. Please try again.",
        );
        return;
      }

      const isValid = validateContactForm();
      if (!isValid) {
        showContactStatus("Please fill all fields correctly before sending.");
        return;
      }

      if (!window.emailjs || !hasEmailJsConfig) {
        showContactStatus(
          "Contact form is not configured yet. Add EmailJS credentials in js/index.js.",
        );
        return;
      }

      setSubmitLoading(true);

      try {
        await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: contactName.value.trim(),
            reply_to: contactEmail.value.trim(),
            title: contactTitle.value.trim(),
            message: contactMessage.value.trim(),
          },
        );

        contactForm.reset();
        requiredFields.forEach((field) => setFieldState(field, false));
        showContactStatus(
          "Message sent successfully. I will get back to you soon.",
          "success",
        );
      } catch (error) {
        showContactStatus("Sending failed. Please try again in a moment.");
      } finally {
        setSubmitLoading(false);
      }
    });
  }
});
