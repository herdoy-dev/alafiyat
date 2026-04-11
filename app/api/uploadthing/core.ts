import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getAdminUser } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const admin = await getAdminUser();
      if (!admin) throw new Error("Unauthorized");
      return { userId: admin.id };
    })
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
