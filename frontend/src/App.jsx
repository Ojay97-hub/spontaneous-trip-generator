import { useState, useEffect } from 'react'
import { marked } from 'marked';
import AccountDropdown from "./AccountDropdown";

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

// Helper to get flag URL by country code
function getFlagUrl(code) {
  // Use lowercase for flagcdn
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
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
  const [heroImgUrl, setHeroImgUrl] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80');
  const [heroImgLoading, setHeroImgLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/me/", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data && data.username ? data : null));
  }, []);

  // Fetch hero image when country changes
  useEffect(() => {
    const countryObj = COUNTRIES.find(c => c.code === country);
    if (!countryObj) return;
    setHeroImgLoading(true);
    fetchImageUrl(countryObj.name)
      .then(url => {
        setHeroImgUrl(url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80');
      })
      .finally(() => setHeroImgLoading(false));
  }, [country]);

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
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <AccountDropdown user={user} />
      </div>
      {!user ? (
        <div style={{
          background: "linear-gradient(135deg, #f3f4f6 60%, #fca31122 100%)",
          padding: 32,
          borderRadius: 18,
          maxWidth: 460,
          margin: "40px auto",
          boxShadow: "0 8px 32px #2563eb22",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          position: "relative"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "50%",
            width: 62,
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px #fca31122",
            marginBottom: 18,
            fontSize: 32
          }}>
            <span role="img" aria-label="bookmark">📍</span>
          </div>
          <h2 style={{ color: "#4f46e5", marginBottom: 10, fontWeight: 800, fontSize: 24, textAlign: "center" }}>
            Sign up to save your favorite spontaneous locations!
          </h2>
          <p style={{ color: "#444", marginBottom: 18, textAlign: "center", fontSize: 17 }}>
            Create an account to bookmark and revisit your best adventures.
          </p>
          <a href="http://localhost:8000/accounts/signup/" style={{
            background: "linear-gradient(90deg, #fca311 0%, #fbbf24 100%)",
            color: "#14213d",
            fontWeight: 700,
            fontSize: 18,
            padding: "0.8rem 2.4rem",
            borderRadius: 12,
            textDecoration: "none",
            boxShadow: "0 2px 12px #fca31133",
            marginTop: 10,
            transition: "background 0.18s, transform 0.12s"
          }}
          onMouseOver={e => e.currentTarget.style.background = "linear-gradient(90deg, #fbbf24 0%, #fca311 100%)"}
          onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #fca311 0%, #fbbf24 100%)"}
          >
            Sign Up
          </a>
        </div>
      ) : (
        <div style={{ background: "#e0f7fa", padding: 24, borderRadius: 10, maxWidth: 420, margin: "40px auto", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <h2 style={{ color: "#00796b", marginBottom: 12 }}>Welcome, {user.username}!</h2>
          <p style={{ color: "#444" }}>Here are your saved spontaneous locations:</p>
          {/* TODO: Render user's saved locations here */}
        </div>
      )}
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
        {heroImgLoading ? (
          <div className="hero-bg-img hero-bg-img-loading">Loading image...</div>
        ) : (
          <img
            className="hero-bg-img"
            src={heroImgUrl}
            alt={COUNTRIES.find(c => c.code === country)?.name + ' landscape'}
          />
        )}
        {/* Country Flag */}
        <img
          className="hero-flag-img"
          src={getFlagUrl(country)}
          alt={COUNTRIES.find(c => c.code === country)?.name + ' flag'}
          style={{
            position: 'absolute',
            top: 32,
            left: 32,
            width: 48,
            height: 32,
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            background: '#fff',
            objectFit: 'cover',
            border: '1.5px solid #fff',
            zIndex: 2
          }}
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
