# 🌐 Meridian: Your Personal Intelligence Agency

A modular platform for automated information gathering, analysis, and personalized briefings.

---

## ⚙️ Local Setup Guide

**Tested on**: Ubuntu 22.10 & 24.10  
**Requirements**:  
- Node.js (v22+, _recommended_: v23.11.0+)  
- PNPM (v9.15+)  
- Python 3.10+  
- PostgreSQL  
- Cloudflare Account _(only for cloud deployment)_  
- Google AI API Key  

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/jlpujante/meridian.git
cd meridian
```

---

### 2️⃣ Install Node.js

```bash
# Install system dependencies
sudo apt install nodejs npm curl -y

# Install Node Version Manager (n)
sudo npm install -g n
sudo n stable
hash -r

# Verify version
node -v
# Expected output: v23.11.0
```

---

### 3️⃣ Install PNPM

```bash
# Install PNPM
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Reload shell config (adjust path to your shell if needed)
source /home/<your-user>/.bashrc
```

---

### 4️⃣ Set Up the Database

**Configure `.env` in `packages/database/`:**

```env
DATABASE_URL="postgresql://<dbuser>:<dbpassword>@<host>/<dbname>"
```

**Run migrations:**

```bash
cd packages/database
pnpm install
pnpm --filter @meridian/database db:migrate
```

---

### 5️⃣ Install Node.js App Dependencies

#### 🖥️ Frontend

```bash
cd apps/frontend
pnpm install
```

#### 🕸️ Scrapers

```bash
cd ../scrapers
pnpm install
```

---

### 6️⃣ Install Python App Dependencies

```bash
cd ../briefs

# Install virtualenv (if not already installed)
sudo apt-get install virtualenv

# Create and activate virtual environment
virtualenv .venv
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

---

### 7️⃣ Configure Local Environment

#### ⚙️ Frontend

Edit `nuxt.config.ts` in `apps/frontend/`:

```ts
runtimeConfig: {
  ...
  DATABASE_URL: 'postgresql://<dbuser>:<dbpasswd>@<host>/<dbname>',
}
```

#### ⚙️ Briefs

```bash
# Copy and edit env file
cd ../briefs
cp .env.example .env
```

```env
DATABASE_URL="postgresql://<dbuser>:<dbpasswd>@<host>/<dbname>"
GOOGLE_API_KEY="<GOOGLE_AI_API_KEY>"
MERIDIAN_SECRET_KEY="<YourPrivateKey>"
SCRAPER_URL="http://localhost:8787"
```

#### ⚙️ Scrapers

```bash
cd ../scrapers
cp .dev.vars.example .dev.vars
```

```env
MERIDIAN_SECRET_KEY="<YourSecretKey>"
DATABASE_URL="postgresql://<dbuser>:<dbpasswd>@<host>/<dbname>"
GOOGLE_API_KEY="<GOOGLE_AI_API_KEY>"
GOOGLE_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
```

---

### 8️⃣ Add an RSS Feed Source

Insert a new record into the `sources` table:

| Column            | Example Value                        |
|------------------|--------------------------------------|
| url              | `https://cn.nytimes.com/rss.html`    |
| name             | `CN NYTimes`                         |
| scrape_frequency | `2`                                  |
| category         | `News`                               |

---

### 9️⃣ 🚀 Run the Project Locally

**Frontend**: `http://localhost:3000`  
**Scrapers**: `http://localhost:8787`

#### Option A: Run All Apps via Turbo

```bash
cd meridian
npm run dev
```

#### Option B: Run Individually

```bash
# Terminal 1: Frontend
cd apps/frontend
npm run dev

# Terminal 2: Scrapers
cd ../scrapers
npm run dev
```

---

### 🔟 Trigger Scraper Manually

Use the secret token defined in `MERIDIAN_SECRET_KEY`:

```bash
curl http://localhost:8787/trigger-rss?token=<MERIDIAN_SECRET_KEY>
```

---

### 🔁 Generate a Briefing Report

```bash
cd apps/briefs
source .venv/bin/activate
python run_reportV5.py
```

---

### 🧪 Run Local Tests

```bash
# Test Scrapers
cd apps/scrapers
npm run test
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---
