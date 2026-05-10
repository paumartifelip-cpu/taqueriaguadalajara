/**
 * GÜERO BARBACOA — Runtime configuration
 *
 * This file is loaded BEFORE app.js so it can swap out the data adapter.
 *
 * To activate Supabase:
 *   1. Crear un proyecto en https://supabase.com y obtener URL + anon key.
 *   2. Sustituir los valores en `window.APP_CONFIG`.
 *   3. Cargar el cliente oficial en index.html (justo antes de config.js):
 *        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   4. Descomentar la sección "SUPABASE ADAPTER" más abajo.
 *
 * Esquema esperado en Supabase:
 *
 *   create table public.orders (
 *     id            text primary key,
 *     customer_name text not null,
 *     type          text not null,                       -- Comedor | Para Llevar | Delivery
 *     status        text not null default 'Recibido',    -- Recibido | Preparando | Listo | Entregado
 *     items         jsonb not null,                      -- [{name, quantity, options, totalPrice}]
 *     total         numeric not null,
 *     urgent        boolean default false,
 *     created_at    timestamptz default now()
 *   );
 *
 *   alter publication supabase_realtime add table public.orders;
 *
 *   -- RLS: políticas mínimas para una sola sucursal.
 *   alter table public.orders enable row level security;
 *   create policy "anon read"   on public.orders for select using (true);
 *   create policy "anon insert" on public.orders for insert with check (true);
 *   create policy "anon update" on public.orders for update using (true);
 */

window.APP_CONFIG = {
    // Cambia esto a 'supabase' cuando esté lista la BD.
    backend: 'localStorage',

    supabase: {
        url: '',          // p.ej. 'https://xxxx.supabase.co'
        anonKey: ''       // anon public key
    },

    // Solo se usa al imprimir el ticket / comprobante.
    restaurant: {
        name: 'Güero Barbacoa',
        phone: '331 180 7561',
        address: 'Esperanza #11, Col. La Federacha, Guadalajara'
    }
};

/* -----------------------------------------------------------------
 * SUPABASE ADAPTER (descomenta cuando vayas a conectarlo)
 * -----------------------------------------------------------------
 * Cuando lo actives, fija `window.DataLayerAdapter = SupabaseAdapter;`
 * antes de que se cargue app.js. El resto de la app no necesita cambios.
 *
const SupabaseAdapter = (function () {
    let client = null;
    let cache = [];
    const listeners = new Set();

    function rowToOrder(row) {
        return {
            id: row.id,
            customerName: row.customer_name,
            type: row.type,
            status: row.status,
            items: row.items,
            total: Number(row.total),
            urgent: row.urgent || false,
            timestamp: new Date(row.created_at).getTime()
        };
    }
    function orderToRow(order) {
        return {
            id: order.id,
            customer_name: order.customerName,
            type: order.type,
            status: order.status,
            items: order.items,
            total: order.total,
            urgent: !!order.urgent,
            created_at: new Date(order.timestamp).toISOString()
        };
    }
    function notify() {
        listeners.forEach(fn => { try { fn(cache); } catch (e) { console.error(e); } });
    }

    return {
        async init() {
            const { url, anonKey } = window.APP_CONFIG.supabase;
            if (!url || !anonKey) throw new Error('Supabase URL/anonKey faltantes');
            // eslint-disable-next-line no-undef
            client = supabase.createClient(url, anonKey);

            // Initial fetch — last 200 orders newest first.
            const { data, error } = await client
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(200);
            if (error) throw error;
            cache = (data || []).map(rowToOrder).reverse();
            window.Store && (window.Store.orders = cache);

            // Realtime subscription
            client
                .channel('orders-feed')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'orders' },
                    (payload) => {
                        if (payload.eventType === 'INSERT') {
                            cache.push(rowToOrder(payload.new));
                        } else if (payload.eventType === 'UPDATE') {
                            const idx = cache.findIndex(o => o.id === payload.new.id);
                            if (idx >= 0) cache[idx] = rowToOrder(payload.new);
                        } else if (payload.eventType === 'DELETE') {
                            cache = cache.filter(o => o.id !== payload.old.id);
                        }
                        notify();
                    })
                .subscribe();
        },
        listOrders() { return cache; },
        async submitOrder(order) {
            const { error } = await client.from('orders').insert(orderToRow(order));
            if (error) throw error;
            // Optimistic — realtime evento traerá la copia auténtica.
            cache.push(order);
            notify();
            return order;
        },
        async updateOrderStatus(orderId, nextStatus) {
            const { error } = await client.from('orders').update({ status: nextStatus }).eq('id', orderId);
            if (error) throw error;
        },
        subscribe(callback) {
            listeners.add(callback);
            return () => listeners.delete(callback);
        }
    };
})();

if (window.APP_CONFIG.backend === 'supabase') {
    window.DataLayerAdapter = SupabaseAdapter;
}
 */
