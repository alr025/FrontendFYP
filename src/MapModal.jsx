import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./MapModel.css";

// Custom red pin icon
const redIcon = new L.DivIcon({
  className: "custom-marker",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  `,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

const MapModal = () => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  const navigate = useNavigate();
  const routerLocation = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [organizations, setOrganizations] = useState([]);

  // Islamabad coordinates
  const islamabadCoords = [33.6844, 73.0479];

  // Pakistan bounds
  const pakistanBounds = [
    [23.6345, 60.8727],
    [37.0841, 77.8375],
  ];

  const coords = routerLocation.state?.coords;
  const type = routerLocation.state?.type;
  const name = routerLocation.state?.name;

  // Fetch hospitals
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await axios.get(
          "http://localhost/BloodDonationAndEmergencyHealthServicesAPI/api/organizations"
        );

        setOrganizations(res.data);

        const map = leafletMapRef.current;
        if (!map) return;

        res.data.forEach((org) => {
          if (org.latitude && org.longitude) {
            L.marker([org.latitude, org.longitude], { icon: redIcon })
              .addTo(map)
              .bindPopup(`
                <b>${org.name}</b><br/>
                📍 ${org.contact_number || ""}<br/>
                📧 ${org.email || ""}
              `);
          }
        });
      } catch (err) {
        console.error("Error fetching organizations:", err);
      }
    };

    fetchOrganizations();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const startCoords = coords
      ? [coords.lat, coords.lng]
      : islamabadCoords;

    const map = L.map(mapRef.current, {
      center: startCoords,
      zoom: coords ? 16 : 12,
      minZoom: 5,
      maxZoom: 18,
      maxBounds: pakistanBounds,
      maxBoundsViscosity: 1.0,
    });

    leafletMapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    markerRef.current = L.marker(startCoords, {
      draggable: true,
      icon: redIcon,
    }).addTo(map);

    markerRef.current
      .bindPopup(name ? `<b>${name}</b>` : "📍 Selected Location")
      .openPopup();

    setSelectedCoords({
      lat: startCoords[0],
      lng: startCoords[1],
    });

    map.on("dblclick", (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) map.removeLayer(markerRef.current);

      markerRef.current = L.marker([lat, lng], {
        draggable: true,
        icon: redIcon,
      }).addTo(map);

      markerRef.current
        .bindPopup(
          `📍 Selected Location<br/>Lat: ${lat.toFixed(
            5
          )}, Lng: ${lng.toFixed(5)}`
        )
        .openPopup();

      setSelectedCoords({ lat, lng });
    });

    return () => map.remove();
  }, [coords]);

  // Geolocation
  const handleFindLocation = () => {
    if (!navigator.geolocation)
      return alert("Geolocation not supported.");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        if (
          latitude < 23.6345 ||
          latitude > 37.0841 ||
          longitude < 60.8727 ||
          longitude > 77.8375
        ) {
          return alert("You are outside Pakistan!");
        }

        const map = leafletMapRef.current;
        if (markerRef.current) map.removeLayer(markerRef.current);

        markerRef.current = L.marker([latitude, longitude], {
          draggable: true,
          icon: redIcon,
        }).addTo(map);

        markerRef.current
          .bindPopup(
            `📍 You are here<br/>Lat: ${latitude.toFixed(
              5
            )}, Lng: ${longitude.toFixed(5)}`
          )
          .openPopup();

        map.setView([latitude, longitude], 15);
        setSelectedCoords({ lat: latitude, lng: longitude });
      },
      () => alert("Unable to get location."),
      { enableHighAccuracy: true }
    );
  };

  // Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "json",
            q: searchQuery,
            limit: 1,
            countrycodes: "PK",
          },
        }
      );

      if (!res.data.length)
        return alert("❌ Location not found in Pakistan!");

      const { lat, lon } = res.data[0];
      const map = leafletMapRef.current;

      if (markerRef.current) map.removeLayer(markerRef.current);

      markerRef.current = L.marker([lat, lon], {
        draggable: true,
        icon: redIcon,
      }).addTo(map);

      markerRef.current
        .bindPopup(
          `📍 ${searchQuery}<br/>Lat: ${(+lat).toFixed(
            5
          )}, Lng: ${(+lon).toFixed(5)}`
        )
        .openPopup();

      map.setView([lat, lon], 15);
      setSelectedCoords({ lat: +lat, lng: +lon });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to search location.");
    }
  };

  // Hospital click
  const handleHospitalClick = (org) => {
    const map = leafletMapRef.current;
    if (!map || !org.latitude || !org.longitude) return;

    map.setView([org.latitude, org.longitude], 15);
    L.popup()
      .setLatLng([org.latitude, org.longitude])
      .setContent(`
        <b>${org.name}</b><br/>
        📍 ${org.contact_number || ""}<br/>
        📧 ${org.email || ""}
      `)
      .openOn(map);
  };

  // ✅ DONE BUTTON (FIXED)
const handleDone = () => {
  if (!selectedCoords) {
    alert("No location selected!");
    return;
  }

 // When done selecting location
navigate("/select-location", {
  replace: true,
  state: {
    type,
    coords: selectedCoords,
    currentLocation: type === "current" ? selectedCoords : routerLocation.state?.currentLocation,
    destinationLocation: type === "destination" ? selectedCoords : routerLocation.state?.destinationLocation,
    recordId: routerLocation.state?.recordId
  }
});

};


  return (
    <div className="map-container">
      <div className="sidebar">
        <h3>Hospitals</h3>
        <ul>
          {organizations.map((org) => (
            <li key={org.id} onClick={() => handleHospitalClick(org)}>
              <b>{org.name}</b>
              <br />
              <small>{org.contact_number}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="map-wrapper">
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="btn btn-search">
            Search
          </button>
          <button onClick={handleFindLocation} className="btn btn-location">
            Find My Location
          </button>
          <button onClick={handleDone} className="btn btn-done">
            Done
          </button>
        </div>

        <div ref={mapRef} className="leaflet-map" />
      </div>
    </div>
  );
};

export default MapModal;
