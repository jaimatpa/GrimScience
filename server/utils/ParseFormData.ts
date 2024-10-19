import formidable from 'formidable';

export const parseFormData = async (event) => {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(event.req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};