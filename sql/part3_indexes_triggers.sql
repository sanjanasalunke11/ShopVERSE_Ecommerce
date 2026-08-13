-- ======================================
-- SHOPVERSE PART 3
-- INDEXES + UPDATED_AT TRIGGER
-- ======================================

-------------------------
-- INDEXES
-------------------------

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_products_name
ON products(name);

CREATE INDEX idx_orders_user
ON orders(user_id);

CREATE INDEX idx_order_items_order
ON order_items(order_id);

CREATE INDEX idx_reviews_product
ON reviews(product_id);

CREATE INDEX idx_cart_user
ON cart(user_id);

CREATE INDEX idx_cart_items_cart
ON cart_items(cart_id);

CREATE INDEX idx_notifications_user
ON notifications(user_id);

-------------------------
-- UPDATE TIMESTAMP FUNCTION
-------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-------------------------
-- PRODUCTS
-------------------------

CREATE TRIGGER trigger_products_updated_at

BEFORE UPDATE
ON products

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();

-------------------------
-- PROFILES
-------------------------

CREATE TRIGGER trigger_profiles_updated_at

BEFORE UPDATE
ON profiles

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();

-------------------------
-- CART
-------------------------

CREATE TRIGGER trigger_cart_updated_at

BEFORE UPDATE
ON cart

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();

-------------------------
-- ORDERS
-------------------------

CREATE TRIGGER trigger_orders_updated_at

BEFORE UPDATE
ON orders

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION reduce_inventory()
RETURNS TRIGGER AS
$$
BEGIN

UPDATE inventory

SET quantity = quantity - NEW.quantity

WHERE product_id = NEW.product_id;

RETURN NEW;

END;

$$

LANGUAGE plpgsql;

CREATE TRIGGER trigger_reduce_inventory

AFTER INSERT

ON order_items

FOR EACH ROW

EXECUTE FUNCTION reduce_inventory();

CREATE VIEW product_ratings AS

SELECT

p.product_id,

p.name,

ROUND(AVG(r.rating),2) AS average_rating,

COUNT(r.review_id) AS total_reviews

FROM products p

LEFT JOIN reviews r

ON p.product_id = r.product_id

GROUP BY p.product_id,p.name;

CREATE VIEW order_summary AS

SELECT

o.order_id,

p.full_name,

o.final_amount,

o.order_status,

o.payment_status,

o.created_at

FROM orders o

JOIN profiles p

ON o.user_id=p.id;

CREATE OR REPLACE FUNCTION dashboard_stats()

RETURNS TABLE(

total_products BIGINT,

total_orders BIGINT,

total_customers BIGINT,

total_revenue NUMERIC

)

AS
$$

BEGIN

RETURN QUERY

SELECT

(SELECT COUNT(*) FROM products),

(SELECT COUNT(*) FROM orders),

(SELECT COUNT(*) FROM profiles WHERE role='customer'),

COALESCE((SELECT SUM(final_amount)

FROM orders

WHERE payment_status='Paid'),0);

END;

$$

LANGUAGE plpgsql;

-- ==========================================
-- END OF PART 3
-- ==========================================
