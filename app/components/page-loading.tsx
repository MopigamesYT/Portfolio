import type { Translations } from "../i18n/translations";

export default function PageLoading({ t }: { t: Translations }) {
  return (
    <>
      <style>{`
        @keyframes _spin  { to { transform: rotate(360deg); } }
        @keyframes _pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.9); }
          50%       { opacity: 0.55; transform: scale(1.1); }
        }
        @keyframes _track {
          0%   { opacity: 0.08; }
          50%  { opacity: 0.18; }
          100% { opacity: 0.08; }
        }
        .pl-ring  { animation: _spin  1.3s linear infinite; }
        .pl-dot   { animation: _pulse 2s   ease-in-out infinite; }
        .pl-track { animation: _track 2s   ease-in-out infinite; }
      `}</style>
      <div
        style={{
          position:       "fixed",
          inset:          0,
          zIndex:         9999,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "28px",
          backgroundColor: "#1e1e2e",
        }}
      >
        {/* Spinner */}
        <div style={{ position: "relative", width: "56px", height: "56px" }}>
          {/* Track ring */}
          <div
            className="pl-track"
            style={{
              position:     "absolute",
              inset:        0,
              borderRadius: "50%",
              border:       "2px solid #cba6f7",
            }}
          />
          {/* Spinning arc */}
          <div
            className="pl-ring"
            style={{
              position:        "absolute",
              inset:           0,
              borderRadius:    "50%",
              border:          "2px solid transparent",
              borderTopColor:  "#cba6f7",
              borderRightColor:"#cba6f7",
            }}
          />
          {/* Center dot */}
          <div
            className="pl-dot"
            style={{
              position:        "absolute",
              inset:           "16px",
              borderRadius:    "50%",
              backgroundColor: "#cba6f7",
            }}
          />
        </div>

        {/* Label */}
        <p
          style={{
            fontSize:      "10px",
            fontWeight:    600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "#585b70",
          }}
        >
          {t.loader.loading}
        </p>
      </div>
    </>
  );
}
