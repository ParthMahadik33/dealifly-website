/**
 * Dealifly Solutions Engine & Interactive Architecture Runtime
 * Clean, lightweight, professional B2B interactions
 */

(function () {
    'use strict';

    // 1. Ambient Hero Particle Canvas (Silky 60fps Starfield / Particle Drift)
    function initHeroParticles() {
        var canvas = document.getElementById('solutionHeroCanvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var width = 0;
        var height = 0;
        var particles = [];
        var animationFrameId = null;
        var isVisible = true;

        var colors = [
            'rgba(196, 181, 253, ', // lavender
            'rgba(167, 139, 250, ', // purple
            'rgba(143, 122, 232, ', // brand purple
            'rgba(240, 171, 252, ', // soft pink
            'rgba(255, 255, 255, '  // white highlight
        ];

        function resize() {
            var rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
        }

        function createParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.2 - Math.random() * 0.5,
                radius: 1 + Math.random() * 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.15 + Math.random() * 0.55
            };
        }

        function initParticles() {
            particles = [];
            var count = Math.min(70, Math.floor((width * height) / 12000));
            for (var i = 0; i < count; i++) {
                particles.push(createParticle());
            }
        }

        function render() {
            if (!isVisible) return;

            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.y < 0) {
                    p.y = height;
                    p.x = Math.random() * width;
                }
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;

                ctx.fillStyle = p.color + p.alpha + ')';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        }

        // IntersectionObserver to pause rendering when scrolled out of view
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !animationFrameId) {
                        render();
                    } else if (!isVisible && animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(canvas);
        }

        window.addEventListener('resize', function () {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        render();
    }

    // 2. Interactive Architecture Visualizer Enhancements
    function initArchitectureConsole() {
        var consoleBox = document.querySelector('.dealifly-solution-console');
        if (!consoleBox) return;

        var nodes = consoleBox.querySelectorAll('.arch-node');
        nodes.forEach(function (node) {
            node.addEventListener('mouseenter', function () {
                var targetId = node.getAttribute('data-connects-to');
                if (targetId) {
                    var beam = consoleBox.querySelector('#' + targetId);
                    if (beam) {
                        beam.style.stroke = '#9B82E8';
                        beam.style.strokeWidth = '3';
                    }
                }
            });
            node.addEventListener('mouseleave', function () {
                var targetId = node.getAttribute('data-connects-to');
                if (targetId) {
                    var beam = consoleBox.querySelector('#' + targetId);
                    if (beam) {
                        beam.style.stroke = '';
                        beam.style.strokeWidth = '';
                    }
                }
            });
        });
    }

    // 3. Solutions Hub Filter Functionality (service.html)
    function initHubFilter() {
        var filterBtns = document.querySelectorAll('.dealifly-hub-filter-btn');
        var cards = document.querySelectorAll('.dealifly-hub-card');

        if (!filterBtns.length || !cards.length) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');

                var filter = btn.getAttribute('data-filter');

                cards.forEach(function (card) {
                    var category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter || (filter === 'core' && category === 'core')) {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        setTimeout(function () {
                            card.style.transition = 'opacity 250ms ease';
                            card.style.opacity = '1';
                        }, 20);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Auto-highlight Active Sidebar Link
    function initSidebarActiveState() {
        var currentPath = window.location.pathname.split('/').pop();
        if (!currentPath) currentPath = 'index.html';

        var sidebarLinks = document.querySelectorAll('.dealifly-sidebar-menu a');
        sidebarLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initHeroParticles();
            initArchitectureConsole();
            initHubFilter();
            initSidebarActiveState();
        });
    } else {
        initHeroParticles();
        initArchitectureConsole();
        initHubFilter();
        initSidebarActiveState();
    }
})();
