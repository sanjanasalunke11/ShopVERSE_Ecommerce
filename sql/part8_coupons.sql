-- ======================================
-- SHOPVERSE PART 8
-- SAMPLE COUPON (powers the promo banner on the homepage)
-- ======================================

INSERT INTO coupons (code, description, discount_percent, minimum_order, max_discount, expiry_date, is_active)
VALUES ('WELCOME10', 'Welcome offer for new shoppers', 10, 999.00, 500.00, CURRENT_DATE + INTERVAL '90 days', true)
ON CONFLICT (code) DO NOTHING;

-- ==========================================
-- END OF PART 8
-- ==========================================
