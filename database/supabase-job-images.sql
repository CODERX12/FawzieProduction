alter table public.jobs add column image_path text;
create unique index jobs_image_path_idx on public.jobs (image_path) where image_path is not null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('job-images', 'job-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy job_images_published_read on storage.objects for select to anon, authenticated
using (
  bucket_id = 'job-images' and exists (
    select 1 from public.jobs where jobs.image_path = objects.name and jobs.is_published
  )
);
create policy job_images_admin_read on storage.objects for select to authenticated
using (bucket_id = 'job-images' and (select public.is_admin()));
create policy job_images_admin_insert on storage.objects for insert to authenticated
with check (bucket_id = 'job-images' and (select public.is_admin()));
create policy job_images_admin_cleanup on storage.objects for delete to authenticated
using (
  bucket_id = 'job-images' and (select public.is_admin())
  and not exists (select 1 from public.jobs where jobs.image_path = objects.name)
);
