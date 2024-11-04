import { defineEventHandler } from "h3";
import { randomUUID } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    console.log(formData);
    if (!formData) {
      throw new Error("No form data received");
    }

    const uploadDir = join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const fileTypes = ["Drawing/Manual", "PDS", "SDS", "Quote"];

    const uploadPromises = fileTypes.map(async (fileType) => {
      const file = formData.find((f) => f.name === fileType);

      if (!file) {
        return null;
      }

      if (file.type !== "application/pdf") {
        throw new Error(
          `Invalid file type for ${fileType}: ${file.type}. Only PDFs are allowed.`
        );
      }

      const fileName = `${fileType
        .toLowerCase()
        .replace("/", "_")}_${randomUUID()}.pdf`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, file.data);

      return {
        fileType,
        originalName: file.filename,
        savedAs: fileName,
        size: file.data.length,
        url: `/uploads/${fileName}`,
        filePath,
      };
    });

    const results = await Promise.all(uploadPromises);
    const validResults = results.filter((result) => result !== null);
    return {
      message: "Files uploaded successfully",
      files: validResults,
    };
  } catch (error) {
    console.error("Error processing upload:", error);
    event.node.res.statusCode = 500;
    return {
      message: "Error processing upload",
      error: error.message,
    };
  }
});
