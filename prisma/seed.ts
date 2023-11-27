import { createPassword, createUser } from "@/tests/db-utils";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";

const prisma = new PrismaClient();

async function img({
  altText,
  filepath,
}: {
  altText?: string;
  filepath: string;
}) {
  return {
    altText,
    contentType: filepath.endsWith(".png") ? "image/png" : "image/jpeg",
    blob: await fs.promises.readFile(filepath),
  };
}

async function seed() {
  console.log("🌱 Seeding...");

  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");

  await prisma.user.deleteMany({});
  console.timeEnd("🧹 Cleaned up the database...");

  const userImages = await Promise.all(
    Array.from({ length: 10 }, (_, index) =>
      img({
        filepath: `./tests/fixtures/images/user/${index}.jpg`,
      })
    )
  );

  const totalUsers = 5;

  for (let index = 0; index < totalUsers; index++) {
    const userData = createUser();
    await prisma.user
      .create({
        select: {
          id: true,
        },
        data: {
          ...userData,
          password: {
            create: createPassword(userData.username),
          },
          image: {
            create: userImages[index % 10],
          },
        },
      })
      .catch((error) => {
        console.error("Error creating a user:", error);
        return null;
      });
  }

  console.timeEnd(`👤 Created ${totalUsers} users...`);
  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
