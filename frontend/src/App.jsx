import { useState } from 'react'
import './index.css'

const COUNTRIES = [
  { code: 'CA', name: 'Canada' },
];

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
            <div className="location-card">
              <img
                className="location-img"
                src={destination.image_url || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"}
                alt={destination.city + ' landscape'}
              />
              <h3 className="location-title"><span role="img" aria-label="city">🏙️</span> {destination.city}</h3>
              <p className="location-desc">{destination.description}</p>
            </div>
            <div className="location-map">
              {!mapLoaded && (
                <div className="map-skeleton">
                  <div className="spinner" />
                </div>
              )}
              <iframe
                title={`Map of ${destination.city}`}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ opacity: mapLoaded ? 1 : 0, transition: 'opacity 0.6s', borderRadius: '1rem' }}
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
