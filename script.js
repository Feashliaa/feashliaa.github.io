
// Simple script to set active navigation link based on current hash
function setActiveNav() {
    const hash = window.location.hash || '#home'; // Default to #home if no hash
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === hash);
    });
}

window.addEventListener('hashchange', setActiveNav); // Update active link on hash change
window.addEventListener('load', setActiveNav); // Set active link on page load