-- ======================================
-- SHOPVERSE PART 10
-- SWITCH EXISTING PRICES FROM USD TO INR
-- (run once against your already-seeded rows from part6/part8)
-- ======================================

UPDATE products SET price = 2499.00, discount_price = 1899.00 WHERE sku = 'ELEC-HEAD-001';
UPDATE products SET price = 6999.00 WHERE sku = 'ELEC-WATCH-001';
UPDATE products SET price = 1799.00 WHERE sku = 'FASH-JCKT-001';
UPDATE products SET price = 2299.00, discount_price = 1699.00 WHERE sku = 'FASH-SHOE-001';
UPDATE products SET price = 799.00 WHERE sku = 'HOME-VASE-001';
UPDATE products SET price = 1499.00 WHERE sku = 'HOME-LAMP-001';

UPDATE coupons SET minimum_order = 999.00, max_discount = 500.00 WHERE code = 'WELCOME10';

-- ==========================================
-- END OF PART 10
-- ==========================================
