# UK Residency Tracker

A simple web app to track days spent outside the UK for residency purposes.

⚠️ **DISCLAIMER**: This app was created as a personal project and "vibe-coded" (built quickly without rigorous testing). It should NOT be trusted blindly for immigration or legal purposes. Always double-check your calculations with official guidance and consider consulting an immigration professional for important decisions.

## Features

- Record trips outside the UK with departure and return dates
- Automatically calculates non-travel days (excluding departure and return days)
- Tracks your total days outside the UK within the last 12-month period
- Shows remaining days from your 180-day allowance
- Stores all data locally in your browser (no data is sent to any server)

## Usage

1. Simply open `index.html` in any modern web browser
2. Add your trips using the form (trip name is optional)
3. The app will automatically calculate and display your status

## Note on Calculations

- Travel days (the day you leave the UK and the day you return) don't count toward your 180-day limit
- For example, if you travel from April 4th through April 7th, only 2 days will count
- The app recalculates the rolling 12-month window every time you view it

## License

MIT License

## Contributing

Feel free to open issues or PRs if you'd like to improve this tool. As this was a quick personal project, there are likely improvements that could be made.