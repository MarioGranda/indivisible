ALTER TABLE `proposal` DROP FOREIGN KEY `proposal_dao_id_fkey`;
ALTER TABLE `comment` DROP FOREIGN KEY `comment_proposal_id_fkey`;

DROP TABLE `proposal`;
DROP TABLE `comment`;
DROP TABLE `dao`;
