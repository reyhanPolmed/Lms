PROPOSAL SKRIPSI



SISTEM DETEKSI KEMIRIPAN ISI DOKUMEN TUGAS PADA LEARNING 
MANAGEMENT SYSTEM MENGGUNAKAN ALGORITMA 
WINNOWING DAN VISUALISASI KEMIRIPAN





 







Diajukan oleh

REYHAN YONATHAN BATUBARA
2205181022




PROGRAM STUDI TEKNOLOGI REKAYASA PERANGKAT LUNAK
JURUSAN KOMPUTER DAN INFORMATIKA
POLITEKNIK NEGERI MEDAN
MEDAN
2026
LEMBAR PENGESAHAN
PROPOSAL SKRIPSI


SISTEM DETEKSI KEMIRIPAN ISI DOKUMEN TUGAS PADA LEARNING 
MANAGEMENT SYSTEM MENGGUNAKAN ALGORITMA 
WINNOWING DAN VISUALISASI KEMIRIPAN






Diajukan oleh

REYHAN YONATHAN BATUBARA
2205181022


Medan, 9 April 2026


Menyetujui:

Dosen Pembimbing






Bister Purba, S.Kom., M.Kom
NIP 199101032022031008



Mengetahui:

Ketua Jurusan,                                          Koordinator Program Studi,



,



(Zakaria Sembiring, S.T., M.Sc)                (Yuyun Yusnida Lase, S. Kom., M.Kom.)
NIP 19700128 199203 1 002                               NIP 19800706 201504 2 001
KATA PENGANTAR

Puji dan syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa, karena atas rahmat, taufik, dan hidayah-Nya, penulis dapat menyelesaikan skripsi dengan judul “Sistem Deteksi Kemiripan Isi Dokumen Tugas Pada Learning Management System Menggunakan Algoritma Winnowing Dan Visualisasi Kemiripan”. 
Skripsi ini disusun sebagai salah satu syarat untuk memperoleh gelar Sarjana Komputer pada Program Studi Teknologi Rekayasa Perangkat Lunak, Jurusan Teknik Komputer dan Informatika, Politeknik Negeri Medan.
Selama proses penelitian dan penulisan, penulis menyadari bahwa terselesaikannya skripsi ini tidak lepas dari bimbingan, dukungan, dan motivasi dari berbagai pihak. Oleh karena itu, penulis mengucapkan terima kasih yang sebesar-besarnya kepada:
	Bapak Dr. Ir. Idham Kamil, S.T., M.T., selaku Direktur Politeknik Negeri Medan.
	Bapak Agus Edy Rangkuti, S.E., M.Si., selaku Wakil Direktur Bidang Akademik Politeknik Negeri Medan.
	Bapak Ferry Fachrizal, S.T., M.Kom., selaku Wakil Direktur Bidang Perencanaan, Keuangan, dan Umum Politeknik Negeri Medan.
	Bapak Ahmad Kholil, S.E., M.Si., selaku Wakil Direktur Bidang Kemahasiswaan Politeknik Negeri Medan.
	Bapak Dr. Arif Ridho Lubis, B. IT., M.Sc. IT., selaku Wakil Direktur Bidang Kerja Sama dan Hubungan Masyarakat Politeknik Negeri Medan.
	Bapak Zakaria Sembiring, S.T., M.Sc., selaku Ketua Jurusan Teknik Komputer dan Informatika Politeknik Negeri Medan.
	Ibu Yuyun Yusnida Lase, S.Kom., M.Kom., selaku Koordinator Program Studi Teknologi Rekayasa Perangkat Lunak.
	Bapak Bister Purba, S.Kom., M.Kom., selaku Dosen Pembimbing Skripsi yang telah meluangkan waktu, memberikan bimbingan, arahan, serta masukan yang sangat berharga sejak awal hingga terselesaikannya skripsi ini.
	Seluruh Dosen dan Staf Administrasi Program Studi Teknologi Rekayasa Perangkat Lunak yang telah memberikan ilmu dan dukungan.
	Bapak Sugianto, S.T., M.Kom., selaku Direktur SAE Digital Akademi, dan seluruh staf SAE Digital Akademi atas ilmu dan pengalaman berharga selama masa magang yang turut menginspirasi topik penelitian ini.
	Kedua orang tua, keluarga, serta rekan-rekan seperjuangan di Politeknik Negeri Medan yang selalu memberikan doa, semangat, dan dukungan tanpa henti.
Penulis menyadari sepenuhnya bahwa skripsi ini masih jauh dari kata sempurna. Oleh karena itu, kritik dan saran yang membangun dari semua pihak sangat penulis harapkan untuk perbaikan di masa mendatang. Semoga hasil penelitian ini dapat memberikan manfaat dan kontribusi, khususnya dalam pengembangan sistem pembelajaran yang lebih integritas di lingkungan akademik.



Medan, 29 april 2026


   Reyhan Yonathan Batubara
 NIM 2205181022

 
DAFTAR ISI

LEMBAR PENGESAHAN	1
KATA PENGANTAR	2
DAFTAR ISI	4
DAFTAR TABEL	6
DAFTAR GAMBAR	7
BAB 1 PENDAHULUAN	8
1.1 Latar Belakang	8
1.2 Rumusan Masalah	10
1.3 Batasan Masalah	11
1.4 Tujuan Skripsi	11
1.5 Manfaat Skripsi	12
1.5.1 Manfaat Teoritis	12
1.5.2 Manfaat Praktis	12
BAB 2 TINJAUAN PUSTAKA	13
2.1 Penelitian Terdahulu	13
2.2 Landasan Teori	15
2.2.1 Learning Management System (LMS)	15
2.2.2 SIPADI (Sistem Pembelajaran Digital)	15
2.2.3 Integritas Akademik dan Kemiripan Dokumen	16
2.2.4 Deteksi Kemiripan Teks	16
2.2.5 Preprocessing Teks	17
2.2.6 Document Fingerprint	17
2.2.7 Algoritma Winnowing	18
2.2.8 K-Gram, Rolling Hash, dan Sliding Window	19
2.2.9 Jaccard Similarity Coefficient	20
2.2.10 Optical Character Recognition dan Handwritten Text Recognition	20
2.2.11 Cloud Vision API	21
2.2.12 Position Mapping dan Similarity Highlight	22
2.2.13 Evaluasi Sistem	22
2.2.14 Teknologi Pendukung	23
2.3 Kerangka Berpikir	26
2.4 Hipotesis	27
BAB 3 METODE PENELITIAN	29
3.1 Pendekatan Penelitian	29
3.2 Alur Penelitian	30
3.3 Alat dan Bahan	31
3.3.1 Alat (Perangkat Keras dan Lunak)	31
3.3.2 Bahan (Dataset Pengujian)	32
3.4 Metode Pengumpulan Data	33
3.4.1 Studi Dokumen	33
3.4.2 Observasi	34
3.4.3 Wawancara Tidak Terstruktur	34
3.5 Langkah Perancangan Sistem	35
3.5.1 Arsitektur Sistem	35
3.5.2 Perancangan Diagram UML	40
3.5.3 Perancangan Basis Data	47
3.5.4 Perancangan Antarmuka Pengguna	51
3.6 Metode Pengujian Sistem	54
3.6.1 Pengujian Fungsionalitas Sistem	55
3.6.2 Pengujian Ekstraksi Teks	56
3.6.3 Pengujian Skenario Kemiripan Isi Dokumen	57
3.6.4 Pengujian Similalrity Highlight	59
3.6.5 Pengujian Performa Sistem	60
3.7 Metode Analisis Hasil Pengujian	61
3.7.1 Analisis Hasil Pengujian Fungsional	61
3.7.2 Analisis Hasil Ekstraksi Teks	62
3.7.3 Analisis Hasil Pengujian Kemiripan Dokumen	63
3.7.4 Analisis Hasil Similarity Highlight	64
3.7.5 Analisis Hasil Pengujian Performa	65
3.7.6 Analisis Ketercapaian Tujuan Penelitian	66
DAFTAR PUSTAKA	68


 
DAFTAR TABEL
Tabel 2. 1 Penelitian Terdahulu	6
Tabel 2. 3 Tabel Definisi dan Diagram UML	14
Tabel 3. 1 Alat Perangkat Keras	24
Tabel 3. 2 Alat Perangkat Lunak	25
Tabel 3. 3 Dataset Pengujian	26
Tabel 3. 4 Pembentukan k-gram	41
Tabel 3. 5 Perhitungan Hash	41
Tabel 3. 6 Sliding Window	42

 
DAFTAR GAMBAR
Gambar 2. 1 Kerangka Berpikir	18
Gambar 3. 1 Alur Penelitian	30
Gambar 3. 2 Arsitektur Sistem	36
Gambar 3. 3 Use Case	37
Gambar 3. 4 Sequence Diagram	38
Gambar 3. 5 Perancangan Basis Data	41
Gambar 3. 6 Antarmuka upload tugas siswa	43
Gambar 3. 7 Antarmuka Laporan Integritas Akademik	43
Gambar 3. 8 Antarmuka Detail Laporan Integritas	43


 

PENDAHULUAN

Latar Belakang
Learning Management System (LMS) telah menjadi bagian penting dalam penyelenggaraan pembelajaran digital di perguruan tinggi karena mampu mendukung distribusi materi, komunikasi pembelajaran, evaluasi, serta pengumpulan tugas mahasiswa secara daring. Di Politeknik Negeri Medan, sistem pembelajaran digital tersebut dikenal dengan nama SIPADI atau Sistem Pembelajaran Digital. Portal resmi Polmed mencantumkan SIPADI sebagai salah satu sistem informasi kampus, sedangkan laman SIPADI membagi aksesnya ke dalam SIPADI Teknik dan SIPADI Tata Niaga. Dalam (Panduan-PBM-2020-Polmed, t.t.), LMS Polmed juga dijelaskan sebagai platform pembelajaran online yang tersedia sejak tahun 2020. 
Meskipun LMS membantu proses pengumpulan tugas menjadi lebih praktis, kemudahan tersebut tidak selalu diikuti oleh mekanisme verifikasi kemiripan isi dokumen yang memadai. Berdasarkan observasi awal terhadap penggunaan LMS SIPADI Polmed, sistem tersebut telah digunakan sebagai media pembelajaran dan pengumpulan tugas, tetapi belum menyediakan fitur khusus untuk mendeteksi kemiripan isi dokumen tugas mahasiswa. Kondisi ini menyebabkan proses identifikasi tugas yang berpotensi memiliki kemiripan tinggi masih bergantung pada pemeriksaan manual oleh dosen.
Permasalahan ini menjadi penting karena kemiripan isi tugas dapat berkaitan dengan potensi plagiarisme, duplikasi jawaban, atau kerja sama yang tidak sesuai dengan ketentuan akademik. Studi (Sozon dkk., 2024). menunjukkan bahwa cheating dan plagiarism merupakan persoalan serius di perguruan tinggi karena dapat memengaruhi kualitas pendidikan dan reputasi institusi. Studi tersebut juga menekankan bahwa institusi pendidikan tinggi perlu mengembangkan atau memanfaatkan perangkat lunak pendeteksi plagiarisme sebagai bagian dari upaya menjaga integritas akademik. 
Dalam praktiknya, dosen dapat menerima banyak dokumen tugas dalam satu waktu, baik dalam bentuk DOCX, PDF, maupun gambar hasil foto atau scan. Format tugas yang beragam ini menimbulkan tantangan tersendiri. Dokumen digital berbasis teks relatif mudah diproses, tetapi dokumen berbasis gambar atau tulisan tangan harus melalui proses ekstraksi teks terlebih dahulu sebelum dapat dibandingkan.(Kodali dkk., 2023) menunjukkan bahwa deteksi plagiarisme pada teks tulisan tangan di lingkungan Moodle dapat dilakukan dengan memanfaatkan Optical Character Recognition atau OCR untuk mengotomatisasi pemeriksaan kemiripan antara dokumen tulisan tangan maupun terhadap sumber lain. 
Namun, penggunaan OCR atau Handwritten Text Recognition pada dokumen tulisan tangan tidak selalu menghasilkan teks yang sempurna. Nockels dkk. menjelaskan bahwa Handwritten Text Recognition merupakan pendekatan berbasis machine learning untuk mengubah citra tulisan menjadi teks, tetapi hasilnya masih dipengaruhi oleh kualitas digitalisasi, sumber data, serta potensi bias dalam proses pengenalan tulisan. Oleh karena itu, sistem deteksi kemiripan untuk dokumen tugas berbasis gambar perlu dirancang dengan mempertimbangkan kemungkinan kesalahan hasil ekstraksi teks.
Salah satu metode yang dapat digunakan untuk mendeteksi kemiripan teks adalah algoritma Winnowing. (Schleimer dkk, 2003). memperkenalkan Winnowing sebagai algoritma local document fingerprinting yang efisien untuk mengidentifikasi penyalinan sebagian pada sekumpulan dokumen besar. Dalam konteks penelitian di Indonesia, (Yudra Bramantya dkk., 2022). juga menunjukkan bahwa parameter k-gram dan window pada metode Winnowing memengaruhi nilai similaritas, dengan parameter k memiliki pengaruh lebih besar terhadap hasil kemiripan dibandingkan parameter window. 
Beberapa penelitian sebelumnya telah mengembangkan sistem pemeriksa kemiripan tugas mahasiswa. (Sarawale dkk., 2025), misalnya, mengembangkan sistem pendeteksi plagiarisme tugas yang menghasilkan persentase kemiripan, highlight bagian teks yang mirip, dan graph hubungan antar mahasiswa. Namun, sistem tersebut masih berfokus pada pemeriksaan tugas berbasis teks digital. Sementara itu, penelitian (Kodali dkk., 2023). telah membahas deteksi plagiarisme pada teks tulisan tangan dengan bantuan OCR di Moodle, tetapi belum secara khusus menekankan integrasi dengan fitur visualisasi lokasi kemiripan pada dokumen tugas dalam konteks LMS kampus di Indonesia. 
Berdasarkan kondisi tersebut, terdapat kebutuhan untuk mengembangkan sistem deteksi kemiripan isi dokumen tugas yang mampu memproses berbagai format input, termasuk dokumen berbasis teks dan gambar, serta menampilkan hasil kemiripan secara lebih mudah diverifikasi oleh dosen. Dalam penelitian ini, SIPADI Polmed dijadikan sebagai konteks studi kasus untuk memahami kebutuhan dan permasalahan nyata pada proses pengumpulan tugas di LMS kampus. Namun, sistem yang dikembangkan tidak diintegrasikan langsung ke dalam SIPADI, melainkan diimplementasikan pada LMS mandiri yang dirancang oleh peneliti sebagai media pengujian dan pembuktian konsep.
Dengan mengintegrasikan OCR/HTR untuk ekstraksi teks dari dokumen berbasis gambar, algoritma Winnowing untuk menghitung kemiripan berbasis fingerprint, serta fitur visualisasi segmen teks yang mirip, sistem yang dikembangkan diharapkan dapat membantu dosen memperoleh informasi kemiripan secara lebih komprehensif. Sistem ini tidak hanya menghasilkan skor kemiripan, tetapi juga menampilkan bagian teks yang terindikasi mirip sehingga proses verifikasi menjadi lebih transparan, efisien, dan mendukung upaya peningkatan integritas akademik di lingkungan perguruan tinggi.
Rumusan Masalah
Berdasarkan latar belakang di atas, rumusan masalah dalam penelitian ini adalah sebagai berikut:
	Bagaimana menerapkan sistem deteksi kemiripan dokumen tugas yang mengintegrasikan Optical Character Recognition (OCR) dan algoritma Winnowing pada fitur pengumpulan tugas di LMS?
	Bagaimana akurasi, efektivitas, dan kontribusi fitur Similarity Highlight sistem deteksi kemiripan isi dokumen tugas siswa terhadap kemampuan instruktur dalam mengidentifikasi potensi plagiarisme dibandingkan hanya dengan skor persentase kemiripan?
	Bagaimana membangun Sistem Deteksi Plagiarisme Tugas Siswa Pada LMS Berbasis Cloud Vision API Dan Winnowing Dengan Similarity Highlight?
Batasan Masalah
Penelitian ini memiliki beberapa batasan sebagai berikut:
	Fokus utama pada dokumen tugas dalam format PDF, atau pindaian tulisan tangan yang diproses melalui modul OCR.
	Deteksi kemiripan menggunakan pendekatan string-based (fingerprinting) dengan algoritma Winnowing yang dimodifikasi, tanpa memanfaatkan pendekatan semantik mendalam berbasis AI generatif.
	Parameter Winnowing (ukuran k-gram dan window size) ditentukan secara optimal melalui pengujian awal dan dipertahankan selama evaluasi.
	Pengukuran kemiripan dilakukan menggunakan Jaccard Similarity terhadap himpunan fingerprint yang dihasilkan.
	Fitur Similarity Highlight dibangun berdasarkan informasi posisi karakter dari fingerprint yang cocok.
Tujuan Skripsi
Tujuan penelitian ini adalah:
	Menerapkan sistem deteksi kemiripan isi dokumen tugas yang mengintegrasikan Optical Character Recognition (OCR) dan algoritma Winnowing pada fitur pengumpulan tugas di Learning Management System (LMS). 
	Mengukur akurasi dan efektivitas sistem serta menganalisis kontribusi fitur Similarity Highlight terhadap kemampuan instruktur dalam mengidentifikasi dan menilai potensi plagiarisme dibandingkan hanya dengan menampilkan skor persentase kemiripan. 
	Membangun Sistem Deteksi Plagiarisme Tugas Siswa pada LMS berbasis Cloud Vision Api dan Algoritma Winnowing dengan fitur Similarity Highlight.
Manfaat Skripsi
Manfaat Teoritis
	Memberikan kontribusi pengembangan metode deteksi kemiripan isi dokumen dengan menggabungkan OCR dan Algoritma Winnowing yang mempertahankan informasi posisi karakter.
	Menjadi referensi bagi penelitian selanjutnya mengenai penerapan fingerprint-based detection pada dokumen akademik, khususnya yang berasal dari input gambar/scan.
	Memperkaya kajian literatur di bidang text similarity detection dan integrasi sistem pendukung pembelajaran berbasis teknologi.
Manfaat Praktis
	Bagi guru/instruktur: Memberikan alat bantu yang lebih cepat dan informatif melalui skor kemiripan beserta visualisasi lokasi kemiripan, sehingga proses penilaian menjadi lebih efisien.
	Bagi institusi pendidikan: Meningkatkan integritas akademik dengan adanya mekanisme deteksi plagiarisme otomatis yang terintegrasi dengan LMS.
	Bagi pengembang LMS: Memberikan model teknis modul tambahan yang dapat diadopsi untuk meningkatkan kecerdasan sistem manajemen pembelajaran.
	Bagi siswa: Mendorong kesadaran akan pentingnya orisinalitas karya dan integritas akademik melalui keberadaan sistem deteksi yang transparan.
 

TINJAUAN PUSTAKA

Penelitian Terdahulu
Penelitian mengenai deteksi kemiripan dokumen dan pendeteksian plagiarisme telah berkembang cukup pesat, khususnya dalam ranah sistem pendidikan berbasis digital. Bagian ini menelaah sejumlah penelitian dan karya ilmiah terdahulu yang relevan dengan topik penelitian ini, sekaligus memperlihatkan posisi dan kebaruan (novelty) dari penelitian yang sedang dilakukan.
no	Penulis dan tahun	judul	metode	hasil	relevansi
1	(Foltýnek dkk., 2020)
Academic Plagiarism Detection: A Systematic Literature Review
	Systematic Literature Review terhadap metode deteksi plagiarisme akademik, termasuk text matching, semantic analysis, machine learning, cross-language, dan pendekatan lain.	Memetakan perkembangan metode deteksi plagiarisme akademik dan menunjukkan bahwa deteksi plagiarisme tidak hanya berbasis pencocokan teks literal, tetapi juga dapat berkembang ke pendekatan semantik dan lintas bahasa.	Relevansi: rujukan payung untuk menjelaskan posisi deteksi kemiripan dokumen. Gap: tidak membangun sistem LMS, tidak fokus OCR/tulisan tangan, dan tidak membahas implementasi Winnowing pada tugas mahasiswa secara spesifik.
2	(Schleimer dkk. 2003)
Winnowing: Local Algorithms for Document Fingerprinting
	Memperkenalkan algoritma Winnowing sebagai local document fingerprinting untuk mendeteksi salinan parsial pada dokumen.	Winnowing menghasilkan fingerprint representatif dari dokumen sehingga pencocokan dapat dilakukan lebih efisien dan tetap mampu mendeteksi bagian dokumen yang disalin sebagian.	Relevansi: fondasi utama algoritma yang digunakan. Gap: paper dasar algoritmik, bukan sistem LMS, bukan OCR, dan belum membahas visualisasi highlight pada antarmuka dosen.
3	(Ramli dkk., 2021)
Uji Plagiarism pada Tugas Mahasiswa Menggunakan Algoritma Winnowing	Penerapan algoritma Winnowing untuk mendeteksi plagiarisme pada tugas mahasiswa, khususnya source code pemrograman.	Pengujian pada 10 tugas mahasiswa menghasilkan nilai similarity yang bervariasi dengan rata-rata keseluruhan 75,12%.	Relevansi: mendukung penggunaan Winnowing untuk tugas mahasiswa. Gap: objek berupa source code, bukan dokumen naratif/PDF/foto; belum terintegrasi LMS; belum OCR/HTR; belum highlight visual pada dokumen.


4	(Mentari dkk., 2022)
Cross-Language Text Document Plagiarism Detection System Using Winnowing Method	Sistem deteksi plagiarisme dokumen teks lintas bahasa menggunakan Winnowing dan Jaccard Coefficient. Input berupa teks dan PDF.	Akurasi tertinggi dibandingkan Plagiarism Checker X diperoleh pada skenario keempat dengan rata-rata 84,7%.	Relevansi: memperkuat penggunaan Winnowing pada dokumen teks/PDF dan konteks bahasa Indonesia. Gap: fokus lintas bahasa, bukan LMS kampus, tidak menangani foto/scan/tulisan tangan, dan belum menyediakan semantic/visual highlight.
5	(Yudra Bramantya dkk., 2022)
Analisis Algoritma Winnowing pada Pendeteksian Plagiarisme Judul Tugas Akhir	Analisis pengaruh parameter k-gram dan window pada algoritma Winnowing menggunakan Jaccard Coefficient.	Nilai k lebih berpengaruh dibandingkan window; nilai k terlalu rendah menghasilkan similarity terlalu tinggi, sedangkan nilai k terlalu besar dapat menurunkan sensitivitas kemiripan.	Relevansi: menjadi dasar pemilihan parameter k-gram dan window. Gap: pengujian hanya pada judul tugas akhir, bukan dokumen tugas panjang dan bukan dokumen hasil OCR.
6	(Shrestha dkk., 2023)
Winnowing Algorithm: A Powerful Tool for Identifying Plagiarism in Assignments	Sistem deteksi plagiarisme tugas berbasis web menggunakan Winnowing, Rolling Hash, dan Jaccard Coefficient. Sistem dikembangkan dengan Django dan MySQL.	Sistem berhasil mendeteksi plagiarisme pada tugas mahasiswa dan menguji kombinasi parameter n-gram, window length, serta base prime number.	Relevansi: mendukung rancangan sistem assignment checker berbasis web. Gap: input masih dokumen teks digital; belum OCR/HTR; belum menunjukkan visualisasi posisi kemiripan yang terhubung ke dokumen asli.
7	(Kodali dkk., 2023)
Automated Plagiarism Detection in Moodle	Deteksi plagiarisme pada teks tulisan tangan berbahasa Inggris dalam lingkungan Moodle dengan memanfaatkan authentication tools, cloud storage, dan OCR services.	Sistem mengotomatisasi pemeriksaan plagiarisme antara dua dokumen tulisan tangan serta membandingkannya dengan informasi yang tersedia secara online.	Relevansi: sangat kuat untuk mendukung kebutuhan OCR/HTR pada tugas berbasis gambar/tulisan tangan. Gap: bahasa Inggris, belum fokus konteks LMS Indonesia/Polmed, dan tidak menekankan Winnowing serta highlight posisi kemiripan pada dokumen.
8	(Sarawale dkk., 2025)
Assignment Checker: An Intelligent System for Detecting Student Assignment Plagiarism	Sistem assignment checker untuk peer-to-peer plagiarism. Menggunakan teknik text similarity/NLP seperti Cosine Similarity, Jaccard Similarity, fingerprinting/Winnowing, serta laporan similarity matrix, highlighted text, dan relationship graph.	Sistem menekankan perbandingan antar-submisi mahasiswa, bukan hanya pencocokan terhadap sumber internet. Output yang ditawarkan meliputi persentase similarity, highlighted copied sections, dan graph hubungan antar mahasiswa.	Relevansi: paling dekat dengan fitur visualisasi highlight dan hubungan antar mahasiswa. Gap: saat ini dioptimalkan untuk file berbasis teks, belum OCR/HTR untuk foto/scan/tulisan tangan, dan perlu diverifikasi kembali kualitas jurnalnya sebelum dijadikan rujukan utama.
Landasan Teori
Learning Management System (LMS)
Learning Management System (LMS) adalah sistem perangkat lunak yang digunakan untuk mengelola proses pembelajaran secara digital. LMS menyediakan fasilitas administrasi pembelajaran, distribusi materi, pengelolaan pengguna, komunikasi antara dosen dan mahasiswa, evaluasi, kuis, serta pengumpulan tugas. Dalam pendidikan tinggi, LMS tidak hanya berfungsi sebagai tempat penyimpanan materi, tetapi juga sebagai infrastruktur pembelajaran yang merekam aktivitas akademik dan mendukung proses penilaian.
Komponen LMS yang paling relevan dengan penelitian ini adalah modul pengumpulan tugas atau assignment submission. Modul ini memungkinkan mahasiswa mengunggah tugas dalam bentuk berkas digital, seperti DOCX, PDF, gambar hasil foto, atau dokumen hasil scan. Pada sisi dosen, modul assignment mempermudah proses pengumpulan, penilaian, dan pemberian umpan balik. Dokumentasi Moodle menjelaskan bahwa aktivitas assignment menyediakan ruang bagi mahasiswa untuk mengumpulkan pekerjaan dan bagi pengajar untuk memberikan nilai serta umpan balik. Oleh karena itu, modul assignment menjadi titik awal penting dalam sistem deteksi kemiripan dokumen tugas.
SIPADI (Sistem Pembelajaran Digital)
Dalam penelitian ini, LMS kampus Politeknik Negeri Medan, yaitu SIPADI, digunakan sebagai konteks studi kasus untuk memahami proses pengumpulan tugas dan kebutuhan deteksi kemiripan dokumen pada lingkungan akademik nyata. SIPADI diposisikan sebagai objek observasi kebutuhan, bukan sebagai platform yang langsung diubah atau diintegrasikan dengan sistem yang dikembangkan.
Dengan demikian, sistem yang dibangun dalam penelitian ini merupakan LMS mandiri atau prototipe yang menerapkan fitur deteksi kemiripan dokumen. Pemisahan ini penting agar ruang lingkup penelitian menjadi jelas: penelitian tidak bertujuan mengubah sistem resmi SIPADI, tetapi mengembangkan dan menguji konsep sistem deteksi kemiripan dokumen tugas berdasarkan permasalahan yang ditemukan pada konteks penggunaan LMS kampus.
Integritas Akademik dan Kemiripan Dokumen
Integritas akademik berkaitan dengan kejujuran, tanggung jawab, dan keadilan dalam proses pembelajaran serta penilaian. Salah satu persoalan yang dapat mengganggu integritas akademik adalah plagiarisme atau penyerahan karya yang memiliki kemiripan tinggi dengan karya lain tanpa atribusi yang tepat. Dalam konteks tugas mahasiswa, kemiripan dokumen dapat muncul karena penyalinan langsung, kerja sama yang tidak sesuai aturan, penggunaan sumber tanpa rujukan, atau modifikasi kecil terhadap teks yang sudah ada.
Namun, penting untuk membedakan antara “kemiripan” dan “plagiarisme”. Sistem komputasional hanya dapat mendeteksi tingkat kemiripan atau kecocokan segmen teks. Keputusan bahwa suatu tugas termasuk plagiarisme tetap membutuhkan penilaian akademik oleh dosen, karena kemiripan dapat terjadi secara sah, misalnya pada penggunaan istilah teknis, format jawaban yang sama, kutipan, atau instruksi tugas yang sangat terstruktur. Oleh sebab itu, penelitian ini menggunakan istilah deteksi kemiripan isi dokumen, bukan vonis otomatis plagiarisme.
Deteksi Kemiripan Teks
Deteksi kemiripan teks adalah proses komputasional untuk mengukur tingkat kesamaan antara dua atau lebih dokumen teks. Tujuan utamanya adalah menemukan sejauh mana suatu dokumen memiliki bagian yang sama atau mirip dengan dokumen lain. Dalam konteks akademik, deteksi kemiripan teks dapat digunakan untuk membantu dosen melakukan penyaringan awal terhadap tugas mahasiswa yang berpotensi memiliki kesamaan isi.
Secara umum, pendekatan deteksi kemiripan teks dapat dikelompokkan menjadi empat kategori. Pertama, pendekatan berbasis karakter atau token yang membandingkan rangkaian karakter, kata, atau n-gram. Kedua, pendekatan berbasis fingerprint yang mengubah potongan teks menjadi nilai hash dan membandingkan himpunan fingerprint antar-dokumen. Ketiga, pendekatan berbasis vektor seperti TF-IDF dan cosine similarity yang merepresentasikan dokumen sebagai vektor bobot kata. Keempat, pendekatan berbasis semantik yang memanfaatkan embedding atau model bahasa untuk menangkap kemiripan makna.
Penelitian ini menggunakan pendekatan berbasis fingerprint karena sesuai untuk mendeteksi kemiripan lokal, efisien pada perbandingan banyak dokumen, dan dapat dikembangkan untuk menyimpan posisi karakter. Kemampuan menyimpan posisi karakter menjadi penting karena sistem tidak hanya menghasilkan skor kemiripan, tetapi juga menampilkan bagian dokumen yang terindikasi mirip.
Preprocessing Teks
Preprocessing teks adalah tahap persiapan data sebelum proses perhitungan kemiripan dilakukan. Tujuannya adalah menstandarkan teks agar variasi yang tidak bermakna tidak memengaruhi hasil perbandingan. Dalam penelitian ini, preprocessing dapat mencakup case folding, normalisasi spasi, penghapusan tanda baca tertentu, penghapusan karakter khusus, serta pembersihan hasil OCR yang tidak relevan.
Pada sistem yang mendukung fitur highlight, preprocessing tidak boleh hanya menghasilkan teks bersih. Sistem juga perlu menyimpan peta posisi atau position map, yaitu hubungan antara indeks karakter pada teks hasil normalisasi dengan posisi karakter pada teks asli. Position map diperlukan agar ketika fingerprint yang sama ditemukan, sistem dapat menelusuri kembali lokasi segmen tersebut pada dokumen asli dan menampilkan highlight secara akurat.
Document Fingerprint
Document fingerprinting adalah teknik merepresentasikan dokumen ke dalam kumpulan nilai ringkas yang disebut fingerprint. Fingerprint dihasilkan dari potongan-potongan teks tertentu, sehingga dokumen tidak perlu dibandingkan seluruhnya karakter demi karakter. Dengan membandingkan fingerprint antar-dokumen, sistem dapat menemukan bagian teks yang sama atau mirip secara lebih efisien.
Keunggulan document fingerprinting adalah kemampuannya mendeteksi salinan parsial. Artinya, sistem tidak hanya mengenali dokumen yang identik seluruhnya, tetapi juga dapat mendeteksi bagian tertentu yang disalin atau dimodifikasi ringan. Inilah alasan document fingerprinting cocok digunakan dalam sistem deteksi kemiripan tugas mahasiswa.
Algoritma Winnowing
Algoritma Winnowing adalah salah satu algoritma document fingerprinting yang dirancang untuk mendeteksi kemiripan lokal pada dokumen. Algoritma ini diperkenalkan oleh Schleimer, Wilkerson, dan Aiken pada tahun 2003. Winnowing bekerja dengan membentuk potongan teks berukuran tetap, menghitung nilai hash dari setiap potongan, lalu memilih sebagian hash sebagai fingerprint representatif menggunakan mekanisme sliding window.
Tahapan umum algoritma Winnowing adalah sebagai berikut:
	Melakukan preprocessing teks agar teks berada dalam bentuk yang konsisten.
	Membentuk k-gram, yaitu potongan karakter berurutan sepanjang k.
	Menghitung nilai hash untuk setiap k-gram menggunakan fungsi hash atau rolling hash.
	Membentuk window berukuran w dari deret hash yang telah dihasilkan.
	Memilih nilai hash minimum pada setiap window sebagai fingerprint. Jika terdapat nilai minimum yang sama, dipilih nilai minimum paling kanan atau rightmost minimum.
	Membandingkan fingerprint antar-dokumen untuk menghitung tingkat kemiripan.
Parameter k dan w sangat memengaruhi hasil deteksi. Nilai k yang terlalu kecil membuat sistem terlalu sensitif dan dapat meningkatkan false positive, sedangkan nilai k yang terlalu besar dapat menyebabkan segmen mirip yang pendek tidak terdeteksi. Nilai window memengaruhi jumlah fingerprint yang disimpan; window yang lebih besar cenderung menghasilkan fingerprint lebih sedikit, sedangkan window yang lebih kecil menghasilkan fingerprint lebih banyak. Penelitian (Yudra Bramantya dkk., 2022). menunjukkan bahwa parameter k-gram lebih berpengaruh terhadap nilai similaritas dibandingkan parameter window.
K-Gram, Rolling Hash, dan Sliding Window
	K-Gram
K-gram adalah substring atau potongan karakter berurutan dengan panjang k. Misalnya, teks “sistem” dengan k = 3 akan menghasilkan k-gram “sis”, “ist”, “ste”, dan “tem”. Dalam Winnowing, k-gram digunakan sebagai unit dasar yang akan diubah menjadi nilai hash. Semakin kecil nilai k, semakin banyak k-gram yang dihasilkan dan semakin sensitif sistem terhadap kemiripan pendek. Sebaliknya, semakin besar nilai k, jumlah k-gram lebih sedikit dan sistem hanya sensitif terhadap kemiripan yang lebih panjang.
	Rolling Hash
Rolling hash adalah teknik perhitungan hash yang memungkinkan nilai hash untuk k-gram berikutnya dihitung secara efisien berdasarkan nilai hash sebelumnya. Dalam implementasi sederhana, hash dapat dihitung dengan persamaan berikut:
H\left(c_1c_2\ldots c_k\right)=\left(c_1\times b^{k-1}+c_2\times b^{k-2}+\cdots+c_k\times b^0\right)\;\operatorname{mod}{p}\;
Pada rumus tersebut, ci adalah nilai karakter, b adalah basis, k adalah panjang k-gram, dan p adalah nilai modulus. Dalam implementasi sistem, rumus dapat disesuaikan dengan tipe data dan strategi hashing yang digunakan, selama mampu menghasilkan nilai fingerprint yang konsisten.
	Sliding Window
Sliding window adalah jendela berukuran w yang digeser sepanjang deret hash. Pada setiap window, algoritma memilih nilai hash minimum sebagai fingerprint. Pemilihan fingerprint dengan aturan rightmost minimum membantu menjaga konsistensi pemilihan fingerprint ketika terdapat nilai hash minimum yang sama. Dengan pendekatan ini, jumlah fingerprint yang disimpan menjadi lebih sedikit dibandingkan menyimpan seluruh hash, tetapi sistem tetap dapat mendeteksi segmen teks yang cukup panjang dan identik.
Jaccard Similarity Coefficient
Jaccard Similarity Coefficient adalah ukuran kemiripan antara dua himpunan. Dalam penelitian ini, himpunan yang dibandingkan adalah himpunan fingerprint dari dua dokumen. Jika A adalah himpunan fingerprint dokumen pertama dan B adalah himpunan fingerprint dokumen kedua, maka rumus Jaccard Similarity adalah:
J\left(A,B\right)=\frac{\left|A\cap B\right|}{\left|A\cup B\right|}
Nilai Jaccard berada pada rentang 0 sampai 1. Nilai 0 berarti tidak ada fingerprint yang sama, sedangkan nilai 1 berarti seluruh fingerprint yang dibandingkan sama. Dalam sistem, nilai ini dapat dikalikan 100 untuk menghasilkan persentase kemiripan. Metrik ini sesuai digunakan pada hasil Winnowing karena fingerprint direpresentasikan sebagai himpunan nilai hash.
Optical Character Recognition dan Handwritten Text Recognition
Optical Character Recognition (OCR) adalah teknologi untuk mengubah teks yang terdapat pada gambar, dokumen scan, atau foto menjadi teks digital yang dapat diproses komputer. Dalam sistem deteksi kemiripan dokumen tugas, OCR diperlukan ketika mahasiswa mengunggah dokumen berbasis gambar, seperti foto catatan, hasil scan jawaban, atau PDF hasil pemindaian.
Handwritten Text Recognition (HTR) adalah bentuk pengenalan teks yang lebih spesifik untuk tulisan tangan. Berbeda dengan teks cetak yang cenderung memiliki bentuk karakter stabil, tulisan tangan memiliki variasi bentuk huruf, kemiringan, jarak antarhuruf, kualitas pencahayaan, serta tata letak yang tidak selalu rapi. Oleh karena itu, dokumen tulisan tangan lebih sulit diproses dibandingkan dokumen cetak.
(Kodali dkk., 2023) menunjukkan bahwa deteksi plagiarisme pada dokumen tulisan tangan di Moodle dapat dilakukan dengan bantuan OCR untuk mengotomatisasi proses pemeriksaan kemiripan. Sementara itu, Nockels dkk. menjelaskan bahwa HTR bergantung pada kualitas digitalisasi dan data pelatihan, sehingga hasil ekstraksi teks perlu diperlakukan sebagai data yang mungkin mengandung kesalahan. Dengan demikian, sistem dalam penelitian ini perlu menempatkan OCR/HTR sebagai tahap ekstraksi teks yang hasilnya akan diproses lebih lanjut oleh algoritma Winnowing.
Cloud Vision API
Cloud Vision API merupakan layanan berbasis komputasi awan dari Google Cloud yang menyediakan kemampuan analisis citra menggunakan teknologi kecerdasan buatan. Salah satu fitur yang relevan dalam penelitian ini adalah Optical Character Recognition (OCR), yaitu proses mendeteksi dan mengekstraksi teks dari gambar atau dokumen berbasis citra. Cloud Vision API menyediakan fitur TEXT_DETECTION untuk mendeteksi teks pada gambar umum dan DOCUMENT_TEXT_DETECTION untuk mengekstraksi teks dari dokumen dengan struktur yang lebih kompleks, seperti halaman, blok, paragraf, dan kata. Dalam penelitian ini, Cloud Vision API digunakan untuk mengekstraksi teks dari dokumen tugas berbasis gambar, hasil scan, atau tulisan tangan sebelum teks tersebut diproses pada tahap preprocessing, pembentukan fingerprint menggunakan algoritma Winnowing, dan perhitungan kemiripan menggunakan Jaccard Similarity.
Penggunaan Cloud Vision API dalam penelitian ini berperan sebagai modul pendukung untuk memperoleh teks dari dokumen non-teks digital. Dokumen digital seperti DOCX atau PDF berbasis teks tetap diproses melalui text extraction, sedangkan dokumen berupa gambar atau scan diproses menggunakan OCR melalui Cloud Vision API. Meskipun demikian, kualitas hasil OCR dapat dipengaruhi oleh beberapa faktor, seperti resolusi gambar, pencahayaan, kemiringan dokumen, kualitas tulisan tangan, dan kondisi file yang diproses. Oleh karena itu, hasil ekstraksi teks dari Cloud Vision API tetap perlu dianalisis sebelum digunakan sebagai dasar perhitungan kemiripan dokumen, karena kualitas teks hasil OCR dapat memengaruhi hasil preprocessing, fingerprint, skor kemiripan, dan fitur Similarity Highlight.
Position Mapping dan Similarity Highlight
Position mapping adalah teknik untuk menyimpan hubungan antara teks hasil preprocessing dan teks asli. Teknik ini diperlukan karena proses preprocessing dapat mengubah struktur teks, misalnya menghapus tanda baca, mengubah huruf kapital menjadi huruf kecil, atau menghapus spasi berlebih. Jika posisi asli tidak disimpan, sistem akan kesulitan menampilkan bagian teks yang mirip pada dokumen asli.
Similarity Highlight adalah fitur visualisasi yang menampilkan segmen teks yang terindikasi mirip antar-dokumen. Fitur ini memberi nilai tambah dibandingkan hanya menampilkan skor kemiripan karena dosen dapat memeriksa bukti kemiripan secara langsung. Dengan adanya highlight, dosen dapat melihat apakah kemiripan terjadi pada bagian penting, apakah hanya berupa istilah umum, atau apakah mencakup paragraf panjang yang perlu diperiksa lebih lanjut.
Evaluasi Sistem
Evaluasi sistem diperlukan untuk memastikan bahwa sistem yang dikembangkan berjalan sesuai kebutuhan dan menghasilkan keluaran yang dapat digunakan oleh dosen. Evaluasi dalam penelitian ini dapat dibagi menjadi beberapa aspek diantaranya: 
	Pengujian fungsional, yaitu menguji apakah fitur upload tugas, ekstraksi teks, proses Winnowing, perhitungan skor, dan highlight berjalan sesuai rancangan.
	Pengujian parameter Winnowing, yaitu membandingkan hasil kemiripan pada beberapa nilai k-gram dan window untuk melihat pengaruh parameter terhadap skor dan jumlah fingerprint.
	Evaluasi hasil OCR/HTR, yaitu menilai kualitas teks hasil ekstraksi dari dokumen gambar atau tulisan tangan. Jika memungkinkan, kualitas OCR dapat diukur menggunakan Character Error Rate (CER) atau Word Error Rate (WER).
	Evaluasi hasil similarity highlight, yaitu memeriksa apakah segmen yang disorot sesuai dengan bagian teks yang benar-benar mirip.
	Evaluasi kegunaan bagi dosen, yaitu menilai apakah laporan kemiripan dan highlight membantu dosen melakukan verifikasi lebih cepat dibandingkan pemeriksaan manual.
Dengan pembagian evaluasi tersebut, penelitian tidak hanya menguji apakah algoritma menghasilkan skor, tetapi juga menguji apakah sistem benar-benar membantu proses pemeriksaan tugas dalam konteks LMS.
Teknologi Pendukung
Penelitian ini dibangun menggunakan stack teknologi modern yang mendukung pengembangan full-stack, skalabilitas, keamanan data, serta kemudahan deployment. Pemilihan teknologi ini didasarkan pada kebutuhan sistem deteksi plagiarisme yang memerlukan pemrosesan OCR secara real-time, penyimpanan fingerprint dokumen dalam jumlah besar, serta integrasi dengan LMS yang portabel dan mudah di-maintain.
Adapun teknologi yang digunakan dalam penelitian ini meliputi:
	Next.js
Next.js adalah framework React berbasis Node.js yang mendukung pengembangan full-stack dalam satu proyek. Versi terbaru (Next.js 15/16) menggunakan App Router dan Server Actions yang memungkinkan logika server-side dan client-side berada dalam satu file, sehingga mengurangi boilerplate kode dan meningkatkan performa (Pati & Zaki, 2025).
Fitur utama yang dimanfaatkan dalam penelitian ini adalah:
	Server-Side Rendering (SSR) dan React Server Components (RSC) untuk halaman laporan integritas akademik yang cepat dimuat.
	Server Actions untuk upload tugas siswa dan pemrosesan OCR tanpa perlu membuat API route terpisah.
	Automatic code splitting dan image optimization untuk antarmuka pengguna yang responsif.
Next.js dipilih karena kemampuannya mengintegrasikan frontend dan backend secara seamless, sehingga sistem dapat dijalankan dengan cepat di lingkungan akademik yang memiliki keterbatasan sumber daya server (Hanafi dkk., 2024).
	Prisma ORM dan PostgreSQL
Prisma ORM digunakan sebagai penghubung antara aplikasi dan basis data. Prisma menyediakan akses basis data yang type-safe, sistem migrasi, dan client otomatis untuk TypeScript/JavaScript. PostgreSQL digunakan sebagai basis data relasional untuk menyimpan data pengguna, kelas, tugas, submission, teks hasil OCR, fingerprint, skor kemiripan, dan rentang highlight.
PostgreSQL mendukung tipe data JSONB dan indeks GIN yang dapat digunakan untuk menyimpan serta mencari data semi-terstruktur seperti position map atau metadata hasil pemrosesan. Meski demikian, desain basis data tetap perlu mempertimbangkan efisiensi pencarian, karena menyimpan fingerprint dalam JSONB saja belum tentu optimal untuk seluruh skenario pencocokan. Untuk sistem prototipe, struktur tabel yang jelas dan indeks yang sesuai sudah cukup untuk mendukung pengujian.
	Docker dan Docker Compose
Docker digunakan untuk mengemas aplikasi beserta dependensinya ke dalam container agar lingkungan pengembangan dan deployment lebih konsisten. Docker Compose digunakan untuk menjalankan beberapa layanan sekaligus, misalnya aplikasi Next.js, PostgreSQL, dan service OCR. Dokumentasi Docker menyatakan bahwa Docker Compose digunakan untuk mendefinisikan dan menjalankan aplikasi multi-container melalui konfigurasi YAML.
Dalam penelitian ini, Docker mendukung portabilitas sistem karena prototipe dapat dijalankan di perangkat pengembang atau server uji tanpa konfigurasi manual yang kompleks. Namun, Docker perlu ditempatkan sebagai teknologi pendukung implementasi, bukan sebagai teori inti deteksi kemiripan.
Penelitian sebelumnya menunjukkan bahwa containerization dengan Docker secara signifikan mempercepat proses deployment, meningkatkan konsistensi lingkungan, serta mengurangi downtime dan kesalahan konfigurasi pada aplikasi web akademik (Puranik dkk., 2025).
Dengan kombinasi teknologi ini, sistem deteksi plagiarisme dapat dikembangkan secara efisien, scalable, dan mudah di-maintain, sesuai dengan kebutuhan integrasi dengan LMS.
 
Kerangka Berpikir
Kerangka berpikir penelitian ini disusun berdasarkan permasalahan pada proses pengumpulan tugas mahasiswa melalui LMS. Dalam konteks penelitian ini, SIPADI Polmed dijadikan sebagai objek studi kasus karena telah digunakan sebagai media pembelajaran dan pengumpulan tugas, tetapi belum menyediakan fitur deteksi kemiripan isi dokumen tugas secara otomatis. Kondisi tersebut menyebabkan proses pemeriksaan kemiripan masih bergantung pada pemeriksaan manual oleh dosen, terutama ketika dokumen tugas dikumpulkan dalam berbagai format seperti DOCX, PDF, gambar, scan, dan tulisan tangan.
 
Gambar 2. 1 Kerangka Berpikir
Berdasarkan permasalahan tersebut, penelitian ini mengembangkan LMS mandiri sebagai prototipe sistem deteksi kemiripan, bukan sebagai sistem yang diintegrasikan langsung ke SIPADI. Sistem yang dikembangkan dirancang untuk menerima dokumen tugas dalam berbagai format, melakukan ekstraksi teks melalui text extraction dan OCR/HTR, menormalisasi teks melalui preprocessing, serta mempertahankan informasi posisi karakter melalui position mapping.
Setelah teks siap diproses, sistem membentuk k-gram, menghitung nilai hash, dan memilih fingerprint representatif menggunakan algoritma Winnowing. Himpunan fingerprint antar dokumen kemudian dibandingkan menggunakan Jaccard Similarity untuk menghasilkan skor kemiripan. Selain menghasilkan skor, sistem juga menampilkan bagian teks yang terindikasi mirip melalui fitur Similarity Highlight. Fitur ini bertujuan memberikan bukti visual kepada dosen agar proses verifikasi kemiripan dapat dilakukan secara lebih mudah dan transparan.
Hasil akhir dari sistem berupa skor kemiripan, daftar pasangan dokumen yang memiliki kemiripan, serta visualisasi bagian teks yang mirip. Selanjutnya, sistem dievaluasi melalui pengujian fungsionalitas, kesesuaian hasil kemiripan, kesesuaian fitur highlight, dan efisiensi waktu proses. Dengan alur tersebut, penelitian ini diharapkan dapat menghasilkan prototipe sistem yang membantu dosen dalam memeriksa kemiripan isi dokumen tugas secara lebih terukur.
Hipotesis
Berdasarkan rumusan masalah, tinjauan pustaka, dan kerangka berpikir yang telah disusun, penelitian ini mengajukan hipotesis-hipotesis berikut sebagai jawaban sementara yang akan diuji secara empiris:
H₀ : Sistem deteksi kemiripan isi dokumen tugas berbasis OCR/HTR dan algoritma Winnowing tidak mampu menghasilkan proses deteksi kemiripan yang lebih informatif dibandingkan pemeriksaan yang hanya menampilkan skor kemiripan, baik dari sisi ekstraksi teks, perhitungan kemiripan, visualisasi bagian teks yang mirip, maupun kegunaan sistem bagi dosen.
H₁ : Integrasi modul ekstraksi teks, yang terdiri atas text extraction untuk dokumen digital dan OCR/HTR untuk dokumen berbasis gambar, mampu menghasilkan teks yang dapat digunakan sebagai input pada proses deteksi kemiripan dokumen tugas.
H₂ : Algoritma Winnowing dengan tahapan preprocessing, pembentukan k-gram, rolling hash, pemilihan fingerprint, dan perhitungan Jaccard Similarity mampu mendeteksi tingkat kemiripan isi dokumen tugas berdasarkan kesamaan fingerprint antar dokumen.   
H₃: Fitur Similarity Highlight berbasis position mapping mampu menampilkan segmen teks yang terindikasi mirip beserta lokasinya pada dokumen, sehingga hasil deteksi kemiripan lebih mudah diverifikasi dibandingkan hanya menampilkan skor persentase.
H₄: Sistem deteksi kemiripan isi dokumen tugas yang dikembangkan mampu memberikan kegunaan yang baik bagi dosen dalam proses pemeriksaan kemiripan dokumen, terutama melalui penyajian skor kemiripan dan bukti visual berupa highlight segmen teks yang mirip.
Keempat hipotesis di atas akan diuji dan dibuktikan atau ditolak berdasarkan hasil pengujian sistematis menggunakan dataset dokumen tugas mahasiswa asli serta skenario pengujian yang telah dirancang pada Bab III (Metodologi Penelitian).
 

METODE PENELITIAN 

Pendekatan Penelitian
Penelitian ini menggunakan pendekatan Research and Development (R&D) dengan metode rekayasa perangkat lunak. Pendekatan ini dipilih karena tujuan utama penelitian adalah menghasilkan sebuah produk berupa sistem perangkat lunak, yaitu Learning Management System (LMS) mandiri yang dilengkapi fitur deteksi kemiripan isi dokumen tugas mahasiswa. Sistem yang dikembangkan berfungsi untuk menerima dokumen tugas dalam berbagai format, melakukan ekstraksi teks, menghitung tingkat kemiripan dokumen menggunakan algoritma Winnowing dan Jaccard Similarity, serta menampilkan bagian teks yang terindikasi mirip melalui fitur Similarity Highlight.
Pendekatan R&D digunakan karena penelitian ini tidak hanya bertujuan menganalisis permasalahan, tetapi juga merancang, membangun, menguji, dan mengevaluasi produk sistem. Dalam konteks penelitian ini, permasalahan yang dikaji berasal dari penggunaan LMS SIPADI Polmed sebagai objek studi kasus, yaitu belum tersedianya fitur deteksi kemiripan isi dokumen tugas secara otomatis. Namun, sistem yang dikembangkan tidak diintegrasikan langsung ke dalam SIPADI, melainkan diwujudkan dalam bentuk LMS mandiri sebagai prototipe penelitian.
Model pengembangan sistem yang digunakan adalah Software Development Life Cycle (SDLC) dengan pendekatan iteratif. Model ini dipilih karena pengembangan sistem deteksi kemiripan membutuhkan proses bertahap mulai dari analisis kebutuhan, perancangan sistem, implementasi, pengujian, hingga evaluasi dan perbaikan. Pendekatan iteratif memungkinkan sistem diperbaiki secara berulang berdasarkan hasil pengujian, terutama pada modul ekstraksi teks, perhitungan kemiripan, dan visualisasi hasil kemiripan.
Tahapan penelitian dalam pendekatan ini meliputi identifikasi masalah, studi literatur, analisis kebutuhan sistem, perancangan sistem, implementasi, pengujian, evaluasi, dan penarikan kesimpulan. Setiap tahap dilakukan untuk memastikan bahwa sistem yang dikembangkan sesuai dengan kebutuhan penelitian dan mampu memberikan hasil yang dapat diuji secara empiris.
Alur Penelitian
Alur penelitian ini digunakan sebagai pedoman penulis dalam pelaksanaan penelitian agar hasil yang dicapai tidak menyimpang dari tujuan yang telah ditentukan sebelumnya. Penelitian dilaksanakan melalui enam tahapan utama yang saling berkaitan dan berurutan, sebagaimana diilustrasikan pada Gambar 3.1.
 
Gambar 3. 1 Alur Penelitian
Alat dan Bahan
Alat (Perangkat Keras dan Lunak) 
Dalam proses pembuatan sistem pada skripsi ini, penulis menggunakan beberapa perangkat keras dan perangkat lunak. Berikut ini merupakan alat-alat yang dipergunakan dalam proses pembuatan skripsi, sebagaimana tercantum pada Tabel 3.1 dan Tabel 3.2.
Tabel 3. 1 Alat Perangkat Keras
No	  Nama Alat	  Spesifikasi	Jumlah
1	Perangkat Komputer	Laptop Asus Prosesor Ryzen 5000series, RAM 16 GB, Storage SSD 512 GB	1
2	Koneksi Internet	Minimal 20 Mbps untuk kebutuhan instalasi dependensi dan deployment	1

Tabel 3. 2 Alat Perangkat Lunak
No	 Nama Perangkat Lunak	 Versi	 Fungsi
1	Sistem Operasi Windows	11 (64-bit)	Lingkungan pengembangan utama
2	Node.js	v20 LTS	Runtime JavaScript server-side
3	Next.js	16.2.2	Framework aplikasi web full-stack
4	TypeScript	V6.0.2	Bahasa pemrograman bertype-safe
5	Python	3.14.3	Runtime untuk modul OCR
7	PyMuPDF (fitz)	v1.27.2.2.	Rendering halaman PDF menjadi citra
8	PgAdmin 4 	V9.13	Sistem manajemen basis data relasional
9	Prisma ORM	v7.5	Object-Relational Mapping untuk TypeScript
10	Docker & Docker Compose	V29.3.0	Kontainerisasi dan orkestrasi aplikasi
11	Visual Studio Code	Terbaru	Integrated Development Environment (IDE)
12	npm	v11.6.2	Package manager Node.js
13	mammoth	v1.12.0	Ekstraksi teks dari file .docx
14	pdf-parse	v2.4	Ekstraksi teks dari file .pdf digital
15	Postman / Browser	Terbaru	Pengujian antarmuka dan fungsionalitas

Bahan (Dataset Pengujian) 
Adapun bahan-bahan yang dipergunakan dalam proses penelitian dan pengujian sistem dapat dilihat pada Tabel 3.3.
Tabel 3. 3 Dataset Pengujian
No	Nama Bahan	Deskripsi	Format File	Jumlah
1	Dataset Skenario S1 (Identik)	Pasang dokumen di mana Dokumen B merupakan salinan persis Dokumen A	.docx	10 pasang
2	Dataset Skenario S2 (Modifikasi Ringan)	Pasang dokumen dengan ~30% modifikasi berupa penggantian atau penambahan kata	.docx	10 pasang
3	Dataset Skenario S3 (Modifikasi Sedang)	Pasang dokumen dengan ~50% modifikasi berupa parafrasa dan penambahan konten	.docx	10 pasang
4	Dataset Skenario S4 (Berbeda Total)	Pasang dokumen dengan topik dan konten yang sepenuhnya berbeda	.docx	10 pasang
5	Dataset Gambar Tulisan Tangan	Foto/scan dokumen tugas akademik mahasiswa berbentuk tulisan tangan	.pdf	10 file
6	Dataset PDF Pindaian	Dokumen tugas mahasiswa dalam format PDF hasil pindaian (scan)	.pdf	10 file
Dokumen-dokumen dataset diperoleh dari sumber:
	Dokumen tugas siswa yang dikumpulkan melalui LMS (dengan persetujuan dan anonimisasi yang sesuai).
	Dokumen sintetis yang dibuat secara manual untuk mensimulasikan skenario kemiripan yang terkontrol.
	Dokumen teks dari repositori publik berbahasa Indonesia yang dimodifikasi sesuai keperluan skenario pengujian.
Metode Pengumpulan Data
Metode pengumpulan data adalah teknik atau cara yang dilakukan oleh peneliti untuk mengumpulkan data guna memperoleh informasi yang dibutuhkan dalam rangka mencapai tujuan penelitian. Dalam penelitian ini, digunakan kombinasi beberapa metode pengumpulan data sebagai berikut:
Studi Dokumen 
Studi dokumen merupakan metode pengumpulan data utama dalam penelitian ini. Studi dokumen dilakukan untuk mendapatkan landasan teoritis dan referensi teknis yang kuat terkait topik penelitian. 
	Dokumen Primer yang dikaji meliputi:
	Paper seminar algoritme Winnowing (Papakonstantinou & Ives, 2003b).Winnowing: Local Algorithms for Document Fingerprinting. 
	Dokumentasi resmi Cloud Vision API. 
	Dokumentasi teknis Next.js, Prisma ORM, dan PostgreSQL. 

	Dokumen Sekunder yang dikaji meliputi:
	Jurnal ilmiah tentang deteksi plagiarisme dan kemiripan dokumen.
	Survei mengenai teknik-teknik deteksi kemiripan teks.
Observasi 
Observasi dilakukan dengan jenis non-participant observation terhadap proses pengumpulan tugas akademik di lingkungan institusi pendidikan yang menggunakan sistem LMS. Observasi bertujuan untuk:
	Memahami alur kerja pengajar dalam menerima dan menilai tugas siswa.
	Mengidentifikasi format file yang paling umum digunakan siswa dalam pengumpulan tugas.
	Mengamati permasalahan yang dihadapi pengajar dalam mendeteksi kemiripan secara manual. 
Hasil observasi menunjukkan bahwa sebagian siswa mengumpulkan tugas dalam format foto tulisan tangan PDF pindaian, yang tidak dapat langsung dianalisis oleh algoritme berbasis teks, sehingga memperkuat kebutuhan integrasi modul OCR dalam sistem.
Wawancara Tidak Terstruktur 
Dilakukan wawancara tidak terstruktur secara informal dengan beberapa tenaga pengajar mengenai:
	Seberapa sering teridentifikasi kemiripan antar tugas siswa secara manual.
	Format file yang paling sering digunakan siswa saat mengumpulkan tugas.
	Fitur apa yang paling dibutuhkan dalam sebuah sistem pendeteksi kemiripan tugas. 
Hasil wawancara menjadi masukan dalam penentuan fitur prioritas sistem, khususnya kebutuhan akan visualisasi lokasi teks yang mirip (Similarity Highlight) agar pengajar dapat mengambil keputusan dengan lebih cepat dan akurat.
Langkah Perancangan Sistem
Pada bagian ini dijelaskan tahapan perancangan sistem yang dikembangkan dalam penelitian. Perancangan sistem dilakukan untuk memberikan gambaran mengenai struktur, komponen, alur kerja, dan hubungan antarbagian sistem sebelum tahap implementasi dilakukan. Sistem yang dirancang berfokus pada fitur deteksi kemiripan isi dokumen tugas, sedangkan LMS mandiri digunakan sebagai media prototipe untuk mendukung proses unggah dokumen, pemrosesan dokumen, dan penyajian hasil deteksi kemiripan.
Arsitektur Sistem 
Arsitektur sistem pada penelitian ini dirancang menggunakan pendekatan layered architecture atau arsitektur berlapis. Pendekatan ini dipilih untuk memisahkan tanggung jawab antarkomponen sehingga alur sistem lebih mudah dipahami, dikembangkan, diuji, dan dipelihara. Secara konseptual, Gambar 3.2 masih merepresentasikan ide dasar sistem, yaitu adanya lapisan pengguna, lapisan antarmuka, lapisan logika aplikasi, lapisan data, dan layanan OCR/kemiripan sebagai pendukung. Namun, pada implementasi final, arsitektur tersebut direalisasikan dalam bentuk integrasi antara aplikasi siswa, aplikasi guru, backend LMS, worker background, basis data LMS, dan layanan originality/OCR eksternal.
Dengan demikian, Gambar 3.2 dapat dipahami sebagai arsitektur konseptual, sedangkan implementasi finalnya menempatkan backend LMS sebagai orchestrator utama. Backend tidak hanya menerima submission dari siswa, tetapi juga menyimpan data akademik, mendaftarkan pemeriksaan originality, melakukan sinkronisasi status secara asynchronous, dan menyediakan endpoint internal bagi guru untuk melihat ringkasan similarity, detail comparison, dan preview visual highlight. Pada implementasi ini, OCR tidak dipanggil langsung oleh frontend sebagai layanan terpisah. OCR berjalan di balik layanan originality/OCR eksternal yang juga menangani fingerprinting, comparison, dan penyediaan aset visual seperti annotated PDF atau highlight image.
 
Gambar 3. 2 Arsitektur Sistem
Penjelasan setiap lapisan: 
	Lapisan Pengguna
Lapisan ini merepresentasikan aktor yang berinteraksi dengan sistem, yaitu siswa, guru, dan admin. Siswa berperan mengumpulkan tugas, guru berperan meninjau submission serta memeriksa hasil deteksi kemiripan, sedangkan admin berperan dalam pengelolaan data dan operasional LMS. Keberadaan tiga aktor ini menunjukkan bahwa sistem tidak dibangun sebagai utilitas similarity yang berdiri sendiri, tetapi sebagai prototipe LMS yang mendukung proses akademik pengumpulan dan pemeriksaan tugas.
	Lapisan Antarmuka Pengguna (Presentation Layer)
Lapisan antarmuka pengguna dibangun menggunakan Next.js dan TypeScript. Pada implementasi final, lapisan ini direalisasikan dalam beberapa aplikasi sesuai peran pengguna, terutama aplikasi siswa untuk pengumpulan tugas dan aplikasi guru untuk review tugas. Antarmuka siswa menyediakan halaman detail tugas dan form submission yang mendukung pengiriman file, link, atau kombinasi keduanya sesuai aturan tugas. Antarmuka guru menyediakan halaman daftar kelas, daftar tugas, daftar submission, detail submission, dan halaman integrity check untuk melihat hasil originality secara rinci.
Berbeda dengan rancangan generik seperti `/upload`, `/documents`, `/compare/[id]`, dan `/results`, implementasi final mengikuti alur LMS yang lebih nyata. Halaman yang digunakan bukan halaman dokumen generik, melainkan halaman pengumpulan tugas siswa, halaman review pengumpulan guru, dan halaman integrity check per submission. Lapisan ini tidak menjalankan pemeriksaan kemiripan secara langsung, tetapi mengirimkan permintaan ke backend LMS dan menampilkan hasil yang sudah diproses.



	Lapisan Logika Aplikasi (Application / Business Logic Layer)
Lapisan logika aplikasi merupakan inti dari integrasi originality pada LMS. Pada implementasi final, lapisan ini berada di backend LMS dan worker internal yang berjalan di sisi server. Backend bertugas memvalidasi submission, menyimpan metadata akademik dan file, membuat atau memperbarui data tracking originality, mengirim dokumen ke layanan originality/OCR eksternal, memetakan status provider ke status internal LMS, serta menyediakan endpoint guru untuk melihat summary, pair comparison, detail segmen, dan visual preview.
Komponen utama pada lapisan ini meliputi:
	Modul Manajemen Submission
Modul ini memvalidasi metode submit, menyimpan file submission, dan mencatat metadata akademik yang berkaitan dengan tugas dan siswa. Modul ini menjadi titik masuk utama sebelum proses originality dijalankan.
	Modul Dispatch Originality
Setelah submission berhasil disimpan, backend mendaftarkan submission ke proses pemeriksaan originality. Modul ini mengirim file dan metadata ke layanan originality/OCR eksternal dalam bentuk request multipart dan menerima identitas dokumen serta job dari provider.
	Modul Worker dan Sinkronisasi Status
Modul ini berjalan di background dan bertugas melakukan polling status pemeriksaan tanpa menghambat request submit siswa. Status seperti `queued`, `processing`, `completed`, atau `failed` disinkronkan ke basis data LMS agar dapat dibaca kembali oleh frontend guru.
	Modul Summary, Comparison, dan Visualisasi
Modul ini mengambil daftar dokumen pembanding, detail comparison, nilai similarity, aset preview, dan data highlight dari provider. Hasilnya kemudian dinormalisasi dan disajikan kembali melalui endpoint internal backend agar frontend guru tidak perlu mengakses provider secara langsung.
Pada implementasi final, tahapan ekstraksi teks, OCR, fingerprinting, dan perhitungan detail kemiripan tidak seluruhnya dijalankan sebagai modul lokal yang berdiri sendiri di dalam LMS. Tahapan tersebut berada di layanan originality/OCR eksternal, sedangkan backend LMS mengelola orkestrasi, sinkronisasi, dan penyajian hasilnya. Dengan demikian, lapisan logika aplikasi final lebih tepat dipahami sebagai pusat pengendali alur integrasi, bukan hanya sebagai mesin pemrosesan teks lokal.
	Layanan Originality/OCR Eksternal
Layanan ini berperan sebagai mesin pemrosesan dokumen. Provider menerima file submission dari backend LMS, menjalankan ekstraksi teks untuk dokumen digital, OCR untuk gambar atau PDF scan bila diperlukan, pembentukan fingerprint, perbandingan antar dokumen, serta penyediaan data visual seperti highlight dan annotated PDF. Pada implementasi akhir, layanan ini adalah komponen terpisah dari LMS dan tidak diakses langsung oleh frontend pengguna.
	Lapisan Data (Data Layer)
Lapisan data bertanggung jawab terhadap penyimpanan dan pengelolaan data yang dimiliki LMS. Basis data yang digunakan adalah PostgreSQL dan dikelola melalui Prisma ORM. Pada implementasi final, data lokal yang paling penting meliputi data pengguna, data tugas, data submission, serta data tracking originality per submission.
Data yang disimpan secara lokal pada LMS antara lain:
	Users dan data akademik lainnya
Menyimpan data pengguna, peran, kelas, modul, tugas, dan relasi akademik lain yang dibutuhkan LMS.
	Task Submissions
Menyimpan data submission siswa, seperti metode submit, tautan submission, lokasi file, jenis file, dan informasi pengumpulan lainnya.
	Task Submission Similarity Checks
Menyimpan ringkasan hasil originality per submission, seperti `similarityDocumentId`, `similarityJobId`, `similarityStatus`, `providerStatus`, `maxSimilarity`, `similarityLevel`, `revision`, dan informasi sinkronisasi lainnya.
Sementara itu, data yang lebih berat dan sangat spesifik terhadap engine originality, seperti hasil OCR detail, pasangan comparison lengkap, layout visual, annotated PDF, dan daftar highlight, berada pada layanan originality/OCR eksternal dan diambil oleh backend LMS saat dibutuhkan. Oleh karena itu, implementasi final tidak sepenuhnya sama dengan model konseptual yang menyimpan `Documents`, `Extracted Text`, `Fingerprints`, `Similarity Results`, dan `Highlight Ranges` seluruhnya di basis data lokal LMS. Secara konseptual kebutuhan data tersebut tetap ada, tetapi secara fisik penyimpanannya dibagi antara basis data LMS dan provider originality/OCR.
Berdasarkan penjelasan tersebut, dapat disimpulkan bahwa arsitektur final project ini pada dasarnya masih sesuai dengan gambar arsitektur sistem yang ditampilkan, tetapi hanya pada level konseptual. Pada level implementasi nyata, terdapat tiga penyesuaian penting. Pertama, frontend dibagi berdasarkan peran siswa dan guru, bukan halaman dokumen generik. Kedua, backend LMS menjadi orchestrator utama dengan worker background untuk menjaga proses originality tetap asynchronous. Ketiga, OCR, fingerprinting, comparison, dan visual highlight dijalankan oleh layanan originality/OCR eksternal, sedangkan LMS berfokus pada pengelolaan submission, sinkronisasi status, dan penyajian hasil kepada guru.
Perancangan Diagram UML 
Perancangan diagram UML digunakan untuk menggambarkan kebutuhan fungsional sistem serta alur interaksi antara aktor dan komponen sistem. Pada penelitian ini, diagram UML difokuskan pada proses utama sistem deteksi kemiripan isi dokumen tugas, mulai dari unggah dokumen oleh mahasiswa, pemrosesan dokumen oleh sistem, hingga pemeriksaan hasil kemiripan oleh dosen.
Diagram UML yang digunakan dalam penelitian ini terdiri dari dua jenis, yaitu Use Case Diagram dan Sequence Diagram. Use Case Diagram digunakan untuk menggambarkan fungsi utama sistem dari sudut pandang aktor, sedangkan Sequence Diagram digunakan untuk menggambarkan urutan interaksi antaraktor dan komponen sistem dalam menjalankan proses deteksi kemiripan dokumen.

	Use Case Diagram
Use Case Diagram digunakan untuk menggambarkan hubungan antara aktor dengan fungsi-fungsi yang disediakan oleh sistem. Pada sistem deteksi kemiripan isi dokumen, terdapat dua aktor utama, yaitu Mahasiswa dan Dosen. Mahasiswa berperan sebagai pengguna yang mengunggah dokumen tugas ke dalam sistem, sedangkan dosen berperan sebagai pengguna yang melakukan pemeriksaan terhadap dokumen yang telah diunggah dan melihat hasil deteksi kemiripan.
 
Gambar 3. 3 Use Case Deteksi Kemiripan isi dokumen sisi Mahasiswa
 
Gambar 3. 4 Use Case Deteksi Kemiripan isi dokumen sisi Dosen
	Sequence Diagram
Sequence diagram digunakan untuk menggambarkan urutan interaksi antar aktor dan komponen sistem dalam proses unggah dokumen tugas serta deteksi kemiripan isi dokumen. Diagram ini menunjukkan bagaimana dokumen yang diunggah oleh pengguna diproses oleh sistem, mulai dari validasi file, ekstraksi teks, preprocessing, pembentukan fingerprint menggunakan algoritma Winnowing, perhitungan kemiripan menggunakan Jaccard Similarity, hingga penyajian hasil kemiripan dan Similarity Highlight pada antarmuka pengguna.
Pada Gambar 3.4, aktor utama yang terlibat adalah Siswa sebagai pengguna yang mengunggah dokumen tugas. Komponen sistem yang berinteraksi dalam proses ini terdiri atas Next.js UI sebagai lapisan antarmuka pengguna, Business Logic Layer sebagai pengendali utama proses sistem,  Cloud vision sebagai modul ekstraksi teks untuk dokumen berbasis gambar atau scan, Winnowing Module sebagai modul pembentukan fingerprint, serta PostgreSQL sebagai basis data yang dikelola melalui Prisma ORM.

 
Gambar 3. 4 Sequence Diagram
Alur proses pada sequence diagram dapat dijelaskan sebagai berikut.
	Inisiasi Pengunggahan Dokumen
Proses dimulai ketika siswa mengunggah dokumen tugas melalui antarmuka pengguna pada sistem frontend. Dokumen yang diunggah dapat berupa dokumen digital, gambar, atau hasil scan sesuai dengan format yang didukung oleh sistem. 


	Pengiriman File ke Backend
Setelah file dipilih oleh siswa, antarmuka Next.js UI mengirimkan file tersebut ke Business Logic Layer pada backend untuk diproses lebih lanjut. 
	Validasi Format File
Business Logic Layer melakukan validasi terhadap file yang diterima. Validasi ini bertujuan untuk memastikan bahwa file yang diunggah memiliki format yang didukung oleh sistem, misalnya DOCX, PDF, gambar, atau file scan. Apabila format file tidak sesuai, sistem akan menolak file dan menampilkan pesan kesalahan kepada pengguna. 
	Penentuan Jenis Dokumen
Setelah file dinyatakan valid, sistem menentukan jenis dokumen yang diunggah. Pada tahap ini terdapat dua kemungkinan alur proses, yaitu dokumen berbasis gambar atau PDF scan dan dokumen digital berbasis teks.
	Dokumen Gambar atau PDF Scan
Jika dokumen yang diunggah berupa gambar atau PDF hasil scan, Business Logic Layer mengirimkan file tersebut ke Cloud Vision. Modul OCR/HTR kemudian melakukan proses ekstraksi teks dari dokumen. Hasil dari proses ini berupa teks hasil ekstraksi yang kemudian dikembalikan ke Business Logic Layer untuk diproses pada tahap berikutnya.
	Dokumen Digital Berbasis Teks
Jika dokumen yang diunggah merupakan dokumen digital berbasis teks, seperti DOCX atau PDF teks, sistem melakukan proses ekstraksi teks secara langsung tanpa melalui modul OCR. Teks hasil ekstraksi kemudian diteruskan ke proses preprocessing.
	Preprocessing dan Position Mapping
Setelah teks diperoleh, Business Logic Layer melakukan preprocessing. Tahap ini meliputi normalisasi teks, seperti case folding, penghapusan tanda baca, penghapusan karakter tidak relevan, dan normalisasi spasi. Selain itu, sistem juga membentuk position map untuk mempertahankan hubungan antara teks hasil preprocessing dengan posisi teks pada dokumen asli. Position map ini digunakan sebagai dasar untuk menampilkan Similarity Highlight. 
	Pembentukan Fingerprint Menggunakan Winnowing
Teks yang telah melalui preprocessing dikirimkan ke Winnowing Module. Modul ini menjalankan proses pembentukan k-gram, perhitungan rolling hash, pemilihan fingerprint melalui sliding window, dan penyimpanan informasi posisi karakter. Hasil dari proses ini berupa fingerprint dokumen beserta informasi posisi yang diperlukan untuk proses pencocokan teks. 
	Penyimpanan Data Dokumen dan Fingerprint
Business Logic Layer menyimpan data dokumen, teks hasil ekstraksi, teks hasil preprocessing, fingerprint, dan position map ke dalam basis data PostgreSQL melalui Prisma ORM. Penyimpanan ini bertujuan agar dokumen dapat dibandingkan dengan dokumen lain yang telah tersimpan di dalam sistem. 
	Pengambilan Data Pembanding
Setelah dokumen baru disimpan, Business Logic Layer mengambil data fingerprint dari dokumen lain yang terdapat dalam basis data. Data ini digunakan sebagai dokumen pembanding dalam proses perhitungan kemiripan. 
	Perhitungan Kemiripan Dokumen
Business Logic Layer melakukan perhitungan kemiripan antara fingerprint dokumen yang baru diunggah dan fingerprint dokumen pembanding menggunakan Jaccard Similarity. Pada tahap ini, sistem juga menentukan rentang teks yang memiliki kecocokan berdasarkan informasi posisi fingerprint. 
	Penyimpanan Hasil Kemiripan
Hasil perhitungan kemiripan disimpan ke dalam tabel SimilarityResult, sedangkan detail rentang teks yang cocok disimpan ke dalam tabel SimilarityMatch. Data ini digunakan untuk menampilkan skor kemiripan dan bagian teks yang disorot pada fitur Similarity Highlight. 
	Pengiriman Hasil ke Frontend
Setelah proses perhitungan selesai, Business Logic Layer mengirimkan hasil deteksi ke antarmuka Next.js UI. Data yang dikirimkan meliputi skor kemiripan, pasangan dokumen yang dibandingkan, serta rentang teks yang terindikasi memiliki kemiripan. 
	Penampilan Hasil kepada Pengguna
Antarmuka Next.js UI menampilkan hasil deteksi kemiripan kepada pengguna. Hasil yang ditampilkan berupa persentase kemiripan dan bagian teks yang terindikasi mirip melalui fitur Similarity Highlight. Sistem tidak secara langsung menyatakan bahwa dokumen merupakan plagiarisme, tetapi menyediakan informasi pendukung yang dapat digunakan untuk proses verifikasi lebih lanjut.
 
Perancangan Basis Data
Perancangan basis data pada penelitian ini difokuskan pada kebutuhan sistem deteksi kemiripan isi dokumen. Berdasarkan Gambar 3.5, basis data sistem terdiri dari tiga entitas utama, yaitu Document, SimilarityResult, dan SimilarityMatch. Entitas Document digunakan untuk menyimpan data dokumen dan hasil pemrosesan teks. Entitas SimilarityResult digunakan untuk menyimpan hasil perbandingan kemiripan antara dua dokumen. Sementara itu, entitas SimilarityMatch digunakan untuk menyimpan detail rentang teks yang memiliki kemiripan dan digunakan sebagai dasar fitur Similarity Highlight.
 
Gambar 3. 5 Perancangan Basis Data


	Tabel Document
Tabel Document digunakan untuk menyimpan data setiap dokumen tugas yang diunggah ke dalam sistem. Selain menyimpan informasi file, tabel ini juga menyimpan hasil ekstraksi teks, hasil preprocessing, fingerprint dokumen, serta pemetaan posisi karakter yang dibutuhkan untuk fitur Similarity Highlight.
Atribut pada tabel Document adalah sebagai berikut:
	id
Atribut ini merupakan primary key yang digunakan sebagai identitas unik dari setiap dokumen. Tipe data yang digunakan adalah String dengan format CUID. 
	title
Atribut ini digunakan untuk menyimpan judul dokumen yang diunggah ke dalam sistem. 
	fileName
Atribut ini digunakan untuk menyimpan nama file asli dari dokumen yang diunggah oleh pengguna. 
	fileType
Atribut ini digunakan untuk menyimpan jenis atau format file dokumen, seperti DOCX, PDF, gambar, atau format lain yang didukung oleh sistem. 
	filePath
Atribut ini digunakan untuk menyimpan lokasi penyimpanan file dokumen pada sistem. 
	extractedText
Atribut ini digunakan untuk menyimpan teks hasil ekstraksi dari dokumen. Untuk dokumen digital, teks diperoleh melalui proses text extraction, sedangkan untuk dokumen berbasis gambar atau scan, teks diperoleh melalui proses OCR/HTR. 
	normalizedText
Atribut ini digunakan untuk menyimpan teks hasil preprocessing. Teks pada atribut ini telah melalui proses normalisasi, seperti case folding, penghapusan tanda baca, penghapusan karakter tidak relevan, dan normalisasi spasi. 
	fingerprints
Atribut ini digunakan untuk menyimpan fingerprint dokumen yang dihasilkan oleh algoritma Winnowing. Data fingerprint disimpan dalam format Json agar dapat memuat kumpulan hash dan informasi pendukung lainnya secara fleksibel. 
	positionMap
Atribut ini digunakan untuk menyimpan pemetaan posisi karakter antara teks hasil preprocessing dengan teks asli dokumen. Data ini diperlukan agar sistem dapat menampilkan kembali bagian teks yang terindikasi mirip pada posisi yang sesuai. 
	createdAt
Atribut ini digunakan untuk menyimpan waktu ketika data dokumen dibuat atau disimpan ke dalam sistem.
	Tabel SimilarityResult
Tabel SimilarityResult digunakan untuk menyimpan hasil perbandingan kemiripan antara dua dokumen. Dalam sistem ini, satu data hasil kemiripan selalu merepresentasikan hubungan antara Dokumen A dan Dokumen B. Dokumen A merupakan dokumen utama yang diperiksa, sedangkan Dokumen B merupakan dokumen pembanding.
Atribut pada tabel SimilarityResult adalah sebagai berikut:
	id
Atribut ini merupakan primary key yang digunakan sebagai identitas unik dari setiap hasil perbandingan kemiripan. Tipe data yang digunakan adalah String dengan format CUID. 
	documentAId
Atribut ini merupakan foreign key yang merujuk pada atribut id di tabel Document. Atribut ini merepresentasikan dokumen pertama atau Dokumen A yang digunakan dalam proses perbandingan. 
	documentBId
Atribut ini merupakan foreign key yang merujuk pada atribut id di tabel Document. Atribut ini merepresentasikan dokumen kedua atau Dokumen B yang digunakan sebagai dokumen pembanding. 
	similarityScore
Atribut ini digunakan untuk menyimpan nilai kemiripan antara Dokumen A dan Dokumen B. Nilai ini diperoleh dari hasil perhitungan Jaccard Similarity terhadap fingerprint kedua dokumen dan disimpan dalam bentuk numerik bertipe Float. 
	createdAt
Atribut ini digunakan untuk menyimpan waktu ketika hasil perbandingan kemiripan dibuat atau disimpan ke dalam sistem. 
Relasi antara tabel Document dan SimilarityResult menunjukkan bahwa satu dokumen dapat digunakan dalam banyak hasil perbandingan, baik sebagai Dokumen A maupun sebagai Dokumen B. Dengan demikian, sistem dapat menyimpan banyak hasil kemiripan antar pasangan dokumen.
	Tabel SimilarityMatch
Tabel SimilarityMatch digunakan untuk menyimpan detail bagian teks yang terindikasi memiliki kemiripan antara dua dokumen. Tabel ini berfungsi sebagai pendukung fitur Similarity Highlight, yaitu fitur yang menampilkan bagian teks yang mirip secara visual pada dokumen yang dibandingkan.
Atribut pada tabel SimilarityMatch adalah sebagai berikut:
	id
Atribut ini merupakan primary key yang digunakan sebagai identitas unik dari setiap data kecocokan teks. Tipe data yang digunakan adalah String dengan format CUID. 
	similarityResultId
Atribut ini merupakan foreign key yang merujuk pada atribut id di tabel SimilarityResult. Atribut ini menunjukkan bahwa setiap data kecocokan teks terhubung dengan satu hasil perbandingan kemiripan tertentu. 
	documentAStart
Atribut ini digunakan untuk menyimpan posisi awal teks yang terindikasi mirip pada Dokumen A. 
	documentAEnd
Atribut ini digunakan untuk menyimpan posisi akhir teks yang terindikasi mirip pada Dokumen A. 
	documentBStart
Atribut ini digunakan untuk menyimpan posisi awal teks yang terindikasi mirip pada Dokumen B. 
	documentBEnd
Atribut ini digunakan untuk menyimpan posisi akhir teks yang terindikasi mirip pada Dokumen B. 
	matchedTextA
Atribut ini digunakan untuk menyimpan potongan teks pada Dokumen A yang terindikasi memiliki kemiripan. 
	matchedTextB
Atribut ini digunakan untuk menyimpan potongan teks pada Dokumen B yang memiliki kemiripan dengan potongan teks pada Dokumen A. 
Relasi antara tabel SimilarityResult dan SimilarityMatch menunjukkan bahwa satu hasil perbandingan kemiripan dapat memiliki banyak detail kecocokan teks. Hal ini memungkinkan sistem untuk menampilkan lebih dari satu bagian teks yang mirip pada dokumen yang dibandingkan.
Perancangan Antarmuka Pengguna 
Perancangan antarmuka pengguna dilakukan untuk memberikan gambaran mengenai tampilan dan alur interaksi pengguna terhadap sistem yang dikembangkan. 
Sistem ini memiliki beberapa halaman utama yang berkaitan langsung dengan proses deteksi kemiripan isi dokumen tugas, yaitu halaman unggah tugas, halaman laporan integritas akademik, dan halaman detail laporan integritas. Setiap halaman dirancang untuk mendukung alur kerja sistem mulai dari proses pengumpulan dokumen, penyajian hasil deteksi kemiripan, hingga penelusuran bagian teks yang memiliki kemiripan.
 
Gambar 3. 6 Antarmuka upload tugas siswa
Gambar 3.6 menampilkan rancangan antarmuka halaman unggah tugas yang digunakan oleh mahasiswa untuk mengirimkan dokumen tugas ke dalam sistem. Komponen ini dirancang agar mahasiswa dapat mengunggah dokumen tugas secara mudah, baik dalam format dokumen digital maupun file berbasis gambar sesuai format yang didukung oleh sistem.
Setelah dokumen berhasil diunggah, sistem akan menyimpan metadata dokumen dan mempersiapkan file tersebut untuk tahap pemrosesan berikutnya, yaitu ekstraksi teks, preprocessing, pembentukan fingerprint, dan perhitungan kemiripan.
Halaman ini menjadi bagian awal dari alur kerja sistem deteksi kemiripan karena dokumen yang diunggah melalui halaman ini akan menjadi input utama dalam proses analisis kemiripan isi dokumen tugas.

 
Gambar 3. 7 Antarmuka Laporan Integritas Akademik
Gambar 3.7 menampilkan rancangan halaman laporan integritas akademik yang digunakan untuk melihat ringkasan hasil deteksi kemiripan dokumen tugas. Halaman ini dirancang untuk pengguna dosen atau pihak yang berwenang dalam melakukan pemeriksaan terhadap tugas mahasiswa. 
Pada bagian bawah halaman terdapat tabel detail integritas pengajuan yang menampilkan daftar dokumen, tingkat kecocokan, dan risk level. Informasi ini membantu dosen melihat dokumen mana yang perlu diperiksa lebih lanjut. Tingkat kecocokan ditampilkan dalam bentuk persentase, sedangkan risk level digunakan untuk mempermudah interpretasi hasil, seperti rendah, sedang, atau tinggi.
Halaman ini berfungsi sebagai pusat ringkasan hasil deteksi kemiripan. Dengan adanya halaman laporan ini, dosen tidak perlu memeriksa dokumen satu per satu secara manual sejak awal, tetapi dapat memprioritaskan pemeriksaan pada dokumen yang memiliki skor kemiripan lebih tinggi.

 
Gambar 3. 8 Antarmuka Detail Laporan Integritas
Gambar 3.8 menampilkan rancangan antarmuka detail laporan integritas yang digunakan untuk melihat hasil perbandingan dokumen secara lebih rinci. Pada halaman ini, sistem menampilkan daftar dokumen yang memiliki tingkat kemiripan dengan dokumen yang sedang diperiksa. Daftar tersebut ditampilkan pada panel sebelah kiri dengan informasi nama dokumen dan tingkat kecocokan.
Pada bagian utama halaman, sistem menampilkan dua dokumen yang dibandingkan, yaitu dokumen tugas siswa pertama dan dokumen tugas siswa kedua. Bagian teks yang terindikasi memiliki kemiripan ditampilkan dengan penanda visual atau Similarity Highlight. Fitur ini bertujuan untuk memudahkan dosen melihat bagian mana dari dokumen yang memiliki kesamaan, sehingga hasil deteksi tidak hanya disajikan dalam bentuk angka persentase.
Sistem tidak secara langsung memutuskan bahwa suatu dokumen merupakan plagiarisme, tetapi menyediakan informasi pendukung agar dosen dapat melakukan penilaian lebih objektif.
Metode Pengujian Sistem
Metode pengujian sistem dilakukan untuk mengetahui apakah sistem deteksi kemiripan isi dokumen tugas yang dikembangkan dapat berjalan sesuai dengan kebutuhan dan tujuan penelitian. Pengujian ini difokuskan pada fungsi utama sistem, yaitu proses unggah dokumen, ekstraksi teks, preprocessing, pembentukan fingerprint menggunakan algoritma Winnowing, perhitungan kemiripan menggunakan Jaccard Similarity, visualisasi bagian teks yang mirip melalui fitur Similarity Highlight, serta penyajian hasil kemiripan kepada pengguna.
Pengujian sistem pada penelitian ini dilakukan melalui beberapa tahapan, yaitu pengujian fungsional, pengujian ekstraksi teks, pengujian skenario kemiripan dokumen, pengujian Similarity Highlight, dan pengujian performa sistem. Setiap pengujian dilakukan untuk memperoleh gambaran mengenai kemampuan sistem dalam memproses dokumen tugas dan menghasilkan informasi kemiripan yang dapat digunakan sebagai alat bantu verifikasi oleh dosen.
Pengujian Fungsionalitas Sistem
Pengujian fungsional dilakukan menggunakan metode black-box testing. Metode ini digunakan untuk menguji fungsi sistem berdasarkan masukan dan keluaran yang dihasilkan, tanpa memperhatikan struktur kode program di dalamnya. Pengujian ini bertujuan untuk memastikan bahwa setiap fitur yang dikembangkan telah berjalan sesuai dengan kebutuhan sistem.
Aspek yang diuji pada pengujian fungsional meliputi proses unggah dokumen, validasi format file, ekstraksi teks, preprocessing, pembentukan fingerprint, perhitungan skor kemiripan, tampilan hasil deteksi, serta visualisasi bagian teks yang terindikasi mirip. Hasil pengujian dinyatakan berhasil apabila sistem mampu memberikan keluaran sesuai dengan skenario uji yang telah ditentukan.
Tabel 3.X Pengujian Fungsional Sistem
No	Fitur yang Diuji	Skenario Uji	Hasil yang Diharapkan
1	Unggah dokumen	Pengguna mengunggah dokumen dengan format yang didukung	Sistem menerima dan menyimpan dokumen
2	Validasi file	Pengguna mengunggah file dengan format yang tidak didukung	Sistem menolak file dan menampilkan pesan kesalahan
3	Ekstraksi teks dokumen digital	Sistem memproses dokumen DOCX atau PDF berbasis teks	Teks berhasil diekstraksi
4	Ekstraksi teks dokumen gambar/scan	Sistem memproses gambar, scan, atau tulisan tangan menggunakan OCR/HTR	Teks hasil ekstraksi ditampilkan
5	Preprocessing teks	Sistem melakukan normalisasi teks hasil ekstraksi	Teks menjadi format yang siap diproses
6	Pembentukan fingerprint	Sistem menjalankan proses k-gram, hashing, dan Winnowing	Fingerprint dokumen berhasil terbentuk
7	Perhitungan kemiripan	Sistem membandingkan dua dokumen	Sistem menghasilkan skor kemiripan
8	Similarity Highlight	Sistem menampilkan bagian teks yang terindikasi mirip	Segmen teks yang mirip berhasil disorot
9	Laporan hasil	Pengguna membuka halaman hasil deteksi	Sistem menampilkan skor kemiripan dan bukti visual

Pengujian Ekstraksi Teks 
Pengujian ekstraksi teks dilakukan untuk mengetahui kemampuan sistem dalam mengubah dokumen tugas menjadi teks yang dapat diproses oleh algoritma Winnowing. Pada penelitian ini, proses ekstraksi teks dibedakan menjadi dua jenis, yaitu text extraction untuk dokumen digital dan OCR/HTR untuk dokumen berbasis gambar.
Dokumen digital seperti DOCX dan PDF berbasis teks diproses menggunakan text extraction. Sementara itu, dokumen berupa gambar, hasil scan, atau tulisan tangan diproses menggunakan OCR/HTR. Hasil ekstraksi teks kemudian digunakan sebagai masukan pada tahap preprocessing, pembentukan fingerprint, dan perhitungan kemiripan.
Pengujian ini dilakukan dengan membandingkan teks hasil ekstraksi dengan teks acuan. Tujuannya adalah untuk mengetahui seberapa banyak teks yang berhasil dikenali oleh sistem. Penilaian dilakukan dengan menghitung persentase kata yang terbaca benar dibandingkan dengan jumlah kata pada teks acuan.
Rumus yang digunakan adalah sebagai berikut:
Tingkat Keberhasilan Ekstraksi = (Jumlah kata terbaca benar / Jumlah kata pada teks acuan) × 100%
Tabel 3.X Pengujian Ekstraksi Teks
No	Jenis Dokumen	Metode Ekstraksi	Indikator Pengujian
1	DOCX	Text extraction	Teks berhasil dibaca oleh sistem
2	PDF berbasis teks	Text extraction	Teks berhasil diekstraksi
3	PDF scan	OCR/HTR	Teks hasil scan berhasil dikenali
4	Gambar tulisan tangan	OCR/HTR	Teks tulisan tangan berhasil dikenali sebagian atau seluruhnya
5	Gambar kualitas rendah/miring	OCR/HTR	Sistem menghasilkan teks atau memberikan informasi kegagalan ekstraksi

Hasil pengujian ekstraksi teks digunakan untuk mengetahui kualitas masukan yang akan diproses oleh algoritma Winnowing. Semakin baik hasil ekstraksi teks, semakin besar kemungkinan sistem menghasilkan skor kemiripan yang mendekati kondisi sebenarnya.
Pengujian Skenario Kemiripan Isi Dokumen
Pengujian skenario kemiripan dokumen dilakukan untuk mengetahui kemampuan sistem dalam membedakan tingkat kemiripan antar dokumen. Pengujian dilakukan dengan membuat pasangan dokumen yang memiliki tingkat kemiripan berbeda secara terkontrol.
Agar pengujian tetap realistis, penelitian ini menggunakan 20 pasang dokumen uji yang dibagi ke dalam empat skenario. Setiap skenario terdiri dari 5 pasang dokumen.
Tabel 3.X Skenario Pengujian Kemiripan Dokumen
Skenario	Jumlah Pasang	Karakteristik Dokumen	Kategori yang Diharapkan
S1	5 pasang	Dokumen identik atau hampir identik	Sangat tinggi
S2	5 pasang	Dokumen mengalami modifikasi ringan, seperti penghapusan kalimat, penambahan kalimat, atau perubahan urutan paragraf	Tinggi
S3	5 pasang	Dokumen mengalami modifikasi sedang, seperti perubahan sebagian isi, parafrase sebagian, atau penambahan konten baru	Sedang
S4	5 pasang	Dokumen memiliki topik dan isi yang berbeda	Rendah

Setiap pasangan dokumen diproses melalui tahapan ekstraksi teks, preprocessing, pembentukan fingerprint menggunakan algoritma Winnowing, dan perhitungan kemiripan menggunakan Jaccard Similarity. Hasil akhir pengujian berupa skor kemiripan dalam bentuk persentase.
Untuk mempermudah interpretasi hasil, skor kemiripan dikelompokkan ke dalam kategori tertentu. Kategori ini digunakan sebagai dasar untuk melihat apakah hasil deteksi sistem sesuai dengan karakteristik dokumen uji.
Tabel 3.X Kategori Skor Kemiripan
Rentang Skor Kemiripan	Kategori
0% – 24%	Rendah
25% – 49%	Sedang
50% – 74%	Tinggi
75% – 100%	Sangat tinggi

Penggunaan kategori tetap bertujuan agar hasil pengujian lebih konsisten dan mudah diinterpretasikan. Dengan kategori tersebut, sistem diharapkan mampu menghasilkan skor tinggi pada dokumen yang identik atau memiliki kemiripan besar, serta menghasilkan skor rendah pada dokumen yang berbeda.
Pengujian Similalrity Highlight
Pengujian Similarity Highlight dilakukan untuk memastikan bahwa sistem tidak hanya menghasilkan skor kemiripan, tetapi juga mampu menampilkan bagian teks yang terindikasi mirip. Pengujian ini penting karena fitur highlight merupakan salah satu komponen utama dalam sistem yang dikembangkan.
Pengujian dilakukan dengan membandingkan bagian teks yang sengaja dibuat mirip pada dokumen uji dengan bagian teks yang disorot oleh sistem. Hasil highlight dianggap sesuai apabila sistem menyorot bagian teks yang memang memiliki kemiripan dengan dokumen pembanding.
Tabel 3.X Pengujian Similarity Highlight
No	Skenario	Indikator Pengujian	Hasil yang Diharapkan
1	Dokumen identik	Sistem menyorot bagian teks yang sama	Sebagian besar teks yang sama berhasil disorot
2	Dokumen mirip sebagian	Sistem menyorot bagian yang disalin atau dimodifikasi ringan	Highlight muncul pada segmen yang relevan
3	Dokumen berbeda	Sistem tidak banyak menyorot teks	Highlight tidak muncul atau sangat sedikit
4	Dokumen hasil OCR/HTR	Sistem menyorot bagian mirip berdasarkan teks hasil ekstraksi	Highlight tetap dapat ditampilkan berdasarkan hasil ekstraksi

Untuk menilai hasil highlight, digunakan tiga kategori penilaian, yaitu sesuai, sebagian sesuai, dan tidak sesuai.
Tabel 3.X Kategori Penilaian Similarity Highlight
Kategori	Keterangan
Sesuai	Highlight muncul pada bagian teks yang memang memiliki kemiripan
Sebagian sesuai	Highlight muncul pada bagian yang relevan, tetapi belum mencakup seluruh bagian yang mirip
Tidak sesuai	Highlight muncul pada bagian yang tidak relevan atau tidak muncul pada bagian yang seharusnya mirip

Pengujian ini digunakan untuk mengetahui apakah position mapping dan hasil fingerprint dapat dimanfaatkan untuk menampilkan bukti visual kemiripan secara tepat. Dengan adanya Similarity Highlight, dosen dapat meninjau bagian dokumen yang terindikasi mirip tanpa hanya bergantung pada skor persentase.
Pengujian Performa Sistem
Pengujian performa dilakukan untuk mengetahui waktu yang dibutuhkan sistem dalam memproses dokumen hingga menghasilkan skor kemiripan dan visualisasi hasil. Pengujian ini bertujuan untuk mengetahui apakah sistem dapat berjalan dengan waktu proses yang wajar pada perangkat pengujian.
Pengukuran waktu dilakukan terhadap beberapa komponen utama, yaitu waktu ekstraksi teks, waktu preprocessing, waktu pembentukan fingerprint menggunakan Winnowing, waktu perhitungan similarity, dan waktu total pemrosesan. Pengukuran dilakukan sebanyak tiga kali pada setiap jenis dokumen, kemudian dihitung nilai rata-ratanya.
Tabel 3.X Komponen Pengujian Performa
No	Komponen Waktu	Keterangan
1	Waktu ekstraksi teks	Waktu yang dibutuhkan sistem untuk membaca teks dari dokumen digital atau dokumen berbasis gambar
2	Waktu preprocessing	Waktu untuk melakukan normalisasi teks dan pembuatan position map
3	Waktu Winnowing	Waktu untuk membentuk k-gram, menghitung hash, menerapkan sliding window, dan membentuk fingerprint
4	Waktu perhitungan similarity	Waktu untuk menghitung nilai Jaccard Similarity antar dokumen
5	Waktu total	Waktu keseluruhan dari proses ekstraksi hingga hasil kemiripan ditampilkan
Hasil pengujian performa digunakan untuk mengetahui waktu proses rata-rata pada setiap jenis dokumen dan mengidentifikasi tahapan yang paling memengaruhi waktu pemrosesan. Pengujian ini tidak dimaksudkan untuk membuktikan bahwa sistem selalu bekerja dalam batas waktu tertentu, melainkan untuk memberikan gambaran mengenai efisiensi sistem dalam memproses dokumen tugas.
Metode Analisis Hasil Pengujian 
Metode analisis hasil pengujian digunakan untuk mengolah dan menafsirkan data yang diperoleh dari proses pengujian sistem. Analisis dilakukan untuk mengetahui sejauh mana sistem deteksi kemiripan isi dokumen tugas yang dikembangkan mampu menjalankan fungsi utamanya, yaitu mengekstraksi teks dari dokumen, membentuk fingerprint menggunakan algoritma Winnowing, menghitung skor kemiripan menggunakan Jaccard Similarity, menampilkan bagian teks yang terindikasi mirip melalui Similarity Highlight, serta menyajikan hasil deteksi kepada pengguna.
Analisis hasil pengujian dalam penelitian ini disesuaikan dengan metode pengujian sistem yang telah dijelaskan pada subbab sebelumnya. Adapun aspek yang dianalisis meliputi hasil pengujian fungsional, hasil pengujian ekstraksi teks, hasil pengujian skenario kemiripan dokumen, hasil pengujian Similarity Highlight, dan hasil pengujian performa sistem. Setiap hasil pengujian dianalisis menggunakan indikator yang sesuai dengan tujuan pengujian masing-masing.
Analisis Hasil Pengujian Fungsional
Analisis hasil pengujian fungsional dilakukan berdasarkan pengujian black-box testing. Pengujian ini berfokus pada kesesuaian antara masukan yang diberikan kepada sistem dan keluaran yang dihasilkan oleh sistem. Setiap fitur diuji berdasarkan skenario uji yang telah ditentukan, kemudian hasil aktual dibandingkan dengan hasil yang diharapkan.
Hasil pengujian fungsional dianalisis menggunakan kategori “berhasil” dan “tidak berhasil”. Suatu fitur dinyatakan berhasil apabila sistem mampu menghasilkan keluaran sesuai dengan skenario yang telah dirancang. Sebaliknya, fitur dinyatakan tidak berhasil apabila sistem tidak memberikan keluaran yang sesuai, terjadi kesalahan proses, atau fitur tidak dapat digunakan sebagaimana mestinya.
Persentase keberhasilan pengujian fungsional dihitung menggunakan rumus berikut:
Persentase Keberhasilan = (Jumlah Skenario Berhasil / Total Skenario Pengujian) × 100%
Hasil analisis pengujian fungsional digunakan untuk menilai apakah fitur utama sistem telah berjalan sesuai kebutuhan. Fitur yang dianalisis meliputi unggah dokumen, validasi format file, ekstraksi teks, preprocessing, pembentukan fingerprint, perhitungan kemiripan, tampilan hasil deteksi, dan Similarity Highlight.
Analisis Hasil Ekstraksi Teks 
Analisis hasil ekstraksi teks dilakukan untuk mengetahui kemampuan sistem dalam mengubah dokumen tugas menjadi teks yang dapat diproses oleh algoritma Winnowing. Analisis ini dilakukan terhadap dua jenis proses ekstraksi, yaitu text extraction untuk dokumen digital dan OCR/HTR untuk dokumen berbasis gambar, scan, atau tulisan tangan.
Pada dokumen digital seperti DOCX dan PDF berbasis teks, analisis dilakukan dengan melihat apakah teks berhasil dibaca oleh sistem secara utuh dan dapat digunakan pada tahap preprocessing. Sementara itu, pada dokumen gambar, scan, atau tulisan tangan, analisis dilakukan dengan membandingkan teks hasil ekstraksi OCR/HTR terhadap teks acuan yang telah disiapkan sebelumnya.
Tingkat keberhasilan ekstraksi teks dihitung menggunakan rumus berikut:
Tingkat Keberhasilan Ekstraksi = (Jumlah Kata Terbaca Benar / Jumlah Kata pada Teks Acuan) × 100%
Hasil ekstraksi dikatakan baik apabila sebagian besar kata penting pada dokumen berhasil dikenali dan dapat digunakan pada proses deteksi kemiripan. Apabila terdapat kesalahan pembacaan, hasil tersebut tetap dianalisis untuk mengetahui pengaruhnya terhadap proses preprocessing, pembentukan fingerprint, dan skor kemiripan yang dihasilkan.
Analisis ini juga digunakan untuk mengidentifikasi jenis dokumen yang paling mudah dan paling sulit diproses oleh sistem. Dengan demikian, hasil pengujian ekstraksi teks tidak hanya menunjukkan keberhasilan sistem, tetapi juga menjelaskan keterbatasan sistem dalam memproses dokumen berbasis gambar atau tulisan tangan.
Analisis Hasil Pengujian Kemiripan Dokumen
Analisis hasil pengujian kemiripan dokumen dilakukan untuk mengetahui kemampuan sistem dalam membedakan tingkat kemiripan antar dokumen. Hasil pengujian diperoleh dari pasangan dokumen uji yang telah dibagi ke dalam empat skenario, yaitu dokumen identik, dokumen dengan modifikasi ringan, dokumen dengan modifikasi sedang, dan dokumen berbeda.
Setiap pasangan dokumen diproses melalui tahapan ekstraksi teks, preprocessing, pembentukan fingerprint menggunakan algoritma Winnowing, dan perhitungan kemiripan menggunakan Jaccard Similarity. Nilai kemiripan yang dihasilkan sistem ditampilkan dalam bentuk persentase.
Skor kemiripan dihitung berdasarkan rumus Jaccard Similarity sebagai berikut:
J\left(A,B\right)=\frac{\left|A\cap B\right|}{\left|A\cup B\right|}
Keterangan:
A = himpunan fingerprint dokumen pertama
B = himpunan fingerprint dokumen kedua
|A ∩ B| = jumlah fingerprint yang sama pada kedua dokumen
|A ∪ B| = jumlah seluruh fingerprint unik dari kedua dokumen
Untuk mempermudah interpretasi, skor kemiripan dikelompokkan ke dalam kategori yang bisa dilihat pada table .
Kategori tersebut digunakan untuk melihat kesesuaian antara karakteristik dokumen uji dan skor yang dihasilkan sistem. Dokumen identik atau hampir identik diharapkan menghasilkan skor pada kategori sangat tinggi. Dokumen dengan modifikasi ringan diharapkan menghasilkan skor pada kategori tinggi. Dokumen dengan modifikasi sedang diharapkan menghasilkan skor pada kategori sedang. Sementara itu, dokumen dengan isi dan topik berbeda diharapkan menghasilkan skor pada kategori rendah.
Analisis dilakukan dengan membandingkan kategori hasil sistem terhadap kategori yang diharapkan pada setiap skenario. Persentase kesesuaian kategori dihitung menggunakan rumus berikut:
Persentase Kesesuaian Kategori = (Jumlah Pasangan Sesuai Kategori / Total Pasangan Dokumen) × 100%
Hasil analisis ini digunakan untuk mengetahui apakah sistem mampu membedakan tingkat kemiripan dokumen secara terukur berdasarkan fingerprint yang dihasilkan oleh algoritma Winnowing.
Analisis Hasil Similarity Highlight
Analisis hasil Similarity Highlight dilakukan untuk menilai kemampuan sistem dalam menampilkan bagian teks yang terindikasi mirip pada dokumen yang dibandingkan. Analisis ini penting karena sistem yang dikembangkan tidak hanya bertujuan menghasilkan skor kemiripan, tetapi juga menyediakan bukti visual berupa bagian teks yang memiliki kemiripan.
Analisis dilakukan dengan membandingkan bagian teks yang memang dibuat mirip pada dokumen uji dengan bagian teks yang disorot oleh sistem. Hasil highlight dianalisis menggunakan tiga kategori, yaitu sesuai, sebagian sesuai, dan tidak sesuai. Untuk lebih rincinya bisa dilihat pada table .
Similarity Highlight dikatakan sesuai apabila sistem mampu menyorot bagian teks yang benar-benar memiliki kemiripan dengan dokumen pembanding. Apabila highlight hanya muncul pada sebagian teks yang relevan, maka hasilnya dikategorikan sebagian sesuai. Sementara itu, apabila highlight muncul pada bagian yang tidak relevan atau tidak muncul pada bagian teks yang seharusnya mirip, maka hasilnya dikategorikan tidak sesuai.
Analisis ini digunakan untuk mengetahui apakah position mapping dan hasil fingerprint dapat dimanfaatkan untuk menampilkan lokasi kemiripan secara visual. Dengan adanya analisis Similarity Highlight, hasil deteksi kemiripan tidak hanya dinilai dari skor persentase, tetapi juga dari kemampuan sistem dalam menyajikan bukti visual yang dapat diperiksa oleh dosen.
Analisis Hasil Pengujian Performa
Analisis hasil pengujian performa dilakukan untuk mengetahui waktu yang dibutuhkan sistem dalam memproses dokumen hingga menghasilkan hasil deteksi kemiripan. Pengujian performa dianalisis berdasarkan beberapa komponen waktu, yaitu waktu ekstraksi teks, waktu preprocessing, waktu pembentukan fingerprint menggunakan Winnowing, waktu perhitungan similarity, dan waktu total pemrosesan.
Setiap pengujian dilakukan sebanyak tiga kali pada jenis dokumen yang sama. Hasil dari tiga kali pengujian tersebut kemudian dihitung nilai rata-ratanya menggunakan rumus berikut:
\mathrm{Rata-rata\ Waktu\ Proses}=\frac{W_1+W_2+W_3}{3}
Keterangan:
W1 = waktu pengujian pertama
W2 = waktu pengujian kedua
W3 = waktu pengujian ketiga
Analisis performa dilakukan dengan membandingkan waktu proses pada beberapa jenis dokumen, seperti DOCX, PDF berbasis teks, PDF scan, dan gambar tulisan tangan. Hasil analisis digunakan untuk mengetahui jenis dokumen yang membutuhkan waktu pemrosesan paling besar dan tahapan proses yang menjadi bottleneck dalam sistem.
Pengujian performa dalam penelitian ini tidak dimaksudkan untuk membuktikan bahwa sistem selalu bekerja dalam batas waktu tertentu, tetapi untuk memberikan gambaran mengenai efisiensi sistem dalam memproses dokumen tugas. Dengan demikian, hasil analisis performa digunakan sebagai dasar untuk mengevaluasi kelayakan sistem dan memberikan rekomendasi perbaikan pada tahap pengembangan berikutnya.
Analisis Ketercapaian Tujuan Penelitian
Analisis ketercapaian tujuan penelitian dilakukan dengan menggabungkan seluruh hasil pengujian yang telah dilakukan. Hasil pengujian fungsional digunakan untuk mengetahui apakah fitur sistem berjalan sesuai kebutuhan. Hasil pengujian ekstraksi teks digunakan untuk mengetahui kemampuan sistem dalam membaca dokumen digital maupun dokumen berbasis gambar. Hasil pengujian kemiripan dokumen digunakan untuk mengetahui kemampuan sistem dalam menghasilkan skor kemiripan. Hasil pengujian Similarity Highlight digunakan untuk mengetahui kemampuan sistem dalam menampilkan bukti visual kemiripan. Sementara itu, hasil pengujian performa digunakan untuk mengetahui efisiensi waktu pemrosesan sistem.
Sistem dinilai mampu memenuhi tujuan penelitian apabila memenuhi beberapa indikator berikut:
	Fitur utama sistem dapat berjalan sesuai skenario pengujian fungsional.
	Sistem mampu mengekstraksi teks dari dokumen digital dan dokumen berbasis gambar.
	Sistem mampu menghasilkan skor kemiripan berdasarkan perbandingan fingerprint dokumen.
	Sistem mampu mengelompokkan skor kemiripan ke dalam kategori rendah, sedang, tinggi, atau sangat tinggi.
	Sistem mampu menampilkan bagian teks yang terindikasi mirip melalui Similarity Highlight.
	Sistem mampu memproses dokumen dalam waktu yang wajar berdasarkan hasil pengujian performa.
Hasil analisis keseluruhan digunakan untuk menjawab rumusan masalah dan menilai apakah sistem deteksi kemiripan isi dokumen yang dikembangkan dapat digunakan sebagai alat bantu dosen dalam memverifikasi kemiripan dokumen tugas. Selain itu, hasil analisis juga digunakan untuk mengidentifikasi keterbatasan sistem, terutama pada pemrosesan dokumen berbasis gambar atau tulisan tangan yang sangat bergantung pada kualitas hasil ekstraksi teks.
 

HASIL DAN PEMBAHASAN

Hasil
4.1.1 Hasil Implementasi Sistem
Berdasarkan proses perancangan dan implementasi yang telah dilakukan pada Bab III, penelitian ini berhasil menghasilkan sebuah Learning Management System (LMS) mandiri yang mendukung proses pengumpulan tugas sekaligus pemeriksaan kemiripan isi dokumen tugas. Sistem yang dibangun tidak hanya menerima dokumen digital berbasis teks, tetapi juga mendukung dokumen berbentuk PDF pindaian dan gambar yang memerlukan proses ekstraksi teks terlebih dahulu. Dengan demikian, sistem mampu menangani kebutuhan pemeriksaan tugas yang lebih beragam dibandingkan pemeriksaan dokumen teks biasa.
Secara fungsional, sistem yang dihasilkan telah mencakup beberapa kemampuan utama, yaitu unggah dokumen tugas oleh siswa, penyimpanan dokumen dan metadata submission, pengiriman dokumen ke layanan originality/OCR, sinkronisasi status pemeriksaan secara asynchronous oleh backend, penyajian ringkasan skor kemiripan kepada guru, serta visualisasi bagian dokumen yang memiliki kemiripan melalui fitur Similarity Highlight. Implementasi ini menunjukkan bahwa tujuan utama penelitian, yaitu membangun sistem deteksi kemiripan isi dokumen tugas berbasis LMS, telah berhasil direalisasikan dalam bentuk prototipe yang berjalan.
Hasil implementasi juga menunjukkan bahwa sistem tidak memposisikan skor kemiripan sebagai vonis plagiarisme otomatis. Skor dan highlight digunakan sebagai alat bantu verifikasi untuk guru agar proses peninjauan dokumen lebih terarah. Pendekatan ini sesuai dengan prinsip integritas akademik, yaitu bahwa keputusan akhir tetap berada pada penilai manusia, sedangkan sistem bertindak sebagai alat bantu analisis awal.

4.1.2 Hasil Implementasi Arsitektur dan Modul Sistem
Arsitektur yang dirancang pada Bab III berhasil direalisasikan dalam bentuk sistem yang terdiri dari lapisan antarmuka pengguna, lapisan logika aplikasi, lapisan data, dan layanan originality/OCR eksternal. Pada implementasi akhir, frontend dipisahkan berdasarkan peran pengguna, yaitu aplikasi siswa untuk pengumpulan tugas dan aplikasi guru untuk review tugas. Backend LMS berperan sebagai orchestrator utama yang menghubungkan proses akademik submission dengan proses pemeriksaan originality dan visualisasi hasil.
Ketika siswa mengirimkan tugas, backend terlebih dahulu menyimpan submission akademik ke basis data LMS. Setelah itu, backend mendaftarkan submission tersebut ke antrian pemeriksaan originality. Dokumen kemudian dikirim ke layanan originality/OCR eksternal untuk diproses lebih lanjut. Hasil pemeriksaan tidak ditunggu secara langsung pada saat submit, melainkan disinkronkan oleh worker backend secara asynchronous. Setelah status pemeriksaan selesai, guru dapat membuka halaman integrity check untuk melihat daftar dokumen pembanding, skor kemiripan tertinggi, detail pasangan dokumen, serta preview visual highlight dokumen.
Realisasi arsitektur ini memperlihatkan bahwa sistem yang dibangun tidak sekadar melakukan pencocokan teks secara lokal di antarmuka pengguna, melainkan memanfaatkan alur backend yang lebih terkontrol. Pola ini memberi keuntungan dalam konsistensi data, keamanan akses aset visual, dan kemudahan sinkronisasi status pemeriksaan. Selain itu, karena frontend guru tidak berkomunikasi langsung dengan layanan originality/OCR eksternal, seluruh akses tetap melalui backend LMS sehingga kontrak data lebih mudah dikendalikan.
Tabel 4.1 menunjukkan modul utama yang berhasil direalisasikan dalam sistem.
Tabel 4.1 Implementasi Modul Sistem
No	Modul Sistem	Fungsi Utama	Hasil Implementasi
1	Modul pengumpulan tugas	Menerima file atau link tugas dari siswa	Berhasil direalisasikan pada alur submit tugas siswa
2	Modul manajemen submission	Menyimpan metadata tugas, file, dan riwayat pengumpulan	Berhasil direalisasikan pada backend LMS
3	Modul dispatch originality	Mengirim submission ke layanan originality/OCR	Berhasil direalisasikan melalui backend sebagai orchestrator
4	Modul worker sinkronisasi	Memantau status proses, retry, dan pembaruan hasil	Berhasil direalisasikan secara asynchronous
5	Modul ringkasan integrity	Menampilkan status originality, skor tertinggi, dan level risiko	Berhasil direalisasikan pada backend dan frontend guru
6	Modul detail comparison	Menampilkan pasangan dokumen pembanding dan nilai similarity	Berhasil direalisasikan pada halaman integrity check
7	Modul visual highlight	Menampilkan preview dokumen, PDF anotasi, dan highlight segmen mirip	Berhasil direalisasikan melalui proxy backend dan antarmuka guru

4.1.3 Hasil Implementasi Basis Data
Pada tahap implementasi, rancangan basis data konseptual pada Bab III mengalami penyesuaian agar selaras dengan struktur LMS yang sudah ada. Jika pada rancangan awal entitas utama digambarkan sebagai Document, SimilarityResult, dan SimilarityMatch, maka pada implementasi akhir kebutuhan tersebut direalisasikan dengan memanfaatkan tabel submission akademik LMS dan tabel tracking originality yang terhubung langsung dengan submission tersebut.
Data submission disimpan pada tabel task_submissions sebagai representasi dokumen tugas yang benar-benar dikumpulkan siswa. Tabel ini menyimpan hubungan dengan tugas, siswa, metode submit, tautan submission, dan lokasi file submission. Selanjutnya, status pemeriksaan originality disimpan pada tabel task_submission_similarity_checks. Tabel ini memuat informasi penting seperti tenant, external id, similarity document id dari provider, similarity job id, similarity status, provider status, skor kemiripan tertinggi, similarity level, revision, retry count, checked at, last synced at, dan error message.
Dengan struktur ini, penyimpanan data menjadi lebih sesuai dengan alur LMS nyata. Sistem tidak perlu membuat tabel dokumen terpisah di luar submission akademik yang sudah ada. Detail pasangan dokumen pembanding dan data highlight visual tidak seluruhnya dipersistenkan sebagai tabel lokal terpisah, melainkan diambil dari layanan originality/OCR ketika guru membuka halaman integrity check. Pendekatan tersebut membuat basis data LMS tetap ringkas, sementara detail visual tetap dapat ditampilkan sesuai kebutuhan.
Secara konseptual, task_submissions dapat dipandang sebagai realisasi entitas Document pada rancangan Bab III, sedangkan task_submission_similarity_checks berperan sebagai realisasi lokal untuk ringkasan SimilarityResult. Adapun detail SimilarityMatch dan highlight divisualisasikan dari payload comparison yang diterima dari layanan originality/OCR. Dengan kata lain, kebutuhan fungsional rancangan tetap terpenuhi, meskipun bentuk fisik tabel pada implementasi akhir menyesuaikan arsitektur LMS dan pola integrasi yang digunakan.
Tabel 4.2 merangkum implementasi basis data utama yang digunakan sistem.
Tabel 4.2 Implementasi Tabel Basis Data
No	Nama Tabel/Entitas	Peran dalam Sistem	Data Utama yang Disimpan
1	task_submissions	Menyimpan dokumen tugas yang dikumpulkan siswa	taskId, userId, submitMethod, submissionLink, submissionFilePath, submissionFileType
2	task_submission_similarity_checks	Menyimpan status dan ringkasan hasil originality	taskSubmissionId, similarityDocumentId, similarityStatus, providerStatus, maxSimilarity, similarityLevel, revision
3	Data comparison provider	Menyediakan detail pasangan dokumen pembanding	comparisonId, similarityScore, pairedDocumentId, pairedExternalId, metadata pembanding
4	Data visual provider	Menyediakan preview visual dan highlight	annotatedPdfUrl, layoutMap, highlights, sourceDocument, comparisonDocument

4.1.4 Hasil Implementasi Alur Pemrosesan Dokumen
Hasil implementasi alur pemrosesan dokumen menunjukkan bahwa sistem telah mampu memproses submission tugas dari tahap awal hingga hasil pemeriksaan dapat dibaca guru. Proses dimulai ketika siswa mengunggah file tugas atau melampirkan tautan submission pada halaman pengumpulan tugas. Backend kemudian memvalidasi metode submit yang digunakan, menyimpan data submission ke basis data, dan memastikan file tersimpan pada lokasi yang dapat diakses ulang oleh sistem.
Setelah submission berhasil disimpan, backend tidak langsung menghitung similarity secara synchronous. Sistem justru mendaftarkan submission ke proses pemeriksaan originality melalui mekanisme enqueue. Worker backend kemudian mengambil submission yang berstatus belum diproses, mengubah status lokal menjadi processing, dan mengirim file ke layanan originality/OCR eksternal. Pada tahap ini, layanan eksternal menangani proses ekstraksi teks, OCR bila dibutuhkan, fingerprinting, serta pembandingan terhadap dokumen lain yang tersedia pada tenant yang sama.
Berikutnya, worker backend melakukan polling status hingga dokumen mencapai status selesai atau gagal. Jika pemeriksaan berhasil, backend menyimpan ringkasan status dan skor kemiripan tertinggi ke tabel tracking lokal. Ketika guru membuka halaman integrity check, backend mengambil pasangan dokumen pembanding, detail segmen kemiripan, serta aset visual seperti annotated PDF atau highlight image, lalu menyajikannya kembali ke frontend guru melalui endpoint internal LMS. Dengan alur ini, sistem berhasil menerapkan pemrosesan bertahap yang stabil dan sesuai dengan kebutuhan lingkungan LMS.
Alur implementasi ini penting karena menunjukkan bahwa hasil similarity tidak dihitung di sisi klien. Seluruh proses utama dikendalikan oleh backend agar data submission, status pemeriksaan, retry, dan akses visual dapat dipantau secara konsisten.

4.1.5 Hasil Implementasi Antarmuka Pengguna
Antarmuka pengguna yang diimplementasikan pada penelitian ini terdiri dari antarmuka siswa dan antarmuka guru. Pada sisi siswa, sistem menyediakan halaman pengumpulan tugas yang menampilkan informasi deadline, metode submit, deskripsi tugas, lampiran soal, serta form pengiriman tugas. Melalui halaman ini, siswa dapat mengirim tugas berupa file, link, atau kombinasi keduanya sesuai aturan tugas yang telah ditentukan. Jika submission sudah pernah dikirim, sistem juga menampilkan status pengumpulan sebelumnya agar siswa dapat mengetahui kondisi submission yang tersimpan.
Pada sisi guru, sistem menyediakan halaman review tugas yang menampilkan daftar kelas, mata pelajaran, daftar tugas, dan daftar submission yang masuk. Halaman ini memudahkan guru menelusuri submission secara bertahap dari level kelas hingga submission individu. Di dalam tabel submission, guru dapat melihat indikator originality check seperti status pemeriksaan dan nilai kemiripan tertinggi. Jika hasil pemeriksaan telah selesai, guru dapat melanjutkan ke halaman integrity check untuk meninjau hasil secara rinci.
Halaman integrity check merupakan antarmuka utama untuk hasil deteksi kemiripan. Pada halaman ini ditampilkan judul tugas, nama siswa sumber, nilai kemiripan tertinggi, jumlah dokumen pembanding, status pemeriksaan, daftar comparison di panel samping, dan preview dokumen sumber serta dokumen pembanding. Sistem juga menampilkan PDF hasil anotasi atau preview highlight berbasis layout map serta daftar segmen teks yang terindikasi mirip. Dengan demikian, guru tidak hanya menerima angka similarity, tetapi juga mendapatkan bukti visual yang membantu proses verifikasi.
Implementasi antarmuka ini menunjukkan bahwa sistem berhasil menghubungkan proses akademik pengumpulan tugas dengan proses pemeriksaan originality dalam satu alur kerja yang dapat dipahami pengguna. Hal ini penting karena fitur deteksi kemiripan akan lebih bermanfaat apabila menyatu dengan proses review tugas yang memang dijalankan guru sehari-hari.

4.1.6 Dataset dan Skenario Pengujian
Dataset pengujian pada penelitian ini dibagi ke dalam beberapa kelompok sesuai tujuan evaluasi yang telah ditetapkan pada Bab III. Kelompok pertama digunakan untuk menguji kemampuan sistem dalam membedakan tingkat kemiripan isi dokumen, yaitu skenario dokumen identik, modifikasi ringan, modifikasi sedang, dan dokumen berbeda. Kelompok kedua digunakan untuk menguji kemampuan ekstraksi teks pada dokumen non-digital, seperti PDF hasil pindaian dan gambar tulisan tangan. Pembagian ini dilakukan agar pengujian tidak hanya menilai skor similarity, tetapi juga menilai mutu teks hasil ekstraksi yang menjadi input bagi proses pemeriksaan kemiripan.
Pada penulisan hasil akhir, jumlah pasangan dokumen yang ditampilkan pada Bab IV harus sama dengan dataset final yang benar-benar digunakan saat eksperimen. Jika pengujian inti menggunakan 20 pasang dokumen, maka masing-masing skenario berisi 5 pasang. Jika seluruh 40 pasang dokumen pada rancangan awal dipakai, maka setiap skenario berisi 10 pasang. Penulisan pada Tabel 4.3 perlu mengikuti jumlah final yang benar-benar digunakan dalam eksperimen agar konsisten dengan data pengujian.
Selain dokumen teks, pengujian ekstraksi juga perlu menampilkan beberapa contoh dokumen gambar, PDF scan, dan tulisan tangan yang mewakili variasi kualitas input. Variasi ini penting karena kualitas OCR akan sangat memengaruhi kualitas similarity yang dihasilkan sistem. Oleh sebab itu, laporan hasil pengujian harus menjelaskan karakteristik dokumen, bukan hanya jumlahnya.
Tabel 4.3 berikut dapat digunakan untuk menyajikan dataset final penelitian.
Tabel 4.3 Dataset Pengujian Final
No	Skenario/Jenis Dokumen	Jumlah	Karakteristik	Kategori yang Diharapkan
1	S1 - dokumen identik	[isi]	Dokumen B merupakan salinan atau sangat mendekati dokumen A	Sangat tinggi
2	S2 - modifikasi ringan	[isi]	Terdapat perubahan kecil seperti penambahan, pengurangan, atau perubahan urutan kalimat	Tinggi
3	S3 - modifikasi sedang	[isi]	Terdapat parafrase dan perubahan isi sebagian	Sedang
4	S4 - berbeda total	[isi]	Dokumen berbeda topik dan isi	Rendah
5	PDF scan	[isi]	Dokumen pindaian yang memerlukan OCR	Keberhasilan ekstraksi dapat diukur
6	Gambar tulisan tangan	[isi]	Dokumen foto atau scan tulisan tangan	Keberhasilan ekstraksi dapat diukur

4.1.7 Hasil Pengujian Fungsionalitas Sistem
Pengujian fungsional dilakukan untuk memastikan bahwa seluruh fitur utama sistem berjalan sesuai kebutuhan. Berdasarkan implementasi yang telah dibangun, fitur yang diuji meliputi proses pengumpulan tugas, validasi file, penyimpanan submission, inisiasi originality check, sinkronisasi status pemeriksaan, penampilan daftar dokumen pembanding, penampilan skor kemiripan, dan visualisasi highlight.
Secara umum, sistem telah memenuhi kebutuhan fungsional utama karena alur siswa mengirim tugas sampai guru membuka hasil integrity check dapat dijalankan dalam satu siklus proses yang utuh. Fitur pengumpulan tugas berhasil menerima input file atau link sesuai metode tugas. Setelah submission tersimpan, backend juga berhasil membuat antrean pemeriksaan originality sehingga proses akademik dan proses similarity saling terhubung. Dari sisi guru, halaman review tugas dan integrity check berhasil menampilkan status originality dan dokumen pembanding sesuai hasil backend.
Pada bagian hasil akhir, penulis perlu mengisi kolom hasil aktual dan status pada tabel pengujian berdasarkan eksperimen yang benar-benar dilakukan. Jika semua skenario berhasil, persentase keberhasilan dapat dihitung dengan membandingkan jumlah skenario berhasil terhadap total skenario pengujian.
Tabel 4.4 Hasil Pengujian Fungsional
No	Fitur yang Diuji	Hasil Aktual	Status
1	Unggah dokumen	Sistem menerima file dan menyimpan submission	[isi]
2	Validasi file	Sistem menolak file yang tidak sesuai format	[isi]
3	Penyimpanan submission	Data tugas dan file tersimpan pada LMS	[isi]
4	Dispatch originality	Submission masuk ke antrean pemeriksaan	[isi]
5	Sinkronisasi status	Status queued, processing, completed, atau failed dapat diperbarui	[isi]
6	Daftar submission guru	Guru dapat melihat status originality dan max similarity	[isi]
7	Halaman integrity check	Guru dapat membuka detail comparison dan visual	[isi]
8	Preview highlight	PDF anotasi atau visual highlight dapat ditampilkan	[isi]

Persentase Keberhasilan = (Jumlah skenario berhasil / Total skenario pengujian) x 100%
Persentase Keberhasilan = [isi berdasarkan hasil aktual]

4.1.8 Hasil Pengujian Ekstraksi Teks
Pengujian ekstraksi teks dilakukan terhadap beberapa jenis dokumen untuk mengetahui kualitas input yang nantinya diproses pada tahap pemeriksaan kemiripan. Pada dokumen DOCX dan PDF berbasis teks, sistem diharapkan mampu membaca isi dokumen dengan tingkat kehilangan teks yang sangat kecil karena ekstraksi dilakukan langsung dari file digital. Pada dokumen PDF scan dan gambar tulisan tangan, kualitas hasil ekstraksi sangat bergantung pada kejelasan dokumen, tata letak, resolusi, pencahayaan, dan keterbacaan tulisan.
Hasil pengujian ekstraksi teks perlu menunjukkan bahwa dokumen digital memiliki tingkat keberhasilan lebih tinggi daripada dokumen hasil scan atau tulisan tangan. Kondisi ini wajar karena dokumen digital tidak membutuhkan OCR yang rentan terhadap noise visual. Namun demikian, jika dokumen non-digital masih dapat menghasilkan teks yang cukup terbaca, maka sistem tetap dapat memanfaatkannya sebagai dasar pemeriksaan kemiripan. Temuan ini penting karena menjelaskan bahwa kualitas OCR memengaruhi kualitas similarity, tetapi tidak meniadakan fungsi sistem secara keseluruhan.
Penulis perlu membandingkan teks hasil ekstraksi dengan teks acuan pada setiap sampel dan menghitung persentase kata yang terbaca benar. Selain persentase, catatan kesalahan seperti kata terpotong, karakter salah baca, atau bagian yang hilang juga perlu dicantumkan agar pembaca memahami keterbatasan proses OCR.
Tabel 4.5 Hasil Pengujian Ekstraksi Teks
No	Jenis Dokumen	Jumlah Kata Acuan	Jumlah Kata Terbaca Benar	Persentase Keberhasilan	Catatan
1	DOCX	[isi]	[isi]	[isi]	[isi]
2	PDF berbasis teks	[isi]	[isi]	[isi]	[isi]
3	PDF scan	[isi]	[isi]	[isi]	[isi]
4	Gambar tulisan tangan	[isi]	[isi]	[isi]	[isi]
5	Gambar kualitas rendah/miring	[isi]	[isi]	[isi]	[isi]

Tingkat Keberhasilan Ekstraksi = (Jumlah kata terbaca benar / Jumlah kata pada teks acuan) x 100%

4.1.9 Hasil Pengujian Kemiripan Isi Dokumen
Pengujian kemiripan isi dokumen merupakan bagian inti dari penelitian ini karena digunakan untuk menilai apakah sistem mampu membedakan dokumen identik, dokumen yang dimodifikasi, dan dokumen yang berbeda. Setelah teks diperoleh dari hasil ekstraksi, sistem membandingkan dokumen melalui layanan originality yang menghasilkan skor kemiripan dan pasangan dokumen pembanding. Hasil tersebut kemudian disajikan kembali pada LMS dalam bentuk persentase similarity dan daftar comparison.
Secara konseptual, hasil yang diharapkan adalah dokumen pada skenario S1 memperoleh skor sangat tinggi, skenario S2 memperoleh skor tinggi, skenario S3 memperoleh skor sedang, dan skenario S4 memperoleh skor rendah. Jika pola ini muncul secara konsisten, maka sistem dapat dikatakan berhasil membedakan tingkat kemiripan isi dokumen sesuai karakteristik data uji. Pada bagian hasil, penulis perlu menampilkan seluruh skor per pasangan dokumen, lalu merangkum rata-rata skor per skenario agar pola hasil lebih mudah dibaca.
Selain skor, bagian ini juga penting untuk menjelaskan bahwa nilai similarity sangat dipengaruhi oleh kualitas teks hasil ekstraksi. Pada dokumen hasil OCR, skor dapat menurun apabila hasil bacaan teks tidak sepenuhnya sama meskipun sumber dokumen mirip. Oleh karena itu, interpretasi hasil similarity perlu dilakukan bersama hasil pengujian ekstraksi teks.
Tabel 4.6 Skor Kemiripan per Pasangan Dokumen
No	Skenario	Kode Pasangan	Skor Kemiripan	Kategori
1	S1	[isi]	[isi]	[isi]
2	S1	[isi]	[isi]	[isi]
3	S2	[isi]	[isi]	[isi]
4	S2	[isi]	[isi]	[isi]
5	S3	[isi]	[isi]	[isi]
6	S3	[isi]	[isi]	[isi]
7	S4	[isi]	[isi]	[isi]
8	S4	[isi]	[isi]	[isi]

Tabel 4.7 Rata-rata Skor Kemiripan per Skenario
No	Skenario	Rata-rata Skor	Kategori Dominan	Kesesuaian dengan Harapan
1	S1	[isi]	[isi]	[isi]
2	S2	[isi]	[isi]	[isi]
3	S3	[isi]	[isi]	[isi]
4	S4	[isi]	[isi]	[isi]

4.1.10 Hasil Pengujian Similarity Highlight
Hasil pengujian Similarity Highlight digunakan untuk menilai apakah sistem mampu menampilkan bukti visual dari segmen yang terindikasi mirip. Pada implementasi akhir, fitur ini ditampilkan pada halaman integrity check guru dalam bentuk daftar segmen teks yang cocok serta preview dokumen sumber dan dokumen pembanding. Jika file berbentuk PDF dan layanan originality menyediakan annotated PDF, sistem dapat menampilkan PDF hasil anotasi. Jika tidak, sistem menampilkan preview visual berdasarkan layout map dan daftar highlight yang diterima.
Fitur highlight memberi nilai tambah yang signifikan karena guru tidak perlu hanya mengandalkan skor persentase. Dengan melihat bagian dokumen yang ditandai, guru dapat menilai apakah kemiripan terjadi pada istilah umum, bagian penjelasan yang panjang, atau segmen yang sangat spesifik. Oleh karena itu, evaluasi highlight harus memperhatikan ketepatan letak segmen, relevansi teks yang ditandai, dan kegunaan tampilan dalam membantu proses verifikasi.
Pada bagian hasil, penulis perlu mengelompokkan hasil highlight ke dalam kategori sesuai, sebagian sesuai, dan tidak sesuai. Selain itu, sangat disarankan untuk menampilkan satu contoh highlight pada dokumen digital dan satu contoh highlight pada dokumen hasil OCR agar pembaca dapat melihat perbedaan perilaku sistem pada dua jenis masukan tersebut.
Tabel 4.8 Hasil Pengujian Similarity Highlight
No	Kode Pasangan/Jenis Dokumen	Hasil Highlight	Kategori	Keterangan
1	Dokumen identik	[isi]	[isi]	[isi]
2	Modifikasi ringan	[isi]	[isi]	[isi]
3	Modifikasi sedang	[isi]	[isi]	[isi]
4	Dokumen berbeda	[isi]	[isi]	[isi]
5	Dokumen hasil OCR	[isi]	[isi]	[isi]

4.1.11 Hasil Pengujian Performa Sistem
Pengujian performa dilakukan untuk mengetahui efisiensi waktu proses sistem mulai dari ekstraksi teks sampai hasil pemeriksaan dapat ditampilkan. Dalam implementasi yang dibangun, waktu total pemrosesan dipengaruhi oleh jenis dokumen, ukuran file, kebutuhan OCR, kecepatan komunikasi dengan layanan originality/OCR, dan waktu sinkronisasi worker backend. Oleh karena itu, performa dokumen digital berbasis teks umumnya diharapkan lebih cepat dibandingkan dokumen PDF scan atau gambar tulisan tangan.
Pengukuran performa perlu dilakukan minimal tiga kali untuk setiap jenis dokumen, kemudian dihitung nilai rata-ratanya. Komponen waktu yang diamati meliputi waktu ekstraksi teks, waktu preprocessing, waktu pembentukan fingerprint atau pemrosesan originality, waktu perhitungan similarity, dan waktu total dari submission sampai hasil siap ditinjau. Meskipun sistem ini memanfaatkan proses asynchronous, pengukuran tetap dapat dilakukan dengan mencatat durasi setiap tahap utama.
Hasil pengujian performa penting untuk menunjukkan kelayakan sistem sebagai alat bantu praktis. Jika waktu proses masih berada pada kisaran yang dapat diterima untuk konteks review tugas, maka sistem dapat dikatakan layak digunakan sebagai pendukung pemeriksaan akademik. Sebaliknya, bila ada tahapan yang jauh lebih lambat daripada tahapan lain, bagian ini perlu menjelaskan tahapan tersebut sebagai potensi bottleneck.
Tabel 4.9 Hasil Pengujian Performa
No	Jenis Dokumen	Waktu Ekstraksi	Waktu Preprocessing	Waktu Similarity/Originality	Waktu Total	Rata-rata
1	DOCX	[isi]	[isi]	[isi]	[isi]	[isi]
2	PDF berbasis teks	[isi]	[isi]	[isi]	[isi]	[isi]
3	PDF scan	[isi]	[isi]	[isi]	[isi]	[isi]
4	Gambar tulisan tangan	[isi]	[isi]	[isi]	[isi]	[isi]

Rata-rata waktu proses = (W1 + W2 + W3) / 3

4.1.12 Rekapitulasi Hasil Pengujian
Secara umum, hasil pengujian pada penelitian ini diarahkan untuk menjawab tiga hal utama, yaitu apakah sistem berhasil berjalan secara fungsional, apakah sistem mampu menghasilkan skor kemiripan yang selaras dengan skenario uji, dan apakah Similarity Highlight benar-benar membantu proses verifikasi guru. Rekapitulasi hasil diperlukan agar pembaca dapat melihat gambaran umum penelitian tanpa harus membaca setiap tabel secara terpisah.
Apabila hasil pengujian menunjukkan bahwa fitur utama berjalan baik, dokumen digital memiliki hasil ekstraksi tinggi, skenario kemiripan dapat dibedakan secara konsisten, dan highlight dapat menampilkan segmen relevan, maka sistem dapat dinilai berhasil memenuhi tujuan penelitian. Namun, jika pada dokumen hasil OCR terjadi penurunan akurasi atau highlight hanya sebagian sesuai, temuan tersebut tetap harus dicantumkan sebagai bagian dari karakteristik nyata sistem.
Bagian rekapitulasi juga menjadi jembatan menuju pembahasan. Pada bagian ini, penulis dapat menyoroti temuan paling penting, seperti jenis dokumen yang memberi hasil terbaik, tahapan proses yang paling lambat, serta kondisi di mana similarity score atau highlight perlu ditafsirkan lebih hati-hati.
Tabel 4.10 Rekapitulasi Hasil Pengujian Sistem
No	Aspek Pengujian	Indikator Ringkas	Hasil Rekapitulasi
1	Fungsionalitas	Persentase skenario berhasil	[isi]
2	Ekstraksi teks	Jenis dokumen dengan hasil terbaik dan terendah	[isi]
3	Kemiripan dokumen	Kesesuaian skor terhadap skenario S1 sampai S4	[isi]
4	Similarity Highlight	Persentase kategori sesuai/sebagian sesuai/tidak sesuai	[isi]
5	Performa	Tahap proses paling dominan terhadap waktu total	[isi]

Pembahasan
4.2.1 Pembahasan Kesesuaian Implementasi Sistem dengan Rancangan Bab III
Hasil implementasi menunjukkan bahwa rancangan sistem pada Bab III secara umum berhasil direalisasikan, meskipun terdapat penyesuaian pada bentuk implementasi akhir. Rancangan awal menggambarkan alur sistem yang terdiri dari upload dokumen, ekstraksi teks, preprocessing, pembentukan fingerprint, perhitungan kemiripan, dan visualisasi highlight. Pada implementasi akhir, keseluruhan fungsi tersebut tetap ada, tetapi sebagian proses dijalankan melalui layanan originality/OCR eksternal yang diorkestrasi oleh backend LMS. Dengan demikian, inti rancangan tetap tercapai, sedangkan penyesuaian dilakukan pada level arsitektur teknis.
Penyesuaian paling nyata terlihat pada basis data. Pada rancangan awal, entitas Document, SimilarityResult, dan SimilarityMatch digambarkan sebagai tabel utama sistem. Pada implementasi akhir, kebutuhan tersebut dipetakan ke struktur LMS yang sudah ada, yaitu task_submissions dan task_submission_similarity_checks, sementara detail comparison dan highlight diambil dari layanan originality/OCR saat dibutuhkan. Penyesuaian ini tidak mengurangi fungsi sistem, justru menunjukkan bahwa rancangan konseptual dapat diadaptasi ke lingkungan LMS riil tanpa harus mengganti struktur akademik yang sudah berjalan.
Dengan demikian, implementasi akhir dapat dinilai konsisten dengan tujuan perancangan Bab III. Sistem tetap mendukung submission tugas, pemeriksaan kemiripan, dan visualisasi hasil, tetapi diwujudkan melalui arsitektur yang lebih sesuai dengan kebutuhan integrasi dan pengelolaan data pada LMS.

4.2.2 Pembahasan Hasil Pengujian Fungsional dan Ekstraksi Teks
Jika hasil pengujian fungsional menunjukkan tingkat keberhasilan yang tinggi, maka dapat disimpulkan bahwa sistem telah memenuhi kebutuhan dasar sebagai prototipe LMS dengan fitur originality check. Keberhasilan ini penting karena modul deteksi kemiripan tidak berdiri sendiri, melainkan harus terhubung dengan alur submission tugas, review guru, dan penyajian hasil yang mudah diakses. Sistem yang mampu menjalankan seluruh alur tersebut secara utuh menunjukkan bahwa integrasi fitur ke dalam konteks LMS berhasil dilakukan.
Pada pengujian ekstraksi teks, dokumen digital cenderung memberikan hasil yang lebih stabil karena isi teks dapat dibaca langsung dari file. Sebaliknya, dokumen PDF scan dan gambar tulisan tangan lebih rentan menghasilkan kesalahan bacaan karena sangat dipengaruhi kondisi visual input. Temuan ini sejalan dengan teori pada Bab II bahwa hasil OCR atau HTR tidak selalu sempurna dan dapat dipengaruhi kualitas gambar, tata letak, serta keterbacaan tulisan. Oleh karena itu, apabila penelitian menunjukkan bahwa skor ekstraksi tertinggi diperoleh pada DOCX atau PDF teks, sedangkan skor lebih rendah muncul pada scan dan tulisan tangan, maka hasil tersebut masih sesuai dengan karakteristik teknologi yang digunakan.
Pembahasan ini menegaskan bahwa keberhasilan deteksi kemiripan tidak hanya ditentukan oleh algoritma similarity, tetapi juga oleh mutu teks hasil ekstraksi. Dengan kata lain, kualitas OCR merupakan faktor penting yang secara langsung memengaruhi kemampuan sistem dalam menilai kemiripan isi dokumen.

4.2.3 Pembahasan Hasil Pengujian Kemiripan Dokumen dan Similarity Highlight
Apabila skor pada skenario S1 cenderung berada pada kategori sangat tinggi, skor S2 berada pada kategori tinggi, skor S3 berada pada kategori sedang, dan skor S4 berada pada kategori rendah, maka sistem dapat dinilai mampu membedakan tingkat kemiripan dokumen sesuai tujuan penelitian. Pola ini menunjukkan bahwa mekanisme fingerprinting dan pemeriksaan similarity yang digunakan dalam sistem telah bekerja secara terarah. Semakin konsisten pola tersebut muncul pada seluruh pasangan dokumen, semakin kuat pula kesimpulan bahwa sistem layak digunakan sebagai alat bantu penyaringan awal dokumen yang patut dicurigai mirip.
Di sisi lain, hasil Similarity Highlight menjadi pembuktian bahwa sistem tidak hanya berhenti pada angka similarity. Highlight memberi konteks yang dibutuhkan guru untuk memahami sumber kemiripan. Jika highlight banyak berada pada kategori sesuai atau sebagian sesuai, maka dapat disimpulkan bahwa sistem telah mampu menyediakan bukti visual yang berguna untuk verifikasi. Temuan ini penting karena salah satu kontribusi utama penelitian ini adalah menghadirkan sistem yang lebih informatif dibandingkan sistem yang hanya menampilkan persentase similarity.
Namun, pada dokumen hasil OCR, kemungkinan masih terdapat kasus di mana skor similarity tidak setinggi yang diharapkan atau highlight belum sepenuhnya akurat. Hal tersebut tidak selalu berarti algoritma similarity gagal, tetapi dapat disebabkan oleh perbedaan hasil ekstraksi teks dari dokumen yang secara visual tampak serupa. Karena itu, hasil similarity dan highlight harus dibaca bersama dengan kualitas OCR, terutama pada dokumen scan dan tulisan tangan.

4.2.4 Pembahasan Performa dan Keterbatasan Sistem
Hasil pengujian performa digunakan untuk menilai apakah sistem cukup layak digunakan dalam proses pemeriksaan tugas. Bila dokumen digital menunjukkan waktu proses yang lebih singkat dibandingkan dokumen scan atau tulisan tangan, hal tersebut menunjukkan bahwa kebutuhan OCR menjadi faktor utama yang menambah durasi pemrosesan. Waktu tambahan juga dapat berasal dari mekanisme dispatch, polling status, dan pengambilan data visual dari layanan originality/OCR eksternal. Dengan demikian, bottleneck sistem kemungkinan besar bukan hanya pada perhitungan similarity, tetapi pada proses ekstraksi teks dan sinkronisasi layanan eksternal.
Keterbatasan utama sistem terletak pada ketergantungan terhadap kualitas dokumen masukan dan kualitas hasil OCR. Dokumen dengan pencahayaan buruk, sudut pengambilan miring, tulisan sulit dibaca, atau hasil scan tidak jelas dapat menurunkan mutu teks hasil ekstraksi. Selain itu, karena sistem menggunakan layanan eksternal untuk originality dan visualisasi, kestabilan jaringan dan respons layanan juga memengaruhi waktu proses serta kelengkapan hasil yang diterima LMS.
Meskipun demikian, keterbatasan tersebut tidak menghilangkan kontribusi sistem. Sistem tetap memberikan mekanisme deteksi kemiripan yang lebih terstruktur dibandingkan pemeriksaan manual, terutama karena telah memadukan submission tugas, ringkasan skor, daftar pembanding, dan highlight visual dalam satu alur kerja. Keterbatasan ini justru dapat menjadi dasar rekomendasi pengembangan lanjutan, misalnya peningkatan kualitas preprocessing dokumen gambar, optimasi OCR, penyempurnaan penyimpanan detail comparison lokal, atau evaluasi parameter similarity yang lebih mendalam.
Pembahasan Hasil Ekstraksi Teks dan Pengaruh OCR
Pembahasan Pengaruh Preprocessing dan Position Mapping
Pembahasan Hasil Algoritma Winnowing terhadap Skenario Kemiripan
Pembahasan Kontribusi Similarity Highlight
Pembahasan Performa Sistem
Pembahasan Ketercapaian Tujuan Penelitian
Pembahasan Keterbatasan Sistem
Rekomendasi Pengembangan Sistem


 
DAFTAR PUSTAKA

Foltýnek, T., Meuschke, N., & Gipp, B. (2020). Academic plagiarism detection: A systematic literature review. Dalam ACM Computing Surveys (Vol. 52, Nomor 6). Association for Computing Machinery. https://doi.org/10.1145/3345317
Hanafi, R., Haq, A., & Agustin, N. (2024). Comparison of Web Page Rendering Methods Based on Next.js Framework Using Page Loading Time Test. Teknika, 13(1), 102–108. https://doi.org/10.34148/teknika.v13i1.769
Mentari, M., Rozi, F., & Rahayu, M. P. (2022). Cross-Language Text Document Plagiarism Detection System Using Winnowing Method. Dalam Journal of Applied Intelligent System (Vol. 7, Nomor 1).
Panduan-PBM-2020-Polmed. (t.t.).
Papakonstantinou, Yannis., & Ives, Z. G. (2003a). Proceedings of the 2003 ACM SIGMOD International Conference on Management of Data. ACM.
Papakonstantinou, Yannis., & Ives, Z. G. (2003b). Proceedings of the 2003 ACM SIGMOD International Conference on Management of Data. ACM.
Pati, S., & Zaki, Y. (2025). Evaluating the Efficacy of Next.js: A Comparative Analysis with React.js on Performance, SEO, and Global Network Equity. http://arxiv.org/abs/2502.15707
Puranik, B., Sonawane, A., Rasal, R., Renakale, P., & Kakad, D. (2025). Containerization in Web Development: Docker and Kubernetes. 163–173. https://doi.org/10.5220/0013588700004664
Ramli, M. S., Cokrowibowo, S., & Rustan, M. F. (2021). Uji Plagiarism pada Tugas Mahasiswa Menggunakan Algoritma Winnowing. Journal of Applied Computer Science and Technology, 2(2), 108–112. https://doi.org/10.52158/jacost.v2i2.177
Sarawale, D., Jaiswal, P., Ozarkar, D., & Barse, Y. (2025). Assignment Checker: An Intelligent System for Detecting Student Assignment Plagiarism. Dalam © 2025 JAAFR | (Vol. 3). www.jaafr.org
Shrestha, S., Gautam, S., Sharma, K., & Bhandari, A. (2023). Winnowing Algorithm: A Powerful Tool for Identifying Plagiarism in Assignments. Journal of Trends in Computer Science and Smart Technology, 5(2), 168–189. https://doi.org/10.36548/jtcsst.2023.2.006
Sozon, M., Mohammad Alkharabsheh, O. H., Fong, P. W., & Chuan, S. B. (2024). Cheating and plagiarism in higher education institutions (HEIs): A literature review. F1000Research, 13, 788. https://doi.org/10.12688/f1000research.147140.1
TENCON 2023 - 2023 IEEE Region 10 Conference. (2023). IEEE.
Yudra Bramantya, A., Putra, S., Hasanuddina, T., & Umar, F. (2022). Buletin Sistem Informasi dan Teknologi Islam Analisis Algoritma Winnowing pada Pendeteksian Plagiarisme Judul Tugas Akhir INFORMASI ARTIKEL ABSTRAK. 3(4), 268–273.
 
