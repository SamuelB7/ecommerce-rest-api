import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

export async function seedProducts(prisma: PrismaClient) {
    const user = await prisma.user.findUnique({
        where: {
            email: "johndoe@email.com",
        },
    });

    for (let i = 0; i < 1000; i++) {
        const product = await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: +faker.commerce.price(),
                category: faker.commerce.department(),
            },
        });

        await prisma.productImage.createMany({
            data: [
                {
                    productId: product.id,
                    url: faker.image.url(),
                },
                {
                    productId: product.id,
                    url: faker.image.url(),
                },
                {
                    productId: product.id,
                    url: faker.image.url(),
                },
            ],
        });

        await prisma.rating.createMany({
            data: [
                {
                    productId: product.id,
                    rating: faker.number.int({ min: 1, max: 5 }),
                    description: faker.lorem.paragraph(),
                    userId: user.id,
                },
            ],
        });
    }
}
