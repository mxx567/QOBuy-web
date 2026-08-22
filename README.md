<div align="center">
  <img src="https://i.ibb.co.com/rRnK6DRs/Untitled22.png"  alt=""/>
</div>
<h1 align="center">
  QOBuy-web
</h1>
<p>
  Web-version of QOBuy that is built on Vite using modern libraries like Zustand. You can access the web-version by clicking on the link the is provided in the description of the repo. (Not fully finished)
</p>
<h2 align="center">
  Screenshots
</h2>
<div align="center">
  <img width="300px" src="https://i.ibb.co.com/MDccc63q/Untitled22.png"  alt=""/>
  <img width="300px" src="https://i.ibb.co.com/hRGzq0cT/Untitled322.png"  alt=""/>
</div>
<h2 align="center">
  Installation of the project to your IDE
</h2>
<ul>
  <li>Make sure that you have Node.js on your machine</li>
  <li>Locate to the folder that you want to install the project files</li>
  <li>Enter these commands to the terminal</li>
  <li>Make sure that you defined your API keys for <a href="https://supabase.com/">Supabase</a> in the .env.local file</li>
</ul>
<pre><code>
  git clone https://github.com/mxx567/QOBuy-web
  cd QOBuy
  npm install
  npm run dev //if you want to start a localhost
</code></pre>

## Web Project Structure

```text
QOBuy-web/
├── index.html                  # Vite HTML entry document.
├── package.json                # Dependencies and npm scripts.
├── tsconfig.json               # Shared TypeScript configuration.
├── tsconfig.app.json           # TypeScript settings for browser code.
├── tsconfig.node.json          # TypeScript settings for Vite config.
├── vite.config.ts              # Vite and React plugin configuration.
├── src/
│   ├── main.tsx                # Mounts React and BrowserRouter.
│   ├── App.tsx                 # Defines routes and syncs authentication.
│   ├── styles.css              # Defines global styles and responsive layouts.
│   ├── supabase.ts             # Creates the Supabase browser client.
│   ├── vite-env.d.ts           # Types Vite environment variables.
│   │
│   ├── assets/                 # Contains fonts, icons, logo, and hero images.
│   │   ├── fonts/              # Contains bundled Helvetica Neue font files.
│   │   ├── hero/               # Contains homepage hero product artwork.
│   │   ├── icons/              # Contains interface icon images.
│   │   ├── Logo.png            # Contains the QOBuy logo.
│   │   ├── Error.png           # Contains the inline error icon.
│   │   └── back.png            # Contains the back-navigation icon.
│   │
│   ├── components/             # Contains reusable web UI components.
│   │   ├── CommonButton.tsx    # Renders the shared primary button.
│   │   ├── CommonErrorText.tsx # Renders styled inline error text.
│   │   ├── CommonHeader.tsx    # Renders a back button and page heading.
│   │   ├── InputLine.tsx       # Renders the shared text input field.
│   │   ├── ListingCard.tsx     # Renders a marketplace listing preview.
│   │   ├── LoadingSpinner.tsx  # Renders the loading indicator.
│   │   ├── SearchBar.tsx       # Renders the homepage search control.
│   │   └── TabBar.tsx          # Renders primary navigation and sign-out.
│   │
│   ├── routes/                 # Contains route-level page components.
│   │   ├── HomeScreen.tsx      # Displays listings and search filters.
│   │   ├── FavoritesScreen.tsx # Displays saved listings.
│   │   ├── LoginScreen.tsx     # Authenticates users with Supabase.
│   │   ├── SignUpScreen.tsx    # Creates user accounts and profiles.
│   │   └── ProtectedRoute.tsx  # Redirects unauthenticated visitors to login.
│   │
│   ├── store/                  # Contains Zustand client-side state stores.
│   │   ├── authStore.ts        # Maintains the user session and profile.
│   │   └── favouritesStore.ts  # Maintains and updates favorite listing IDs.
│   │
│   ├── types/                  # Contains shared TypeScript data models.
│   │   └── listing.ts          # Defines listing, category, and region types.
│   │
│   └── utils/                  # Contains focused formatting and data helpers.
│       ├── date2string.ts      # Formats timestamps for display.
│       ├── getFrendlyAuthError.ts # Converts auth errors into user messages.
│       └── listingImage.ts     # Resolves a listing image or fallback image.


