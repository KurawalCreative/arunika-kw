"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import maplibregl from "maplibre-gl";
type MapType = maplibregl.Map;
type StyleSpecification = maplibregl.StyleSpecification;
import "maplibre-gl/dist/maplibre-gl.css";
import { FeatureCollection, Feature } from "geojson";
import { getChannelBySlug } from "@/app/(page)/jelajahi-nusantara/actions";
import indonesia from "@/assets/coordinates/id.json";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Languages, Utensils, Palette, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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
    const [isPending, startTransition] = useTransition();
    const [showMoreInModal, setShowMoreInModal] = useState(false);

    // Client-side cache untuk channel by slug
    const channelCache = useRef<Map<string, any>>(new Map());

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
                    { id: "background", type: "background", paint: { "background-color": theme === "dark" ? "#1f2937" : "#ffffff" } },
                    { id: "base-map", type: "raster", source: "base-tiles", paint: { "raster-opacity": theme === "dark" ? 0.3 : 0 } },
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
                    // Ambil slug dari nama provinsi
                    const slug = name.toLowerCase().replace(/\s+/g, "-");
                    const cached = channelCache.current.get(slug);
                    if (cached) {
                        setDescription(cached.deskripsi2 ?? cached.description ?? `Provinsi ${name} ...`);
                    } else {
                        startTransition(() => {
                            getChannelBySlug(slug).then((ch) => {
                                if (ch) {
                                    channelCache.current.set(slug, ch);
                                    setDescription(ch.deskripsi2 ?? ch.description ?? `Provinsi ${name} ...`);
                                } else {
                                    setDescription(`Provinsi ${name} ...`);
                                }
                            });
                        });
                    }
                });
            });

            map.on("click", "indo-fill", (e) => {
                const name = e.features?.[0]?.properties?.NAME_1 as string | undefined;
                if (!name) return;
                setSelectedProvince(name);
                // Ambil slug dari nama provinsi
                const slug = name.toLowerCase().replace(/\s+/g, "-");
                const cached = channelCache.current.get(slug);
                if (cached) {
                    setDescription(cached.deskripsi2 ?? cached.description ?? `Provinsi ${name} ...`);
                } else {
                    startTransition(() => {
                        getChannelBySlug(slug).then((ch) => {
                            if (ch) {
                                channelCache.current.set(slug, ch);
                                setDescription(ch.deskripsi2 ?? ch.description ?? `Provinsi ${name} ...`);
                            } else {
                                setDescription(`Provinsi ${name} ...`);
                            }
                        });
                    });
                }
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
    }, [theme]);

    useEffect(() => {
        if (!mapRef.current) return;

        try {
            // Update background color
            mapRef.current.setPaintProperty("background", "background-color", theme === "dark" ? "#1f2937" : "#ffffff");

            // Update base map opacity for dark mode
            mapRef.current.setPaintProperty("base-map", "raster-opacity", theme === "dark" ? 0.3 : 0);

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
        <div className="relative flex aspect-square w-full max-w-7xl overflow-hidden rounded-xl bg-white shadow-lg sm:h-[500px] dark:bg-gray-800">
            <div className="absolute top-2 right-4 z-10 flex flex-col gap-2 sm:top-4">
                <div className="flex items-center gap-2">
                    <div className="relative w-full lg:w-80">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                            <Search size={16} />
                        </span>
                        <Input placeholder="Cari provinsi..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 text-sm lg:w-80 dark:border-gray-700 dark:bg-gray-900" />
                    </div>
                    <Button
                        variant="outline"
                        className="h-10"
                        aria-label="Reset Map"
                        onClick={() => {
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
                        }}
                    >
                        <RefreshCw size={18} />
                    </Button>
                </div>
                {/* Dropdown hasil pencarian provinsi */}
                {search.length > 0 && (
                    <div className="mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <ul className="max-h-60 overflow-y-auto">
                            {(() => {
                                // Ambil daftar provinsi dari geojson
                                const provinceFeatures = ((indonesia as FeatureCollection).features || []).map((f) => {
                                    const props = (f.properties || {}) as Record<string, unknown>;
                                    return {
                                        name: (props["province_bps_name"] as string) || "Tidak Dikenal",
                                        feature: f,
                                    };
                                });
                                const filteredProvinces = search.length > 0 ? provinceFeatures.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : [];
                                if (filteredProvinces.length === 0) {
                                    return <li className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">Tidak ditemukan</li>;
                                }
                                return filteredProvinces.map(({ name, feature }) => (
                                    <li
                                        key={name}
                                        className="cursor-pointer px-4 py-2 text-sm text-gray-900 hover:bg-orange-50 dark:text-gray-100 dark:hover:bg-orange-900/30"
                                        onMouseDown={() => {
                                            setSelectedProvince(name);
                                            setDescription(`Provinsi ${name} memiliki kekayaan budaya, bahasa, dan tradisi khas Indonesia.`);
                                            setSearch("");
                                            // Zoom ke provinsi di map
                                            if (mapRef.current) {
                                                let allCoords: [number, number][] = [];
                                                if (feature.geometry.type === "Polygon") {
                                                    allCoords = feature.geometry.coordinates[0] as [number, number][];
                                                } else if (feature.geometry.type === "MultiPolygon") {
                                                    (feature.geometry.coordinates as unknown as [number, number][][]).forEach((poly) => {
                                                        allCoords = allCoords.concat(poly[0]);
                                                    });
                                                }
                                                if (allCoords.length > 0) {
                                                    let minX = allCoords[0][0],
                                                        minY = allCoords[0][1],
                                                        maxX = allCoords[0][0],
                                                        maxY = allCoords[0][1];
                                                    allCoords.forEach(([x, y]) => {
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
                                                        { padding: 20, maxZoom: 7 },
                                                    );
                                                    mapRef.current.setFilter("indo-highlight", ["==", "NAME_1", name]);
                                                }
                                            }
                                        }}
                                    >
                                        {name}
                                    </li>
                                ));
                            })()}
                        </ul>
                    </div>
                )}
            </div>

            <div ref={mapContainer} className="h-full w-full cursor-default bg-gray-100 dark:bg-gray-800" />

            {selectedProvince && (
                <div className="absolute bottom-0.5 left-0.5 max-w-[250px] rounded-lg bg-white/90 p-3 text-sm shadow-sm backdrop-blur-sm sm:max-w-[300px] dark:bg-gray-800/90">
                    <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">{selectedProvince}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
                        {(() => {
                            if (isPending) return "Memuat...";
                            const slug = selectedProvince.toLowerCase().replace(/\s+/g, "-");
                            const channel = channelCache.current.get(slug);
                            let desc = channel?.deskripsi2 ?? channel?.description ?? description ?? "";
                            if (desc.length > 100) desc = desc.slice(0, 100) + "...";
                            return desc;
                        })()}
                    </p>
                    {(() => {
                        const slug = selectedProvince.toLowerCase().replace(/\s+/g, "-");
                        const channel = channelCache.current.get(slug);
                        if (!channel) return null;
                        return (
                            <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                {channel.bahasa && <div>Bahasa: {channel.bahasa}</div>}
                                {channel.kuliner && <div>Kuliner: {channel.kuliner}</div>}
                                {channel.budaya && <div>Budaya: {channel.budaya}</div>}
                                {channel.wisata && <div>Wisata: {channel.wisata}</div>}
                            </div>
                        );
                    })()}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col bg-white dark:bg-gray-900">
                    <DialogHeader className="shrink-0">
                        <div className="mb-4 flex items-center justify-center gap-4">
                            <div className="rounded-full bg-linear-to-br from-orange-400 via-pink-500 to-red-500 p-4 text-4xl text-white shadow-lg dark:from-orange-500 dark:via-pink-600 dark:to-red-600">🌴</div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProvince ? `Budaya ${selectedProvince}` : "Jelajahi Budaya"}</DialogTitle>
                                <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">Warisan Budaya Indonesia</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-0">
                        {(() => {
                            const slug = selectedProvince ? selectedProvince.toLowerCase().replace(/\s+/g, "-") : "";
                            const channel = slug ? channelCache.current.get(slug) : null;
                            if (!channel) {
                                return (
                                    <div className="py-6 text-center">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Kamu akan menjelajahi budaya dari <span className="text-lg font-medium text-gray-900 dark:text-white">{selectedProvince || "provinsi"}</span>. Temukan cerita, bahasa, dan tradisi yang kaya.
                                        </p>
                                    </div>
                                );
                            }

                            const fullDesc = channel.deskripsi2 ?? channel.description ?? "Tidak ada deskripsi.";
                            const shortDesc = fullDesc.length > 250 ? fullDesc.slice(0, 250) + "..." : fullDesc;

                            return (
                                <div className="space-y-4 px-6">
                                    {/* Deskripsi */}
                                    <div className="rounded-lg border border-orange-200 bg-linear-to-r from-orange-50 to-pink-50 p-4 dark:border-orange-900 dark:from-gray-800 dark:to-gray-900">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{channel.name}</h3>
                                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{showMoreInModal ? fullDesc : shortDesc}</p>
                                        {fullDesc.length > 250 && (
                                            <button className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300" type="button" onClick={() => setShowMoreInModal((v) => !v)}>
                                                {showMoreInModal ? "Sembunyikan" : "Selengkapnya"}
                                                {showMoreInModal ? "↑" : "↓"}
                                            </button>
                                        )}
                                    </div>

                                    {/* Detail Budaya */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {channel.bahasa && (
                                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Languages size={18} className="text-blue-600 dark:text-blue-400" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Bahasa</span>
                                                </div>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">{channel.bahasa}</p>
                                            </div>
                                        )}
                                        {channel.kuliner && (
                                            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Utensils size={18} className="text-green-600 dark:text-green-400" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Kuliner</span>
                                                </div>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">{channel.kuliner}</p>
                                            </div>
                                        )}
                                        {channel.budaya && (
                                            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Palette size={18} className="text-purple-600 dark:text-purple-400" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Budaya</span>
                                                </div>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">{channel.budaya}</p>
                                            </div>
                                        )}
                                        {channel.wisata && (
                                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <MapPin size={18} className="text-amber-600 dark:text-amber-400" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Wisata</span>
                                                </div>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">{channel.wisata}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    <DialogFooter className="mt-4 shrink-0">
                        <div className="flex w-full gap-2">
                            <Button variant="secondary" onClick={() => setDialogOpen(false)} className="flex-1">
                                Batal
                            </Button>
                            <Button onClick={() => router.push(`/jelajahi-nusantara/${selectedProvince?.toLowerCase().replace(/\s+/g, "-")}`)} className="flex-1 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                                Jelajahi Sekarang →
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
