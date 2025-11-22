"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
type MapType = maplibregl.Map;
type StyleSpecification = maplibregl.StyleSpecification;
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection, Feature, Position } from "geojson";
import indonesia from "@/assets/coordinates/id.json";
import provinsi from "@/assets/provinsi.json";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type ProvinceEntry = {
    name: string;
    feature: Feature;
    lowerName: string;
};

const SEARCH_INPUT_CLASSES = cn("h-10 w-full rounded-2xl border bg-white/90 pl-9 text-sm text-gray-900 shadow-sm transition", "focus:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/60", "dark:border-slate-600 dark:bg-slate-950/80 dark:text-gray-50 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-700");

const REFRESH_BUTTON_CLASSES = cn("h-10 w-10 rounded-2xl border border-slate-200 bg-white/90 p-0 text-slate-900 shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-300/60", "hover:bg-slate-100", "dark:border-slate-600 dark:bg-slate-900/80 dark:text-gray-50 dark:hover:bg-slate-800/80");

const DIALOG_CONTENT_CLASSES = cn("flex max-h-[90vh] max-w-2xl flex-col rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.25)] backdrop-blur", "dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-[0_25px_70px_rgba(2,6,23,0.8)]", "bg-linear-to-br from-white/90 via-slate-50 to-slate-50 dark:from-slate-900/90 dark:via-slate-900/95 dark:to-slate-900");

type SearchResultListProps = {
    entries: ProvinceEntry[];
    onSelect: (entry: ProvinceEntry) => void;
};

const SearchResultList = memo(function SearchResultList({ entries, onSelect }: SearchResultListProps) {
    if (!entries.length) {
        return <li className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">Tidak ditemukan</li>;
    }

    return (
        <>
            {entries.map((entry) => (
                <li key={entry.name} className="cursor-pointer px-4 py-2 text-sm text-gray-900 transition hover:bg-slate-100 dark:text-gray-100 dark:hover:bg-slate-800/40" onMouseDown={() => onSelect(entry)}>
                    {entry.name}
                </li>
            ))}
        </>
    );
});

SearchResultList.displayName = "SearchResultList";

const toTupleRing = (ring?: Position[]) => (ring ?? []).map((pos) => [pos[0], pos[1]] as [number, number]);

const InteractiveMap = () => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<MapType | null>(null);
    const lastHovered = useRef<string | null>(null);
    const hoverFrame = useRef<number | null>(null);
    const hoverDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const dialogOpenRef = useRef(false);
    const router = useRouter();

    const { theme } = useTheme();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const isTouchRef = useRef(false);

    const provinceList = useMemo<ProvinceEntry[]>(() => {
        const rawFeatures = ((indonesia as FeatureCollection).features || []) as Feature[];
        return rawFeatures.map((feature) => {
            const props = (feature.properties || {}) as Record<string, unknown>;
            const name = (props["province_bps_name"] as string) || "Tidak Dikenal";
            return { name, feature, lowerName: name.toLowerCase() };
        });
    }, []);

    const normalizedSearch = useMemo(() => search.trim().toLowerCase(), [search]);
    const filteredProvinces = useMemo(() => {
        if (!normalizedSearch) return [];
        return provinceList.filter((entry) => entry.lowerName.includes(normalizedSearch));
    }, [normalizedSearch, provinceList]);
    const hasSearchQuery = normalizedSearch.length > 0;

    const focusProvinceOnMap = useCallback(
        (entry: ProvinceEntry) => {
            if (!mapRef.current) return;
            const geometry = entry.feature.geometry as Feature["geometry"] | null;
            const coords: [number, number][] = [];
            if (geometry?.type === "Polygon") {
                const polygon = geometry.coordinates as Position[][];
                coords.push(...toTupleRing(polygon[0]));
            } else if (geometry?.type === "MultiPolygon") {
                const multi = geometry.coordinates as Position[][][];
                multi.forEach((poly) => {
                    coords.push(...toTupleRing(poly[0]));
                });
            }
            if (coords.length > 0) {
                let minX = coords[0][0];
                let minY = coords[0][1];
                let maxX = coords[0][0];
                let maxY = coords[0][1];
                coords.forEach(([x, y]) => {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                });
                mapRef.current.fitBounds(
                    [
                        [minX, minY],
                        [maxX, maxY],
                    ],
                    { padding: 20, maxZoom: 6 },
                );
            }
            mapRef.current.setFilter("indo-highlight", ["==", "NAME_1", entry.name]);
        },
        [mapRef],
    );

    const handleSelectProvince = useCallback(
        (entry: ProvinceEntry) => {
            setSelectedProvince(entry.name);
            setDescription(`Provinsi ${entry.name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia.`);
            setSearch("");
            focusProvinceOnMap(entry);
        },
        [focusProvinceOnMap],
    );

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    const handleRefresh = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.fitBounds(
                [
                    [92, -12],
                    [145, 8],
                ],
                { padding: 20, maxZoom: 6 },
            );
            mapRef.current.setFilter("indo-highlight", ["==", "NAME_1", ""]);
            setSelectedProvince(null);
            setDescription(null);
        }
    }, []);
    // Map provinsi data
    const provinsiMap = useMemo(() => {
        const map = new Map<string, any>();
        provinsi.forEach((p) => {
            const slug = p.name.toLowerCase().replace(/\s+/g, "-");
            map.set(slug, {
                name: p.name,
                description: p.deskripsi,
                deskripsi2: p.deskripsi,
                bahasa: p.bahasa.join(", "),
                kuliner: p.kuliner.join(", "),
                budaya: p.budaya.join(", "),
                wisata: p.wisata.join(", "),
                baju_adat: p.baju_adat.join(", "),
            });
        });
        return map;
    }, []);

    useEffect(() => {
        dialogOpenRef.current = dialogOpen;
    }, [dialogOpen]);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
        const detectTouch = () => !!("ontouchstart" in window) || (navigator.maxTouchPoints ?? 0) > 0 || window.matchMedia("(pointer: coarse)").matches;
        const mediaQuery = window.matchMedia("(pointer: coarse)");
        const handleChange = () => {
            const nextValue = detectTouch();
            isTouchRef.current = nextValue;
            setIsTouchDevice(nextValue);
        };
        handleChange();
        mediaQuery.addEventListener?.("change", handleChange);
        return () => mediaQuery.removeEventListener?.("change", handleChange);
    }, []);

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
                    { id: "background", type: "background", paint: { "background-color": theme === "dark" ? "#0f172a" : "#f8fafc" } },
                    { id: "base-map", type: "raster", source: "base-tiles", paint: { "raster-opacity": theme === "dark" ? 0.2 : 0.1 } },
                ],
            } as unknown as StyleSpecification,
            center: [118, -2],
            zoom: 4.28,
            maxBounds: BOUNDS,
            scrollZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            touchZoomRotate: true,
            keyboard: false,
            dragPan: true,
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

            map.addLayer({ id: "indo-fill", type: "fill", source: "indonesia", paint: { "fill-color": ["get", "color"], "fill-opacity": 0.7 } });
            map.addLayer({ id: "indo-highlight", type: "fill", source: "indonesia", paint: { "fill-outline-color": "#fff", "fill-color": "#fff", "fill-opacity": 0.3 }, filter: ["==", "NAME_1", ""] });
            map.addLayer({ id: "indo-outline", type: "line", source: "indonesia", paint: { "line-color": "#fff", "line-width": 1.2 } });

            try {
                map.fitBounds(BOUNDS, { padding: 20, maxZoom: 6 });
            } catch {}

            map.on("mousemove", "indo-fill", (e) => {
                if (isTouchRef.current) return;
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
                    // Debounce state updates
                    if (hoverDebounceRef.current) clearTimeout(hoverDebounceRef.current);
                    hoverDebounceRef.current = setTimeout(() => {
                        setSelectedProvince(name);
                        // Ambil data dari file provinsi
                        const slug = name.toLowerCase().replace(/\s+/g, "-");
                        const channel = provinsiMap.get(slug);
                        if (channel) {
                            setDescription(channel.deskripsi2 ?? channel.description ?? `Provinsi ${name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia.`);
                        } else {
                            setDescription(`Provinsi ${name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia.`);
                        }
                    }, 100); // 100ms debounce
                });
            });

            map.on("click", "indo-fill", (e) => {
                const name = e.features?.[0]?.properties?.NAME_1 as string | undefined;
                if (!name) return;
                setSelectedProvince(name);
                // Ambil data dari file provinsi
                const slug = name.toLowerCase().replace(/\s+/g, "-");
                const channel = provinsiMap.get(slug);
                if (channel) {
                    setDescription(channel.deskripsi2 ?? channel.description ?? `Provinsi ${name} ...`);
                } else {
                    setDescription(`Provinsi ${name} ...`);
                }
                dialogOpenRef.current = true;
                setDialogOpen(true);
            });

            map.on("mouseleave", "indo-fill", () => {
                if (hoverFrame.current) cancelAnimationFrame(hoverFrame.current);
                hoverFrame.current = null;
                if (hoverDebounceRef.current) clearTimeout(hoverDebounceRef.current);
                hoverDebounceRef.current = null;
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
    }, [theme]);

    useEffect(() => {
        if (!mapRef.current) return;

        try {
            // Update background color
            mapRef.current.setPaintProperty("background", "background-color", theme === "dark" ? "#0f172a" : "#f8fafc");

            // Update base map opacity for both modes
            mapRef.current.setPaintProperty("base-map", "raster-opacity", theme === "dark" ? 0.32 : 0.14);

            // Update outline color for better visibility in dark mode
            mapRef.current.setPaintProperty("indo-outline", "line-color", theme === "dark" ? "#ffffff" : "#ffffff");
            mapRef.current.setPaintProperty("indo-outline", "line-width", theme === "dark" ? 1.5 : 1.2);

            // Update indo-highlight layer if it exists
            try {
                mapRef.current.setPaintProperty("indo-highlight", "fill-outline-color", theme === "dark" ? "#ffffff" : "#fff");
            } catch {}
        } catch (error) {
            console.warn("Failed to update map theme:", error);
        }
    }, [theme]);

    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                <div className="overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-white/80 p-4 shadow-[0_35px_80px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-linear-to-br dark:from-slate-900/80 dark:via-slate-900/95 dark:to-slate-900/90">
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-white sm:h-[500px] dark:bg-slate-900">
                        <div className="absolute inset-3 rounded-[26px] border border-white/70 bg-white/80 shadow-inner backdrop-blur dark:border-slate-800 dark:bg-slate-900/70" aria-hidden />
                        <div className="absolute top-3 right-4 z-10 flex flex-col gap-2 sm:top-4">
                            <div className="flex items-center gap-2">
                                <div className="relative w-full lg:w-80">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition dark:text-gray-500">
                                        <Search size={16} />
                                    </span>
                                    <Input placeholder="Cari provinsi..." inputMode="search" value={search} onChange={handleSearchChange} className={SEARCH_INPUT_CLASSES} />
                                </div>
                                <Button size="icon" className={REFRESH_BUTTON_CLASSES} aria-label="Reset Map" onClick={handleRefresh}>
                                    <RefreshCw size={18} />
                                </Button>
                            </div>
                            {hasSearchQuery && (
                                <div className="mt-2 w-72 rounded-2xl border border-slate-200 bg-white/90 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
                                    <ul className="max-h-60 overflow-y-auto">
                                        <SearchResultList entries={filteredProvinces} onSelect={handleSelectProvince} />
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div ref={mapContainer} className="h-full w-full cursor-default" />
                        {!isTouchDevice && selectedProvince && (
                            <div className="absolute bottom-3 left-4 max-w-[280px] rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-slate-800 shadow-xl backdrop-blur transition dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100">
                                <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">{selectedProvince}</h3>
                                <p className="text-[13px] text-gray-700 dark:text-gray-300">
                                    {(() => {
                                        const slug = selectedProvince.toLowerCase().replace(/\s+/g, "-");
                                        const channel = provinsiMap.get(slug);
                                        let desc = channel?.deskripsi2 ?? channel?.description ?? description ?? "";
                                        if (desc.length > 100) desc = desc.slice(0, 100) + "...";
                                        return desc;
                                    })()}
                                </p>
                                {(() => {
                                    const slug = selectedProvince.toLowerCase().replace(/\s+/g, "-");
                                    const channel = provinsiMap.get(slug);
                                    if (!channel) return null;
                                    return (
                                        <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                            {channel.bahasa && <div>Bahasa: {channel.bahasa}</div>}
                                            {channel.kuliner && <div>Kuliner: {channel.kuliner}</div>}
                                            {channel.budaya && <div>Budaya: {channel.budaya}</div>}
                                            {channel.wisata && <div>Wisata: {channel.wisata}</div>}
                                            {channel.baju_adat && <div>Baju Adat: {channel.baju_adat}</div>}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent className={DIALOG_CONTENT_CLASSES}>
                                <DialogHeader className="shrink-0 px-4 pt-6 sm:px-6">
                                    <div className="mb-3 text-left">
                                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProvince ? `Budaya ${selectedProvince}` : "Jelajahi Budaya"}</DialogTitle>
                                        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">Warisan Budaya Indonesia</p>
                                    </div>
                                </DialogHeader>

                                {/* Simplified Content */}
                                <div className="space-y-3 px-4 py-6 text-left sm:px-6">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Kamu akan menjelajahi budaya dari <span className="text-lg font-medium text-gray-900 dark:text-white">{selectedProvince || "provinsi"}</span>. Temukan cerita, bahasa, dan tradisi yang kaya.
                                    </p>
                                    {(() => {
                                        const slug = selectedProvince?.toLowerCase().replace(/\s+/g, "-");
                                        const channel = slug ? provinsiMap.get(slug) : null;
                                        if (channel?.baju_adat) {
                                            return <p className="text-sm text-blue-600 dark:text-blue-400">Baju adat khas: {channel.baju_adat}. Coba baju adat dengan foto kamu! Bisa pakai foto kucing atau hewan lucu lainnya juga loh.</p>;
                                        }
                                        return <p className="text-sm text-blue-600 dark:text-blue-400">Coba baju adat dengan foto kamu! Bisa pakai foto kucing atau hewan lucu lainnya juga loh.</p>;
                                    })()}
                                </div>

                                <DialogFooter className="mt-4 shrink-0 border-t border-slate-100/70 bg-white/90 px-4 py-4 sm:px-6 dark:border-slate-800/70 dark:bg-slate-950/90">
                                    <div className="flex w-full gap-2">
                                        <Button variant="secondary" onClick={() => setDialogOpen(false)} className="flex-1">
                                            Batal
                                        </Button>
                                        <Button onClick={() => router.push(`/jelajahi-nusantara/${selectedProvince?.toLowerCase().replace(/\s+/g, "-")}`)} className="flex-1 bg-blue-500 hover:bg-blue-600">
                                            Jelajahi Sekarang →
                                        </Button>
                                    </div>
                                </DialogFooter>
                                <DialogClose />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveMap;
