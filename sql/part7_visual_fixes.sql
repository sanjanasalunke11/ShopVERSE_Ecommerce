-- ======================================
-- SHOPVERSE PART 7
-- VISUAL FIXES (run once against your existing rows)
-- ======================================

-- The seeded Table Lamp image URL 404s — replace it.
UPDATE products
SET image_url = 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600'
WHERE sku = 'HOME-LAMP-001';

-- categories.image_url was never populated — add banner images so the
-- category picker on the Home page can show pictures instead of plain text.
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800'
WHERE name = 'Electronics';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
WHERE name = 'Fashion';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800'
WHERE name = 'Home & Living';

-- ==========================================
-- END OF PART 7
-- ==========================================
