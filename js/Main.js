// main.js — RiseBoard
// JS Feature 1: Mobile nav toggle
// JS Feature 2: Dark/light theme switcher
// JS Feature 3: Project card filter
// + Contact form validation

// ----------------------------------------
// Feature 1: Mobile Nav Toggle
// ----------------------------------------
function initNavToggle() {
  const toggle = document.querySelector('#nav-toggle');
  const nav = document.querySelector('#main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });

  // Close nav when a link is clicked (better mobile UX)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
}

// ----------------------------------------
// Feature 2: Dark / Light Theme Switcher
// ----------------------------------------
function initTheme() {
  const btn = document.querySelector('#theme-toggle');
  if (!btn) return;

  // Load saved theme on page load
  var saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.querySelector('#theme-toggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// ----------------------------------------
// Feature 3: Project Card Filter
// ----------------------------------------
function initProjectFilter() {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');
  var noProjects = document.querySelector('#no-projects');
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // Update active button
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Show or hide each card
      var visible = 0;
      cards.forEach(function (card) {
        var category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category.includes(filter)) {
          card.hidden = false;
          visible++;
        } else {
          card.hidden = true;
        }
      });

      // Show no-results message if nothing visible
      if (noProjects) {
        noProjects.hidden = visible > 0;
      }
    });
  });
}

// ----------------------------------------
// Contact Form Validation
// ----------------------------------------
function initContactForm() {
  var submitBtn = document.querySelector('#submit-btn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', function () {
    var nameField = document.querySelector('#name');
    var emailField = document.querySelector('#email');
    var msgField = document.querySelector('#message');

    var valid = true;

    // Validate name
    if (nameField.value.trim().length < 2) {
      showError(nameField, 'name-error', 'Please enter your full name.');
      valid = false;
    } else {
      clearError(nameField, 'name-error');
    }

    // Validate email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value.trim())) {
      showError(emailField, 'email-error', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailField, 'email-error');
    }

    // Validate message
    if (msgField.value.trim().length < 10) {
      showError(msgField, 'message-error', 'Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError(msgField, 'message-error');
    }

    // If all valid, show success
    if (valid) {
      document.querySelector('#contact-form').hidden = true;
      document.querySelector('#form-success').hidden = false;
    }
  });
}

function showError(field, errorId, message) {
  field.classList.add('is-error');
  var errorEl = document.querySelector('#' + errorId);
  if (errorEl) errorEl.textContent = message;
}

function clearError(field, errorId) {
  field.classList.remove('is-error');
  var errorEl = document.querySelector('#' + errorId);
  if (errorEl) errorEl.textContent = '';
}

// ----------------------------------------
// Run everything on page load
// ----------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initTheme();
  initProjectFilter();
  initContactForm();
});