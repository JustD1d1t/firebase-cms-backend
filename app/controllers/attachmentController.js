import firebase from '../firebase.js';
import {
  getStorage,
  deleteObject,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  listAll,
  getMetadata,   
} from "firebase/storage";

import {
  getFirestore 
} from "firebase/firestore";

export const addAttachment = async (req, res, next) => {
  try {
    const { userId, releaseId } = req.query; // Extract query parameters

    // Assuming the file is attached using a middleware like multer
    const file = req.file; // This depends on how you named the file field in your form
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storage = getStorage();
    const storageRef = ref(storage, `releases/${userId}/${releaseId}/${file.originalname}`); // Save the file with its original name

    // You can add custom metadata if needed
    const metadata = {
      contentType: file.mimetype,
    };

    // Upload the file to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, file.buffer, { customMetadata: metadata });

    // Send a response back to the client
    return res.status(200).json({
      message: 'File uploaded successfully',
      uploadResult,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const addAttachments = async (req, res, next) => {
  try {
    const { userId, releaseId } = req.query;
    const storage = getStorage();
    const storageRef = ref(storage, `releases/${userId}/${releaseId}`);
    const uploadPromises = req.files.map(file => {
      const fileRef = ref(storageRef, file.originalname);
      return uploadBytes(fileRef, file.buffer, { contentType: file.mimetype });
    });

    await Promise.all(uploadPromises);

    return res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to upload files' });
  }
}

export const removeAttachment = async (req, res, next) => {
  const storage = getStorage();
    try {
      const { userId, releaseId, name }  = req.query;
      const desertRef = ref(storage, `releases/${userId}/${releaseId}/${name}`);
      deleteObject(desertRef);
    } catch (error) {
      console.error("Error removing file from storage:", error);
      throw error;
    }
};

export const getAttachments = async (req, res, next) => {
  const storage = getStorage();
  try {
    const { userId, releaseId } = req.query;
    const folderRef = ref(storage, `releases/${userId}/${releaseId}`);
    const files = await listAll(folderRef);
    const urls = await Promise.all(files.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      return { url, item: itemRef, metadata };
    }));

    return res.status(200).json(urls);
  } catch (error) {
    console.log(error)
    console.error("Error fetching files from storage:", error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  }
};


const db = getFirestore(firebase);