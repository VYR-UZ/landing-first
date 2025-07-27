// Archivo: script.js

// Funcionalidad del Loader
window.addEventListener('load', () => {
    const loaderOverlay = document.getElementById('loader-overlay');
    if (loaderOverlay) {
        loaderOverlay.classList.add('hidden');
        // Opcional: Elimina el loader del DOM después de la transición para liberar recursos
        loaderOverlay.addEventListener('transitionend', () => {
            loaderOverlay.remove();
        });
    }
});

// Funcionalidad del botón Volver Arriba
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    // Muestra el botón después de 300px de scroll
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Desplazamiento suave
    });
});

// Animaciones al hacer Scroll (Scroll Reveal)
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null, // El viewport es el elemento raíz
        rootMargin: '0px',
        threshold: 0.1 // El 10% del elemento debe ser visible para activar la animación
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal-visible');
                observer.unobserve(entry.target); // Deja de observar una vez que el elemento es visible
            }
        });
    }, observerOptions);

    // Observa todos los elementos con la clase 'scroll-reveal'
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
});

// Envío del Formulario a Google Apps Script
const contactForm = document.getElementById('contactForm');
const formStatusMessage = document.getElementById('formStatusMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene el envío por defecto del formulario

    // URL de tu Google Apps Script desplegado como aplicación web
    // ¡IMPORTANTE: CAMBIA ESTO con la URL real que obtendrás después de desplegar tu Apps Script!
    const SCRIPT_URL = 'TU_URL_DE_APPS_SCRIPT_DESPLEGADO_AQUI'; 

    formStatusMessage.textContent = 'Enviando...';
    formStatusMessage.style.color = 'var(--medium-blue-text)'; // Usar variable CSS para el color de "Enviando..."

    const formData = new FormData(contactForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Necesario para solicitudes entre dominios (CORS)
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Formato de datos esperado por Apps Script
            },
            body: new URLSearchParams(data).toString(), // Convierte los datos a formato URL-encoded
        });

        const result = await response.json(); // Espera la respuesta JSON del Apps Script

        if (result.success) {
            formStatusMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto. ✅';
            formStatusMessage.style.color = 'var(--vibrant-blue)'; // Usar variable CSS para el color de éxito
            contactForm.reset(); // Limpia el formulario después del envío exitoso
        } else {
            formStatusMessage.textContent = 'Error al enviar el mensaje. Inténtalo de nuevo. ❌';
            formStatusMessage.style.color = '#dc3545'; // Color rojo para error
            console.error('Error del Apps Script:', result.message); // Muestra el mensaje de error del Apps Script en consola
        }
    } catch (error) {
        formStatusMessage.textContent = 'Error de red. Por favor, verifica tu conexión. 🌐';
        formStatusMessage.style.color = '#dc3545'; // Color rojo para error de red
        console.error('Error de fetch:', error); // Muestra el error de la solicitud fetch en consola
    }
});