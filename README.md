Bookshelf Application
This project is a simple Bookshelf Application built using React, TypeScript, and Vite. The application allows users to search for books by title, add books to their personal bookshelf, and manage their book collection. It uses an external API for book details and follows a clean and organized component-based structure.

Features
User Registration: Register to access the bookshelf.
Book Search: Search for books by title using the API.
Book Management: Add books to your bookshelf, view, and manage your collection.
Smooth Animations: Interactive UI with animations for a better user experience.
User Authentication: Simple authentication mechanism to protect routes.
Tech Stack
Frontend: React, TypeScript, Vite
UI Library: Material UI (MUI) for components and layout
State Management: Redux (with redux-toolkit)
Animations: Framer Motion for smooth transitions and hover effects
API Requests: Axios for HTTP requests
Hashing: crypto-js (MD5) for generating secure API signatures
Icons: react-icons
Project Structure
The application is organized into the following key components:

Navbar: The main navigation bar with a search input and logout button.
Book Cards: Display search results with book details and an option to add the book to the user's collection.
Redux Setup: State management for handling user credentials and other application state.
API Integration: Fetches book data and sends POST requests to add books.
Installation and Setup
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/bookshelf-app.git
Navigate to the project directory:

bash
Copy code
cd bookshelf-app
Install the dependencies:

bash
Copy code
npm install
Set up your environment variables in a .env file. The app requires the following environment variables:

bash
Copy code
VITE_API_URL=https://no23.lavina.tech
VITE_API_KEY=your_api_key
Run the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser to view the application.

Scripts
npm run dev: Start the development server.
npm run build: Build the app for production.
npm run lint: Run the linter for code quality checks.
API Usage
The app interacts with a custom API hosted at https://no23.lavina.tech. API requests are authenticated using a key and a signature generated via crypto-js MD5 hashing.

Search for a book: Search by book title.
Add a book: Add a book to the user's personal bookshelf by ISBN.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
