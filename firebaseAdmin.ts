import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let adminApp: App | null = null;
let firestoreDb: Firestore | null = null;

export function getAdminApp(): App {
  if (!adminApp) {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      adminApp = existingApps[0]!;
    } else {
      adminApp = initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
  }
  return adminApp;
}

export function getAdminFirestore(): Firestore {
  if (!firestoreDb) {
    const app = getAdminApp();
    const firestoreDatabaseId = (firebaseConfig as any).firestoreDatabaseId;
    if (firestoreDatabaseId && firestoreDatabaseId !== '(default)') {
      firestoreDb = getFirestore(app, firestoreDatabaseId);
    } else {
      firestoreDb = getFirestore(app);
    }
  }
  return firestoreDb;
}

export async function updateUserPlanServerSide(
  uid: string,
  planType: 'free' | 'researcher' | 'investor' | 'enterprise',
  months: number
): Promise<{ success: boolean; expiry: string }> {
  const db = getAdminFirestore();
  const usageRef = db.doc(`users/${uid}/usage/current`);
  
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + months);
  const expiryIso = expiry.toISOString();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  await usageRef.set(
    {
      planType,
      planExpiry: expiryIso,
      lastReset: startOfMonth,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return { success: true, expiry: expiryIso };
}
