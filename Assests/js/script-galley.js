window.onload = function () {
  const defaultTab = document.querySelector(".tab button.tablinks"); // ปุ่มแรกคือ 'All'
  if (defaultTab) {
    openTab({ currentTarget: defaultTab }, 'All');
  }
};


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
  
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tablinks");
  
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    if (tabName === 'All') {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "block";
        }
    } else {
        var selectedContent = document.getElementsByClassName(tabName);
        for (i = 0; i < selectedContent.length; i++) {
            selectedContent[i].style.display = "block";
        }
    }
  
    evt.currentTarget.className += " active";

    const unsetElement = document.querySelector('.unset');
    if (unsetElement) {
        unsetElement.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll("img.lazy-image");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: "100px 0px",
    threshold: 0.1
  });

  lazyImages.forEach(img => observer.observe(img));
});

window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");
    const logo = document.getElementById("logo-header");

    if (window.scrollY > 10) {
        header.classList.add("scrolled");
        logo.src = "https://img2.pic.in.th/pic/Nas-Phou.png"; // โลโก้ตอนสกอ
    } else {
        header.classList.remove("scrolled");
        logo.src = "https://img2.pic.in.th/pic/Nas-Phou.png"; // โลโก้ตอนปกติ
    }
});

const toggleBtn = document.querySelector('.n-toggle');
const siteHeader = document.querySelector('.site-header');

toggleBtn.addEventListener('click', () => {
    siteHeader.classList.toggle('menu-open');
});

// ปิดเมนูเมื่อคลิก link
document.querySelectorAll('.n-manu-ul a').forEach(link => {
    link.addEventListener('click', () => {
        siteHeader.classList.remove('menu-open');
    });
});

// Scroll แล้วเปลี่ยน header
window.addEventListener("scroll", function () {
    const header = document.querySelector(".site-header");
    if (window.scrollY > 10) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});