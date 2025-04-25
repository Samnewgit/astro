# Astrology Analysis App

A web application that uses DeepSeek API to generate detailed astrological analyses based on birth details.

## Features

- Simple form to collect birth details (date, time, and place)
- Integration with DeepSeek API for AI-powered astrological analysis
- Beautiful dark theme with cosmic design
- Detailed astrological analysis including:
  - Birth chart with planetary positions
  - Life event predictions (positive and negative influences)
  - Mahadasha and Antardasha predictions from 2025 to 2030
  - Remedial suggestions

## Deployment to Cloudflare Pages

This application is configured to deploy to Cloudflare Pages. Follow these steps to deploy:

### 1. Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is fine)
- A GitHub account with this repo pushed to it
- Your DeepSeek API key

### 2. Connect to Cloudflare Pages

1. Log in to your Cloudflare Dashboard
2. Go to **Pages** > **Create a project** > **Connect to Git**
3. Select your GitHub repository
4. Configure your build settings:
   - **Project name**: Choose a name (e.g., astrology-analysis)
   - **Production branch**: `main` (or your default branch)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave blank)

### 3. Set Environment Variables

In the Cloudflare Pages settings, add the following environment variables:
- `DEEPSEEK_API_KEY`: Your DeepSeek API key

Make sure to add this to both **Production** and **Preview** environments.

### 4. Deploy

Click "Save and Deploy". Cloudflare Pages will build and deploy your application.

### 5. Custom Domain (Optional)

After deployment, you can set up a custom domain in the Cloudflare Pages settings.

## Local Development

### Prerequisites

- Node.js (v16 or newer)
- A DeepSeek API key

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with your DeepSeek API key:
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```
   
### Running the Application

Start the development server:

```
npm run dev
```

Visit `http://localhost:4321` in your browser to see the application.

### Building for Production

To build the application for production:

```
npm run build
```

## Security Features

- Server-side API key protection
- Rate limiting
- Input validation and sanitization
- Security headers

## How It Works

1. Users enter their birth details (date, time, and place) in the form
2. The application sends this information to the DeepSeek API with a specialized prompt for astrological analysis
3. DeepSeek processes the data and returns a detailed astrological analysis
4. The application displays the results in a user-friendly format

## Note

This is an MVP (Minimum Viable Product) intended for demonstration purposes. In a production environment, you would want to add:

- Input validation
- Error handling for API failures
- User accounts and history
- More sophisticated UI with charts and visualizations

## License

This project is licensed under the MIT License.

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
