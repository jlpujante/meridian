# 🌐 Meridian: Your Personal Intelligence Agency

A modular platform for automated information gathering, analysis, and personalized briefings.

---

## ⚙️ Local Setup Guide

**Tested on**: Ubuntu 22.10  
**Requirements**:  
- Node.js (v22+, recommended v23.11.0+)  
- PNPM (v9.15+)  
- Python 3.10+  
- PostgreSQL  
- Cloudflare Account  (*only for cloud deployment*)
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
# Install Node Version Manager
sudo npm install -g n

# Symlink Node (if needed)
sudo ln -s /usr/local/bin/node /usr/bin/node

# Verify version
node -v
# Expected: v23.11.0
```

---

### 3️⃣ Install PNPM

```bash
# Download and install PNPM
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Update the terminal environment
source /home/<your-user>/.bashrc
```

---

### 4️⃣ Configure the Database

Create or edit the `.env` file in `packages/database/`:

```env
DATABASE_URL="postgresql://<dbuser>:<dbpassword>@<host>/<dbname>"
```

Run migrations:

```bash
cd packages/database
npm install
pnpm --filter @meridian/database db:migrate
```

---

### 5️⃣ Install Node.js App Dependencies

#### 🖥️ Frontend

```bash
cd apps/frontend
npm install
```

#### 🕸️ Scrapers

```bash
cd ../scrapers
npm install
```

---

### 6️⃣ Install Python App Dependencies

```bash
cd ../briefs

# (Optional) Ensure virtualenv is installed
sudo apt-get install virtualenv

# Create virtual environment
virtualenv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

### 7️⃣ Configure Local Environment

Edit `.dev.vars.local` inside `apps/scrapers/`:

```env
MERIDIAN_SECRET_KEY="<YourSecretKey>"
DATABASE_URL="postgresql://<dbuser>:<dbpasswd>@<host>/<dbname>"
GOOGLE_API_KEY="<YourGoogleAIKey>"
```

---

### 8️⃣ Add an RSS Feed Source

Insert a row into the `sources` table in PostgreSQL:

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

#### Option A: Run All with Turbo

```bash
cd meridian
npm run dev
```

#### Option B: Run Each App Separately

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

Use the `MERIDIAN_SECRET_KEY` from `.dev.vars.local`:

```bash
curl http://localhost:8787/trigger-rss?token=<MERIDIAN_SECRET_KEY>
```

---

### 🔁 Generate Briefing Report

```bash
cd apps/briefs
source .venv/bin/activate
python run_reportV5.py
```

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

> _Built because we live in an age of magic — and keep forgetting to use it._
