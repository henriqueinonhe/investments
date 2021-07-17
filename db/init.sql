CREATE TABLE `Investments` (
  `id` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `type` enum('VARIABLE','FIXED') NOT NULL,
  `value` double NOT NULL,
  `date` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO Investments.Migrations
(id, `timestamp`, name)
VALUES(1, 1626314423746, 'CreateInvestments1626314423746');
INSERT INTO Investments.Migrations
(id, `timestamp`, name)
VALUES(2, 1626490941872, 'CreateUserInInvestment1626490941872');
