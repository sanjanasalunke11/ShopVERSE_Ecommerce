-- ======================================
-- SHOPVERSE PART 9
-- 6 MORE PRODUCTS (prices in INR)
-- ======================================

INSERT INTO products (category_id, name, description, sku, brand, price, discount_price, stock, image_url)
SELECT category_id, 'Laptop Backpack', 'Water-resistant backpack with a padded laptop sleeve.',
  'ELEC-BAG-001', 'Voyager', 1999.00, 1599.00, 35,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
FROM categories WHERE name = 'Electronics'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Round Sunglasses', 'Retro round-frame sunglasses with UV-protected lenses.',
  'FASH-SUN-001', 'Urbanwear', 899.00, 45,
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'
FROM categories WHERE name = 'Fashion'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, discount_price, stock, image_url)
SELECT category_id, 'Woven Tote Handbag', 'Structured woven handbag with a leather trim.',
  'FASH-BAG-001', 'Urbanwear', 1499.00, 1199.00, 25,
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600'
FROM categories WHERE name = 'Fashion'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Cotton Pillow', 'Soft cotton-cased pillow for everyday comfort.',
  'HOME-PIL-001', 'Claybrook', 499.00, 50,
  'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600'
FROM categories WHERE name = 'Home & Living'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Scandi Accent Chair', 'Minimalist accent chair with a solid wood base.',
  'HOME-CHR-001', 'Claybrook', 3499.00, 12,
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600'
FROM categories WHERE name = 'Home & Living'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Enamel Camp Mug', 'Durable enamel mug for coffee, tea, or camping trips.',
  'HOME-MUG-001', 'Claybrook', 349.00, 70,
  'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=600'
FROM categories WHERE name = 'Home & Living'
ON CONFLICT (sku) DO NOTHING;

-- matching inventory rows so trigger_reduce_inventory has something to decrement
INSERT INTO inventory (product_id, quantity, warehouse_location)
SELECT product_id, stock, 'MAIN-WH'
FROM products
WHERE sku IN ('ELEC-BAG-001', 'FASH-SUN-001', 'FASH-BAG-001', 'HOME-PIL-001', 'HOME-CHR-001', 'HOME-MUG-001')
ON CONFLICT (product_id) DO NOTHING;

-- ==========================================
-- END OF PART 9
-- ==========================================
