document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    doctor: document.getElementById('doctor').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    reason: document.getElementById('reason').value
  };

  const res = await fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (result.success) {
    alert('✅ अपॉइंटमेंट बुक हो गई!');

    // PDF रसीद बनाएँ और डाउनलोड कराएँ
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("डॉक्टर अपॉइंटमेंट रसीद", 10, 10);
    doc.text(`नाम: ${data.name}`, 10, 20);
    doc.text(`फोन: ${data.phone}`, 10, 30);
    doc.text(`डॉक्टर: ${data.doctor}`, 10, 40);
    doc.text(`तारीख: ${data.date}`, 10, 50);
    doc.text(`समय: ${data.time}`, 10, 60);
    doc.text(`सिलसिला: ${data.reason}`, 10, 70);
    doc.save(`receipt_${Date.now()}.pdf`);
  } else {
    alert('❌ बुकिंग विफल: ' + result.error);
  }
});