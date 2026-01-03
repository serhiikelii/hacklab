# Supabase Database Setup

## 🗄️ Database Schema

This project uses Supabase as the database and authentication provider.

### Tables

1. **device_categories** - Device categories (iPhone, iPad, MacBook, Apple Watch)
2. **device_models** - Specific device models (iPhone 15 Pro Max, MacBook Pro M2, etc.)
3. **services** - Repair services offered
4. **category_services** - Many-to-many relationship: which services are available for which categories
5. **prices** - Prices for each service per device model
6. **discounts** - Available discounts

### Features

- UUID primary keys
- Automatic `updated_at` triggers
- Row Level Security (RLS) enabled
- Public read access for pricelist
- Indexes for fast queries
- Multilingual support (RU, EN, CZ)
- Category-specific services support

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `hacklab`
   - Database password: (choose a strong password)
   - Region: Europe (Frankfurt) - `eu-central-1`
4. Wait for the project to be created (~2 minutes)

### 2. Get API Keys

1. Go to Project Settings → API
2. Copy the following:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key
   - `service_role` secret key (for admin operations)

### 3. Set Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Migrations

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy content from `migrations/001_initial_schema.sql`
4. Click "Run"
5. Verify tables were created in Table Editor

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Seed Data

1. Go to SQL Editor
2. Click "New Query"
3. Copy content from `migrations/002_seed_data.sql`
4. Click "Run"
5. Verify data in Table Editor:
   - 4 categories: `iphone`, `ipad`, `macbook`, `apple-watch`
   - 14 sample models
   - 23 services
   - Category-specific services links
   - Sample prices for iPhone 15 Pro Max
   - 3 discounts

## 📊 Database Statistics

- **Categories**: 4 (iPhone, iPad, MacBook, Apple Watch)
- **Sample Models**: 14
  - iPhone: 6 models (16 Pro Max, 16 Pro, 15 Pro Max, 15 Pro, 14 Pro Max, 14 Pro)
  - iPad: 3 models (Pro 12.9", Air 4, mini 5)
  - MacBook: 3 models (Pro 13" M2, Air 13" M2, Pro 14")
  - Apple Watch: 2 models (Watch 9, Watch SE)
- **Services**: 23 (category-specific)
  - iPhone: 8 services
  - iPad: 6 services
  - MacBook: 4 services
  - Apple Watch: 5 services
- **Sample Prices**: 7 (for iPhone 15 Pro Max)
- **Discounts**: 3

## 🔐 Security

- RLS enabled on all tables
- Public read access (anyone can view pricelist)
- Write access requires authentication (admin only)
- Service role key for backend operations only

## 📝 Schema Details

### device_categories
```sql
id              UUID PRIMARY KEY
slug            TEXT UNIQUE         -- 'iphone', 'ipad', 'macbook', 'apple-watch'
name_ru         TEXT                -- 'iPhone', 'iPad', 'MacBook', 'Apple Watch'
name_en         TEXT
name_cz         TEXT
order           INTEGER
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### device_models
```sql
id              UUID PRIMARY KEY
category_id     UUID REFERENCES device_categories
slug            TEXT UNIQUE
name            TEXT
series          TEXT
image_url       TEXT
release_year    INTEGER
order           INTEGER
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### services
```sql
id              UUID PRIMARY KEY
slug            TEXT UNIQUE
name_ru         TEXT
name_en         TEXT
name_cz         TEXT
description_ru  TEXT
description_en  TEXT
description_cz  TEXT
service_type    ENUM('main', 'extra')
order           INTEGER
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### category_services (Many-to-Many)
```sql
id              UUID PRIMARY KEY
category_id     UUID REFERENCES device_categories
service_id      UUID REFERENCES services
is_active       BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP

UNIQUE(category_id, service_id)
```

### prices
```sql
id                UUID PRIMARY KEY
model_id          UUID REFERENCES device_models
service_id        UUID REFERENCES services
price             DECIMAL(10, 2)
price_type        ENUM('fixed', 'from', 'free', 'on_request')
duration_minutes  INTEGER
warranty_months   INTEGER DEFAULT 24
created_at        TIMESTAMP
updated_at        TIMESTAMP

UNIQUE(model_id, service_id)
```

### discounts
```sql
id              UUID PRIMARY KEY
name_ru         TEXT
name_en         TEXT
name_cz         TEXT
discount_type   ENUM('percentage', 'fixed', 'bonus')
value           DECIMAL(10, 2)
conditions_ru   TEXT
conditions_en   TEXT
conditions_cz   TEXT
active          BOOLEAN
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🔍 Useful Views

### category_services_view
Convenient view for fetching category-specific services with all related data:

```sql
SELECT * FROM category_services_view
WHERE category_slug = 'iphone'
ORDER BY service_order;
```

## 🛠️ Maintenance

### Add new device model

```sql
INSERT INTO device_models (category_id, slug, name, series, release_year, "order")
VALUES (
  (SELECT id FROM device_categories WHERE slug = 'iphone'),
  'iphone-17-pro',
  'iPhone 17 Pro',
  'iPhone 17',
  2025,
  1
);
```

### Add prices for a model

```sql
INSERT INTO prices (model_id, service_id, price, price_type, duration_minutes, warranty_months)
VALUES (
  (SELECT id FROM device_models WHERE slug = 'iphone-17-pro'),
  (SELECT id FROM services WHERE slug = 'iphone-battery'),
  1999,
  'fixed',
  60,
  24
);
```

### Link service to category

```sql
INSERT INTO category_services (category_id, service_id, is_active)
VALUES (
  (SELECT id FROM device_categories WHERE slug = 'iphone'),
  (SELECT id FROM services WHERE slug = 'iphone-battery'),
  true
);
```

## 🔄 Migration History

- **001_initial_schema.sql** - Initial database schema with all tables, indexes, RLS policies, and views
- **002_seed_data.sql** - Seed data with categories, models, services, and sample prices

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/overview#the-sql-editor)
- [Database Migrations](https://supabase.com/docs/guides/database/migrations)

## 🔄 Backup

Previous migrations have been backed up to `migrations_backup_YYYYMMDD/` folder.

## 🆘 Troubleshooting

### Issue: Tables already exist

If you get an error that tables already exist, you need to drop them first:

```sql
-- WARNING: This will delete all data!
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS category_services CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS device_models CASCADE;
DROP TABLE IF EXISTS device_categories CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;

-- Drop types
DROP TYPE IF EXISTS service_type_enum CASCADE;
DROP TYPE IF EXISTS price_type_enum CASCADE;
DROP TYPE IF EXISTS discount_type_enum CASCADE;
```

Then run `001_initial_schema.sql` again.

### Issue: Foreign key violations

Make sure you run migrations in order:
1. First: `001_initial_schema.sql` (creates tables)
2. Second: `002_seed_data.sql` (inserts data)

### Issue: RLS blocking queries

If you can't see data, check RLS policies:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies
WHERE schemaname = 'public';
```
