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

// Consultation form (IIFE - fixed)
(function () {
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  function isPhone(v) {
    return /^\+?[\d\s\-().]{7,20}$/.test(v);
  }

  function setMessage(text, ok = true) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('text-red-500', 'text-green-600', 'hidden');
    el.classList.add(ok ? 'text-green-600' : 'text-red-500');
  }

  async function submitContact(contact) {
    try {
      const res = await fetch('http://212.132.112.79:3000/api/submit_contact_from_bacong', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: contact 
      });
      const data = await res;
      if (res.ok) {
        return { ok: true, message: data.message || 'Yêu cầu đã được nhận, cảm ơn bạn!' };
      } else {
        return { ok: false, message: data.message || 'Gửi thất bại, thử lại sau. Vui lòng liên hệ trực tiếp congmb@gmail.com' };
      }
    } catch (err) {
      return { ok: false, message: 'Lỗi kết nối tới server. Vui lòng liên hệ trực tiếp congmb@gmail.com' };
    }
  }

  function attachForm() {
    const form = document.getElementById('consultation-form');
    const input = document.getElementById('email-input');
    if (!form || !input) return;
    if (form._attached) return;
    form._attached = true;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) {
        setMessage('Vui lòng nhập email hoặc số điện thoại.', false);
        return;
      }
      if (!isEmail(val) && !isPhone(val)) {
        setMessage('Vui lòng nhập email hợp lệ hoặc số điện thoại.', false);
        return;
      }

      setMessage('Đang gửi...', true);
      const result = await submitContact(val);
      if (result.ok) {
        setMessage(result.message, true);
        input.value = '';
      } else {
        setMessage(result.message, false);
      }
    });
  }

  window.addEventListener('includes:loaded', attachForm);
  window.addEventListener('DOMContentLoaded', () => {
    // if components already inline
    setTimeout(attachForm, 150);
  });
})();