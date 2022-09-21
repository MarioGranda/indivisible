CREATE UNIQUE INDEX `dao_address_key`
ON `user` (`address`);

ALTER TABLE `user` DROP `dao_id`;
