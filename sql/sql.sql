/*
SQLyog Enterprise - MySQL GUI v7.02 
MySQL - 5.5.5-10.4.21-MariaDB : Database - wood
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `finished_good_components` */

CREATE TABLE `finished_good_components` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `finished_good_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_finished_good_components` (`package_id`),
  KEY `FK_finished_good_components2` (`finished_good_id`),
  CONSTRAINT `FK_finished_good_components` FOREIGN KEY (`package_id`) REFERENCES `package_list` (`package_id`),
  CONSTRAINT `FK_finished_good_components2` FOREIGN KEY (`finished_good_id`) REFERENCES `finished_good_list` (`finished_good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `finished_good_components` */

/*Table structure for table `finished_good_list` */

CREATE TABLE `finished_good_list` (
  `finished_good_id` int(11) NOT NULL AUTO_INCREMENT,
  `semi_good_id` int(11) DEFAULT NULL,
  `finished_good_name` varchar(255) DEFAULT NULL,
  `finished_good_unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`finished_good_id`),
  UNIQUE KEY `raw_material_name` (`finished_good_name`),
  KEY `FK_finished_good_list` (`semi_good_id`),
  CONSTRAINT `FK_finished_good_list` FOREIGN KEY (`semi_good_id`) REFERENCES `semi_good_list` (`semi_good_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

/*Data for the table `finished_good_list` */

insert  into `finished_good_list`(`finished_good_id`,`semi_good_id`,`finished_good_name`,`finished_good_unit`) values (3,8,'r2','gm');
insert  into `finished_good_list`(`finished_good_id`,`semi_good_id`,`finished_good_name`,`finished_good_unit`) values (4,7,'r3','sq. ft.');
insert  into `finished_good_list`(`finished_good_id`,`semi_good_id`,`finished_good_name`,`finished_good_unit`) values (5,7,'333','m');

/*Table structure for table `finished_good_planning` */

CREATE TABLE `finished_good_planning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `planning_date` datetime DEFAULT NULL,
  `finished_good_id` int(11) DEFAULT NULL,
  `finished_good_qty` double(18,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_status` int(1) DEFAULT 0,
  `completed_date` datetime DEFAULT NULL,
  `complete_status` int(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_finished_good_planning` (`finished_good_id`),
  CONSTRAINT `FK_finished_good_planning` FOREIGN KEY (`finished_good_id`) REFERENCES `finished_good_list` (`finished_good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `finished_good_planning` */

/*Table structure for table `finished_good_planning_details` */

CREATE TABLE `finished_good_planning_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `planning_id` int(11) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `total_package_qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_finished_good_planning_details` (`package_id`),
  KEY `FK_finished_good_planning_details1` (`planning_id`),
  CONSTRAINT `FK_finished_good_planning_details` FOREIGN KEY (`package_id`) REFERENCES `package_list` (`package_id`),
  CONSTRAINT `FK_finished_good_planning_details1` FOREIGN KEY (`planning_id`) REFERENCES `finished_good_planning` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `finished_good_planning_details` */

/*Table structure for table `finished_good_stock` */

CREATE TABLE `finished_good_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_date` timestamp NULL DEFAULT current_timestamp(),
  `stock_type` varchar(50) DEFAULT NULL,
  `ref_no` int(11) DEFAULT NULL,
  `ref_source` varchar(50) DEFAULT NULL,
  `finished_good_id` int(11) DEFAULT NULL,
  `stock_qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aa` (`finished_good_id`),
  CONSTRAINT `FK_finished_good_stock` FOREIGN KEY (`finished_good_id`) REFERENCES `finished_good_list` (`finished_good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `finished_good_stock` */

/*Table structure for table `package_list` */

CREATE TABLE `package_list` (
  `package_id` int(11) NOT NULL AUTO_INCREMENT,
  `package_name` varchar(255) DEFAULT NULL,
  `package_unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`package_id`),
  UNIQUE KEY `raw_material_name` (`package_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

/*Data for the table `package_list` */

/*Table structure for table `package_stock` */

CREATE TABLE `package_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_date` timestamp NULL DEFAULT current_timestamp(),
  `stock_type` varchar(50) DEFAULT NULL,
  `ref_no` int(11) DEFAULT NULL,
  `ref_source` varchar(50) DEFAULT NULL,
  `package_id` int(11) DEFAULT NULL,
  `stock_qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aa` (`package_id`),
  CONSTRAINT `FK_package_stock` FOREIGN KEY (`package_id`) REFERENCES `package_list` (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `package_stock` */

/*Table structure for table `raw_material_list` */

CREATE TABLE `raw_material_list` (
  `raw_mat_id` int(11) NOT NULL AUTO_INCREMENT,
  `raw_mat_name` varchar(255) DEFAULT NULL,
  `raw_mat_unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`raw_mat_id`),
  UNIQUE KEY `raw_material_name` (`raw_mat_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

/*Data for the table `raw_material_list` */

insert  into `raw_material_list`(`raw_mat_id`,`raw_mat_name`,`raw_mat_unit`) values (12,'wood','sq. ft.');

/*Table structure for table `raw_material_stock` */

CREATE TABLE `raw_material_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_date` timestamp NULL DEFAULT current_timestamp(),
  `stock_type` varchar(50) DEFAULT NULL,
  `ref_no` int(11) DEFAULT NULL,
  `ref_source` varchar(50) DEFAULT NULL,
  `raw_mat_id` int(11) DEFAULT NULL,
  `stock_qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_aa` (`raw_mat_id`),
  CONSTRAINT `FK_raw_material_stock` FOREIGN KEY (`raw_mat_id`) REFERENCES `raw_material_list` (`raw_mat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `raw_material_stock` */

/*Table structure for table `semi_good_components` */

CREATE TABLE `semi_good_components` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `semi_good_id` int(11) DEFAULT NULL,
  `raw_mat_id` int(11) DEFAULT NULL,
  `qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_semi_good_components` (`raw_mat_id`),
  KEY `FK_semi_good_components2` (`semi_good_id`),
  CONSTRAINT `FK_semi_good_components` FOREIGN KEY (`raw_mat_id`) REFERENCES `raw_material_list` (`raw_mat_id`),
  CONSTRAINT `FK_semi_good_components2` FOREIGN KEY (`semi_good_id`) REFERENCES `semi_good_list` (`semi_good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `semi_good_components` */

/*Table structure for table `semi_good_list` */

CREATE TABLE `semi_good_list` (
  `semi_good_id` int(11) NOT NULL AUTO_INCREMENT,
  `semi_good_name` varchar(255) DEFAULT NULL,
  `semi_good_unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`semi_good_id`),
  UNIQUE KEY `raw_material_name` (`semi_good_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

/*Data for the table `semi_good_list` */

insert  into `semi_good_list`(`semi_good_id`,`semi_good_name`,`semi_good_unit`) values (7,'wood','gm');
insert  into `semi_good_list`(`semi_good_id`,`semi_good_name`,`semi_good_unit`) values (8,'steel','gm');

/*Table structure for table `semi_good_planning` */

CREATE TABLE `semi_good_planning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `planning_date` datetime DEFAULT NULL,
  `semi_good_id` int(11) DEFAULT NULL,
  `semi_good_qty` double(18,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `start_status` int(1) DEFAULT 0,
  `completed_date` datetime DEFAULT NULL,
  `complete_status` int(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `FK_semi_good_planning` (`semi_good_id`),
  CONSTRAINT `FK_semi_good_planning` FOREIGN KEY (`semi_good_id`) REFERENCES `semi_good_list` (`semi_good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `semi_good_planning` */

/*Table structure for table `semi_good_planning_details` */

CREATE TABLE `semi_good_planning_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `planning_id` int(11) DEFAULT NULL,
  `raw_mat_id` int(11) DEFAULT NULL,
  `total_raw_mat_qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_semi_good_planning_details` (`planning_id`),
  KEY `FK_semi_good_planning_details2` (`raw_mat_id`),
  CONSTRAINT `FK_semi_good_planning_details` FOREIGN KEY (`planning_id`) REFERENCES `semi_good_planning` (`id`),
  CONSTRAINT `FK_semi_good_planning_details2` FOREIGN KEY (`raw_mat_id`) REFERENCES `raw_material_list` (`raw_mat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `semi_good_planning_details` */

/*Table structure for table `semi_good_stock` */

CREATE TABLE `semi_good_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_date` timestamp NULL DEFAULT current_timestamp(),
  `stock_type` varchar(50) DEFAULT NULL,
  `ref_no` int(11) DEFAULT NULL,
  `ref_source` varchar(50) DEFAULT NULL,
  `semi_good_id` int(11) DEFAULT NULL,
  `stock_qty` double(18,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_semi_good_stock` (`semi_good_id`),
  CONSTRAINT `FK_semi_good_stock` FOREIGN KEY (`semi_good_id`) REFERENCES `semi_good_list` (`semi_good_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `semi_good_stock` */

/*Table structure for table `unit_list` */

CREATE TABLE `unit_list` (
  `unit_name` varchar(10) NOT NULL,
  `unit_details` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`unit_name`),
  UNIQUE KEY `raw_material_name` (`unit_details`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `unit_list` */

insert  into `unit_list`(`unit_name`,`unit_details`) values ('gm','gm (gram)');
insert  into `unit_list`(`unit_name`,`unit_details`) values ('kg','kg (kilogram)');
insert  into `unit_list`(`unit_name`,`unit_details`) values ('m','m (metre)');
insert  into `unit_list`(`unit_name`,`unit_details`) values ('sq. ft.','square foot');

/*Table structure for table `users` */

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `displayname` varchar(255) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `NewIndex1` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `users` */

insert  into `users`(`user_id`,`username`,`displayname`,`password`,`role`) values (1,'farhad','Farhad Kamal','40bd001563085fc35165329ea1ff5c5ecbdbbeef','User');
insert  into `users`(`user_id`,`username`,`displayname`,`password`,`role`) values (2,'shahriar','Shariar Rasheed','40bd001563085fc35165329ea1ff5c5ecbdbbeef','User');
insert  into `users`(`user_id`,`username`,`displayname`,`password`,`role`) values (3,'admin','Administrator','40bd001563085fc35165329ea1ff5c5ecbdbbeef','Admin');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
