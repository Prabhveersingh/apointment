import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  // सिर्फ GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // आसान सिक्योरिटी: एक सीक्रेट टोकन (आप खुद याद रखें)
  const token = req.headers['authorization'];
  if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await client.connect();
    const db = client.db('doctor_appointment');
    const appointments = db.collection('appointments');

    const all = await appointments.find({}).sort({ bookingTime: -1 }).toArray();
    return res.status(200).json(all);
  } catch (err) {
    return res.status(500).json({ error: 'Database error' });
  } finally {
    await client.close();
  }
}