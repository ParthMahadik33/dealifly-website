/* ==========================================================================
   B2B COMPANIES — Animations & Interactions
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

  /* ------------------------------------------------------------------
     Funnel Counter Animation
     ------------------------------------------------------------------ */
  function initFunnelCounters() {
    var counters = document.querySelectorAll('.ind-funnel__stage-value[data-count]');
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
    var startTime = null;
    var useComma = target >= 1000;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = useComma ? current.toLocaleString() : current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = useComma ? target.toLocaleString() : target;
      }
    }

    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     AI Card Micro-Animations
     ------------------------------------------------------------------ */
  function initAutoCardAnimations() {
    var cards = document.querySelectorAll('.ind-auto-card[data-anim]');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.classList.add('is-animating');
      });
    });

    // Also trigger on scroll for mobile
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
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
     Growth Control Panel — Expandable Rows
     ------------------------------------------------------------------ */
  function initControlPanel() {
    var rows = document.querySelectorAll('.ind-control__row[data-expand]');
    if (!rows.length) return;

    rows.forEach(function (row) {
      row.addEventListener('click', function () {
        // Toggle this row
        var isExpanded = row.classList.contains('is-expanded');

        // Close all rows
        rows.forEach(function (r) {
          r.classList.remove('is-expanded');
        });

        // Open clicked row (if it wasn't already open)
        if (!isExpanded) {
          row.classList.add('is-expanded');
        }
      });
    });

    // Auto-expand first row on scroll
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var firstRow = entry.target.querySelector('.ind-control__row');
          if (firstRow) {
            setTimeout(function () {
              firstRow.classList.add('is-expanded');
            }, 600);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    var panel = document.querySelector('.ind-control__panel');
    if (panel) observer.observe(panel);
  }

  /* ------------------------------------------------------------------
     Decision Maker Network (SVG Node Graph)
     ------------------------------------------------------------------ */
  function initNetworkGraph() {
    var canvas = document.getElementById('networkCanvas');
    var svg = document.getElementById('networkSvg');
    var nodes = document.querySelectorAll('.ind-network__node');
    if (!canvas || !svg || !nodes.length) return;

    // Draw connecting lines from center to each node
    var centerX = 350;
    var centerY = 190;

    // Node approximate positions (relative to 700x380 viewBox)
    var nodePositions = [
      { x: 210, y: 45 },   // CEO
      { x: 420, y: 45 },   // Founder
      { x: 600, y: 90 },   // VP Sales
      { x: 600, y: 290 },  // Marketing Director
      { x: 420, y: 345 },  // Procurement
      { x: 175, y: 345 },  // Operations
      { x: 50, y: 190 },   // CTO
      { x: 70, y: 275 }    // HR Director
    ];

    // Draw lines
    nodePositions.forEach(function (pos) {
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', pos.x);
      line.setAttribute('y2', pos.y);
      svg.appendChild(line);
    });

    // Draw small circles at node endpoints
    nodePositions.forEach(function (pos) {
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', 4);
      circle.setAttribute('fill', 'rgba(99, 40, 255, 0.4)');
      svg.appendChild(circle);
    });

    // Draw center circle
    var centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerCircle.setAttribute('cx', centerX);
    centerCircle.setAttribute('cy', centerY);
    centerCircle.setAttribute('r', 8);
    centerCircle.setAttribute('fill', '#6328ff');
    svg.appendChild(centerCircle);

    // Animate node labels on scroll
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nodes.forEach(function (node, i) {
            setTimeout(function () {
              node.classList.add('is-visible');
            }, 200 + i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(canvas);

    // Hover: highlight connecting lines
    canvas.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX - rect.left) / rect.width * 700;
      var my = (e.clientY - rect.top) / rect.height * 380;

      var lines = svg.querySelectorAll('line');
      var circles = svg.querySelectorAll('circle');

      lines.forEach(function (line, i) {
        var nx = nodePositions[i].x;
        var ny = nodePositions[i].y;
        var dist = Math.sqrt(Math.pow(mx - nx, 2) + Math.pow(my - ny, 2));

        if (dist < 60) {
          line.style.stroke = 'rgba(245, 79, 242, 0.5)';
          line.style.strokeWidth = '2';
          if (circles[i]) {
            circles[i].setAttribute('fill', '#f54ff2');
            circles[i].setAttribute('r', '6');
          }
        } else {
          line.style.stroke = '';
          line.style.strokeWidth = '';
          if (circles[i]) {
            circles[i].setAttribute('fill', 'rgba(99, 40, 255, 0.4)');
            circles[i].setAttribute('r', '4');
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Floating Outreach Activity Panel
     ------------------------------------------------------------------ */
  function initOutreachFloat() {
    var panel = document.getElementById('outreachFloat');
    if (!panel) return;

    var showAfter = window.innerHeight * 0.8;

    function checkScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > showAfter) {
        panel.classList.add('is-visible');
      } else {
        panel.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    // Animate bar fills on visibility
    var bars = panel.querySelectorAll('.ind-outreach-float__row-fill');
    bars.forEach(function (bar) {
      var targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(function () {
        bar.style.width = targetWidth;
      }, 1200);
    });
  }

  /* ------------------------------------------------------------------
     Floating Notification Toasts
     ------------------------------------------------------------------ */
  function initNotificationToasts() {
    var toasts = [
      document.getElementById('toast-lead'),
      document.getElementById('toast-reply'),
      document.getElementById('toast-meeting'),
      document.getElementById('toast-campaign')
    ].filter(Boolean);

    if (!toasts.length) return;

    var currentIndex = 0;
    var interval = 4500;
    var displayDuration = 3500;

    function showNextToast() {
      var toast = toasts[currentIndex];
      toast.classList.add('is-visible');

      setTimeout(function () {
        toast.classList.remove('is-visible');
      }, displayDuration);

      currentIndex = (currentIndex + 1) % toasts.length;
    }

    setTimeout(function () {
      showNextToast();
      setInterval(showNextToast, interval);
    }, 2500);
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
