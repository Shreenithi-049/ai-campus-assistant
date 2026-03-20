import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const serviceAccount = JSON.parse(
  fs.readFileSync(resolve(__dirname, './serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const data = JSON.parse(
  fs.readFileSync(resolve(__dirname, './timetable.json'), 'utf8')
);

const upload = async () => {
  try {
    for (const dept of Object.keys(data)) {
      for (const year of Object.keys(data[dept])) {
        const ref = db.collection('timetables').doc(dept).collection('years').doc(year);
        await ref.set({ ...data[dept][year], updatedAt: new Date() });
        console.log(`✅ Uploaded timetable: ${dept} / ${year}`);
      }
    }
    console.log('\n🎉 Timetable upload complete.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading timetable:', error);
    process.exit(1);
  }
};

upload();
