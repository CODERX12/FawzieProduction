CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
CREATE POLICY user_roles_admin_read ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  country text NOT NULL DEFAULT 'Kenya',
  job_type text NOT NULL CHECK (job_type IN ('Kenya', 'Overseas')),
  salary_min integer,
  salary_max integer,
  currency text NOT NULL DEFAULT 'KES',
  description text NOT NULL,
  requirements text NOT NULL DEFAULT '',
  employer text NOT NULL DEFAULT 'Confidential',
  posted_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  is_sample boolean NOT NULL DEFAULT false
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY jobs_public_read ON public.jobs FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY jobs_admin_read ON public.jobs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY jobs_admin_insert ON public.jobs FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY jobs_admin_update ON public.jobs FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY jobs_admin_delete ON public.jobs FOR DELETE TO authenticated USING (public.is_admin());

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id uuid,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cover_note text,
  status text NOT NULL DEFAULT 'Received' CHECK (status IN ('Received', 'Reviewing', 'Accepted', 'Rejected')),
  feedback text,
  status_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.applications TO authenticated;
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY applications_anon_insert ON public.applications FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY applications_user_insert ON public.applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY applications_owner_or_admin_read ON public.applications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

CREATE TABLE public.job_seekers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  national_id text,
  skills text,
  experience_years integer,
  preferred_destination text,
  cv_path text,
  passport_path text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Received' CHECK (status IN ('Received', 'Reviewing', 'Accepted', 'Rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.job_seekers TO anon, authenticated;
GRANT SELECT ON public.job_seekers TO authenticated;
GRANT UPDATE (full_name, email, phone, national_id, skills, experience_years, preferred_destination, cv_path, passport_path, consent) ON public.job_seekers TO authenticated;
GRANT ALL ON public.job_seekers TO service_role;
ALTER TABLE public.job_seekers ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_seekers_anon_insert ON public.job_seekers FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY job_seekers_user_insert ON public.job_seekers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY job_seekers_owner_or_admin_read ON public.job_seekers FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY job_seekers_owner_update ON public.job_seekers FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.employer_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  roles text NOT NULL,
  num_workers integer NOT NULL DEFAULT 1,
  location text NOT NULL,
  timeline text,
  notes text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Received' CHECK (status IN ('Received', 'Reviewing', 'Accepted', 'Rejected', 'Fulfilled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.employer_requests TO anon, authenticated;
GRANT SELECT ON public.employer_requests TO authenticated;
GRANT UPDATE (company_name, contact_name, email, phone, roles, num_workers, location, timeline, notes, consent) ON public.employer_requests TO authenticated;
GRANT ALL ON public.employer_requests TO service_role;
ALTER TABLE public.employer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY employer_requests_anon_insert ON public.employer_requests FOR INSERT TO anon WITH CHECK (user_id IS NULL);
CREATE POLICY employer_requests_user_insert ON public.employer_requests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY employer_requests_owner_or_admin_read ON public.employer_requests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY employer_requests_owner_update ON public.employer_requests FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.distress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  country text NOT NULL,
  employer text,
  situation text NOT NULL,
  phone text NOT NULL,
  consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.distress_reports TO anon, authenticated;
GRANT SELECT ON public.distress_reports TO authenticated;
GRANT ALL ON public.distress_reports TO service_role;
ALTER TABLE public.distress_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY distress_reports_public_insert ON public.distress_reports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY distress_reports_admin_read ON public.distress_reports FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  country text NOT NULL,
  quote text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_sample boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY testimonials_public_read ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY testimonials_admin_insert ON public.testimonials FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY testimonials_admin_update ON public.testimonials FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY testimonials_admin_delete ON public.testimonials FOR DELETE TO authenticated USING (public.is_admin());

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_read_own_or_admin ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_admin());
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY site_content_public_read ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_content_admin_insert ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY site_content_admin_update ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY site_content_admin_delete ON public.site_content FOR DELETE TO authenticated USING (public.is_admin());

CREATE TABLE public.application_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL CHECK (new_status IN ('Received', 'Reviewing', 'Accepted', 'Rejected')),
  feedback text,
  changed_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.application_status_history TO authenticated;
GRANT ALL ON public.application_status_history TO service_role;
ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY application_history_owner_or_admin_read ON public.application_status_history FOR SELECT TO authenticated USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.applications WHERE applications.id = application_status_history.application_id AND applications.user_id = auth.uid()));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL DEFAULT 'general',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_owner_read ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY notifications_owner_update ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.update_job_seeker_status(p_id uuid, p_status text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() OR p_status NOT IN ('Received', 'Reviewing', 'Accepted', 'Rejected') THEN RETURN false; END IF;
  UPDATE public.job_seekers SET status = p_status WHERE id = p_id;
  RETURN FOUND;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_job_seeker_status(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_job_seeker_status(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_employer_request_status(p_id uuid, p_status text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin() OR p_status NOT IN ('Received', 'Reviewing', 'Accepted', 'Rejected', 'Fulfilled') THEN RETURN false; END IF;
  UPDATE public.employer_requests SET status = p_status WHERE id = p_id;
  RETURN FOUND;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_employer_request_status(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_employer_request_status(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_application_review(p_application_id uuid, p_status text, p_feedback text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_previous text; v_user_id uuid;
BEGIN
  IF NOT public.is_admin() OR p_status NOT IN ('Received', 'Reviewing', 'Accepted', 'Rejected') THEN RETURN false; END IF;
  SELECT status, user_id INTO v_previous, v_user_id FROM public.applications WHERE id = p_application_id;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE public.applications SET status = p_status, feedback = p_feedback, status_updated_at = now() WHERE id = p_application_id;
  INSERT INTO public.application_status_history (application_id, previous_status, new_status, feedback, changed_by) VALUES (p_application_id, v_previous, p_status, p_feedback, auth.uid());
  IF v_user_id IS NOT NULL THEN INSERT INTO public.notifications (user_id, title, message, notification_type) VALUES (v_user_id, 'Application status updated', 'Your application status is now ' || p_status || '.', 'application_status'); END IF;
  RETURN true;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_application_review(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_application_review(uuid, text, text) TO authenticated;

CREATE INDEX idx_jobs_published ON public.jobs(is_published, posted_at DESC);
CREATE INDEX idx_jobs_type ON public.jobs(job_type);
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_created ON public.applications(created_at DESC);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status_updated ON public.applications(status_updated_at DESC);
CREATE INDEX idx_job_seekers_user_id ON public.job_seekers(user_id);
CREATE INDEX idx_job_seekers_status ON public.job_seekers(status);
CREATE INDEX idx_employer_requests_user_id ON public.employer_requests(user_id);
CREATE INDEX idx_employer_requests_status ON public.employer_requests(status);
CREATE INDEX idx_distress_created ON public.distress_reports(created_at DESC);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_status_history_application ON public.application_status_history(application_id, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);DROP POLICY IF EXISTS documents_owner_insert ON storage.objects;
DROP POLICY IF EXISTS documents_owner_select ON storage.objects;
DROP POLICY IF EXISTS documents_owner_update ON storage.objects;
DROP POLICY IF EXISTS documents_owner_delete ON storage.objects;
CREATE POLICY documents_owner_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY documents_owner_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
CREATE POLICY documents_owner_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY documents_owner_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT false;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon, authenticated;CREATE OR REPLACE FUNCTION public.create_profile_for_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'name', ''),
      ''
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.create_profile_for_auth_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER create_profile_after_auth_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_auth_user();
insert into storage.buckets (id, name, public) values ('documents','documents',false) on conflict (id) do nothing;
revoke insert on public.applications, public.job_seekers, public.employer_requests, public.distress_reports from anon, authenticated;
grant insert (job_id,user_id,full_name,email,phone,cover_note) on public.applications to anon, authenticated;
grant insert (user_id,full_name,email,phone,national_id,skills,experience_years,preferred_destination,cv_path,passport_path,consent) on public.job_seekers to authenticated;
grant insert (user_id,company_name,contact_name,email,phone,roles,num_workers,location,timeline,notes,consent) on public.employer_requests to anon, authenticated;
grant insert (full_name,country,employer,situation,phone,consent) on public.distress_reports to anon, authenticated;
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;
