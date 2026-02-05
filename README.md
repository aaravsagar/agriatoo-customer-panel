@@ .. @@
-# AGRIATOO Agricultural Marketplace
+# AGRIATOO - Mobile-First Agricultural Marketplace

-Your trusted marketplace for quality agricultural products
+A mobile-first ecommerce platform for agricultural products with OTP-based authentication and location-based product filtering.

-## Features
+## Key Features

-- **Product Catalog**: Browse fertilizers, pesticides, seeds, and tools
-- **Cart Management**: Add/remove items with real-time stock tracking
-- **Order Tracking**: Track your orders with QR codes
-- **User Authentication**: Secure login system
-- **Responsive Design**: Works on all devices
+### Authentication Flow
+- **Mobile OTP Login**: Phone number + OTP verification using MSG91
+- **No Email Required**: Streamlined mobile-first authentication
+- **Session Persistence**: Maintains login state across app restarts
+
+### Location-Based Shopping
+- **Address Selection**: Google Maps integration with Places Autocomplete
+- **Draggable Pin**: Visual address selection with reverse geocoding
+- **Pincode Filtering**: Products shown only for user's delivery area
+- **Address Management**: Save and update delivery addresses
+
+### Product Discovery
+- **Location-Aware Catalog**: Products filtered by availability in user's pincode
+- **Real-time Search**: Instant product search and filtering
+- **Stock Management**: Real-time inventory tracking
+- **Cart Persistence**: Shopping cart saved across sessions
+
+## User Flow
+
+1. **Login Screen** (`/login`)
+   - Enter mobile number
+   - Receive and verify OTP
+   - Auto-create user account
+
+2. **Address Selection** (`/address`)
+   - Google Maps with Places Autocomplete
+   - Draggable pin for precise location
+   - Auto-fill address details
+   - Save delivery address
+
+3. **Product Catalog** (`/home`)
+   - Location-filtered products
+   - Search and browse
+   - Add to cart
+   - View product details
+
+4. **Shopping & Orders** (`/cart`, `/track`)
+   - Review cart items
+   - Place orders
+   - Track order status
+
+## Technical Architecture
+
+### Frontend
+- **React 18** with TypeScript
+- **Tailwind CSS** for styling
+- **React Router** for navigation
+- **Google Maps API** for location services
+- **Firebase SDK** for authentication and data
+
+### Backend Services
+- **Firebase Auth** with custom tokens
+- **Firestore** for data storage
+- **MSG91 API** for OTP delivery
+- **Google Maps API** for geocoding
+
+### Data Structure
+
+```
+users/{uid}
+├── phone: string
+├── createdAt: timestamp
+└── address/main
+    ├── fullAddress: string
+    ├── city: string
+    ├── area: string
+    ├── pincode: string
+    ├── lat: number
+    └── lng: number
+
+products/{id}
+├── name: string
+├── price: number
+├── availablePincodes: string[]
+├── stock: number
+└── isActive: boolean
+
+orders/{id}
+├── userId: string
+├── items: array
+├── address: object
+├── pincode: string
+├── lat: number
+├── lng: number
+└── status: string
+```

 ## Setup Instructions

+### Prerequisites
+- Node.js 18+
+- Firebase project
+- Google Maps API key
+- MSG91 account
+
+### Environment Variables
+
+Create `.env` file:
+
+```env
+# Firebase Configuration
+VITE_FIREBASE_API_KEY=your_firebase_api_key
+VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
+VITE_FIREBASE_PROJECT_ID=your_project_id
+VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
+VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
+VITE_FIREBASE_APP_ID=your_app_id
+
+# Google Maps API Key
+VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
+
+# Backend Environment Variables
+MSG91_API_KEY=your_msg91_api_key
+FIREBASE_PROJECT_ID=your_project_id
+FIREBASE_CLIENT_EMAIL=your_service_account_email
+FIREBASE_PRIVATE_KEY=your_service_account_private_key
+```
+
+### Installation
+
 1. **Clone the repository**
    ```bash
    git clone <repository-url>
    cd agriatoo-customer-panel
    ```

 2. **Install dependencies**
    ```bash
    npm install
    ```

-3. **Configure Firebase**
-   - Create a Firebase project
-   - Enable Authentication and Firestore
-   - Add your Firebase config to `src/config/firebase.ts`
+3. **Configure Services**
+   
+   **Firebase Setup:**
+   - Create Firebase project
+   - Enable Authentication (Custom Token method)
+   - Enable Firestore Database
+   - Generate service account key
+   - Update Firestore security rules
+   
+   **Google Maps Setup:**
+   - Enable Maps JavaScript API
+   - Enable Places API
+   - Enable Geocoding API
+   - Restrict API key to your domain
+   
+   **MSG91 Setup:**
+   - Create MSG91 account
+   - Get API key
+   - Configure OTP template

 4. **Start development server**
    ```bash
    npm run dev
    ```

-## Technologies Used
+### Firestore Security Rules
+
+Deploy the security rules from `firestore.rules`:
+
+```bash
+firebase deploy --only firestore:rules
+```
+
+### Production Deployment
+
+1. **Build the application**
+   ```bash
+   npm run build
+   ```
+
+2. **Deploy to your hosting platform**
+   - Vercel, Netlify, or Firebase Hosting
+   - Ensure environment variables are configured
+   - Set up API routes for OTP functionality
+
+## API Integration
+
+### OTP Service Integration
+
+Replace mock API endpoints with actual MSG91 integration:
+
+```javascript
+// Backend API route example
+const response = await fetch('https://api.msg91.com/api/v5/otp', {
+  method: 'POST',
+  headers: {
+    'Content-Type': 'application/json',
+    'authkey': process.env.MSG91_API_KEY
+  },
+  body: JSON.stringify({
+    mobile: phone,
+    template_id: 'your_template_id'
+  })
+});
+```
+
+### Firebase Admin Integration
+
+Set up Firebase Admin SDK for custom token generation:
+
+```javascript
+import { getAuth } from 'firebase-admin/auth';
+
+const customToken = await getAuth().createCustomToken(uid, {
+  phone: phoneNumber
+});
+```
+
+## Security Considerations
+
+- **API Keys**: Never expose MSG91 API key in frontend
+- **Custom Tokens**: Generate on secure backend only
+- **Firestore Rules**: Restrict data access by user ID
+- **Input Validation**: Validate phone numbers and OTP format
+- **Rate Limiting**: Implement OTP request rate limiting
+
+## Mobile Optimization
+
+- **Responsive Design**: Mobile-first approach
+- **Touch Interactions**: Optimized for touch devices
+- **Performance**: Lazy loading and code splitting
+- **PWA Ready**: Can be enhanced for Progressive Web App
+
+## Technologies Used

-- React 18 with TypeScript
-- Firebase (Auth, Firestore, Storage)
-- Tailwind CSS
-- React Router DOM
-- Lucide React Icons
-- Vite
+- **Frontend**: React 18, TypeScript, Tailwind CSS
+- **Backend**: Firebase Auth, Firestore, MSG91 API
+- **Maps**: Google Maps JavaScript API, Places API
+- **Build Tool**: Vite
+- **Deployment**: Vercel/Netlify compatible

-## Project Structure
+## Contributing

-```
-src/
-├── components/          # React components
-│   ├── Auth/           # Authentication components
-│   ├── Customer/       # Customer-facing components
-│   ├── Layout/         # Layout components
-│   └── UI/             # Reusable UI components
-├── config/             # Configuration files
-├── hooks/              # Custom React hooks
-├── types/              # TypeScript type definitions
-├── utils/              # Utility functions
-└── main.tsx           # Application entry point
-```
+1. Fork the repository
+2. Create feature branch (`git checkout -b feature/amazing-feature`)
+3. Commit changes (`git commit -m 'Add amazing feature'`)
+4. Push to branch (`git push origin feature/amazing-feature`)
+5. Open Pull Request

-## Contributing
+## License

-1. Fork the repository
-2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
-3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
-4. Push to the branch (`git push origin feature/AmazingFeature`)
-5. Open a Pull Request
+MIT License - see LICENSE file for details

-## License
+## Support

-This project is licensed under the MIT License.
+For support and questions:
+- Create an issue in the repository
+- Contact: support@agriatoo.com