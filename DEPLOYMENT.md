# Deployment Guide — Güero Barbacoa

This guide covers deploying the app to Cloudflare Pages with a custom domain.

## Option 1: Cloudflare Pages (Recommended)

### Step 1: Connect GitHub to Cloudflare
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git** → GitHub
4. Authorize Cloudflare to access your GitHub account
5. Select the `paumartifelip-cpu/taqueriaguadalajara` repository

### Step 2: Configure Build Settings
- **Project name**: `taqueriaguadalajara` (or your preference)
- **Production branch**: `main`
- **Build command**: Leave empty (this is a static site with no build step)
- **Build output directory**: `.` (root directory)
- **Environment variables**: None needed unless activating Supabase

### Step 3: Deploy
Click "Save and Deploy". Cloudflare will automatically build and deploy on every push to `main`.

Your site will be live at: `https://[project-name].pages.dev`

---

## Option 2: Custom Domain Setup

### Prerequisites
- A domain registered with any registrar (e.g., Namecheap, GoDaddy, Google Domains)
- Cloudflare account

### Step 1: Add Domain to Cloudflare
1. In Cloudflare Dashboard, go to **Websites**
2. Click **Add a domain**
3. Enter your domain (e.g., `guerobarbacoa.com`)
4. Select the free plan (or paid if you prefer)
5. Cloudflare will show you nameservers to configure

### Step 2: Update Nameservers at Your Registrar
1. Go to your domain registrar's control panel
2. Update the nameservers to Cloudflare's:
   - `iris.ns.cloudflare.com`
   - `julian.ns.cloudflare.com`
3. Wait 5–48 hours for DNS propagation

### Step 3: Connect Pages Project to Domain
1. In Cloudflare Dashboard, go to **Pages** → Your project → **Settings**
2. Under **Domains**, click **Add domain**
3. Enter your domain (`guerobarbacoa.com`)
4. Cloudflare will verify ownership and activate the domain

Your site is now live at: `https://guerobarbacoa.com`

---

## Option 3: Using Your Own Hosting + Cloudflare as CDN

### If Hosting Elsewhere (e.g., GitHub Pages, Netlify, Vercel)
1. Deploy the static site to your hosting provider
2. Get the public URL (e.g., `https://username.github.io/taqueriaguadalajara`)
3. In Cloudflare Dashboard → **Websites** → Add your domain
4. Create a CNAME or A record pointing to your hosting provider
5. Cloudflare will cache content and provide DDoS protection

---

## Security & Performance Features (Already Enabled)

- **SSL/TLS**: Automatic with Cloudflare (Full or Full Strict)
- **Caching**: Static assets (HTML, CSS, JS) cached globally
- **DDoS Protection**: Enabled by default
- **Minification**: Optional (Cloudflare → Speed → Optimization)

### Recommended Cloudflare Rules (Optional)

**Caching Rule for Long TTL:**
- **If**: Path matches `/` (HTML, CSS, JS)
- **Then**: Cache TTL = 1 hour (or `Cache everything`)

**Security Rule (Optional):**
- Enable **Bot Management** (free tier includes basic protection)
- Set **Challenge** on suspicious traffic

---

## Environment Variables for Supabase (When Ready)

To activate Supabase, you'll need to store credentials securely:

1. In Cloudflare Pages → **Settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

Then, in `config.js`, read from environment:
```javascript
window.APP_CONFIG.supabase = {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY
};
```

---

## Testing Before Deployment

1. **Local test**: Open `index.html` in a browser
   ```bash
   open index.html
   ```

2. **Simulate production**:
   ```bash
   # Using Python (macOS/Linux)
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Mobile test**: Use your phone on the same WiFi network:
   - Note your machine's local IP: `ipconfig getifaddr en0` (macOS)
   - Visit `http://<your-ip>:8000` from mobile

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Domain not resolving | Check DNS propagation: `nslookup guerobarbacoa.com` |
| Cloudflare shows error 522 | Ensure Pages project is deployed and active |
| iOS viewport bug (hueco arriba) | Already fixed with `100dvh` support in styles.css |
| Toast under notch | Already fixed with `env(safe-area-inset-top)` |

---

## Post-Deployment Checklist

- [ ] Site loads on desktop
- [ ] Site loads on mobile (iOS & Android)
- [ ] All images load correctly
- [ ] Ordering flow works end-to-end
- [ ] Toast notifications appear correctly
- [ ] Kitchen display system renders properly
- [ ] Stats page shows correct revenue
- [ ] Responsive design works at all breakpoints

---

## Next Steps: Supabase Integration

When ready to connect Supabase:
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `config.js` (comments at top)
3. Set Cloudflare environment variables with Supabase credentials
4. Uncomment `SupabaseAdapter` in `config.js`
5. Deploy

See `config.js` for detailed Supabase setup instructions.
