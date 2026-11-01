# CODIORA | Week 4 Freelance Marketplace

A responsive, browser-based freelance marketplace demo. Freelancers can find projects, save opportunities, send proposals, and track their proposal status. Project owners can publish project listings through the interface.

## Features

### Find work
- Browse the included sample projects and projects created in the app.
- Search by project title, category, description, or skill.
- Filter by category, experience level, budget range, and project type.
- Sort by newest, highest budget, lowest budget, or fewest proposals.
- Open project details in a dialog before applying.
- Save and unsave projects.

### Proposals
- Submit a proposal with a cover letter, price, delivery estimate, and relevant experience.
- Form validation checks required fields and minimum text lengths.
- View sent, active, and withdrawn proposal counts.
- Withdraw an active proposal.
- A freelancer can have one active proposal per project at a time.

### Post a project
- Create a project with its title, category, experience level, budget, skills, description, type, and estimated timeline.
- Required fields and minimum/maximum budget order are validated.
- Newly published projects appear in the job listings.

### Persistence
The app stores data in the current browser using `localStorage`:

- `codiora-proposals` stores submitted proposals and their status.
- `codiora-saved` stores saved project IDs.
- `codiora-custom-jobs` stores projects published through the form.

Data is local to the browser and is not synced to a server or another device. Clearing this site's browser storage removes saved app data.

## Run locally

No package installation or build step is required. From this project folder, start a local static server:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser. Stop the server with `Ctrl+C` in the terminal.

You can also open `index.html` directly, but a local server is recommended for consistent browser behavior.

## Project files

- `index.html` contains the marketplace views, forms, dialogs, and page structure.
- `styles.css` contains the responsive Codiora layout and visual styles.
- `app.js` contains sample job data, rendering, search and filters, form validation, and browser storage logic.
- `README.md` documents the Week 4 project and how to run it.
- `*.code-workspace` is the VS Code workspace configuration; it is not required by the app in a browser.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

The page loads DM Sans and Manrope from Google Fonts when an internet connection is available. The app uses fallback fonts when they are unavailable. Sample client avatars are loaded from Unsplash URLs and require internet access; the core marketplace interactions do not require a backend.
