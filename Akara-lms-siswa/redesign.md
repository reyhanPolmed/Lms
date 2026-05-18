# Global UI/UX Rules

Terapkan rules ini untuk memperbaiki tampilan website apa pun agar tidak terlihat seperti hasil “vibe coding”, tetapi menjadi lebih clean, profesional, konsisten, mudah digunakan, dan siap produksi.

## Tujuan Utama

Perbaiki tampilan UI/UX project ini tanpa mengubah fungsi utama yang sudah berjalan.

Fokus pada:
- visual hierarchy
- spacing
- typography
- layout consistency
- responsive behavior
- accessibility
- interaction polish
- readability
- usability

Jangan melakukan redesign total jika tidak diminta. Utamakan memperbaiki tampilan yang sudah ada agar lebih matang dan konsisten.

## Stack yang harus digunakan:
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

## Prinsip Desain

Gunakan prinsip berikut di seluruh halaman:

- Clean dan modern
- Tidak terlalu ramai
- Spacing konsisten
- Typography jelas
- Warna tidak berlebihan
- Kontras teks nyaman dibaca
- Komponen terlihat satu sistem
- Layout stabil di berbagai ukuran layar
- Aksi utama mudah ditemukan
- Tidak memakai dekorasi berlebihan

Hindari tampilan “vibe coding” seperti:
- gradient berlebihan
- shadow terlalu besar
- border warna mencolok di semua elemen
- card terlalu banyak tanpa hierarchy
- spacing acak
- font size tidak konsisten
- icon terlalu besar atau tidak seragam
- layout terlihat seperti hasil generate cepat
- komponen default library yang belum disesuaikan
- terlalu banyak efek hover/animasi

## Aturan Penting

Jangan membuat komponen baru kecuali diminta secara eksplisit.

Jangan menambah:
- file komponen baru
- folder komponen baru
- route baru
- page baru
- layout baru
- dependency baru
- Storybook
- design token file baru
- utility baru
- abstraction baru

Gunakan dan rapikan komponen yang sudah ada.

Jika menemukan kebutuhan komponen baru, jangan langsung membuatnya. Cukup beri catatan rekomendasi setelah pekerjaan selesai.

## Audit Sebelum Mengubah

Sebelum mengubah kode:
1. Pahami struktur project.
2. Cari file yang terkait langsung dengan halaman atau area yang diminta.
3. Pahami layout, komponen, styling, state, dan logic yang sudah ada.
4. Jangan menghapus logic, route, API call, data, atau fungsi yang sudah berjalan.
5. Buat perubahan seminimal mungkin tetapi berdampak jelas pada UI/UX.

## Styling

Ikuti stack dan styling method yang sudah digunakan project.

Jika project menggunakan Tailwind:
- rapikan class yang berlebihan
- kurangi padding/margin yang terlalu besar
- gunakan spacing konsisten
- gunakan warna yang lebih netral dan profesional
- gunakan class responsive dengan benar
- hindari class arbitrary berlebihan jika tidak perlu

Jika project menggunakan CSS biasa, CSS module, SCSS, atau UI library lain:
- ikuti pola yang sudah ada
- jangan mengganti sistem styling tanpa instruksi
- jangan mencampur banyak pendekatan styling baru

## Layout

Perbaiki layout agar lebih proporsional.

Pastikan:
- container tidak terlalu lebar atau terlalu sempit
- padding halaman tidak berlebihan
- section spacing konsisten
- konten utama mudah dibaca
- tidak ada horizontal overflow yang tidak disengaja
- layout tetap rapi di desktop, tablet, dan mobile
- tinggi card/section mengikuti konten, bukan fixed height berlebihan

Hindari:
- `height` atau `min-height` besar tanpa alasan
- `width` fixed besar yang membuat overflow
- padding seperti `p-10`, `p-12`, `py-12` kecuali benar-benar perlu
- gap terlalu besar seperti `gap-10` atau `gap-12`
- layout yang hanya bagus di satu ukuran layar

## Typography

Rapikan typography agar hierarchy lebih jelas.

Pastikan:
- heading jelas dan tidak terlalu besar
- body text mudah dibaca
- label tidak terlalu kecil
- line-height nyaman
- font weight tidak berlebihan
- teks penting lebih menonjol
- teks sekunder tetap terbaca

Gunakan hierarchy yang konsisten:
- page title
- section title
- card title
- body text
- helper text
- metadata
- error text

## Warna

Gunakan warna dengan lebih dewasa dan konsisten.

Pastikan:
- warna utama tidak terlalu neon
- background netral
- surface/card bersih
- text color punya kontras baik
- warna status konsisten
- warna destructive tidak terlalu dominan kecuali diperlukan

Hindari:
- terlalu banyak warna dalam satu halaman
- gradient mencolok
- border warna terang di semua elemen
- shadow berwarna berlebihan

## Card dan Section

Perbaiki card/section yang sudah ada, jangan membuat komponen card baru.

Pastikan:
- padding cukup tapi tidak berlebihan
- radius konsisten
- border halus
- shadow subtle
- isi card punya hierarchy jelas
- card tidak terlalu kosong
- card tidak terlalu ramai
- card tidak memiliki tinggi fixed yang tidak perlu

## Navigation

Jika ada navigation/sidebar/header:
- rapikan active state
- sejajarkan icon dan label
- gunakan spacing konsisten
- jangan membuat icon terlalu besar
- jangan mencampur banyak style icon
- pastikan menu mudah dibaca
- pastikan responsive di layar kecil
- jangan membuat navigation baru jika sudah ada

## Table dan List

Jika ada table/list:
- rapikan header
- rapikan spacing row
- pastikan action tidak membuat layout rusak
- gunakan overflow horizontal jika tabel lebar
- jangan memaksa semua tombol tampil jika membuat row berantakan
- gunakan pola action yang sudah ada di project
- jangan membuat DataTable baru jika belum ada

## Form

Jika ada form:
- label harus jelas
- input nyaman digunakan
- helper text dan error message terbaca
- spacing antar field konsisten
- button submit/cancel jelas
- jangan membuat form terlalu padat
- jangan membuat komponen form baru jika belum ada

## Button dan Action

Pastikan button punya hierarchy:
- primary untuk aksi utama
- secondary/outline untuk aksi pendukung
- ghost untuk aksi ringan
- destructive untuk aksi berbahaya

Pastikan:
- ukuran button konsisten
- icon button punya label aksesibilitas
- hover/focus state terlihat
- loading/disabled state tetap jelas jika sudah ada

## Icon

Gunakan icon secara konsisten.

Aturan:
- jangan mencampur banyak icon family jika tidak perlu
- ukuran icon konsisten
- stroke icon tidak terlalu tebal
- warna icon tidak terlalu mencolok
- icon harus sesuai konteks
- icon dekoratif jangan berlebihan

## Responsive

Pastikan tampilan rapi di:
- laptop 1366x768
- laptop 1440x900
- desktop 1920x1080
- tablet
- mobile

Periksa:
- tidak ada horizontal overflow
- card tidak terlalu besar
- section tidak terlalu tinggi
- table/list tetap bisa digunakan
- button tidak bertumpuk secara buruk
- navigation tetap nyaman

## Micro Interaction

Tambahkan atau rapikan micro interaction hanya jika sudah ada pola animasi di project.

Boleh memperbaiki:
- hover state
- focus state
- transition ringan
- active state
- loading state

Jangan menambah library animasi baru.
Jangan membuat animasi berlebihan.
Jangan membuat UI bergerak hanya untuk dekorasi.

## Accessibility

Pastikan:
- semantic HTML tetap baik
- kontras teks cukup
- focus state tidak dihapus
- button bisa diakses keyboard
- form punya label yang jelas
- icon-only button punya `aria-label`
- teks penting tidak terlalu kecil

## Larangan

Jangan:
- mengubah business logic
- menghapus fitur
- mengubah API contract
- mengubah route tanpa instruksi
- menambah dependency
- membuat komponen baru
- membuat folder baru
- membuat page baru
- membuat layout baru
- mengganti stack project
- rewrite total halaman tanpa diminta
- menghapus data dummy penting
- mengubah behavior yang sudah berjalan

## Cara Kerja

Saat memperbaiki UI:
1. Ubah file yang memang relevan saja.
2. Gunakan komponen yang sudah ada.
3. Rapikan class/style yang sudah ada.
4. Perbaiki layout, spacing, typography, color, dan responsive behavior.
5. Jangan membuat abstraction baru.
6. Setelah selesai, jelaskan file yang diubah dan alasan singkatnya.

## Kriteria Selesai

Hasil akhir harus:
- lebih rapi
- lebih profesional
- lebih konsisten
- tidak terasa seperti template AI generik
- nyaman dibaca
- responsive
- tidak merusak fungsi lama
- tidak menambah komponen baru
- tidak menambah dependency baru
- tidak mengubah struktur besar project tanpa instruksi