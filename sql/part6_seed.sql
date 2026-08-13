-- ======================================
-- SHOPVERSE PART 6
-- SEED DATA (catalog only — safe to run any time)
-- ======================================

INSERT INTO categories (name, description, image_url) VALUES
  ('Electronics', 'Gadgets and devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800'),
  ('Fashion', 'Clothing and accessories', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'),
  ('Home & Living', 'Décor and household items', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, discount_price, stock, image_url)
SELECT category_id, 'Wireless Headphones', 'Over-ear Bluetooth headphones with noise cancellation.',
  'ELEC-HEAD-001', 'SoundCore', 2499.00, 1899.00, 25,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
FROM categories WHERE name = 'Electronics'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Smart Watch', 'Fitness tracking smart watch with heart-rate monitor.',
  'ELEC-WATCH-001', 'PulseFit', 6999.00, 15,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
FROM categories WHERE name = 'Electronics'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Denim Jacket', 'Classic unisex denim jacket.',
  'FASH-JCKT-001', 'Urbanwear', 1799.00, 40,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'
FROM categories WHERE name = 'Fashion'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, discount_price, stock, image_url)
SELECT category_id, 'Canvas Sneakers', 'Everyday comfortable canvas sneakers.',
  'FASH-SHOE-001', 'Urbanwear', 2299.00, 1699.00, 60,
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600'
FROM categories WHERE name = 'Fashion'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Ceramic Vase', 'Hand-finished ceramic vase for home decor.',
  'HOME-VASE-001', 'Claybrook', 799.00, 30,
  'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600'
FROM categories WHERE name = 'Home & Living'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO products (category_id, name, description, sku, brand, price, stock, image_url)
SELECT category_id, 'Table Lamp', 'Minimalist table lamp with warm lighting.',
  'HOME-LAMP-001', 'Claybrook', 1499.00, 20,
  'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600'
FROM categories WHERE name = 'Home & Living'
ON CONFLICT (sku) DO NOTHING;

-- one inventory row per product, matching its stock, so the
-- trigger_reduce_inventory trigger has something to decrement at checkout
INSERT INTO inventory (product_id, quantity, warehouse_location)
SELECT product_id, stock, 'MAIN-WH'
FROM products
ON CONFLICT (product_id) DO NOTHING;

-- ==========================================
-- END OF PART 6
-- ==========================================
