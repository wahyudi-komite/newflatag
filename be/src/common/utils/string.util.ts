export function capitalize(text: string): string {
  return text
    ? text
        .toLowerCase() // Ubah semua ke huruf kecil dulu untuk konsistensi
        .split(' ') // Pisahkan berdasarkan spasi
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize setiap kata
        .join(' ') // Gabungkan kembali menjadi satu string
    : text;
}
