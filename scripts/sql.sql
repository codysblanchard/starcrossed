/*
SQLyog Ultimate v11.5 (64 bit)
MySQL - 5.6.21 : Database - starcrossed
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`starcrossed` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `starcrossed`;

/*Table structure for table `aspects` */

DROP TABLE IF EXISTS `aspects`;

CREATE TABLE `aspects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(12) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  `version` tinyint(4) DEFAULT NULL,
  `minangle` smallint(4) DEFAULT NULL,
  `maxangle` smallint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

/*Table structure for table `entities` */

DROP TABLE IF EXISTS `entities`;

CREATE TABLE `entities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(24) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  `version` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

/*Table structure for table `entity_relationships` */

DROP TABLE IF EXISTS `entity_relationships`;

CREATE TABLE `entity_relationships` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_id` int(11) DEFAULT NULL,
  `aspect_id` int(11) DEFAULT NULL,
  `entity2_id` int(11) DEFAULT NULL,
  `score` tinyint(4) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `version` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=357 DEFAULT CHARSET=latin1;

/*Table structure for table `user_chart` */

DROP TABLE IF EXISTS `user_chart`;

CREATE TABLE `user_chart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `degree` float DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_updated` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `version` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1101 DEFAULT CHARSET=latin1;

/*Table structure for table `user_scores` */

DROP TABLE IF EXISTS `user_scores`;

CREATE TABLE `user_scores` (
  `user_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `fours` tinyint(4) DEFAULT NULL,
  `threes` tinyint(4) DEFAULT NULL,
  `twos` tinyint(4) DEFAULT NULL,
  `ones` tinyint(4) DEFAULT NULL,
  `nones` tinyint(4) DEFAULT NULL,
  `ntwos` tinyint(4) DEFAULT NULL,
  `nthrees` tinyint(4) DEFAULT NULL,
  `nfours` tinyint(4) DEFAULT NULL,
  `overall_score` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`user2_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gender` varchar(6) DEFAULT NULL,
  `first` varchar(64) DEFAULT NULL,
  `last` varchar(64) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `dob` datetime NOT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `cell` varchar(64) DEFAULT NULL,
  `picture` varchar(128) DEFAULT NULL,
  `username` varchar(32) DEFAULT NULL,
  `postcode` varchar(32) DEFAULT NULL,
  `street` varchar(64) DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `state` varchar(64) DEFAULT NULL,
  `country` varchar(32) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  `version` tinyint(4) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lon` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
