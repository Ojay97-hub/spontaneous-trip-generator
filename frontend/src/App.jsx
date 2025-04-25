import { useState, useEffect } from 'react'
import './index.css'

const COUNTRIES = [
  { code: 'CA', name: 'Canada' },
];

// Use environment variable for Unsplash API key (Vite style)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_REACT_APP_UNSPLASH_ACCESS_KEY;

const fetchImageUrl = async (location) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results[0]?.urls?.regular || null;
  } catch (error) {
    console.error("Failed to fetch image from Unsplash:", error);
    return null;
  }
};

function LocationCard({ location, description }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchImageUrl(location).then(setImageUrl);
  }, [location]);

  return (
    <div className="location-card-horizontal">
      <div className="location-img-horizontal">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={location}
            className="location-img-side"
          />
        ) : (
          <div className="location-img-side location-img-loading">Loading image...</div>
        )}
      </div>
      <div className="location-info-horizontal">
        <h2 className="location-title-horizontal">{location}</h2>
        <p className="location-desc-horizontal">{description}</p>
      </div>
    </div>
  );
}

function App() {
  const [country, setCountry] = useState('CA');
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    setDestination(null);
    setMapLoaded(false);
    try {
      const res = await fetch('http://localhost:8000/api/random-destination/');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDestination(data);
    } catch (err) {
      setError('Could not fetch destination.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Website Title */}
      <header className="site-title-header">
        <span className="site-title-icon" role="img" aria-label="airplane">✈️</span>
        <h1 className="site-title">Spontaneous Trip Generator</h1>
      </header>
      {/* Hero Card for Country */}
      <section className="hero-card hero-card--with-image">
        <img
          className="hero-bg-img"
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Canada landscape"
        />
        <div className="hero-content">
          <h2 className="hero-country">{COUNTRIES.find(c => c.code === country)?.name || country}</h2>
          <p className="hero-subtitle">Find your next {COUNTRIES.find(c => c.code === country)?.name || country} adventure in one click.</p>
          <button className="generate-btn" onClick={fetchDestination} disabled={loading}>
            {loading ? 'Loading...' : 'Surprise Me!'}
          </button>
        </div>
      </section>
      {/* Spontaneous Locations */}
      <main className="locations-list">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {destination && (
          <div className="location-card-with-map">
            <LocationCard location={destination.city} description={destination.description} />
            <div className="location-map">
              {!mapLoaded && (
                <div className="map-skeleton">
                  <div className="spinner" />
                </div>
              )}
              <iframe
                title={destination.city + ' map'}
                src={`https://www.google.com/maps?q=${encodeURIComponent(destination.city + ', ' + (COUNTRIES.find(c => c.code === country)?.name || country))}&output=embed`}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoaded(true)}
              />
            </div>
          </div>
        )}
      </main>
      <footer>&copy; {new Date().getFullYear()} Spontaneous Trip Generator</footer>
    </div>
  );
}

export default App
