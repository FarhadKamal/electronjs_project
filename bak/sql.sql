/*
SQLyog Enterprise - MySQL GUI v7.02 
MySQL - 5.5.5-10.4.21-MariaDB : Database - wood
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `brand` */

CREATE TABLE `brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `brand` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

/*Data for the table `brand` */

insert  into `brand`(`id`,`brand`) values (1,'Pedrollo');
insert  into `brand`(`id`,`brand`) values (2,'Rovatti');
insert  into `brand`(`id`,`brand`) values (3,'ITAP');
insert  into `brand`(`id`,`brand`) values (4,'Atlas Filtri');
insert  into `brand`(`id`,`brand`) values (5,'HCP');
insert  into `brand`(`id`,`brand`) values (6,'Common');
insert  into `brand`(`id`,`brand`) values (7,'BG FLOW');
insert  into `brand`(`id`,`brand`) values (8,'Others');
insert  into `brand`(`id`,`brand`) values (9,'Pentagona');
insert  into `brand`(`id`,`brand`) values (10,'Teflon Tape');
insert  into `brand`(`id`,`brand`) values (11,'Munters');
insert  into `brand`(`id`,`brand`) values (12,'SAER PUMP');
insert  into `brand`(`id`,`brand`) values (13,'COMMON');
insert  into `brand`(`id`,`brand`) values (14,'HR SERVICE\r\n');
insert  into `brand`(`id`,`brand`) values (15,'LEGAL & ESTATE SERVICE');
insert  into `brand`(`id`,`brand`) values (16,'AUDIT SERVICE');
insert  into `brand`(`id`,`brand`) values (17,'ACCOUNTS & FINANCE SERVICE');
insert  into `brand`(`id`,`brand`) values (18,'IT SERVICE');
insert  into `brand`(`id`,`brand`) values (19,'MEP & PROJECT SERVICE');
insert  into `brand`(`id`,`brand`) values (20,'DISTRIBUTION SERVICE');
insert  into `brand`(`id`,`brand`) values (21,'CALL CENTER SERVICE');
insert  into `brand`(`id`,`brand`) values (22,'BRANDING');
insert  into `brand`(`id`,`brand`) values (23,'AZNEO Helpdesk');

/*Table structure for table `raw_material_list` */

CREATE TABLE `raw_material_list` (
  `raw_mat_id` int(11) NOT NULL AUTO_INCREMENT,
  `raw_mat_name` varchar(255) DEFAULT NULL,
  `raw_mat_unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`raw_mat_id`),
  UNIQUE KEY `raw_material_name` (`raw_mat_name`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4;

/*Data for the table `raw_material_list` */

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
