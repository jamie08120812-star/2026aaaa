// =========================
// DOM 快取
// =========================
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const cursorLight = document.getElementById('cursorLight');

// =========================
// 頁面切換
// =========================
function showPage(id) {
  const pages = document.querySelectorAll('.page');
  const links = document.querySelectorAll('.side-link');

  pages.forEach(page => page.classList.remove('active'));
  links.forEach(link => link.classList.remove('active'));

  const targetPage = document.getElementById(`page-${id}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  document.querySelectorAll(`.side-link[data-page="${id}"]`).forEach(link => {
    link.classList.add('active');
  });

  if (window.innerWidth <= 920 && sidebar) {
    sidebar.classList.remove('open');
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  setTimeout(() => {
    revealElements(true);
    resetBarsInActivePage();
    animateBarsInView();
  }, 120);
}

// =========================
// 手機側邊欄
// =========================
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  if (!sidebar || !menuBtn) return;

  const clickedOutsideSidebar = !sidebar.contains(e.target);
  const clickedMenuBtn = menuBtn.contains(e.target);

  if (window.innerWidth <= 920 && sidebar.classList.contains('open') && clickedOutsideSidebar && !clickedMenuBtn) {
    sidebar.classList.remove('open');
  }
});

// =========================
// 滑鼠光效
// =========================
function initCursorLight() {
  if (!cursorLight) return;

  document.addEventListener('mousemove', (e) => {
    cursorLight.style.left = `${e.clientX}px`;
    cursorLight.style.top = `${e.clientY}px`;
    cursorLight.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorLight.style.opacity = '0';
  });
}

// =========================
// 3D 傾斜效果
// =========================
function initTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 920) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// =========================
// 磁吸按鈕
// =========================
function initMagneticButtons() {
  const items = document.querySelectorAll('.magnetic');

  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 920) return;

      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const moveX = x * 0.08;
      const moveY = y * 0.08;

      item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translate(0, 0)';
    });
  });
}

// =========================
// Reveal 動畫
// =========================
function revealElements(force = false) {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  const revealBlocks = activePage.querySelectorAll('.reveal');

  revealBlocks.forEach(block => {
    const rect = block.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 80;

    if (inView || force) {
      block.classList.add('visible');

      if (block.classList.contains('stagger')) {
        const children = Array.from(block.children);
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.08}s`;
          child.classList.add('visible-child');
        });
      }
    }
  });
}

// =========================
// 技能條動畫
// =========================
function prepareBars() {
  const bars = document.querySelectorAll('.bar-fill');

  bars.forEach(bar => {
    if (!bar.dataset.targetWidth) {
      bar.dataset.targetWidth = bar.style.width || '0%';
      bar.style.width = '0';
    }
  });
}

function resetBarsInActivePage() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  const bars = activePage.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    bar.dataset.animated = '';
    bar.style.width = '0';
  });
}

function animateBarsInView() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;

  const bars = activePage.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 40;

    if (inView && !bar.dataset.animated) {
      bar.dataset.animated = 'true';
      setTimeout(() => {
        bar.style.width = bar.dataset.targetWidth || '0%';
      }, 120);
    }
  });
}

// =========================
// 滾動 / resize
// =========================
window.addEventListener('scroll', () => {
  revealElements();
  animateBarsInView();
});

window.addEventListener('resize', () => {
  revealElements();
  animateBarsInView();

  if (window.innerWidth > 920 && sidebar) {
    sidebar.classList.remove('open');
  }
});

// =========================
// 初始
// =========================
document.addEventListener('DOMContentLoaded', () => {
  initCursorLight();
  initTiltCards();
  initMagneticButtons();
  prepareBars();
  revealElements(true);
  animateBarsInView();
});
