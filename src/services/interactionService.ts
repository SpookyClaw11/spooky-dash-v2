import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import { Interaction } from '../types';

const INTERACTIONS_COLLECTION = 'interactions';

export async function createInteraction(interaction: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, INTERACTIONS_COLLECTION), {
    ...interaction,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateInteraction(interactionId: string, updates: Partial<Interaction>): Promise<void> {
  const interactionRef = doc(db, INTERACTIONS_COLLECTION, interactionId);
  await updateDoc(interactionRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteInteraction(interactionId: string): Promise<void> {
  await deleteDoc(doc(db, INTERACTIONS_COLLECTION, interactionId));
}

export async function getInteractionsByUser(userId: string): Promise<Interaction[]> {
  const q = query(
    collection(db, INTERACTIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Interaction));
}

export async function getRecentInteractions(userId: string, limit: number = 5): Promise<Interaction[]> {
  const q = query(
    collection(db, INTERACTIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.slice(0, limit).map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Interaction));
}