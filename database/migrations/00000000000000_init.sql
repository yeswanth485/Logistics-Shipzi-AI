-- Migration: PackIQ Schema Init
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE 2: companies (Create first due to foreign keys)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    website_domain TEXT,
    location TEXT,
    logo_url TEXT,
    warehouse_type TEXT CHECK (warehouse_type IN ('small', 'medium', 'large', 'enterprise')),
    shipping_regions TEXT[],
    packaging_preferences JSONB,
    sustainability_targets JSONB,
    default_carrier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 1: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY, -- References auth.users from Supabase Auth
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3: box_catalog
CREATE TABLE IF NOT EXISTS box_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- Nullable for global boxes
    box_name TEXT NOT NULL,
    box_type TEXT CHECK (box_type IN ('standard', 'heavy_duty', 'eco', 'fragile', 'custom', 'mailer', 'tube', 'flat')),
    length_cm DECIMAL(8,2) NOT NULL,
    width_cm DECIMAL(8,2) NOT NULL,
    height_cm DECIMAL(8,2) NOT NULL,
    max_weight_kg DECIMAL(8,2) NOT NULL,
    material_type TEXT CHECK (material_type IN ('cardboard', 'corrugated', 'recycled', 'biodegradable', 'plastic', 'foam_lined')),
    sustainability_score INTEGER CHECK (sustainability_score >= 1 AND sustainability_score <= 100),
    cost_per_box DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 4: products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    length_cm DECIMAL(8,2),
    width_cm DECIMAL(8,2),
    height_cm DECIMAL(8,2),
    weight_kg DECIMAL(8,2),
    fragility TEXT CHECK (fragility IN ('low', 'medium', 'high', 'extreme')),
    quantity INTEGER DEFAULT 1,
    shipping_zone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 5: optimization_runs
CREATE TABLE IF NOT EXISTS optimization_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    run_name TEXT,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_products INTEGER DEFAULT 0,
    total_shipments INTEGER DEFAULT 0,
    csv_file_url TEXT,
    total_savings_usd DECIMAL(12,2) DEFAULT 0,
    co2_reduction_kg DECIMAL(12,2) DEFAULT 0,
    avg_space_efficiency DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- TABLE 6: optimized_orders
CREATE TABLE IF NOT EXISTS optimized_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    optimization_run_id UUID REFERENCES optimization_runs(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    product_name TEXT,
    original_box_id UUID REFERENCES box_catalog(id),
    recommended_box_id UUID REFERENCES box_catalog(id),
    quantity INTEGER DEFAULT 1,
    space_efficiency DECIMAL(5,2),
    empty_space_cm3 DECIMAL(12,2),
    original_shipping_cost DECIMAL(10,2),
    optimized_shipping_cost DECIMAL(10,2),
    savings_usd DECIMAL(10,2),
    dimensional_weight_kg DECIMAL(8,2),
    fragility_risk_score DECIMAL(5,2),
    sustainability_score INTEGER,
    co2_reduction_kg DECIMAL(8,2),
    ai_recommendation_reason TEXT,
    optimization_score DECIMAL(5,4),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 7: sustainability_metrics
CREATE TABLE IF NOT EXISTS sustainability_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    period_start DATE,
    period_end DATE,
    total_co2_reduction_kg DECIMAL(12,2) DEFAULT 0,
    packaging_waste_reduction_kg DECIMAL(12,2) DEFAULT 0,
    recyclable_material_usage_pct DECIMAL(5,2) DEFAULT 0,
    eco_score INTEGER CHECK (eco_score >= 0 AND eco_score <= 100),
    boxes_optimized INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 8: analytics_snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    snapshot_date DATE,
    total_shipments INTEGER DEFAULT 0,
    optimized_shipments INTEGER DEFAULT 0,
    total_savings_usd DECIMAL(12,2) DEFAULT 0,
    avg_optimization_score DECIMAL(5,4) DEFAULT 0,
    top_carrier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

CREATE INDEX IF NOT EXISTS idx_box_catalog_company_id ON box_catalog(company_id);
CREATE INDEX IF NOT EXISTS idx_box_catalog_created_at ON box_catalog(created_at);

CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_optimization_runs_company_id ON optimization_runs(company_id);
CREATE INDEX IF NOT EXISTS idx_optimization_runs_user_id ON optimization_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_optimization_runs_status ON optimization_runs(status);
CREATE INDEX IF NOT EXISTS idx_optimization_runs_created_at ON optimization_runs(created_at);

CREATE INDEX IF NOT EXISTS idx_optimized_orders_company_id ON optimized_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_optimized_orders_run_id ON optimized_orders(optimization_run_id);
CREATE INDEX IF NOT EXISTS idx_optimized_orders_created_at ON optimized_orders(created_at);

CREATE INDEX IF NOT EXISTS idx_sustainability_metrics_company_id ON sustainability_metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_sustainability_metrics_period ON sustainability_metrics(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_company_id ON analytics_snapshots(company_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_snapshots(snapshot_date);

-- ROW LEVEL SECURITY
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE box_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimized_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Note: In a real Supabase Auth setup, we would link policies to auth.uid().
-- Since Firebase is being used for auth, we'll assume the backend acts as a service role 
-- or custom JWT claims are passed. Here we create permissive policies for the backend to use,
-- or policies assuming a custom claim matching company_id.
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON companies;
CREATE POLICY "Allow full access to authenticated users via service" ON companies FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON users;
CREATE POLICY "Allow full access to authenticated users via service" ON users FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON box_catalog;
CREATE POLICY "Allow full access to authenticated users via service" ON box_catalog FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON products;
CREATE POLICY "Allow full access to authenticated users via service" ON products FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON optimization_runs;
CREATE POLICY "Allow full access to authenticated users via service" ON optimization_runs FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON optimized_orders;
CREATE POLICY "Allow full access to authenticated users via service" ON optimized_orders FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON sustainability_metrics;
CREATE POLICY "Allow full access to authenticated users via service" ON sustainability_metrics FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow full access to authenticated users via service" ON analytics_snapshots;
CREATE POLICY "Allow full access to authenticated users via service" ON analytics_snapshots FOR ALL USING (true);

-- STORAGE BUCKETS (Pseudo-SQL for Supabase Storage)
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('csv-uploads', 'csv-uploads', false) ON CONFLICT DO NOTHING;

-- FUNCTIONS
CREATE OR REPLACE FUNCTION get_company_analytics(p_company_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_savings DECIMAL,
    total_shipments INTEGER,
    optimized_shipments INTEGER,
    co2_reduced DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(total_savings_usd), 0),
        COALESCE(SUM(total_shipments), 0),
        -- Approximation for optimized
        COALESCE(SUM(total_shipments), 0), 
        COALESCE(SUM(co2_reduction_kg), 0)
    FROM optimization_runs
    WHERE company_id = p_company_id 
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_sustainability_score(p_company_id UUID)
RETURNS INTEGER AS $$
DECLARE
    avg_score INTEGER;
BEGIN
    SELECT COALESCE(AVG(eco_score), 0) INTO avg_score
    FROM sustainability_metrics
    WHERE company_id = p_company_id;
    RETURN avg_score;
END;
$$ LANGUAGE plpgsql;

-- SEED DATA (30 box catalog entries)
-- 5 Standard boxes (small/medium/large/XL/XXL)
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Standard S', 'standard', 15.0, 10.0, 10.0, 2.0, 'cardboard', 60, 0.40),
('Standard M', 'standard', 25.0, 20.0, 15.0, 5.0, 'cardboard', 60, 0.70),
('Standard L', 'standard', 40.0, 30.0, 20.0, 10.0, 'cardboard', 55, 1.20),
('Standard XL', 'standard', 50.0, 40.0, 30.0, 20.0, 'cardboard', 50, 1.80),
('Standard XXL', 'standard', 60.0, 50.0, 40.0, 30.0, 'cardboard', 50, 2.50);

-- 5 Heavy Duty boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('HD Small', 'heavy_duty', 20.0, 20.0, 20.0, 15.0, 'corrugated', 45, 1.50),
('HD Medium', 'heavy_duty', 30.0, 30.0, 30.0, 25.0, 'corrugated', 45, 2.20),
('HD Large', 'heavy_duty', 45.0, 40.0, 40.0, 40.0, 'corrugated', 40, 3.50),
('HD XL', 'heavy_duty', 60.0, 50.0, 50.0, 60.0, 'corrugated', 40, 5.00),
('HD Vault', 'heavy_duty', 80.0, 60.0, 60.0, 100.0, 'corrugated', 35, 8.50);

-- 5 Eco/Recycled boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Eco Small', 'eco', 15.0, 15.0, 10.0, 2.0, 'recycled', 95, 0.50),
('Eco Medium', 'eco', 25.0, 20.0, 15.0, 4.0, 'recycled', 90, 0.85),
('Eco Large', 'eco', 35.0, 25.0, 20.0, 8.0, 'recycled', 90, 1.40),
('Eco Shipper', 'eco', 45.0, 35.0, 25.0, 15.0, 'recycled', 85, 2.10),
('Eco Biodegradable', 'eco', 20.0, 20.0, 15.0, 3.0, 'biodegradable', 100, 1.20);

-- 4 Fragile/Foam-lined boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Fragile S', 'fragile', 20.0, 15.0, 15.0, 2.0, 'foam_lined', 30, 2.50),
('Fragile M', 'fragile', 30.0, 25.0, 20.0, 5.0, 'foam_lined', 25, 4.00),
('Fragile L', 'fragile', 45.0, 35.0, 30.0, 10.0, 'foam_lined', 20, 6.50),
('Glass Safe', 'fragile', 25.0, 25.0, 35.0, 5.0, 'foam_lined', 20, 5.50);

-- 3 Mailer boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Poly Mailer S', 'mailer', 25.0, 15.0, 2.0, 1.0, 'plastic', 10, 0.15),
('Kraft Mailer M', 'mailer', 35.0, 25.0, 3.0, 2.0, 'recycled', 85, 0.40),
('Bubble Mailer L', 'mailer', 40.0, 30.0, 5.0, 3.0, 'plastic', 15, 0.75);

-- 3 Flat boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Laptop Box', 'flat', 40.0, 30.0, 6.0, 4.0, 'corrugated', 50, 1.80),
('Book Shipper', 'flat', 30.0, 25.0, 5.0, 3.0, 'cardboard', 60, 0.90),
('Art Print Flat', 'flat', 65.0, 45.0, 4.0, 2.0, 'corrugated', 45, 2.20);

-- 3 Tube/cylinder boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Poster Tube S', 'tube', 60.0, 5.0, 5.0, 1.0, 'cardboard', 60, 1.10),
('Blueprint Tube', 'tube', 90.0, 8.0, 8.0, 2.0, 'corrugated', 50, 1.90),
('Heavy Duty Tube', 'tube', 120.0, 12.0, 12.0, 5.0, 'corrugated', 40, 4.50);

-- 2 Custom specialty boxes
INSERT INTO box_catalog (box_name, box_type, length_cm, width_cm, height_cm, max_weight_kg, material_type, sustainability_score, cost_per_box) VALUES
('Cooler Box (Insulated)', 'custom', 40.0, 30.0, 30.0, 15.0, 'foam_lined', 15, 8.00),
('Wardrobe Box', 'custom', 60.0, 60.0, 120.0, 30.0, 'corrugated', 40, 12.50);