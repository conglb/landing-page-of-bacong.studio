// Simple client-side i18n. Marks: elements must have data-i18n="key".
const TRANSLATIONS = {
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.about": "About",
    "nav.contact": "Contact",
    "hero.title": "Digital transformation services",
    "hero.subtitle": "Software solutions for shops, hospitals and companies.",
    "contact.heading": "Contact us"
  },
  vi: {
    "nav.home": "Trang chủ",
    "nav.products": "Sản phẩm",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "hero.title": "Dịch vụ chuyển đổi số",
    "hero.subtitle": "Giải pháp phần mềm cho cửa hàng, bệnh viện và doanh nghiệp.",
    "contact.heading": "Liên hệ với chúng tôi"
  },
  es: {
    "nav.home": "Inicio",
    "nav.products": "Productos",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "hero.title": "Servicios de transformación digital",
    "hero.subtitle": "Soluciones de software para tiendas, hospitales y empresas.",
    "contact.heading": "Contáctanos"
  }
};

function applyTranslations(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const txt = dict[key];
    if (txt === undefined) return;
    // if element requests html set via data-i18n-html, use innerHTML
    if (el.hasAttribute('data-i18n-html')) el.innerHTML = txt;
    else el.textContent = txt;
  });
  // set html lang attribute
  document.documentElement.lang = lang;
  // persist
  localStorage.setItem('site-lang', lang);
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
}

function initI18n() {
  const saved = localStorage.getItem('site-lang') || navigator.language?.slice(0,2) || 'en';
  const lang = ['en','vi','es'].includes(saved) ? saved : 'en';
  applyTranslations(lang);

  const sel = document.getElementById('lang-select');
  if (sel) {
    sel.value = lang;
    sel.addEventListener('change', (e) => {
      applyTranslations(e.target.value);
    });
  }
}

// Run after includes loaded (so injected components exist)
window.addEventListener('includes:loaded', initI18n);
window.addEventListener('DOMContentLoaded', () => {
  // also attempt init in case includes were already inline
  setTimeout(initI18n, 50);
});