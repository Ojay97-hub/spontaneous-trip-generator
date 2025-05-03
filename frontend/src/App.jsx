import { useState, useEffect } from 'react'
import { marked } from 'marked';
import Navbar from "./components/Navbar";
import AccountDropdown from "./components/AccountDropdown";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import Profile from './components/Profile';
import Login from './components/Login';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Use environment variable for Unsplash API key (Vite style)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_REACT_APP_UNSPLASH_ACCESS_KEY;
const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME;

// Define a COUNTRIES array
const COUNTRIES = [
  { code: 'CA', name: 'Canada' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  // Add more countries as needed
];

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
  const location = useLocation();
  const navigate = useNavigate();
  // Use localStorage to persist pendingVerification between reloads
  const [country, setCountry] = useState('CA');
  const [destination, setDestination] = useState(null);
  const [heroImgUrl, setHeroImgUrl] = useState('');
  const [heroImgLoading, setHeroImgLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => auth.currentUser);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          token,
        });
        localStorage.setItem('authToken', token);
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user info on mount or after verification
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      return;
    }
    fetch("http://127.0.0.1:8000/api/me/", {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.username) setUser({ ...data, token });
        else setUser(null);
      });
  }, [location.state]);

  // Logout handler
  function handleLogout() {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate('/');
      })
      .catch(() => {
        setUser(null);
      });
  }

  // Hide navbar on auth pages
  const hideNavbar = ['/signup', '/login', '/verify-email'].includes(location.pathname);

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
      const token = localStorage.getItem('authToken');
      const res = await fetch(`http://127.0.0.1:8000/api/random-destination/?country=${country}`, {
        headers: { 'Authorization': token ? `Token ${token}` : undefined }
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

  // Pass setPendingVerification to Signup
  function handleSignupSuccess() {
    navigate('/', { state: { notification: 'Signup successful!' } });
  }

  return (
    <div>
      {/* Only show Navbar if not on auth pages */}
      {!hideNavbar && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleSignupSuccess} />} />
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={token => {
                localStorage.setItem('authToken', token);
                fetch("http://127.0.0.1:8000/api/me/", { headers: { 'Authorization': `Token ${token}` } })
                  .then(res => res.ok ? res.json() : null)
                  .then(data => {
                    if (data && data.username) setUser({ ...data, token });
                    else setUser({ token });
                    navigate('/', { state: { notification: 'Login successful!' } });
                  });
              }}
            />
          }
        />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route
          path="/"
          element={
            <div>
              {/* Conditional CTA below navbar */}
              {!user ? (
                <div className="cta-container">
                  <div className="cta-info">
                    <div className="cta-icon">
                      <span role="img" aria-label="bookmark">📍</span>
                    </div>
                    <h2 className="cta-title">
                      Sign up to save your favorite spontaneous locations!
                    </h2>
                    <p className="cta-desc">
                      Create an account to bookmark and revisit your best adventures.
                    </p>
                  </div>
                  <div className="cta-actions">
                    <Link
                      to="/signup"
                      className="cta-signup"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="cta-welcome">
                  <h2 className="cta-welcome-title">Welcome, {user.username}!</h2>
                  <p className="cta-welcome-desc">We're glad to have you back. Ready to discover your next spontaneous adventure?</p>
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
                {heroImgUrl ? (
                  <img
                    className="hero-bg-img"
                    src={heroImgUrl}
                    alt={COUNTRIES.find(c => c.code === country)?.name + ' landscape'}
                  />
                ) : (
                  <div className="hero-bg-img hero-bg-img-loading">Loading image...</div>
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
          }
        />
      </Routes>
    </div>
  );
}

export default App;
