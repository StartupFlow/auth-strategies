import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const logThreshold = 20;
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: "query", emit: "event" },
      { level: "error", emit: "stdout" },
      { level: "warn", emit: "stdout" },
    ],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

prisma.$on("query", (event) => {
  if (event.duration < logThreshold) return;
  const color =
    event.duration < logThreshold * 1.1
      ? "green"
      : event.duration < logThreshold * 1.2
      ? "blue"
      : event.duration < logThreshold * 1.3
      ? "yellow"
      : event.duration < logThreshold * 1.4
      ? "redBright"
      : "red";

  const dur = chalk[color](`${event.duration}ms`);
  console.info(`Prisma:query - ${dur} - ${event.query}`);
});

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
