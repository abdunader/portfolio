const DATA_FILES = {
  about: "./data/about.json",
  contact: "./data/contact.json",
  projects: "./data/projects.json",
  quotes: "./data/quotes.json",
  shapes: "./data/shapes.json",
  siteConfig: "./data/site-config.json",
  skills: "./data/skills.json",
  socialLinks: "./data/social-links.json",
};

const dataCache = new Map();
const textCache = new Map();

function loadJsonData(path) {
  if (!dataCache.has(path)) {
    dataCache.set(
      path,
      fetch(path).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${path}: ${response.status}`);
        }

        return response.json();
      }),
    );
  }

  return dataCache.get(path);
}

function loadTextData(path) {
  if (!textCache.has(path)) {
    textCache.set(
      path,
      fetch(path).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${path}: ${response.status}`);
        }

        return response.text();
      }),
    );
  }

  return textCache.get(path);
}

function hasElement(selector) {
  return Boolean(document.querySelector(selector));
}

function createProjectCard(project) {
  const techList = Array.isArray(project.technologies)
    ? project.technologies.join(" ")
    : "";
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

function createSkillBox(skill) {
  return `
    <div class="col-6 col-md-4">
      <div class="skill-box">
        <div class="skill-box-header">${skill.category}</div>
        <div class="skill-box-body">${skill.items.join(", ")}</div>
      </div>
    </div>`;
}

function initMasonry(elementId) {
  const element = document.getElementById(elementId);
  if (!element || !window.Masonry) return;

  new Masonry(element, {
    percentPosition: true,
  });
}

function scheduleMasonry(elementId) {
  setTimeout(() => initMasonry(elementId), 50);
}

async function initShapes(shapes) {
  if (!shapes) return;

  const shapeEntries = Object.entries(shapes);
  const shapeMarkupEntries = await Promise.all(
    shapeEntries.map(async ([shapeName, shapePath]) => [
      shapeName,
      await loadTextData(shapePath),
    ]),
  );
  const shapeMarkup = Object.fromEntries(shapeMarkupEntries);

  document.querySelectorAll("[data-shape]").forEach((element) => {
    const svg = shapeMarkup[element.dataset.shape];
    if (svg) element.innerHTML = svg;
  });
}

function applyTheme(themeIcon, favicon, theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  if (themeIcon) {
    themeIcon.classList.toggle("fa-sun", theme === "dark");
    themeIcon.classList.toggle("fa-moon", theme === "light");
  }

  if (favicon) {
    favicon.href =
      theme === "light"
        ? "./assets/images/logo.png"
        : "./assets/images/logo_white.png";
  }
}

function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const favicon = document.getElementById("favicon");
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme === "light" ? "light" : "dark";

  applyTheme(themeIcon, favicon, initialTheme);

  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(themeIcon, favicon, nextTheme);
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  const toggleBackToTopButton = () => {
    backToTopBtn.classList.toggle("is-visible", window.scrollY > 280);
  };

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleBackToTopButton, { passive: true });
  toggleBackToTopButton();
}

function renderIconMarkup(item, logoClass) {
  if (item.logo) {
    return `<img src="${item.logo}" alt="" class="${logoClass}" loading="lazy" decoding="async">`;
  }

  if (item.icon) {
    return `<i class="${item.icon}"></i>`;
  }

  return `${item.badge || item.label.charAt(0)}`;
}

function initProjects(projectsData) {
  if (!projectsData) return;

  const grid = document.getElementById("projects-grid");
  if (grid) {
    grid.innerHTML = (projectsData.projects || []).map(createProjectCard).join("");
    scheduleMasonry("projects-grid");
  }

  const completeAppsGrid = document.getElementById("complete-apps-grid");
  if (completeAppsGrid) {
    completeAppsGrid.innerHTML = (projectsData.projects || [])
      .map(createProjectCard)
      .join("");
    scheduleMasonry("complete-apps-grid");
  }

  const smallProjectsGrid = document.getElementById("small-projects-grid");
  if (smallProjectsGrid) {
    smallProjectsGrid.innerHTML = (projectsData.smallProjects || [])
      .map(createProjectCard)
      .join("");
    scheduleMasonry("small-projects-grid");
  }
}

function renderSocialIcons(containerId, linkClass, socialLinks) {
  const container = document.getElementById(containerId);
  if (!container || !socialLinks?.length) return;

  container.innerHTML = socialLinks
    .map(
      (link) => `
        <a href="${link.url}" class="${linkClass}" aria-label="${link.label}" target="_blank" rel="noopener noreferrer">
          <i class="${link.icon}"></i>
        </a>`,
    )
    .join("");
}

function initSocialLinks(socialLinks) {
  if (!socialLinks?.length) return;

  renderSocialIcons("social-sidebar-links", "social-icon", socialLinks);
  renderSocialIcons("social-mobile-links", "text-secondary-light fs-1", socialLinks);
  renderSocialIcons("footer-social-links", "footer-social-icon", socialLinks);
}

function initSkills(skills) {
  const skillsGrid = document.getElementById("skills-grid");
  if (!skillsGrid || !skills?.length) return;

  skillsGrid.innerHTML = skills.map(createSkillBox).join("");
  scheduleMasonry("skills-grid");
}

function initAboutPage(aboutContent) {
  if (!aboutContent) return;

  const aboutIntro = document.getElementById("about-intro");
  if (aboutIntro) {
    aboutIntro.innerHTML = (aboutContent.intro || [])
      .map((paragraph) => `<p class="text-secondary-light mb-4">${paragraph}</p>`)
      .join("");
  }

  const aboutHighlights = document.getElementById("about-highlights");
  if (aboutHighlights) {
    aboutHighlights.innerHTML = (aboutContent.funFacts || [])
      .map((item) => `<div class="col-auto"><div class="about-pill">${item}</div></div>`)
      .join("");
  }
}

function initContactPage(contactData) {
  if (!contactData) return;

  const contactPageEyebrow = document.getElementById("contact-page-eyebrow");
  const contactPageIntro = document.getElementById("contact-page-intro");
  const freelanceLinks = document.getElementById("freelance-links");
  const allMediaLinks = document.getElementById("all-media-links");
  const pageContent = contactData.pageContent || {};

  if (contactPageEyebrow) {
    contactPageEyebrow.textContent = pageContent.eyebrow || "";
  }

  if (contactPageIntro) {
    contactPageIntro.innerHTML = (pageContent.intro || [])
      .map((paragraph) => `<p class="text-secondary-light mb-4">${paragraph}</p>`)
      .join("");
  }

  if (freelanceLinks) {
    freelanceLinks.innerHTML = (contactData.freelancePlatforms || [])
      .map(
        (platform) => `
          <a href="${platform.url}" class="hire-platform-link" target="_blank" rel="noopener noreferrer">
            <span class="hire-platform-link__main">
              <span class="hire-platform-link__badge" aria-hidden="true">${renderIconMarkup(platform, "hire-platform-link__logo")}</span>
              <span>${platform.label}</span>
            </span>
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>`,
      )
      .join("");
  }

  if (allMediaLinks) {
    allMediaLinks.innerHTML = (contactData.mediaLinks || [])
      .map(
        (link) => `
          <a href="${link.url}" class="all-media-link" target="_blank" rel="noopener noreferrer">
            <span class="all-media-link__icon" aria-hidden="true"><i class="${link.icon}"></i></span>
            <span class="all-media-link__value">${link.handle || link.value || link.url}</span>
          </a>`,
      )
      .join("");
  }
}

function initQuote(quotes) {
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");
  if (!quoteTextEl || !quoteAuthorEl || !quotes?.length) return;

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteTextEl.textContent = randomQuote.text;
  quoteAuthorEl.textContent = `- ${randomQuote.author}`;
}

function initFooterYear() {
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initContactForm(siteConfig) {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const contactSubmitBtn = document.getElementById("contact-submit-btn");
  const contactStatus = document.getElementById("contact-form-status");
  const contactName = document.getElementById("contact-name");
  const contactEmail = document.getElementById("contact-email");
  const contactTitle = document.getElementById("contact-title");
  const contactMessage = document.getElementById("contact-message");
  const contactHoneypot = document.getElementById("contact-company");
  const emailConfig = siteConfig?.emailjs || {};

  const requiredFields = [
    contactName,
    contactEmail,
    contactTitle,
    contactMessage,
  ].filter(Boolean);

  const hasEmailJsConfig = Object.values(emailConfig).every(
    (value) => value && !String(value).startsWith("YOUR_EMAILJS_"),
  );

  const showContactStatus = (message, type = "error") => {
    if (!contactStatus) return;
    contactStatus.textContent = message;
    contactStatus.classList.remove("is-success", "is-error");
    contactStatus.classList.add(type === "success" ? "is-success" : "is-error");
  };

  const clearContactStatus = () => {
    if (!contactStatus) return;
    contactStatus.textContent = "";
    contactStatus.classList.remove("is-success", "is-error");
  };

  const setFieldState = (field, isInvalid) => {
    if (!field) return;
    field.classList.toggle("is-invalid", isInvalid);
  };

  const validateContactForm = () => {
    let isValid = true;

    requiredFields.forEach((field) => {
      const value = field.value.trim();
      let invalid = !value;

      if (!invalid && field === contactEmail) invalid = !validateEmail(value);
      if (!invalid && field === contactName) invalid = value.length < 2;
      if (!invalid && field === contactTitle) invalid = value.length < 3;
      if (!invalid && field === contactMessage) invalid = value.length < 10;

      setFieldState(field, invalid);
      if (invalid) isValid = false;
    });

    return isValid;
  };

  const setSubmitLoading = (isLoading) => {
    if (!contactSubmitBtn) return;
    contactSubmitBtn.disabled = isLoading;
    contactSubmitBtn.textContent = isLoading ? "Sending..." : "Send";
  };

  if (window.emailjs && hasEmailJsConfig) {
    window.emailjs.init({ publicKey: emailConfig.publicKey });
  }

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      setFieldState(field, false);
      clearContactStatus();
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearContactStatus();

    if (contactHoneypot?.value.trim()) {
      showContactStatus("Unable to send your message right now. Please try again.");
      return;
    }

    if (!validateContactForm()) {
      showContactStatus("Please fill all fields correctly before sending.");
      return;
    }

    if (!window.emailjs || !hasEmailJsConfig) {
      showContactStatus(
        "Contact form is not configured yet. Add EmailJS credentials in data/site-config.json.",
      );
      return;
    }

    setSubmitLoading(true);

    try {
      await window.emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
        from_name: contactName.value.trim(),
        reply_to: contactEmail.value.trim(),
        title: contactTitle.value.trim(),
        message: contactMessage.value.trim(),
      });

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

async function loadPageData() {
  const needsShapes = hasElement("[data-shape]");
  const needsProjects =
    hasElement("#projects-grid") ||
    hasElement("#complete-apps-grid") ||
    hasElement("#small-projects-grid");
  const needsSocialLinks =
    hasElement("#social-sidebar-links") ||
    hasElement("#social-mobile-links") ||
    hasElement("#footer-social-links") ||
    hasElement("#all-media-links");
  const needsSkills = hasElement("#skills-grid");
  const needsAbout = hasElement("#about-intro") || hasElement("#about-highlights");
  const needsContactPage =
    hasElement("#contact-page-eyebrow") || hasElement("#freelance-links");
  const needsQuotes = hasElement("#quote-text") && hasElement("#quote-author");
  const needsSiteConfig = hasElement("#contact-form");

  const loaders = {
    shapes: needsShapes ? loadJsonData(DATA_FILES.shapes) : Promise.resolve(null),
    projects: needsProjects ? loadJsonData(DATA_FILES.projects) : Promise.resolve(null),
    socialLinks: needsSocialLinks
      ? loadJsonData(DATA_FILES.socialLinks)
      : Promise.resolve(null),
    skills: needsSkills ? loadJsonData(DATA_FILES.skills) : Promise.resolve(null),
    about: needsAbout ? loadJsonData(DATA_FILES.about) : Promise.resolve(null),
    contact: needsContactPage
      ? loadJsonData(DATA_FILES.contact)
      : Promise.resolve(null),
    quotes: needsQuotes ? loadJsonData(DATA_FILES.quotes) : Promise.resolve(null),
    siteConfig: needsSiteConfig
      ? loadJsonData(DATA_FILES.siteConfig)
      : Promise.resolve(null),
  };

  const [shapes, projects, socialLinks, skills, about, contact, quotes, siteConfig] =
    await Promise.all([
      loaders.shapes,
      loaders.projects,
      loaders.socialLinks,
      loaders.skills,
      loaders.about,
      loaders.contact,
      loaders.quotes,
      loaders.siteConfig,
    ]);

  return {
    shapes,
    projects,
    socialLinks,
    skills,
    about,
    contact,
    quotes,
    siteConfig,
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initBackToTop();
  initFooterYear();

  try {
    const pageData = await loadPageData();

    await initShapes(pageData.shapes);
    initProjects(pageData.projects);
    initSocialLinks(pageData.socialLinks);
    initSkills(pageData.skills);
    initAboutPage(pageData.about);
    initContactPage(pageData.contact);
    initQuote(pageData.quotes);
    initContactForm(pageData.siteConfig);
  } catch (error) {
    console.error("Failed to initialize page data.", error);
  }
});
