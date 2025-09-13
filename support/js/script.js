(function initAllSwitchers() {
  document.querySelectorAll('.switcher').forEach(initSwitcher);

  function initSwitcher(sw) {
    const options = Array.from(sw.querySelectorAll('.switcher__option'));
    const radios = options.map(o => o.querySelector('input[type="radio"]'));
    const indicator = sw.querySelector('.switcher__indicator');
    let currentIndex = Math.max(0, radios.findIndex(r => r && r.checked));
    let previousIndex = currentIndex;

    // Initial position (no animation)
    moveIndicator(currentIndex, false);

    // Events
    options.forEach((opt, idx) => {
      opt.addEventListener('click', (e) => {
        e.preventDefault(); // block label default to avoid odd scroll timing

        // update previous index
        previousIndex = currentIndex;

        // check radio programmatically
        const r = radios[idx];
        if (r && !r.checked) {
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // scroll to section (if any)
        const href = opt.getAttribute('data-href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });

      // when radio actually changes, move indicator
      const r = radios[idx];
      if (r) {
        r.addEventListener('change', () => {
          if (r.checked) {
            currentIndex = idx;
            moveIndicator(currentIndex, true);
          }
        });
      }
    });

    // Reposition on resize/zoom
    let resizeRaf = null;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => moveIndicator(currentIndex, false));
    });

    function moveIndicator(idx, animate) {
      const opt = options[idx];
      if (!opt) return;
      const optRect = opt.getBoundingClientRect();
      const swRect = sw.getBoundingClientRect();
      const left = optRect.left - swRect.left; // relative x
      const width = optRect.width;

      if (!animate) indicator.style.transition = 'none';
      else indicator.style.transition = '';

      indicator.style.width = 78 + 'px';
      indicator.style.transform = `translateX(${left - 12}px)`;


      indicator.style.height = 60 + 'px';

      // pulse direction
      indicator.classList.remove('pulse-left', 'pulse-right');
      if (animate) {
        indicator.classList.add(idx > previousIndex ? 'pulse-right' : 'pulse-left');
      }
    }
  }
})();

const sliders = document.querySelectorAll('.slide-left');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

sliders.forEach(slider => {
  observer.observe(slider);
});

function openPopup() {
  document.getElementById('popup-overlay').style.display = 'flex';
}

function closePopup() {
  document.getElementById('popup-overlay').style.display = 'none';
}

(function addScrollSyncToSwitcher() {
  const switchers = document.querySelectorAll('.switcher');

  switchers.forEach(sw => {
    const options = Array.from(sw.querySelectorAll('.switcher__option'));
    const indicator = sw.querySelector('.switcher__indicator');

    if (!indicator || options.length === 0) return;

    // map section -> index
    const sectionMap = new Map();
    options.forEach((opt, idx) => {
      const href = opt.getAttribute('data-href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) sectionMap.set(target, idx);
      }

      // click event เพื่อเลื่อน indicator
      opt.addEventListener('click', e => {
        e.preventDefault();
        slideIndicator(idx);
        // scroll ไป section ด้วย smooth behavior
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    let isScrolling = false;

    const observer = new IntersectionObserver(entries => {
      if (isScrolling) return; // ป้องกัน conflict กับ click scroll
      let visibleEntry = null;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!visibleEntry || entry.intersectionRatio > visibleEntry.intersectionRatio) {
            visibleEntry = entry;
          }
        }
      });

      if (visibleEntry) {
        const idx = sectionMap.get(visibleEntry.target);
        if (typeof idx === 'number') {
          slideIndicator(idx);
        }
      }
    }, { threshold: 0.4 }); // ลด threshold เพื่อให้ library trigger ง่ายขึ้น

    // observe ทุก section
    sectionMap.forEach((_idx, section) => observer.observe(section));

    function slideIndicator(idx) {
      const opt = options[idx];
      if (!opt) return;

      const optRect = opt.getBoundingClientRect();
      const swRect = sw.getBoundingClientRect();

      // slide indicator แบบเดียวกับโค้ดแรก
      indicator.style.transition = 'transform 420ms cubic-bezier(1, 0.0, 0.4, 1)';
      indicator.style.transform = `translateX(${optRect.left - swRect.left - 12}px)`;
    }
  });
})();
