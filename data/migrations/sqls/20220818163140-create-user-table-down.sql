ALTER TABLE `proposal` DROP FOREIGN KEY `proposal_user_id_fkey`;
ALTER TABLE `comment` DROP FOREIGN KEY `comment_user_id_fkey`;

ALTER TABLE `proposal` DROP `user_id`;
ALTER TABLE `comment` DROP `user_id`;

DROP TABLE `user`;
