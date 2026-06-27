-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'ORGANIZER', 'VIEWER') NOT NULL DEFAULT 'ORGANIZER',
    `avatar_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `championships` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `season` VARCHAR(20) NOT NULL,
    `banner_url` VARCHAR(500) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'FINISHED') NOT NULL DEFAULT 'DRAFT',
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `owner_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `championships_owner_id_idx`(`owner_id`),
    INDEX `championships_status_idx`(`status`),
    INDEX `championships_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `short_name` VARCHAR(10) NOT NULL,
    `shield_url` VARCHAR(500) NULL,
    `championship_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `teams_championship_id_idx`(`championship_id`),
    INDEX `teams_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `number` INTEGER NOT NULL,
    `position` VARCHAR(50) NOT NULL,
    `photo_url` VARCHAR(500) NULL,
    `team_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `players_team_id_idx`(`team_id`),
    INDEX `players_deleted_at_idx`(`deleted_at`),
    UNIQUE INDEX `players_team_id_number_key`(`team_id`, `number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coaches` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `team_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `coaches_team_id_idx`(`team_id`),
    INDEX `coaches_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rounds` (
    `id` CHAR(36) NOT NULL,
    `number` INTEGER NOT NULL,
    `name` VARCHAR(100) NULL,
    `championship_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `rounds_championship_id_idx`(`championship_id`),
    UNIQUE INDEX `rounds_championship_id_number_key`(`championship_id`, `number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matches` (
    `id` CHAR(36) NOT NULL,
    `home_team_id` CHAR(36) NOT NULL,
    `away_team_id` CHAR(36) NOT NULL,
    `home_score` INTEGER NULL,
    `away_score` INTEGER NULL,
    `status` ENUM('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `scheduled_at` DATETIME(3) NOT NULL,
    `round_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `matches_round_id_idx`(`round_id`),
    INDEX `matches_home_team_id_idx`(`home_team_id`),
    INDEX `matches_away_team_id_idx`(`away_team_id`),
    INDEX `matches_status_idx`(`status`),
    INDEX `matches_scheduled_at_idx`(`scheduled_at`),
    INDEX `matches_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `goals` (
    `id` CHAR(36) NOT NULL,
    `minute` INTEGER NOT NULL,
    `player_id` CHAR(36) NOT NULL,
    `match_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `goals_player_id_idx`(`player_id`),
    INDEX `goals_match_id_idx`(`match_id`),
    INDEX `goals_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `standings` (
    `id` CHAR(36) NOT NULL,
    `team_id` CHAR(36) NOT NULL,
    `championship_id` CHAR(36) NOT NULL,
    `played` INTEGER NOT NULL DEFAULT 0,
    `wins` INTEGER NOT NULL DEFAULT 0,
    `draws` INTEGER NOT NULL DEFAULT 0,
    `losses` INTEGER NOT NULL DEFAULT 0,
    `goals_for` INTEGER NOT NULL DEFAULT 0,
    `goals_against` INTEGER NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `standings_championship_id_idx`(`championship_id`),
    INDEX `standings_points_idx`(`points`),
    UNIQUE INDEX `standings_team_id_championship_id_key`(`team_id`, `championship_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invite_links` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `type` ENUM('CHAMPIONSHIP', 'TEAM', 'FAN') NOT NULL,
    `championship_id` CHAR(36) NULL,
    `team_id` CHAR(36) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `invite_links_slug_key`(`slug`),
    INDEX `invite_links_slug_idx`(`slug`),
    INDEX `invite_links_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `email_notifications` BOOLEAN NOT NULL DEFAULT true,
    `theme` VARCHAR(20) NOT NULL DEFAULT 'light',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `settings_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `championships` ADD CONSTRAINT `championships_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_championship_id_fkey` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coaches` ADD CONSTRAINT `coaches_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rounds` ADD CONSTRAINT `rounds_championship_id_fkey` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_home_team_id_fkey` FOREIGN KEY (`home_team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_away_team_id_fkey` FOREIGN KEY (`away_team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `matches` ADD CONSTRAINT `matches_round_id_fkey` FOREIGN KEY (`round_id`) REFERENCES `rounds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `goals` ADD CONSTRAINT `goals_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `goals` ADD CONSTRAINT `goals_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standings` ADD CONSTRAINT `standings_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `standings` ADD CONSTRAINT `standings_championship_id_fkey` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invite_links` ADD CONSTRAINT `invite_links_championship_id_fkey` FOREIGN KEY (`championship_id`) REFERENCES `championships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invite_links` ADD CONSTRAINT `invite_links_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settings` ADD CONSTRAINT `settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

