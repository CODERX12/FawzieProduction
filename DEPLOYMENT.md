# Deploy Fawzie Recruitment

This export includes the latest site and all three dashboards. It uses TanStack Start with server rendering and requires a Git-based deployment or the hosting provider's CLI.

1. Extract the ZIP and push the extracted project to a Git repository.
2. Import that repository in Netlify or Vercel. Use the directory containing package.json as the project root. Use Node.js 22 and npm. The build command is npm run build. Netlify's publish directory is dist. On Vercel, leave the output directory override off.
3. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the host's environment settings before building. Copy the values from the Supabase project dashboard. Use only the publishable API key.
4. Deploy. In Supabase Auth URL Configuration, allow the new site's /admin, /job-seekers, /employers, and /account/reset URLs. If this becomes the primary domain, update the Site URL too. Keep prior redirect URLs if both deployments will be used.
5. Check account confirmation, sign-in, and the dashboards on the new host. To deliver confirmation emails to public users, configure custom SMTP in Supabase.

The existing Supabase project keeps its accounts, roles, records, and private document storage when you point the new host at it. The SQL in database/ is reference material for setup and should not be reapplied to the existing database. The ChatGPT Sites access gate is specific to that platform. Vercel or Netlify will need its own deployment protection if you want the entire site private. The Fawzie account and admin checks still run through Supabase.

For local development, copy .env.example to .env, fill in the publishable key, then run npm ci and npm run dev.

For a new Supabase project only, set the verified owner's email with `SET fawzie.owner_email = 'owner@example.com';` in the same SQL session before running the owner delegation SQL.
