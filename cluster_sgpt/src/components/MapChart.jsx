import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { generateMapData } from "../data/mockData";

const geoUrl = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

const MapChart = ({ data, onCountryClick, activeCountry }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const getCountryStyle = (geo) => {
    const iso = geo.properties.ISO_A3;
    const country = data && data.find((d) => d.countryCode === iso);
    const isActive = activeCountry === iso;

    if (!country) return {
      default: { fill: "#1a1f2e", outline: "none", stroke: "#2a2f3e", strokeWidth: 0.5 },
      hover: { fill: "#2a2f3e", outline: "none" },
      pressed: { fill: "#2a2f3e", outline: "none" },
    };

    const color = country.dominant === 'hiring' ? 'var(--color-hiring)' : 'var(--color-layoff)';
    const opacity = isActive ? 1 : (0.3 + (country.intensity * 0.7));

    return {
      default: {
        fill: color,
        fillOpacity: opacity,
        outline: "none",
        stroke: isActive ? "#fff" : "#2a2f3e",
        strokeWidth: isActive ? 2 : 0.5,
        transition: "all 250ms",
      },
      hover: {
        fill: color,
        fillOpacity: 1,
        outline: "none",
        cursor: "pointer",
        stroke: "#fff",
        strokeWidth: 1,
      },
      pressed: {
        fill: color,
        outline: "none",
      },
    };
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <Sphere stroke="#2a2f3e" strokeWidth={0.5} />
        <Graticule stroke="#2a2f3e" strokeWidth={0.5} />
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={getCountryStyle(geo)}
                onClick={() => {
                  const iso = geo.properties.ISO_A3;
                  const country = data && data.find((d) => d.countryCode === iso);
                  console.log(`Clicked ${iso}:`, country ? "Found" : "Not Found");
                  if (country && onCountryClick) onCountryClick(country);
                }}
                onMouseEnter={() => {
                  const country = data && data.find((d) => d.countryCode === geo.properties.ISO_A3);
                  if (country) setHoveredCountry({ name: geo.properties.ADMIN, ...country });
                }}
                onMouseLeave={() => setHoveredCountry(null)}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      {hoveredCountry && (
        <div className="glass-panel" style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "15px",
          minWidth: "180px",
          pointerEvents: "none",
          zIndex: 10,
          border: `1px solid ${hoveredCountry.dominant === 'hiring' ? 'var(--color-hiring)' : 'var(--color-layoff)'}`
        }}>
          <h3 style={{ marginBottom: "8px", fontSize: "1.1rem" }}>{hoveredCountry.name}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Hiring:</span>
              <span style={{ color: "var(--color-hiring)", fontWeight: "600" }}>{hoveredCountry.hirings.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Layoffs:</span>
              <span style={{ color: "var(--color-layoff)", fontWeight: "600" }}>{hoveredCountry.layoffs.toLocaleString()}</span>
            </div>
            <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid var(--border-glass)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</span>
              <span style={{ 
                padding: "2px 8px", 
                borderRadius: "4px", 
                fontSize: "0.75rem", 
                backgroundColor: hoveredCountry.dominant === 'hiring' ? 'var(--color-hiring-glow)' : 'var(--color-layoff-glow)',
                color: hoveredCountry.dominant === 'hiring' ? 'var(--color-hiring)' : 'var(--color-layoff)',
                fontWeight: "700"
              }}>
                {hoveredCountry.dominant.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapChart;
