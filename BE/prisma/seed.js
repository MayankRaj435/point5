import prisma from "../src/helper/pooler.js";
async function main() {
  console.log("🌱 Seeding blogs...");

  // Optional: clear old blogs
  await prisma.blog.deleteMany();

  await prisma.blog.createMany({
    data: [
      {
        title: "The Future of Modern Web Development",
        content: `
          <h1>The Future of Modern Web Development</h1>
          <p>
            Modern frontend ecosystems are evolving rapidly with tools like
            React, Next.js, and AI-assisted development.
          </p>
          <p>
            Developers are now focusing more on performance, accessibility,
            and seamless user experiences.
          </p>
        `,
        published: true,
        thumbnail: "/uploads/blogs/dummy-thumb-1.jpg",
        cover: "/uploads/blogs/dummy-cover-1.jpg",
      },

      {
        title: "Why Motion Design Matters",
        content: `
          <h1>Why Motion Design Matters</h1>
          <p>
            Motion design improves user engagement and creates premium digital experiences.
          </p>
          <p>
            Libraries like Framer Motion make animations smooth and maintainable.
          </p>
        `,
        published: true,
        thumbnail: "/uploads/blogs/dummy-thumb-2.jpg",
        cover: "/uploads/blogs/dummy-cover-2.jpg",
      },

      {
        title: "Building Scalable Backend APIs",
        content: `
          <h1>Building Scalable Backend APIs</h1>
          <p>
            Express + Prisma + PostgreSQL is a solid stack for scalable APIs.
          </p>
          <p>
            Proper architecture and validation greatly improve maintainability.
          </p>
        `,
        published: true,
        thumbnail: "/uploads/blogs/dummy-thumb-3.jpg",
        cover: "/uploads/blogs/dummy-cover-3.jpg",
      },

      {
        title: "Creating Stunning UI Experiences",
        content: `
          <h1>Creating Stunning UI Experiences</h1>
          <p>
            Great UI design combines typography, spacing, color systems, and motion.
          </p>
          <p>
            Consistency across components creates trust and usability.
          </p>
        `,
        published: true,
        thumbnail: "/uploads/blogs/dummy-thumb-4.jpg",
        cover: "/uploads/blogs/dummy-cover-4.jpg",
      },
    ],
  });

  console.log("✅ Blogs seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeder failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });