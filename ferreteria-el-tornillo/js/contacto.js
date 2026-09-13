/**
 * ============================================================================
 * FERRETERÍA EL TORNILLO - SCRIPT PRINCIPAL
 * Funcionalidad:
 * 1. Validación del formulario en el navegador (Vanilla JS)
 * 2. Mensajes de error y confirmación de éxito sin recargar la página
 * 3. Menú móvil interactivo (toggle responsive)
 * 4. Navegación fluida y enlaces directos desde tarjetas de productos
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const contactForm = document.getElementById('contact-form');
  const nombreInput = document.getElementById('nombre');
  const mensajeInput = document.getElementById('mensaje');
  const nombreError = document.getElementById('nombre-error');
  const successAlert = document.getElementById('success-alert');
  const btnCloseAlert = document.getElementById('btn-close-alert');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  /* --------------------------------------------------------------------------
     1. GESTIÓN DEL MENÚ RESPONSIVE EN MÓVILES
     -------------------------------------------------------------------------- */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Cerrar el menú al hacer clic en cualquier enlace de navegación
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. INDICADOR DE SECCIÓN ACTIVA AL HACER SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset + 100;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* --------------------------------------------------------------------------
     3. VALIDACIÓN DEL FORMULARIO DE CONTACTO
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      // Prevenir el comportamiento por defecto de envío HTTP
      event.preventDefault();

      // Limpiar estados previos
      limpiarErrores();

      // Obtener y sanitizar el valor del campo Nombre
      const nombreValor = nombreInput.value.trim();

      // Reglas de validación:
      // 1. Campo obligatorio (no vacío)
      // 2. Mínimo 2 caracteres
      if (!nombreValor) {
        mostrarError(
          nombreInput, 
          nombreError, 
          'El nombre es obligatorio. Por favor ingresa tu nombre completo.'
        );
        return;
      }

      if (nombreValor.length < 2) {
        mostrarError(
          nombreInput, 
          nombreError, 
          'El nombre debe tener al menos 2 caracteres.'
        );
        return;
      }

      // Si supera las validaciones: formulario válido
      nombreInput.classList.remove('is-invalid');
      nombreInput.classList.add('is-valid');

      // Mostrar mensaje de éxito
      if (successAlert) {
        successAlert.style.display = 'flex';
        // Desplazar suavemente a la alerta para visibilidad en móviles
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Restablecer el formulario
      contactForm.reset();

      // Quitar clase is-valid después de unos segundos
      setTimeout(() => {
        nombreInput.classList.remove('is-valid');
      }, 4000);
    });

    // Validación interactiva mientras el usuario escribe en el campo Nombre
    nombreInput.addEventListener('input', () => {
      if (nombreInput.value.trim().length >= 2) {
        nombreError.style.display = 'none';
        nombreError.textContent = '';
        nombreInput.classList.remove('is-invalid');
      }
    });
  }

  /**
   * Muestra un mensaje de error y resalta el input inválido
   */
  function mostrarError(inputElement, errorElement, mensaje) {
    inputElement.classList.add('is-invalid');
    inputElement.classList.remove('is-valid');
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
    inputElement.focus();
  }

  /**
   * Limpia los mensajes y estilos de error
   */
  function limpiarErrores() {
    if (nombreError) {
      nombreError.style.display = 'none';
      nombreError.textContent = '';
    }
    if (nombreInput) {
      nombreInput.classList.remove('is-invalid');
    }
  }

  /* --------------------------------------------------------------------------
     4. BOTÓN CERRAR ALERTA DE ÉXITO
     -------------------------------------------------------------------------- */
  if (btnCloseAlert && successAlert) {
    btnCloseAlert.addEventListener('click', () => {
      successAlert.style.display = 'none';
    });
  }
});

/**
 * Función global para consultar un producto desde las tarjetas
 * Pre-rellena el mensaje y enfoca la sección de contacto
 * @param {string} categoriaNombre
 */
function consultarProducto(categoriaNombre) {
  const mensajeInput = document.getElementById('mensaje');
  const contactoSection = document.getElementById('contacto');
  const nombreInput = document.getElementById('nombre');

  if (mensajeInput) {
    mensajeInput.value = `Hola Ferretería El Tornillo, estoy interesado en cotizar y consultar disponibilidad en la categoría: ${categoriaNombre}.`;
  }

  if (contactoSection) {
    contactoSection.scrollIntoView({ behavior: 'smooth' });
  }

  if (nombreInput) {
    setTimeout(() => {
      nombreInput.focus();
    }, 600);
  }
}
