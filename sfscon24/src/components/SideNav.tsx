import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Modal,
  Slider,
  useDisclosure,
} from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import type { LatLngTuple } from "leaflet";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useState } from "react";


let src_city_name = "";
let dst_city_name = "";


async function postNegotiation(src, dst, min, max, timeout = 100000) { // default timeout of 100 seconds
    const url = new URL("http://localhost:9000/negotiations");
    const controller = new AbortController(); // Create an AbortController
    const signal = controller.signal; // Get the signal from the controller
    
    console.log("src", src_city_name);
    console.log("dst", dst_city_name);
  
    // Set up a timeout to abort the request after the specified time
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          load_city: src_city_name,
          unload_city: dst_city_name,
          min_price: min,
          max_price: max,
        }),
        signal: signal, // Add the abort signal to the fetch options
      });
  
      // Clear the timeout if the request completes in time
      clearTimeout(timeoutId);
  
      if (!response.ok) {
        throw new Error(`Request error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Received data:", data);
      return data;
      
      
  
    } catch (error) {
      // Check if the error was due to the timeout
      if (error.name === "AbortError") {
        console.error("Request timeout: The request took too long to complete.");
      } else {
        console.error("Request error:", error);
      }
      throw error; // Re-throw the error for handling outside the function
    }
  }
  

export default function SideNav({
  negotiations,
  cities,
  src,
  setSrc,
  dst,
  setDst,
}: {
  negotiations: any[];
  cities: { value: LatLngTuple; label: string }[];
  src: LatLngTuple;
  setSrc: (src: LatLngTuple) => void;
  dst: LatLngTuple;
  setDst: (dst: LatLngTuple) => void;
}) {
    const [value, setValue] = useState([500, 2000]);

  return (
    <div className="p-4 max-w-xs h-fit space-y-4 z-0">
      <h2 className="text-xl font-bold mb-4">New negotiation</h2>

      <Autocomplete
        label="Source"
        className="mb-4"
        selectedKey={cities.find((city) => city.value === src)?.label}
        onSelectionChange={(key) => {
          const selected = cities.find((city) => city.label === key);
          if (selected) {
            setSrc(selected.value);
            src_city_name = selected.label;
          }
        }}
      >
        {cities.map((city) => (
          <AutocompleteItem key={city.label} value={city.label}>
            {city.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Autocomplete
        label="Destination"
        className="mb-4"
        selectedKey={cities.find((city) => city.value === dst)?.label}
        onSelectionChange={(key) => {
          const selected = cities.find((city) => city.label === key);
          if (selected) {
            setDst(selected.value);
            dst_city_name = selected.label;
          }
        }}
      >
        {cities.map((city) => (
          <AutocompleteItem key={city.label} value={city.label}>
            {city.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <DatePicker label="Transport date" className="max-w-xs" />

      <Slider
        label="Price Range"
        step={50}
        minValue={0}
        maxValue={5000}
        defaultValue={[1000, 2000]}
        formatOptions={{ style: "currency", currency: "USD" }}
        className="w-xl"
        value={value} 
        onChange={setValue}
      />
      <Button className="w-full bg-primary text-white" onClick={()=>{postNegotiation(src, dst, value[0], value[1])}}>
        Start new negotiation
      </Button>
      <Divider />
      <h1>
        <span className="text-xl justify-center">
          Negotiations (#{negotiations.length})
        </span>
      </h1>
      {negotiations.length == 0 && (
        <span className="text-sm">No negotiations found</span>
      )}
      
      <Accordion variant="splitted" className="space-y-2">
        {negotiations.map((negotiation, index) => (
          <AccordionItem className="mt-2" title={`${negotiation.src} - ${negotiation.dst}`}>
            {`Price range: ${negotiation.min} - ${negotiation.max}`}
            {`Status: ${negotiation.status}`}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
