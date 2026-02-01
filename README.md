# 📊 Takeoff Analytics Dashboard

The official admin dashboard for the **Takeoff** event platform. This application provides real-time insights into user registrations, event capacity, and conversion metrics.

## 🚀 Features

- **Real-time Overview**: Monitor total registrations, unique visitors, and capacity status.
- **Conversion Tracking**: Track conversion rates with high precision (2 decimal places).
- **Capacity Management**: Visual progress of event filling with precise percentage tracking (3 decimal places).
- **Demographics**: Breakdown of attendees by Gender, Profession, and Location.
- **Advanced Filtering**: Filter user lists by check-in status, gender (including non-binary options), and newsletter subscription.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Iconify](https://iconify.design/)
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OpenSourceNest/takeoff-admin.git
   cd takeoff-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4500
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📦 Build for Production

To build the application for production usage:

```bash
npm run build
npm start
```
