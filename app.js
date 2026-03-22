/* ========== PORTFOLIO APP — DATA + ADMIN + FIREBASE ========== */

(function () {
  'use strict';

  /* ---------- DEFAULT DATA ---------- */
  const DEFAULT_DATA = {
    profile: {
      name: 'Md. Sakib Hasan',
      title: 'Network & Cybersecurity Engineer',
      bio: 'Passionate about securing networks and building resilient systems. BSc in CSE with a focus on network security, cognitive radio research, and trust-aware spectrum sensing.',
      about: 'A recent BSc in Computer Science & Engineering graduate with a major in Networking. My work focuses on building secure, efficient network architectures and exploring advanced topics in cognitive radio networks, spectrum sensing, and trust management. I bring hands-on experience in electronics, microcontroller programming, software design, and system analysis, bridging the gap between hardware and software in cybersecurity solutions.',
      degreeShort: 'BSc in CSE (Network)',
      focus: 'Network & Cybersecurity',
      location: 'Bangladesh',
      photo: ''
    },
    education: [
      {
        year: '2020 — 2024',
        degree: 'BSc in Computer Science & Engineering',
        institution: 'Major in Networking',
        description: 'Focused on network security, wireless communications, and cognitive radio networks. Completed FYDP on trust-aware spectrum sensing in CRN.'
      },
      {
        year: '2018 — 2020',
        degree: 'Higher Secondary Certificate (HSC)',
        institution: 'Science Group',
        description: 'Completed with focus on Physics, Chemistry, and Mathematics.'
      }
    ],
    skills: [
      {
        icon: 'shield',
        name: 'Network Security',
        tags: ['Firewall Configuration', 'IDS/IPS', 'VPN', 'Wireshark', 'Nmap', 'Packet Analysis']
      },
      {
        icon: 'network',
        name: 'Networking',
        tags: ['TCP/IP', 'DNS', 'DHCP', 'Routing & Switching', 'VLAN', 'Cisco']
      },
      {
        icon: 'code-2',
        name: 'Programming',
        tags: ['C/C++', 'Python', 'Java', 'NED', 'LaTeX', 'SQL']
      },
      {
        icon: 'cpu',
        name: 'Hardware & IoT',
        tags: ['Arduino', 'Microcontrollers', 'Circuit Design', 'Sensors', 'PCB Design']
      },
      {
        icon: 'monitor',
        name: 'Tools & Platforms',
        tags: ['OMNeT++', 'GNS3', 'Linux', 'Git', 'VS Code', 'Matlab']
      },
      {
        icon: 'radio',
        name: 'Research',
        tags: ['Cognitive Radio', 'Spectrum Sensing', 'Trust Management', 'Network Simulation', 'Technical Writing']
      }
    ],
    projects: [
      {
        name: 'Trust-Aware Spectrum Sensing in CRN',
        type: 'Research',
        description: 'Developed a trust management system for cooperative spectrum sensing in cognitive radio networks using OMNeT++ simulation. Cluster-based architecture with malicious node detection.',
        tech: ['OMNeT++', 'C++', 'NED', 'Python'],
        image: '',
        link: ''
      },
      {
        name: 'Network Intrusion Detection System',
        type: 'Cybersecurity',
        description: 'Built a real-time network intrusion detection system using packet analysis and machine learning to classify normal vs malicious traffic patterns.',
        tech: ['Python', 'Wireshark', 'Scikit-learn', 'Pandas'],
        image: '',
        link: ''
      },
      {
        name: 'Smart Home Automation System',
        type: 'Electronics / IoT',
        description: 'Designed and implemented a smart home system using Arduino microcontrollers with sensor integration for temperature, motion, and light control.',
        tech: ['Arduino', 'C++', 'Sensors', 'Relay Modules'],
        image: '',
        link: ''
      },
      {
        name: 'Campus Network Design & Simulation',
        type: 'Networking',
        description: 'Designed a complete campus network topology with VLANs, routing protocols, and firewall rules. Simulated and tested using GNS3 and Cisco Packet Tracer.',
        tech: ['GNS3', 'Cisco', 'VLAN', 'OSPF'],
        image: '',
        link: ''
      },
      {
        name: 'Hospital Management System',
        type: 'Software Design',
        description: 'Full-stack hospital management application with patient records, appointment scheduling, and billing modules following system analysis and design methodology.',
        tech: ['Java', 'MySQL', 'UML', 'System Analysis'],
        image: '',
        link: ''
      },
      {
        name: 'Advanced OS Process Scheduler',
        type: 'Operating System',
        description: 'Implemented and compared multiple CPU scheduling algorithms (Round Robin, SJF, Priority) with visualization of process timelines and performance metrics.',
        tech: ['C', 'Linux', 'Algorithms', 'Data Structures'],
        image: '',
        link: ''
      }
    ],
    contact: {
      email: 'demo@example.com',
      phone: '+880 1XXX-XXXXXX',
      location: 'Dhaka, Bangladesh',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      intro: "I'm always open to discussing network security, research collaborations, or new opportunities. Feel free to reach out."
    },
    settings: {
      password: 'admin123'
    }
  };

  /* ---------- IN-MEMORY STATE ---------- */
  let siteData = JSON.parse(JSON.stringify(DEFAULT_DATA));
  let firebaseApp = null;
  let db = null;
  let storage = null;
  let fbConfig = null;

  /* ---------- AUTO-CONNECT FIREBASE ---------- */
  (function autoConnectFirebase() {
    try {
      firebaseApp = firebase.initializeApp({
        apiKey: 'AIzaSyDacyL3hIIEcK04TrToA2G1Ttc3iIuL028',
        projectId: 'my-portfolio-e846d',
        storageBucket: 'my-portfolio-e846d.firebasestorage.app'
      });
      db = firebase.firestore();
      storage = firebase.storage();
      console.log('Firebase auto-connected');
    } catch (e) {
      console.error('Firebase auto-connect failed:', e);
    }
  })();

  /* ---------- FIREBASE ---------- */
  function initFirebase(config) {
    try {
      if (firebaseApp) { /* already initialized */ return true; }
      firebaseApp = firebase.initializeApp({
        apiKey: config.apiKey,
        projectId: config.projectId,
        storageBucket: config.storageBucket
      });
      db = firebase.firestore();
      storage = firebase.storage();
      return true;
    } catch (e) {
      console.error('Firebase init failed:', e);
      return false;
    }
  }

  async function loadFromFirebase() {
    if (!db) return false;
    try {
      const doc = await db.collection('portfolio').doc('main').get();
      if (doc.exists) {
        const d = doc.data();
        // Merge with defaults so new fields are always present
        siteData = {
          profile: { ...DEFAULT_DATA.profile, ...(d.profile || {}) },
          education: d.education || DEFAULT_DATA.education,
          skills: d.skills || DEFAULT_DATA.skills,
          projects: d.projects || DEFAULT_DATA.projects,
          contact: { ...DEFAULT_DATA.contact, ...(d.contact || {}) },
          settings: { ...DEFAULT_DATA.settings, ...(d.settings || {}) }
        };
        return true;
      }
    } catch (e) { console.error('Firebase load error:', e); }
    return false;
  }

  async function saveToFirebase(section, data) {
    if (!db) return false;
    try {
      await db.collection('portfolio').doc('main').set(
        { [section]: data },
        { merge: true }
      );
      return true;
    } catch (e) { console.error('Firebase save error:', e); return false; }
  }

  async function uploadPhoto(file) {
    if (!storage) return null;
    try {
      const ref = storage.ref().child('profile/' + Date.now() + '-' + file.name);
      await ref.put(file);
      return await ref.getDownloadURL();
    } catch (e) { console.error('Upload error:', e); return null; }
  }

  /* ---------- RENDER FUNCTIONS ---------- */
  function renderPortfolio() {
    const p = siteData.profile;
    const c = siteData.contact;

    // Nav
    document.getElementById('nav-name').textContent = p.name.split(' ')[0] || 'Portfolio';

    // Hero
    document.getElementById('hero-title-text').textContent = p.title;
    document.getElementById('hero-name').textContent = p.name;
    document.getElementById('hero-bio').textContent = p.bio;

    // About
    document.getElementById('about-description').textContent = p.about;
    document.getElementById('detail-name').textContent = p.name;
    document.getElementById('detail-degree').textContent = p.degreeShort;
    document.getElementById('detail-focus').textContent = p.focus;
    document.getElementById('detail-location').textContent = p.location;

    // Photo
    const imgWrap = document.getElementById('about-image');
    if (p.photo) {
      imgWrap.innerHTML = '<img src="' + p.photo + '" alt="' + p.name + '">';
    }

    // Education
    renderEducation();

    // Skills
    renderSkills();

    // Projects
    renderProjects();

    // Contact
    document.getElementById('contact-intro').textContent = c.intro;
    document.getElementById('contact-email').textContent = c.email;
    document.getElementById('contact-email-link').href = 'mailto:' + c.email;
    document.getElementById('contact-phone').textContent = c.phone;
    document.getElementById('contact-phone-link').href = 'tel:' + c.phone.replace(/\s/g, '');
    document.getElementById('contact-location').textContent = c.location;
    document.getElementById('social-github').href = c.github || '#';
    document.getElementById('social-linkedin').href = c.linkedin || '#';

    // Terminal
    document.getElementById('terminal-name').textContent = p.name.toLowerCase().replace(/\s+/g, '.').replace(/md\.\s*/i, '');
    document.getElementById('terminal-spec').textContent = p.title;

    // Footer
    document.getElementById('footer-name').textContent = p.name;
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    // Page title
    document.title = p.name + ' — ' + p.title;

    // Re-init icons
    if (window.lucide) lucide.createIcons();
  }

  function renderEducation() {
    const tl = document.getElementById('education-timeline');
    tl.innerHTML = siteData.education.map(e => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <span class="timeline-year">${esc(e.year)}</span>
          <h3 class="timeline-degree">${esc(e.degree)}</h3>
          <p class="timeline-inst">${esc(e.institution)}</p>
          <p class="timeline-desc">${esc(e.description)}</p>
        </div>
      </div>
    `).join('');
  }

  function renderSkills() {
    const grid = document.getElementById('skills-grid');
    grid.innerHTML = siteData.skills.map(s => `
      <div class="skill-category reveal">
        <div class="skill-cat-icon"><i data-lucide="${esc(s.icon)}" width="24" height="24"></i></div>
        <h3>${esc(s.name)}</h3>
        <div class="skill-tags">${s.tags.map(t => `<span class="skill-tag">${esc(t)}</span>`).join('')}</div>
      </div>
    `).join('');
  }

  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = siteData.projects.map(p => `
      <div class="project-card reveal">
        <div class="project-thumb">
          ${p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : '<div class="project-thumb-icon"><i data-lucide="folder-code" width="40" height="40"></i></div>'}
        </div>
        <div class="project-body">
          <div class="project-type">${esc(p.type)}</div>
          <h3 class="project-name">${esc(p.name)}</h3>
          <p class="project-desc">${esc(p.description)}</p>
          <div class="project-tech">${p.tech.map(t => '<span>' + esc(t) + '</span>').join('')}</div>
        </div>
      </div>
    `).join('');
  }

  function esc(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

  /* ---------- PARTICLE CANVAS ---------- */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: -1000, y: -1000 };
    let frame = 0;

    // Color palette for particles
    const COLORS_DARK = [
      { r: 0, g: 229, b: 255 },   // cyan
      { r: 168, g: 85, b: 247 },  // purple
      { r: 99, g: 102, b: 241 },  // indigo
      { r: 56, g: 189, b: 248 },  // sky blue
      { r: 0, g: 229, b: 255 },   // cyan again (weight)
    ];
    const COLORS_LIGHT = [
      { r: 8, g: 145, b: 178 },   // teal
      { r: 124, g: 58, b: 237 },  // purple
      { r: 99, g: 102, b: 241 },  // indigo
      { r: 14, g: 116, b: 144 },  // dark teal
    ];

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(120, Math.floor((w * h) / 8000));
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const colors = isDark ? COLORS_DARK : COLORS_LIGHT;

      for (let i = 0; i < count; i++) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2.5 + 1,
          color: c,
          pulse: Math.random() * Math.PI * 2,  // phase offset for pulsing
          speed: 0.02 + Math.random() * 0.02
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      frame++;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const connectDist = 180;
      const mouseDist = 250;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const c = p.color;
        const alpha = isDark ? 0.85 : 0.65;

        // Draw particle — solid color, no pulsing
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
        ctx.fill();

        // Connection lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const alpha = (1 - dist / connectDist) * (isDark ? 0.25 : 0.15);
            // Gradient line between two colored particles
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            grad.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')');
            grad.addColorStop(1, 'rgba(' + p2.color.r + ',' + p2.color.g + ',' + p2.color.b + ',' + alpha + ')');
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse interaction — stronger, brighter
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseDist) {
          const mAlpha = (1 - mdist / mouseDist) * (isDark ? 0.5 : 0.35);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + mAlpha + ')';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Push particles slightly away from mouse for interactive feel
          if (mdist < 100) {
            p.x += mdx * 0.005;
            p.y += mdy * 0.005;
          }
        }
      }

      // Draw mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const mgrd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
        mgrd.addColorStop(0, isDark ? 'rgba(0,229,255,0.08)' : 'rgba(8,145,178,0.06)');
        mgrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = mgrd;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
  }

  /* ---------- THEME TOGGLE ---------- */
  function initTheme() {
    const html = document.documentElement;
    const btn = document.querySelector('[data-theme-toggle]');
    let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    // Default to dark for the cyber vibe
    theme = 'dark';
    html.setAttribute('data-theme', theme);
    updateThemeIcon(btn, theme);

    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      updateThemeIcon(btn, theme);
    });
  }
  function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    // Remove old reveal classes first
    document.querySelectorAll('.reveal, .reveal-right, .reveal-stagger').forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.remove('reveal', 'reveal-right', 'reveal-stagger');
      }
    });

    // Get all sections in order
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      const isLeft = index % 2 === 0; // even = left, odd = right
      const dir = isLeft ? 'reveal' : 'reveal-right';

      // Section header — alternating direction
      const header = section.querySelector('.section-header');
      if (header && !header.classList.contains('visible')) {
        header.classList.add(dir);
      }

      // Main content block — opposite direction for visual interest
      const contentBlocks = section.querySelectorAll('.about-grid, .contact-grid');
      contentBlocks.forEach(block => {
        if (!block.classList.contains('visible')) {
          block.classList.add(isLeft ? 'reveal-right' : 'reveal');
        }
      });

      // Grids with stagger effect
      const grids = section.querySelectorAll('.skills-grid, .projects-grid');
      grids.forEach(grid => {
        if (!grid.classList.contains('visible')) {
          grid.classList.add('reveal-stagger');
          grid.classList.add(dir);
        }
      });

      // Timeline items — alternate each item
      const timelineItems = section.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, i) => {
        if (!item.classList.contains('visible')) {
          item.classList.add(i % 2 === 0 ? 'reveal' : 'reveal-right');
        }
      });
    });

    // Observe all animated elements — re-trigger every time
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // Remove visible so it re-animates when scrolled back into view
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .reveal-right, .reveal-stagger').forEach(el => {
      observer.observe(el);
    });
  }

  /* ---------- NAVBAR ---------- */
  function initNavbar() {
    let lastScroll = 0;
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll > 100 && scroll > lastScroll) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      if (scroll > 50) {
        nav.style.boxShadow = 'var(--shadow-md)';
      } else {
        nav.style.boxShadow = 'none';
      }
      lastScroll = scroll;
    });

    // Mobile menu
    const btn = document.getElementById('mobile-menu-btn');
    const links = document.getElementById('nav-links');
    btn.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  /* ---------- TOAST ---------- */
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ---------- ADMIN PANEL ---------- */
  function initAdmin() {
    const overlay = document.getElementById('admin-overlay');
    const loginDiv = document.getElementById('admin-login');
    const dashDiv = document.getElementById('admin-dashboard');
    const loginBtn = document.getElementById('admin-login-btn');
    const closeBtn = document.getElementById('admin-close');
    const errorMsg = document.getElementById('admin-error');
    const pwInput = document.getElementById('admin-pw');
    let isAuth = false;

    // Open with #admin
    function checkHash() {
      if (window.location.hash === '#admin') {
        overlay.style.display = 'flex';
        if (isAuth) {
          loginDiv.style.display = 'none';
          dashDiv.style.display = 'block';
        } else {
          loginDiv.style.display = 'block';
          dashDiv.style.display = 'none';
        }
        if (window.lucide) lucide.createIcons();
      } else {
        overlay.style.display = 'none';
      }
    }
    window.addEventListener('hashchange', checkHash);
    checkHash();

    loginBtn.addEventListener('click', () => {
      if (pwInput.value === siteData.settings.password) {
        isAuth = true;
        loginDiv.style.display = 'none';
        dashDiv.style.display = 'block';
        errorMsg.style.display = 'none';
        populateAdminFields();
        if (window.lucide) lucide.createIcons();
      } else {
        errorMsg.style.display = 'block';
      }
    });
    pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });

    closeBtn.addEventListener('click', () => {
      window.location.hash = '';
    });

    // Tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
        if (window.lucide) lucide.createIcons();
      });
    });

    // Photo upload
    const photoUpload = document.getElementById('photo-upload');
    const photoInput = document.getElementById('a-photo');
    const photoPreview = document.getElementById('photo-preview');
    photoUpload.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      // Show preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        photoPreview.innerHTML = '<img src="' + ev.target.result + '" alt="Preview">';
      };
      reader.readAsDataURL(file);

      // Upload to Firebase if available
      if (storage) {
        showToast('Uploading photo...');
        const url = await uploadPhoto(file);
        if (url) {
          siteData.profile.photo = url;
          showToast('Photo uploaded!');
        } else {
          // Fallback to data URL
          siteData.profile.photo = photoPreview.querySelector('img')?.src || '';
          showToast('Photo saved locally');
        }
      } else {
        siteData.profile.photo = photoPreview.querySelector('img')?.src || '';
      }
    });

    // Save handlers
    document.getElementById('save-profile').addEventListener('click', async () => {
      siteData.profile.name = v('a-name');
      siteData.profile.title = v('a-title');
      siteData.profile.bio = v('a-bio');
      siteData.profile.about = v('a-about');
      siteData.profile.degreeShort = v('a-degree-short');
      siteData.profile.focus = v('a-focus');
      siteData.profile.location = v('a-location');
      await saveToFirebase('profile', siteData.profile);
      renderPortfolio();
      showToast('Profile saved!');
    });

    document.getElementById('save-edu').addEventListener('click', async () => {
      collectEducation();
      await saveToFirebase('education', siteData.education);
      renderPortfolio();
      initReveal();
      showToast('Education saved!');
    });

    document.getElementById('save-skills').addEventListener('click', async () => {
      collectSkills();
      await saveToFirebase('skills', siteData.skills);
      renderPortfolio();
      initReveal();
      showToast('Skills saved!');
    });

    document.getElementById('save-projects').addEventListener('click', async () => {
      collectProjects();
      await saveToFirebase('projects', siteData.projects);
      renderPortfolio();
      initReveal();
      showToast('Projects saved!');
    });

    document.getElementById('save-contact').addEventListener('click', async () => {
      siteData.contact.email = v('a-email');
      siteData.contact.phone = v('a-phone');
      siteData.contact.location = v('a-contact-loc');
      siteData.contact.github = v('a-github');
      siteData.contact.linkedin = v('a-linkedin');
      siteData.contact.intro = v('a-contact-intro');
      await saveToFirebase('contact', siteData.contact);
      renderPortfolio();
      showToast('Contact saved!');
    });

    document.getElementById('save-settings').addEventListener('click', async () => {
      const newPw = v('a-newpw');
      if (newPw.length >= 4) {
        siteData.settings.password = newPw;
        await saveToFirebase('settings', siteData.settings);
        showToast('Password updated!');
      } else {
        showToast('Password must be at least 4 characters');
      }
    });

    document.getElementById('save-firebase').addEventListener('click', async () => {
      const key = v('a-fb-key');
      const proj = v('a-fb-project');
      const bucket = v('a-fb-bucket');
      if (key && proj) {
        fbConfig = { apiKey: key, projectId: proj, storageBucket: bucket };
        if (initFirebase(fbConfig)) {
          showToast('Firebase connected! Loading data...');
          const loaded = await loadFromFirebase();
          if (loaded) {
            renderPortfolio();
            populateAdminFields();
            initReveal();
            showToast('Data loaded from Firebase!');
          } else {
            // Save current data to Firebase
            await saveToFirebase('profile', siteData.profile);
            await saveToFirebase('education', siteData.education);
            await saveToFirebase('skills', siteData.skills);
            await saveToFirebase('projects', siteData.projects);
            await saveToFirebase('contact', siteData.contact);
            await saveToFirebase('settings', siteData.settings);
            showToast('Firebase initialized & data synced!');
          }
        } else {
          showToast('Firebase connection failed. Check config.');
        }
      } else {
        showToast('API Key and Project ID are required.');
      }
    });

    // Admin FAB button
    const adminFab = document.getElementById('admin-fab');
    if (adminFab) {
      adminFab.addEventListener('click', () => {
        window.location.hash = '#admin';
      });
    }

    // Add buttons
    document.getElementById('add-edu').addEventListener('click', () => {
      siteData.education.push({ year: '', degree: '', institution: '', description: '' });
      renderEduList();
    });
    document.getElementById('add-skill-cat').addEventListener('click', () => {
      siteData.skills.push({ icon: 'star', name: '', tags: [] });
      renderSkillList();
    });
    document.getElementById('add-project').addEventListener('click', () => {
      siteData.projects.push({ name: '', type: '', description: '', tech: [], image: '', link: '' });
      renderProjectList();
    });
  }

  function v(id) { return document.getElementById(id).value.trim(); }

  function populateAdminFields() {
    const p = siteData.profile;
    const c = siteData.contact;
    document.getElementById('a-name').value = p.name;
    document.getElementById('a-title').value = p.title;
    document.getElementById('a-bio').value = p.bio;
    document.getElementById('a-about').value = p.about;
    document.getElementById('a-degree-short').value = p.degreeShort;
    document.getElementById('a-focus').value = p.focus;
    document.getElementById('a-location').value = p.location;
    document.getElementById('a-email').value = c.email;
    document.getElementById('a-phone').value = c.phone;
    document.getElementById('a-contact-loc').value = c.location;
    document.getElementById('a-github').value = c.github;
    document.getElementById('a-linkedin').value = c.linkedin;
    document.getElementById('a-contact-intro').value = c.intro;

    if (p.photo) {
      document.getElementById('photo-preview').innerHTML = '<img src="' + p.photo + '" alt="Preview">';
    }

    renderEduList();
    renderSkillList();
    renderProjectList();
  }

  function renderEduList() {
    const c = document.getElementById('edu-list');
    c.innerHTML = siteData.education.map((e, i) => `
      <div class="admin-list-item">
        <button class="remove-btn" data-idx="${i}" data-type="edu" aria-label="Remove">✕</button>
        <div class="admin-field"><label>Year Range</label><input type="text" class="edu-year" value="${esc(e.year)}" placeholder="2020 — 2024"></div>
        <div class="admin-field"><label>Degree / Title</label><input type="text" class="edu-degree" value="${esc(e.degree)}" placeholder="BSc in CSE"></div>
        <div class="admin-field"><label>Institution / Details</label><input type="text" class="edu-inst" value="${esc(e.institution)}" placeholder="Major in Networking"></div>
        <div class="admin-field"><label>Description</label><textarea class="edu-desc" rows="2" placeholder="Brief description">${esc(e.description)}</textarea></div>
      </div>
    `).join('');
    c.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        siteData.education.splice(parseInt(btn.dataset.idx), 1);
        renderEduList();
      });
    });
  }

  function collectEducation() {
    const items = document.querySelectorAll('#edu-list .admin-list-item');
    siteData.education = Array.from(items).map(el => ({
      year: el.querySelector('.edu-year').value.trim(),
      degree: el.querySelector('.edu-degree').value.trim(),
      institution: el.querySelector('.edu-inst').value.trim(),
      description: el.querySelector('.edu-desc').value.trim()
    }));
  }

  function renderSkillList() {
    const c = document.getElementById('skill-list');
    c.innerHTML = siteData.skills.map((s, i) => `
      <div class="admin-list-item">
        <button class="remove-btn" data-idx="${i}" data-type="skill" aria-label="Remove">✕</button>
        <div class="admin-field"><label>Category Name</label><input type="text" class="sk-name" value="${esc(s.name)}" placeholder="e.g. Network Security"></div>
        <div class="admin-field"><label>Icon (Lucide name)</label><input type="text" class="sk-icon" value="${esc(s.icon)}" placeholder="e.g. shield, network, code-2"></div>
        <div class="admin-field"><label>Skills (comma-separated)</label><input type="text" class="sk-tags" value="${s.tags.join(', ')}" placeholder="Wireshark, Nmap, Firewall"></div>
      </div>
    `).join('');
    c.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        siteData.skills.splice(parseInt(btn.dataset.idx), 1);
        renderSkillList();
      });
    });
  }

  function collectSkills() {
    const items = document.querySelectorAll('#skill-list .admin-list-item');
    siteData.skills = Array.from(items).map(el => ({
      name: el.querySelector('.sk-name').value.trim(),
      icon: el.querySelector('.sk-icon').value.trim() || 'star',
      tags: el.querySelector('.sk-tags').value.split(',').map(t => t.trim()).filter(Boolean)
    }));
  }

  function renderProjectList() {
    const c = document.getElementById('project-list');
    c.innerHTML = siteData.projects.map((p, i) => `
      <div class="admin-list-item" data-proj-idx="${i}">
        <button class="remove-btn" data-idx="${i}" data-type="project" aria-label="Remove">✕</button>
        <div class="admin-field"><label>Project Name</label><input type="text" class="pj-name" value="${esc(p.name)}" placeholder="Project name"></div>
        <div class="admin-field"><label>Type / Category</label><input type="text" class="pj-type" value="${esc(p.type)}" placeholder="e.g. Research, IoT, Networking"></div>
        <div class="admin-field"><label>Description</label><textarea class="pj-desc" rows="2" placeholder="Project description">${esc(p.description)}</textarea></div>
        <div class="admin-field"><label>Technologies (comma-separated)</label><input type="text" class="pj-tech" value="${p.tech.join(', ')}" placeholder="Python, C++, OMNeT++"></div>
        <div class="admin-field">
          <label>Project Image (recommended: 800×450px, 16:9 ratio)</label>
          <div class="pj-img-wrap">
            <div class="pj-img-preview" data-idx="${i}">
              ${p.image ? '<img src="' + esc(p.image) + '" alt="Preview">' : '<div class="pj-img-empty"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>No image</span></div>'}
            </div>
            <div class="pj-img-actions">
              <button type="button" class="btn btn-outline btn-sm pj-upload-btn" data-idx="${i}">Upload Image</button>
              <input type="file" class="pj-file-input" data-idx="${i}" accept="image/png,image/jpeg,image/webp" style="display:none">
              <span class="pj-img-or">or</span>
              <input type="url" class="pj-image" value="${esc(p.image)}" placeholder="Paste image URL">
            </div>
            <p class="pj-img-hint">Accepts JPG, PNG, WebP. Auto-resized to 800×450 for optimal display.</p>
          </div>
        </div>
        <div class="admin-field"><label>Project Link (optional)</label><input type="url" class="pj-link" value="${esc(p.link)}" placeholder="https://github.com/..."></div>
      </div>
    `).join('');

    // Remove buttons
    c.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        siteData.projects.splice(parseInt(btn.dataset.idx), 1);
        renderProjectList();
      });
    });

    // Upload buttons
    c.querySelectorAll('.pj-upload-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.idx;
        c.querySelector('.pj-file-input[data-idx="' + idx + '"]').click();
      });
    });

    // File inputs
    c.querySelectorAll('.pj-file-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const idx = parseInt(input.dataset.idx);
        const preview = c.querySelector('.pj-img-preview[data-idx="' + idx + '"]');
        const urlInput = input.closest('.pj-img-wrap').querySelector('.pj-image');

        showToast('Processing image...');

        try {
          const resized = await resizeProjectImage(file, 800, 450);

          // Show preview
          preview.innerHTML = '<img src="' + resized + '" alt="Preview">';

          // Try Firebase upload
          if (storage) {
            const ref = storage.ref().child('projects/' + Date.now() + '-' + file.name);
            const blob = dataURLtoBlob(resized);
            await ref.put(blob);
            const firebaseUrl = await ref.getDownloadURL();
            urlInput.value = firebaseUrl;
            siteData.projects[idx].image = firebaseUrl;
            showToast('Image uploaded to cloud!');
          } else {
            // Store as data URL
            urlInput.value = resized;
            siteData.projects[idx].image = resized;
            showToast('Image ready! Connect Firebase for cloud storage.');
          }
        } catch (err) {
          console.error('Image processing error:', err);
          showToast('Image processing failed. Try a different file.');
        }
      });
    });
  }

  // Resize image to exact dimensions with canvas
  function resizeProjectImage(file, targetW, targetH) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          // Cover-fit: scale and center-crop to fill target dimensions
          const srcRatio = img.width / img.height;
          const tgtRatio = targetW / targetH;
          let sx, sy, sw, sh;
          if (srcRatio > tgtRatio) {
            // Source is wider: crop sides
            sh = img.height;
            sw = img.height * tgtRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            // Source is taller: crop top/bottom
            sw = img.width;
            sh = img.width / tgtRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);

          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert data URL to Blob for Firebase upload
  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const raw = atob(parts[1]);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }

  function collectProjects() {
    const items = document.querySelectorAll('#project-list .admin-list-item');
    siteData.projects = Array.from(items).map(el => ({
      name: el.querySelector('.pj-name').value.trim(),
      type: el.querySelector('.pj-type').value.trim(),
      description: el.querySelector('.pj-desc').value.trim(),
      tech: el.querySelector('.pj-tech').value.split(',').map(t => t.trim()).filter(Boolean),
      image: el.querySelector('.pj-image').value.trim(),
      link: el.querySelector('.pj-link').value.trim()
    }));
  }

  /* ---------- LOADER PARTICLES ---------- */
  function initLoaderParticles() {
    const canvas = document.getElementById('loader-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, pts = [], animId;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function create() {
      pts = [];
      const count = Math.min(60, Math.floor((w * h) / 18000));
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 0.8,
          cyan: Math.random() > 0.4
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const col = p.cyan ? '0,229,255' : '168,85,247';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + col + ',0.7)';
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(' + col + ',' + ((1 - dist / 150) * 0.2) + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    resize(); create(); draw();
    window.addEventListener('resize', () => { resize(); create(); });
    return () => { cancelAnimationFrame(animId); };
  }

  /* ---------- INIT ---------- */
  async function init() {
    // Start loader particles
    const stopLoaderParticles = initLoaderParticles();

    initTheme();
    initNavbar();
    initParticles();

    // Load data from Firebase first
    if (db) {
      const loaded = await loadFromFirebase();
      if (loaded) console.log('Data loaded from Firebase');
    }

    renderPortfolio();

    // Dismiss loader, show content
    const loader = document.getElementById('loader-screen');
    if (loader) loader.classList.add('hidden');
    document.body.classList.remove('loading');
    if (stopLoaderParticles) stopLoaderParticles();
    setTimeout(() => { if (loader) loader.remove(); }, 600);

    setTimeout(initReveal, 200);
    initAdmin();
    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
