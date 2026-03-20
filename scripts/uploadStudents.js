import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

// Admin SDK bypasses all Firestore security rules
const serviceAccount = JSON.parse(
  fs.readFileSync(resolve(__dirname, './serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// read JSON file
const data = JSON.parse(
  fs.readFileSync(resolve(__dirname, './intellicamp_63_students.json'), 'utf8')
);

const upload = async () => {
  try {
    for (let student of data) {
      await db.collection('students').add({
        ...student,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Uploaded: ${student.studentId || student.email}`);
    }
    console.log(`\n🎉 Upload complete — ${data.length} students added.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading:', error);
    process.exit(1);
  }
};

upload();