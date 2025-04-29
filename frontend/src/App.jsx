import { useState, useEffect } from 'react'
import { marked } from 'marked';
import Navbar from "./Navbar";
import AccountDropdown from "./AccountDropdown";
import GoogleLoginButton from './GoogleLoginButton';
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";

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
    fetch("http://localhost:8000/api/me/", { 
      credentials: "include",
      headers: {
        'Authorization': user && user.token ? `Token ${user.token}` : undefined
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.username) setUser(u => ({...u, ...data}));
      });
  }, [user && user.token]);

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
      const res = await fetch(`http://localhost:8000/api/random-destination/?country=${country}`, {
        headers: {
          'Authorization': user && user.token ? `Token ${user.token}` : undefined
        }
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDestination(data);
    } catch (err) {
      setError('Could not fetch destination.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for Google login success
  const handleGoogleLogin = (googleToken) => {
    fetch('http://localhost:8000/auth/social/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: googleToken,
        provider: 'google'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.key) {
          setUser({ token: data.key });
          localStorage.setItem('authToken', data.key);
          // Optionally redirect to dashboard or show success
        } else {
          alert('Google login failed.');
        }
      });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            <Navbar user={user} />
            {/* Conditional CTA below navbar */}
            {!user ? (
              <div style={{
                background: "#fff",
                padding: 28,
                borderRadius: 16,
                maxWidth: 540,
                margin: "32px auto 32px auto",
                boxShadow: "0 2px 18px #2563eb18",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 28,
                position: "relative"
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    background: "#f3f4f6",
                    borderRadius: "50%",
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 2px #fca31111",
                    marginBottom: 12,
                    fontSize: 22
                  }}>
                    <span role="img" aria-label="bookmark">📍</span>
                  </div>
                  <h2 style={{ color: "#4f46e5", marginBottom: 10, fontWeight: 700, fontSize: 20, textAlign: "center" }}>
                    Sign up to save your favorite spontaneous locations!
                  </h2>
                  <p style={{ color: "#444", marginBottom: 12, fontSize: 15, textAlign: "center" }}>
                    Create an account to bookmark and revisit your best adventures.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minWidth: 170 }}>
                  <Link
                    to="/signup"
                    style={{
                      background: "linear-gradient(90deg, #fca311 0%, #fbbf24 100%)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 16,
                      padding: "0.5rem 1.5rem",
                      borderRadius: 8,
                      textDecoration: "none",
                      boxShadow: "0 1px 3px #fca31122",
                      marginTop: 2,
                      transition: "background 0.18s, transform 0.12s",
                      marginBottom: 0
                    }}
                  >
                    Sign Up
                  </Link>
                  <span style={{ color: "#888", fontSize: 15, margin: "4px 0" }}>or</span>
                  <GoogleLoginButton onLoginSuccess={handleGoogleLogin} />
                </div>
              </div>
            ) : (
              <div style={{ background: "#e0f7fa", padding: 24, borderRadius: 10, maxWidth: 420, margin: "40px auto", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <h2 style={{ color: "#00796b", marginBottom: 12 }}>Welcome, {user.username}!</h2>
                <p style={{ color: "#444" }}>Here are your saved spontaneous locations:</p>
                {/* TODO: Render user's saved locations here */}
              </div>
            )}
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
        } />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
