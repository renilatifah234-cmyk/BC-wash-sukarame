# Comment Audit Summary

## File yang Disentuh
- README.md
- app/admin/login/page.tsx
- app/api/auth/route.ts
- app/api/bookings/route.ts
- app/api/branches/[id]/route.ts
- app/api/reports/route.ts
- app/api/services/[id]/route.ts
- components/admin/booking-detail-modal.tsx
- components/admin/booking-filters.tsx
- components/admin/booking-list.tsx
- components/admin/booking-stats.tsx
- components/admin/branch-management.tsx
- components/admin/branch-map-picker.tsx
- components/admin/dashboard-stats.tsx
- components/admin/manual-booking-form.tsx
- components/admin/receipt-generator.tsx
- components/admin/revenue-chart.tsx
- components/booking/branch-time-selection.tsx
- components/booking/payment-proof.tsx
- components/booking/pickup-address-input.tsx
- components/customer/contact-info.tsx
- components/error-boundary.tsx
- components/payment-proof-upload.tsx
- components/ui/chart.tsx
- components/ui/error-state.tsx
- components/ui/sidebar.tsx
- hooks/use-toast.ts
- lib/api-client.ts
- lib/dummy-data.ts
- lib/error-utils.ts
- lib/locations.ts
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/supabase/storage.ts
- lib/types.ts
- lib/utils.ts

## Pola AI-ish yang Ditemukan
- "generated booking code" → diganti menjadi penjelasan natural "kode booking yang dibuat".
- Komentar generik seperti "Validate file" atau "Upload area" → diperjelas konteksnya dalam Bahasa Indonesia.

## Pedoman Komentar yang Diterapkan
- Gunakan Bahasa Indonesia, singkat dan fokus pada alasan/aturan bisnis.
- Hindari frasa generatif seperti "This code", "we will", atau nada dokumentasi AI.
- Tambahkan komentar hanya pada bagian yang tidak obvious: normalisasi plat, radius pickup, token/cookie, dll.
- Hapus komentar redundan atau placeholder yang tidak relevan.
