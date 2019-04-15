-- MySQL dump 10.16  Distrib 10.2.21-MariaDB, for Linux (x86_64)
--
-- Host: faure    Database: cs314
-- ------------------------------------------------------
-- Server version	10.2.21-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `world`
--

DROP TABLE IF EXISTS `world`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `world` (
  `index` int(11) NOT NULL,
  `id` varchar(30) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `latitude` varchar(1000) DEFAULT NULL,
  `longitude` varchar(1000) DEFAULT NULL,
  `altitude` varchar(1000) DEFAULT NULL,
  `continent` varchar(1000) DEFAULT NULL,
  `iso_country` varchar(1000) DEFAULT NULL,
  `iso_region` varchar(1000) DEFAULT NULL,
  `municipality` varchar(1000) DEFAULT NULL,
  `scheduled_service` varchar(1000) DEFAULT NULL,
  `gps_code` varchar(1000) DEFAULT NULL,
  `iata_code` varchar(1000) DEFAULT NULL,
  `local_code` varchar(1000) DEFAULT NULL,
  `home_link` varchar(1000) DEFAULT NULL,
  `wikipedia_link` varchar(1000) DEFAULT NULL,
  `keywords` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `airports_name_idx` (`name`),
  FULLTEXT KEY `airpots_municipality_idx` (`municipality`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `world`
--
-- WHERE:  id like '%capri%' or name like '%capri%' or municipality like '%capri%' or name like '%Dtc North Heliport%'

LOCK TABLES `world` WRITE;
/*!40000 ALTER TABLE `world` DISABLE KEYS */;
INSERT INTO `world` VALUES (38808,'AR-0133','heliport','El Capricho Heliport','-34.2325','-59.3158','98','SA','AR','AR-B','Chenaut','no',NULL,NULL,'HCO',NULL,NULL,NULL),(16886,'CO32','heliport','Capri Heliport','39.85279846191406','-104.97699737548828','5255','NA','US','US-CO','Denver','no','CO32',NULL,'CO32',NULL,NULL,NULL),(320178,'IT-0417','closed','Aviosuperficie Coraine','45.588562','10.755719',NULL,'EU','IT','IT-34','Caprino Veronese (VR)','no',NULL,NULL,'VR16',NULL,NULL,'Coraine'),(35531,'SDGP','small_airport','Hotel Fazenda Capricho Airport','-23.224443435668945','-48.796112060546875','2099','SA','BR','BR-SP','Avaré','no','SDGP',NULL,NULL,NULL,NULL,NULL),(45986,'US-0073','heliport','Dtc North Heliport','39.6349983215','-104.898002625','5585','NA','US','US-CO','Denver','no',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `world` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-12 10:13:24
