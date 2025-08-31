# BC Wash Sukarame – Web App

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/abamakbar07s-projects/v0-bc-wash-sukarame-prototype)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Y7J21yi0aXA)

> Aplikasi web untuk layanan cuci kendaraan (mobil/motor) BC Wash Sukarame. Pelanggan dapat memilih layanan dan melakukan booking, upload bukti pembayaran, serta melacak status. Admin memiliki panel untuk mengelola layanan, cabang, booking, laporan, dan loyalti.

## Fitur Utama

- Halaman promosi dan layanan untuk pelanggan
- Alur booking multi-step: pilih layanan, cabang & waktu, data pelanggan, pembayaran, upload bukti, konfirmasi
- Upload bukti pembayaran ke penyimpanan (Supabase Storage)
- Notifikasi WhatsApp (buka chat dengan template pesan status)
- Panel Admin: login demo, dashboard, booking, layanan, cabang, laporan, loyalti
- Integrasi peta (Google Maps API) untuk cakupan penjemputan/penentuan lokasi cabang

## Teknologi yang Digunakan

- Framework: Next.js 15 (App Router) + React 19 + TypeScript
- UI & Styling: Tailwind CSS v4, shadcn/ui (Radix UI), Lucide Icons, Geist font
- State & Forms: React Hook Form, Zod (validasi), Date-fns
- Charts & Komponen: Recharts, Embla Carousel, Radix Primitives
- Backend/API: Next.js Route Handlers (`app/api/*`)
- Database & Storage: Supabase (Postgres + Storage) via `@supabase/ssr` dan `@supabase/supabase-js`
- Deployment: Vercel

Catatan: Bila environment Supabase tidak diatur, klien server Supabase menggunakan fallback stub sehingga aplikasi tetap berjalan namun data bersifat kosong/mock.

## Prasyarat

- Node.js 18 atau 20 (LTS)
- Paket manager: pnpm (disarankan) atau npm

## Menjalankan Secara Lokal

1. Instal dependensi
   - pnpm: `pnpm install`
   - atau npm: `npm install`
2. Salin environment lokal
   - Buat file `.env.local` di root project
   - Isi variabel berikut (lihat bagian Environment):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Jalankan dev server
   - pnpm: `pnpm dev`
   - atau npm: `npm run dev`
4. Buka `http://localhost:3000`

## Environment Variables

Tambahkan variabel berikut ke `.env.local` (jangan commit file ini):

```
# Supabase (wajib untuk data persist)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps (untuk peta & cakupan penjemputan)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Opsional (lanjutan, jika diperlukan di sisi server)
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

Tambahan (opsional, untuk koneksi Postgres tingkat lanjut) dapat ditambahkan sesuai kebutuhan: `POSTGRES_URL`, `POSTGRES_USER`, dll. Aplikasi ini pada dasarnya mengakses Supabase via URL & ANON KEY.

## Setup Supabase (Ringkas)

- Buat project di Supabase, salin `Project URL` dan `anon public key` ke `.env.local`
- Buat Storage Bucket bernama `payment-proofs` (public) untuk menampung bukti pembayaran
- Buat tabel sesuai kebutuhan modul (mis. `services`, `bookings`, `branches`, `customers`). Endpoint di `app/api/*` mengasumsikan tabel tersebut tersedia.

> Pengembangan awal dapat dijalankan tanpa Supabase (fallback mock), namun data tidak persisten.

## Deploy ke Vercel

1. Push repository ini ke GitHub/GitLab/Bitbucket
2. Import repository ke Vercel (Framework preset: Next.js)
3. Di Vercel Project Settings → Environment Variables, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - (opsional) `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`
4. Build settings (default Vercel untuk Next.js sudah sesuai):
   - Install Command: `pnpm install`
   - Build Command: `pnpm build`
   - Output: (Next.js default)
5. Deploy. Aplikasi akan otomatis terbuild setiap kali ada push ke branch yang dipilih

URL Vercel Project: https://vercel.com/abamakbar07s-projects/v0-bc-wash-sukarame-prototype

## Struktur Proyek (Ringkas)

- `app/` — App Router (pages, layout, API routes)
- `components/` — Komponen UI (shadcn/ui, admin, booking, customer)
- `lib/` — Utilitas (Supabase client, utils, dummy data, WhatsApp helper)
- `public/` — Aset publik
- `styles/` — Styling tambahan

## Scripts

- `pnpm dev` — Jalankan dev server
- `pnpm build` — Build untuk produksi
- `pnpm start` — Jalankan build produksi
- `pnpm lint` — Linting (non-blocking di build config)

## Catatan & Keamanan

- Jangan commit kredensial rahasia (`.env.local`) ke repository publik
- Pastikan Storage Bucket Supabase `payment-proofs` tersedia untuk fitur upload
- Login Admin demo (local/dev): username `admin`, password `bcwash2024` (untuk produksi ganti ke mekanisme auth yang aman)

---

Project ini awalnya dibuat dan disinkronkan via [v0.app](https://v0.app). Anda tetap bisa melanjutkan pengembangan langsung di repo ini maupun melalui antarmuka v0.

