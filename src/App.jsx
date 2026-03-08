import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import Tours from './Tours';

// Public API endpoint that returns an array of tour objects (id, name, info, image, price)
const url = 'https://www.course-api.com/react-tours-project';

/**
 * App – Root component. Manages tours list and loading state, fetches data on mount,
 * and renders either loading spinner, empty state with refresh, or the tours list.
 */
function App() {
  // loading: true while fetching; tours: array of tour objects from API
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);

  // Removes a tour from the list by id (lifted state: child calls this to update parent state)
  const removeTour = (id) => {
    const newTours = tours.filter((tour) => tour.id !== id);
    setTours(newTours);
  };

  // Re-fetches tours from API; used by the "refresh" button when no tours are left
  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Run once on mount: fetch tours. Cleanup sets cancelled so we don't update state after unmount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setTours(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  // Show spinner until first fetch completes
  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }
  // Empty state: user removed all tours; offer refresh to re-fetch
  if (tours.length === 0) {
    return (
      <main>
        <div className='title'>
          <h2>no tours left</h2>
          <button className='btn' onClick={() => fetchTours()}>
            refresh
          </button>
        </div>
      </main>
    );
  }
  // Normal state: render list of tour cards
  return (
    <main>
      <Tours tours={tours} removeTour={removeTour} />
    </main>
  );
}

export default App;
