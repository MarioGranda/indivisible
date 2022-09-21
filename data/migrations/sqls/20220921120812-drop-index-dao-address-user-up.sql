ALTER TABLE `user`
  DROP INDEX `dao_address_key`;

ALTER TABLE `user` ADD `dao_id` INT;
