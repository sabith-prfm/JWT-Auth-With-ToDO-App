-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 23, 2022 at 03:29 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo_app1`
--

-- --------------------------------------------------------

--
-- Table structure for table `childTable`
--

CREATE TABLE `childTable` (
  `taskId` varchar(255) NOT NULL,
  `taskName` varchar(255) NOT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','PENDING') NOT NULL,
  `completionDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `parentId` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `childTable`
--

INSERT INTO `childTable` (`taskId`, `taskName`, `status`, `completionDate`, `parentId`, `createdAt`) VALUES
('task_cl4qc4s2s0007jykz1ybxgou6', 'test5', 'COMPLETED', '2022-06-24 03:40:31', '', '2022-06-23 01:17:54'),
('task_cl4qc59940008jykz82wv0ope', 'test5-1', 'COMPLETED', '2022-06-24 03:40:31', 'task_cl4qc4s2s0007jykz1ybxgou6', '2022-06-23 01:18:16'),
('task_cl4qc5fa80009jykz3sd50og6', 'test5-2', 'COMPLETED', '2022-06-24 03:40:31', 'task_cl4qc4s2s0007jykz1ybxgou6', '2022-06-23 01:18:24'),
('task_cl4qc5j90000ajykz6a1za6jo', 'test5-3', 'COMPLETED', '2022-06-24 03:40:31', 'task_cl4qc4s2s0007jykz1ybxgou6', '2022-06-23 01:18:29'),
('task_cl4qc5mpj000bjykz01y5alme', 'test5-4', 'COMPLETED', '2022-06-24 03:40:31', 'task_cl4qc4s2s0007jykz1ybxgou6', '2022-06-23 01:18:34'),
('task_cl4qc66qd000cjykzhgqb8j34', 'test5-4-1', 'COMPLETED', '2022-06-24 03:40:31', 'task_cl4qc5mpj000bjykz01y5alme', '2022-06-23 01:18:59'),
('task_cl4qc6c5x000djykzg59of0t4', 'test5-4-2', 'COMPLETED', '2022-06-24 03:40:31', 'task_cl4qc5mpj000bjykz01y5alme', '2022-06-23 01:19:07'),
('task_cl4qc6hd1000ejykz61xu1mw6', 'test5-4-3', 'IN_PROGRESS', '2022-06-23 01:22:24', 'task_cl4qc5mpj000bjykz01y5alme', '2022-06-23 01:19:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userName`, `password`, `firstName`, `lastName`, `createdAt`) VALUES
(1, 'sabith', 'sabith123', 'Abdul', 'Sabith', '2022-06-23 01:06:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `childTable`
--
ALTER TABLE `childTable`
  ADD PRIMARY KEY (`taskId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
