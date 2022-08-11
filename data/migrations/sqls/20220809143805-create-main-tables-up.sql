-- CreateTable
CREATE TABLE `dao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `dao_creator_address` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NULL,
    `token_name` VARCHAR(255) NULL,
    `token_symbol` VARCHAR(255) NULL,
    `token_image` VARCHAR(255) NOT NULL,
    `min_quorum` INTEGER NOT NULL,
    `min_consensus_deadline` TIMESTAMP NOT NULL,
    `min_voting_deadline` TIMESTAMP NOT NULL,
    `transaction_hash` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `dao_name_key`(`name`),
    UNIQUE INDEX `dao_slug_key`(`slug`),
    UNIQUE INDEX `dao_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proposal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    `dao_id` INTEGER NOT NULL,
    `proposal_creator_address` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `min_quorum` INTEGER NOT NULL,
    `consensus_deadline` TIMESTAMP NOT NULL,
    `voting_deadline` TIMESTAMP NOT NULL,
    `yea` INTEGER,
    `nay` INTEGER,
    `status` ENUM('open', 'closed', 'paused') NOT NULL DEFAULT 'open',

    UNIQUE INDEX `proposal_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    `proposal_id` INTEGER NULL NOT NULL,
    `user_address` VARCHAR(255) NOT NULL,
    `text` TEXT NOT NULL,
    `head_comment` INT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `proposal` ADD CONSTRAINT `proposal_dao_id_fkey` FOREIGN KEY (`dao_id`) REFERENCES `dao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_proposal_id_fkey` FOREIGN KEY (`proposal_id`) REFERENCES `proposal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

