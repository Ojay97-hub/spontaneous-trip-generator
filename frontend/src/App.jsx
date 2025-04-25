import { useState, useEffect } from 'react'

const COUNTRIES = [
  { code: 'CA', name: 'Canada' },
];

// Use environment variable for Unsplash API key (Vite style)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_REACT_APP_UNSPLASH_ACCESS_KEY;
const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME;

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

// Add fetch functions for GeoNames and Wikipedia
async function fetchGeoNamesDescription(location, country) {
  // Use GeoNames API with env username
  const url = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(location)}&country=${country}&maxRows=1&username=${GEONAMES_USERNAME}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.geonames?.[0]?.summary || data.geonames?.[0]?.fcodeName || '';
  } catch {
    return '';
  }
}

async function fetchWikipediaSummary(location) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(location)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.extract || '';
  } catch {
    return '';
  }
}

function LocationImagePill({ location }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchImageUrl(location).then(setImageUrl);
  }, [location]);

  return (
    <div className="location-image-pill-outer">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={location}
          className="location-img-pill"
        />
      ) : (
        <div className="location-img-pill location-img-loading">Loading image...</div>
      )}
    </div>
  );
}

function LocationDescriptionPill({ location, country }) {
  const [geoDesc, setGeoDesc] = useState('');
  const [wikiSummary, setWikiSummary] = useState('');
  const [wikiUrl, setWikiUrl] = useState('');

  useEffect(() => {
    fetchWikipediaSummary(location).then(summary => {
      if (summary) {
        setWikiSummary(summary);
        setWikiUrl(`https://en.wikipedia.org/wiki/${encodeURIComponent(location)}`);
      } else {
        fetchGeoNamesDescription(location, country).then(desc => {
          setWikiSummary(desc || 'No description available for this location.');
          setWikiUrl('');
        });
      }
    });
  }, [location, country]);

  // Helper: truncate to 50 words
  function truncateWords(text, maxWords = 50) {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  return (
    <div className="location-desc-pill-inner">
      <h2 className="location-title-pill">{location}</h2>
      <div className="geo-desc">{truncateWords(wikiSummary)}</div>
      {wikiUrl ? (
        <a className="see-more-btn" href={wikiUrl} target="_blank" rel="noopener noreferrer">
          See more info
        </a>
      ) : null}
    </div>
  );
}

function LocationMapPill({ location, country, setMapLoaded }) {
  return (
    <iframe
      title={location + ' map'}
      src={`https://www.google.com/maps?q=${encodeURIComponent(location + ', ' + country)}&output=embed`}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      onLoad={() => setMapLoaded(true)}
      className="map-iframe-landscape"
      style={{ width: '100%', height: '100%', display: 'block', border: 0, borderRadius: '18px' }}
    />
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
      <main className="locations-list pills-layout">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {destination && (
          <div className="locations-row">
            <div className="location-card-modern">
              <div className="location-card-modern-image-desc">
                <LocationImagePill location={destination.city} />
                <LocationDescriptionPill location={destination.city} country={country} />
              </div>
            </div>
            <div className="location-card-modern location-card-modern-map">
              <LocationMapPill location={destination.city} country={COUNTRIES.find(c => c.code === country)?.name || country} setMapLoaded={setMapLoaded} />
            </div>
          </div>
        )}
      </main>
      <footer>&copy; {new Date().getFullYear()} Spontaneous Trip Generator</footer>
    </div>
  );
}

export default App
