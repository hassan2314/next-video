# Next Video - Video Sharing Platform

A modern video sharing platform built with Next.js 15, featuring user authentication, video upload, and channel management capabilities.

## Features

- 🎥 **Video Upload & Streaming** - Upload and share videos with automatic thumbnail generation
- 👤 **User Authentication** - Secure login/register with NextAuth.js supporting multiple providers
- 🔐 **Multiple Auth Providers** - Support for credentials, Google, and GitHub authentication
- 📱 **Responsive Design** - Modern UI built with Tailwind CSS
- 🎬 **Channel System** - User channels for organizing and displaying videos
- 🔒 **Protected Routes** - Secure API endpoints with middleware protection
- 📧 **Password Reset** - Email-based password recovery system
- 🎨 **Modern UI Components** - Built with Headless UI and Lucide React icons

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **Media Storage**: ImageKit for video and image handling
- **Email**: Nodemailer for transactional emails
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- ImageKit account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-video
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # Email (for password reset)
   EMAIL_FROM=your_email@example.com
   EMAIL_SERVER_HOST=your_smtp_host
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your_smtp_username
   EMAIL_SERVER_PASSWORD=your_smtp_password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── upload/            # Video upload page
│   ├── videos/            # Video viewing pages
│   ├── channel/           # Channel pages
│   ├── forgot-password/   # Password recovery
│   └── reset-password/    # Password reset
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── models/                # MongoDB/Mongoose models
│   ├── User.ts           # User model
│   └── Video.ts          # Video model
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── middleware.ts          # Route protection middleware
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Videos
- `GET /api/video` - Get all videos
- `POST /api/video` - Upload new video (protected)
- `GET /api/videos/[id]` - Get specific video
- `PUT /api/videos/[id]` - Update video (protected)
- `DELETE /api/videos/[id]` - Delete video (protected)

### Channels
- `GET /api/channel/[id]` - Get channel information and videos

### User Management
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

## Authentication Flow

The application uses NextAuth.js with the following features:

- **Multiple Providers**: Credentials, Google, GitHub
- **Secure Sessions**: JWT-based authentication
- **Route Protection**: Middleware-based route protection
- **Password Recovery**: Email-based password reset system

### Protected Routes

- `/upload` - Video upload (requires authentication)
- `/api/video` (POST) - Video creation (requires authentication)
- Video management endpoints (requires ownership)

### Public Routes

- `/` - Home page (video gallery)
- `/login` - Login page
- `/register` - Registration page
- `/videos/[id]` - Video viewing
- `/channel/[id]` - Channel viewing

## Video Upload Process

1. **Authentication Check** - User must be logged in
2. **File Upload** - Videos uploaded to ImageKit
3. **Thumbnail Generation** - Automatic thumbnail creation
4. **Database Storage** - Video metadata stored in MongoDB
5. **Processing** - Optional video transformations via ImageKit

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Ensure all required environment variables are set in your production environment:

- Database connection string
- NextAuth configuration
- ImageKit credentials
- Email server settings

### Recommended Platforms

- **Vercel** - Seamless Next.js deployment
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Container-based deployment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:

1. Check the [issues](../../issues) for existing solutions
2. Create a new issue for bug reports or feature requests
3. Review the documentation for setup instructions

---

Built with ❤️ using Next.js and modern web technologies.