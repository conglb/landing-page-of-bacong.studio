// Dark mode toggle //
const themeToggle = document.getElementById('theme-toggle');
const lightIcon = document.getElementById('theme-toggle-light-icon');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
html.classList.add('dark');
lightIcon.classList.remove('hidden');
darkIcon.classList.add('hidden');
}

themeToggle.addEventListener('click', () => {
html.classList.toggle('dark');

if (html.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
    lightIcon.classList.remove('hidden');
    darkIcon.classList.add('hidden');
} else {
    localStorage.setItem('theme', 'light');
    lightIcon.classList.add('hidden');
    darkIcon.classList.remove('hidden');
}
});

// Consultation form //
const consultationForm = document.getElementById('consultation-form');
const formMessage = document.getElementById('form-message');

consultationForm.addEventListener('submit', (e) => {
e.preventDefault();
const email = document.getElementById('email-input').value;

// Show success message
formMessage.textContent = `Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn qua ${email} trong thời gian sớm nhất.`;
formMessage.classList.remove('hidden');
formMessage.classList.add('text-green-600', 'dark:text-green-400');

// Reset form
consultationForm.reset();

// Hide message after 5 seconds
setTimeout(() => {
    formMessage.classList.add('hidden');
}, 5000);
});