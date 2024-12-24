import { PrismaClient } from "@prisma/client";
import { seedProducts } from "./products.seed";
import { seedUsers } from "./users.seed";
const prisma = new PrismaClient();

async function main() {
    await seedUsers(prisma);
    await seedProducts(prisma);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
