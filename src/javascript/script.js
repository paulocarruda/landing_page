/* script.js - EmailJS + menu mobile + scroll reveal + toasts */
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile_btn');
  const mobileMenu = document.getElementById('mobile_menu');
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('#nav_list .nav-item a');

  // ---------------- MOBILE MENU ----------------
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.toggle('active');
      mobileBtn.querySelector('i')?.classList.toggle('fa-x');
    });
  }

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

  // ---------------- SCROLLREVEAL ----------------
  try {
    ScrollReveal().reveal('#cta', { origin: 'left', duration: 1200, distance: '20%' });
    ScrollReveal().reveal('.tool', { origin: 'bottom', duration: 900, distance: '25px', interval: 100 });
    ScrollReveal().reveal('#formulario-contato', { origin: 'right', duration: 1200, distance: '20%' });
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
        message: form.querySelector('textarea[name="menssage"]').value,
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
