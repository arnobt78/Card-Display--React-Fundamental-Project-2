import React from 'react';
import Tour from './Tour';

/**
 * Tours – Presentational list component. Renders a section title and a grid of Tour cards.
 * Props: tours (array), removeTour (function). key={tour.id} is required for list reconciliation.
 */
const Tours = ({ tours, removeTour }) => {
  return (
    <section>
      <div className='title'>
        <h2>our tours</h2>
        <div className='title-underline'></div>
      </div>
      <div className='tours'>
        {tours.map((tour) => {
          return <Tour key={tour.id} {...tour} removeTour={removeTour} />;
        })}
      </div>
    </section>
  );
};

export default Tours;
