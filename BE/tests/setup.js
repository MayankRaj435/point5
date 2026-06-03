import { jest } from "@jest/globals";
import prisma from "../src/helper/pooler.js";

/* =========================================================
   GLOBAL TEST SETUP
========================================================= */

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  console.log("\n🧪 Starting test suite...\n");
});

/* =========================================================
   GLOBAL TEST CLEANUP
========================================================= */

afterAll(async () => {
  try {
    console.log("\n🧹 Cleaning up test resources...\n");

    // Disconnect Prisma once after all test suites are complete.
    await prisma.$disconnect();

    console.log("✅ Prisma disconnected");
  } catch (error) {
    console.error("❌ Test cleanup failed:", error);
  }
});

/* =========================================================
   OPTIONAL HELPERS
========================================================= */

// Increase timeout for file uploads + DB operations
jest.setTimeout(30000);

/* =========================================================
   SILENCE CONSOLE ERRORS (OPTIONAL)
========================================================= */

// Uncomment if test logs become too noisy

/*
const originalConsoleError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (
        args[0].includes("❌") ||
        args[0].includes("Failed")
      )
    ) {
      return;
    }

    originalConsoleError(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});
*/