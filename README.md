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

1. Upload a calendar file, document, or image containing schedule information
2. The app extracts schedule data by finding:
   - **Days of the week** (Monday, Tuesday, etc.)
   - **Times** (9:00 AM, 2:00 PM, etc.)
   - **Time ranges** (9am-5pm, 2:00 PM - 4:00 PM)
   - **Specific dates** (if provided)
3. It analyzes your schedule and identifies gaps based on expected volume:
   - Peak hours (9am-5pm): Higher coverage needed
   - Off-peak hours (after 10pm): Lower coverage acceptable
4. Get visual feedback on where you need more coverage!

### Supported Schedule Formats

The app can extract schedules from text like:
- "Monday 9am-5pm"
- "Tuesday 2:00 PM - 4:00 PM"
- "Wednesday 09:00 - 17:00"
- "Thursday 10am"
- Or any combination of day + time in images, PDFs, or Word documents

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts for visualizations
- Lucide React for icons

## License

MIT

