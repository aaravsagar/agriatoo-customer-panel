// Mock API endpoint for sending OTP
// In production, this would be a proper backend endpoint

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone || !phone.startsWith('+91')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid phone number format' 
    });
  }

  // Mock OTP sending logic
  // In production, integrate with MSG91 API
  console.log(`Sending OTP to ${phone}`);
  
  // Simulate API delay
  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      requestId: `mock_${Date.now()}`
    });
  }, 1000);
}