import { type Booking } from "./dummy-data"

interface BookingWithDetails extends Booking {
  services?: {
    name: string
  }
  branches?: {
    name: string
  }
}

/**
 * Format nomor telepon agar sesuai kode negara Indonesia (62)
 * Hapus karakter non-digit dan ubah awalan 0 menjadi 62
 */
const formatIndonesianPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, "")
  return digitsOnly.startsWith("0") ? `62${digitsOnly.substring(1)}` : digitsOnly
}

/**
 * Membuat pesan WhatsApp berdasarkan status booking dan detailnya
 */
const generateWhatsAppMessage = (booking: BookingWithDetails): string => {
    const bookingDate = booking.booking_date || (booking as any).date;
    const bookingTime = booking.booking_time || (booking as any).time;

    const baseInfo = `Halo ${booking.customerName}, 👋  

    📌 Kode Booking: ${booking.bookingCode || (booking as any).booking_code}  
    🛠 Layanan: ${booking.services?.name || (booking as any).service || '-'}  
    📅 Jadwal: ${bookingDate} pukul ${bookingTime}  
    🚗 Kendaraan: ${booking.vehiclePlateNumber || (booking as any).vehicle_plate_number || '-'}  
    🏢 Cabang: ${booking.branches?.name || (booking as any).branch || '-'}  
    `

    const statusMessages = {
        pending: `Status booking Anda saat ini adalah *Menunggu Konfirmasi*.  
    Pembayaran Anda belum dikonfirmasi oleh admin.  
    Silakan selesaikan pembayaran atau upload bukti transfer bila belum dilakukan. 🙏`,

        confirmed: `Booking Anda sudah *Terkonfirmasi*. ✅  
    Mohon datang ke cabang sesuai jadwal yang dipilih. Terima kasih! 🙌`,

        "in-progress": `Booking Anda sedang dalam proses *Pengerjaan*. 🧽
    Tim kami saat ini sedang membersihkan kendaraan Anda.`,

        "picked-up": `Booking Anda sedang dalam proses *Penjemputan*. 🚗
    Tim kami sedang menuju lokasi Anda.`,

        completed: `Proses pembersihan kendaraan Anda sudah *Selesai*! 🎉  
    Terima kasih telah mempercayakan layanan kami. Semoga puas dan sampai jumpa lagi! 🙏`,

        cancelled: `Mohon maaf, booking Anda telah *Dibatalkan*. ❌
    Jika pembatalan ini tidak sesuai, silakan hubungi admin kami untuk bantuan lebih lanjut.`,
    }

    const statusMessage =
        statusMessages[booking.status as keyof typeof statusMessages] ||
        "Update status booking Anda saat ini belum tersedia."

    return `${baseInfo}\n${statusMessage}`
}

/**
 * Membuka WhatsApp dengan pesan sesuai status booking
 */
export const sendWhatsAppNotification = (booking: BookingWithDetails): void => {
  const message = generateWhatsAppMessage(booking)
  const encodedMessage = encodeURIComponent(message)
  const formattedPhone = formatIndonesianPhoneNumber(booking.customerPhone)

  window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, "_blank")
}
