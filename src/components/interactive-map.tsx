"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection } from "geojson";
import indonesia from "@/assets/coordinates/id.json";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useMapStore } from "@/store/mapStore";

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  const setProvince = useMapStore((state) => state.setSelectedProvince);
  const clearProvince = useMapStore((state) => state.clearSelection);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const bounds: [[number, number], [number, number]] = [
      [90, -15],
      [150, 20],
    ];

    const baseStyle: StyleSpecification = {
      version: 8,
      name: "Static Indonesia Map",
      sources: {
        "base-tiles": {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: "background",
          type: "background",
          paint: {
            "background-color": theme === "dark" ? "#111827" : "#ffffff",
          },
        },
        {
          id: "base-map",
          type: "raster",
          source: "base-tiles",
          paint: { "raster-opacity": 0 },
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: baseStyle,
      center: [118, -2],
      zoom: 4.28,
      maxBounds: bounds,

      // Jadikan peta statis
      dragPan: false,
      scrollZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoomRotate: false,
      keyboard: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      const provColors: Record<string, string> = {};
      const colorPalette = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
        "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788",
        "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#F77F00",
      ];

      let colorIndex = 0;
      const getColor = (name: string) => {
        if (!provColors[name]) {
          provColors[name] = colorPalette[colorIndex % colorPalette.length];
          colorIndex++;
        }
        return provColors[name];
      };

      const features = (indonesia as any).features.map((f: any) => {
        const name =
          f.properties?.NAME_1 ||
          f.properties?.name ||
          f.properties?.provinsi ||
          "Tidak Dikenal";
        return {
          ...f,
          properties: { ...f.properties, NAME_1: name, color: getColor(name) },
        };
      });

      const coloredData: FeatureCollection = {
        type: "FeatureCollection",
        features,
      };

      map.addSource("indonesia", { type: "geojson", data: coloredData });

      map.addLayer({
        id: "indo-fill",
        type: "fill",
        source: "indonesia",
        paint: { "fill-color": ["get", "color"], "fill-opacity": 0.9 },
      });

      map.addLayer({
        id: "indo-highlight",
        type: "fill",
        source: "indonesia",
        paint: {
          "fill-outline-color": "#ffffff",
          "fill-color": "#ffffff",
          "fill-opacity": 0.4,
        },
        filter: ["==", "NAME_1", ""],
      });

      map.addLayer({
        id: "indo-outline",
        type: "line",
        source: "indonesia",
        paint: { "line-color": "#fff", "line-width": 1.2 },
      });

      // 🟡 Hover - highlight + info card kiri bawah
      map.on("mousemove", "indo-fill", (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0];
        const name =
          feature.properties?.NAME_1 ||
          feature.properties?.name ||
          feature.properties?.provinsi ||
          "Tidak Dikenal";

        map.getCanvas().style.cursor = "pointer";

        map.setFilter("indo-highlight", ["==", "NAME_1", name]);

        const desc = `Provinsi ${name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia. Nantinya, halaman ini akan menampilkan informasi budaya lebih lengkap.`;
        setProvince(name, desc);
      });

      // Hapus highlight dan info saat mouse keluar
      map.on("mouseleave", "indo-fill", () => {
        map.getCanvas().style.cursor = "default";

        map.setFilter("indo-highlight", ["==", "NAME_1", ""]);
        clearProvince();
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [setProvince, clearProvince, theme]);

  return (
    <div className="relative w-full max-w-7xl h-[500px] rounded-xl overflow-hidden">
      {/* 🔍 Search Bar */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Input
          placeholder="Cari provinsi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lg:w-80 h-10 rounded-lg text-sm"
        />
        <Button className="bg-orange-500 hover:bg-orange-400 text-white rounded-lg h-10 w-10 flex items-center justify-center">
          <Search size={16} />
        </Button>
      </div>

      {/* 🗺️ Peta */}
      <div ref={mapContainer} className="w-full h-full cursor-default" />

      {/* 🟢 Info Hover */}
      <LocationInfo />
    </div>
  );
};

export default InteractiveMap;

const LocationInfo = () => {
  const { selectedProvince, description } = useMapStore();

  if (!selectedProvince) return null;

  return (
    <div className="absolute bottom-0.5 left-0.5 bg-white/90 dark:bg-gray-900/85 backdrop-blur-sm p-3 rounded-lg shadow-sm max-w-[250px] text-sm transition-all duration-300">
      <h3 className="font-semibold text-base mb-1">{selectedProvince}</h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[13px]">
        {description}
      </p>
    </div>
  );
};
