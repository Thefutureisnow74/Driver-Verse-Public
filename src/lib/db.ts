import { PrismaClient, Prisma } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma || new PrismaClient({
    log: [
      // {
      //   emit: 'event',
      //   level: 'query',
      // },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Enhanced query logging with timestamps and duration
if (process.env.NODE_ENV !== "production") {
  (prisma as any).$on("query", (e: Prisma.QueryEvent) => {
    const timestamp = new Date().toISOString()
    console.log(`🔍 [${timestamp}] Prisma Query (${e.duration}ms):`)
    console.log(`   SQL: ${e.query}`)
    console.log(`   Params: ${e.params}`)
    console.log(`   Target: ${e.target}`)
    console.log('---')
  });

  (prisma as any).$on("error", (e: Prisma.LogEvent) => {
    const timestamp = new Date().toISOString()
    console.error(`❌ [${timestamp}] Prisma Error:`)
    console.error(`   Message: ${e.message}`)
    console.error(`   Target: ${e.target}`)
    console.error('---')
  });

  (prisma as any).$on("info", (e: Prisma.LogEvent) => {
    const timestamp = new Date().toISOString()
    console.log(`ℹ️ [${timestamp}] Prisma Info:`)
    console.log(`   Message: ${e.message}`)
    console.log(`   Target: ${e.target}`)
    console.log('---')
  });

  (prisma as any).$on("warn", (e: Prisma.LogEvent) => {
    const timestamp = new Date().toISOString()
    console.warn(`⚠️ [${timestamp}] Prisma Warning:`)
    console.warn(`   Message: ${e.message}`)
    console.warn(`   Target: ${e.target}`)
    console.warn('---')
  });
}
export default prisma;