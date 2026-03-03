# React Resume Builder

A client-side resume builder designed for developers to tailor resumes for specific target tech stacks seamlessly.

This project was built entirely using **Antigravity**, a powerful agentic AI coding assistant! 🚀

## How it works

1. **Job Role Structure**: Your resume is separated into distinct folders based on the target job role (e.g. `java-backend`, `devops`, `fullstack`).
2. **Markdown Data Files**: Experience, Projects, Education, and Skills for each role are stored in their own local `.md` files.
3. **Select Your Target Role**: Use the drop-down menu in the Sidebar UI to switch job contexts. The builder dynamically filters points and layouts exactly to your selection.
4. **Export**: Click export, and it generates an A4 or Letter PDF, dynamically styling pages. 

## Writing Changes Locally (Important ⚠️)

While the builder has a beautiful UI to let you edit, add, or toggle your resume points, **these changes write directly back to your local filesystem's `.md` files.** 

Because web browsers (and static hosts like GitHub Pages/Vercel) cannot write to the physical files of a repository, you **must run this application in a Local Development Environment** if you want your edits to actually save back into the repository! If hosted online, the UI will work for previewing, but modifying text/points will not save permanently. 

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

## Editing Your Data

You can either edit from the UI while running locally, or directly modify the `.md` files! 

The format should look like:

**Experience File: `/resume-points/java-backend/experience/company_name.md`**
```markdown
---
company: "Your Company"
designation: "Software Engineer"
startDate: "Jan 2022"
endDate: "Present"
---

- Built a microservices architecture.
- Designed scalable backends.
```

## Tech Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS v4
- PDF Export: html2pdf.js
- Local Storage State Persistence

## Export to PDF

The "Export PDF" functionality uses `html2pdf.js` behind the scenes. Adjust the styling under `index.css`'s `.resume-preview` class to customize fonts and sizing globally.
