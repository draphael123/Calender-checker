# 📅 Calendar Checker & Feedback

A fun and colorful web application that analyzes calendar schedules to identify gaps based on normal volume cadence. Perfect for teams that need to ensure proper coverage throughout the day!

## Features

- 📤 Upload calendar files (.ics format) or images
- 🔍 Analyze schedule gaps based on time-of-day requirements
- 📊 Visual feedback with colorful charts and graphs
- 🎨 Beautiful, modern UI with smooth animations
- ⚡ Fast and responsive

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Deploy with one click!

### GitHub

Simply push to your repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## How It Works

1. Upload a calendar file (.ics) or image
2. The app analyzes your schedule
3. It identifies gaps based on expected volume:
   - Peak hours (9am-5pm): Higher coverage needed
   - Off-peak hours (after 10pm): Lower coverage acceptable
4. Get visual feedback on where you need more coverage!

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts for visualizations
- Lucide React for icons

## License

MIT

