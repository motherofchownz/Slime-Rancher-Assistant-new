import React, { useState, RefObject } from 'react';
import Map, { MapRef, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Style, AnyLayer } from 'mapbox-gl';
import urlFor from '../../../utils/imageBuilder';

const customMapStyle: Style = require('./styles.json');

const MapComponent = ({ 
  mapRef, 
  markers, 
  onExistingMarkerDragEnd, 
  onExisitingMarkerRemove 
}: { 
  mapRef: RefObject<MapRef>,
  markers: any[], 
  onExistingMarkerDragEnd: Function, 
  onExisitingMarkerRemove: Function 
}) => {

  const [selectedMarkerIds, setSelectedMarkerIds] = useState<string[]>([]);
  const [viewport, setViewport] = useState({
      width: '100vw',
      height: '100vh',
      latitude: -75, // Initial map center latitude
      longitude: -80, // Initial map center longitude
      zoom: 2.7, // Initial zoom level
  });

  const handleMarkerClick = (markerId: string) => {
    // Check if the marker is already selected
    const index = selectedMarkerIds.indexOf(markerId);
    if (index === -1) {
      // If not selected, add it to the array of selected markers
      setSelectedMarkerIds([...selectedMarkerIds, markerId]);
    } else {
      // If already selected, remove it from the array of selected markers
      setSelectedMarkerIds(selectedMarkerIds.filter((id) => id !== markerId));
    }
  };

  return (
    <Map
      ref={mapRef}
      renderWorldCopies={false}
      initialViewState={viewport}
      mapStyle={customMapStyle}
      mapboxAccessToken="pk.eyJ1IjoibW90aGVyb2ZjaG93bnoiLCJhIjoiY2xvbzd4OTc5MWplZDJxbW9tM3hveDQ1diJ9.3LXtYaK0r3Wzwt2nKJch9g" //{process.env.REACT_APP_MAPBOX_TOKEN}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          latitude={marker.latitude}
          longitude={marker.longitude}
          style={{
            zIndex: 100,
          }}
          draggable={marker.draggable}
          onDragEnd={(event) => onExistingMarkerDragEnd(marker.id, event.lngLat, event)}
        >
          <div>          
            {/* Render 'X' icon only for the selected marker */}
            {selectedMarkerIds.includes(marker.id) && (
              <div style={{ position: 'relative' }}>
                <span
                  className="w-4 cursor-pointer remove-icon"
                  onClick={() => onExisitingMarkerRemove(marker.id)} // Handle marker removal on 'X' icon click
                >
                  <svg className="w-6 h-6 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z" clip-rule="evenodd"/>
                  </svg>
                </span>
              </div>
            )}
            <img 
              src={urlFor(marker.item.icon).url()} 
              alt={marker.item.name}
              className="w-8"
              onClick={() => handleMarkerClick(marker.id)} // Set the selected marker ID on click
            />
          </div>
        </Marker>
      ))}
    </Map>
  );
}
  
export default MapComponent;