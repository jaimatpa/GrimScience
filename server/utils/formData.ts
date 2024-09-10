import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export async function processUploadedFiles(files: any) {
  const fileDetails = [];

  for (const key in files) {
    if (files.hasOwnProperty(key)) {
      const file = files[key];
      if (Array.isArray(file)) {
        for (const f of file) {
          // Example: Save file to a specific directory
          const filePath = path.join('./uploads', path.basename(f.filepath));
          await fs.rename(f.filepath, filePath);
          fileDetails.push({ field: key, filepath: filePath });
        }
      } else {
        // Example: Save file to a specific directory
        const filePath = path.join('./uploads', path.basename(file.filepath));
        await fs.rename(file.filepath, filePath);
        fileDetails.push({ field: key, filepath: filePath });
      }
    }
  }

  return fileDetails;
}

export const parseMultipartFormData = async (event) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(event.req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

// export async function parseMultipartFormData(event: any): Promise<{ fields: any, files: any }> {
//   return new Promise((resolve, reject) => {
//     const form = new IncomingForm({ uploadDir: './uploads', keepExtensions: true });
//     form.parse(event.req, (err, fields, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve({ fields, files });
//       }
//     });
//   });
// }

// // Function to handle and save uploaded files
// export async function processUploadedFiles(files: any) {
//   const fileDetails = [];
//   for (const key in files) {
//     if (files.hasOwnProperty(key)) {
//       const file = files[key];
//       if (Array.isArray(file)) {
//         for (const f of file) {
//           fileDetails.push({ field: key, filepath: f.filepath });
//         }
//       } else {
//         fileDetails.push({ field: key, filepath: file.filepath });
//       }
//     }
//   }
//   return fileDetails;
// }
