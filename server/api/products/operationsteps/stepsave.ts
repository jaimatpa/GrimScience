import { IncomingForm } from 'formidable';
import { saveStepDetails } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    if (event.method !== 'POST') {
      throw new Error('Method Not Allowed');
    }

    const form = new IncomingForm({ multiples: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const dataOb = JSON.parse(fields.data);
    const mediaList = Array.isArray(files.files) ? files.files : [files.files];

    const stepID = await saveStepDetails(dataOb.stepData, dataOb.partsList, mediaList, dataOb.username, dataOb.deleteFiles);

  
    return { success: true, stepID, message: 'Step saved successfully!' };
  } catch (error) {
    console.error('Error in API:', error);
    return { success: false, message: `Error saving step: ${error.message}` };
  }
});
