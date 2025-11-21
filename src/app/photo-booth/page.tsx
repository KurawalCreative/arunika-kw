"use client";

import { useRef, useState, useCallback, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Camera, Download, Palette, Frame, Undo, Redo } from "lucide-react";
import { ReactPhotoEditor, usePhotoEditor } from "react-photo-editor";
import NavbarArunika from "@/components/navbar";

interface Filter {
    name: string;
    css: string;
}

const filters: Filter[] = [
    { name: "Normal", css: "none" },
    { name: "Vintage", css: "sepia(0.3) contrast(1.1) brightness(1.1)" },
    { name: "BW", css: "grayscale(1)" },
    { name: "Cool", css: "hue-rotate(180deg) saturate(1.2)" },
    { name: "Warm", css: "hue-rotate(30deg) saturate(1.3)" },
    { name: "Dramatic", css: "contrast(1.5) brightness(0.8)" },
];

const frames = [
    { name: "None", src: null },
    { name: "Classic", src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI5MCIgaGVpZ2h0PSI5MCIgeD0iNSIgeT0iNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==" },
    { name: "Rounded", src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgeD0iMTAiIHk9IjEwIiByeD0iMTAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSI1IiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==" },
    {
        name: "Polaroid",
        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgeD0iMTUiIHk9IjE1IiByeD0iNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgeD0iMTUiIHk9IjE1IiByeD0iNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIzNSIgeT0iNzUiIGZpbGw9IiMwMDAiLz4KPC9zdmc+",
    },
];

const stickers = ["😀", "😂", "🥰", "😍", "🤗", "😎", "🤔", "😮", "🙄", "😴", "❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "🌟", "✨", "💫", "⭐", "🌙", "☀️", "🌈", "🌸", "🌺", "🌻", "🎉", "🎊", "🎈", "🎁", "🎂", "🎃", "🎄", "🎅", "🎆", "🎇"];

function PhotoEditorModal({ file, onSave, onClose }: { file: File; onSave: (file: File) => void; onClose: () => void }) {
    const { canvasRef, brightness, contrast, saturate, grayscale, rotate, zoom, flipHorizontal, flipVertical, mode, lineColor, lineWidth, setBrightness, setContrast, setSaturate, setGrayscale, setRotate, setZoom, setFlipHorizontal, setFlipVertical, setMode, setLineColor, setLineWidth, handleZoomIn, handleZoomOut, resetFilters, generateEditedFile, handlePointerDown, handlePointerUp, handlePointerMove, handleWheel } =
        usePhotoEditor({
            file,
            defaultBrightness: 100,
            defaultContrast: 100,
            defaultSaturate: 100,
            defaultGrayscale: 0,
            defaultRotate: 0,
            defaultZoom: 1,
            defaultFlipHorizontal: false,
            defaultFlipVertical: false,
            defaultMode: "pan",
            defaultLineColor: "#000000",
            defaultLineWidth: 2,
        });

    const [textOverlays, setTextOverlays] = useState<Array<{ id: string; text: string; x: number; y: number; fontSize: number; color: string; fontFamily: string }>>([]);
    const [stickerOverlays, setStickerOverlays] = useState<Array<{ id: string; emoji: string; x: number; y: number; size: number }>>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
    const [newText, setNewText] = useState("");
    const [textColor, setTextColor] = useState("#000000");
    const [textSize, setTextSize] = useState(24);
    const [textFont, setTextFont] = useState("Arial");

    const handleSave = async () => {
        const editedFile = await generateEditedFile();
        if (editedFile) {
            onSave(editedFile);
        }
    };

    const addText = () => {
        if (newText.trim()) {
            const newTextOverlay = {
                id: Date.now().toString(),
                text: newText,
                x: 50,
                y: 50,
                fontSize: textSize,
                color: textColor,
                fontFamily: textFont,
            };
            setTextOverlays([...textOverlays, newTextOverlay]);
            setNewText("");
            // setMode('text'); // Remove this line as mode only accepts 'pan' or 'draw'
        }
    };

    const addSticker = (emoji: string) => {
        const newStickerOverlay = {
            id: Date.now().toString(),
            emoji,
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 50,
            size: 32,
        };
        setStickerOverlays([...stickerOverlays, newStickerOverlay]);
        // setMode('sticker'); // Remove this line as mode only accepts 'pan' or 'draw'
    };

    const removeText = (id: string) => {
        setTextOverlays(textOverlays.filter((t) => t.id !== id));
        if (selectedTextId === id) {
            setSelectedTextId(null);
        }
    };

    const removeSticker = (id: string) => {
        setStickerOverlays(stickerOverlays.filter((s) => s.id !== id));
        if (selectedStickerId === id) {
            setSelectedStickerId(null);
        }
    };

    const updateTextPosition = (id: string, x: number, y: number) => {
        setTextOverlays(textOverlays.map((t) => (t.id === id ? { ...t, x, y } : t)));
    };

    const updateStickerPosition = (id: string, x: number, y: number) => {
        setStickerOverlays(stickerOverlays.map((s) => (s.id === id ? { ...s, x, y } : s)));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white">
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold">Photo Editor</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        ✕
                    </Button>
                </div>

                <div className="flex h-[70vh]">
                    {/* Canvas Area */}
                    <div className="relative flex flex-1 items-center justify-center bg-gray-50 p-4">
                        <canvas ref={canvasRef} className="max-h-full max-w-full rounded border shadow-lg" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} onWheel={handleWheel} />

                        {/* Text Overlays */}
                        {textOverlays.map((textOverlay) => (
                            <div
                                key={textOverlay.id}
                                className={`absolute cursor-move select-none ${selectedTextId === textOverlay.id ? "ring-2 ring-blue-500" : ""}`}
                                style={{
                                    left: textOverlay.x,
                                    top: textOverlay.y,
                                    fontSize: textOverlay.fontSize,
                                    color: textOverlay.color,
                                    fontFamily: textOverlay.fontFamily,
                                    zIndex: 10,
                                }}
                                onClick={() => setSelectedTextId(textOverlay.id)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const startX = e.clientX - textOverlay.x;
                                    const startY = e.clientY - textOverlay.y;

                                    const handleMouseMove = (e: MouseEvent) => {
                                        updateTextPosition(textOverlay.id, e.clientX - startX, e.clientY - startY);
                                    };

                                    const handleMouseUp = () => {
                                        document.removeEventListener("mousemove", handleMouseMove);
                                        document.removeEventListener("mouseup", handleMouseUp);
                                    };

                                    document.addEventListener("mousemove", handleMouseMove);
                                    document.addEventListener("mouseup", handleMouseUp);
                                }}
                            >
                                {textOverlay.text}
                                {selectedTextId === textOverlay.id && (
                                    <button
                                        className="ml-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeText(textOverlay.id);
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Sticker Overlays */}
                        {stickerOverlays.map((stickerOverlay) => (
                            <div
                                key={stickerOverlay.id}
                                className={`absolute cursor-move select-none ${selectedStickerId === stickerOverlay.id ? "ring-2 ring-green-500" : ""}`}
                                style={{
                                    left: stickerOverlay.x,
                                    top: stickerOverlay.y,
                                    fontSize: stickerOverlay.size,
                                    zIndex: 10,
                                }}
                                onClick={() => setSelectedStickerId(stickerOverlay.id)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const startX = e.clientX - stickerOverlay.x;
                                    const startY = e.clientY - stickerOverlay.y;

                                    const handleMouseMove = (e: MouseEvent) => {
                                        updateStickerPosition(stickerOverlay.id, e.clientX - startX, e.clientY - startY);
                                    };

                                    const handleMouseUp = () => {
                                        document.removeEventListener("mousemove", handleMouseMove);
                                        document.removeEventListener("mouseup", handleMouseUp);
                                    };

                                    document.addEventListener("mousemove", handleMouseMove);
                                    document.addEventListener("mouseup", handleMouseUp);
                                }}
                            >
                                {stickerOverlay.emoji}
                                {selectedStickerId === stickerOverlay.id && (
                                    <button
                                        className="ml-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSticker(stickerOverlay.id);
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Controls Sidebar */}
                    <div className="w-80 overflow-y-auto border-l p-4">
                        <Tabs defaultValue="adjustments" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="adjustments">Adjust</TabsTrigger>
                                <TabsTrigger value="text">Text</TabsTrigger>
                                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                            </TabsList>

                            <TabsContent value="adjustments" className="space-y-4">
                                <div>
                                    <Label>Brightness: {brightness}</Label>
                                    <Slider value={[brightness]} onValueChange={(value) => setBrightness(value[0])} min={0} max={200} step={1} className="mt-2" />
                                </div>

                                <div>
                                    <Label>Contrast: {contrast}</Label>
                                    <Slider value={[contrast]} onValueChange={(value) => setContrast(value[0])} min={0} max={200} step={1} className="mt-2" />
                                </div>

                                <div>
                                    <Label>Saturation: {saturate}</Label>
                                    <Slider value={[saturate]} onValueChange={(value) => setSaturate(value[0])} min={0} max={200} step={1} className="mt-2" />
                                </div>

                                <div>
                                    <Label>Grayscale: {grayscale}</Label>
                                    <Slider value={[grayscale]} onValueChange={(value) => setGrayscale(value[0])} min={0} max={100} step={1} className="mt-2" />
                                </div>

                                <Separator />

                                <div>
                                    <Label>Rotation: {rotate}°</Label>
                                    <Slider value={[rotate]} onValueChange={(value) => setRotate(value[0])} min={-180} max={180} step={1} className="mt-2" />
                                </div>

                                <div className="flex gap-2">
                                    <Button variant={flipHorizontal ? "default" : "outline"} size="sm" onClick={() => setFlipHorizontal(!flipHorizontal)}>
                                        Flip H
                                    </Button>
                                    <Button variant={flipVertical ? "default" : "outline"} size="sm" onClick={() => setFlipVertical(!flipVertical)}>
                                        Flip V
                                    </Button>
                                </div>

                                <Separator />

                                <div>
                                    <Label>Zoom: {Math.round(zoom * 100)}%</Label>
                                    <Slider value={[zoom]} onValueChange={(value) => setZoom(value[0])} min={0.1} max={3} step={0.1} className="mt-2" />
                                </div>

                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleZoomIn}>
                                        Zoom In
                                    </Button>
                                    <Button size="sm" onClick={handleZoomOut}>
                                        Zoom Out
                                    </Button>
                                </div>

                                <Separator />

                                <div>
                                    <Label>Drawing Mode</Label>
                                    <div className="mt-2 flex gap-2">
                                        <Button variant={mode === "pan" ? "default" : "outline"} size="sm" onClick={() => setMode("pan")}>
                                            Pan
                                        </Button>
                                        <Button variant={mode === "draw" ? "default" : "outline"} size="sm" onClick={() => setMode("draw")}>
                                            Draw
                                        </Button>
                                    </div>
                                </div>

                                {mode === "draw" && (
                                    <>
                                        <div>
                                            <Label>Line Color</Label>
                                            <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="mt-2 h-10 w-full rounded border" />
                                        </div>

                                        <div>
                                            <Label>Line Width: {lineWidth}px</Label>
                                            <Slider value={[lineWidth]} onValueChange={(value) => setLineWidth(value[0])} min={1} max={20} step={1} className="mt-2" />
                                        </div>
                                    </>
                                )}

                                <Button onClick={resetFilters} variant="outline" className="w-full">
                                    Reset All
                                </Button>
                            </TabsContent>

                            <TabsContent value="text" className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label>Text</Label>
                                        <Input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Enter text..." className="mt-2" />
                                    </div>

                                    <div>
                                        <Label>Font Size</Label>
                                        <Slider value={[textSize]} onValueChange={(value) => setTextSize(value[0])} min={12} max={72} step={2} className="mt-2" />
                                        <span className="text-sm text-gray-500">{textSize}px</span>
                                    </div>

                                    <div>
                                        <Label>Text Color</Label>
                                        <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="mt-2 h-10 w-full rounded border" />
                                    </div>

                                    <div>
                                        <Label>Font Family</Label>
                                        <select value={textFont} onChange={(e) => setTextFont(e.target.value)} className="mt-2 w-full rounded border p-2">
                                            <option value="Arial">Arial</option>
                                            <option value="Helvetica">Helvetica</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Courier New">Courier New</option>
                                            <option value="Georgia">Georgia</option>
                                            <option value="Verdana">Verdana</option>
                                            <option value="Impact">Impact</option>
                                            <option value="Comic Sans MS">Comic Sans MS</option>
                                        </select>
                                    </div>

                                    <Button onClick={addText} className="w-full" disabled={!newText.trim()}>
                                        Add Text
                                    </Button>

                                    {textOverlays.length > 0 && (
                                        <div className="space-y-2">
                                            <Label>Text Overlays ({textOverlays.length})</Label>
                                            <ScrollArea className="h-32">
                                                {textOverlays.map((text) => (
                                                    <div key={text.id} className="flex items-center justify-between rounded border p-2">
                                                        <span className="flex-1 truncate text-sm">{text.text}</span>
                                                        <Button size="sm" variant="outline" onClick={() => removeText(text.id)}>
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="stickers" className="space-y-4">
                                <ScrollArea className="h-64">
                                    <div className="grid grid-cols-6 gap-2">
                                        {stickers.map((sticker) => (
                                            <Button key={sticker} variant="outline" size="sm" className="h-12 text-2xl hover:bg-blue-50" onClick={() => addSticker(sticker)}>
                                                {sticker}
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>

                                {stickerOverlays.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Sticker Overlays ({stickerOverlays.length})</Label>
                                        <ScrollArea className="h-32">
                                            {stickerOverlays.map((sticker) => (
                                                <div key={sticker.id} className="flex items-center justify-between rounded border p-2">
                                                    <span className="text-2xl">{sticker.emoji}</span>
                                                    <Button size="sm" variant="outline" onClick={() => removeSticker(sticker.id)}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                )}

                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
                                    <p className="mb-2 text-gray-500">Click emoji to add stickers</p>
                                    <p className="text-sm text-gray-400">Drag stickers to reposition them</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t p-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}

export default function PhotoBoothPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const customElementInputRef = useRef<HTMLInputElement>(null);

    const [photo, setPhoto] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<Filter>(filters[0]);
    const [selectedFrame, setSelectedFrame] = useState(frames[0]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Custom elements for camera overlay
    const [customElements, setCustomElements] = useState<Array<{ id: string; src: string; x: number; y: number; width: number; height: number; rotation: number }>>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }, []);

    const takePhoto = useCallback(async () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (ctx) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;

                // Draw video frame
                ctx.drawImage(videoRef.current, 0, 0);

                // Draw custom elements
                if (customElements.length > 0) {
                    const loadImage = (src: string): Promise<HTMLImageElement> => {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            img.onload = () => resolve(img);
                            img.onerror = reject;
                            img.src = src;
                        });
                    };

                    try {
                        // Load all images first
                        const imagePromises = customElements.map((element) => loadImage(element.src));
                        const images = await Promise.all(imagePromises);

                        // Draw all images
                        customElements.forEach((element, index) => {
                            const img = images[index];
                            ctx.save();
                            ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
                            ctx.rotate((element.rotation * Math.PI) / 180);
                            ctx.drawImage(img, -element.width / 2, -element.height / 2, element.width, element.height);
                            ctx.restore();
                        });
                    } catch (error) {
                        console.error("Error loading custom element images:", error);
                    }
                }

                const dataUrl = canvas.toDataURL("image/png");
                setPhoto(dataUrl);
                saveToHistory(dataUrl);
                setIsStreaming(false);
                if (videoRef.current?.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach((track) => track.stop());
                }
            }
        }
    }, [customElements]);

    const uploadPhoto = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                setPhoto(dataUrl);
                saveToHistory(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const uploadCustomElement = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    const newElement = {
                        id: Date.now().toString(),
                        src: dataUrl,
                        x: Math.random() * 200 + 50, // Random position
                        y: Math.random() * 150 + 50,
                        width: 100,
                        height: 100,
                        rotation: 0,
                    };
                    setCustomElements([...customElements, newElement]);
                };
                reader.readAsDataURL(file);
            }
        },
        [customElements],
    );

    const updateElementPosition = useCallback((id: string, x: number, y: number) => {
        setCustomElements((elements) => elements.map((el) => (el.id === id ? { ...el, x, y } : el)));
    }, []);

    const removeCustomElement = useCallback(
        (id: string) => {
            setCustomElements((elements) => elements.filter((el) => el.id !== id));
            if (selectedElementId === id) {
                setSelectedElementId(null);
            }
        },
        [selectedElementId],
    );

    const updateElementSize = useCallback((id: string, width: number, height: number) => {
        setCustomElements((elements) => elements.map((el) => (el.id === id ? { ...el, width: Math.max(50, width), height: Math.max(50, height) } : el)));
    }, []);

    const updateElementRotation = useCallback((id: string, rotation: number) => {
        setCustomElements((elements) => elements.map((el) => (el.id === id ? { ...el, rotation } : el)));
    }, []);

    const saveToHistory = useCallback(
        (dataUrl: string) => {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(dataUrl);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        },
        [history, historyIndex],
    );

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setPhoto(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setPhoto(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);

    const handleSaveImage = useCallback((editedFile: File) => {
        // Convert File to data URL for display
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPhoto(dataUrl);
            saveToHistory(dataUrl);
        };
        reader.readAsDataURL(editedFile);
        setShowEditor(false);
    }, []);

    const exportImage = useCallback(() => {
        if (photo) {
            const link = document.createElement("a");
            link.download = `photo-booth-${Date.now()}.png`;
            link.href = photo;
            link.click();
        }
    }, [photo]);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <NavbarArunika />
            </Suspense>
            <div className="container mx-auto mt-24 max-w-7xl p-4">
                <div className="mb-6">
                    <h1 className="mb-2 text-3xl font-bold">Photo Booth</h1>
                    <p className="text-muted-foreground">Create amazing photos with professional editing tools</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Camera/Photo Preview */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    Camera Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!photo ? (
                                    <div className="relative space-y-4">
                                        <div className="relative">
                                            <video ref={videoRef} autoPlay className="h-96 w-full rounded-lg bg-black object-cover" style={{ filter: selectedFilter.css }} />

                                            {/* Custom Elements Overlay */}
                                            {customElements.map((element) => (
                                                <div
                                                    key={element.id}
                                                    className={`group absolute cursor-move select-none ${selectedElementId === element.id ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                                                    style={{
                                                        left: element.x,
                                                        top: element.y,
                                                        width: element.width,
                                                        height: element.height,
                                                        transform: `rotate(${element.rotation}deg)`,
                                                        zIndex: selectedElementId === element.id ? 20 : 10,
                                                    }}
                                                    onClick={() => setSelectedElementId(element.id)}
                                                    onMouseDown={(e) => {
                                                        if (e.target !== e.currentTarget) return; // Don't drag if clicking on controls
                                                        e.preventDefault();
                                                        const startX = e.clientX - element.x;
                                                        const startY = e.clientY - element.y;

                                                        const handleMouseMove = (e: MouseEvent) => {
                                                            const newX = e.clientX - startX;
                                                            const newY = e.clientY - startY;
                                                            updateElementPosition(element.id, newX, newY);
                                                        };

                                                        const handleMouseUp = () => {
                                                            document.removeEventListener("mousemove", handleMouseMove);
                                                            document.removeEventListener("mouseup", handleMouseUp);
                                                        };

                                                        document.addEventListener("mousemove", handleMouseMove);
                                                        document.addEventListener("mouseup", handleMouseUp);
                                                    }}
                                                >
                                                    <img src={element.src} alt="Custom element" className="h-full w-full rounded-sm object-contain shadow-sm" draggable={false} />

                                                    {/* Selection Controls */}
                                                    {selectedElementId === element.id && (
                                                        <>
                                                            {/* Corner Resize Handles */}
                                                            <div
                                                                className="absolute -top-1 -left-1 h-3 w-3 cursor-nw-resize rounded-full bg-blue-500 opacity-80 hover:opacity-100"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    const startX = e.clientX;
                                                                    const startY = e.clientY;
                                                                    const startWidth = element.width;
                                                                    const startHeight = element.height;

                                                                    const handleMouseMove = (e: MouseEvent) => {
                                                                        const deltaX = startX - e.clientX;
                                                                        const deltaY = startY - e.clientY;
                                                                        const newWidth = startWidth + deltaX;
                                                                        const newHeight = startHeight + deltaY;
                                                                        updateElementSize(element.id, newWidth, newHeight);
                                                                        updateElementPosition(element.id, element.x + deltaX, element.y + deltaY);
                                                                    };

                                                                    const handleMouseUp = () => {
                                                                        document.removeEventListener("mousemove", handleMouseMove);
                                                                        document.removeEventListener("mouseup", handleMouseUp);
                                                                    };

                                                                    document.addEventListener("mousemove", handleMouseMove);
                                                                    document.addEventListener("mouseup", handleMouseUp);
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="absolute -top-1 -right-1 h-3 w-3 cursor-ne-resize rounded-full bg-blue-500 opacity-80 hover:opacity-100"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    const startX = e.clientX;
                                                                    const startY = e.clientY;
                                                                    const startWidth = element.width;
                                                                    const startHeight = element.height;

                                                                    const handleMouseMove = (e: MouseEvent) => {
                                                                        const deltaX = e.clientX - startX;
                                                                        const deltaY = startY - e.clientY;
                                                                        const newWidth = startWidth + deltaX;
                                                                        const newHeight = startHeight + deltaY;
                                                                        updateElementSize(element.id, newWidth, newHeight);
                                                                        updateElementPosition(element.id, element.x, element.y + deltaY);
                                                                    };

                                                                    const handleMouseUp = () => {
                                                                        document.removeEventListener("mousemove", handleMouseMove);
                                                                        document.removeEventListener("mouseup", handleMouseUp);
                                                                    };

                                                                    document.addEventListener("mousemove", handleMouseMove);
                                                                    document.addEventListener("mouseup", handleMouseUp);
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize rounded-full bg-blue-500 opacity-80 hover:opacity-100"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    const startX = e.clientX;
                                                                    const startY = e.clientY;
                                                                    const startWidth = element.width;
                                                                    const startHeight = element.height;

                                                                    const handleMouseMove = (e: MouseEvent) => {
                                                                        const deltaX = startX - e.clientX;
                                                                        const deltaY = e.clientY - startY;
                                                                        const newWidth = startWidth + deltaX;
                                                                        const newHeight = startHeight + deltaY;
                                                                        updateElementSize(element.id, newWidth, newHeight);
                                                                        updateElementPosition(element.id, element.x + deltaX, element.y);
                                                                    };

                                                                    const handleMouseUp = () => {
                                                                        document.removeEventListener("mousemove", handleMouseMove);
                                                                        document.removeEventListener("mouseup", handleMouseUp);
                                                                    };

                                                                    document.addEventListener("mousemove", handleMouseMove);
                                                                    document.addEventListener("mouseup", handleMouseUp);
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="absolute -right-1 -bottom-1 h-3 w-3 cursor-se-resize rounded-full bg-blue-500 opacity-80 hover:opacity-100"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    const startX = e.clientX;
                                                                    const startY = e.clientY;
                                                                    const startWidth = element.width;
                                                                    const startHeight = element.height;

                                                                    const handleMouseMove = (e: MouseEvent) => {
                                                                        const deltaX = e.clientX - startX;
                                                                        const deltaY = e.clientY - startY;
                                                                        const newWidth = startWidth + deltaX;
                                                                        const newHeight = startHeight + deltaY;
                                                                        updateElementSize(element.id, newWidth, newHeight);
                                                                    };

                                                                    const handleMouseUp = () => {
                                                                        document.removeEventListener("mousemove", handleMouseMove);
                                                                        document.removeEventListener("mouseup", handleMouseUp);
                                                                    };

                                                                    document.addEventListener("mousemove", handleMouseMove);
                                                                    document.addEventListener("mouseup", handleMouseUp);
                                                                }}
                                                            ></div>

                                                            {/* Rotation Handle */}
                                                            <div
                                                                className="absolute -top-6 left-1/2 flex h-4 w-4 -translate-x-1/2 transform cursor-grab items-center justify-center rounded-full bg-green-500 opacity-80 hover:opacity-100"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    const centerX = element.x + element.width / 2;
                                                                    const centerY = element.y + element.height / 2;
                                                                    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                                                                    const startRotation = element.rotation;

                                                                    const handleMouseMove = (e: MouseEvent) => {
                                                                        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                                                                        const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);
                                                                        const newRotation = startRotation + deltaAngle;
                                                                        updateElementRotation(element.id, newRotation);
                                                                    };

                                                                    const handleMouseUp = () => {
                                                                        document.removeEventListener("mousemove", handleMouseMove);
                                                                        document.removeEventListener("mouseup", handleMouseUp);
                                                                    };

                                                                    document.addEventListener("mousemove", handleMouseMove);
                                                                    document.addEventListener("mouseup", handleMouseUp);
                                                                }}
                                                                title="Rotate element"
                                                            >
                                                                <span className="text-xs text-white">↻</span>
                                                            </div>

                                                            {/* Delete Button */}
                                                            <button
                                                                className="absolute -top-6 -right-6 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg hover:bg-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeCustomElement(element.id);
                                                                }}
                                                                title="Remove element"
                                                            >
                                                                ×
                                                            </button>

                                                            {/* Element Info */}
                                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform rounded bg-black/75 px-2 py-1 text-xs whitespace-nowrap text-white">
                                                                {Math.round(element.width)}×{Math.round(element.height)} • {Math.round(element.rotation)}°
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={startCamera} disabled={isStreaming} className="flex-1">
                                                {isStreaming ? "Camera Active" : "Start Camera"}
                                            </Button>
                                            <Button onClick={takePhoto} disabled={!isStreaming} variant="secondary">
                                                Take Photo
                                            </Button>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-muted-foreground mb-2 text-sm">or</p>
                                            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                                                Upload Photo
                                            </Button>
                                            <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <img src={photo} alt="Captured photo" className="h-96 w-full rounded-lg border bg-white object-contain" />
                                        <div className="flex gap-2">
                                            <Button onClick={() => setPhoto(null)} variant="outline">
                                                Retake
                                            </Button>
                                            <Button onClick={() => setShowEditor(true)} className="flex-1">
                                                Edit Photo
                                            </Button>
                                            <Button onClick={undo} disabled={historyIndex <= 0}>
                                                <Undo className="h-4 w-4" />
                                            </Button>
                                            <Button onClick={redo} disabled={historyIndex >= history.length - 1}>
                                                <Redo className="h-4 w-4" />
                                            </Button>
                                            <Button onClick={exportImage} className="ml-auto">
                                                <Download className="mr-2 h-4 w-4" />
                                                Export
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editing Tools */}
                    <div className="space-y-4">
                        <Tabs defaultValue="filters" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="filters" className="text-xs">
                                    <Palette className="mr-1 h-4 w-4" />
                                    Filters
                                </TabsTrigger>
                                <TabsTrigger value="elements" className="text-xs">
                                    🎭 Elements
                                </TabsTrigger>
                                <TabsTrigger value="frames" className="text-xs">
                                    <Frame className="mr-1 h-4 w-4" />
                                    Frames
                                </TabsTrigger>
                                <TabsTrigger value="help" className="text-xs">
                                    Help
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="filters" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Photo Filters</CardTitle>
                                        <p className="text-muted-foreground text-sm">Apply filters to your camera preview</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2">
                                            {filters.map((filter) => (
                                                <Button key={filter.name} variant={selectedFilter.name === filter.name ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter(filter)} className="h-12">
                                                    {filter.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="elements" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Custom Elements</CardTitle>
                                        <p className="text-muted-foreground text-sm">Upload and drag elements on camera</p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Quick Add Elements</Label>
                                            <div className="grid grid-cols-6 gap-1">
                                                {["🎉", "🎂", "🎈", "⭐", "🌟", "✨", "💫", "🎊", "🎁", "🎀", "🎭", "🎨"].map((emoji) => (
                                                    <Button
                                                        key={emoji}
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 text-lg hover:bg-blue-50"
                                                        onClick={() => {
                                                            const newElement = {
                                                                id: Date.now().toString(),
                                                                src: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="50" y="50" font-size="60" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`)}`,
                                                                x: Math.random() * 200 + 50,
                                                                y: Math.random() * 150 + 50,
                                                                width: 80,
                                                                height: 80,
                                                                rotation: 0,
                                                            };
                                                            setCustomElements([...customElements, newElement]);
                                                        }}
                                                        title={`Add ${emoji}`}
                                                    >
                                                        {emoji}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        <Button variant="outline" onClick={() => customElementInputRef.current?.click()} className="w-full">
                                            📤 Upload Custom Element
                                        </Button>
                                        <input ref={customElementInputRef} type="file" accept="image/*" onChange={uploadCustomElement} className="hidden" />

                                        {customElements.length > 0 && (
                                            <div className="space-y-2">
                                                <Label>Active Elements ({customElements.length})</Label>
                                                <ScrollArea className="h-32">
                                                    {customElements.map((element) => (
                                                        <div key={element.id} className="flex items-center justify-between rounded border p-2">
                                                            <div className="flex min-w-0 flex-1 items-center">
                                                                <img src={element.src} alt="Custom element" className="mr-2 h-8 w-8 shrink-0 rounded object-cover" />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-muted-foreground truncate text-xs">
                                                                        {Math.round(element.width)}×{Math.round(element.height)}
                                                                    </p>
                                                                    <p className="text-muted-foreground text-xs">{Math.round(element.rotation)}°</p>
                                                                </div>
                                                            </div>
                                                            <div className="ml-2 flex gap-1">
                                                                <Button size="sm" variant="ghost" onClick={() => setSelectedElementId(element.id)} title="Select element">
                                                                    🎯
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => {
                                                                        const duplicate = {
                                                                            ...element,
                                                                            id: Date.now().toString(),
                                                                            x: element.x + 20,
                                                                            y: element.y + 20,
                                                                        };
                                                                        setCustomElements([...customElements, duplicate]);
                                                                    }}
                                                                    title="Duplicate element"
                                                                >
                                                                    📋
                                                                </Button>
                                                                <Button size="sm" variant="ghost" onClick={() => updateElementRotation(element.id, 0)} title="Reset rotation">
                                                                    ↻
                                                                </Button>
                                                                <Button size="sm" variant="outline" onClick={() => removeCustomElement(element.id)} title="Remove element">
                                                                    ×
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ScrollArea>

                                                {customElements.length > 0 && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => setCustomElements([])} className="flex-1">
                                                            Clear All
                                                        </Button>
                                                        <Button size="sm" variant="outline" onClick={() => setSelectedElementId(null)}>
                                                            Deselect
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
                                            <p className="mb-2 text-gray-500">Upload PNG, JPG, or GIF files</p>
                                            <p className="text-sm text-gray-400">Elements will appear on camera preview</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="frames" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Photo Frames</CardTitle>
                                        <p className="text-muted-foreground text-sm">Frames will be applied in the editor</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            {frames.map((frame) => (
                                                <Button key={frame.name} variant={selectedFrame.name === frame.name ? "default" : "outline"} onClick={() => setSelectedFrame(frame)} className="flex h-20 flex-col items-center justify-center">
                                                    {frame.src ? <img src={frame.src} alt={frame.name} className="mb-1 h-12 w-12" /> : <div className="border-muted-foreground mb-1 h-12 w-12 rounded border-2 border-dashed" />}
                                                    <span className="text-xs">{frame.name}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="help" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">How to Use</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div>
                                            <h4 className="mb-1 font-medium">🎨 Color Adjustments</h4>
                                            <p className="text-muted-foreground">Adjust brightness, contrast, saturation, and grayscale</p>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-medium">🔄 Transform</h4>
                                            <p className="text-muted-foreground">Rotate and flip your images</p>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-medium">✏️ Drawing</h4>
                                            <p className="text-muted-foreground">Draw directly on your photos</p>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-medium">🔍 Zoom & Pan</h4>
                                            <p className="text-muted-foreground">Zoom in/out and pan around your image</p>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-medium">📝 Text & Stickers</h4>
                                            <p className="text-muted-foreground">Add text overlays and emoji stickers</p>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-medium">🎭 Custom Elements</h4>
                                            <p className="text-muted-foreground">Upload and drag custom images directly on camera</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Photo Editor Modal */}
                {showEditor && photo && (
                    <PhotoEditorModal
                        file={(() => {
                            // Convert data URL to File object
                            const arr = photo.split(",");
                            const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
                            const bstr = atob(arr[1]);
                            let n = bstr.length;
                            const u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return new File([u8arr], "photo.png", { type: mime });
                        })()}
                        onSave={handleSaveImage}
                        onClose={() => setShowEditor(false)}
                    />
                )}
            </div>
        </>
    );
}
