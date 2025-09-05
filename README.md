# Pocket Parley

**Your rights, on call. Instant legal guidance in your pocket.**

Pocket Parley is a mobile-first web application that provides instant, easily digestible legal rights and guidance for citizens during interactions with law enforcement. Built with React, Tailwind CSS, and powered by AI-generated content.

![Pocket Parley Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Pocket+Parley+Screenshot)

## 🚀 Features

### Core Features

- **🛡️ Quick Rights Reference**: Location-aware 'Dos and Don'ts' for common legal interactions
- **💬 Scripted Responses & Translation**: Pre-written, AI-generated scripts in English and Spanish
- **🎥 One-Tap Incident Recording**: Discreet audio/video recording with trusted contact alerts
- **📤 Shareable Interaction Summary**: Auto-generated summaries for sharing with trusted contacts

### Technical Features

- **🌐 Progressive Web App (PWA)**: Works offline and can be installed on mobile devices
- **🤖 AI-Powered Content**: OpenAI integration for state-specific legal guidance
- **📍 Location Services**: Automatic location detection for jurisdiction-specific information
- **💳 Subscription Management**: Stripe integration for premium features
- **🔐 Secure Authentication**: Supabase Auth with Row Level Security
- **📱 Mobile-First Design**: Optimized for mobile devices with responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI Services**: OpenAI GPT-3.5 Turbo
- **Payments**: Stripe
- **State Management**: Zustand
- **Location**: Browser Geolocation API + BigDataCloud Geocoding
- **UI Components**: Custom components with Lucide React icons
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

You'll also need accounts and API keys for:

- **Supabase** (Database, Auth, Storage)
- **OpenAI** (AI content generation)
- **Stripe** (Payment processing)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-9739.git
cd this-is-a-9739
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `database-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies
4. Create storage buckets for recordings and summaries

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see the application running.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppBar.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   └── ...
├── services/           # External service integrations
│   ├── supabase.js     # Database and auth
│   ├── openai.js       # AI content generation
│   ├── stripe.js       # Payment processing
│   └── location.js     # Geolocation services
├── stores/             # State management
│   └── appStore.js     # Main Zustand store
├── hooks/              # Custom React hooks
│   └── index.js        # Location, recording, form hooks
├── utils/              # Utility functions
│   └── index.js        # Date formatting, validation, etc.
├── types/              # Type definitions
│   └── index.js        # JSDoc type definitions
└── App.jsx             # Main application component
```

## 🔧 Configuration

### Supabase Setup

1. **Create Project**: Sign up at [supabase.com](https://supabase.com) and create a new project
2. **Database Schema**: Execute the SQL from `database-schema.sql`
3. **Authentication**: Enable email/password authentication
4. **Storage**: Create buckets named `recordings` and `summaries`
5. **RLS Policies**: Ensure Row Level Security is enabled

### OpenAI Setup

1. **API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com)
2. **Usage Limits**: Set up usage limits to control costs
3. **Model Access**: Ensure access to GPT-3.5 Turbo model

### Stripe Setup

1. **Account**: Create a Stripe account at [stripe.com](https://stripe.com)
2. **Products**: Create subscription products for Basic ($1/month) and Premium ($3/month)
3. **Webhooks**: Set up webhooks for subscription events
4. **Test Mode**: Use test keys during development

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Import your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables in Vercel dashboard
3. **Build Settings**: Vercel will auto-detect Vite configuration
4. **Deploy**: Push to main branch to trigger deployment

### Netlify Deployment

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Environment Variables**: Add in Netlify dashboard

### Manual Deployment

```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Upload to your hosting provider
```

## 🔐 Security Considerations

### API Keys
- **Never commit API keys** to version control
- Use environment variables for all sensitive data
- Rotate keys regularly

### Database Security
- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- Sensitive operations require authentication

### Content Security
- AI-generated content is cached to reduce API costs
- User recordings are stored securely in Supabase Storage
- Shared summaries have expiration dates

## 📱 PWA Features

The application is configured as a Progressive Web App:

- **Offline Support**: Core functionality works without internet
- **Install Prompt**: Users can install the app on their devices
- **Push Notifications**: For emergency alerts (premium feature)
- **Background Sync**: Sync data when connection is restored

## 🧪 Testing

### Run Tests

```bash
npm run test
# or
yarn test
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## 📊 Subscription Plans

### Free Plan
- Basic rights information
- Limited state coverage
- Basic scripts (3 per month)
- Community support

### Basic Plan ($1/month)
- Complete rights information
- All 50 states coverage
- Unlimited scripts
- Basic recording features
- Email support

### Premium Plan ($3/month)
- Everything in Basic
- Advanced recording features
- Unlimited interaction logs
- Priority AI generation
- Trusted contact alerts
- Priority support
- Legal resource library

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Documentation](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help
- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/vistara-apps/this-is-a-9739/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/vistara-apps/this-is-a-9739/discussions)
- **Email**: Contact us at support@pocketparley.com

## 🙏 Acknowledgments

- **Legal Experts**: For providing guidance on civil rights content
- **Open Source Community**: For the amazing tools and libraries
- **Beta Testers**: For their valuable feedback and testing

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✅ Complete PRD implementation
- ✅ AI-powered rights generation
- ✅ Location-based content
- ✅ Recording functionality
- ✅ Subscription management
- ✅ Multi-language support (EN/ES)
- ✅ PWA capabilities
- ✅ Comprehensive database schema
- ✅ Security implementation

### Upcoming Features
- 🔄 Push notifications
- 🔄 Offline mode improvements
- 🔄 Additional languages
- 🔄 Legal resource library
- 🔄 Community features

---

**Built with ❤️ for civil rights and community safety**

*Pocket Parley - Your rights, on call.*
