import { APIProvider, Map, InfoWindow, AdvancedMarker, MapMouseEvent, Pin, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useRef, useState } from "react";
import { Marker as MarkerType } from "../types/Marker";
import { Timestamp, addDoc, collection, doc, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Markers from "./Markers";
import MarkersList from "./MarkersList";

const Maps = () => {
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const markersRef = useRef<MarkerType[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

    const fetchMarkers = async () => {
        const getMarkers = await getDocs(collection(db, 'markers'));
        const markersData = getMarkers.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                lat: data.lat,
                lng: data.lng,
                time: data.timestamp.toDate(),
                label: data.label
            } as MarkerType;
        });
        setMarkers(markersData);
        markersRef.current = markersData;
    };

    useEffect(() => {
        fetchMarkers();
    }, [markers]);

    const onMapClick = useCallback(async (event: MapMouseEvent) => {
        const latLng = event.detail.latLng;
        if (latLng) {
            const newMarker: Omit<MarkerType, 'id'> = {
                lat: latLng.lat,
                lng: latLng.lng,
                time: new Date(),
                label: (markers.length + 1).toString()
            };
            try {
                const docRef = await addDoc(collection(db, 'markers'), {
                    lat: newMarker.lat,
                    lng: newMarker.lng,
                    timestamp: Timestamp.fromDate(newMarker.time),
                    label: newMarker.label
                });
                const newMarkerWithId = { ...newMarker, id: docRef.id };
                setMarkers(current => [...current, newMarkerWithId]);
                markersRef.current = [...markersRef.current, newMarkerWithId];
            } catch (e) {
                console.log('Error adding marker:', e);
            }
        }
    }, [markers]);

    const points = markers.map(marker => ({
        lat: marker.lat,
        lng: marker.lng,
        key: marker.id,
        time: marker.time.getTime(),
        label: marker.label
    }));
    const handleMarkerClick = (marker: MarkerType) => {
        setSelectedMarker(marker);
    };
    const handleMarkerDelete = async (markerId: string) => {
        try {
            await deleteDoc(doc(db, 'markers', markerId));
            setMarkers((current) => current.filter(marker => marker.id !== markerId));
        } catch (e) {
            console.log('Error deleting marker:', e);
        }
    };
    return (
        <APIProvider apiKey="AIzaSyAcLNsZn_D0mrD_R3z0twu_G-7btOtY2e8">
            <div>
                <Map
                    mapId={'e84c927f295c9d7b'}
                    style={{ width: '90vw', height: '90vh' }}
                    defaultCenter={{ lat: 49.83, lng: 23.99 }}
                    defaultZoom={12}
                    onClick={onMapClick}
                >
                    <Markers points={points} />
                </Map>
                <MarkersList markers={points} onMarkerClick={(marker) => console.log(marker)} onMarkerDelete={handleMarkerDelete} />
            </div>
            
            
        </APIProvider>
    );
};

export default Maps;