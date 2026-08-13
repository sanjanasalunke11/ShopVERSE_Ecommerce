-- ==========================================
-- SHOPVERSE DATABASE SCHEMA (PART 0)
-- PROFILES
-- ==========================================

create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    email text unique not null,
    phone text,
    role text not null default 'customer'
        check (role in ('customer', 'admin')),
    created_at timestamptz default now()
);
