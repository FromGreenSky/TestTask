import { Marker as MarkerType } from "../types/Marker";

type Point = google.maps.LatLngLiteral & { key: string; label: string; time: number };
type Props = {
    markers: Point[];
    onMarkerClick: (marker: Point) => void;
    onMarkerDelete: (markerId: string) => void;
};

const MarkersList = ({ markers = [], onMarkerClick, onMarkerDelete }: Props) => {
    if (!markers.length) {
        return <div>Немає маркерів для відображення</div>;
    }

    return (
        <div style={{ padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            <h2>Список маркерів</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {markers.map((marker) => (
                    <li key={marker.key} style={{ marginBottom: '1rem', cursor: 'pointer' }}>
                        <div
                            onClick={() => onMarkerClick(marker)}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <strong>Мітка:</strong> {marker.label}<br />
                            <strong>Час:</strong> {new Date(marker.time).toLocaleString()}<br />
                            <strong>Позиція:</strong> {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); // Щоб уникнути конфлікту з onClick для вибору маркера
                                    onMarkerDelete(marker.key);
                                }} 
                                style={{ marginLeft: '10px' }}
                            >
                                Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MarkersList;