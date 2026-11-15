DROP POLICY IF EXISTS documents_owner_insert ON storage.objects;
DROP POLICY IF EXISTS documents_owner_select ON storage.objects;
DROP POLICY IF EXISTS documents_owner_update ON storage.objects;
DROP POLICY IF EXISTS documents_owner_delete ON storage.objects;
CREATE POLICY documents_owner_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY documents_owner_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));
CREATE POLICY documents_owner_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY documents_owner_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin()));