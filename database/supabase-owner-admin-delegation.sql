create schema if not exists fawzie_private;
revoke all on schema fawzie_private from public, anon, authenticated;

create table fawzie_private.recruitment_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null references auth.users(id) on delete restrict
);
alter table fawzie_private.recruitment_owner enable row level security;

do $$
declare owner_id uuid;
begin
  select id into strict owner_id from auth.users
  where lower(email) = lower(current_setting('fawzie.owner_email')) and email_confirmed_at is not null;
  insert into fawzie_private.recruitment_owner (user_id) values (owner_id);
  insert into public.user_roles (user_id, role) values (owner_id, 'admin')
  on conflict (user_id, role) do nothing;
end;
$$;

create function public.can_manage_admins()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from fawzie_private.recruitment_owner where user_id = auth.uid()
  );
$$;
revoke all on function public.can_manage_admins() from public, anon, authenticated;
grant execute on function public.can_manage_admins() to authenticated;

create function public.promote_recruitment_admin(p_email text)
returns boolean language plpgsql security definer set search_path = ''
as $$
declare target_id uuid;
begin
  if not public.can_manage_admins() then
    raise exception 'Only the recruitment owner can grant admin access' using errcode = '42501';
  end if;

  select id into target_id from auth.users
  where lower(email) = lower(btrim(p_email)) and email_confirmed_at is not null;
  if target_id is null then return false; end if;

  insert into public.user_roles (user_id, role) values (target_id, 'admin')
  on conflict (user_id, role) do nothing;
  return true;
end;
$$;
revoke all on function public.promote_recruitment_admin(text) from public, anon, authenticated;
grant execute on function public.promote_recruitment_admin(text) to authenticated;
