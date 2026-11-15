CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT false;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon, authenticated;