// Shared by the homepage and /layanan; main.js also calls mailtoHref() as a copy fallback.
// Prefill project-request email template on mailto links
const EMAIL = 'wahyuakbar.work@gmail.com';
function mailtoHref(plan) {
    const subject = `Permintaan Proyek: ${plan || '[Jenis Aplikasi]'}`;
    const body = [
        'Halo Wahyu,',
        '',
        'Saya [Nama] dari [Perusahaan/Instansi].',
        '',
        `Jenis aplikasi   : ${plan || '[Landing page / Aplikasi web / Backend API / Maintenance]'}`,
        'Deskripsi singkat: [ceritakan masalah atau tujuan bisnisnya]',
        'Fitur utama      : [contoh: login multi-role, laporan, pembayaran]',
        'Estimasi anggaran: Rp [...]',
        'Target selesai   : [tanggal / bulan]',
        'Referensi        : [link aplikasi serupa, jika ada]',
        '',
        'Kontak yang bisa dihubungi: [WhatsApp / telepon]',
        '',
        'Terima kasih.',
    ].join('\n');
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
document.querySelectorAll('a[data-mailto]').forEach(a => { a.href = mailtoHref(a.dataset.plan); });
