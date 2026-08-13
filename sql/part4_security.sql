-- ======================================
-- SHOPVERSE PART 4
-- ROW LEVEL SECURITY
-- ======================================

-------------------------
-- ADMIN CHECK HELPER
-------------------------
-- SECURITY DEFINER: runs as the function owner (bypasses RLS on profiles),
-- so checking role here does not recurse into the profiles policies below.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-------------------------
-- ENABLE RLS
-------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-------------------------
-- PROFILES
-------------------------

CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-------------------------
-- CATEGORIES (public catalog)
-------------------------

CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_write_admin" ON categories
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-------------------------
-- PRODUCTS (public catalog)
-------------------------

CREATE POLICY "products_select_all" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_write_admin" ON products
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE USING (is_admin());

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE USING (is_admin());

-------------------------
-- PRODUCT IMAGES (public catalog)
-------------------------

CREATE POLICY "product_images_select_all" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "product_images_write_admin" ON product_images
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-------------------------
-- INVENTORY (internal, admin only)
-------------------------

CREATE POLICY "inventory_admin_only" ON inventory
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-------------------------
-- CART
-------------------------

CREATE POLICY "cart_owner" ON cart
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-------------------------
-- CART ITEMS (via parent cart ownership)
-------------------------

CREATE POLICY "cart_items_owner" ON cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM cart WHERE cart.cart_id = cart_items.cart_id AND cart.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM cart WHERE cart.cart_id = cart_items.cart_id AND cart.user_id = auth.uid())
  );

-------------------------
-- WISHLIST
-------------------------

CREATE POLICY "wishlist_owner" ON wishlist
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-------------------------
-- SHIPPING ADDRESSES
-------------------------

CREATE POLICY "shipping_addresses_owner" ON shipping_addresses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-------------------------
-- ORDERS
-------------------------

CREATE POLICY "orders_select_own_or_admin" ON orders
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "orders_insert_own" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin" ON orders
  FOR UPDATE USING (is_admin());

-------------------------
-- ORDER ITEMS (via parent order ownership)
-------------------------

CREATE POLICY "order_items_select_own_or_admin" ON order_items
  FOR SELECT USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM orders WHERE orders.order_id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_own" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.order_id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-------------------------
-- PAYMENTS (via parent order ownership)
-------------------------

CREATE POLICY "payments_select_own_or_admin" ON payments
  FOR SELECT USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM orders WHERE orders.order_id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "payments_insert_own" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.order_id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "payments_update_admin" ON payments
  FOR UPDATE USING (is_admin());

-------------------------
-- REVIEWS (public read, own write)
-------------------------

CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_own_or_admin" ON reviews
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "reviews_delete_own_or_admin" ON reviews
  FOR DELETE USING (auth.uid() = user_id OR is_admin());

-------------------------
-- COUPONS (public read, admin write)
-------------------------

CREATE POLICY "coupons_select_all" ON coupons
  FOR SELECT USING (true);

CREATE POLICY "coupons_write_admin" ON coupons
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-------------------------
-- COUPON USAGE
-------------------------

CREATE POLICY "coupon_usage_select_own_or_admin" ON coupon_usage
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "coupon_usage_insert_own" ON coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-------------------------
-- NOTIFICATIONS
-------------------------

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_admin" ON notifications
  FOR INSERT WITH CHECK (is_admin());

-------------------------
-- VIEWS: force RLS of underlying tables to apply to the querying user,
-- not the view owner (otherwise a customer could see every profile's
-- full_name and every order via order_summary).
-------------------------

ALTER VIEW product_ratings SET (security_invoker = true);
ALTER VIEW order_summary SET (security_invoker = true);

-- NOTE: dashboard_stats() is not SECURITY DEFINER, so once RLS is enabled
-- its counts/sums will be scoped to whatever the *calling* user can see
-- (e.g. a customer calling it would get their own order/profile counts,
-- not store-wide totals). This is fine for now since only admins have a
-- reason to call it, but it needs to be SECURITY DEFINER + an is_admin()
-- guard before it's wired into an admin dashboard.

-- ==========================================
-- END OF PART 4
-- ==========================================
