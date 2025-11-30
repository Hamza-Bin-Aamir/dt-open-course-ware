# Open Courseware Catalogue

A modern, static frontend application for browsing and viewing course materials with support for multiple file formats.

## Features

- 🎨 **Beautiful Theme**: Purple, Black, and Blue color scheme
- 📚 **Multi-format Support**:
  - PDF files with embedded viewer
  - Markdown files with math support (KaTeX)
  - LaTeX source files
  - External links with preview
  - YouTube video embeds
- 📁 **Directory Structure**: Organized by courses and weeks
- 🔍 **Easy Navigation**: Sidebar with collapsible weeks
- 📱 **Responsive Design**: Works on desktop and mobile devices

## File Format Support

### Supported Formats

1. **PDF** (`.pdf`) - Embedded PDF viewer with zoom and page navigation
2. **Markdown** (`.md`) - Full markdown rendering with math equations
3. **LaTeX** (`.tex`) - Display LaTeX source code
4. **Links** (`.link`) - Preview external websites with YouTube embed support

## Directory Structure

```
public/courses/
  └── DT101 - Introduction to debate/
      ├── Week 1/
      │   ├── 01 Introduction to DT.md
      │   └── Handout.pdf
      ├── Week 2/
      │   ├── 02 Public Speaking.tex
      │   ├── 03 Debate Video.link
      │   └── Motions.pdf
      └── Week 3/
          ├── 04 Wikipedia.link
          └── Cases.pdf
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Adding New Content

### Adding a New Course

1. Create a directory under `public/courses/`:
   ```
   public/courses/COURSE_ID - Course Name/
   ```

2. Update `src/data/courseStructure.ts` to include the new course

### Adding Course Materials

1. **PDF Files**: Drop `.pdf` files into the appropriate week folder
2. **Markdown Files**: Create `.md` files with markdown content
3. **LaTeX Files**: Create `.tex` files with LaTeX source
4. **Links**: Create `.link` files containing just the URL

Example link file (`video.link`):
```
https://www.youtube.com/watch?v=VIDEO_ID
```

### Updating Course Structure

Edit `src/data/courseStructure.ts` to reflect your directory structure:

```typescript
{
  id: 'COURSE_ID',
  name: 'Course Name',
  weeks: [
    {
      name: 'Week 1',
      files: [
        {
          name: 'Display Name',
          path: '/courses/COURSE_ID/Week 1/file.pdf',
          type: 'pdf' // or 'markdown', 'latex', 'link'
        }
      ]
    }
  ]
}
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **react-pdf** - PDF rendering
- **react-markdown** - Markdown rendering
- **KaTeX** - Math equation rendering
- **Lucide React** - Icons

## Theme Colors

- **Purple**: `#8b5cf6` (Primary)
- **Blue**: `#3b82f6` (Secondary)
- **Black**: `#0f0f0f` (Background)
- **Black Light**: `#1a1a1a` (Cards/Panels)
- **Gray**: `#2d2d2d` (Borders)

## License

MIT

