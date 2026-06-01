/* -------------------------------------------------------------
   Lógica da Aplicação - Doçuras Geladas (Chup Chup Gourmet)
   Vanilla JS limpo, eficiente e bem comentado.
------------------------------------------------------------- */

// Estado da Aplicação (Carrinho em memória)
let cart = [];

// Elementos do DOM
const storeLogoInitial = document.getElementById("store-logo-initial");
const storeNameTitle = document.getElementById("store-name-title");
const storeWelcomeMsg = document.getElementById("store-welcome-msg");
const categoriesList = document.getElementById("categories-list");
const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("search-input");

// Elementos do Carrinho
const openCartBtn = document.getElementById("open-cart-btn");
const cartFloatBtn = document.getElementById("cart-float-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartBadgeCount = document.getElementById("cart-badge-count");
const cartFloatBadgeCount = document.getElementById("cart-float-badge-count");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartDeliveryFeeEl = document.getElementById("cart-delivery-fee");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

// Elementos do Modal de Checkout
const checkoutModal = document.getElementById("checkout-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalBackdrop = document.getElementById("modal-backdrop");
const checkoutForm = document.getElementById("checkout-form");
const paymentMethodSelect = document.getElementById("payment-method");
const trocoWrapper = document.getElementById("troco-wrapper");
const trocoValueInput = document.getElementById("troco-value");

// Elementos do Rodapé
const footerStoreName = document.getElementById("footer-store-name");
const copyrightStoreName = document.getElementById("copyright-store-name");
const footerInstagram = document.getElementById("footer-instagram");
const footerWhatsappDirect = document.getElementById("footer-whatsapp-direct");
const footerAddress = document.getElementById("footer-address");
const currentYearEl = document.getElementById("current-year");

// Filtro de Categoria e Termo de Busca atuais
let activeCategory = "all";
let searchTerm = "";

/* -------------------------------------------------------------
   Inicialização e Carregamento de Dados da Loja
------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Validar se os dados globais estão disponíveis
    if (!window.STORE_CONFIG || !window.PRODUCTS || !window.CATEGORIES) {
        console.error("Erro: Dados de configuração ou produtos não encontrados!");
        return;
    }

    // 2. Preencher dados da Loja no HTML
    setupStoreInfo();

    // 3. Renderizar Categorias e Produtos
    renderCategoryButtons();
    renderProducts();

    // 4. Carregar carrinho salvo no localStorage
    loadCartFromStorage();

    // 5. Configurar Event Listeners
    setupEventListeners();
});

// Preenche dados da loja conforme o arquivo products.js
function setupStoreInfo() {
    const config = window.STORE_CONFIG;

    // Cabeçalho e Títulos
    if (storeNameTitle) storeNameTitle.textContent = config.name.split("|")[0].trim();
    if (storeWelcomeMsg) storeWelcomeMsg.innerHTML = `${config.name.split("|")[0].trim()} <span style="color: var(--primary);">🍦</span>`;
    if (storeLogoInitial) storeLogoInitial.textContent = config.name.charAt(0).toUpperCase();

    // Rodapé
    footerStoreName.textContent = config.name.split("|")[0].trim();
    copyrightStoreName.textContent = config.name.split("|")[0].trim();
    footerAddress.textContent = config.address;
    currentYearEl.textContent = new Date().getFullYear();

    // Links de Redes Sociais
    if (config.instagram) {
        footerInstagram.href = `https://instagram.com/${config.instagram.replace("@", "")}`;
        footerInstagram.style.display = "flex";
    } else {
        footerInstagram.style.display = "none";
    }

    footerWhatsappDirect.href = `https://wa.me/${config.whatsapp}`;

    // Preencher Métodos de Pagamento no Modal de Checkout
    paymentMethodSelect.innerHTML = '<option value="" disabled selected>Selecione uma opção...</option>';
    config.paymentMethods.forEach(method => {
        const option = document.createElement("option");
        option.value = method;
        option.textContent = method;
        paymentMethodSelect.appendChild(option);
    });

    // Exibir taxa de entrega no carrinho
    cartDeliveryFeeEl.textContent = formatCurrency(config.deliveryFee);
}

/* -------------------------------------------------------------
   Renderização do Catálogo (Categorias e Produtos)
------------------------------------------------------------- */

// Cria os botões de categoria horizontalmente
function renderCategoryButtons() {
    categoriesList.innerHTML = "";
    
    window.CATEGORIES.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `category-btn ${cat.id === activeCategory ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.setAttribute("data-id", cat.id);
        
        btn.addEventListener("click", () => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = cat.id;
            renderProducts();
        });

        categoriesList.appendChild(btn);
    });
}

// Filtra e renderiza os produtos no grid principal
function renderProducts() {
    productsGrid.innerHTML = "";

    const filteredProducts = window.PRODUCTS.filter(product => {
        const matchesCategory = activeCategory === "all" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Estado Sem Resultados
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-results">
                <i class="fa-solid fa-cookie-bite"></i>
                <p>Nenhuma doçura encontrada com esses termos.</p>
            </div>
        `;
        return;
    }

    // Renderizar Cards
    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        const badgeHTML = product.badge 
            ? `<span class="product-badge">${product.badge}</span>` 
            : '';

        card.innerHTML = `
            <div class="product-image-container">
                ${badgeHTML}
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" aria-label="Adicionar ${product.name} ao carrinho">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

function getCategoryName(catId) {
    const cat = window.CATEGORIES.find(c => c.id === catId);
    return cat ? cat.name : catId;
}

/* -------------------------------------------------------------
   Gerenciamento do Carrinho de Compras (Lógica e Estado)
------------------------------------------------------------- */

function addToCart(productId) {
    const product = window.PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.product.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            product: product,
            quantity: 1
        });
    }

    animateCartIcon();
    updateCart();
    saveCartToStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    updateCart();
    saveCartToStorage();
}

function changeQuantity(productId, amount) {
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) return;

    cartItem.quantity += amount;

    if (cartItem.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCartToStorage();
    }
}

function updateCart() {
    let subtotal = 0;
    let totalItemsCount = 0;

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <i class="fa-solid fa-ice-cream"></i>
                <p>Seu carrinho está vazio.</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem;">Escolha sabores deliciosos na vitrine!</p>
            </div>
        `;
        
        checkoutBtn.disabled = true;
        cartBadgeCount.style.display = "none";
        cartFloatBtn.style.display = "none";
    } else {
        cart.forEach(item => {
            subtotal += item.product.price * item.quantity;
            totalItemsCount += item.quantity;

            const itemEl = document.createElement("div");
            itemEl.className = "cart-item";
            itemEl.innerHTML = `
                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.product.name}</h4>
                    <span class="cart-item-price">${formatCurrency(item.product.price)}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controller">
                        <button class="qty-btn" onclick="changeQuantity(${item.product.id}, -1)">-</button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.product.id}, 1)">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.product.id})" aria-label="Remover item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        checkoutBtn.disabled = false;
        
        // Atualizar Badges
        cartBadgeCount.textContent = totalItemsCount;
        cartBadgeCount.style.display = "flex";
        
        cartFloatBadgeCount.textContent = totalItemsCount;
        
        if (window.innerWidth <= 768) {
            cartFloatBtn.style.display = "flex";
        } else {
            cartFloatBtn.style.display = "none";
        }
    }

    const deliveryFee = window.STORE_CONFIG.deliveryFee;
    const total = subtotal > 0 ? (subtotal + deliveryFee) : 0;

    cartSubtotalEl.textContent = formatCurrency(subtotal);
    cartTotalEl.textContent = formatCurrency(total);
}

function saveCartToStorage() {
    localStorage.setItem("digital_cart_geladas", JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem("digital_cart_geladas");
    if (saved) {
        try {
            cart = JSON.parse(saved);
            updateCart();
        } catch (e) {
            console.error("Erro ao carregar do localStorage:", e);
            cart = [];
        }
    }
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCart();
}

/* -------------------------------------------------------------
   Controle de Modais, Gavetas e Inputs
------------------------------------------------------------- */
function setupEventListeners() {
    openCartBtn.addEventListener("click", openCartSidebar);
    cartFloatBtn.addEventListener("click", openCartSidebar);
    closeCartBtn.addEventListener("click", closeCartSidebar);
    cartOverlay.addEventListener("click", closeCartSidebar);

    checkoutBtn.addEventListener("click", () => {
        closeCartSidebar();
        openModal();
    });

    closeModalBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);

    searchInput.addEventListener("input", (e) => {
        searchTerm = e.target.value;
        renderProducts();
    });

    paymentMethodSelect.addEventListener("change", (e) => {
        const val = e.target.value.toLowerCase();
        if (val.includes("dinheiro")) {
            trocoWrapper.style.display = "flex";
            trocoValueInput.required = true;
        } else {
            trocoWrapper.style.display = "none";
            trocoValueInput.required = false;
            trocoValueInput.value = "";
        }
    });

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sendOrderToWhatsapp();
    });

    window.addEventListener("resize", () => {
        if (cart.length > 0 && window.innerWidth <= 768) {
            cartFloatBtn.style.display = "flex";
        } else {
            cartFloatBtn.style.display = "none";
        }
    });
}

function openCartSidebar() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
    cartFloatBtn.style.display = "none";
}

function closeCartSidebar() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
    if (cart.length > 0 && window.innerWidth <= 768) {
        cartFloatBtn.style.display = "flex";
    }
}

function openModal() {
    checkoutModal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    checkoutModal.classList.remove("open");
    document.body.style.overflow = "auto";
}

function animateCartIcon() {
    openCartBtn.style.transform = "scale(1.2)";
    setTimeout(() => {
        openCartBtn.style.transform = "scale(1)";
    }, 200);
}

/* -------------------------------------------------------------
   Processamento do Pedido e Envio via WhatsApp (Temático Candy)
------------------------------------------------------------- */
function sendOrderToWhatsapp() {
    const name = document.getElementById("client-name").value.trim();
    const phone = document.getElementById("client-phone").value.trim();
    const address = document.getElementById("client-address").value.trim();
    const reference = document.getElementById("client-reference").value.trim();
    const payment = paymentMethodSelect.value;
    const troco = trocoValueInput.value.trim();

    const config = window.STORE_CONFIG;
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.product.price * item.quantity;
    });
    const deliveryFee = config.deliveryFee;
    const total = subtotal + deliveryFee;

    // Mensagem com temática Doce e Gelada 🍦
    let message = `*🍦 NOVO PEDIDO - DOÇURAS GELADAS* 🍦\n`;
    message += `-------------------------------------------\n\n`;
    
    message += `👤 *Cliente:* ${name}\n`;
    message += `📞 *WhatsApp:* ${phone}\n`;
    message += `📍 *Endereço:* ${address}\n`;
    if (reference) {
        message += `🏠 *Ponto de Ref:* ${reference}\n`;
    }
    
    message += `💳 *Pagamento:* ${payment}\n`;
    if (troco) {
        message += `💵 *Troco para:* ${formatCurrency(parseFloat(troco.replace(",", "."))) || troco}\n`;
    }
    message += `\n-------------------------------------------\n`;
    message += `🛒 *Doçuras Escolhidas:*\n`;

    cart.forEach(item => {
        const itemTotal = item.product.price * item.quantity;
        message += `• *${item.quantity}x* ${item.product.name} (${formatCurrency(item.product.price)} un) - _${formatCurrency(itemTotal)}_\n`;
    });

    message += `\n-------------------------------------------\n`;
    message += `🔹 *Subtotal:* ${formatCurrency(subtotal)}\n`;
    message += `🛵 *Taxa de Entrega:* ${formatCurrency(deliveryFee)}\n`;
    message += `💰 *Total do Pedido:* *${formatCurrency(total)}*\n\n`;
    message += `-------------------------------------------\n`;
    message += `✨ _Pedido gerado via Catálogo Digital. Obrigado!_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.whatsapp}&text=${encodedMessage}`;

    clearCart();
    closeModal();
    checkoutForm.reset();
    trocoWrapper.style.display = "none";

    window.open(whatsappUrl, "_blank");
}

/* -------------------------------------------------------------
   Funções Utilitárias Gerais
------------------------------------------------------------- */
function formatCurrency(value) {
    const symbol = window.STORE_CONFIG ? window.STORE_CONFIG.currency : "R$";
    return `${symbol} ${value.toFixed(2).replace(".", ",")}`;
}

// Atalho global
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.openCartSidebar = openCartSidebar;
window.closeCartSidebar = closeCartSidebar;
