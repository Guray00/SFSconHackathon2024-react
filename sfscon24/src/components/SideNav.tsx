import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Slider,
} from "@nextui-org/react";
import { Spacer } from "@nextui-org/spacer";
import { Divider } from "@nextui-org/react";

export const cities = [
  { label: "Milan", value: "milan" },
  { label: "Paris", value: "paris" },
];

export default function SideNav() {
  return (
    <div className="flex flex-col space-y-4 p-4 z-0 bg-opacity-0">
      <h1>
        <span className="text-xl justify-center">New negotiation</span>
      </h1>
      <Autocomplete label="Select load city" className="max-w-xs">
        {cities.map((city) => (
          <AutocompleteItem key={city.value} value={city.value}>
            {city.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      <Autocomplete label="Select unload city" className="max-w-xs">
        {cities.map((city) => (
          <AutocompleteItem key={city.value} value={city.value}>
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
        <span className="text-xl justify-center">Negotiations (#5)</span>
      </h1>
    </div>
  );
}
