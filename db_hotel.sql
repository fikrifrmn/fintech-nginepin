-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Jan 2026 pada 04.20
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_hotel`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `guests` int(11) NOT NULL,
  `total_price` varchar(100) NOT NULL,
  `payment_status` enum('pending','paid','cancelled','completed') NOT NULL,
  `midtrans_order_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `room_id`, `check_in_date`, `check_out_date`, `guests`, `total_price`, `payment_status`, `midtrans_order_id`) VALUES
(35, 1, 2, '2026-01-04', '2026-01-06', 1, '900000', 'paid', 'BOOK-35-1767509183267'),
(36, 1, 1, '2026-01-08', '2026-01-10', 1, '1100000', 'paid', 'BOOK-36-1767512824219'),
(37, 1, 2, '2026-01-10', '2026-01-12', 1, '900000', 'paid', 'BOOK-37-1767514020921'),
(38, 1, 2, '2026-01-11', '2026-01-12', 1, '450000', 'paid', 'BOOK-38-1767514284016'),
(39, 1, 2, '2026-01-04', '2026-01-07', 1, '1350000', 'paid', 'BOOK-39-1767519055296'),
(40, 1, 2, '2026-01-04', '2026-01-06', 1, '900000', 'paid', 'BOOK-40-1767519185893'),
(41, 6, 2, '2026-01-10', '2026-01-12', 3, '900000', 'paid', 'BOOK-41-1768014284994'),
(42, 6, 2, '2026-01-10', '2026-01-12', 1, '900000', 'paid', 'BOOK-42-1768014409738');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `payment_method` enum('credit_card','transfer','ewallet','qris') NOT NULL,
  `amount_paid` varchar(100) NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_status` enum('pending','paid','cancelled','complete') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `payment_method`, `amount_paid`, `payment_date`, `payment_status`) VALUES
(1, 35, 'qris', '900000', '2026-01-04 13:47:03', 'paid'),
(2, 36, 'qris', '1100000', '2026-01-04 14:47:40', 'paid'),
(3, 37, 'qris', '900000', '2026-01-04 15:07:38', 'paid'),
(4, 38, 'qris', '450000', '2026-01-04 15:12:02', 'paid'),
(5, 39, 'qris', '1350000', '2026-01-04 16:31:31', 'paid'),
(6, 40, 'qris', '900000', '2026-01-04 16:33:41', 'paid'),
(7, 41, 'qris', '900000', '2026-01-10 10:05:29', 'paid'),
(8, 42, 'qris', '900000', '2026-01-10 10:08:12', 'paid');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(100) NOT NULL,
  `price_per_night` decimal(10,0) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`, `price_per_night`, `description`, `image_url`, `created_at`) VALUES
(1, 'Standard', 550000, 'Kamar nyaman dengan desain modern, cocok untuk traveler bisnis maupun liburan. Ruangan cukup luas dengan pencahayaan hangat.', 'room-1766763572698.jpg', '0000-00-00 00:00:00'),
(2, 'Superior', 450000, 'Kamar dengan konsep simple & minimalis namun tetap nyaman. Ideal untuk tamu yang ingin menginap dengan budget terjangkau.', 'room-1766764028103.jpg', '0000-00-00 00:00:00'),
(3, 'Deluxe', 1500000, 'Kamar Deluxe merupakan tipe kamar tertinggi dengan ruang luas, interior modern elegan, dan fasilitas premium yang menunjang kenyamanan serta produktivitas perjalanan bisnis.', 'room-1768055623203.jpg', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `room_facilities`
--

CREATE TABLE `room_facilities` (
  `facility_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `facility_name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `room_facilities`
--

INSERT INTO `room_facilities` (`facility_id`, `room_id`, `facility_name`, `created_at`) VALUES
(6, 1, 'TV LED', '0000-00-00 00:00:00'),
(7, 1, 'Wifi', '0000-00-00 00:00:00'),
(8, 1, 'Bathub', '0000-00-00 00:00:00'),
(9, 1, 'AC', '0000-00-00 00:00:00'),
(13, 2, 'AC', '0000-00-00 00:00:00'),
(14, 2, 'WiFi', '0000-00-00 00:00:00'),
(15, 2, 'Breakfast', '0000-00-00 00:00:00'),
(16, 3, 'VIP Meeting Room', '0000-00-00 00:00:00'),
(17, 3, 'Lounge Access', '0000-00-00 00:00:00'),
(18, 3, 'Breakfast', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` enum('user','admin') NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`user_id`, `name`, `username`, `email`, `password`, `phone`, `role`, `created_at`) VALUES
(1, 'fikrii', 'fikri1', 'fikri@gmail.com', '$2b$10$w6dd1uB8ttrdc7FLo8zf3e80lUTuDMwHovddEBBD75.1NLwVdk4p6', '', 'user', '0000-00-00 00:00:00'),
(6, '', 'usertechno', 'usertechno@gmail.com', '$2b$10$VQ1anbpy8vE693SgTvs8ouN04OwyaImtcrfO2j2kHc0V9MqSJppkK', '08123456789', 'user', '2026-01-10 10:02:39'),
(7, '', 'user', 'user@gmail.com', '$2b$10$GWRGawFPs/bI6PbZgRyHZuZjTDQF66WgirLZ06glS38vcInHzPKiG', '08123456789', 'user', '2026-01-11 10:16:37'),
(8, 'admin', 'admin', 'admin@gmail.com', '$2b$10$pJBx1brbW/hcVg7cUxuYWeZY1NHkGRXqQII/uUETCzHMkCdgescmq', '08123456789', 'admin', '2026-01-11 04:18:19');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`,`room_id`),
  ADD KEY `fk_bookings_rooms` (`room_id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`);

--
-- Indeks untuk tabel `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Indeks untuk tabel `room_facilities`
--
ALTER TABLE `room_facilities`
  ADD PRIMARY KEY (`facility_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `room_facilities`
--
ALTER TABLE `room_facilities`
  MODIFY `facility_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_bookings_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_bookings` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `room_facilities`
--
ALTER TABLE `room_facilities`
  ADD CONSTRAINT `fk_room_facilities_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
