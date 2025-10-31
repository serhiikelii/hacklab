# Supabase Database Setup

## 🗄️ Database Schema

This project uses Supabase as the database and authentication provider.

### Tables

1. **device_categories** - Device categories (iPhone, iPad, Mac, Watch/TV)
2. **device_models** - Specific device models (iPhone 15 Pro Max, etc.)
3. **services** - Repair services offered
4. **prices** - Prices for each service per device model
5. **discounts** - Available discounts

### Features

- UUID primary keys
- Automatic `updated_at` triggers
- Row Level Security (RLS) enabled
- Public read access for pricelist
- Indexes for fast queries

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `mojservice`
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

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy content from `migrations/20251024_initial_schema.sql`
4. Click "Run"
5. Verify tables were created in Table Editor

### 5. Seed Data

1. Go to SQL Editor again
2. Click "New Query"
3. Copy content from `seed.sql`
4. Click "Run"
5. Verify data in Table Editor:
   - 4 categories
   - ~14 sample models
   - 23 services
   - Sample prices for iPhone 15 Pro Max
   - 5 discounts

## 📊 Database Statistics

- **Categories**: 4
- **Sample Models**: 14 (iPhone, iPad, Mac, Watch)
- **Services**: 23 (18 main + 5 extra)
- **Sample Prices**: 5 (for iPhone 15 Pro Max)
- **Discounts**: 5

## 🔐 Security

- RLS enabled on all tables
- Public read access (anyone can view pricelist)
- Write access requires authentication (admin only)
- Service role key for backend operations only

## 📝 Next Steps

1. Install Supabase client library:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create Supabase client utility (see `lib/supabase.ts`)

3. Add more device models and prices as needed

4. Implement admin panel for managing data

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
INSERT INTO prices (model_id, service_id, price, price_type, warranty_months)
VALUES (
  (SELECT id FROM device_models WHERE slug = 'iphone-17-pro'),
  (SELECT id FROM services WHERE slug = 'battery-replacement'),
  2990,
  'fixed',
  24
);
```

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/overview#the-sql-editor)
