/* ==========================================================================
   GruhaSparsha Interiors (ಗೃಹಸ್ಪರ್ಶ) - Master Interactive Logic
   - Responsive Navigation & Sticky Bar
   - Interactive Lightbox Pop-up Modal
   - Gallery Category Filter Tabs
   - Dynamic Budget Estimator Calculator & WhatsApp Generator
   - Scroll Reveal Animations
   - Contact Form Validation & AJAX Submission
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================================
     1. STICKY NAVBAR & MOBILE MENU TOGGLE
     ========================================================================== */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("site-navigation");

  // Sticky Navbar Box-shadow
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  // Mobile Menu Toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth Scrolling for Anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth"
        });
      }
    });
  });

  /* ==========================================================================
     HERO VIDEO TRAILER SHOWCASE (AUTOMATIC TRAILER SEQUENCING)
     ========================================================================== */
  const heroVidSlider = document.getElementById("hero-video-slider");
  if (heroVidSlider) {
    const vSlides = heroVidSlider.querySelectorAll(".video-slide");
    const vDots = heroVidSlider.querySelectorAll(".dot");
    const vPrevBtn = document.getElementById("hero-vid-prev");
    const vNextBtn = document.getElementById("hero-vid-next");
    let currentVidSlide = 0;
    let vidSlideTimer = null;

    function activateVidSlide(index) {
      if (vidSlideTimer) clearTimeout(vidSlideTimer);

      // Pause all videos
      vSlides.forEach((slide) => {
        const vid = slide.querySelector("video");
        if (vid) vid.pause();
      });

      vSlides.forEach((slide, i) => slide.classList.toggle("active", i === index));
      vDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      currentVidSlide = index;

      const activeSlide = vSlides[index];
      const activeVid = activeSlide.querySelector("video");

      if (activeVid) {
        activeVid.currentTime = 0;
        activeVid.play().catch(() => {});

        const onEnded = () => {
          activeVid.removeEventListener("ended", onEnded);
          gotoNextVidSlide();
        };
        activeVid.addEventListener("ended", onEnded, { once: true });

        // Trailer clip duration window (7s max per clip)
        vidSlideTimer = setTimeout(() => {
          activeVid.removeEventListener("ended", onEnded);
          gotoNextVidSlide();
        }, 7000);

      } else {
        // Logo Intro Slide: Hold for 3.5s then launch trailer
        vidSlideTimer = setTimeout(() => {
          gotoNextVidSlide();
        }, 3500);
      }
    }

    function gotoNextVidSlide() {
      let nextIndex = (currentVidSlide + 1) % vSlides.length;
      activateVidSlide(nextIndex);
    }

    function gotoPrevVidSlide() {
      let prevIndex = (currentVidSlide - 1 + vSlides.length) % vSlides.length;
      activateVidSlide(prevIndex);
    }

    if (vNextBtn) vNextBtn.addEventListener("click", () => gotoNextVidSlide());
    if (vPrevBtn) vPrevBtn.addEventListener("click", () => gotoPrevVidSlide());

    vDots.forEach((dot, i) => {
      dot.addEventListener("click", () => activateVidSlide(i));
    });

    // Touch Swipe Gestures for Mobile View
    let touchStartX = 0;
    let touchEndX = 0;
    heroVidSlider.addEventListener("touchstart", (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    heroVidSlider.addEventListener("touchend", (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDiff = touchStartX - touchEndX;
        if (swipeDiff > 35) {
          gotoNextVidSlide(); // Swipe Left -> Next
        } else if (swipeDiff < -35) {
          gotoPrevVidSlide(); // Swipe Right -> Prev
        }
      }
    }, { passive: true });

    // Start Trailer
    activateVidSlide(0);
  }


  /* ==========================================================================
     2. CATEGORIZED GALLERY TOGGLE (EXPAND / COLLAPSE)
     ========================================================================== */
  window.toggleGallery = function (elementId, btn) {
    const content = document.getElementById(elementId);
    if (!content) return;
    content.classList.toggle("show");

    if (content.classList.contains("show")) {
      btn.innerHTML = 'Show Less &uarr;';
    } else {
      btn.innerHTML = 'Click here to more photos &rarr;';
    }
  };


  /* ==========================================================================
     3. INTERACTIVE LIGHTBOX & VIDEO MODAL PLAYER
     ========================================================================== */
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  const videoModal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("popup-video-player");
  const videoCaption = document.getElementById("video-modal-caption");
  const videoClose = document.getElementById("video-close");

  // Video Modal Open / Close Logic
  function openVideoModal(videoSrc, title) {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.src = videoSrc;
    if (videoCaption) videoCaption.innerHTML = `<strong>${title || "Video Walkthrough"}</strong>`;
    videoModal.classList.add("active");
    videoModal.setAttribute("aria-hidden", "false");
    videoPlayer.play().catch(() => {});
  }

  function closeVideoModal() {
    if (!videoModal || !videoPlayer) return;
    videoPlayer.pause();
    videoPlayer.src = "";
    videoModal.classList.remove("active");
    videoModal.setAttribute("aria-hidden", "true");
  }

  if (videoClose) videoClose.addEventListener("click", closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // Modal Triggers for Video Cards
  document.querySelectorAll('.modal-trigger[data-modal="video-modal"]').forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const videoSrc = card.getAttribute("data-video");
      const title = card.getAttribute("data-title");
      if (videoSrc) openVideoModal(videoSrc, title);
    });
  });

  if (lightboxModal && lightboxImg && lightboxCaption) {
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const imgSrc = item.getAttribute("data-img");
        const title = item.getAttribute("data-title") || "";
        const sub = item.getAttribute("data-sub") || "";

        if (imgSrc) {
          lightboxImg.src = imgSrc;
          lightboxCaption.innerHTML = `<strong>${title}</strong><br/><span style="font-size:0.9rem; font-family:var(--font-sans); color:#cbd5e1;">${sub}</span>`;
          lightboxModal.classList.add("active");
          lightboxModal.setAttribute("aria-hidden", "false");
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove("active");
      lightboxModal.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    };

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (videoModal?.classList.contains("active")) closeVideoModal();
        if (lightboxModal?.classList.contains("active")) closeLightbox();
      }
    });
  }


  /* ==========================================================================
     4. DYNAMIC BUDGET ESTIMATOR CALCULATOR
     ========================================================================== */
  const homeTypeSelect = document.getElementById("calc-home-type");
  const serviceScopeSelect = document.getElementById("calc-service-scope");
  const finishGradeSelect = document.getElementById("calc-finish-grade");
  const priceOutput = document.getElementById("calc-price-output");
  const whatsappShareBtn = document.getElementById("calc-whatsapp-share");

  function calculateEstimate() {
    if (!homeTypeSelect || !serviceScopeSelect || !finishGradeSelect || !priceOutput) return;

    const homeMultipliers = { "1bhk": 1.0, "2bhk": 1.6, "3bhk": 2.3, "villa": 3.4 };
    const scopeMultipliers = { "kitchen": 1.8, "essential": 3.8, "full": 5.2 };
    const finishMultipliers = { "standard": 1.0, "premium": 1.3, "luxury": 1.7 };

    const homeVal = homeTypeSelect.value;
    const scopeVal = serviceScopeSelect.value;
    const finishVal = finishGradeSelect.value;

    const baseCost = scopeMultipliers[scopeVal] * homeMultipliers[homeVal] * finishMultipliers[finishVal];
    const minCost = (baseCost * 0.9).toFixed(1);
    const maxCost = (baseCost * 1.15).toFixed(1);

    const priceText = `₹${minCost} Lakhs – ₹${maxCost} Lakhs`;
    priceOutput.textContent = priceText;

    if (whatsappShareBtn) {
      const homeText = homeTypeSelect.options[homeTypeSelect.selectedIndex].text;
      const scopeText = serviceScopeSelect.options[serviceScopeSelect.selectedIndex].text;
      const finishText = finishGradeSelect.options[finishGradeSelect.selectedIndex].text;

      const message = `Hi GruhaSparsha Interiors, I used your website budget calculator and got an estimated range of ${priceText} for: %0A- ${homeText}%0A- ${scopeText}%0A- ${finishText}.%0A%0AI would like to schedule a detailed design consultation!`;
      whatsappShareBtn.href = `https://wa.me/919187402834?text=${message}`;
    }
  }

  if (homeTypeSelect && serviceScopeSelect && finishGradeSelect) {
    homeTypeSelect.addEventListener("change", calculateEstimate);
    serviceScopeSelect.addEventListener("change", calculateEstimate);
    finishGradeSelect.addEventListener("change", calculateEstimate);
    calculateEstimate();
  }


  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

  if ("IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((el) => {
        if (el.getBoundingClientRect().top < windowHeight - 60) {
          el.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
  }

  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ==========================================================================
     5.5 ANIMATED NUMBERS COUNTER & RIPPLE EFFECT
     ========================================================================== */
  const counters = document.querySelectorAll(".counter");
  let animatedCounters = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 1800;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  }

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animatedCounters) {
          animatedCounters = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(heroStats);
  } else {
    animateCounters();
  }

  // Interactive Ripple Effect for Buttons
  document.querySelectorAll(".btn, .calc-whatsapp-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const circle = document.createElement("span");
      circle.classList.add("btn-ripple");
      const rect = this.getBoundingClientRect();
      circle.style.width = circle.style.height = `${Math.max(rect.width, rect.height)}px`;
      circle.style.left = `${e.clientX - rect.left - rect.width / 2}px`;
      circle.style.top = `${e.clientY - rect.top - rect.height / 2}px`;
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // Interactive Ambient Cursor Spotlight & 3D Tilt
  if (window.innerWidth > 768) {
    const cursorSpotlight = document.createElement("div");
    cursorSpotlight.classList.add("cursor-spotlight");
    document.body.appendChild(cursorSpotlight);

    document.addEventListener("mousemove", (e) => {
      cursorSpotlight.style.left = `${e.clientX}px`;
      cursorSpotlight.style.top = `${e.clientY}px`;
    });

    // 3D Card Hover Tilt Micro-Interactions
    document.querySelectorAll('.card, .quick-card, .why-card, .video-card, .partner-item').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 22}deg) rotateY(${x / 22}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }


  /* ==========================================================================
     6. CONTACT FORM VALIDATION & AJAX SUBMISSION
     ========================================================================== */
  const form = document.getElementById("contact-form");
  const successMessage = document.querySelector(".form-success");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(group, message) {
    if (!group) return;
    group.classList.add("error");
    const errorSpan = group.querySelector(".error-message");
    if (errorSpan) errorSpan.textContent = message;
  }

  function clearError(group) {
    if (!group) return;
    group.classList.remove("error");
    const errorSpan = group.querySelector(".error-message");
    if (errorSpan) errorSpan.textContent = "";
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let hasError = false;
      form.querySelectorAll(".form-group").forEach(clearError);
      if (successMessage) successMessage.textContent = "";

      const fields = [
        ["name", "Please enter your name", true],
        ["phone", "Please enter your phone number", true],
        ["email", "Please enter your email", true],
        ["location", "Please enter your property location", true],
        ["property-type", "Please select a property type", true],
        ["service-type", "Please select a service", true],
        ["message", "Please enter your project details or message", false],
      ];

      fields.forEach(([id, msg, required]) => {
        const input = form.querySelector(`#${id}`);
        const group = input?.closest(".form-group");
        const value = input?.value.trim() || "";

        if (required && !value) {
          showError(group, msg);
          hasError = true;
        }
        if (id === "email" && value && !isValidEmail(value)) {
          showError(group, "Please enter a valid email address");
          hasError = true;
        }
        if (id === "phone" && value && !/^[0-9+() .-]{7,30}$/.test(value)) {
          showError(group, "Please enter a valid phone number");
          hasError = true;
        }
      });

      if (hasError) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      try {
        const response = await fetch("send-mail.php", {
          method: "POST",
          body: new FormData(form),
        });

        const result = await response.json().catch(() => null);

        if (response.ok && result?.success) {
          form.reset();
          if (successMessage) {
            successMessage.textContent = "Thank you! Your enquiry has been received. Our Mysuru interiors team will contact you shortly.";
            successMessage.style.color = "#22c55e";
          }
        } else {
          throw new Error(result?.message || "The enquiry could not be sent. Please try again later.");
        }
      } catch (error) {
        if (successMessage) {
          successMessage.textContent = error.message || "Thank you! Your enquiry has been recorded. Our team will contact you shortly.";
          successMessage.style.color = "#22c55e";
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

});