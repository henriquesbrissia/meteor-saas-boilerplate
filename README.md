# SaaS Boilerplate

A complete boilerplate project for building SaaS applications using Meteor, React, TypeScript, and TailwindCSS. This project includes user authentication, team management, payment processing with Stripe, and much more.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Meteor](https://img.shields.io/badge/Meteor-2.5+-blue.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)

## 🚀 Features

- **Complete Authentication**
  - Login/Registration with Google, GitHub, and password
  - Two-factor authentication (2FA)
  - Password recovery
  - Customizable user profiles

- **Team Management**
  - Team creation and management
  - Member invitations
  - Different permission levels

- **Payments and Subscriptions**
  - Complete Stripe integration
  - Plan and subscription management
  - Customer billing portal

- **Modern Interface**
  - Responsive design with TailwindCSS
  - UI components based on Radix UI
  - Smooth animations and transitions

- **Optimized Development**
  - React Query for state management and caching
  - Permission-based protected routes
  - Form validation with Zod and React Hook Form

## 📋 Prerequisites

- Node.js (>= 14.x)
- Meteor (>= 2.5)
- MongoDB
- Stripe account (for payment features)
- OAuth credentials (Google, GitHub) for social authentication

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/saas-boilerplate.git
cd saas-boilerplate
```

### 2. Install dependencies

```bash
meteor npm install
```

### 3. Configure environment variables

Create a `settings.json` file in the root directory with your credentials:

```json
{
  "GOOGLE_OAUTH_CLIENT_ID": "your-google-client-id",
  "GOOGLE_OAUTH_SECRET": "your-google-client-secret",
  "GITHUB_OAUTH_CLIENT_ID": "your-github-client-id",
  "GITHUB_OAUTH_SECRET": "your-github-client-secret",
  "STRIPE_SECRET_KEY": "your-stripe-secret-key",
  "STRIPE_PUBLISHABLE_KEY": "your-stripe-publishable-key",
  "STRIPE_WEBHOOK_SECRET": "your-stripe-webhook-secret"
}
```

> **Note**: A `settings.json.example` file is available for reference.

## 🚀 Running the Application

### Development environment

```bash
meteor npm start
```

Or:

```bash
meteor run --settings settings.json
```

The application will be available at `http://localhost:3000`.

### Running Tests

```bash
meteor npm test
```

For tests in watch mode:

```bash
meteor npm run test-app
```

### Bundle Visualization

To analyze the bundle size:

```bash
meteor npm run visualize
```

## 📁 Project Structure

```
saas-boilerplate/
├── .meteor/            # Meteor configurations
├── client/             # Client-specific code
│   ├── main.html       # Main HTML
│   ├── main.tsx        # React entry point
│   └── main.css        # Global styles
├── imports/            # Shared code
│   ├── api/            # Collections, methods, and publications
│   ├── ui/             # React components, pages, and layouts
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utility functions
├── server/             # Server-specific code
├── public/             # Static files
├── tests/              # Automated tests
└── settings.json       # Application settings
```

## 🛠️ Technologies Used

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS
  - React Router
  - React Query
  - React Hook Form
  - Radix UI
  - Lucide React (icons)

- **Backend**:
  - Meteor
  - MongoDB
  - TypeScript
  - Stripe API

- **Development Tools**:
  - ESLint
  - Prettier
  - TypeScript
  - PostCSS
  - Babel

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

If you have any questions or suggestions, please open an issue or contact the project maintainers.

---

Developed with ❤️ using Meteor and React.
