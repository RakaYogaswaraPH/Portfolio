document.addEventListener("DOMContentLoaded", () => {
    runBootSequence();
    document.querySelectorAll("canvas[id^='codeRain']").forEach(startCodeRain);
    runHeroTerminal();
    initReticle();
    initScrollReveal();
    initScrollNav();
    initBackToTop();
    setFooterYear();

    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

function runBootSequence() {
    const overlay = document.getElementById("bootOverlay");
    const bar = document.getElementById("bootFill");
    const pct = document.getElementById("bootPct");
    if (!overlay || !bar || !pct) return;

    document.body.classList.add("overflow-hidden");

    let progress = 0;
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        progress = Math.min(100, Math.round((elapsed / duration) * 100));
        bar.style.width = progress + "%";
        pct.textContent = String(progress).padStart(3, "0") + "%";

        if (progress < 100) {
            requestAnimationFrame(tick);
        } else {
            setTimeout(() => {
                overlay.style.opacity = "0";
                overlay.style.pointerEvents = "none";
                document.body.classList.remove("overflow-hidden");
                setTimeout(() => overlay.remove(), 700);
            }, 250);
        }
    }
    requestAnimationFrame(tick);
}

function startCodeRain(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const glyphs = "01 アイウエオカキクケコサシスセソ".split("");
    const fontSize = 15;
    let columns, drops;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        columns = Math.floor(canvas.width / fontSize);
        drops = new Array(columns).fill(0).map(() => Math.random() * -50);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
        ctx.fillStyle = "rgba(218, 212, 187, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + "px 'Space Mono', monospace";

        for (let i = 0; i < columns; i++) {
            const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillStyle = Math.random() > 0.985 ? "#b04238" : "rgba(78, 78, 70, 0.25)";
            ctx.fillText(glyph, x, y);

            if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}

function typeInto(el, text, speed = 32) {
    return new Promise((resolve) => {
        let i = 0;
        el.textContent = "";
        (function step() {
            if (i <= text.length) {
                el.textContent = text.slice(0, i);
                i++;
                setTimeout(step, speed);
            } else {
                resolve();
            }
        })();
    });
}

async function runHeroTerminal() {
    const log = document.getElementById("bootLog");
    const nameWrap = document.getElementById("heroName");
    const roleEl = document.getElementById("heroRole");
    if (!log || !roleEl) return;

    const lines = [
        "> CONNECTING TO SECURE NETWORK...",
        "> AUTHENTICATING UNIT PROFILE...",
        "> STATUS: OPERATIONAL",
    ];

    for (const line of lines) {
        const p = document.createElement("p");
        p.className = "text-line font-bold";
        log.appendChild(p);
        await typeInto(p, line, 18);
        await new Promise((r) => setTimeout(r, 180));
    }

    if (nameWrap) {
        nameWrap.classList.remove("opacity-0");
        nameWrap.classList.add("opacity-100");
    }

    const roles = ["IT SUPPORT", "NETWORK ENGINEER", "WEB DEVELOPER"];
    let roleIndex = 0;

    async function cycleRoles() {
        const current = roles[roleIndex % roles.length];
        await typeInto(roleEl, current, 55);
        await new Promise((r) => setTimeout(r, 1400));
        await eraseFrom(roleEl, 30);
        roleIndex++;
        cycleRoles();
    }
    cycleRoles();
}

function eraseFrom(el, speed = 30) {
    return new Promise((resolve) => {
        (function step() {
            const text = el.textContent;
            if (text.length > 0) {
                el.textContent = text.slice(0, -1);
                setTimeout(step, speed);
            } else {
                resolve();
            }
        })();
    });
}

function initReticle() {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isWideEnough = window.innerWidth >= 1024;
    if (!isFinePointer || !isWideEnough) return;

    const reticle = document.getElementById("reticle");
    if (!reticle) return;

    reticle.classList.remove("hidden");

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function loop() {
        curX += (mouseX - curX) * 0.2;
        curY += (mouseY - curY) * 0.2;
        reticle.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll("button, [role='button'], .cursor-pointer, .card-hover").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            reticle.style.width = "40px";
            reticle.style.height = "40px";
            reticle.style.borderColor = "var(--color-brass)";
            reticle.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) rotate(45deg)`;
        });
        el.addEventListener("mouseleave", () => {
            reticle.style.width = "26px";
            reticle.style.height = "26px";
            reticle.style.borderColor = "var(--color-line)";
            reticle.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) rotate(0deg)`;
        });
    });
}

function initScrollReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !targets.length) {
        targets.forEach((t) => t.classList.add("is-in"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.revealDelay || 0;
                    setTimeout(() => entry.target.classList.add("is-in"), Number(delay));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
}

function initScrollNav() {
    const navLinks = document.querySelectorAll("[data-nav-link]");
    const sections = Array.from(navLinks)
        .map((link) => {
            const target = link.getAttribute("data-target");
            return target ? document.querySelector(target) : null;
        })
        .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = "#" + entry.target.id;
                    navLinks.forEach((link) => {
                        const isActive = link.getAttribute("data-target") === id;

                        if (link.classList.contains("desktop-nav")) {
                            link.classList.toggle("text-void", isActive);
                            link.classList.toggle("bg-line", isActive);
                            link.classList.toggle("text-line", !isActive);
                            link.classList.toggle("bg-panel", !isActive);
                        } else if (link.classList.contains("mobile-nav")) {
                            link.classList.toggle("text-brass", isActive);
                            link.classList.toggle("text-line/60", !isActive);
                        }
                    });
                }
            });
        },
        { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
}

function initBackToTop() {
    const btn = document.getElementById("backToTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        const show = window.scrollY > window.innerHeight * 0.6;
        btn.classList.toggle("opacity-0", !show);
        btn.classList.toggle("invisible", !show);
        btn.classList.toggle("opacity-100", show);
    });
}

function setFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
}