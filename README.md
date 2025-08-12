# Rev-Cloud-JTBD

An interactive Jobs-to-be-Done Journey Mapping Platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🗺️ **Interactive Journey Visualization** - Dynamic React Flow diagrams showing your JTBD process
- 👥 **Job Performer Filtering** - Select job performers to highlight their involvement across journey steps  
- 🎯 **Team-based Highlighting** - Filter by product teams to see relevant journey segments
- 📊 **Clean, Modern UI** - Beautiful, minimal design with smooth transitions
- 🤖 **AI-Powered Search** - Natural language search capabilities (coming soon)
- 📄 **CSV Import** - Import journey data from CSV files (coming soon)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** with TypeScript
- **React Flow** for interactive diagrams
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Papaparse** for CSV handling

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rev-cloud-jtbd.git

# Navigate to project directory
cd rev-cloud-jtbd

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   └── MicroJobNode.tsx # Custom React Flow node
├── pages/              # Route-based page components
│   ├── HomePage.tsx    # Landing page with search
│   └── MapPage.tsx     # Interactive journey map
├── types/              # TypeScript type definitions
│   └── index.ts        # Core data types
└── App.tsx             # Main application component
```

## Data Structure

The application uses a hierarchical JTBD structure:

- **Job Domain Stage** - High-level process phase
- **Main Job** - Primary objective within a stage
- **Micro Job** - Specific task or step
- **Job Performers** - People/roles involved in tasks
- **Product Teams** - Organizational units responsible for execution

## Deployment

This project is configured for deployment on Vercel:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] CSV Import functionality
- [ ] AI-powered natural language search
- [ ] Table view for editing journey data
- [ ] Job performer taxonomy management
- [ ] Export capabilities (PDF, PNG)
- [ ] Collaboration features
- [ ] Template library

---

Built with ❤️ for better journey mapping