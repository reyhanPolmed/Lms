<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>EduFlow LMS - Materi</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface": "#f6f9ff",
                      "tertiary": "#5a5c5d",
                      "secondary-fixed": "#dde2ef",
                      "on-primary-fixed-variant": "#0337b8",
                      "outline-variant": "#c4c5d6",
                      "on-tertiary-container": "#fcfdfe",
                      "on-secondary-container": "#5f656f",
                      "error": "#ba1a1a",
                      "tertiary-fixed-dim": "#c5c7c8",
                      "secondary": "#595f69",
                      "on-background": "#151c22",
                      "inverse-on-surface": "#ebf1fa",
                      "error-container": "#ffdad6",
                      "primary": "#2c50cd",
                      "outline": "#747685",
                      "on-tertiary-fixed": "#191c1d",
                      "surface-container-high": "#e2e9f1",
                      "primary-fixed-dim": "#b8c4ff",
                      "primary-fixed": "#dde1ff",
                      "surface-variant": "#dce3ec",
                      "primary-container": "#496ae8",
                      "on-primary": "#ffffff",
                      "secondary-container": "#dde2ef",
                      "on-primary-container": "#fffbff",
                      "inverse-primary": "#b8c4ff",
                      "on-surface-variant": "#444654",
                      "surface-container-low": "#eef4fd",
                      "on-secondary": "#ffffff",
                      "surface-bright": "#f6f9ff",
                      "tertiary-container": "#737576",
                      "on-tertiary-fixed-variant": "#454748",
                      "surface-container": "#e8eef7",
                      "secondary-fixed-dim": "#c1c6d3",
                      "on-surface": "#151c22",
                      "on-secondary-fixed": "#161c25",
                      "surface-tint": "#2f52d0",
                      "tertiary-fixed": "#e1e3e4",
                      "on-primary-fixed": "#001453",
                      "on-error-container": "#93000a",
                      "surface-container-highest": "#dce3ec",
                      "on-error": "#ffffff",
                      "inverse-surface": "#2a3138",
                      "surface-container-lowest": "#ffffff",
                      "on-tertiary": "#ffffff",
                      "surface-dim": "#d4dbe3",
                      "on-secondary-fixed-variant": "#414751",
                      "background": "#f6f9ff"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "xl": "64px",
                      "gutter": "24px",
                      "base": "4px",
                      "md": "24px",
                      "xs": "8px",
                      "sm": "16px",
                      "margin": "32px",
                      "lg": "40px"
              },
              "fontFamily": {
                      "label-md": [
                              "Lexend"
                      ],
                      "headline-xl": [
                              "Lexend"
                      ],
                      "body-md": [
                              "Lexend"
                      ],
                      "headline-lg": [
                              "Lexend"
                      ],
                      "body-lg": [
                              "Lexend"
                      ],
                      "label-sm": [
                              "Lexend"
                      ],
                      "headline-md": [
                              "Lexend"
                      ]
              },
              "fontSize": {
                      "label-md": [
                              "14px",
                              {
                                      "lineHeight": "1.4",
                                      "letterSpacing": "0.01em",
                                      "fontWeight": "500"
                              }
                      ],
                      "headline-xl": [
                              "40px",
                              {
                                      "lineHeight": "1.2",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "600"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "1.6",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "1.25",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "1.6",
                                      "letterSpacing": "0",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "1.4",
                                      "letterSpacing": "0.03em",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "1.3",
                                      "letterSpacing": "0",
                                      "fontWeight": "500"
                              }
                      ]
              }
            },
          }
        }
      </script>
<style>
          body {
              font-family: 'Lexend', sans-serif;
          }
      </style>
</head>
<body class="bg-background text-on-background min-h-[1024px] flex flex-col" data-stitch-vh="min-h-[1024px]===min-h-screen">
<!-- TopAppBar -->
<header class="sticky top-0 z-50 flex items-center justify-between px-8 h-16 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md full-width top-0 border-b border-gray-100 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
<div class="flex items-center gap-sm">
<span class="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-headline-md text-primary">SMK Negeri 8 Medan</span>
</div>
<nav class="hidden md:flex items-center gap-md">
<a class="text-gray-500 dark:text-slate-400 hover:text-indigo-500 transition-colors font-label-md text-outline" href="#"><br></a>
<a class="text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-4 mt-4 font-label-md text-primary" href="#"><br></a>
<a class="text-gray-500 dark:text-slate-400 hover:text-indigo-500 transition-colors font-label-md text-outline" href="#"><br></a>
</nav>
<div class="flex items-center gap-sm">
<button class="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-outline">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 text-outline">
<span class="material-symbols-outlined">settings</span>
</button>
<div class="w-8 h-8 rounded-full overflow-hidden border-2 border-surface cursor-pointer ml-2">
<img alt="Instructor Profile" class="w-full h-full object-cover" data-alt="A professional headshot of a teacher or instructor, wearing smart casual attire, set against a bright, modern, minimalist studio background with soft lighting. The image should exude a welcoming, scholarly vibe suitable for an educational platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVBX9Zo56pBTJv1ANmCCTnryrpqnucsixBWMZv2yIEt0yIY2azIsuBe1au_UqW3HBnlJ_kxUxcFBlXAOnV-EtICAOixSc_fyamOpMxLkndGTUxinJv1J1_GqupGDu4mCsXOYdfBKduxA3vTHCrZU1QvS32XeOOm5moqlsMSW5WqFJQivlwNrlSdxWTJT6MY7key1koJDZADVSdO92kl-QtF68zwUhDvrjjwzagfMy6wwuOeZgGRmKBEj29mGrG70-6vktmUb1Q2Z8R">
</div>
</div>
</header>
<div class="flex-1 flex flex-col w-full max-w-7xl mx-auto px-gutter py-md gap-gutter">
<!-- Breadcrumbs -->
<div class="flex items-center gap-xs text-outline font-label-md">
<span class="material-symbols-outlined text-[18px]">home</span>
<span class="material-symbols-outlined text-[16px]">chevron_right</span>
<span class="text-on-surface font-medium">Materi</span>
</div>
<div class="flex flex-col lg:flex-row gap-gutter items-start">
<!-- Main Content Area (Wide) -->
<main class="flex-1 w-full flex flex-col gap-sm">
<!-- Main Image/Card -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden group border border-outline-variant/30">
<div class="aspect-video w-full rounded-lg overflow-hidden relative">
<img alt="Web Development Basics" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="A high-quality, bright, and modern photograph showing a pristine coding workspace. A sleek laptop displays lines of code, surrounded by a minimalist, airy environment with soft, natural lighting. The color palette emphasizes clean whites, subtle greys, and vibrant screen content, creating a professional and focused educational atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyo-97SIEHqetLLCOi12Egzc-ejliussfT7rb_ePyi4GhAWZrHoUzoWOCc6ulHp6xJltpMMCvV_032o4IJg9PUkPfqCQgRi3fLBgk4AnztBf2BZwoSXTYy-F1GIG91_8p6cyaCmq6vQcyGqsm6NMGaqnoY-wew8zwCaXTVcndO0PMPvEmEyymXI5EvYoyp7UQEaAgpw_mMW1w88U3OibBXeXOiS8Smr36lz0RDaShsHwA27RgAsfafdxwm5P-vcTi0g4oJawIHIT7e">
<div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
</div>
<div class="mt-md flex justify-between items-start">
<div>
<h1 class="font-headline-lg text-on-surface mb-xs">Pengenalan HTML Dasar</h1>
<p class="font-body-md text-on-surface-variant">Bab 1 - Dasar Pemrograman Web</p>
</div>
<button class="bg-surface-container-low hover:bg-surface-container transition-colors p-2 rounded-full text-primary border border-primary/10">
<span class="material-symbols-outlined">open_in_new</span>
</button>
</div>
<div class="mt-sm prose prose-sm max-w-none font-body-md text-on-surface-variant">
<p class="">Pelajari struktur dasar halaman web menggunakan HTML. Materi ini akan membahas tag-tag penting, cara menyusun paragraf, heading, dan mengintegrasikan media dasar.</p>
</div>
</div>
<!-- Navigation Buttons inside Main Content -->
<div class="flex justify-between items-center mt-sm">
<button class="px-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md flex items-center gap-xs">
<span class="material-symbols-outlined text-[18px]">arrow_back</span>
                        Sebelumnya
                    </button>
<button class="px-sm py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-colors font-label-md flex items-center gap-xs">
                        Selanjutnya
                        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</main>
<!-- Sidebar (Narrow) -->
<aside class="w-full lg:w-80 flex flex-col gap-md sticky top-[88px]">
<!-- Progress Card -->
<div class="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30">
<h3 class="font-headline-md text-on-surface mb-xs">Progress Kursus</h3>
<div class="flex items-center justify-between mb-xs">
<span class="font-label-sm text-on-surface-variant">25% Selesai</span>
<span class="font-label-sm text-primary">3/12 Materi</span>
</div>
<!-- Progress Bar -->
<div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary w-1/4 rounded-full"></div>
</div>
</div>
<!-- Course Modules List -->
<div class="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 overflow-hidden">
<!-- Header -->
<div class="p-sm bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
<h3 class="font-label-md text-on-surface">Daftar Materi</h3>
<span class="material-symbols-outlined text-outline">list</span>
</div>
<div class="flex flex-col">
<!-- Accordion Group: Bab 1 -->
<div class="border-b border-outline-variant/20 last:border-0">
<!-- Group Header -->
<button class="w-full p-sm flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left group">
<span class="font-label-md text-on-surface group-hover:text-primary transition-colors">Bab 1: Pendahuluan</span>
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors transform rotate-180">expand_more</span>
</button>
<!-- Group Items -->
<div class="flex flex-col bg-surface">
<!-- Item 1 (Completed) -->
<a class="py-3 px-sm pl-8 flex items-center gap-sm hover:bg-surface-container-low transition-colors border-l-2 border-transparent" href="#">
<span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings: &quot;FILL&quot; 1;">check_circle</span>
<div class="flex-1">
<p class="font-label-md text-on-surface line-through opacity-70">1.1 Pengenalan Internet</p>
<p class="font-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5"><span class="material-symbols-outlined text-[14px]">menu_book</span> Text</p>
</div>
</a>
<!-- Item 2 (Active) -->
<a class="py-3 px-sm pl-8 flex items-center gap-sm bg-primary/5 border-l-2 border-primary" href="#">
<span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings: &quot;FILL&quot; 1;">play_circle</span>
<div class="flex-1">
<p class="font-label-md text-primary font-semibold">1.2 HTML Dasar</p>
<p class="font-label-sm text-primary/80 flex items-center gap-1 mt-0.5"><span class="material-symbols-outlined text-[14px]">smart_display</span> Video • 15m</p>
</div>
</a>
<!-- Item 3 (Locked/Pending) -->
<a class="py-3 px-sm pl-8 flex items-center gap-sm hover:bg-surface-container-low transition-colors border-l-2 border-transparent opacity-60" href="#">
<span class="material-symbols-outlined text-outline text-[20px]">radio_button_unchecked</span>
<div class="flex-1">
<p class="font-label-md text-on-surface">1.3 Kuis Bab 1</p>
<p class="font-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5"><span class="material-symbols-outlined text-[14px]">quiz</span> Kuis</p>
</div>
<span class="material-symbols-outlined text-outline text-[16px]">lock</span>
</a>
</div>
</div>
<!-- Accordion Group: Bab 2 (Collapsed) -->
<div class="border-b border-outline-variant/20 last:border-0 opacity-70">
<!-- Group Header -->
<button class="w-full p-sm flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left group">
<span class="font-label-md text-on-surface">Bab 2: CSS Styling</span>
<span class="material-symbols-outlined text-outline">expand_more</span>
</button>
</div>
<!-- Accordion Group: Bab 3 (Collapsed) -->
<div class="border-b border-outline-variant/20 last:border-0 opacity-70">
<!-- Group Header -->
<button class="w-full p-sm flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left group">
<span class="font-label-md text-on-surface">Bab 3: Javascript Basics</span>
<span class="material-symbols-outlined text-outline">expand_more</span>
</button>
</div>
</div>
</div>
</aside>
</div>
</div>


</body></html>