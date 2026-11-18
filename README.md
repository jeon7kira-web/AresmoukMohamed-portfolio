# Smox portfolio — updated files

Replace index.html, style.css and app.js in your existing portfolio folder. Add projects.js alongside them. Keep your existing image assets in that folder.

## Required existing assets
- logo.png (dark theme)
- logo-light.png (rename your Lavender and purple logo swap image)
- character.png (head layer)
- character-original.png (body and eye texture)
- cv.pdf (your resume; matches the filename in your folder screenshot)

These personal assets are not bundled, except logo-light.png supplied in this conversation. This package updates the code; merge it into your current folder rather than deleting that folder.

## Configure contact and project links
Open projects.js. Fill contact.email and contact.linkedin. Fill each project's live and repo fields with real https URLs. Empty values are hidden automatically. No online status is assumed.

## Screenshots and demos
Create images/elitewheels/ and videos/ in your portfolio folder (or use your own paths).
For example, replace an empty screenshots array with:

screenshots: [
  { src: 'images/elitewheels/home.png', alt: 'EliteWheels homepage' },
  { src: 'images/elitewheels/fleet.png', alt: 'Fleet filters and car listings' }
],
demo: 'videos/elitewheels-demo.mp4',
poster: 'images/elitewheels/home.png',

Only add paths for files you actually have. No media is fabricated or bundled. Local MP4 videos play inside the popup. For YouTube or Vimeo, put the public video URL in demoUrl; it opens through a Watch demo link. Do not put a YouTube page URL in demo.

## Included updates
- Professional projects: Walid Books and Ana Wa Dîni.
- Personal/academic projects: EliteWheels, OnlyGym and Smox Portfolio.
- Grouped skills, with data/AI clearly marked as learning.
- Clickable IBM Data Fundamentals credential on Credly.
- Dark and lavender themes, swapped logos and matching browser color.
- Responsive menu with all sections reachable on mobile.
- Optional screenshot gallery with arrows, swipe and full-image links.
- Optional video, live website, external demo and repository links.
- Native modal Escape handling, focus return and stopped video on close.
- Cursor tracking pauses offscreen, in background tabs and during dialogs.
- Reduced-motion support and skip-to-content link.
- Section numbering corrected; duplicate credential removed from Journey.

OnlyGym descriptions are deliberately limited to known C#/WinForms work. Review skills and all project descriptions before publishing, and remove anything you cannot demonstrate. Language proficiency levels are not asserted.

## Preview
Open index.html in your browser, or use VS Code Live Server. Verify both themes, mobile navigation, your CV download and every configured URL after adding your original assets and media.

## Validation performed
JavaScript syntax checks passed for app.js and projects.js. HTML nesting, unique IDs, required targets and CSS brace balance passed. Browser rendering could not be tested because no browser executable is installed in the build environment. Your original character/logo/CV assets and actual media remain necessary for final visual verification.
