/**
 * GÜERO BARBACOA - Central Single Page Application (SPA) Controller
 * Implements: State Store, Router, HTML5 Storage Cross-Tab Sync, Web Audio Synth, and DOM binders.
 */

// Image placeholders — reused while Supabase storage is wired up.
const IMG = {
    barbacoa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkC-fgDS7OiFe592K-Xhxmwoz21sOWHMYDfgyDnuJSjlABs_r5YxTRHE_PfQZOZxlwttEDIjNxsB6qENVV69SUSi0uknKZ8nIf925xfQad8NiK3S25nlQAKwA1TwLSl_agcuhchMtWbB3SUFocwZUUtXtkzlXxL-BxXANxdbDlziyIV9gwwfjh2o1PhLIeGJgKco2C56LmPuO88MCQG1pkqGwbxJ5W1fl3V2rtqym-PAfk5X2zoALyXR1_gHyWV2NeIWJwAWrH_bI',
    bistec: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5yr2jlmFFAuDXqEk8DtVzbjI2Wd4pdLq9H9pbMpQwf9JsRjN6yRk4DKiucXpsRTljBtTi2K8yT2WEPJHBelXGrZhv2McpfsKQ_bXJ3ftSG8D3S-BlRp2FTw5ipYWWf0_mcnSa7kUYznyIwP5EBjjB_MmtgWhRAZivH5AWLIR_Ysscgvktiv-Qpk5hNsd42hI5igPaVTOPlAppgA4bjT0N4AEXA8heARKvzg0HLlOvJADUZZZTPzlg2OfREWntRNDZZnHwkLCVjdo',
    quesadilla: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdXYPKNoEjFDc8jAGzq1vNYL2kW29zPahzTLOf0qXNsHgZ-RotLHViMT33Pge_rerpBT5sOmgYj5GynBj1ByHyqVyeYYk26u7A4VHQ-4Ielf1A3w1xvLeW-3UiBpknUQFKJX0VkUj67Le9732tmHzNApS6O_KfwuFzLszg_X8O9nbSG20tOQvK7a6Zqzh0X76KNxd-2p_IVilRCoC-Ce0g6qBlP4JKNt6VnMji-ySbQcG__FOCk8ngC_khTCv_CpBIE2MEO7bva5E'
};

// Catalog matching the menu poster (TACOS, LONCHE, EXTRAS).
// `customizable` flag drives whether the item shows tortilla/garnituras/salsas
// — extras like 1kg, ordenes y tortillas son cantidad pura.
const MENU_CATALOG = {
    'taco-barbacoa':         { id: 'taco-barbacoa',         name: 'Taco de Barbacoa',           basePrice: 22, category: 'tacos',   customizable: true,  image: IMG.barbacoa,   description: 'Taco de barbacoa de res jugosa estilo Guadalajara, en doble tortilla de maíz con cebolla y cilantro.' },
    'taco-bistec':           { id: 'taco-bistec',           name: 'Taco de Bistec',             basePrice: 22, category: 'tacos',   customizable: true,  image: IMG.bistec,     description: 'Bistec de res asado a la plancha, picado fino, con cebolla y cilantro fresco.' },
    'taco-barbacoa-queso':   { id: 'taco-barbacoa-queso',   name: 'Taco de Barbacoa con Queso', basePrice: 28, category: 'tacos',   customizable: true,  image: IMG.barbacoa,   description: 'Barbacoa premium bañada en queso Oaxaca fundido a la plancha, en tortilla de maíz.' },
    'taco-bistec-queso':     { id: 'taco-bistec-queso',     name: 'Taco de Bistec con Queso',   basePrice: 28, category: 'tacos',   customizable: true,  image: IMG.bistec,     description: 'Bistec a la plancha con queso Oaxaca fundido sobre tortilla recién hecha.' },
    'super-taco':            { id: 'super-taco',            name: 'Super Taco',                 basePrice: 38, category: 'tacos',   customizable: true,  image: IMG.barbacoa,   description: 'El más grande de la casa: barbacoa, bistec y queso en doble tortilla de maíz.' },

    'lonche-barbacoa':       { id: 'lonche-barbacoa',       name: 'Lonche de Barbacoa',         basePrice: 60, category: 'lonches', customizable: true,  image: IMG.quesadilla, description: 'Lonche de barbacoa de res en pan telera con aguacate, cebolla y salsa de la casa.' },
    'lonche-bistec':         { id: 'lonche-bistec',         name: 'Lonche de Bistec',           basePrice: 60, category: 'lonches', customizable: true,  image: IMG.quesadilla, description: 'Bistec a la plancha con aguacate, cebolla y salsa, en pan telera crujiente.' },
    'lonche-barbacoa-queso': { id: 'lonche-barbacoa-queso', name: 'Lonche de Barbacoa con Queso', basePrice: 70, category: 'lonches', customizable: true,  image: IMG.quesadilla, description: 'Lonche de barbacoa con queso Oaxaca fundido en pan telera dorado.' },
    'lonche-bistec-queso':   { id: 'lonche-bistec-queso',   name: 'Lonche de Bistec con Queso', basePrice: 70, category: 'lonches', customizable: true,  image: IMG.quesadilla, description: 'Lonche de bistec con queso Oaxaca fundido en pan telera dorado.' },
    'super-lonche':          { id: 'super-lonche',          name: 'Super Lonche',               basePrice: 80, category: 'lonches', customizable: true,  image: IMG.quesadilla, description: 'El lonche grande: barbacoa, bistec y queso en pan telera con aguacate y salsa.' },

    'quesadilla':            { id: 'quesadilla',            name: 'Quesadilla',                 basePrice: 15, category: 'extras',  customizable: true,  image: IMG.quesadilla, description: 'Tortilla de harina con queso Oaxaca fundido a la plancha.' },
    'medio-kg':              { id: 'medio-kg',              name: '1/2 Kg de Barbacoa',         basePrice: 140, category: 'extras', customizable: false, image: IMG.barbacoa,   description: 'Medio kilo de barbacoa de res para llevar. Incluye consomé y tortillas aparte.' },
    'kg':                    { id: 'kg',                    name: '1 Kg de Barbacoa',           basePrice: 280, category: 'extras', customizable: false, image: IMG.barbacoa,   description: 'Un kilo de barbacoa de res para llevar. Incluye consomé y tortillas aparte.' },
    'orden-personal':        { id: 'orden-personal',        name: 'Orden Personal',             basePrice: 90, category: 'extras',  customizable: false, image: IMG.barbacoa,   description: 'Orden personal de barbacoa con consomé, cebolla, cilantro y tortillas.' },
    'medio-kg-tortilla':     { id: 'medio-kg-tortilla',     name: '1/2 Kg de Tortilla',         basePrice: 15, category: 'extras',  customizable: false, image: IMG.quesadilla, description: 'Medio kilo de tortillas de maíz hechas al momento.' },
    'kg-tortilla':           { id: 'kg-tortilla',           name: '1 Kg de Tortilla',           basePrice: 25, category: 'extras',  customizable: false, image: IMG.quesadilla, description: 'Un kilo de tortillas de maíz hechas al momento.' }
};

// Global state store
const Store = {
    currentView: 'selector',

    cart: [],
    customizingItem: null,
    activeOrder: null,

    orders: [],
    menu: MENU_CATALOG
};

/**
 * 1. SYNTHETIC AUDIO CHIME ENGINE (Web Audio API)
 * Synthesizes retro-modern, clear gourmet sound indicators.
 * Avoids any missing external asset issues.
 */
const AudioSynth = {
    ctx: null,

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    },

    playNewOrder() {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // High frequency bell chime (C6 -> G6)
        const now = this.ctx.currentTime;
        
        // Note 1: C6 (1046.50 Hz)
        this.playTone(1046.50, now, 0.4, 0.05);
        // Note 2: E6 (1318.51 Hz) slightly staggered
        this.playTone(1318.51, now + 0.12, 0.5, 0.08);
    },

    playOrderReady() {
        this.init();
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Success major arpeggio chime (G5 -> C6 -> E6 -> G6)
        const now = this.ctx.currentTime;
        this.playTone(783.99, now, 0.3, 0.04);       // G5
        this.playTone(1046.50, now + 0.08, 0.3, 0.04); // C6
        this.playTone(1318.51, now + 0.16, 0.3, 0.04); // E6
        this.playTone(1567.98, now + 0.24, 0.5, 0.08); // G6
    },

    playTone(frequency, startTime, duration, envelopeRise) {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // Sine wave for clean purity
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);

        // Apply clean envelope: sharp attack, smooth linear decay
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.25, startTime + envelopeRise);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }
};

/**
 * 2. ROUTING LOGIC
 * Manages view visibility updates with smooth CSS transitions.
 */
const Router = {
    navigateTo(viewId, params = {}) {
        const panels = document.querySelectorAll('.view-panel, .view-panel-flex');
        const targetId = `view-${viewId}`;
        let found = false;

        panels.forEach(panel => {
            if (panel.id === targetId) {
                panel.classList.add('active');
                found = true;
            } else {
                panel.classList.remove('active');
            }
        });

        if (found) {
            Store.currentView = viewId;
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Reflect navigation in the URL so back/forward + reload restore the view.
            // 'personalizar' carries transient state (itemId), so we don't persist it in the URL.
            const persistInUrl = viewId !== 'personalizar';
            if (persistInUrl) {
                const newHash = viewId === 'selector' ? '' : `#${viewId}`;
                if (window.location.hash !== newHash) {
                    history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
                }
            }

            this.onViewLoad(viewId, params);
        }
    },

    onViewLoad(viewId, params) {
        // Active role navbar updates
        document.querySelectorAll('.bottom-nav-client, .drawer-nav-item').forEach(item => {
            const dest = item.getAttribute('data-view');
            if (dest === viewId) {
                item.classList.add('active-nav-item');
                // For bottom nav
                item.classList.remove('text-on-surface-variant');
                item.classList.add('bg-secondary-container', 'text-on-secondary-container');
            } else {
                item.classList.remove('active-nav-item');
                // Reset bottom nav
                if (item.classList.contains('bottom-nav-client')) {
                    item.classList.remove('bg-secondary-container', 'text-on-secondary-container');
                    item.classList.add('text-on-surface-variant');
                }
            }
        });

        if (viewId === 'inicio') {
            // Render recommended cards
            Renderers.inicio();
        } else if (viewId === 'menu') {
            // Render complete list
            Renderers.menu();
        } else if (viewId === 'personalizar') {
            const dish = params.itemId ? Store.menu[params.itemId] : null;
            if (!dish) {
                ToastEngine.show('Producto no disponible.');
                Router.navigateTo('menu');
                return;
            }
            Store.customizingItem = {
                dish,
                tortilla: 'Maíz',
                garnituras: ['Cebolla', 'Cilantro'],
                salsa: 'Verde',
                quantity: 1
            };
            Renderers.personalizar();
        } else if (viewId === 'estado') {
            Renderers.estado();
        } else if (viewId === 'cocina') {
            Renderers.cocina();
        } else if (viewId === 'estadisticas') {
            Renderers.estadisticas();
        }
    }
};

/**
 * 3. DATA LAYER (storage abstraction)
 *
 * The renderers/controllers only talk to `DataLayer`. Today it's backed by
 * a localStorage adapter; swap `DataLayer.adapter` for a Supabase one
 * (see config.js) and the rest of the app keeps working unchanged.
 *
 * Adapter contract:
 *   init()                            -> Promise<void>
 *   listOrders()                      -> Order[]                (sync read of cached state)
 *   submitOrder(order)                -> Promise<Order>
 *   updateOrderStatus(id, status)     -> Promise<void>
 *   subscribe(onChange)               -> unsubscribe fn         (fires on remote/cross-tab changes)
 */

const ORDER_STATUSES = ['Recibido', 'Preparando', 'Listo', 'Entregado'];
const COMPLETED_STATUSES = ['Listo', 'Entregado'];
const ACTIVE_ORDER_KEY = 'guerobarbacoa_active_order_v1';

function makeOrderId() {
    // Time-prefixed + random suffix → low collision risk, sortable.
    const ts = Date.now().toString(36).toUpperCase().slice(-5);
    const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
    return `${ts}-${rand}`;
}

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const LocalStorageAdapter = {
    ORDERS_KEY: 'guerobarbacoa_orders_v1',
    SEED_KEY: 'guerobarbacoa_seeded_v1',
    _listeners: new Set(),

    async init() {
        this._load();
        const seeded = localStorage.getItem(this.SEED_KEY);
        if (!seeded && Store.orders.length === 0) {
            this._seed();
            localStorage.setItem(this.SEED_KEY, '1');
        }
        // Cross-tab sync via the native storage event.
        window.addEventListener('storage', (e) => {
            if (e.key === this.ORDERS_KEY && e.newValue) {
                try {
                    const next = JSON.parse(e.newValue);
                    this._notify(next);
                } catch (err) {
                    console.error('DataLayer: failed to parse remote orders', err);
                }
            }
        });
    },

    listOrders() {
        return Store.orders;
    },

    async submitOrder(order) {
        Store.orders.push(order);
        this._persist();
        this._notify(Store.orders, { kind: 'created', order });
        return order;
    },

    async updateOrderStatus(orderId, nextStatus) {
        if (!ORDER_STATUSES.includes(nextStatus)) {
            throw new Error(`Estado inválido: ${nextStatus}`);
        }
        const order = Store.orders.find(o => o.id === orderId);
        if (!order) return;
        order.status = nextStatus;
        this._persist();
        this._notify(Store.orders, { kind: 'updated', order });
    },

    subscribe(callback) {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    },

    _load() {
        try {
            const raw = localStorage.getItem(this.ORDERS_KEY);
            Store.orders = raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('DataLayer: failed to read localStorage', e);
            Store.orders = [];
        }
    },

    _persist() {
        try {
            localStorage.setItem(this.ORDERS_KEY, JSON.stringify(Store.orders));
        } catch (e) {
            console.error('DataLayer: failed to write localStorage', e);
        }
    },

    _notify(nextOrders, meta) {
        // Replace in-memory orders only when called from a remote source.
        if (nextOrders !== Store.orders) {
            Store.orders = nextOrders;
        }
        this._listeners.forEach(fn => {
            try { fn(Store.orders, meta); } catch (e) { console.error(e); }
        });
    },

    _seed() {
        const now = Date.now();
        Store.orders = [
            {
                id: 'A042',
                customerName: 'María Rodríguez',
                type: 'Comedor',
                timestamp: now - 14 * 60 * 1000,
                status: 'Preparando',
                items: [
                    { name: 'Super Lonche', quantity: 2, options: 'Sin cebolla', totalPrice: 160 },
                    { name: 'Taco de Bistec', quantity: 1, options: 'Maíz', totalPrice: 22 },
                    { name: '1/2 Kg de Tortilla', quantity: 2, options: '', totalPrice: 30 }
                ],
                total: 212.00,
                urgent: true
            },
            {
                id: 'A043',
                customerName: 'Carlos Mendoza',
                type: 'Para Llevar',
                timestamp: now - 8 * 60 * 1000,
                status: 'Recibido',
                items: [
                    { name: 'Taco de Barbacoa', quantity: 3, options: 'Con todo', totalPrice: 66 },
                    { name: 'Quesadilla', quantity: 1, options: '', totalPrice: 15 }
                ],
                total: 81.00,
                urgent: false
            },
            {
                id: 'A044',
                customerName: 'Reparto (UberEats)',
                type: 'Delivery',
                timestamp: now - 1 * 60 * 1000,
                status: 'Recibido',
                items: [
                    { name: 'Super Taco', quantity: 1, options: 'Salsa Verde', totalPrice: 38 },
                    { name: 'Taco de Barbacoa con Queso', quantity: 2, options: '', totalPrice: 56 }
                ],
                total: 94.00,
                urgent: false
            },
            {
                id: 'H101', customerName: 'Ana Gómez', type: 'Comedor',
                timestamp: now - 28 * 60 * 1000, status: 'Entregado',
                items: [{ name: 'Taco de Barbacoa con Queso', quantity: 2, options: '', totalPrice: 56 }],
                total: 56.00
            },
            {
                id: 'H102', customerName: 'Luis Pérez', type: 'Para Llevar',
                timestamp: now - 45 * 60 * 1000, status: 'Entregado',
                items: [{ name: 'Super Lonche', quantity: 1, options: '', totalPrice: 80 }],
                total: 80.00
            },
            {
                id: 'H103', customerName: 'Sofía Díaz', type: 'Delivery',
                timestamp: now - 62 * 60 * 1000, status: 'Entregado',
                items: [{ name: 'Orden Personal', quantity: 1, options: '', totalPrice: 90 }],
                total: 90.00
            }
        ];
        this._persist();
    }
};

const DataLayer = {
    // Allow config.js (or a future supabase adapter) to override this before init.
    adapter: (window.DataLayerAdapter || LocalStorageAdapter),

    async init() {
        return this.adapter.init();
    },
    listOrders() {
        return this.adapter.listOrders();
    },
    submitOrder(order) {
        return this.adapter.submitOrder(order);
    },
    updateOrderStatus(orderId, nextStatus) {
        return this.adapter.updateOrderStatus(orderId, nextStatus);
    },
    subscribe(callback) {
        return this.adapter.subscribe(callback);
    }
};

/**
 * 4. DOM RENDER ENGINE
 * Beautifully dynamic rendering structures for all views, injecting layout details.
 */
const Renderers = {
    inicio() {
        const container = document.getElementById('inicio-recommended');
        if (!container) return;

        const items = ['super-taco', 'super-lonche', 'orden-personal'];
        container.innerHTML = '';

        items.forEach(id => {
            const item = Store.menu[id];
            if (!item) return;
            const html = `
                <div class="flex-shrink-0 w-72 bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 group shadow-sm cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" data-item-id="${escapeHtml(item.id)}">
                    <div class="h-40 relative overflow-hidden">
                        <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
                        <div class="absolute top-3 right-3 bg-primary text-on-primary font-headline-md text-sm px-2.5 py-1 rounded-lg font-bold">$${item.basePrice.toFixed(2)}</div>
                    </div>
                    <div class="p-4">
                        <h4 class="font-headline-md text-headline-md text-on-surface line-clamp-1">${escapeHtml(item.name)}</h4>
                        <p class="font-body-md text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">${escapeHtml(item.description)}</p>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        container.querySelectorAll('[data-item-id]').forEach(el => {
            el.addEventListener('click', () => {
                Router.navigateTo('personalizar', { itemId: el.getAttribute('data-item-id') });
            });
        });
    },

    menu() {
        const container = document.getElementById('menu-items-grid');
        if (!container) return;

        container.innerHTML = '';

        Object.values(Store.menu).forEach(item => {
            const html = `
                <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm group hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1" data-category="${escapeHtml(item.category)}" data-item-id="${escapeHtml(item.id)}">
                    <div class="h-44 relative overflow-hidden bg-surface-variant">
                        <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">
                        <span class="absolute top-3 right-3 bg-primary text-on-primary font-headline-md text-sm px-2.5 py-1 rounded-lg font-bold shadow-md">$${item.basePrice.toFixed(2)}</span>
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 class="font-headline-md text-headline-md text-on-surface line-clamp-1">${escapeHtml(item.name)}</h3>
                            <p class="font-body-md text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">${escapeHtml(item.description)}</p>
                        </div>
                        <div class="mt-4 flex justify-between items-center pt-2 border-t border-outline-variant/10">
                            <span class="text-xs bg-surface-container-high px-2 py-1 rounded text-on-surface-variant font-bold uppercase tracking-wider">${escapeHtml(item.category)}</span>
                            <div class="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300">
                                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">add</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        container.querySelectorAll('[data-item-id]').forEach(el => {
            el.addEventListener('click', () => {
                Router.navigateTo('personalizar', { itemId: el.getAttribute('data-item-id') });
            });
        });

        this.filterMenu();
    },

    filterMenu() {
        const activeChip = document.querySelector('.category-chip.category-chip-active');
        if (!activeChip) return;
        const category = activeChip.getAttribute('data-cat');

        document.querySelectorAll('#menu-items-grid > div').forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'todos' || cardCat === category) {
                card.style.setProperty('display', 'flex', 'important');
            } else {
                card.style.setProperty('display', 'none', 'important');
            }
        });
    },

    personalizar() {
        const item = Store.customizingItem;
        if (!item) return;

        document.getElementById('p-image').src = item.dish.image;
        document.getElementById('p-image').alt = item.dish.name;
        document.getElementById('p-title').innerText = item.dish.name;
        document.getElementById('p-description').innerText = item.dish.description;

        // Hide tortilla/garnish/salsa sections for non-customizable extras (1kg, tortillas, etc.).
        const customizable = item.dish.customizable !== false;
        ['p-section-tortilla', 'p-section-garnituras', 'p-section-salsas'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = customizable ? '' : 'none';
        });

        this.updateCustomizationUI();
    },

    updateCustomizationUI() {
        const item = Store.customizingItem;
        if (!item) return;

        const customizable = item.dish.customizable !== false;

        let extraCost = 0;
        if (customizable && item.garnituras.includes('Piña Extra (+$5)')) extraCost += 5.00;

        const unitPrice = item.dish.basePrice + extraCost;
        const totalPrice = unitPrice * item.quantity;

        document.getElementById('p-base-price').innerText = `$${item.dish.basePrice.toFixed(2)}`;
        document.getElementById('p-qty-display').innerText = item.quantity;
        document.getElementById('p-footer-total').innerText = `$${totalPrice.toFixed(2)}`;

        if (!customizable) return;

        const btnMaiz = document.getElementById('p-tortilla-maiz');
        const btnHarina = document.getElementById('p-tortilla-harina');

        const setTortillaButton = (btn, active) => {
            btn.className = active
                ? "flex-1 bg-secondary-container text-on-secondary-container border border-secondary-container rounded-lg py-3 px-4 font-label-lg text-center transition-all shadow-sm flex flex-col items-center gap-1 cursor-pointer"
                : "flex-1 bg-surface border border-outline-variant text-on-surface-variant rounded-lg py-3 px-4 text-center transition-all hover:bg-surface-variant/50 flex flex-col items-center gap-1 cursor-pointer";
            const icon = btn.querySelector('span');
            icon.innerText = active ? 'radio_button_checked' : 'radio_button_unchecked';
            icon.style.fontVariationSettings = active ? "'FILL' 1" : "'FILL' 0";
        };
        setTortillaButton(btnMaiz, item.tortilla === 'Maíz');
        setTortillaButton(btnHarina, item.tortilla === 'Harina');

        const garnituras = ['Cebolla', 'Cilantro', 'Piña Extra (+$5)'];
        const garnContainer = document.getElementById('p-garnituras-chips');
        garnContainer.innerHTML = '';

        garnituras.forEach(g => {
            const active = item.garnituras.includes(g);
            const btnClass = active
                ? "category-chip-active bg-secondary-container text-on-secondary-container border border-secondary-container rounded-full py-2 px-5 flex items-center gap-2 transition-all cursor-pointer"
                : "bg-surface border border-outline-variant text-on-surface-variant rounded-full py-2 px-5 flex items-center gap-2 transition-all hover:bg-surface-variant/50 cursor-pointer";
            const icon = active ? 'check' : 'add';
            const btn = document.createElement('button');
            btn.className = btnClass;
            btn.innerHTML = `
                <span class="material-symbols-outlined text-[18px]">${icon}</span>
                <span class="font-label-sm text-label-sm uppercase">${escapeHtml(g)}</span>
            `;
            btn.addEventListener('click', () => Controllers.toggleGarnish(g));
            garnContainer.appendChild(btn);
        });

        const salsas = [
            { id: 'Roja', name: 'Roja<br/>(Picante)', icon: 'local_fire_department', color: 'text-red-600', bg: 'bg-red-600/20' },
            { id: 'Verde', name: 'Verde<br/>(Suave)', icon: 'eco', color: 'text-green-700', bg: 'bg-green-600/20' },
            { id: 'Habanero', name: 'Habanero<br/>(Fuego)', icon: 'warning', color: 'text-orange-600', bg: 'bg-orange-500/20' }
        ];

        const salsaContainer = document.getElementById('p-salsas-grid');
        salsaContainer.innerHTML = '';

        salsas.forEach(s => {
            const active = item.salsa === s.id;
            const fillVal = active ? "1" : "0";
            const cardClass = active
                ? "salsa-active bg-secondary-container border border-secondary-container text-on-secondary-container rounded-xl p-3 flex flex-col items-center gap-2 transition-all shadow-sm cursor-pointer font-bold"
                : "bg-surface border border-outline-variant text-on-surface-variant rounded-xl p-3 flex flex-col items-center gap-2 transition-all hover:bg-surface-variant/50 cursor-pointer";

            const card = document.createElement('div');
            card.className = cardClass;
            card.innerHTML = `
                <div class="w-8 h-8 rounded-full ${s.bg} flex items-center justify-center">
                    <span class="material-symbols-outlined ${s.color} text-[20px]" style="font-variation-settings: 'FILL' ${fillVal};">${s.icon}</span>
                </div>
                <span class="font-label-sm text-label-sm text-center">${s.name}</span>
            `;
            card.addEventListener('click', () => Controllers.selectSalsa(s.id));
            salsaContainer.appendChild(card);
        });
    },

    estado() {
        const order = Store.activeOrder;
        if (!order) {
            // Display empty order status placeholder
            document.getElementById('view-estado-content').innerHTML = `
                <div class="text-center py-20 px-6 flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span class="material-symbols-outlined text-4xl">shopping_bag</span>
                    </div>
                    <h3 class="font-headline-lg text-xl text-on-surface">No tienes pedidos activos</h3>
                    <p class="font-body-md text-sm text-on-surface-variant">Visita nuestra sección de menú para ordenar tus deliciosos tacos.</p>
                    <button class="bg-primary text-on-primary font-label-lg px-6 py-3 rounded-xl shadow-md active:scale-95 transition-all mt-2" onclick="Router.navigateTo('menu')">Ir al Menú</button>
                </div>
            `;
            return;
        }

        // Render main tracking layout matching state
        let timelineProgressWidth = '25%';
        let step1Class = 'bg-primary text-on-primary';
        let step1LabelClass = 'font-label-sm text-on-surface';
        let step1IconFill = "'FILL' 1";
        
        let step2Class = 'bg-surface-variant border-2 border-surface-container-high text-on-surface-variant';
        let step2LabelClass = 'font-label-sm text-on-surface-variant';
        let step2IconFill = "'FILL' 0";
        let step2PingHtml = '';
        
        let step3Class = 'bg-surface-variant border-2 border-surface-container-high text-on-surface-variant';
        let step3LabelClass = 'font-label-sm text-on-surface-variant';
        let step3IconFill = "'FILL' 0";
        let step3PingHtml = '';
        
        let estimatedTimeText = "Listo en 15 mins";

        if (order.status === 'Recibido') {
            timelineProgressWidth = '25%';
            step1Class = 'bg-primary text-on-primary shadow-md';
            step1LabelClass = 'font-label-lg text-primary font-bold';
            step1IconFill = "'FILL' 1";
        } else if (order.status === 'Preparando') {
            timelineProgressWidth = '50%';
            step1Class = 'bg-primary text-on-primary';
            step1IconFill = "'FILL' 1";
            
            step2Class = 'bg-primary text-on-primary shadow-[0_0_15px_rgba(175,16,26,0.5)]';
            step2LabelClass = 'font-label-lg text-primary font-bold';
            step2IconFill = "'FILL' 1";
            step2PingHtml = '<div class="absolute top-0 w-10 h-10 rounded-full bg-primary/30 animate-ping"></div>';
            estimatedTimeText = "Listo en 5-10 mins";
        } else if (order.status === 'Listo' || order.status === 'Entregado') {
            timelineProgressWidth = '100%';
            step1Class = 'bg-primary text-on-primary';
            step1IconFill = "'FILL' 1";
            
            step2Class = 'bg-primary text-on-primary';
            step2IconFill = "'FILL' 1";
            
            step3Class = 'bg-primary text-on-primary shadow-[0_0_15px_rgba(175,16,26,0.5)]';
            step3LabelClass = 'font-label-lg text-primary font-bold';
            step3IconFill = "'FILL' 1";
            step3PingHtml = '<div class="absolute top-0 w-10 h-10 rounded-full bg-primary/30 animate-ping"></div>';
            estimatedTimeText = "¡Tu Pedido está listo!";
        }

        const itemsHtml = order.items.map(item => {
            const linePrice = (typeof item.totalPrice === 'number')
                ? item.totalPrice
                : 0;
            return `
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <span class="font-label-lg text-primary font-bold">${item.quantity}x</span>
                        <div>
                            <span class="font-body-md text-on-surface">${escapeHtml(item.name)}</span>
                            ${item.options ? `<p class="text-xs text-on-surface-variant font-medium mt-0.5">${escapeHtml(item.options)}</p>` : ''}
                        </div>
                    </div>
                    <span class="font-body-md text-on-surface-variant">${linePrice ? `$${linePrice.toFixed(2)}` : ''}</span>
                </div>
            `;
        }).join('');

        const container = document.getElementById('view-estado-content');
        container.innerHTML = `
            <!-- Status Header -->
            <section class="flex flex-col items-center text-center gap-sm mt-4">
                <div class="w-20 h-20 rounded-full bg-surface shadow-[0px_10px_30px_rgba(211,47,47,0.08)] border border-outline-variant/20 flex items-center justify-center mb-2">
                    <span class="material-symbols-outlined text-[48px] text-primary" style="font-variation-settings: 'FILL' 1;">verified</span>
                </div>
                <h2 class="font-display-lg text-display-lg text-on-surface">¡Pedido Confirmado!</h2>
                <p class="font-body-lg text-body-lg text-on-surface-variant">Orden #${escapeHtml(order.id)}</p>
            </section>
            
            <!-- Highlighted Time Indicator -->
            <section class="w-full bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md">
                <div class="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
                <div class="flex items-center gap-3 relative z-10">
                    <span class="material-symbols-outlined text-primary text-[32px]" style="font-variation-settings: 'FILL' 1;">timer</span>
                    <div class="flex flex-col text-left">
                        <span class="font-label-sm text-label-sm text-primary uppercase tracking-wider">Tiempo Estimado</span>
                        <span id="estimated-time-banner" class="font-headline-lg text-xl md:text-2xl text-primary leading-tight font-black">${estimatedTimeText}</span>
                    </div>
                </div>
            </section>
            
            <!-- Visual Timeline -->
            <section class="w-full bg-surface rounded-xl p-6 shadow-[0px_10px_30px_rgba(211,47,47,0.05)] border border-outline-variant/20">
                <h3 class="font-headline-md text-headline-md text-on-surface mb-6 font-bold">Estado de Preparación</h3>
                <div class="relative flex justify-between items-center w-full px-sm pb-2">
                    <!-- Track Background -->
                    <div class="absolute top-5 left-8 right-8 h-1 bg-surface-variant rounded-full -z-10"></div>
                    <!-- Track Progress -->
                    <div id="timeline-bar-progress" class="absolute top-5 left-8 h-1 bg-primary rounded-full -z-10 transition-all duration-1000" style="width: ${timelineProgressWidth}"></div>
                    
                    <!-- Step 1: Recibido -->
                    <div class="flex flex-col items-center gap-2 z-10 w-20">
                        <div class="w-10 h-10 rounded-full ${step1Class} flex items-center justify-center transition-all">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${step1IconFill};">receipt_long</span>
                        </div>
                        <span class="${step1LabelClass} text-center text-xs">Recibido</span>
                    </div>
                    
                    <!-- Step 2: Preparando -->
                    <div class="flex flex-col items-center gap-2 z-10 w-20 relative">
                        ${step2PingHtml}
                        <div class="w-10 h-10 rounded-full ${step2Class} flex items-center justify-center transition-all">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${step2IconFill};">outdoor_grill</span>
                        </div>
                        <span class="${step2LabelClass} text-center text-xs">Preparando</span>
                    </div>
                    
                    <!-- Step 3: Listo -->
                    <div class="flex flex-col items-center gap-2 z-10 w-20 relative">
                        ${step3PingHtml}
                        <div class="w-10 h-10 rounded-full ${step3Class} flex items-center justify-center transition-all">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: ${step3IconFill};">shopping_bag</span>
                        </div>
                        <span class="${step3LabelClass} text-center text-xs">Listo</span>
                    </div>
                </div>
            </section>
            
            <!-- Items Summary -->
            <section class="w-full bg-surface rounded-xl p-6 shadow-[0px_10px_30px_rgba(211,47,47,0.05)] border border-outline-variant/20 flex flex-col gap-4">
                <h3 class="font-headline-md text-headline-md text-on-surface font-bold">Resumen del Pedido</h3>
                <div class="flex flex-col gap-3">
                    ${itemsHtml}
                </div>
                <div class="h-px w-full bg-outline-variant/30"></div>
                <div class="flex justify-between items-center">
                    <span class="font-headline-md text-on-surface font-bold">Total</span>
                    <span class="font-headline-md text-primary font-black">$${order.total.toFixed(2)}</span>
                </div>
            </section>
            
            <!-- Map Pickup Details -->
            <section class="w-full bg-surface rounded-xl shadow-[0px_10px_30px_rgba(211,47,47,0.05)] border border-outline-variant/20 overflow-hidden flex flex-col">
                <div class="h-32 w-full bg-surface-container-high relative">
                    <img alt="Map view" class="w-full h-full object-cover opacity-80 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSQdygN_sMn_O0BxrwmWx_hNIl-v6ZbzIV3OvWKnogjDxeYZKllZHL5J_RcLkZI60M9dCLp9dT2_0sl-7tHQBFNXKAPsTP-FFzigxRaeNVwglWTqkm5wRlOJvXR4WSoUjTj5N2EHA1ozt3GrJ7KG7sYUL3_sN2umEkKg26-kvKfoN34HaEjh7yojyA6mXGhKNDI38xFGF1QCahTLHRh-BlfLebZdfumrqKh1o8hOumEqvMbkP7KSaWKtuOLXfReYKAM2r367QfbtI"/>
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-md">
                        <span class="material-symbols-outlined text-[36px]" style="font-variation-settings: 'FILL' 1;">location_on</span>
                    </div>
                </div>
                <div class="p-6 flex flex-col gap-3">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Recoger en</h4>
                            <p class="font-headline-md text-lg text-on-surface font-bold">Güero Barbacoa</p>
                            <p class="font-body-md text-sm text-on-surface-variant mt-1">Esperanza #11, Col. La Federacha<br/>Guadalajara, Jalisco · Tel. 331 180 7561</p>
                        </div>
                    </div>
                    <a href="https://www.google.com/maps/search/?api=1&query=Esperanza+11+La+Federacha+Guadalajara" target="_blank" rel="noopener noreferrer" class="mt-2 w-full bg-primary text-on-primary font-label-lg py-3 px-6 rounded-lg shadow-sm hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 font-bold">
                        <span class="material-symbols-outlined text-[20px]">directions</span>
                        Cómo llegar
                    </a>
                </div>
            </section>
        `;
    },

    cocina() {
        const container = document.getElementById('cocina-orders-grid');
        const activeCountEl = document.getElementById('cocina-queue-count');
        if (!container) return;

        // Show pending + ready (so kitchen can mark them as Entregado).
        const activeOrders = Store.orders
            .filter(o => o.status === 'Recibido' || o.status === 'Preparando' || o.status === 'Listo')
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp);

        if (activeCountEl) {
            const pending = activeOrders.filter(o => o.status !== 'Listo').length;
            activeCountEl.innerText = `${pending} pendientes · ${activeOrders.length - pending} listos por entregar`;
        }

        container.innerHTML = '';

        if (activeOrders.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-20 text-center text-on-surface-variant flex flex-col items-center gap-4">
                    <span class="material-symbols-outlined text-6xl text-outline/30">outdoor_grill</span>
                    <p class="font-headline-md text-lg">No hay pedidos pendientes en este momento.</p>
                    <p class="text-sm">¡Buen trabajo! La cocina está despejada.</p>
                </div>
            `;
            return;
        }

        activeOrders.forEach(o => {
            const timeElapsed = Math.max(0, Math.floor((Date.now() - o.timestamp) / 1000 / 60));
            const urgent = (timeElapsed >= 10 || o.urgent) && o.status !== 'Listo';

            let statusBadge = '';
            let cardHeaderBg = 'bg-surface-container-low';
            let activeColorStrip = 'bg-secondary-container';

            if (o.status === 'Listo') {
                statusBadge = '<span class="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">Listo</span>';
                cardHeaderBg = 'bg-green-600/10';
                activeColorStrip = 'bg-green-600';
            } else if (urgent) {
                statusBadge = '<span class="px-2 py-0.5 bg-error text-on-error rounded text-[10px] font-bold uppercase tracking-wider">Urgente</span>';
                cardHeaderBg = 'bg-error-container/20';
                activeColorStrip = 'bg-error';
            } else if (o.status === 'Preparando') {
                statusBadge = '<span class="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold uppercase tracking-wider">Cocinando</span>';
                cardHeaderBg = 'bg-secondary-container/10';
                activeColorStrip = 'bg-primary';
            } else {
                statusBadge = '<span class="px-2 py-0.5 bg-tertiary text-on-tertiary rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">Nuevo</span>';
                cardHeaderBg = 'bg-tertiary-container/10';
                activeColorStrip = 'bg-tertiary';
            }

            const itemsListHtml = o.items.map(item => `
                <li class="flex items-start gap-3">
                    <div class="font-headline-md text-headline-md text-primary font-black mt-0.5">${item.quantity}x</div>
                    <div>
                        <p class="font-label-lg text-sm text-on-surface font-semibold">${escapeHtml(item.name)}</p>
                        ${item.options ? `
                            <div class="mt-1 flex flex-wrap gap-1">
                                ${item.options.split(',').map(opt => `
                                    <span class="inline-block px-1.5 py-0.5 bg-secondary-container/30 text-on-secondary-container text-[10px] rounded border border-secondary/10 font-bold">${escapeHtml(opt.trim())}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </li>
            `).join('');

            // Build the action button(s) based on next valid transition.
            let nextActionText, nextActionStatus, buttonColor;
            if (o.status === 'Recibido') {
                nextActionText = 'Empezar a Preparar';
                nextActionStatus = 'Preparando';
                buttonColor = 'bg-primary text-on-primary hover:opacity-90';
            } else if (o.status === 'Preparando') {
                nextActionText = 'Marcar como Listo';
                nextActionStatus = 'Listo';
                buttonColor = 'bg-secondary-container text-on-secondary-container hover:opacity-90';
            } else {
                nextActionText = 'Marcar como Entregado';
                nextActionStatus = 'Entregado';
                buttonColor = 'bg-green-600 text-white hover:opacity-90';
            }

            const card = document.createElement('div');
            card.className = `bg-surface-container-lowest rounded-xl shadow-[0px_10px_30px_rgba(211,47,47,0.08)] border border-outline-variant/30 flex flex-col overflow-hidden relative ${urgent ? 'pulse-radar border-error/50' : ''}`;
            card.innerHTML = `
                <div class="absolute top-0 left-0 w-full h-1.5 ${activeColorStrip}"></div>
                <div class="p-4 border-b border-outline-variant/20 flex justify-between items-start ${cardHeaderBg}">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-headline-md text-lg text-on-surface font-black">#${escapeHtml(o.id)}</span>
                            ${statusBadge}
                        </div>
                        <p class="font-label-lg text-sm text-on-surface-variant mt-1 font-semibold">${escapeHtml(o.customerName)}</p>
                    </div>
                    <div class="text-right">
                        <div class="font-headline-md text-sm text-primary flex items-center gap-1 font-bold">
                            <span class="material-symbols-outlined text-sm">timer</span>
                            ${timeElapsed}m trans.
                        </div>
                        <p class="font-label-sm text-xs text-on-surface-variant font-medium mt-0.5">${escapeHtml(o.type)}</p>
                    </div>
                </div>
                <div class="flex-1 p-4 bg-surface-bright">
                    <ul class="space-y-3">
                        ${itemsListHtml}
                    </ul>
                </div>
                <div class="p-4 bg-surface-container-lowest mt-auto border-t border-outline-variant/10">
                    <button data-advance="${escapeHtml(o.id)}" data-next="${nextActionStatus}" class="w-full py-3 ${buttonColor} transition-all rounded-lg font-label-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 active:scale-95">
                        <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                        ${nextActionText}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('button[data-advance]').forEach(btn => {
            btn.addEventListener('click', () => {
                Controllers.advanceOrder(btn.getAttribute('data-advance'), btn.getAttribute('data-next'));
            });
        });
    },

    estadisticas() {
        // Only count today's revenue so the dashboard reflects "today".
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const startOfDayTs = startOfDay.getTime();

        let totalRevenue = 0;
        let activeOrdersCount = 0;
        let totalDelivered = 0;

        Store.orders.forEach(o => {
            if (o.status === 'Entregado' || o.status === 'Listo') {
                if (o.timestamp >= startOfDayTs) {
                    totalRevenue += o.total;
                    totalDelivered++;
                }
            } else if (o.status === 'Recibido' || o.status === 'Preparando') {
                activeOrdersCount++;
            }
        });

        const averageTicket = totalDelivered > 0 ? (totalRevenue / totalDelivered) : 0;

        document.getElementById('stats-revenue').innerText = `$${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        document.getElementById('stats-active-count').innerText = activeOrdersCount;
        document.getElementById('stats-ticket-avg').innerText = `$${averageTicket.toFixed(0)}`;

        const tableContainer = document.getElementById('stats-recent-orders-list');
        if (!tableContainer) return;

        tableContainer.innerHTML = '';

        // Newest first, capped to 25 rows for performance with large histories.
        const ordersCopy = [...Store.orders].sort((a, b) => b.timestamp - a.timestamp).slice(0, 25);

        ordersCopy.forEach(o => {
            let badgeClass = 'bg-surface-variant text-on-surface-variant';
            if (o.status === 'Recibido') badgeClass = 'bg-tertiary-container/30 text-tertiary';
            else if (o.status === 'Preparando') badgeClass = 'bg-secondary-container text-on-secondary-container';
            else if (o.status === 'Listo') badgeClass = 'bg-primary/20 text-primary';
            else if (o.status === 'Entregado') badgeClass = 'bg-green-600/20 text-green-700';

            const summaryStr = o.items.map(it => `${it.quantity}x ${it.name}`).join(', ');

            const html = `
                <li class="p-4 hover:bg-surface-container transition-colors flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                            <span class="material-symbols-outlined">fastfood</span>
                        </div>
                        <div>
                            <p class="font-label-lg text-sm text-on-surface font-semibold">#${escapeHtml(o.id)} - ${escapeHtml(o.customerName)}</p>
                            <p class="font-label-sm text-xs text-on-surface-variant mt-0.5 truncate max-w-xs md:max-w-md">${escapeHtml(summaryStr)}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-label-lg text-sm text-on-surface font-bold">$${o.total.toFixed(2)}</p>
                        <span class="inline-block px-2 py-0.5 ${badgeClass} text-[10px] font-bold rounded-full uppercase tracking-wide mt-1">${escapeHtml(o.status)}</span>
                    </div>
                </li>
            `;
            tableContainer.insertAdjacentHTML('beforeend', html);
        });

        // Dynamic Chart scaling based on real value
        const chartBars = document.querySelectorAll('#faux-chart-container > div');
        if (chartBars.length >= 5) {
            // Give third and fourth bars nice real-time weight
            const highVal = Math.min(95, 50 + activeOrdersCount * 5);
            const peakVal = Math.min(95, 75 + totalDelivered * 4);
            
            chartBars[2].style.height = `${highVal}%`;
            chartBars[3].style.height = `${peakVal}%`;
        }
    }
};

/**
 * 5. USER INTERACTION HANDLERS (Controllers)
 * Binds browser events, additions, submissions, and status progression hooks.
 */
const Controllers = {
    changeCategory(chipEl) {
        document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('category-chip-active'));
        chipEl.classList.add('category-chip-active');
        Renderers.filterMenu();
    },

    selectTortilla(type) {
        if (!Store.customizingItem) return;
        Store.customizingItem.tortilla = type;
        Renderers.updateCustomizationUI();
    },

    toggleGarnish(name) {
        if (!Store.customizingItem) return;
        const index = Store.customizingItem.garnituras.indexOf(name);
        if (index > -1) {
            Store.customizingItem.garnituras.splice(index, 1);
        } else {
            Store.customizingItem.garnituras.push(name);
        }
        Renderers.updateCustomizationUI();
    },

    selectSalsa(salsaId) {
        if (!Store.customizingItem) return;
        Store.customizingItem.salsa = salsaId;
        Renderers.updateCustomizationUI();
    },

    adjustQty(change) {
        if (!Store.customizingItem) return;
        const newQty = Store.customizingItem.quantity + change;
        if (newQty >= 1 && newQty <= 20) {
            Store.customizingItem.quantity = newQty;
            Renderers.updateCustomizationUI();
        }
    },

    async addToCartAndOrder() {
        const item = Store.customizingItem;
        if (!item) return;

        const customizable = item.dish.customizable !== false;

        const optionStrs = [];
        if (customizable) {
            optionStrs.push(`Tortilla: ${item.tortilla}`);
            if (item.garnituras.length > 0) optionStrs.push(...item.garnituras);
            optionStrs.push(`Salsa: ${item.salsa}`);
        }

        let extraCost = 0;
        if (customizable && item.garnituras.includes('Piña Extra (+$5)')) extraCost += 5.00;
        const finalUnitPrice = item.dish.basePrice + extraCost;
        const finalTotal = finalUnitPrice * item.quantity;

        const orderId = makeOrderId();

        const newOrder = {
            id: orderId,
            customerName: 'Cliente Local (Tú)',
            type: 'Comedor',
            timestamp: Date.now(),
            status: 'Recibido',
            items: [
                {
                    name: item.dish.name,
                    quantity: item.quantity,
                    options: optionStrs.join(', '),
                    totalPrice: finalTotal
                }
            ],
            total: finalTotal,
            urgent: false
        };

        try {
            await DataLayer.submitOrder(newOrder);
        } catch (err) {
            console.error('Failed to submit order', err);
            ToastEngine.show('No pudimos enviar tu pedido. Intenta de nuevo.');
            return;
        }

        Store.activeOrder = newOrder;
        try {
            localStorage.setItem('guerobarbacoa_active_order_v1', orderId);
        } catch (_) { /* quota — non-fatal */ }

        ToastEngine.show(`¡Pedido #${orderId} enviado a la cocina!`);
        Router.navigateTo('estado');
    },

    async advanceOrder(orderId, nextStatus) {
        try {
            await DataLayer.updateOrderStatus(orderId, nextStatus);
        } catch (err) {
            console.error('Failed to update order', err);
            ToastEngine.show(`No se pudo actualizar #${orderId}.`);
            return;
        }
        Renderers.cocina();
        ToastEngine.show(`Pedido #${orderId} actualizado a "${nextStatus}"`);
    }
};

/**
 * 6. SYNC ENGINE
 *
 * Subscribes to DataLayer change events (cross-tab via storage event today,
 * Supabase realtime tomorrow). Triggers chimes, confetti, and re-renders.
 */
const SyncEngine = {
    _knownIds: new Set(),

    init() {
        this._knownIds = new Set(Store.orders.map(o => o.id));

        DataLayer.subscribe((orders) => {
            // 1. Sync the customer's tracked order if any.
            if (Store.activeOrder) {
                const fresh = orders.find(o => o.id === Store.activeOrder.id);
                if (fresh) {
                    const previousStatus = Store.activeOrder.status;
                    Store.activeOrder = fresh;

                    if (COMPLETED_STATUSES.includes(fresh.status) && !COMPLETED_STATUSES.includes(previousStatus)) {
                        AudioSynth.playOrderReady();
                        ConfettiEngine.shoot();
                        ToastEngine.show('🎉 ¡Tu pedido está listo para recoger!');
                    }
                    if (fresh.status === 'Entregado') {
                        try { localStorage.removeItem(ACTIVE_ORDER_KEY); } catch (_) {}
                    }
                    if (Store.currentView === 'estado') {
                        Renderers.estado();
                    }
                }
            }

            // 2. Detect newly inserted orders by id (robust against reorderings).
            const currentIds = new Set(orders.map(o => o.id));
            const newOrders = orders.filter(o => !this._knownIds.has(o.id));
            this._knownIds = currentIds;

            if (Store.currentView === 'cocina') {
                newOrders.forEach(o => {
                    if (o.customerName !== 'Cliente Local (Tú)') {
                        AudioSynth.playNewOrder();
                        ToastEngine.show(`🔔 Nuevo pedido recibido: #${o.id}`);
                    }
                });
                Renderers.cocina();
            }

            if (Store.currentView === 'estadisticas') {
                Renderers.estadisticas();
            }
        });
    }
};

/**
 * 7. PREMIUM TOASTER ENGINE
 * Renders overlay slide-in alerts.
 */
const ToastEngine = {
    show(message) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="material-symbols-outlined text-primary text-[24px]">notifications_active</span>
            <div class="flex-1">
                <p class="font-label-lg text-xs font-bold text-on-surface">Güero Barbacoa</p>
                <p class="font-body-md text-xs text-on-surface-variant mt-0.5 leading-tight">${message}</p>
            </div>
        `;

        container.appendChild(toast);

        // Slide out after 4s
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }
};

/**
 * 8. VISUAL CONFETTI ENGINE
 * Spawns organic floating debris upon customer success.
 */
const ConfettiEngine = {
    colors: ['#af101a', '#fdd34d', '#005f7b', '#e4beba', '#ffffff'],
    
    shoot() {
        const docBody = document.body;
        for (let i = 0; i < 60; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            
            // Random parameters
            const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            const randomLeft = Math.floor(Math.random() * window.innerWidth);
            const randomSize = Math.floor(5 + Math.random() * 10);
            const randomDuration = 1.5 + Math.random() * 2;
            const randomDelay = Math.random() * 0.4;

            el.style.backgroundColor = randomColor;
            el.style.left = `${randomLeft}px`;
            el.style.width = `${randomSize}px`;
            el.style.height = `${randomSize}px`;
            el.style.animationDuration = `${randomDuration}s`;
            el.style.animationDelay = `${randomDelay}s`;
            
            docBody.appendChild(el);
            
            // Cleanup
            setTimeout(() => {
                el.remove();
            }, (randomDuration + randomDelay) * 1000);
        }
    }
};

/**
 * 9. AUTO-PRUNE
 *
 * Caps the orders array at MAX_ORDERS by dropping the oldest *delivered* ones.
 * Keeps localStorage from blowing up before Supabase is wired in.
 */
const MAX_ORDERS = 200;
function pruneOldOrders() {
    if (Store.orders.length <= MAX_ORDERS) return;
    const overflow = Store.orders.length - MAX_ORDERS;
    // Sort delivered by oldest first, drop overflow.
    const delivered = Store.orders
        .filter(o => o.status === 'Entregado')
        .sort((a, b) => a.timestamp - b.timestamp);
    const toDropIds = new Set(delivered.slice(0, overflow).map(o => o.id));
    if (toDropIds.size === 0) return;
    Store.orders = Store.orders.filter(o => !toDropIds.has(o.id));
    try {
        localStorage.setItem(LocalStorageAdapter.ORDERS_KEY, JSON.stringify(Store.orders));
    } catch (_) { /* non-fatal */ }
}

/**
 * INITIALIZATION
 */
async function bootstrap() {
    try {
        await DataLayer.init();
    } catch (err) {
        console.error('DataLayer init failed', err);
        ToastEngine.show('Error iniciando la app. Recarga la página.');
        return;
    }

    pruneOldOrders();

    // Restore the customer's tracked order across reloads.
    try {
        const savedId = localStorage.getItem(ACTIVE_ORDER_KEY);
        if (savedId) {
            const found = Store.orders.find(o => o.id === savedId);
            if (found && found.status !== 'Entregado') {
                Store.activeOrder = found;
            } else {
                localStorage.removeItem(ACTIVE_ORDER_KEY);
            }
        }
    } catch (_) { /* ignore */ }

    SyncEngine.init();

    // Routing: respect deep link via URL hash (e.g. #menu, #cocina).
    const hash = (window.location.hash || '').replace('#', '');
    const validViews = ['selector', 'inicio', 'menu', 'estado', 'cocina', 'estadisticas'];
    Router.navigateTo(validViews.includes(hash) ? hash : 'selector');

    window.addEventListener('hashchange', () => {
        const v = (window.location.hash || '').replace('#', '');
        if (validViews.includes(v) && v !== Store.currentView) {
            Router.navigateTo(v);
        }
    });

    // Global switcher portal
    const globalMenuBtn = document.getElementById('global-switcher-btn');
    const globalMenu = document.getElementById('global-switcher-menu');
    if (globalMenuBtn && globalMenu) {
        globalMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            globalMenu.classList.toggle('active');
        });
        document.addEventListener('click', () => {
            globalMenu.classList.remove('active');
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(err => console.error('bootstrap failed', err));
});
