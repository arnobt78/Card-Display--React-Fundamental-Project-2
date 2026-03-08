# Card Display - React, Vite, CSS, JavaScript Fundamental Project 2

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.1-646CFF)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2020+-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A React application that fetches and displays a list of tours from an external API. It demonstrates core React concepts—state, effects, list rendering, and lifting state—in a single-page app built with Vite and plain CSS. You can view tour cards, expand or collapse descriptions, remove tours from the list, and refresh to load the list again. Ideal for learning React fundamentals and for reuse as a card-list template in other projects.

- **Live Demo:** [https://cardview-display.vercel.app/](https://cardview-display.vercel.app/)

---

## Table of Contents

- [Features & Functionality](#features--functionality)
- [Tech Stack & Structure](#tech-stack--structure)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables (.env)](#environment-variables-env)
- [How It Works – Walkthrough](#how-it-works--walkthrough)
- [API & Backend](#api--backend)
- [Components Deep Dive](#components-deep-dive)
- [Reusing Components in Other Projects](#reusing-components-in-other-projects)
- [Scripts & Commands](#scripts--commands)
- [Keywords](#keywords)
- [Conclusion](#conclusion)
- [License](#license)
- [Happy Coding!](#happy-coding-)

---

## Features & Functionality

- **Fetch tours on load** – On mount, the app fetches tour data from a public API and shows a loading spinner until data is ready.
- **Card list view** – Each tour is shown as a card with image, title, price, and a short description.
- **Read more / Show less** – Long descriptions are truncated; a button toggles between full text and truncated view.
- **Remove tour** – Each card has a “not interested” button that removes that tour from the list (client-side only).
- **Refresh / Re-fetch** – When no tours are left, a “refresh” button appears to fetch the list again from the API.
- **Responsive layout** – CSS Grid adapts from one column on small screens to two or three columns on larger ones.
- **Loading & empty states** – Dedicated UI for loading and for “no tours left” with refresh action.

---

## Tech Stack & Structure

| Layer    | Technology                                          |
| -------- | --------------------------------------------------- |
| UI       | React 18 (functional components, hooks)             |
| Build    | Vite 4                                              |
| Language | JavaScript (ES modules)                             |
| Styling  | Plain CSS (custom properties, no framework)         |
| Data     | Public REST API (course-api.com)                    |
| Tooling  | ESLint 9 (flat config), React + React Hooks plugins |

There is no separate backend; the app is a front-end that consumes an external API. Routing is not used—everything lives on a single page.

---

## Project Structure

```bash
02-tours/
├── index.html              # Entry HTML, root div, script to main.jsx
├── package.json            # Dependencies and npm scripts
├── vite.config.js          # Vite config (React plugin)
├── eslint.config.js        # ESLint 9 flat config
├── .gitignore
├── public/
│   └── vite.svg            # Favicon / default asset
└── src/
    ├── main.jsx            # React root, mounts <App /> into #root
    ├── index.css           # Global + component-specific styles
    ├── App.jsx             # Top-level state, fetch logic, conditional views
    ├── Tours.jsx           # List container: title + grid of Tour cards
    ├── Tour.jsx            # Single tour card (image, price, info, read more, remove)
    └── Loading.jsx         # Loading spinner UI
```

- **Entry:** `index.html` → `src/main.jsx` → `App.jsx`.
- **Data flow:** `App` holds `tours` and `loading`; passes `tours` and `removeTour` to `Tours`; `Tours` maps over `tours` and renders `Tour` for each item. `Tour` manages its own “read more” state locally.

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** (or yarn/pnpm)

### Install and run

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd 02-tours
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Vite will start a local server (e.g. `http://localhost:5173`). Open that URL in your browser to see the app.

4. **Build for production**

   ```bash
   npm run build
   ```

   Output goes to the `dist/` folder. To preview the production build locally:

   ```bash
   npm run preview
   ```

---

## Environment Variables (.env)

The app does **not** require environment variables to run. The API URL is hardcoded in `src/App.jsx`:

```javascript
const url = "https://www.course-api.com/react-tours-project";
```

If you want to make the API URL configurable (e.g. for different environments or APIs), you can use Vite’s env support.

### Optional: Using a `.env` file

1. **Create a `.env` file** in the project root (same level as `package.json`). It is already listed in `.gitignore`, so it will not be committed.

2. **Define variables with the `VITE_` prefix** (required for Vite to expose them to the client):

   ```env
   VITE_API_URL=https://www.course-api.com/react-tours-project
   ```

3. **Use the variable in code.** In `src/App.jsx`:

   ```javascript
   const url =
     import.meta.env.VITE_API_URL ||
     "https://www.course-api.com/react-tours-project";
   ```

4. **Restart the dev server** after changing `.env`.

### Summary of env usage

- **Required:** None. The app works without any `.env` file.
- **Optional:** `VITE_API_URL` – base or full URL for the tours API. If you add it, use the pattern above so a fallback keeps the default API working.

---

## How It Works – Walkthrough

1. **Initial load**  
   `App` mounts with `loading: true` and `tours: []`. A `useEffect` runs once, sets `loading` to true, and calls the API. When the request completes, it updates `tours` and sets `loading` to false. A cleanup flag prevents state updates if the component unmounts before the request finishes.

2. **Loading state**  
   While `loading` is true, `App` renders only the `Loading` component (spinner).

3. **Empty state**  
   If `loading` is false and `tours.length === 0`, `App` shows “no tours left” and a “refresh” button that calls `fetchTours()` to re-fetch the list.

4. **Tours list**  
   When `tours` has items, `App` renders `<Tours tours={tours} removeTour={removeTour} />`. `Tours` renders a section title and a grid of `Tour` components, passing each tour’s fields and `removeTour`.

5. **Single tour card**  
   `Tour` receives `id`, `image`, `info`, `name`, `price`, and `removeTour`. It keeps local state `readMore`. It shows the image, price badge, name, and either the first 200 characters of `info` plus “read more” or the full `info` plus “show less.” “Not interested” calls `removeTour(id)`.

6. **Removing a tour**  
   `removeTour(id)` in `App` filters out the tour with that `id` and calls `setTours` with the new array. React re-renders; that card disappears.

7. **Refresh**  
   When the list is empty, the user clicks “refresh,” which runs `fetchTours()` again (same API URL), and the list is repopulated.

---

## API & Backend

- **Backend:** None. This is a front-end-only project.
- **Data source:** Public REST API.

### Endpoint

| Method | URL                                              | Description                          |
| ------ | ------------------------------------------------ | ------------------------------------ |
| GET    | `https://www.course-api.com/react-tours-project` | Returns a JSON array of tour objects |

No authentication or API key is required.

### Response shape (per tour)

Each element in the array is an object like:

```json
{
  "id": "rec6d6TNDqE4ge4OH",
  "name": "Best of Paris in 7 Days Tour",
  "info": "Paris is synonymous with the finest things...",
  "image": "https://example.com/image.jpg",
  "price": "1,995"
}
```

- **id** – Unique string (used as React `key` and for removal).
- **name** – Tour title.
- **info** – Long description (supports “read more” truncation).
- **image** – Image URL.
- **price** – String (e.g. `"1,995"`); displayed as-is with a `$` prefix in the UI.

---

## Components Deep Dive

### `App.jsx`

- **Role:** Root component. Owns `tours` and `loading`; performs initial fetch and refresh; decides whether to show loading, empty state, or the tours list.
- **State:** `loading` (boolean), `tours` (array of tour objects).
- **Key logic:** `removeTour(id)`, `fetchTours()`, and a `useEffect` for the initial fetch with cancellation.

**Snippet – state and remove:**

```jsx
const [loading, setLoading] = useState(true);
const [tours, setTours] = useState([]);

const removeTour = (id) => {
  const newTours = tours.filter((tour) => tour.id !== id);
  setTours(newTours);
};
```

---

### `Tours.jsx`

- **Role:** Presentational list. Renders a heading and a grid of `Tour` cards.
- **Props:** `tours` (array), `removeTour` (function).
- **Reusable:** Use it anywhere you have an array of items with `id`, `image`, `info`, `name`, `price` and a remove handler.

**Snippet – mapping over tours:**

```jsx
const Tours = ({ tours, removeTour }) => {
  return (
    <section>
      <div className="title">
        <h2>our tours</h2>
        <div className="title-underline"></div>
      </div>
      <div className="tours">
        {tours.map((tour) => (
          <Tour key={tour.id} {...tour} removeTour={removeTour} />
        ))}
      </div>
    </section>
  );
};
```

---

### `Tour.jsx`

- **Role:** Single tour card. Displays image, price, name, expandable description, and a remove button.
- **Props:** `id`, `image`, `info`, `name`, `price`, `removeTour`.
- **Local state:** `readMore` (boolean) for toggling full vs truncated description.

**Snippet – truncation and read more:**

```jsx
const [readMore, setReadMore] = useState(false);
// ...
<p>
  {readMore ? info : `${info.substring(0, 200)}...`}
  <button className="info-btn" onClick={() => setReadMore(!readMore)}>
    {readMore ? "show less" : "  read more"}
  </button>
</p>;
```

---

### `Loading.jsx`

- **Role:** Loading indicator (spinner). No props.
- **Reusable:** Drop-in for any loading state; styling is in `index.css` under `.loading`.

**Snippet:**

```jsx
const Loading = () => {
  return <div className="loading"></div>;
};
```

---

## Reusing Components in Other Projects

1. **Copy components**  
   Copy `Tours.jsx`, `Tour.jsx`, and `Loading.jsx` into your project. Adjust imports (e.g. `import Tour from './Tour'`) to match your folder structure.

2. **Data shape**  
   Ensure each item has at least: `id`, `name`, `info`, `image`, `price`. If your API uses different keys, map them before passing to `Tours` or change prop names in `Tour`.

3. **Styling**  
   Copy the relevant parts of `index.css`: `:root` variables, `.tours`, `.single-tour`, `.tour-price`, `.tour-info`, `.info-btn`, `.delete-btn`, `.loading`, and any layout/button styles you use. You can scope them under a class (e.g. `.tours-app`) to avoid clashes.

4. **Remove behavior**  
   In your parent (e.g. `App`), keep an array in state and pass a `removeTour(id)` that filters by `id` and updates state. Same pattern as in this project.

5. **Different data source**  
   Replace the fetch URL (or use `VITE_API_URL`) and keep the same response shape, or add a small adapter that maps your API response to `{ id, name, info, image, price }`.

---

## Scripts & Commands

| Command           | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start Vite dev server (e.g. <http://localhost:5173>) |
| `npm run build`   | Production build → `dist/`                           |
| `npm run preview` | Serve the production build locally                   |
| `npm run lint`    | Run ESLint on the project (no warnings allowed)      |

---

## Keywords

React, Vite, JavaScript, tours, card display, list UI, fetch API, useState, useEffect, component composition, lifting state, read more, loading state, empty state, responsive CSS, CSS variables, ESLint, front-end, educational project, open source.

---

## Conclusion

This project is a small, focused example of a React SPA: fetching data, managing loading and list state, and composing presentational components (`Tours`, `Tour`, `Loading`). It uses no router or global state library, so it’s easy to read and adapt. You can extend it by adding filters, sorting, a real backend, or by reusing its components in other apps as described above.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute the code as per the terms of the license.

---

## Happy Coding! 🎉

This is an **open-source project** - feel free to use, enhance, and extend this project further!

If you have any questions or want to share your work, reach out via GitHub or my portfolio at [https://www.arnobmahmud.com](https://www.arnobmahmud.com).

**Enjoy building and learning!** 🚀

Thank you! 😊
