# 🚀 Project Overview

## 📚 Technologies & Skills I'm Learning

### Firebase:
- Database management (storing articles and images)
- User authentication (login system)

### UX & UI Design:
- Enhancing user experience and interface design

### Usability:
- Creating intuitive and accessible designs

### Documentation:
- Understanding and using technical documentation
- Writing clear and comprehensive project documentation

## 🎨 Logo Color Palette

- **Blue:** `#458FCC` (Primary accent)
- **Green:** `#89BD4F` (Secondary accent)
- **Beige:** `#E3DDD1` (Neutral background tone)

## 📂 Project Structure

- **Shared Header:** Ensures consistency across all pages
  - File: `header.js`
- **Firebase Integration:**
  - Authentication for user logins
  - Database for storing articles and images

## 🔥 Firebase Features Overview

### Authentication:
- Email/Password Sign-In
- Google Sign-In
- User Session Management (track user states and logouts)
- Password Reset Functionality

### Firestore Database:
- Store and retrieve articles and images
- Real-time data synchronization
- Query data with filters (e.g., by category or date)
- Structure data using collections and documents

### Storage:
- Upload and manage images securely
- Generate download URLs for accessing images
- Organize images in storage buckets

### Security Rules:
- Control read and write access
- Ensure user data privacy
- Validate input data to prevent unauthorized access

## 🛡 GDPR Compliance

This project follows **General Data Protection Regulation (GDPR)** principles to ensure user data privacy and security. The key measures include:

### User Consent:
- Users must explicitly consent before data collection (e.g., account creation, storing images).
- Cookie banners or consent pop-ups (if applicable) to allow users to accept or reject non-essential tracking.

### Data Privacy & Security:
- User authentication ensures that only authorized users can access their data.
- Firebase Security Rules are implemented to prevent unauthorized access to stored articles and images.
- HTTPS encryption ensures secure communication between users and the database.

### User Rights:
- Users can request access, correction, or deletion of their personal data.
- Users can reset their passwords and manage their authentication details.

### Data Retention & Storage:
- Data is stored securely in **Firebase Firestore and Storage**.
- Only necessary data is collected, and users can delete their accounts upon request.

### Third-Party Compliance:
- Firebase is GDPR-compliant, and only GDPR-compliant third-party services are used.

For any **privacy-related requests**, users can contact the project administrator.

## 📜 License
This project is licensed under the [MIT License](LICENSE).

