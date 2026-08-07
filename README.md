# Masjid Al-Furqan Live Prayer Timetable

A free, single-page prayer timetable for Malir Cantt, Karachi.

## What it does
- Shows the current Karachi time.
- Downloads today's Adhan times automatically.
- Uses the Hanafi Asr setting and the University of Islamic Sciences, Karachi calculation method.
- Shows the mosque's Jamaat times.
- Counts down live to the next Jamaat.
- Works on mobile and can be linked from a WhatsApp group description.

## Important: verify the settings
Open `index.html` in a text editor and find `const SETTINGS`.

The coordinates currently used are an approximate point in Malir Cantt:
- Latitude: 24.9436
- Longitude: 67.2057

Replace these with the exact mosque coordinates from Google Maps.

The initial Jamaat times were taken from the supplied WhatsApp screenshot:
- Fajr 05:30
- Dhuhr 13:30
- Asr 17:45
- Maghrib uses the calculated Maghrib time
- Isha 21:00
- Jummah 13:45

Change any time in `jamaatTimes` using 24-hour format. Example:
`Fajr: "05:15"`

## Free GitHub Pages publishing
1. Create a free GitHub account.
2. Create a new public repository, for example `masjid-furqan`.
3. Upload `index.html`.
4. Open repository Settings → Pages.
5. Under “Build and deployment,” select “Deploy from a branch.”
6. Select the `main` branch and `/ (root)`, then save.
7. GitHub will provide a free address similar to:
   `https://USERNAME.github.io/masjid-furqan/`

No purchased domain is required.

## Local preview
Double-click `index.html`. The prayer API may work locally in most modern browsers. The final hosted version is recommended.

## Note
Calculated Adhan times and a mosque's announced Jamaat times are different. The mosque administration should verify all displayed times before sharing the link.
