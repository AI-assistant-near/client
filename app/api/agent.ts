import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    console.log('Received fields:', fields);
    console.log('Received files:', files);

    // Assuming the file input name is "file"
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file received' });
    }

    console.log('File received:', file);

    res.status(200).json({ message: 'Audio received and processed (mocked action).' });
  });
};

export default handler;
