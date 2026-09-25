import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const DEFAULT_USER = {
  email: "admin@example.com",
  password: "password123",
  name: "Admin Operator",
};

async function main() {
  console.log("Seeding database with default credential user...");

  const passwordHash = await hashPassword(DEFAULT_USER.password);

  const user = await prisma.user.upsert({
    where: { email: DEFAULT_USER.email },
    update: {
      emailVerified: true,
      name: DEFAULT_USER.name,
    },
    create: {
      email: DEFAULT_USER.email,
      name: DEFAULT_USER.name,
      emailVerified: true,
    },
  });

  const existingAccount = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });

  if (existingAccount) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { password: passwordHash },
    });
  } else {
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: passwordHash,
      },
    });
  }

  console.log(`✅ Default user seeded:`);
  console.log(`   Email:    ${DEFAULT_USER.email}`);
  console.log(`   Password: ${DEFAULT_USER.password}`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
