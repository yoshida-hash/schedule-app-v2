import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';

const EVENTS_COLLECTION = 'events';

/**
 * 画像を読み込み、Canvasを使用してリサイズ・圧縮し、Base64形式のDataURLを返す
 */
function compressImage(file, maxWidth = 400, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 最大幅に合わせてリサイズ
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // JPEG形式で圧縮してBase64で出力
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// 画像処理（Firestore保存用のBase64変換）
export async function uploadImage(file) {
    if (!file) return null;
    try {
        console.log("Compressing image:", file.name);
        const base64 = await compressImage(file);
        console.log("Compression complete. Size:", (base64.length / 1024).toFixed(2), "KB");
        return base64;
    } catch (error) {
        console.error("Image Compression Error:", error);
        throw new Error('画像の圧縮に失敗しました。');
    }
}

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
