-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2020 at 02:14 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mobilenews_development`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Teknologi', '2020-11-09 18:19:46', '2020-11-09 18:19:46');

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `newsimage` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `categoryId`, `userId`, `newsimage`, `createdAt`, `updatedAt`) VALUES
(1, 'Sega Jual Bisnis Game Arcade Imbas Pandemi Covid-19', 'Perusahaan konsol game asal Jepang, Sega kabarnya akan menjual bisnis arcade mereka kepada Genda Inc. Sega mengumumkan bahwa pihaknya sepakat menjual 85,1 persen saham dari bisnis game arcade bernama Sega Entertainment itu.', 1, 2, 'uploads/2_1604944221403.png', '2020-11-09 12:23:09', '2020-11-09 17:50:21'),
(2, 'Introduction to JavaScript Property Getters and Setters (Accessor Properties)', 'In JavaScript, there are two types of properties. The first type is data properties. These are the properties you usually use when you work with objects. The second type is called \"accessor properties\". These are a bit different. Put simply, accessor prop', 1, 1, 'uploads/1_1604928485943.png', '2020-11-09 13:28:05', '2020-11-09 13:28:05'),
(3, 'What\'s your fav programming paradigm?', 'Programming Paradigm is a style, technique, or way of writing a program. Part of a programmer\'s growth involves the ability to choose the appropriate programming paradigm for the given tasks.\n\nThe most common programming paradigms today are object-oriente', 1, 2, 'uploads/2_1604940817989.png', '2020-11-09 16:53:38', '2020-11-09 16:53:38'),
(6, 'What\'s your fav programming paradigm?', 'Programming Paradigm is a style, technique, or way of writing a program. Part of a programmer\'s growth involves the ability to choose the appropriate programming paradigm for the given tasks.\r\n\r\n# The most common programming paradigms today are object.', 1, 2, 'uploads/2_1604958176746.png', '2020-11-09 21:42:56', '2020-11-09 21:42:56');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20201109115448-create-users.js'),
('20201109120417-create-news.js'),
('20201109120709-create-category.js'),
('20201109180603-create-tags.js');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `postId`, `createdAt`, `updatedAt`) VALUES
(1, NULL, NULL, '2020-11-09 18:47:25', '2020-11-09 18:47:25'),
(2, 'Teknologi, React', 1, '2020-11-09 18:48:47', '2020-11-09 19:00:44'),
(3, 'J, a, v, a, s, c, r, i, p, t', 5, '2020-11-09 21:35:56', '2020-11-09 21:35:56'),
(4, 'Javascript, Express', 6, '2020-11-09 21:42:56', '2020-11-09 21:42:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `birthdate`, `email`, `password`, `phone`, `gender`, `role_id`, `avatar`, `createdAt`, `updatedAt`) VALUES
(1, 'Administrator', '1998-08-24', 'admin@news.com', '$2a$10$y3p8VIFImjdubbokzcDgb.mzfO.vNcxVHT0.lkN0ajhHsOpXndaBa', NULL, NULL, 2, NULL, '2020-11-09 12:17:23', '2020-11-09 12:17:23'),
(2, 'General User', '1998-08-24', 'user@news.com', '$2a$10$ygmHVWcylTKORTXFUS2bnu1q7rNQ9ui4GWHg7dPHmFuAmca2R.efm', NULL, NULL, 2, 'uploads/2_1604944814210.jpg', '2020-11-09 12:57:34', '2020-11-09 18:00:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
