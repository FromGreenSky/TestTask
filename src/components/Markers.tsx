import { AdvancedMarker, InfoWindow, Pin, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";


type Point = google.maps.LatLngLiteral & { key: string; label: string; time: number };
type Props = { points: Point[] };

export const Markers = ({ points }: Props) => {
    const map = useMap();
    const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
    const [selected, setSelected] = useState<Point | null>(null);
    const clusterer = useRef<MarkerClusterer | null>(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({ map });
        }
    }, [map]);

    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers((prev) => {
            if (marker) {
                return { ...prev, [key]: marker };
            } else {
                const newMarkers = { ...prev };
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    const handleDragEnd = useCallback(async (markerId: string, latLng: google.maps.LatLng | null) => {
        if (latLng) {
            try {
                const markerRef = doc(db, 'markers', markerId);
                await updateDoc(markerRef, {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                });
            } catch (e) {
                console.log('Error updating marker:', e);
            }
        }
    }, []);
    return (
        <>
            {points.map((point) => (
                <AdvancedMarker
                    position={point}
                    key={point.key}
                    draggable
                    onDragEnd={(event) => handleDragEnd(point.key, event.latLng)}
                    onClick={() => setSelected(point)}
                    ref={(marker) => {
                        if (marker && !markers[point.key]) {
                            markers[point.key] = marker;
                            setMarkers({ ...markers });
                        }
                    }}
                >
                    <Pin>{point.label}</Pin>
                </AdvancedMarker>
            ))}
            {selected ? (
                    <InfoWindow
                        position={{ lat: selected.lat, lng: selected.lng }}
                        onCloseClick={() => setSelected(null)}
                    >
                        <div>
                            <h2>Маркер №{selected.label}</h2>
                            <p>Час: {new Date(selected.time).toString()}</p>
                        </div>
                    </InfoWindow>
                ) : null}
        </>
    )
}
export default Markers