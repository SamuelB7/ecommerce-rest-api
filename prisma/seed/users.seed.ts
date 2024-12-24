import { PrismaClient, Role } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient) {
    const DEFAULT_PASSWORD =
        "$2a$08$BiD1oQZRdqcse9e5qV1wVeW64/8pg76KSbQEbywkEd5mKxufMOnrW"; //12345 bcrypt
    const adminUser = {
        name: "Admin",
        email: "admin@email.com",
        role: Role.ADMIN,
        password: DEFAULT_PASSWORD,
    };

    const defaultUserOne = {
        name: "John Doe",
        email: "johndoe@email.com",
        role: Role.USER,
        password: DEFAULT_PASSWORD,
    };

    const defaultUserTwo = {
        name: "Jane Doe",
        email: "jane@email.com",
        role: Role.USER,
        password: DEFAULT_PASSWORD,
    };

    await prisma.user.createMany({
        data: [adminUser, defaultUserOne, defaultUserTwo],
    });
}
