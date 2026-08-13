-- ======================================
-- SHOPVERSE PART 5
-- AUTO-CREATE PROFILE ON SIGNUP
-- ======================================

-- profiles.full_name/email are NOT NULL, so a row must exist the moment
-- Supabase creates the auth.users row. full_name and phone are pulled
-- from the signup call's options.data (see AuthContext.signUp).

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS
$$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;

CREATE TRIGGER trigger_handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ==========================================
-- END OF PART 5
-- ==========================================
