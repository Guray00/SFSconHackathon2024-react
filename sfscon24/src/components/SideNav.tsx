import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Slider,
} from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import type { LatLngTuple } from "leaflet";
import Negotiation from "./Negotiation";
import { Accordion, AccordionItem } from "@nextui-org/react";

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
      />
      <Button className="max-w-xs bg-primary text-white">
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
