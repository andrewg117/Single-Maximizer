# Single Maximizer

Single Maximizer is a demo web app for independent artists promoting a new single. An artist creates a release with the track details, cover art, audio file and press photos, then picks a delivery date. On that date, the server emails the artist's press package (track details, bio, links and attached files) under the "TRACKSTARZ" name.

Each release uses one track credit. Credits are bought on the checkout page. **In this demo, checkout is simulated:** it adds a credit without charging a card.

**Demo limits:** each account can have at most 3 singles at a time (singles plus unused credits), and each single at most 5 press photos. The API is also rate-limited per IP address: 300 requests per 15 minutes overall, 10 failed sign-ins per 15 minutes, and 5 sign-up or password-reset emails per hour.

This folder holds the React frontend. The Express API it talks to is in [`../backend`](../backend), and both are run from the repository root.

## Tech stack

- **Frontend:** React 18 (Create React App), Redux Toolkit, React Router 6, react-dropzone, react-h5-audio-player, react-toastify
- **Backend:** Node.js, Express, MongoDB with Mongoose, JWT auth in an httpOnly cookie, multer for uploads, Mailgun for email, node-schedule for the daily delivery job

## How the app works

1. **Sign up.** Enter an email on the sign-up page. You get a link valid for 30 minutes. Open it to finish creating the account.
2. **Get a credit.** Go through the (simulated) checkout to add a track credit.
3. **Create a release.** On **New Release**, fill in the track details and add:
   - cover art: JPEG or PNG, up to 10 MB;
   - audio: MP3, up to 15 MB;
   - press photos: up to 5, JPEG or PNG, under 15 MB each and 20 MB in total.

   The release is saved only if every upload succeeds. Otherwise it's removed and the credit is returned.
4. **Delivery.** Every day at 12:00 server time, the server emails the press package for each release whose delivery date has arrived, then marks it delivered.
5. **Edit or delete.** Releases can be edited or deleted from **Singles**. Deleting an undelivered release refunds its credit.

Sessions expire after 10 minutes without activity.

## Frontend structure

```
src/
  MaximizerApp.js   All routes: public pages under /home/*, signed-in pages under /profile/*
  app/store.js      Redux store
  features/<name>/  One folder per API resource: <name>Service.js (axios calls) and <name>Slice.js (Redux state)
  pages/            One component per route
  components/       Shared UI: nav bars, upload dropzones, TokenCheck (guards /profile/* routes)
  css/              CSS Modules, imported as `styles`
```

Uploaded files are stored in MongoDB rather than a file service, and the frontend displays them directly from the API response.
