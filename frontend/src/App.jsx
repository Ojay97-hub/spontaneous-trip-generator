import { useState, useEffect } from 'react'
import { marked } from 'marked';

const COUNTRIES = [
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'ES', name: 'Spain' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'BR', name: 'Brazil' },
  // Add more as desired
];

// Use environment variable for Unsplash API key (Vite style)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_REACT_APP_UNSPLASH_ACCESS_KEY;
const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME;

// Helper to ensure all links open externally
function externalizeLinks(html) {
  return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
}

// Helper to split description and links
function splitDescriptionAndLinks(md) {
  if (!md) return { desc: '', links: '' };
  // Try to split at the first markdown link or new line after the main description
  const linkMatch = md.match(/\[.+?\]\(.+?\)/s);
  if (linkMatch) {
    const idx = md.indexOf(linkMatch[0]);
    return {
      desc: md.slice(0, idx).trim(),
      links: md.slice(idx).trim(),
    };
  }
  return { desc: md, links: '' };
}

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

function LocationDescriptionPill({ location, description }) {
  const [expanded, setExpanded] = useState(false);

  // Split description and links
  const { desc, links } = splitDescriptionAndLinks(description);

  function truncateWords(text, maxWords = 50) {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  const isTruncated = desc && desc.split(/\s+/).length > 50;

  return (
    <div className="location-desc-pill-inner">
      <h2 className="location-title-pill">{location}</h2>
      <div className="geo-desc">
        {expanded ? desc : truncateWords(desc)}
        {links && (
          <div
            style={{ marginTop: 8 }}
            dangerouslySetInnerHTML={{ __html: externalizeLinks(marked.parse(links)) }}
          />
        )}
      </div>
      <div className="ai-badge-pill">
        <span role="img" aria-label="AI">🤖</span> Powered by Claude AI
      </div>
      {isTruncated && (
        <button
          className="see-more-btn see-more-btn-ai"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'See less' : 'See more'}
        </button>
      )}
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
      const res = await fetch(`http://localhost:8000/api/random-destination/?country=${country}`);
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
      {/* Controls for Country Selection */}
      <section className="controls">
        <label htmlFor="country-select">Choose a country:</label>
        <select
          id="country-select"
          value={country}
          onChange={e => setCountry(e.target.value)}
          disabled={loading}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
        <button className="generate-btn" onClick={fetchDestination} disabled={loading}>
          {loading ? 'Loading...' : 'Surprise Me!'}
        </button>
      </section>
      {/* Hero Card for Country */}
      <section className="hero-card hero-card--with-image">
        <img
          className="hero-bg-img"
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt={COUNTRIES.find(c => c.code === country)?.name + ' landscape'}
        />
        <div className="hero-content">
          <h2 className="hero-country">{COUNTRIES.find(c => c.code === country)?.name || country}</h2>
          <p className="hero-subtitle">Find your next {COUNTRIES.find(c => c.code === country)?.name || country} adventure in one click.</p>
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
                <LocationDescriptionPill location={destination.city} description={destination.description} />
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
