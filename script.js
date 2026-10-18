const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

if (slides.length) {
  prevButton?.addEventListener('click', prevSlide);
  nextButton?.addEventListener('click', nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  setInterval(nextSlide, 5000);
}

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

if (tabButtons.length) {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;

      tabButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === tab);
      });
    });
  });
}

const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const productCards = [...document.querySelectorAll('.product-card')];
const wishlistKey = 'daily-lifestyle-wishlist';

function getWishlist() {
  return JSON.parse(localStorage.getItem(wishlistKey) || '[]');
}

function saveWishlist(items) {
  localStorage.setItem(wishlistKey, JSON.stringify(items));
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const count = document.querySelector('.wishlist-count');
  if (count) {
    count.textContent = wishlist.length;
  }

  document.querySelectorAll('.wishlist').forEach((button) => {
    const productId = button.dataset.product;
    const active = wishlist.includes(productId);
    button.classList.toggle('active', active);
    button.textContent = active ? '♥' : '♡';
  });
}

function openSearchModal() {
  if (!searchModal) return;
  searchModal.classList.remove('hidden');
  searchModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => searchInput?.focus(), 50);
}

function closeSearchModal() {
  if (!searchModal) return;
  searchModal.classList.add('hidden');
  searchModal.setAttribute('aria-hidden', 'true');
}

function filterProducts(term) {
  const query = term.toLowerCase().trim();
  productCards.forEach((card) => {
    const name = card.dataset.name?.toLowerCase() || '';
    const category = card.dataset.category?.toLowerCase() || '';
    const match = !query || name.includes(query) || category.includes(query);
    card.style.display = match ? '' : 'none';
  });

  if (!searchResults) return;

  const matches = productCards.filter((card) => card.style.display !== 'none');

  if (!query) {
    searchResults.innerHTML = '<p>Type to search products or categories.</p>';
    return;
  }

  if (!matches.length) {
    searchResults.innerHTML = '<p>No matching products found.</p>';
    return;
  }

  searchResults.innerHTML = matches
    .slice(0, 5)
    .map((card) => {
      const name = card.dataset.name || 'Product';
      const category = card.dataset.category || 'Collection';
      return `<div class="search-item"><strong>${name}</strong><span>${category}</span></div>`;
    })
    .join('');
}

searchInput?.addEventListener('input', (event) => filterProducts(event.target.value));

document.querySelector('.search-toggle')?.addEventListener('click', openSearchModal);
document.querySelectorAll('[data-close-search]').forEach((trigger) => {
  trigger.addEventListener('click', closeSearchModal);
});

const quickViewModal = document.getElementById('quick-view-modal');
const quickViewContent = document.getElementById('quick-view-content');

function openQuickView(productId) {
  const product = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (!product || !quickViewContent) return;

  const image = product.querySelector('.product-image').style.backgroundImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  const name = product.dataset.name || 'Product';
  const category = product.dataset.category || 'Collection';
  const price = product.querySelector('.price')?.textContent || '৳0';

  quickViewContent.innerHTML = `
    <div class="quick-view-image" style="background-image: url('${image}')"></div>
    <div class="quick-view-info">
      <span class="tag">${category}</span>
      <h3>${name}</h3>
      <p>Premium fit, breathable fabric, and easy movement for modern everyday wear.</p>
      <div class="price-row">
        <span class="price">${price}</span>
      </div>
      <button class="btn btn-primary">Add to cart</button>
    </div>
  `;

  quickViewModal.classList.remove('hidden');
  quickViewModal.setAttribute('aria-hidden', 'false');
}

function closeQuickView() {
  quickViewModal.classList.add('hidden');
  quickViewModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.quick-view-btn').forEach((button) => {
  button.addEventListener('click', () => openQuickView(button.dataset.product));
});

document.querySelectorAll('[data-close-quick-view]').forEach((button) => {
  button.addEventListener('click', closeQuickView);
});

const memberModal = document.getElementById('member-modal');
const memberCta = document.querySelector('.member-cta');

async function copyPromoCode() {
  try {
    await navigator.clipboard.writeText('MEMBER40');
    const button = document.querySelector('.copy-code-btn');
    if (button) {
      button.textContent = 'Copied!';
      setTimeout(() => (button.textContent = 'Copy code'), 1200);
    }
  } catch (error) {
    console.warn('Clipboard unavailable:', error);
  }
}

memberCta?.addEventListener('click', () => {
  memberModal?.classList.remove('hidden');
  memberModal?.setAttribute('aria-hidden', 'false');
});

document.querySelector('.copy-code-btn')?.addEventListener('click', copyPromoCode);
document.querySelectorAll('[data-close-member]').forEach((button) => {
  button.addEventListener('click', () => {
    memberModal?.classList.add('hidden');
    memberModal?.setAttribute('aria-hidden', 'true');
  });
});

const wishlistButtons = document.querySelectorAll('.wishlist');
wishlistButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const stored = getWishlist();
    const productId = button.dataset.product;
    const updated = stored.includes(productId)
      ? stored.filter((id) => id !== productId)
      : [...stored, productId];

    saveWishlist(updated);
    updateWishlistCount();
  });
});

const chatToggle = document.querySelector('.chat-toggle');
const chatMenu = document.querySelector('.chat-menu');

chatToggle?.addEventListener('click', () => {
  const isOpen = chatMenu?.classList.toggle('open');
  chatToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

window.addEventListener('click', (event) => {
  if (searchModal && !searchModal.classList.contains('hidden')) {
    const panel = searchModal.querySelector('.search-panel');
    if (event.target === searchModal || event.target.hasAttribute('data-close-search')) {
      closeSearchModal();
    }
    if (panel && !panel.contains(event.target) && event.target !== searchModal) {
      // keep modal open when interacting within panel
    }
  }

  if (quickViewModal && !quickViewModal.classList.contains('hidden')) {
    const panel = quickViewModal.querySelector('.modal-panel');
    if (event.target === quickViewModal || event.target.hasAttribute('data-close-quick-view')) {
      closeQuickView();
    }
  }

  if (memberModal && !memberModal.classList.contains('hidden')) {
    if (event.target === memberModal || event.target.hasAttribute('data-close-member')) {
      memberModal.classList.add('hidden');
      memberModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (chatMenu && !chatMenu.contains(event.target) && !chatToggle?.contains(event.target)) {
    chatMenu.classList.remove('open');
    chatToggle?.setAttribute('aria-expanded', 'false');
  }
});

if (searchInput) {
  filterProducts('');
}
updateWishlistCount();
