const hotspots = [
  { city: "Delhi NCR", x: 45, y: 30 },
  { city: "Jaipur", x: 38, y: 39 },
  { city: "Mumbai", x: 33, y: 63 },
  { city: "Bengaluru", x: 45, y: 77 },
  { city: "Kolkata", x: 70, y: 51 },
  { city: "Guwahati", x: 82, y: 41 },
];

export default function IndiaMap() {
  return (
    <div className="relative mx-auto max-w-lg">
      <svg className="india-map h-auto w-full" viewBox="0 0 500 560" role="img" aria-label="Stylized map of India">
        <path
          d="M247 30l55 24 18 55 62 15 41 52-6 53 38 51-33 44 11 59-54 26-21 53-63 7-43 55-48-43-57 5-25-57-48-23 8-65-38-39 27-55-18-58 50-35 9-62 58-13 29-50z"
          fill="#dff5e4"
          stroke="#1f873b"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M210 154c36 30 79 57 128 81M158 248c72 22 141 24 211 7M196 372c47-25 89-27 134-4"
          fill="none"
          stroke="#7ad491"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      {hotspots.map((spot) => (
        <div
          key={spot.city}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          <span className="block h-4 w-4 rounded-full border-2 border-white bg-saffron shadow-lg" />
          <span className="absolute left-5 top-1 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-bold text-leaf-800 shadow">
            {spot.city}
          </span>
        </div>
      ))}
    </div>
  );
}

