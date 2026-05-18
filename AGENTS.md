Code Style
Gunakan TypeScript.
Gunakan functional React components.
Gunakan komponen reusable.
Jangan menulis logic besar langsung di page component.
Pisahkan komponen UI ke folder components.
Gunakan nama file lowercase dengan dash, contoh: teacher-dashboard.tsx.
Gunakan cn() dari lib/utils.ts untuk merge class Tailwind.
Gunakan shadcn/ui sebagai base, tetapi jangan gunakan style default mentah-mentah.
UI/UX Design Rules

Project ini harus terlihat seperti LMS profesional, bukan hasil vibe coding.

Prinsip desain:

Clean
Modern
Mature
Akademik
Mudah dibaca guru dan siswa
Spacing konsisten
Typography jelas
Warna tidak terlalu neon
Hindari gradient berlebihan
Hindari shadow besar
Hindari border ungu di semua card
Hindari terlalu banyak rounded-2xl tanpa alasan

Gunakan pendekatan design system:

background netral
surface putih atau soft
text slate/navy
primary indigo/violet secukupnya
border subtle
shadow halus
radius konsisten
layout luas dan rapi
Component Rules

Ketika membuat atau merombak halaman, prioritaskan komponen reusable seperti:

AppSidebar
DashboardShell
DashboardHeader
PageTitle
StatCard
SectionCard
DataTable
StatusBadge
ProgressIndicator
EmptyState
QuickActions
ConfirmDialog

Gunakan CVA untuk variant jika komponen memiliki banyak variasi, misalnya button, badge, status, dan card.

Dashboard Rules

Untuk dashboard guru:

Sidebar harus rapi, modern, dan mudah dibaca.
Active menu harus jelas.
Header harus compact dan informatif.
Stat card harus mudah dipahami.
Table harus clean dan nyaman dibaca.
Action utama harus terlihat jelas.
Mobile harus responsive.
Jangan membuat dashboard seperti landing page.
Fokus pada produktivitas guru.
Accessibility
Gunakan semantic HTML.
Pastikan kontras teks cukup.
Button icon harus memiliki aria-label.
Menu/dropdown harus bisa digunakan dengan keyboard.
Jangan menghapus focus state.
Jangan membuat teks terlalu kecil untuk data penting.
Safety Rules
Jangan menghapus logic yang sudah berjalan.
Jangan mengubah API contract tanpa alasan jelas.
Jangan mengganti struktur data besar tanpa menjelaskan dampaknya.
Jangan menghapus file penting tanpa konfirmasi.
Jangan menambahkan dependency baru tanpa menjelaskan alasannya.
Jangan memasukkan secret, token, API key, atau password ke kode.
Before Finishing

Sebelum menyelesaikan tugas:

Jalankan lint jika memungkinkan.
Jalankan build jika perubahan cukup besar.
Periksa responsive desktop dan mobile.
Pastikan tidak ada error TypeScript.
Berikan ringkasan file yang diubah.
Jelaskan perubahan penting secara singkat.