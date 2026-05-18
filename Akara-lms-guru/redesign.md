Saya ingin kamu merombak total tampilan UI/UX project ini agar tidak terlihat seperti hasil “vibe coding”, tetapi seperti aplikasi LMS/SaaS profesional, clean, mature, konsisten, dan siap produksi.

Konteks:
Saat ini tampilan project masih terasa generik, kurang matang secara visual, spacing belum konsisten, hierarchy belum kuat, beberapa komponen terlihat seperti hasil generate cepat, dan style antar halaman belum terasa sebagai satu produk yang solid.

Saya ingin mempertahankan fungsi yang sudah ada, tetapi merombak struktur UI, design system, komponen, layout, dan interaction agar seluruh aplikasi terlihat lebih profesional dan konsisten.

Stack yang harus digunakan:
- Next.js
- TypeScript jika project sudah menggunakannya
- Tailwind CSS
- shadcn/ui
- Radix UI primitives jika dibutuhkan
- class-variance-authority atau cva untuk variant component
- clsx dan tailwind-merge untuk class management
- lucide-react untuk icon
- motion/framer-motion untuk micro interaction ringan
- Storybook jika project memungkinkan, minimal siapkan struktur komponennya agar mudah dibuat Storybook nanti

Tugas utama:

1. Audit struktur project terlebih dahulu.
   - Pahami struktur routing, layout, page, komponen, data dummy/API, state management, dan flow aplikasi.
   - Identifikasi halaman-halaman utama seperti auth, dashboard, modul, kelas, siswa, guru, kuis, tugas, review, profile, settings, dan halaman lain yang ada di project.
   - Jangan langsung menghapus logic, route, API call, fetch data, atau business logic yang sudah berjalan.
   - Buat rencana refactor singkat sebelum implementasi.

2. Buat design system internal.
   - Definisikan ulang token warna, typography, radius, shadow, border, spacing, dan layout scale.
   - Gunakan warna yang profesional: background netral, surface putih/soft, text navy/slate, primary indigo/violet yang tidak terlalu neon.
   - Kurangi gradient berlebihan.
   - Hindari shadow besar.
   - Hindari border warna mencolok di semua komponen.
   - Buat visual hierarchy yang jelas untuk title, subtitle, body text, label, angka, status, table content, form helper text, dan action button.
   - Pastikan seluruh halaman terasa berasal dari satu sistem desain yang sama.

3. Custom komponen shadcn/ui.
   - Jangan gunakan tampilan default mentah-mentah.
   - Jadikan shadcn/ui sebagai base component, lalu custom agar sesuai dengan identitas visual project.
   - Buat atau rapikan komponen reusable seperti:
     - AppShell
     - AppSidebar
     - AppHeader
     - PageShell
     - PageHeader
     - SectionCard
     - DataTable
     - FormField
     - StatusBadge
     - EmptyState
     - LoadingState
     - ErrorState
     - ConfirmDialog
     - ActionMenu
     - SearchInput
     - FilterBar
     - Pagination
     - Breadcrumbs
     - UserMenu
   - Gunakan cva untuk variant button, badge, card, input, status, dan komponen lain jika dibutuhkan.
   - Gunakan clsx/tailwind-merge agar class Tailwind tetap rapi.

4. Redesign layout aplikasi secara menyeluruh.
   - Buat layout utama aplikasi lebih modern, solid, dan mudah digunakan.
   - Sidebar/navigation harus rapi, konsisten, dan mudah dibaca.
   - Header/topbar harus clean, compact, dan informatif.
   - Setiap halaman harus punya page header yang jelas.
   - Gunakan spacing yang konsisten antar section.
   - Pastikan konten utama memiliki max-width yang nyaman.
   - Jangan membuat halaman terasa seperti landing page jika itu halaman aplikasi internal.
   - Fokus pada produktivitas user, bukan dekorasi berlebihan.

5. Perbaiki visual pada elemen global berikut:

   Navigation:
   - Logo lebih rapi.
   - Active state lebih elegan.
   - Icon dan label sejajar.
   - Spacing antar menu konsisten.
   - Group menu jika diperlukan.
   - Tambahkan user area/profile/logout yang rapi.
   - Mobile navigation harus nyaman digunakan.

   Card:
   - Card harus punya struktur jelas.
   - Gunakan padding, border, radius, dan shadow secara konsisten.
   - Jangan semua card terlihat sama tanpa hierarchy.
   - Hindari card yang terlalu kosong atau terlalu ramai.

   Table:
   - Header table harus clean.
   - Row spacing nyaman.
   - Status badge rapi.
   - Action menu jelas.
   - Empty state tersedia jika data kosong.
   - Loading state tersedia jika data sedang dimuat.
   - Mobile harus bisa horizontal scroll atau berubah menjadi list card jika lebih cocok.

   Form:
   - Label, input, helper text, error message, dan validation state harus jelas.
   - Gunakan spacing yang nyaman.
   - Buat form mudah dipahami.
   - Button submit dan cancel harus jelas.
   - Jangan membuat form terlalu padat.

   Button:
   - Buat hierarchy button jelas: primary, secondary, outline, ghost, destructive.
   - Gunakan ukuran button konsisten.
   - Icon button harus punya aria-label.
   - Loading state button harus tersedia jika diperlukan.

   Badge dan Status:
   - Gunakan warna status yang konsisten.
   - Status seperti active, draft, pending, completed, failed, reviewed, dan archived harus mudah dibedakan.
   - Jangan gunakan warna terlalu mencolok.

   Empty, Loading, dan Error State:
   - Setiap halaman penting harus punya empty state yang informatif.
   - Loading state jangan hanya spinner kosong jika konteksnya kompleks.
   - Error state harus memberi pesan jelas dan action jika memungkinkan.

6. Perbaiki responsive design.
   - Desktop: layout luas, sidebar/topbar stabil, konten mudah dibaca.
   - Tablet: grid menyesuaikan, sidebar bisa collapse jika perlu.
   - Mobile: navigation menjadi drawer/bottom nav jika cocok.
   - Card menjadi 1 kolom.
   - Table bisa horizontal scroll atau berubah menjadi list.
   - Form tetap nyaman digunakan di layar kecil.
   - Jangan ada overflow horizontal yang tidak disengaja.

7. Tambahkan micro interaction secukupnya.
   - Gunakan motion/framer-motion untuk:
     - fade-in halaman
     - hover card yang halus
     - dropdown/menu transition
     - dialog transition
     - active navigation transition
     - loading/progress animation ringan
   - Jangan berlebihan.
   - Animasi harus mendukung UX, bukan hanya dekorasi.

8. Aksesibilitas dan UX.
   - Pastikan kontras teks bagus.
   - Gunakan semantic HTML.
   - Button, menu, dropdown, dialog, tabs, dan form harus bisa diakses keyboard.
   - Gunakan aria-label pada icon button.
   - Jangan menghapus focus state.
   - Pastikan font size nyaman dibaca.
   - Jangan membuat UI yang hanya bagus secara visual tetapi sulit digunakan.

9. Jangan merusak logic.
   - Pertahankan data, route, action, API call, state, dan integrasi yang sudah ada.
   - Jika ada data dummy, boleh dirapikan strukturnya tetapi jangan hilangkan informasi penting.
   - Jika ada fetching dari API, tetap gunakan.
   - Jangan mengubah API contract tanpa alasan kuat.
   - Jika perlu refactor, lakukan bertahap.
   - Jangan hapus fitur lama tanpa konfirmasi.

10. Struktur file yang diharapkan.
   Rapikan struktur komponen jika sesuai dengan project. Contoh struktur yang disarankan:

   components/
     layout/
       app-shell.tsx
       app-sidebar.tsx
       app-header.tsx
       mobile-nav.tsx
       user-menu.tsx

     shared/
       page-shell.tsx
       page-header.tsx
       section-card.tsx
       status-badge.tsx
       empty-state.tsx
       loading-state.tsx
       error-state.tsx
       confirm-dialog.tsx
       action-menu.tsx
       search-input.tsx
       filter-bar.tsx
       pagination.tsx
       breadcrumbs.tsx

     data-display/
       data-table.tsx
       table-toolbar.tsx
       table-empty-state.tsx

     forms/
       form-field.tsx
       form-section.tsx
       submit-button.tsx

     ui/
       gunakan komponen shadcn/ui yang sudah ada atau tambahkan jika belum ada

   lib/
     utils.ts
     design-tokens.ts jika diperlukan

11. Kriteria hasil akhir:
   - Seluruh aplikasi terlihat seperti produk LMS/SaaS profesional.
   - Tidak terlihat seperti template AI generik.
   - Tidak terlalu ramai.
   - Lebih clean, luas, modern, dan mudah dibaca.
   - Design system konsisten di semua halaman.
   - Komponen reusable dan mudah dikembangkan.
   - Responsive desktop, tablet, dan mobile.
   - Tidak ada fungsi lama yang rusak.
   - Tidak ada class Tailwind yang berantakan tanpa pola.
   - Tidak ada gradient/warna neon berlebihan.
   - Tidak ada shadow besar yang membuat UI terlihat murahan.
   - Tidak ada komponen yang memakai style berbeda-beda tanpa alasan.

Referensi style:
Saya ingin style yang clean, akademik, modern, profesional, dan premium seperti aplikasi SaaS/LMS yang serius. Fokus pada readability, consistency, spacing, hierarchy, dan usability.

Hindari tampilan “vibe coding” seperti:
- card terlalu banyak tanpa hierarchy
- border warna mencolok di semua elemen
- gradient berlebihan
- shadow besar
- icon dekoratif yang tidak konsisten
- spacing acak
- font size tidak konsisten
- komponen shadcn default tanpa custom
- layout yang terlihat seperti hasil generate cepat

Mulai dengan:
1. Audit project dan jelaskan file/area mana saja yang perlu diubah.
2. Jelaskan rencana refactor singkat.
3. Buat atau rapikan design system.
4. Implementasikan perubahan secara bertahap.
5. Pastikan tidak merusak logic yang sudah ada.
6. Jalankan lint/build jika memungkinkan.
7. Setelah selesai, berikan ringkasan perubahan dan cara menjalankan/testing.