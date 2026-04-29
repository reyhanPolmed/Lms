Saya memiliki project bernama `akara-lms` dengan struktur folder seperti ini:

akara-lms/
├── backend/
└── frontend/

Folder `backend` dan `frontend` sejajar di dalam root project `akara-lms`.

Kondisi saat ini:
- Backend sudah selesai dibuat.
- Semua API backend sudah berjalan dengan baik.
- Saya ingin menghubungkan frontend dengan backend tersebut.
- Frontend harus menggunakan API backend yang sudah ada, bukan membuat mock data baru.
- Response dari backend harus digunakan dan disesuaikan dengan kebutuhan frontend.
- Tujuannya agar frontend dan backend dapat berkomunikasi dengan baik dan konsisten.

Tugas kamu:

1. Analisis struktur project
   - Buka dan pelajari folder `backend`.
   - Identifikasi semua route/API yang tersedia.
   - Pelajari format request, response, status code, authentication, middleware, dan error response dari backend.
   - Buka dan pelajari folder `frontend`.
   - Identifikasi bagian frontend yang masih menggunakan mock data, dummy data, static data, atau belum terhubung ke API.

2. Hubungkan frontend ke backend
   - Buat atau rapikan konfigurasi API base URL di frontend.
   - Gunakan environment variable jika diperlukan, misalnya:
     - `VITE_API_BASE_URL`
     - `NEXT_PUBLIC_API_BASE_URL`
     - atau sesuai framework frontend yang digunakan.
   - Pastikan semua request frontend mengarah ke backend yang benar.
   - Jangan hardcode URL API di banyak tempat. Gunakan satu konfigurasi terpusat.

3. Buat layer komunikasi API yang rapi
   - Buat folder/service khusus untuk API call jika belum ada, misalnya:
     - `src/services/api`
     - `src/lib/api`
     - `src/api`
   - Gunakan fetch, axios, atau library yang sudah digunakan di project.
   - Buat function API yang jelas untuk setiap fitur
   - Jangan menulis request API langsung berulang-ulang di setiap komponen jika bisa dipusatkan.

4. Sesuaikan response backend dengan kebutuhan frontend
   - Pelajari bentuk response dari backend.
   - Jika response backend berbentuk seperti:
     ```json
     {
       "success": true,
       "message": "Data berhasil diambil",
       "data": {}
     }
     ```
     maka frontend harus mengambil data dari field yang benar, misalnya `response.data.data`.
   - Jika backend mengembalikan pagination, token, user object, role, permissions, atau nested object, pastikan frontend menggunakannya dengan benar.
   - Jangan mengubah backend jika tidak diperlukan. Utamakan menyesuaikan frontend dengan response backend yang sudah ada.
   - Jika ada mismatch antara kebutuhan frontend dan response backend, buat adapter/helper di frontend agar data mudah digunakan oleh komponen.

5. Perbaiki state management dan loading state
   - Tambahkan handling untuk:
     - loading
     - success
     - error
     - empty state
   - Pastikan UI tidak crash ketika data belum tersedia.
   - Gunakan optional chaining, default value, atau validasi data jika diperlukan.
   - Tampilkan pesan error dari backend jika tersedia.

6. Authentication dan authorization
   - Jika backend menggunakan JWT/token/session, hubungkan alurnya ke frontend.
   - Simpan token dengan cara yang sesuai dengan implementasi project.
   - Pastikan request yang membutuhkan autentikasi mengirim header Authorization, misalnya:
     ```http
     Authorization: Bearer <token>
     ```
   - Buat mekanisme logout.
   - Pastikan halaman yang butuh login tidak bisa diakses tanpa autentikasi.
   - Pastikan role user dari backend digunakan oleh frontend jika ada fitur role-based access.

7. Integrasi form frontend dengan backend
   - Hubungkan semua form frontend ke API backend.
   - Pastikan payload request sesuai dengan field yang diminta backend.
   - Validasi input di frontend sebelum mengirim request.
   - Setelah submit berhasil, tampilkan feedback ke user.
   - Jika gagal, tampilkan pesan error yang jelas.

8. Bersihkan mock data
   - Cari semua mock data, dummy data, fake response, atau data statis yang seharusnya berasal dari backend.
   - Ganti dengan API call ke backend.
   - Jika mock data masih diperlukan untuk fallback development, pisahkan dengan jelas dan jangan digunakan di production flow.

9. Pastikan frontend dan backend sinkron
   - Cocokkan nama field antara backend dan frontend.
   - Cocokkan tipe data.
   - Cocokkan endpoint.
   - Cocokkan HTTP method.
   - Cocokkan struktur payload request.
   - Cocokkan struktur response.
   - Cocokkan error response.
   - Cocokkan flow autentikasi.

10. Testing integrasi
   - Jalankan backend.
   - Jalankan frontend.
   - Test semua flow utama dari frontend:
     - login/register
     - dashboard
     - mengambil data
     - membuat data
     - mengubah data
     - menghapus data
     - upload file jika ada
     - logout
   - Perbaiki error CORS jika muncul.
   - Perbaiki masalah route, base URL, token, atau response mapping jika ada.

Aturan penting:
- Jangan merusak API backend yang sudah berjalan.
- Jangan mengganti struktur besar project kecuali benar-benar perlu.
- Jangan membuat endpoint palsu di frontend.
- Jangan mengubah response backend secara sembarangan.
- Frontend harus mengikuti kontrak API backend.
- Jika ada bagian yang ambigu, baca kode backend terlebih dahulu sebelum membuat keputusan.
- Jika perlu membuat helper, adapter, atau type/interface, lakukan dengan rapi.
- Gunakan gaya kode yang konsisten dengan project yang sudah ada.
- Setelah selesai, jelaskan file apa saja yang diubah dan kenapa.

Output yang saya inginkan:
1. Frontend berhasil menggunakan API dari backend.
2. Semua fitur frontend yang relevan terhubung ke backend.
3. Response backend digunakan dengan benar oleh frontend.
4. Error, loading, auth, dan empty state ditangani dengan baik.
5. Tidak ada lagi mock data untuk flow utama yang seharusnya memakai backend.
6. Berikan ringkasan perubahan setelah implementasi selesai.