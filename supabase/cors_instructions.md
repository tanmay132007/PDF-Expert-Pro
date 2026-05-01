# Supabase Storage CORS Configuration

To allow your application to load PDFs directly from Supabase Storage (required for the PDF Viewer to work), you must set a CORS policy on your bucket.

### 1. The Easy Way (SQL Editor)
Run this SQL in your Supabase SQL Editor to allow your local development server to fetch files:

```sql
-- This enables CORS for your storage buckets
-- Replace '*' with your production URL later for better security
insert into storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
values ('pdfs', 'pdfs', true, '{application/pdf}', 52428800)
on conflict (id) do update set public = true;

-- Note: Supabase UI is usually better for CORS. 
-- Go to: Storage -> Settings -> API -> CORS
```

### 2. The Recommended Way (Supabase UI)
1. Go to your **Supabase Dashboard**.
2. Click **Storage** on the left sidebar.
3. Click **Settings** (bottom left of the storage pane).
4. Look for **CORS Configuration**.
5. Click **Add Column** or edit the existing one.
6. Set the following values:
   - **Allowed Origins:** `*` (or `http://localhost:5173` for local testing)
   - **Allowed Methods:** `GET`, `POST`, `PUT`, `DELETE`
   - **Allowed Headers:** `*`
   - **Max Age:** `3600`
7. Click **Save**.

### 3. Ensure Bucket is PUBLIC
1. In **Storage**, find your `pdfs` bucket.
2. Click the three dots `...` next to the bucket name.
3. Select **Edit Bucket**.
4. Ensure the **"Public bucket"** toggle is **ON**.
5. Click **Save**.

Once these are set, refresh your app and the PDF Viewer will be able to stream your documents perfectly.
