const products = document.querySelectorAll('.product');
const grid = document.querySelector('.products-grid');
const header = document.querySelector('header');
const menuItems = document.querySelectorAll('.menu-row p');

let activeFilter = null;

menuItems.forEach(item => {
  item.addEventListener('click', function() {
    const filter = this.dataset.filter;

    const firstPositions = {};
    products.forEach(p => {
      firstPositions[p] = p.getBoundingClientRect();
    });

    if (activeFilter === filter) {
      activeFilter = null;
      menuItems.forEach(m => m.classList.remove('active'));
      products.forEach(p => p.style.display = '');
    } else {
      activeFilter = filter;
      menuItems.forEach(m => m.classList.remove('active'));
      this.classList.add('active');

      products.forEach(p => {
        const categories = p.dataset.category.split(' ');
        p.style.display = categories.includes(filter) ? '' : 'none';
      });
    }

    products.forEach(p => {
      if (p.style.display === 'none') return;

      const last = p.getBoundingClientRect();
      const first = firstPositions[p];

      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;

      if (deltaX === 0 && deltaY === 0) return;

      p.style.transition = 'none';
      p.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          p.style.transition = 'transform 0.4s ease';
          p.style.transform = '';
        });
      });
    });
  });
});

products.forEach((product) => {
  product.addEventListener('click', function() {
    const visibleProducts = Array.from(products).filter(p => p.style.display !== 'none');
    const visibleIndex = visibleProducts.indexOf(this);
    openProduct(visibleProducts, visibleIndex);
  });
});

function openProduct(visibleProducts, startIndex) {
  header.style.opacity = '0';
  header.style.pointerEvents = 'none';
  grid.style.opacity = '0';

  setTimeout(() => {
    grid.style.display = 'none';
    header.style.display = 'none';
    showProductView(visibleProducts, startIndex);
  }, 400);
}

function showProductView(visibleProducts, startIndex) {
  const view = document.createElement('div');
  view.className = 'product-view';

  const reordered = [...visibleProducts.slice(startIndex), ...visibleProducts.slice(0, startIndex)];

  reordered.forEach(p => {
    const img = p.querySelector('img').src;
    const name = p.querySelector('.product-name').textContent;
    const description = p.dataset.description;

    const slide = document.createElement('div');
    slide.className = 'product-slide';
    slide.innerHTML = `
      <img src="${img}" alt="${name}">
      <div class="product-info">
        <p class="slide-name">${name}</p>
        <p class="slide-description">${description}</p>
      </div>
    `;
    view.appendChild(slide);
  });

  const back = document.createElement('button');
  back.className = 'back-btn';
  back.textContent = '←';
  back.addEventListener('click', closeProductView);

  const scrollHint = document.createElement('div');
  scrollHint.className = 'scroll-hint';
  scrollHint.textContent = '↓';

  document.body.appendChild(view);
  document.body.appendChild(back);
  document.body.appendChild(scrollHint);

  view.addEventListener('scroll', () => {
    scrollHint.style.opacity = '0';
  }, { once: true });

  requestAnimationFrame(() => {
    view.style.opacity = '1';
    back.style.opacity = '1';
  });
}

function closeProductView() {
  const view = document.querySelector('.product-view');
  const back = document.querySelector('.back-btn');
  const scrollHint = document.querySelector('.scroll-hint');

  view.style.opacity = '0';
  back.style.opacity = '0';
  if (scrollHint) scrollHint.style.opacity = '0';

  setTimeout(() => {
    view.remove();
    back.remove();
    if (scrollHint) scrollHint.remove();

    grid.style.display = 'grid';
    header.style.display = 'flex';

    requestAnimationFrame(() => {
      grid.style.opacity = '1';
      header.style.opacity = '1';
      header.style.pointerEvents = 'auto';
    });
  }, 400);
}
