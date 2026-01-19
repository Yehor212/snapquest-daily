# Storage Bucket Fix

Storage bucket "photos" must exist in Supabase for photo uploads to work.

## Option 1: Create via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **New bucket**
5. Create bucket with these settings:
   - Name: `photos`
   - Public bucket: **ON** (checked)
6. Repeat for `avatars` bucket:
   - Name: `avatars`
   - Public bucket: **ON** (checked)

## Option 2: Run SQL in SQL Editor

Go to **SQL Editor** in Supabase Dashboard and run:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies (drop first to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;

CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Avatars policies
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;

CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

SELECT 'Storage buckets configured!' as status;
```

## Verify Storage Setup

After creating buckets, check:

1. Go to **Storage** in dashboard
2. You should see `photos` and `avatars` buckets
3. Click on a bucket
4. Go to **Policies** tab
5. Verify policies are listed

## Troubleshooting

If uploads still fail:

1. **Check browser console** for detailed error messages
2. **Verify user is logged in** - upload requires authentication
3. **Check RLS policies** - make sure authenticated users can INSERT

Common errors:
- `Bucket not found` - bucket doesn't exist, create it
- `row-level security` - RLS policy is blocking, check policies
- `User not authenticated` - user needs to log in first
