import { db } from '@/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// Very simple function to send an email via Firebase
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    if (!to || !subject || !htmlContent) {
      return false;
    }

    const docRef = await addDoc(collection(db, 'mail'), {
      to: to,
      message: {
        subject: subject,
        html: htmlContent
      }
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}
