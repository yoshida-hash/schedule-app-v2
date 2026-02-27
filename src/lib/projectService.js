import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

// 現場一覧の購読
export function subscribeToProjects(callback) {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(projects);
    }, (error) => {
        console.error("Error subscribing to projects:", error);
        callback([]);
    });
}

// 現場追加
export async function addProject(name) {
    try {
        return await addDoc(collection(db, PROJECTS_COLLECTION), {
            name,
            createdAt: new Date().toISOString()
        });
    } catch (e) {
        console.error("Error adding project: ", e);
        throw e;
    }
}

// 現場名更新
export async function updateProject(id, name) {
    try {
        const projectRef = doc(db, PROJECTS_COLLECTION, id);
        await updateDoc(projectRef, { name });
    } catch (e) {
        console.error("Error updating project: ", e);
        throw e;
    }
}

// 現場削除
export async function deleteProject(id) {
    try {
        await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
    } catch (e) {
        console.error("Error deleting project: ", e);
        throw e;
    }
}
