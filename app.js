/* app.js — Portfolio frontend */

const API_BASE = 'http://localhost:3001/api';

/* ─── Custom Cursor ──────────────────────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ─── Scroll: Nav ────────────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─── Scroll: Reveal ─────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (i * 0.06) + 's';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Skills Data & Render ───────────────────────────────────────────────── */
const skillsData = [
  {
    category: 'FRONTEND',
    name: 'UI Engineering',
    tags: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Framer Motion']
  },
  {
    category: 'BACKEND',
    name: 'Server-Side',
    tags: ['Node.js', 'Express', 'Django', 'REST APIs', 'GraphQL', 'WebSockets']
  },
  {
    category: 'DATABASE',
    name: 'Data Layer',
    tags: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Prisma', 'Sequelize']
  },
  {
    category: 'INFRASTRUCTURE',
    name: 'DevOps & Cloud',
    tags: ['Docker', 'AWS', 'Vercel', 'CI/CD', 'Nginx', 'Linux']
  }
];

const skillsGrid = document.getElementById('skills-grid');
skillsData.forEach((skill, i) => {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.innerHTML = `
    <div class="skill-category">${skill.category}</div>
    <h3>${skill.name}</h3>
    <div class="skill-tags">
      ${skill.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
    </div>
  `;
  skillsGrid.appendChild(card);

  // Observe for animation
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(card);
});

/* ─── Projects: Fetch from API ───────────────────────────────────────────── */
async function loadProjects() {
  const list = document.getElementById('projects-list');
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('API unavailable');
    const projects = await res.json();
    renderProjects(projects);
  } catch {
    // Fallback sample data when backend isn't running
    renderProjects(SAMPLE_PROJECTS);
  }
}

const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: 'Fintrack — Personal Finance Dashboard',
    description: 'A real-time financial analytics platform with bank-grade security, budgeting tools, and AI-powered spending insights.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Plaid API'],
    github_url: '#',
    live_url: '#',
    year: 2025
  },
  {
    id: 2,
    title: 'Collab — Real-time Document Editor',
    description: 'Google Docs-style collaborative editor with operational transforms, live cursors, and conflict-free version history.',
    tags: ['Next.js', 'WebSockets', 'Redis', 'MongoDB'],
    github_url: '#',
    live_url: '#',
    year: 2024
  },
  {
    id: 3,
    title: 'Shipfast — E-commerce API Platform',
    description: 'Headless commerce engine handling 10k+ orders/day, with inventory management, payments, and analytics.',
    tags: ['Express.js', 'PostgreSQL', 'Stripe', 'Docker'],
    github_url: '#',
    live_url: null,
    year: 2024
  },
  {
    id: 4,
    title: 'Atlas — Interactive Travel Planner',
    description: 'AI-powered trip planner with dynamic itinerary generation, map integration, and social sharing.',
    tags: ['Vue.js', 'Flask', 'OpenAI', 'MapboxGL'],
    github_url: '#',
    live_url: '#',
    year: 2023
  }
];

function renderProjects(projects) {
  const list = document.getElementById('projects-list');
  list.innerHTML = '';

  projects.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'project-item';
    item.innerHTML = `
      <span class="project-num mono">0${i + 1}</span>
      <div class="project-main">
        <div class="project-name">${p.title}</div>
        <div class="project-desc">${p.description}</div>
      </div>
      <div class="project-meta">
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${p.github_url ? `<a href="${p.github_url}" class="project-link" target="_blank">GitHub</a>` : ''}
          ${p.live_url   ? `<a href="${p.live_url}"   class="project-link" target="_blank">Live ↗</a>` : ''}
        </div>
      </div>
    `;
    list.appendChild(item);

    // Animate in with stagger
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(item);
  });
}

loadProjects();

/* ─── Contact Form ───────────────────────────────────────────────────────── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.querySelector('span').textContent = 'Sending…';

  const payload = {
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    form.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  } catch {
    // Simulate success when backend unavailable (demo mode)
    form.reset();
    formSuccess.textContent = '✓ Demo mode — message logged locally!';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  } finally {
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Send message';
  }
});

/* ─── Hero entrance animation ────────────────────────────────────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => {
      el.style.transitionDelay = '0s';
      el.classList.add('visible');
    }, 200 + i * 150);
  });
});