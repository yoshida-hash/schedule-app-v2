import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

const EVENTS_COLLECTION = 'events';

// スケジュール一覧の購読
export function subscribeToEvents(projectId, callback) {
    const q = query(collection(db, EVENTS_COLLECTION), where('projectId', '==', projectId));
    return onSnapshot(q, (snapshot) => {
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(events);
    }, (error) => {
        console.error("Error subscribing to events:", error);
        callback([]);
    });
}

// スケジュール追加
export async function addEvent(projectId, eventData) {
    try {
        return await addDoc(collection(db, EVENTS_COLLECTION), { ...eventData, projectId });
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

// スケジュール更新
export async function updateEvent(id, eventData) {
    try {
        const eventRef = doc(db, EVENTS_COLLECTION, id);
        await updateDoc(eventRef, eventData);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
}

// スケジュール削除
export async function deleteEvent(id) {
    try {
        await deleteDoc(doc(db, EVENTS_COLLECTION, id));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
}
