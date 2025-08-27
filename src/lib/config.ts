// Configuration file that works in both development and production
export const config = {
  // Postmark Email Service
  postmark: {
    apiKey: process.env.POSTMARK_API_KEY || '50e2ca3f-c387-4cd0-84a9-ff7fb7928d55',
    fromEmail: process.env.POSTMARK_FROM_EMAIL || 'noreply@reviewsandmarketing.com',
  },
  
  // Company Information
  company: {
    name: 'Reviews & Marketing',
    supportEmail: 'contact@reviewsandmarketing.com', // Updated to contact@reviewsandmarketing.com
    address: 'Riverfront Center, 221 River St 9th floor, Hoboken, NJ 07030',
    website: 'https://reviewsandmarketing.com',
  },
  
  // Environment
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Log configuration in development
if (config.isDevelopment) {
  console.log('Config loaded:', {
    postmark: { apiKey: config.postmark.apiKey ? 'EXISTS' : 'MISSING', fromEmail: config.postmark.fromEmail },
    company: config.company,
    environment: process.env.NODE_ENV
  });
}
