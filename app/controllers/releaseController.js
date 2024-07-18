import firebase from '../firebase.js';
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

export const addRelease = async (req, res, next) => {
  try {
    const data = req.body;
    const response = await addDoc(collection(db, 'users', req.query.userId, 'releases'), data);
    res.status(200).json({
      message: 'Release added successfully',
      id: response.id,
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

export const deleteRelease = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteDoc(doc(db, 'users', req.query.userId, 'releases', id));
    res.status(200).json({
      message: 'product deleted successfully',
    });
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

export const getReleases = async (req, res, next) => {
  try {
    const q = query(collection(db, 'users', req.query.userId, 'releases'));
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

export const updateRelease = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const product = doc(db, 'users', req.query.userId, 'releases', id);
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

export const getRelease = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = doc(db, 'users', req.query.userId, 'releases', id);
    const data = await getDoc(product);
    if (data.exists()) {
      res.status(200).json({
        data: { ...data.data(), id: data.id }
      });
    } else {
      res.status(404).json({
        message: 'product not found'
      });
    }
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};

const db = getFirestore(firebase);