-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2025 at 08:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_com`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `status` varchar(200) NOT NULL,
  `image` varchar(2000) NOT NULL,
  `username` varchar(2000) NOT NULL,
  `email` varchar(2000) NOT NULL,
  `password` varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `status`, `image`, `username`, `email`, `password`) VALUES
(24, 'active', '', 'Rashid', 'sidhpurarashid298@gmail.com', '$2b$10$vE6w4Q4T1Cy4wUJ7KNJWSOS0e2iGTfOWqrvCBiiq9oy9dagHfSq0y'),
(25, 'inactive', '', 'john', 'john@gmail.com', '$2b$10$s2jv2s6/P2PXPH6BXVJMOe.KmVjlwY9990FUFExZL2mTh5eCDdncq');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` enum('Pending','Removed') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `status`, `created_at`, `updated_at`) VALUES
(10, 55, 43, 1, 'Pending', '2025-04-07 06:14:03', '2025-04-07 06:14:03');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `image`, `title`, `status`, `created_at`, `updated_at`) VALUES
(57, '1740467624927images (3).jpeg', 'Fashion', NULL, '2025-02-18 09:26:37', '2025-02-25 07:13:44'),
(58, '1740478386279download (4).jpeg', 'Beauty', NULL, '2025-02-18 09:26:54', '2025-02-25 10:13:06'),
(59, '1740478400351images.jpeg', 'Books', NULL, '2025-02-18 09:27:17', '2025-02-25 10:13:20'),
(60, '1740478413778images (1).jpeg', 'Food', NULL, '2025-02-18 09:27:39', '2025-02-25 10:13:33'),
(61, '1740478422930amir-hanna-sweUF7FcyP4-unsplash.jpg', 'Smart-phone', NULL, '2025-02-18 09:28:26', '2025-02-25 10:13:43'),
(62, '1740478436281Comrade_Activewear_Tshirt_-_Blue_1.webp', 'T-shirts', NULL, '2025-02-18 09:28:50', '2025-02-25 10:13:56'),
(63, '1740478453899images (4).jpeg', 'Sports', NULL, '2025-02-18 09:29:37', '2025-02-25 10:14:13'),
(64, '1740478479187photo-1505691938895-1758d7feb511.jpeg', 'Home Decore', NULL, '2025-02-18 09:30:07', '2025-02-25 10:14:39');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL COMMENT 'E.g., Credit Card, PayPal, etc.',
  `payment_status` varchar(255) DEFAULT NULL COMMENT 'Payment status, e.g., Pending, Completed, Failed',
  `transaction_id` varchar(255) DEFAULT NULL COMMENT 'Transaction ID for reference',
  `amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL COMMENT 'Payment status, e.g., Pending, Completed, Failed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `status`, `image`, `name`, `price`, `description`, `category_id`, `created_at`, `updated_at`) VALUES
(38, 'active', '1740466247587download.jpeg', 'Atomic Habits	', 2000.00, '<p>No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, <strong>reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results</strong>. &nbsp;No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, <strong>reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results</strong>.No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, <strong>reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results</strong>.No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, <strong>reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results</strong>.</p>', 59, '2025-02-18 09:36:30', '2025-04-07 11:24:03'),
(41, 'active', '1740478516484images (5).jpeg', 'Football', 200.00, '<p>Football, also known as soccer or association football, is a sport where two teams of 11 players try to score goals by kicking, carrying, or propelling the ball into the other team\'s net. The team that scores the most goals wins.&nbsp;</p>', 63, '2025-02-18 09:55:48', '2025-02-27 11:00:33'),
(42, 'inactive', '1740478528612download (1).jpeg', 'Rich Dad Poor Dad	', 30.00, '<p>Rich Dad Poor Dad is <strong>Robert\'s story of growing up with two dads — his real father and the father of his best friend, his rich dad — and the ways in which both men shaped his thoughts about money and investing</strong>.</p>', 59, '2025-02-18 12:38:16', '2025-04-07 12:59:38'),
(43, 'active', '1740478540301download (3).jpeg', 'The Catcher in the Rye', 1.00, '<p>The Catcher in the Rye is the story of Holden Caulfield, a teenage boy who has been expelled from his prep school and is wandering through New York City over a few days, struggling to come to terms with the complexities of growing up and the seeming phoniness of the adult world</p>', 59, '2025-02-18 12:39:40', '2025-04-07 10:31:17'),
(47, 'active', '1740567353930foodImage.webp', 'Pasta Masala', 4.00, '<p>Pasta masala is a flavorful dish that combines Italian pasta with Indian spices and herbs. It can be made with a variety of pastas, including penne, macaroni, fusilli, rigatoni, or elbow.&nbsp;</p>', 60, '2025-02-26 10:55:53', '2025-02-27 11:00:39'),
(48, 'active', '1740567503680chicken.jpg', 'Chicken', 20.00, '<p>Chicken is a white meat that\'s a common source of protein and eggs. It\'s prepared in many ways, including roasting, grilling, frying, and in curries.&nbsp;</p>', 60, '2025-02-26 10:58:23', '2025-02-27 11:00:43'),
(50, 'active', '174056783714520240715050129-  (1).png', 'Redmi A3', 100.00, '<p>With <strong>RAM expansion technology, Redmi A3 can expand its 4GB hardware capacity to 8GB*</strong>, making the system run smoother and apps load faster. Provide a USB Type-C port supporting 10W charging*. 5000mAh ultra-large battery, reducing battery life anxiety and ensuring full-day range.</p>', 61, '2025-02-26 11:03:57', '2025-02-27 09:23:14'),
(52, 'active', '1740656649167Comrade_Activewear_Tshirt_-_Blue_1.webp', 'T-shirt', 800.00, '<p>T-shirt…….</p>', 62, '2025-02-27 10:36:47', '2025-02-27 11:47:08');

-- --------------------------------------------------------

--
-- Table structure for table `shipping_addresses`
--

CREATE TABLE `shipping_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL COMMENT 'Status of the address, e.g., Active, Inactive',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Updates on modification'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email_or_phone` varchar(200) NOT NULL,
  `password` varchar(255) DEFAULT '',
  `otp` int(100) DEFAULT NULL,
  `picture` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email_or_phone`, `password`, `otp`, `picture`, `created_at`, `updated_at`) VALUES
(55, 'Rashid', 'sidhpurarashid298@gmail.com', '$2b$10$8hvZ4sNC7bYEMD4hkymVrOa9qkQz/XaM/D3qZS76z1ibwjjo49Wva', 636922, NULL, '2025-04-07 06:10:05', '2025-04-07 06:10:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_ibfk_1` (`category_id`);

--
-- Indexes for table `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email_or_phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shipping_addresses`
--
ALTER TABLE `shipping_addresses`
  ADD CONSTRAINT `shipping_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
