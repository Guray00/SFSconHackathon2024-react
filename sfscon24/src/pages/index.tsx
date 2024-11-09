import SideNav from "@/components/SideNav";
import Map from "@/components/map";

export default function IndexPage() {
  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0 z-0">
        {" "}
        {/* Map container takes full space */}
        <Map />
      </div>

      <div className="absolute left-0 top-0 h-full z-10">
        {" "}
        {/* SideNav container */}
        <div className="h-fit backdrop-blur-md bg-white/70 shadow-lg m-4 rounded-medium">
          {/* Blur effect container */}
          <SideNav />
        </div>
      </div>
    </div>
  );
}
