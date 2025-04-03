# VS Code Portfolio

A developer portfolio website designed to look and feel like Visual Studio Code. This project showcases my skills as a developer while providing a unique and interactive user experience.

![VS Code Portfolio Screenshot](public/screenshot.png)

## Features

- **VS Code UI**: Authentic Visual Studio Code interface with a sidebar, file explorer, tabs, and command palette
- **Dark Mode**: Dark theme by default with support for theme switching
- **Interactive Navigation**: Navigate through different sections of the portfolio as if browsing files in VS Code
- **Command Palette**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the command palette
- **Terminal Interface**: Interactive terminal on the homepage with custom commands
- **Responsive Design**: Looks great on devices of all sizes
- **AI Chatbot**: An interactive AI assistant to answer questions
- **Smooth Animations**: Polished transitions and interactions using Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Theming**: next-themes
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vscode-portfolio.git
   cd vscode-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app                 # Next.js app router pages
│   ├── about           # About me section
│   ├── projects        # Projects showcase
│   ├── blog            # Blog posts
│   ├── contact         # Contact form
│   └── chat            # AI chatbot
├── components          # React components
│   ├── ui              # UI components from shadcn/ui
│   └── vscode          # VS Code-themed components
├── lib                 # Utility functions
├── public              # Static assets
└── styles              # Global styles
```

## Customization

### Personal Information

Edit the content in the various page files to customize the portfolio with your information:

- `app/about/page.tsx` - Your bio and background
- `app/about/skills/page.tsx` - Your technical skills
- `app/projects/*/page.tsx` - Your projects
- `app/contact/page.tsx` - Your contact information

### Styling

This project uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying the theme in `tailwind.config.js`
2. Editing component styles in their respective files

## Deployment

The easiest way to deploy your portfolio is using the [Vercel Platform](https://vercel.com/new).

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by Visual Studio Code
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide Icons](https://lucide.dev)
