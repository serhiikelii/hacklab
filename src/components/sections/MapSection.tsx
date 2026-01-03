"use client"

export function MapSection() {
  const address = "Budějovická 1667/64, 140 00 Praha 4"
  const googleMapsUrl = `https://www.google.com/maps?q=Budějovická+1667/64,+140+00+Praha+4&output=embed`
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=Budějovická+1667/64,+140+00+Praha+4`

  return (
    <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden">
      {/* Google Maps iframe */}
      <iframe
        src={googleMapsUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "400px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="MojService Location Map"
        className="absolute inset-0"
      />

      {/* Overlay button for navigation */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={navigationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg shadow-lg font-semibold transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  )
}
