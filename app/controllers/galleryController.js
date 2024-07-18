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
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';

export const getGalleries = async (req, res, next) => {
  try {
    const q = query(collection(db, 'users', req.query.userId, 'gallery'));
    const querySnapshot = await getDocs(q);
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });
    res.status(200).json({
      data: docs,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

export const removeFiles = async (req, res, next) => {
  try {
    const { userId, galleryId } = req.query;
    const storage = getStorage();
    const storageRef = ref(storage, `gallery/${userId}/${galleryId}`);
    const listResult = await listAll(storageRef);
    const deletePromises = listResult.items.map(fileRef => deleteObject(fileRef));
    await Promise.all(deletePromises);

    return res.status(200).json({ message: 'Gallery deleted successfully' });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  }
}

export const removeFile = async (req, res, next) => {
  try {
    const { userId, galleryId, name } = req.query;
    const storage = getStorage();
    const storageRef = ref(storage, `gallery/${userId}/${galleryId}/${name
    }`);
    await deleteObject(storageRef);
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete file' });
  }
}

export const getImages = async (req, res, next) => {
  const storage = getStorage();
  try {
    const { userId, galleryId } = req.query;
    const folderRef = ref(storage, `gallery/${userId}/${galleryId}`);
    const files = await listAll(folderRef);
    const urls = await Promise.all(files.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      return { url, item: itemRef, metadata };
    }));

    return res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching files from storage:", error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  }
};

export const queryGallery = async (req, res, next) => {
  try {
    const { userId, galleryId } = req.query;
    const q = doc(getFirestore(), 'users', userId, 'gallery', galleryId);
    const docSnap = await getDoc(q);
    return res.status(200).json(docSnap.data());
  } catch (error) {
    console.error("Error fetching files from storage:", error);
    return res.status(500).json({ error: 'Failed to fetch files' });
  }
}

export const updateGallery = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = doc(db, 'users', req.query.userId, 'gallery', id);
    await updateDoc(product, data);
    res.status(200).json({
      message: 'product updated successfully'
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      error: error.message
    });
  }
};

export const addGallery = async (req, res, next) => {
  console.log('qwe')
  try {
    const data = req.body;
    const response = await addDoc(collection(db, 'users', req.query.userId, 'gallery'), data);
    res.status(200).json({
      message: 'Gallery added successfully',
      id: response.id,
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

export const addImage = async (req, res, next) => {
  try {
    const { userId, galleryId } = req.query; // Extract query parameters

    // Assuming the file is attached using a middleware like multer
    const file = req.file; // This depends on how you named the file field in your form
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const storage = getStorage();
    const storageRef = ref(storage, `gallery/${userId}/${galleryId}/${file.originalname}`); // Save the file with its original name

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

export const addImages = async (req, res, next) => {
  try {
    const { userId, galleryId } = req.query;
    const storage = getStorage();
    const storageRef = ref(storage, `gallery/${userId}/${galleryId}`);
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


const db = getFirestore(firebase);