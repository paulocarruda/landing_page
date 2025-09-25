/* script.js - EmailJS + menu mobile + scroll reveal + toasts */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  // ---------------- MOBILE MENU ----------------

  // ---------------- SCROLL: SHADOW + ACTIVE MENU ----------------
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    header.style.boxShadow = scrollPosition > 0 ? '0 2px 10px rgba(0,0,0,0.15)' : 'none';

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - header.offsetHeight - 50;
      if (scrollPosition >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  });

  let lastScrollY = window.scrollY;
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) { // Oculte a navbar se o usuário rolar para cima
      nav.classList.add('show');
    } else { // Mostre a navbar se o usuário rolar para baixo
      nav.classList.remove('show');
    }

    lastScrollY = window.scrollY;
  });

  // ---------------- SCROLLREVEAL ----------------
  try {
    const sr = ScrollReveal({
      reset: false,          // anima uma vez só
      distance: '30px',      // distância padrão
      duration: 1000,        // duração padrão
      easing: 'ease-in-out', // suavidade da animação
      viewFactor: 0.3        // quanto da seção precisa aparecer para animar
    });

    sr.reveal('#cta', { origin: 'left' });
    sr.reveal('.tool', { origin: 'bottom', interval: 150 });
    sr.reveal('#formulario-contato', { origin: 'right' });
    sr.reveal('inicio', { origin: 'top', duration: 800 });
    sr.reveal('.imagem-reveal', {
      origin: 'bottom',
      distance: '40px',
      duration: 1200,
      interval: 200
    });
    sr.reveal('.reveal-card', {
      origin: 'bottom',
      distance: '40px',
      duration: 1000,
      interval: 200
    });
    sr.reveal('footer', { origin: 'bottom', duration: 800 });

  } catch (err) {
    console.warn('ScrollReveal não disponível', err);
  }

  // ---------------- EMAILJS FORM ----------------
  const form = document.getElementById('formulario-contato');
  if (form && window.emailjs) {
    const SERVICE_ID = form.dataset.serviceId;
    const TEMPLATE_ID = form.dataset.templateId;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Tentando enviar formulário');
      const submitBtn = form.querySelector('button[type="submit"]');
      const prevText = submitBtn?.textContent;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      const formData = {
        name: form.querySelector('input[name="name"]').value,
        message: form.querySelector('textarea[name="message"]').value,
        email: form.querySelector('input[name="email"]').value,
        subject: form.querySelector('input[name="subject"]').value,
      };
      console.log(formData);
      emailjs.send('service_ewe44qo', 'template_6lf457m', formData)
        .then(() => {
          console.log('Sucesso!');
          showToast('Mensagem enviada com sucesso!', 'success');
          form.reset();
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          showToast('Erro ao enviar. Tente novamente mais tarde.', 'error');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = prevText || 'Enviar';
          }
        });
    });
  }

  // ---------------- TOASTS ----------------
  function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.right = '20px';
      container.style.bottom = '20px';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = 'info') {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.minWidth = '200px';
    toast.style.marginTop = '8px';
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.color = '#fff';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 260ms ease';

    if (type === 'success') toast.style.background = '#2ecc71';
    else if (type === 'error') toast.style.background = '#e74c3c';
    else toast.style.background = '#333';

    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }
});
