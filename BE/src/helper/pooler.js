import { PrismaClient } from "@prisma/client";

const globalWithPrisma = globalThis;

let prisma;
if (!globalWithPrisma.__prismaClient) {
	prisma = new PrismaClient({});
	globalWithPrisma.__prismaClient = prisma;
} else {
	prisma = globalWithPrisma.__prismaClient;
}

export default prisma;