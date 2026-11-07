# Hypixel SkyBlock Tracker — Official API Powered

A production-ready, high-performance Hypixel SkyBlock player tracker inspired by SkyCrypt, powered by the official Hypixel API (v2), Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, and SQLite.

---

## 🌟 Key Features

1. **Official Hypixel API v2 Integration**
   - Direct server-side authentication using official Hypixel API keys.
   - Player UUID resolution via Mojang API and PlayerDB.
   - Direct live integration with official Hypixel public endpoints:
     - SkyBlock Items (`/v2/resources/skyblock/items`) — 5,600+ items
     - SkyBlock Bazaar (`/v2/skyblock/bazaar`) — 2,200+ live market commodities
     - SkyBlock Active Auctions (`/v2/skyblock/auctions`) — 40,000+ listings
     - SkyBlock Skills Definitions (`/v2/resources/skyblock/skills`)
     - Player Profiles (`/v2/skyblock/profiles?uuid=...`) & Player stats (`/v2/player?uuid=...`)
   - Intelligent local caching in SQLite via Prisma ORM.
   - Rate limit and error transparency: Never displays fabricated data when the API fails or is rate limited.

2. **Minecraft NBT Inventory Decoder**
   - High-performance Base64 gzip/zlib NBT buffer decoder (`prismarine-nbt`).
   - Extracts item names, color codes (`§`), lore, rarity tiers, reforge stones, enchantments, dungeon stars (`✪`), recombobulators, gemstones, and Crimson Isle attributes.

3. **15 Dedicated Navigation Views (With Direct Refresh & No 404s)**
   - **Overview**: Profile dashboard, level, networth, purse, bank, active pet, equipped armor, and slayers.
   - **Skills**: Farming, Mining, Combat, Foraging, Fishing, Enchanting, Alchemy, Taming, Carpentry, Runecrafting, Social.
   - **Slayers**: Revenant Horror, Tarantula Broodfather, Sven Packmaster, Voidgloom Seraph, Inferno Demonlord, Vampire.
   - **Collections**: Farming, Mining, Combat, Foraging, Fishing collections with unlocked tiers.
   - **Inventory**: Decoded 36-slot player inventory, Ender Chest, and Personal Vault.
   - **Armor & Equipment**: Active 4-piece armor set, Crimson Isle equipment (Necklace, Cloak, Belt, Gloves), and primary weapon.
   - **Accessories**: Talisman bag items, Magical Power calculation, duplicate accessory detection, power stones, and missing accessory recommendations.
   - **Pets**: Level, rarity, experience, held items, active pet indicator, and pet score.
   - **Dungeons**: Catacombs level, XP, class levels (Berserk, Archer, Mage, Tank, Healer), and secrets found.
   - **Mining**: Heart of the Mountain (HoTM) tiers, Mithril powder, Gemstone powder, and Mining Fortune.
   - **Garden**: Garden rank, unlocked plots, visitors served, and composter batches.
   - **Minions**: Minion slots unlocked, unique minion tiers crafted.
   - **Networth**: Real networth calculation with item category breakdown, liquid purse/bank, most valuable items, and historical trends.
   - **Upgrade Planner**: Personalized recommendations based on owned gear, coin budget, and game mode (Combat, Slayers, Dungeons, Mining, Farming).
   - **Profile Settings**: Secure server-side Hypixel API key management and cache controls.

4. **Public Profile Sharing (No Login Required)**
   - Accessible at `/share/[username]/[profile]`, e.g. `/share/Prithivi102/Strawberry`.
   - Server-Side Rendered (SSR) HTML containing full player statistics, skills table, and JSON-LD structured data for web crawlers, AI assistants, and external tools.
   - Works without authentication, cookies, or browser sessions.

5. **Machine-Readable Public JSON API (For ChatGPT & External Tools)**
   - `GET /api/public/profile/Prithivi102/Strawberry` (Full profile JSON)
   - `GET /api/public/profile/Prithivi102/Strawberry/inventory` (Equipped gear & containers)
   - `GET /api/public/profile/Prithivi102/Strawberry/skills` (Skills & true skill average)
   - `GET /api/public/profile/Prithivi102/Strawberry/slayers` (Slayer boss XP & levels)
   - `GET /api/public/profile/Prithivi102/Strawberry/accessories` (Magical Power & accessories)

6. **Full JSON Backup Import & Export**
   - Export complete tracker profile backups as downloadable `.json` files.
   - Import previously saved profiles with automatic schema validation, preview before applying, and clear provenance labeling (`USER_IMPORT`).

7. **Strict Security**
   - Hypixel API keys are stored server-side only in environment variables or SQLite app config.
   - Keys are NEVER exposed to frontend JavaScript or included in public JSON endpoints.
   - Sanitized user inputs and rate-limiting safeguards.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database / ORM**: Prisma ORM with SQLite (`dev.db`)
- **Data Visualizations**: Recharts
- **NBT Decoder**: `prismarine-nbt` + Node.js `zlib`
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17+ or 20+ (tested on Node.js v22)
- npm or pnpm

### 2. Installation
```bash
# Clone or navigate to the project directory
cd skyblock-tracker

# Install dependencies
npm install

# Initialize database and seed default profile (Prithivi102 / Strawberry)
npx prisma db push
npm run db:seed
```

### 3. Environment Variables
Create a `.env` file in the project root (see `.env.example`):
```env
# Official Hypixel API Key (obtain from https://developer.hypixel.net/)
HYPIXEL_API_KEY=""

# SQLite local database connection
DATABASE_URL="file:./dev.db"

# Canonical Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
*(Note: An API key is optional for viewing seeded/imported profiles, Bazaar, and Auctions, but required for fetching fresh live member data from Hypixel).*

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Production Build
```bash
npm run build
npm start
```

---

## 🧪 Automated Verification Suite

Run the full end-to-end integration test suite verifying all 15 routes, public share URLs, JSON endpoints, and error handling:
```bash
node scripts/verify-all.mjs
```

---

## 🔗 Public Endpoints Reference

| Endpoint | Description |
| :--- | :--- |
| `/share/Prithivi102/Strawberry` | Public SSR profile view with JSON-LD metadata |
| `/p/Prithivi102/Strawberry` | Full interactive dashboard |
| `/api/public/profile/Prithivi102/Strawberry` | Full machine-readable profile JSON |
| `/api/public/profile/Prithivi102/Strawberry/skills` | Skills breakdown JSON |
| `/api/public/profile/Prithivi102/Strawberry/slayers` | Slayers breakdown JSON |
| `/api/public/profile/Prithivi102/Strawberry/inventory` | Inventory & equipment JSON |
| `/api/public/profile/Prithivi102/Strawberry/accessories`| Accessories & MP JSON |
| `/api/profile/export` | Download full backup JSON |
| `/api/profile/import` | POST endpoint to restore JSON backup |
| `/api/planner` | GET/POST upgrade planner budget & goals |

---

## 🛡️ Data Transparency Notice
Hypixel SkyBlock allows players to toggle their API privacy settings (such as Inventory API, Collections API, and Banking API) in-game via `/settings` in the SkyBlock menu. If a player has disabled their Inventory API, the tracker explicitly indicates:
`"Inventory API disabled in player Hypixel privacy settings."`
It will never invent or guess missing player items.
