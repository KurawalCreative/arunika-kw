"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
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
import { useRouter } from "@/i18n/navigation";

const InteractiveMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapType | null>(null);
    const lastHovered = useRef<string | null>(null);
    const hoverFrame = useRef<number | null>(null);
    const dialogOpenRef = useRef(false);
    const router = useRouter();

    const { theme } = useTheme();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);

    useEffect(() => {
        dialogOpenRef.current = dialogOpen;
    }, [dialogOpen]);

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return;

        const BOUNDS: [[number, number], [number, number]] = [
            [92, -12],
            [145, 8],
        ];

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: { "base-tiles": { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256 } },
                layers: [
                    { id: "background", type: "background", paint: { "background-color": "#ffffff" } },
                    { id: "base-map", type: "raster", source: "base-tiles", paint: { "raster-opacity": 0 } },
                ],
            } as unknown as StyleSpecification,
            center: [118, -2],
            zoom: 4.28,
            maxBounds: BOUNDS,
            dragPan: !!(typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || "ontouchstart" in window || window.matchMedia?.("(pointer: coarse)")?.matches)),
            scrollZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            touchZoomRotate: false,
            keyboard: false,
        });

        mapRef.current = map;

        map.on("load", () => {
            const COLOR_PALETTE = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788", "#F4A261", "#E76F51", "#2A9D8F", "#E9C46A", "#F77F00"];

            const makeFeatures = (data: FeatureCollection) => {
                const colorMap = new Map<string, string>();
                let idx = 0;
                return data.features.map((f: Feature) => {
                    const props = (f.properties || {}) as Record<string, unknown>;
                    const name = (props["province_bps_name"] as string) || "Tidak Dikenal";
                    if (!colorMap.has(name)) colorMap.set(name, COLOR_PALETTE[idx++ % COLOR_PALETTE.length]);
                    return { ...f, properties: { ...props, NAME_1: name, color: colorMap.get(name) } };
                });
            };

            const features = makeFeatures(indonesia as FeatureCollection);
            map.addSource("indonesia", { type: "geojson", data: { type: "FeatureCollection", features } });

            map.addLayer({ id: "indo-fill", type: "fill", source: "indonesia", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.9 } });
            map.addLayer({ id: "indo-highlight", type: "fill", source: "indonesia", paint: { "fill-outline-color": "#fff", "fill-color": "#fff", "fill-opacity": 0.4 }, filter: ["==", "NAME_1", ""] });
            map.addLayer({ id: "indo-outline", type: "line", source: "indonesia", paint: { "line-color": "#fff", "line-width": 1.2 } });

            try {
                map.fitBounds(BOUNDS, { padding: 20, maxZoom: 6 });
            } catch {}

            map.on("mousemove", "indo-fill", (e) => {
                if (!e.point) return;
                if (hoverFrame.current) cancelAnimationFrame(hoverFrame.current);
                hoverFrame.current = requestAnimationFrame(() => {
                    hoverFrame.current = null;
                    const found = map.queryRenderedFeatures(e.point, { layers: ["indo-fill"] });
                    if (!found?.length) return;
                    const name = found[0].properties?.NAME_1 as string | undefined;
                    if (!name || lastHovered.current === name) return;
                    lastHovered.current = name;
                    map.getCanvas().style.cursor = "pointer";
                    map.setFilter("indo-highlight", ["==", "NAME_1", name]);
                    setSelectedProvince(name);
                    setDescription(`Provinsi ${name} ...`);
                });
            });

            map.on("click", "indo-fill", (e) => {
                const name = e.features?.[0]?.properties?.NAME_1 as string | undefined;
                if (!name) return;
                setSelectedProvince(name);
                setDescription(`Provinsi ${name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia.`);
                dialogOpenRef.current = true;
                setDialogOpen(true);
            });

            map.on("mouseleave", "indo-fill", () => {
                if (hoverFrame.current) cancelAnimationFrame(hoverFrame.current);
                hoverFrame.current = null;
                lastHovered.current = null;
                map.getCanvas().style.cursor = "";
                map.setFilter("indo-highlight", ["==", "NAME_1", ""]);
                if (dialogOpenRef.current) return;
                setSelectedProvince(null);
                setDescription(null);
            });
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;
        try {
            mapRef.current.setPaintProperty("background", "background-color", theme === "dark" ? "#111827" : "#ffffff");
        } catch {}
    }, [theme]);

    return (
        <div className="relative flex aspect-square w-full max-w-7xl overflow-hidden rounded-xl sm:h-[500px]">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Input placeholder="Cari provinsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 rounded-lg text-sm lg:w-80" />
                <Button className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-400">
                    <Search size={16} />
                </Button>
            </div>

            <div ref={mapContainer} className="h-full w-full cursor-default" />

            {selectedProvince && (
                <div className="absolute bottom-0.5 left-0.5 max-w-[250px] rounded-lg bg-white/90 p-3 text-sm shadow-sm backdrop-blur-sm transition-all duration-300 dark:bg-gray-900/85">
                    <h3 className="mb-1 text-base font-semibold">{selectedProvince}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">{description}</p>
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center justify-center gap-3">
                            <div className="rounded-full bg-linear-to-r from-orange-400 to-pink-500 p-2 text-xl text-white dark:from-orange-500 dark:to-pink-600">🎎</div>
                            <DialogTitle className="text-lg text-gray-900 dark:text-white">Jelajahi Budaya</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground mt-2 text-center text-sm">
                            Kamu akan menjelajahi budaya dari <span className="font-medium">{selectedProvince || "provinsi"}</span>. Temukan cerita, bahasa, dan tradisi yang kaya.
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
                            <Button onClick={() => router.push(`/jelajahi-nusantara/${selectedProvince?.toLowerCase().replace(/\s+/g, "-")}`)}>Jelajahi Sekarang</Button>
                        </div>
                    </DialogFooter>
                    <DialogClose />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InteractiveMap;
