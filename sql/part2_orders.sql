-- ==========================================
-- SHOPVERSE DATABASE SCHEMA (PART 2)
-- ==========================================

-- ===========================
-- SHIPPING ADDRESSES
-- ===========================

CREATE TABLE shipping_addresses (

    address_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    phone VARCHAR(15) NOT NULL,

    address_line1 TEXT NOT NULL,

    address_line2 TEXT,

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100) NOT NULL,

    postal_code VARCHAR(20) NOT NULL,

    country VARCHAR(100) DEFAULT 'India',

    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_address_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- ===========================
-- ORDERS
-- ===========================

CREATE TABLE orders (

    order_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL,

    address_id BIGINT NOT NULL,

    total_amount NUMERIC(10,2) NOT NULL,

    discount NUMERIC(10,2) DEFAULT 0,

    shipping_charge NUMERIC(10,2) DEFAULT 0,

    final_amount NUMERIC(10,2) NOT NULL,

    order_status VARCHAR(30)
    DEFAULT 'Pending'
    CHECK(order_status IN
    (
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Delivered',
        'Cancelled'
    )),

    payment_status VARCHAR(30)
    DEFAULT 'Pending'
    CHECK(payment_status IN
    (
        'Pending',
        'Paid',
        'Failed',
        'Refunded'
    )),

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_order_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id),

    CONSTRAINT fk_order_address
    FOREIGN KEY(address_id)
    REFERENCES shipping_addresses(address_id)
);

-- ===========================
-- ORDER ITEMS
-- ===========================

CREATE TABLE order_items (

    order_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    quantity INTEGER NOT NULL CHECK(quantity>0),

    price NUMERIC(10,2) NOT NULL,

    subtotal NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_orderitem_order
    FOREIGN KEY(order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_orderitem_product
    FOREIGN KEY(product_id)
    REFERENCES products(product_id)
);

-- ===========================
-- PAYMENTS
-- ===========================

CREATE TABLE payments (

    payment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id BIGINT UNIQUE NOT NULL,

    payment_method VARCHAR(30)
    CHECK(payment_method IN
    (
        'UPI',
        'Card',
        'COD',
        'NetBanking',
        'Wallet'
    )),

    transaction_id VARCHAR(200),

    payment_status VARCHAR(30)
    DEFAULT 'Pending'
    CHECK(payment_status IN
    (
        'Pending',
        'Success',
        'Failed',
        'Refunded'
    )),

    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_payment_order
    FOREIGN KEY(order_id)
    REFERENCES orders(order_id)
    ON DELETE CASCADE
);

-- ===========================
-- REVIEWS
-- ===========================

CREATE TABLE reviews (

    review_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    product_id BIGINT NOT NULL,

    user_id UUID NOT NULL,

    rating INTEGER
    CHECK(rating BETWEEN 1 AND 5),

    review TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_review_product
    FOREIGN KEY(product_id)
    REFERENCES products(product_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_review_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- ===========================
-- COUPONS
-- ===========================

CREATE TABLE coupons (

    coupon_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    code VARCHAR(30) UNIQUE NOT NULL,

    description TEXT,

    discount_percent INTEGER
    CHECK(discount_percent BETWEEN 1 AND 100),

    minimum_order NUMERIC(10,2),

    max_discount NUMERIC(10,2),

    expiry_date DATE,

    is_active BOOLEAN DEFAULT TRUE
);

-- ===========================
-- COUPON USAGE
-- ===========================

CREATE TABLE coupon_usage (

    usage_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    coupon_id BIGINT NOT NULL,

    user_id UUID NOT NULL,

    order_id BIGINT,

    used_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_usage_coupon
    FOREIGN KEY(coupon_id)
    REFERENCES coupons(coupon_id)
    ON DELETE CASCADE,

    CONSTRAINT fk_usage_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_usage_order
    FOREIGN KEY(order_id)
    REFERENCES orders(order_id)
);

-- ===========================
-- NOTIFICATIONS
-- ===========================

CREATE TABLE notifications (

    notification_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID NOT NULL,

    title VARCHAR(200),

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_notification_user
    FOREIGN KEY(user_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- ==========================================
-- END OF PART 2
-- ==========================================
