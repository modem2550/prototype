(function initAllSwitchers(){
      document.querySelectorAll('.switcher').forEach(initSwitcher);

      function initSwitcher(sw){
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

        function moveIndicator(idx, animate){
          const opt = options[idx];
          if (!opt) return;
          const optRect = opt.getBoundingClientRect();
          const swRect = sw.getBoundingClientRect();
          const left = optRect.left - swRect.left; // relative x
          const width = optRect.width;

          if (!animate) indicator.style.transition = 'none';
          else indicator.style.transition = '';

          indicator.style.width = 78 + 'px';
          indicator.style.transform = `translateX(${left-12}px)`;


          indicator.style.height = 60 + 'px';

          // pulse direction
          indicator.classList.remove('pulse-left', 'pulse-right');
          if (animate) {
            indicator.classList.add(idx > previousIndex ? 'pulse-right' : 'pulse-left');
          }
        }
      }
    })();
