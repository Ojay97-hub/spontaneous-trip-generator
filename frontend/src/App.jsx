import { useState } from 'react'
import './App.css'

const COUNTRIES = [
  { code: 'CA', name: 'Canada' },
  // Future: add more countries
];

function App() {
  const [country, setCountry] = useState('CA');
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDestination = async () => {
    setLoading(true);
    setError(null);
    setDestination(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-900 drop-shadow">Spontaneous Trip Generator</h1>
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
        <label className="font-medium text-blue-800">Country:</label>
        <select
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={country}
          onChange={e => setCountry(e.target.value)}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
          onClick={fetchDestination}
          disabled={loading}
        >
          {loading ? 'Surprising...' : 'Surprise Me!'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {destination && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center animate-fade-in">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">{destination.city}</h2>
          <p className="text-gray-700">{destination.description}</p>
        </div>
      )}
    </div>
  );
}

export default App
