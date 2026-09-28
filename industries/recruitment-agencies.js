/* ==========================================================================
   RECRUITMENT AGENCIES — Animations & Interactions
   GSAP ScrollTrigger + Vanilla JS
   ========================================================================== */

(function () {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Register GSAP plugins (if available)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initScrollReveals();
    initPipelineCounters();
    initAutoCardAnimations();
    initMatchBarAnimation();
    initContactForm();
  }

  /* ------------------------------------------------------------------
     Scroll Reveal Animations
     ------------------------------------------------------------------ */
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.ind-reveal');
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
      // Fallback: IntersectionObserver
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
     Pipeline Counter Animation
     ------------------------------------------------------------------ */
  function initPipelineCounters() {
    var counters = document.querySelectorAll('.ind-pipeline__stage-value[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     AI Automation Card Micro-Animations
     ------------------------------------------------------------------ */
  function initAutoCardAnimations() {
    var cards = document.querySelectorAll('.ind-auto-card[data-anim]');
    if (!cards.length) return;

    // Start animations on hover
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.classList.add('is-animating');
      });

      card.addEventListener('mouseleave', function () {
        // Keep the animation visible after hover for better UX
        // Don't remove is-animating class
      });
    });

    // Also trigger on scroll for mobile (no hover)
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Delay slightly for staggered effect
          setTimeout(function () {
            entry.target.classList.add('is-animating');
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    cards.forEach(function (card) { observer.observe(card); });
  }

  /* ------------------------------------------------------------------
     Contact Form Feedback Handler
     ------------------------------------------------------------------ */
  function initContactForm() {
    var contactForm = document.getElementById('agencyContactForm');
    if (!contactForm) return;

    var statusEl = document.getElementById('agencyFormMessage');

    contactForm.addEventListener('submit', function (e) {
      // Optional client-side validation check
      var name = document.getElementById('contactName');
      var email = document.getElementById('contactEmail');
      var service = document.getElementById('contactService');
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

    // Check URL parameters for status
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

  /* ------------------------------------------------------------------
     Match Bar Fill Animation (Hero)
     ------------------------------------------------------------------ */
  function initMatchBarAnimation() {
    var bars = document.querySelectorAll('.ind-match-item__bar-fill');
    if (!bars.length) return;

    // Start with 0 width and animate in
    bars.forEach(function (bar) {
      var targetWidth = bar.style.width;
      bar.style.width = '0%';

      setTimeout(function () {
        bar.style.width = targetWidth;
      }, 800);
    });
  }

  /* ------------------------------------------------------------------
     Interactive AI Chatbot Card Simulator
     ------------------------------------------------------------------ */
  window.recAgencyChatReply = function (action) {
    var feed = document.getElementById('recAgencyChatFeed');
    if (!feed) return;

    var candidateMsg = document.createElement('div');
    candidateMsg.className = 'ind-chat-bubble ind-chat-bubble--candidate';
    candidateMsg.textContent = action;
    feed.appendChild(candidateMsg);

    // Bot response after short typing delay
    var typingBot = document.createElement('div');
    typingBot.className = 'ind-chat-bubble ind-chat-bubble--bot';
    typingBot.innerHTML = '<span style="opacity:0.7;">● ● ●</span>';
    feed.appendChild(typingBot);
    feed.scrollTop = feed.scrollHeight;

    setTimeout(function () {
      var botResponse = '';
      if (action === 'Check Requirements') {
        botResponse = '✓ Required: 5+ yrs Node/React, Cloud infra (AWS/GCP), €120k–€145k package. Direct client interview slot available!';
      } else if (action === 'Schedule Screening') {
        botResponse = '✓ Calendar link generated! Pick any 15-min slot with the partner recruiter: tomorrow at 11:00 AM or 3:30 PM.';
      } else if (action === 'Upload CV') {
        botResponse = '✓ Resume received! Instant parsing: 98% skill alignment with FinTech client opening.';
      } else {
        botResponse = '✓ Thank you! The AI Recruiter has updated your talent record and notified the account manager.';
      }
      typingBot.textContent = botResponse;
      feed.scrollTop = feed.scrollHeight;
    }, 600);
  };

})();
