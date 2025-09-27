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

// Testimonial carousel functionality (mobile only)
function initializeTestimonialCarousel() {
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  const prevTestimonialBtn = document.getElementById('prevTestimonial');
  const nextTestimonialBtn = document.getElementById('nextTestimonial');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  if (!testimonialCarousel || !prevTestimonialBtn || !nextTestimonialBtn || testimonialCards.length === 0) {
    return; // Exit if elements are not found
  }

  function updateTestimonialCarousel() {
    const cardWidth = testimonialCards[0].offsetWidth;
    testimonialCarousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  prevTestimonialBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialCards.length - 1;
    updateTestimonialCarousel();
  });

  nextTestimonialBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < testimonialCards.length - 1) ? currentIndex + 1 : 0;
    updateTestimonialCarousel();
  });

  // Initialize carousel position
  updateTestimonialCarousel();

  // Add touch/swipe functionality for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  testimonialCarousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  testimonialCarousel.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
  });

  testimonialCarousel.addEventListener('touchend', () => {
    if (touchEndX < touchStartX - 50) { // Swiped left
      currentIndex = (currentIndex < testimonialCards.length - 1) ? currentIndex + 1 : 0;
    }
    if (touchEndX > touchStartX + 50) { // Swiped right
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialCards.length - 1;
    }
    updateTestimonialCarousel();
  });
}

// Check if it's a mobile device (or screen width is small) before initializing
if (window.matchMedia("(max-width: 768px)").matches) {
  initializeTestimonialCarousel();
}
