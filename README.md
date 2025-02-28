# SaaS Boilerplate

This is a boilerplate project for building SaaS applications using Meteor, React, and TypeScript. It includes user authentication, team management, and subscription handling.

## Features

- User Authentication (Google, GitHub, Password)
- Two-Factor Authentication option
- Team Management
- Embedded Stripe Subscription Handling
- Protected Routes
- React Query for Data Fetching
- TailwindCSS for Styling

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- Meteor (>= 2.5)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/saas-boilerplate.git
   cd saas-boilerplate
   ```

2. Install dependencies:
   ```bash
   meteor npm install
   ```

3. Create a `settings.json` file in the root directory with your OAuth credentials:
   ```json
   {
     "GOOGLE_OAUTH_CLIENT_ID": "your-google-client-id",
     "GOOGLE_OAUTH_SECRET": "your-google-client-secret",
     "GITHUB_OAUTH_CLIENT_ID": "your-github-client-id",
     "GITHUB_OAUTH_SECRET": "your-github-client-secret"
   }
   ```

### Running the Application

Start the application with the following command:
```bash
meteor run --settings settings.json
```

### Running Tests

Run the tests with the following command:
```bash
meteor npm test
```

## Project Structure

- `client/`: Contains the client-side code (React components, pages, etc.)
- `server/`: Contains the server-side code (Meteor methods, publications, etc.)
- `imports/`: Shared code between client and server (collections, methods, etc.)
- `tests/`: Contains the test files

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
