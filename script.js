document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-list li a");

  // Toggle Mobile Menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navList.classList.toggle("active");
  });

  // Close menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navList.classList.remove("active");
    });
  });

  // Smooth scroll behavior is handled by CSS (scroll-behavior: smooth in html),
  // but we can add robust fallback or offset logic here if needed.
  // For now, minimal JS as requested.
  // Theme Switcher
  // Single Button Theme Switcher
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themes = ['dark', 'light', 'rgb'];
  const icons = {
      'dark': '🌙',
      'light': '☀️',
      'rgb': '🌈'
  };

  // Function to apply theme
  function applyTheme(theme) {
      // clean up all theme classes
      document.body.classList.remove('light-mode', 'rgb-mode');
      
      // if not default dark, add class
      if (theme !== 'dark') {
          document.body.classList.add(theme + '-mode');
      }
      
      // Update Button Icon
      if (themeToggleBtn) {
          themeToggleBtn.textContent = icons[theme];
      }
      
      // Save
      localStorage.setItem('theme', theme);
  }

  // Initial Check
  let currentThemeIndex = 0;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && themes.includes(savedTheme)) {
      currentThemeIndex = themes.indexOf(savedTheme);
      applyTheme(savedTheme);
  }

  // Click Handler
  if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
          currentThemeIndex = (currentThemeIndex + 1) % themes.length;
          const newTheme = themes[currentThemeIndex];
          applyTheme(newTheme);
      });
  }

  // --- Scroll Spy & Text Highlight ---
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-list li a');
  const titles = document.querySelectorAll('.section-title');

  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        
        // 1. Highlight Active Nav Link
        const id = entry.target.getAttribute('id');
        if(id) {
            navItems.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active-link');
                }
            });
        }

        // 2. Highlight Section Title (if inside this section)
        // Actually, let's observe titles directly for the color pop effect
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Separate observer for the "Text Highlight" effect on titles
  const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if(entry.isIntersecting) {
              entry.target.classList.add('highlight-active');
          } else {
              entry.target.classList.remove('highlight-active');
          }
      });
  }, { threshold: 1.0, rootMargin: "0px 0px -100px 0px" });

  titles.forEach(title => {
      titleObserver.observe(title);
  });

  // --- Mouse Gradient Effect ---
  // --- 3D Tilt Effect for Cards ---
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Calculate rotation
          const rotateX = ((y - centerY) / centerY) * -10; // Max tilt deg
          const rotateY = ((x - centerX) / centerX) * 10;
          
          // Apply transform
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });

      card.addEventListener('mouseleave', () => {
          // Reset
          card.style.transition = 'transform 0.5s ease';
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
          
          // Remove transition after it's done so mousemove is fast again
          setTimeout(() => {
              card.style.transition = 'transform 0.1s ease-out, border-color 0.3s, box-shadow 0.3s';
          }, 500);
      });
  });

  // --- Text-to-Speech on Click ---
  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, li, a, button, label');
  
  const speakText = (text) => {
    if (!text) return;
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: Adjust rate, pitch, voice here
    utterance.rate = 1; 
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  textElements.forEach(el => {
    // Avoid double binding if elements are nested, or simply rely on bubbling
    // We use a specific listener logic to avoid reading container text when clicking a child
    el.addEventListener('click', (e) => {
      // Prevent triggering parent elements
      e.stopPropagation();
      
      // Get exact text content
      const text = e.target.innerText || e.target.textContent;
      speakText(text.trim());
      
      // If it's a link or button, we might want to let the default action happen
      // e.stopPropagation() stops bubbling up, but not default action (navigation)
      // so links will still work.
    });
  });

});
