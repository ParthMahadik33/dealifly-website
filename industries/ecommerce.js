/* ==========================================================================
   E-COMMERCE GROWTH SYSTEM — Animations & Interactions
   GSAP ScrollTrigger + Vanilla JS
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initScrollReveals();
    initContactForm();
  }

  /* ------------------------------------------------------------------
     Scroll Reveal Animations
     ------------------------------------------------------------------ */
  function initScrollReveals() {
    var reveals = document.querySelectorAll('.ind-reveal');
    if (!reveals.length) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      reveals.forEach(function (el, i) {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true
            },
            delay: (i % 4) * 0.1
          }
        );
      });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      reveals.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ------------------------------------------------------------------
     Contact Form Feedback Handler
     ------------------------------------------------------------------ */
  function initContactForm() {
    var contactForm = document.getElementById('agencyContactForm');
    if (!contactForm) return;

    var statusEl = document.getElementById('agencyFormMessage');

    contactForm.addEventListener('submit', function (e) {
      var name = document.getElementById('contactName');
      var email = document.getElementById('contactEmail');
      var msg = document.getElementById('contactMsg');

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        e.preventDefault();
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.className = 'alert alert-danger mb-4 py-2 px-3 fs-13';
          statusEl.textContent = 'Please fill out all required fields marked with *.';
        }
      }
    });

    var urlParams = new URLSearchParams(window.location.search);
    var status = urlParams.get('status');
    if (status && statusEl) {
      statusEl.style.display = 'block';
      if (status === 'success') {
        statusEl.className = 'alert alert-success mb-4 py-2 px-3 fs-13';
        statusEl.textContent = 'Thank you! Your inquiry has been received. We will follow up shortly.';
      } else if (status === 'invalid') {
        statusEl.className = 'alert alert-danger mb-4 py-2 px-3 fs-13';
        statusEl.textContent = 'Please check the entered information and submit again.';
      }
    }
  }

})();
