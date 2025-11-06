"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
// Use the namespace to get types in a way that's compatible across maplibre-gl typings
type MapType = maplibregl.Map;
type StyleSpecification = maplibregl.StyleSpecification;
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection, Feature } from "geojson";
import indonesia from "@/assets/coordinates/id.json";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useMapStore } from "@/store/mapStore";

const InteractiveMap = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapType | null>(null);
    const lastHovered = useRef<string | null>(null);
    const { theme } = useTheme();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const selectedProvince = useMapStore((s) => s.selectedProvince);

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

        // Detect touch-capable devices (mobile/tablet). On touch devices enable
        // interactions (drag/zoom). On desktop keep the map static.
        const isInteractive = typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || "ontouchstart" in window || window.matchMedia?.("(pointer: coarse)")?.matches);

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: baseStyle,
            center: [118, -2],
            zoom: 4.28,
            maxBounds: bounds,

            // Interaction settings: enable on touch devices, disable on desktop
            dragPan: !!isInteractive,
            scrollZoom: !!isInteractive,
            doubleClickZoom: !!isInteractive,
            boxZoom: !!isInteractive,
            touchZoomRotate: !!isInteractive,
            keyboard: false,
        });

        mapRef.current = map;

        map.on("load", () => {
            const provColors: Record<string, string> = {};
            const colorPalette = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788", "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#F77F00"];

            let colorIndex = 0;
            const getColor = (name: string) => {
                if (!provColors[name]) {
                    provColors[name] = colorPalette[colorIndex % colorPalette.length];
                    colorIndex++;
                }
                return provColors[name];
            };

            const features = (indonesia as FeatureCollection).features.map((f: Feature) => {
                const props = (f.properties ?? {}) as Record<string, unknown>;
                // Use only province_bps_name as requested
                const name = (props["province_bps_name"] as string) || "Tidak Dikenal";
                return {
                    ...f,
                    properties: { ...props, NAME_1: name, color: getColor(name) },
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

            // Hover: pakai enter supaya gak over-update saat pointer gerak terus
            map.on("mouseenter", "indo-fill", (e) => {
                if (!e.features?.length) return;
                const name = e.features[0].properties?.NAME_1 || "Tidak Dikenal";
                if (lastHovered.current === name) return;
                lastHovered.current = name;

                map.getCanvas().style.cursor = "pointer";
                map.setFilter("indo-highlight", ["==", "NAME_1", name]);
                setProvince(name, `Provinsi ${name} ...`);
            });

            // 🟣 Click - open dialog to explore province
            map.on("click", "indo-fill", (e) => {
                if (!e.features?.length) return;
                const name = e.features[0].properties?.NAME_1 || "Tidak Dikenal";
                const desc = `Provinsi ${name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia.`;
                setProvince(name, desc);
                setDialogOpen(true);
            });

            // Hapus highlight dan info saat mouse keluar
            map.on("mouseleave", "indo-fill", () => {
                lastHovered.current = null;
                map.setFilter("indo-highlight", ["==", "NAME_1", ""]);
                clearProvince();
            });
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [setProvince, clearProvince, theme]);

    // Update background color when theme changes without recreating the map.
    useEffect(() => {
        if (!mapRef.current) return;

        const bgColor = theme === "dark" ? "#111827" : "#ffffff";

        try {
            // 'background' layer exists in the initial style; update its paint property
            mapRef.current.setPaintProperty("background", "background-color", bgColor);
        } catch (e) {
            // If the layer/style is not available for some reason, ignore.
            // Recreating the map is avoided to preserve state.
        }
    }, [theme]);

    return (
        <div className="relative flex aspect-square w-full max-w-7xl overflow-hidden rounded-xl sm:h-[500px]">
            {/* 🔍 Search Bar */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Input placeholder="Cari provinsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-lg text-sm lg:w-80" />
                <Button className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-400">
                    <Search size={16} />
                </Button>
            </div>

            {/* 🗺️ Peta */}
            <div ref={mapContainer} className="h-full w-full cursor-default" />

            {/* 🟢 Info Hover */}
            <LocationInfo />

            {/* 🎫 Dialog — open when user clicks a province */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center justify-center gap-3">
                            <div className="rounded-full bg-linear-to-r from-orange-400 to-pink-500 p-2 text-xl text-white">🎎</div>
                            <DialogTitle className="text-lg">Jelajahi Budaya</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground mt-2 text-center text-sm">
                            Kamu akan menjelajahi budaya dari <span className="font-medium">{selectedProvince ?? "provinsi"}</span>. Temukan cerita, bahasa, dan tradisi yang kaya.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4 grid gap-3">
                        <p className="text-muted-foreground text-sm">Tip: gunakan pinch-to-zoom di perangkat mobile untuk melihat detail peta.</p>
                        <div className="flex h-32 items-center justify-center rounded-md bg-linear-to-br from-white/30 to-orange-50 p-3 dark:from-gray-800/40 dark:to-orange-900/20">
                            <span className="text-muted-foreground text-sm">Visual preview placeholder — tambahkan gambar atau ringkasan di sini.</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex w-full gap-2">
                            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={() => {
                                    // close dialog and optionally navigate to a detail page in future
                                    setDialogOpen(false);
                                }}
                            >
                                Jelajahi Sekarang
                            </Button>
                        </div>
                    </DialogFooter>
                    <DialogClose />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InteractiveMap;

const LocationInfo = () => {
    const { selectedProvince, description } = useMapStore();

    if (!selectedProvince) return null;

    return (
        <div className="absolute bottom-0.5 left-0.5 max-w-[250px] rounded-lg bg-white/90 p-3 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 dark:bg-gray-900/85">
            <h3 className="mb-1 text-base font-semibold">{selectedProvince}</h3>
            <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
        </div>
    );
};
