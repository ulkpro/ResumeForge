# React Resume Builder

A client-side resume builder designed for developers. Tailor your resumes for specific tech stacks without manual copy-pasting.

All data is stored locally in the repo as Markdown files, meaning **no backend server is required**. You just fork this repo, add your points, and select what you want to include in a clean, minimalist LaTeX-style preview, and export to PDF.

## How it works

1. **Write Points in Markdown**: Your resume experiences and projects go into `/resume-points/experience/` and `/resume-points/projects/` respectively.
2. **Tag Tech Stacks**: Add tags at the end of each bullet point formatted like `[React, TypeScript, AWS]`.
3. **Filter & Select**: Open the React UI, filter points by your tags, and select the ones most relevant to the job opening.
4. **Export**: Click export, and it generates an A4 PDF, paginated appropriately. 

## Editing Your Data

To customize the resume:

1. Fork this repository.
2. Navigate to `resume-points/` directory.
3. Open or create a `.md` file in `experience/` or `projects/`. The format should be:

**Experience File: `/resume-points/experience/company_name.md`**
```markdown
---
company: "Your Company"
designation: "Software Engineer"
startDate: "Jan 2022"
endDate: "Present"
---

- Built a microservices architecture. [Java, Spring]
- Designed React frontend application. [React, UI]
```

**Project File: `/resume-points/projects/project_name.md`**
```markdown
---
project_name: "My Awesome Tool"
url: "github.com/my-tool"
---

- Automated deployment. [Docker, AWS]
```

## Running the Application Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the developer server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`. 

## Tech Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS v4
- PDF Export: html2pdf.js
- Local Storage State Persistence

## Export to PDF

The "Export PDF" functionality uses `html2pdf.js` behind the scenes. Adjust the styling under `index.css`'s `.resume-preview` class to customize fonts and sizing globally.
