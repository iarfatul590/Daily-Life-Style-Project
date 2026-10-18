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
  if (!slides.length) return;
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  if (!slides.length) return;
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

const storage = {
  wishlist: 'daily-lifestyle-wishlist',
  cart: 'daily-lifestyle-cart'
};

function readStoredArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    return [];
  }
}

function writeStoredArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const searchModal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const productCards = Array.from(document.querySelectorAll('.product-card'));
const quickViewModal = document.getElementById('quick-view-modal');
const quickViewContent = document.getElementById('quick-view-content');
const memberModal = document.getElementById('member-modal');
const cartCount = document.querySelector('.cart-count');

function getWishlist() {
  return readStoredArray(storage.wishlist);
}

function saveWishlist(items) {
  writeStoredArray(storage.wishlist, items);
}

function getCart() {
  return readStoredArray(storage.cart);
}

function saveCart(items) {
  writeStoredArray(storage.cart, items);
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const wishlistBadge = document.querySelector('.wishlist-count');
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }

  document.querySelectorAll('.wishlist').forEach((button) => {
    const productId = String(button.dataset.product || '');
    const active = wishlist.includes(productId);
    button.classList.toggle('active', active);
    button.textContent = active ? '♥' : '♡';
  });
}

function updateCartCount() {
  const cart = getCart();
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
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
  const visibleCards = [];

  productCards.forEach((card) => {
    const name = (card.dataset.name || '').toLowerCase();
    const category = (card.dataset.category || '').toLowerCase();
    const match = !query || name.includes(query) || category.includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visibleCards.push(card);
  });

  if (!searchResults) return;

  if (!query) {
    searchResults.innerHTML = '<p>Type to search products or categories.</p>';
    return;
  }

  if (!visibleCards.length) {
    searchResults.innerHTML = '<p>No matching products found.</p>';
    return;
  }

  searchResults.innerHTML = visibleCards
    .slice(0, 5)
    .map((card) => {
      const name = card.dataset.name || 'Product';
      const category = card.dataset.category || 'Collection';
      return `<div class="search-item"><strong>${name}</strong><span>${category}</span></div>`;
    })
    .join('');
}

function getProductById(productId) {
  return document.querySelector(`.product-card[data-id="${productId}"]`);
}

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product || !quickViewModal || !quickViewContent) return;

  const imageEl = product.querySelector('.product-image');
  const image = imageEl ? imageEl.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/)?.[2] || '' : '';
  const name = product.dataset.name || 'Product';
  const category = product.dataset.category || 'Collection';
  const price = product.querySelector('.price')?.textContent || '৳0';

  quickViewContent.innerHTML = `
    <div class="quick-view-image-wrap">
      <div class="quick-view-image" style="background-image: url('${image}')"></div>
    </div>
    <div class="quick-view-info">
      <span class="tag">${category}</span>
      <h3>${name}</h3>
      <p>Premium fit, breathable fabric, and easy movement for modern everyday wear.</p>
      <div class="price-row">
        <span class="price">${price}</span>
      </div>

      <div class="product-options">
        <div>
          <label>Color</label>
          <div class="option-row">
            <button class="color-swatch active" type="button" style="background:#1a1a1a" aria-label="Black"></button>
            <button class="color-swatch" type="button" style="background:#c79a68" aria-label="Sand"></button>
            <button class="color-swatch" type="button" style="background:#8a9d67" aria-label="Olive"></button>
          </div>
        </div>
        <div>
          <label>Size</label>
          <div class="option-row size-row">
            <button class="size-option active" type="button">S</button>
            <button class="size-option" type="button">M</button>
            <button class="size-option" type="button">L</button>
            <button class="size-option" type="button">XL</button>
          </div>
        </div>
      </div>

      <button class="btn btn-primary add-cart quick-add" type="button" data-product="${productId}">Add to cart</button>
    </div>
  `;

  quickViewModal.classList.remove('hidden');
  quickViewModal.setAttribute('aria-hidden', 'false');

  quickViewModal.querySelectorAll('.color-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      quickViewModal.querySelectorAll('.color-swatch').forEach((item) => item.classList.toggle('active', item === swatch));
    });
  });

  quickViewModal.querySelectorAll('.size-option').forEach((sizeButton) => {
    sizeButton.addEventListener('click', () => {
      quickViewModal.querySelectorAll('.size-option').forEach((item) => item.classList.toggle('active', item === sizeButton));
    });
  });

  quickViewModal.querySelector('.quick-add')?.addEventListener('click', () => {
    addToCart(productId);
    closeQuickView();
  });
}

function closeQuickView() {
  if (!quickViewModal) return;
  quickViewModal.classList.add('hidden');
  quickViewModal.setAttribute('aria-hidden', 'true');
}

function addToCart(productId) {
  const cart = getCart();
  const product = getProductById(productId);

  if (!product) return;

  const name = product.dataset.name || 'Daily lifestyle item';
  const price = product.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || '0';
  const item = { id: String(productId), name, price: Number(price) };

  const existingIndex = cart.findIndex((productItem) => productItem.id === item.id);
  if (existingIndex >= 0) {
    cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function toggleWishlist(productId) {
  const stored = getWishlist();
  const next = stored.includes(String(productId))
    ? stored.filter((id) => id !== String(productId))
    : [...stored, String(productId)];

  saveWishlist(next);
  updateWishlistCount();
}

searchInput?.addEventListener('input', (event) => filterProducts(event.target.value));

document.querySelector('.search-toggle')?.addEventListener('click', openSearchModal);
document.querySelectorAll('[data-close-search]').forEach((trigger) => {
  trigger.addEventListener('click', closeSearchModal);
});

document.querySelectorAll('.quick-view-btn').forEach((button) => {
  button.addEventListener('click', () => openQuickView(button.dataset.product));
});

document.querySelectorAll('[data-close-quick-view]').forEach((button) => {
  button.addEventListener('click', closeQuickView);
});

document.querySelectorAll('.add-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.product || button.closest('.product-card')?.dataset.id;
    if (targetId) addToCart(targetId);
  });
});

document.querySelectorAll('.wishlist').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.product;
    if (productId) toggleWishlist(productId);
  });
});

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
  }

  if (quickViewModal && !quickViewModal.classList.contains('hidden')) {
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
updateCartCount();
