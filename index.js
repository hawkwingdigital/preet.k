const glow = document.getElementById("cursorGlow");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

function getRandomColor() {
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);
  return `rgb(${r}, ${g}, ${b})`;
}

// Desktop cursor tracking
document.addEventListener("mousemove", (e) => {
  updateCursor(e.clientX, e.clientY);
});

// 🔧 FIX: also track finger movement continuously
document.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    updateCursor(e.touches[0].clientX, e.touches[0].clientY);
  }
});

// 🔧 FIX: show glow immediately when finger touches
document.addEventListener("touchstart", (e) => {
  if (e.touches.length > 0) {
    updateCursor(e.touches[0].clientX, e.touches[0].clientY);
  }
  glow.classList.remove("hidden");
});

// 🔧 FIX: hide glow when finger is lifted
document.addEventListener("touchend", () => {
  glow.classList.add("hidden");
});

function updateCursor(clientX, clientY) {
  const x = clientX + window.scrollX;
  const y = clientY + window.scrollY;

  glow.style.left = x + "px";
  glow.style.top = y + "px";

  const ripple = document.createElement("div");
  ripple.classList.add("cursor-ripple");
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.style.background = getRandomColor();
  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);

  glow.classList.remove("hidden");

  clearTimeout(timeout);
  // 🔧 FIX: increased delay so glow doesn’t vanish too fast on mobile
  timeout = setTimeout(() => {
    glow.classList.add("hidden");
  }, 800);
}

let timeout;

// Stats animation
const statsSection = document.getElementById("stats");
const statsDeployed = document.getElementById("stats-deployed");
const statsRoi = document.getElementById("stats-roi");
const statsVerticals = document.getElementById("stats-verticals");

function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateValue(statsDeployed, 0, 50, 2000, '+');
      animateValue(statsRoi, 0, 10, 2000, 'X');
      animateValue(statsVerticals, 0, 20, 2000, '+');
      observer.unobserve(statsSection);
    }
  });
});


observer.observe(statsSection);

// Testimonial carousel functionality
const initializeTestimonialCarousel = () => {
    const carousel = document.getElementById("testimonialCarousel");
    if (!carousel || carousel.dataset.initialized) {
        return;
    }

    const cards = carousel.querySelectorAll(".testimonial-card");
    if (cards.length === 0) return;

    // Duplicate all cards for a seamless CSS animation loop
    cards.forEach((card) => {
        const clone = card.cloneNode(true);
        carousel.appendChild(clone);
    });

    // Mark as initialized to prevent re-running the duplication
    carousel.dataset.initialized = "true";
};

initializeTestimonialCarousel();
