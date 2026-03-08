import React, { useState } from 'react';

/**
 * Tour – Single tour card. Shows image, price badge, name, expandable description (read more/show less),
 * and a "not interested" button that calls removeTour(id). readMore is local state per card.
 */
const Tour = ({ id, image, info, name, price, removeTour }) => {
  const [readMore, setReadMore] = useState(false);
  return (
    <article className='single-tour'>
      <img src={image} alt={name} className='img' />
      <span className='tour-price'>${price}</span>
      <div className='tour-info'>
        <h5>{name}</h5>

        <p>
          {/* Truncate to 200 chars when readMore is false; full info when true */}
          {readMore ? info : `${info.substring(0, 200)}...`}
          <button className='info-btn' onClick={() => setReadMore(!readMore)}>
            {readMore ? 'show less' : '  read more'}
          </button>
        </p>
        <button
          className='delete-btn btn-block btn'
          onClick={() => removeTour(id)}
        >
          not interested
        </button>
      </div>
    </article>
  );
};

export default Tour;
