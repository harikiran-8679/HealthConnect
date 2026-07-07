-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "preferred_language" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_members" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "relation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccination_schedule_templates" (
    "id" SERIAL NOT NULL,
    "vaccine_name" TEXT NOT NULL,
    "recommended_age_days" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccination_schedule_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccination_records" (
    "id" SERIAL NOT NULL,
    "family_member_id" INTEGER NOT NULL,
    "vaccine_id" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completed_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vaccination_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_tips" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "health_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_tip_translations" (
    "id" SERIAL NOT NULL,
    "health_tip_id" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "health_tip_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_translations" (
    "id" SERIAL NOT NULL,
    "disease_id" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "prevention" TEXT NOT NULL,
    "care_tips" TEXT NOT NULL,

    CONSTRAINT "disease_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT,
    "district" TEXT,
    "village" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "women_child_content" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "women_child_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "women_child_content_translations" (
    "id" SERIAL NOT NULL,
    "content_id" INTEGER NOT NULL,
    "language_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "women_child_content_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "family_members_user_id_idx" ON "family_members"("user_id");

-- CreateIndex
CREATE INDEX "vaccination_records_family_member_id_idx" ON "vaccination_records"("family_member_id");

-- CreateIndex
CREATE INDEX "vaccination_records_vaccine_id_idx" ON "vaccination_records"("vaccine_id");

-- CreateIndex
CREATE INDEX "health_tips_category_idx" ON "health_tips"("category");

-- CreateIndex
CREATE INDEX "health_tip_translations_language_code_idx" ON "health_tip_translations"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "health_tip_translations_health_tip_id_language_code_key" ON "health_tip_translations"("health_tip_id", "language_code");

-- CreateIndex
CREATE INDEX "disease_translations_language_code_idx" ON "disease_translations"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "disease_translations_disease_id_language_code_key" ON "disease_translations"("disease_id", "language_code");

-- CreateIndex
CREATE INDEX "emergency_contacts_type_idx" ON "emergency_contacts"("type");

-- CreateIndex
CREATE INDEX "emergency_contacts_state_idx" ON "emergency_contacts"("state");

-- CreateIndex
CREATE INDEX "women_child_content_category_idx" ON "women_child_content"("category");

-- CreateIndex
CREATE INDEX "women_child_content_translations_language_code_idx" ON "women_child_content_translations"("language_code");

-- CreateIndex
CREATE UNIQUE INDEX "women_child_content_translations_content_id_language_code_key" ON "women_child_content_translations"("content_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE INDEX "page_views_path_idx" ON "page_views"("path");

-- CreateIndex
CREATE INDEX "page_views_viewed_at_idx" ON "page_views"("viewed_at");

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "family_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccination_records" ADD CONSTRAINT "vaccination_records_vaccine_id_fkey" FOREIGN KEY ("vaccine_id") REFERENCES "vaccination_schedule_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "health_tip_translations" ADD CONSTRAINT "health_tip_translations_health_tip_id_fkey" FOREIGN KEY ("health_tip_id") REFERENCES "health_tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_translations" ADD CONSTRAINT "disease_translations_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "women_child_content_translations" ADD CONSTRAINT "women_child_content_translations_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "women_child_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
