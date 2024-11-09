import SideNav from "@/components/SideNav";
import Map from "@/components/map";
import NegotiationsPopup from "@/components/NegotiationPopup";
import { useEffect, useState } from "react";
import type { LatLngTuple } from 'leaflet';
import { fetchDataFromEndpoint } from "@/hooks/FetchDataFromEndpoint";


export default function IndexPage() {
    const [src, setSrc] = useState<LatLngTuple[]>([0, 0]);
    const [dst, setDst] = useState<LatLngTuple[]>([0, 0]);
    const [negotiations, setNegotiations] = useState([]);
    
   
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchDataFromEndpoint("GetAvailableCities", {});
            console.log(data);
            
            // Create new markers array from data
            const newMarkers = data.map(item => ({
                label: item.city,
                value: [item.latitude, item.longitude] as LatLngTuple
            }));
    
            console.log("New markers:", newMarkers);
            setMarkers(newMarkers);
        };
    
        fetchData().catch(error => {
            console.error("Error fetching cities:", error);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDataFromEndpoint("negotiations", {});
                console.log("Raw data:", data);
                
                // Transform all data at once instead of multiple setState calls
                const transformedData = data.map((item) => ({
                    src: item.load_city,
                    dst: item.unload_city,
                    min: item.minimum_price,
                    max: item.maximum_price,
                    status: item.status
                }));
                
                // Single setState call
                setNegotiations(transformedData);
                
            } catch (error) {
                console.error("Error fetching negotiations:", error);
            }
        };
    
        fetchData().then(() => {
            console.log("Negotiations fetched successfully", negotiations);
        });
    }, []);

    return (
        <div className="relative w-screen h-screen">
          <div className="absolute inset-0 z-0">
            <Map markers={markers} src={src} setSrc={setSrc} dst={dst} setDst={setDst} />
          </div>
      
          <div className="absolute left-0 top-0 h-full z-10">
            <div className="flex h-100 max-w-full  space-x-4">
              <div className="shrink-0 backdrop-blur-md bg-white/70 shadow-lg m-4 rounded-medium ">
                <SideNav cities={markers} src={src} setSrc={setSrc} dst={dst} setDst={setDst} negotiations={negotiations} />
              </div>
            </div>
          </div>
        </div>
      ); 
}
