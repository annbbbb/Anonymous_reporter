# 🚨 Anonymous Reporter

A modern, AI-powered anonymous reporting system built with React, TypeScript, and Supabase.

## ✨ Features

- **🔒 Anonymous Reporting** - Submit reports without revealing identity
- **🤖 AI Analysis** - Automatic content analysis and categorization
- **📊 Dashboard** - Real-time analytics and filtering
- **📱 Responsive Design** - Works on all devices
- **🎨 Modern UI** - Built with Tailwind CSS and shadcn/ui
- **📈 Data Visualization** - Charts and statistics
- **🔍 Advanced Filtering** - Filter by category, status, priority
- **📄 Export** - PDF and CSV export functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Supabase account (optional - works in demo mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/annbbbb/Anonymous_reporter.git
   cd Anonymous_reporter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🔧 Configuration

### Demo Mode (Default)
The app works out of the box with 10 sample reports across all categories.

### Production Mode (Supabase)
1. Create a `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Run database setup scripts in Supabase:
   - `FIXED-database-setup.sql`
   - `FIXED-sample-data.sql`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── services/           # API and business logic
├── types/              # TypeScript type definitions
├── lib/                # Utilities and configurations
└── index.css           # Global styles
```

## 🎯 Available Categories

- **Safety** - Safety concerns and hazards
- **Financial** - Financial misconduct and corruption
- **Environmental** - Environmental issues and pollution
- **Legal** - Legal violations and corruption
- **Workplace** - Workplace harassment and discrimination
- **Other** - Other issues not covered above

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router

## 📊 Database Schema

The app uses two main tables:
- `reports` - Stores anonymous reports
- `locations` - Stores location data

See `FIXED-database-setup.sql` for full schema.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ for anonymous reporting**