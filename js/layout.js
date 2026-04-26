const SHARED_NAV_ITEMS = [
  { key: "home", label: "home", href: "#home" },
  { key: "projects", label: "projects", href: "./projects.html" },
  { key: "about", label: "about-me", href: "./about.html" },
  { key: "contact", label: "contact", href: "./contact.html" },
];

function getSharedLayoutContext() {
  const currentPage = document.body.dataset.page || "home";

  return {
    currentPage,
    brandHref: currentPage === "home" ? "#home" : "./index.html",
    homeHref: currentPage === "home" ? "#home" : "./index.html#home",
  };
}

function renderSidebar() {
  const sidebarRoot = document.getElementById("site-sidebar");
  if (!sidebarRoot) return;

  sidebarRoot.innerHTML = `
    <div class="social-sidebar d-none d-lg-flex flex-column align-items-center">
      <div class="sidebar-line"></div>
      <div id="social-sidebar-links" class="d-flex flex-column align-items-center"></div>
    </div>
    <div class="social-sidebar-box d-none d-lg-block" data-shape="squareOutline"></div>
  `;
}

function renderNav() {
  const navRoot = document.getElementById("site-nav");
  if (!navRoot) return;

  const { currentPage, brandHref, homeHref } = getSharedLayoutContext();
  const navItems = SHARED_NAV_ITEMS.map((item) => {
    const href = item.key === "home" ? homeHref : item.href;
    const isActive = item.key === currentPage;

    return `
      <li class="nav-item">
        <a class="nav-link${isActive ? " active" : ""}"${
          isActive ? ' aria-current="page"' : ""
        } href="${href}">
          <span class="text-primary">#</span>${item.label}
        </a>
      </li>
    `;
  }).join("");

  navRoot.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-transparent">
      <div class="container-fluid px-0">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${brandHref}">
          <img src="./assets/images/logo.png" alt="Logo" height="30" class="logo" />
          <span class="font-weight-bold">Abdelrahman</span>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas-lg offcanvas-top w-100 h-100 border-0" id="navbarContent" tabindex="-1">
          <div class="offcanvas-body p-0 d-flex flex-column flex-lg-row align-items-lg-center overflow-hidden">
            <div class="w-100 d-flex justify-content-between align-items-center d-lg-none pb-5 pt-4 px-4">
              <a class="navbar-brand d-flex align-items-center gap-2 m-0" href="${brandHref}">
                <img src="./assets/images/logo.png" alt="Logo" height="30" class="logo" />
                <span class="font-weight-bold">Abdelrahman</span>
              </a>
              <button
                class="btn btn-link text-white p-0 text-decoration-none"
                type="button"
                data-bs-dismiss="offcanvas"
                data-bs-target="#navbarContent">
                <i class="fa-solid fa-xmark fs-2 text-secondary-light"></i>
              </button>
            </div>

            <ul class="navbar-nav ms-lg-auto mb-2 mb-lg-0 align-items-start align-items-lg-center gap-3 px-4 px-lg-0">
              ${navItems}
              <li class="nav-item ms-lg-2 ms-0 mt-4 mt-lg-0">
                <button
                  id="theme-toggle"
                  class="btn btn-link nav-link px-0 px-lg-2 d-flex align-items-center"
                  aria-label="Toggle theme">
                  <i id="theme-icon" class="fa-solid fa-sun mobile-theme-icon"></i>
                </button>
              </li>
            </ul>

            <div class="mt-auto d-flex justify-content-center gap-4 w-100 d-lg-none pb-5" id="social-mobile-links"></div>
          </div>
        </div>
      </div>
    </nav>
  `;
}

function renderFooter() {
  const footerRoot = document.getElementById("site-footer");
  if (!footerRoot) return;

  footerRoot.innerHTML = `
    <footer class="site-footer py-4">
      <div class="container">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <img src="./assets/images/logo.png" alt="Logo" height="24" class="logo" />
              <span class="fw-bold">Abdelrahman</span>
            </div>
            <p class="text-secondary-light mb-0">Front-end developer crafting responsive web experiences.</p>
          </div>

          <div>
            <h5 class="mb-3">Media</h5>
            <div id="footer-social-links" class="d-flex gap-3"></div>
          </div>
        </div>
        <p class="text-center text-secondary-light small mb-0 mt-4">
          &copy; <span id="footer-year"></span> Abdelrahman Nader. All rights reserved.
        </p>
      </div>
    </footer>
  `;
}

function renderBackToTop() {
  const backToTopRoot = document.getElementById("site-back-to-top");
  if (!backToTopRoot) return;

  backToTopRoot.innerHTML = `
    <button
      id="back-to-top"
      class="btn btn-primary-outline back-to-top-btn"
      type="button"
      aria-label="Back to top">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderNav();
  renderFooter();
  renderBackToTop();
});
