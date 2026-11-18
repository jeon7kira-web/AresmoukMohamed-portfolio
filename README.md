# Smox Portfolio

A static portfolio website built with HTML, CSS and vanilla JavaScript.

## Run locally

1. Extract the ZIP.
2. Open `index.html` in a browser, or open the folder with VS Code and use Live Server.
3. Keep the folder structure intact so the images, logo files and CV load correctly.

## Included files

- `index.html` — page content and project dialog
- `style.css` — responsive layout, themes and animations
- `app.js` — interactions, navigation, character animation and project dialogs
- `projects.js` — project descriptions, screenshots and optional external links
- `images/` — project screenshots for Vintage Clothing, Walid Books and Ana Wa Dîni
- `logo.png`, `logo-light.png` — theme logos
- `character.png`, `character-original.png` — animated character artwork
- `cv.pdf` — resume download

## Update your contact details and project links

Open `projects.js` and edit:

```js
contact: {
  email: 'your-real-email@example.com',
  linkedin: 'https://www.linkedin.com/in/your-real-profile/'
}
```

Replace the example values only with your real details. Each project supports:

- `live`: public website URL
- `repo`: public source-code URL
- `screenshots`: local image paths and descriptive alt text
- `demo`: local MP4 path (plays inside the project dialog)
- `demoUrl`: external demo URL (opens from the dialog)
- `poster`: optional poster image for a local video

Leave values empty when a link or demo is not available. The portfolio hides unavailable links rather than showing placeholder destinations.

## Add screenshots or a video

Put new images inside an appropriate folder under `images/`, then add them to that project's `screenshots` array in `projects.js`:

```js
screenshots: [
  { src: 'images/elitewheels/home.png', alt: 'EliteWheels homepage' },
  { src: 'images/elitewheels/fleet.png', alt: 'Vehicle fleet and filters' }
]
```

For a local video, put the MP4 in a `videos/` folder and set:

```js
demo: 'videos/elitewheels-demo.mp4',
poster: 'images/elitewheels/home.png'
```

Only add files and URLs that exist and that you are comfortable showing publicly.

## Before publishing

- Add your real email and LinkedIn URL in `projects.js`.
- Check every project description and remove anything you cannot confidently demonstrate.
- Confirm the CV is current and contains the contact details you want public.
- Test the mobile menu, both themes, project popups, screenshot galleries and CV download.
- Open every live/repository/demo link once after configuring it.

## Validation

`app.js` and `projects.js` pass Node.js syntax checks. Static checks found no duplicate HTML IDs, no missing local assets referenced by `index.html`, no missing ID selectors used by `app.js`, and balanced CSS braces. A full interactive browser test could not be completed in this environment.


## Updating your portfolio

- Edit `projects.js` to update contact details, project dates, descriptions, screenshots and links.
- Project cards are sorted newest-first using each project's `sortDate` (`YYYY-MM`).
- Add project screenshots under `images/<project-name>/` and list them in that project's `screenshots` array.
- The LinkedIn profile is configured. Add the confirmed email address to `contact.email` in `projects.js`; it will appear as a working `mailto:` button.
