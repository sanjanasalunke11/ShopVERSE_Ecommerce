-- ==========================================
-- SHOPVERSE DATABASE SCHEMA (PART 1)
-- ==========================================

-- ===========================
-- CATEGORIES
-- ===========================

CREATE TABLE categories (
    category_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- PRODUCTS
-- ===========================

CREATE TABLE products (
    product_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    category_id BIGINT NOT NULL,

    name VARCHAR(200) NOT NULL,

    description TEXT,

    sku VARCHAR(50) UNIQUE,

    brand VARCHAR(100),

    price NUMERIC(10,2) NOT NULL,

    discount_price NUMERIC(10,2),

    stock INTEGER DEFAULT 0,

    weight NUMERIC(10,2),

    image_url TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_product_category
    FOREIGN KEY(category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
);

-- ===========================
-- PRODUCT IMAGES
-- ===========================

CREATE TABLE product_images (

    image_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    product_id BIGINT NOT NULL,

    image_url TEXT NOT NULL,

    is_primary BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_product_image
    FOREIGN KEY(product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE
);

-- ===========================
-- INVENTORY
-- ===========================

CREATE TABLE inventory (

    inventory_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    product_id BIGINT UNIQUE NOT NULL,

    quantity INTEGER DEFAULT 0 CHECK(quantity>=0),

    warehouse_location VARCHAR(100),

    last_updated TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_inventory_product
    FOREIGN KEY(product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE
);

-- ===========================
-- CART
-- ===========================

CREATE TABLE cart (

    cart_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_cart_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- ===========================
-- CART ITEMS
-- ===========================

CREATE TABLE cart_items (

    cart_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    cart_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    quantity INTEGER NOT NULL CHECK(quantity>0),

    price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_cartitem_cart
    FOREIGN KEY(cart_id)
    REFERENCES cart(cart_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_cartitem_product
    FOREIGN KEY(product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE
);

-- ===========================
-- WISHLIST
-- ===========================

CREATE TABLE wishlist (

    wishlist_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL,

    product_id BIGINT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_wishlist_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_wishlist_product
    FOREIGN KEY(product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE
);

-- ==========================================
-- END OF PART 1
-- ==========================================
