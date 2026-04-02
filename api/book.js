import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, doctor, date, time, reason } = req.body;

  if (!name || !phone || !doctor || !date || !time) {
    return res.status(400).json({ error: 'सभी फील्ड भरें' });
  }

  try {
    await client.connect();
    const db = client.db('doctor_appointment');
    const appointments = db.collection('appointments');

    const newBooking = {
      name, phone, doctor, date, time, reason,
      bookingTime: new Date().toISOString(),
      receiptNo: 'APT-' + Date.now()
    };

    await appointments.insertOne(newBooking);
    return res.status(200).json({ success: true, receiptNo: newBooking.receiptNo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'सर्वर त्रुटि' });
  } finally {
    await client.close();
  }
}