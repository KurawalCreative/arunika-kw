'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl, { Map, Popup, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { FeatureCollection } from 'geojson';

import indonesia from '@/assets/coordinates/id.json'

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const [hoveredProvinceId, setHoveredProvinceId] = useState<number | null>(null)

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const bounds: [[number, number], [number, number]] = [
      [90, -15],
      [150, 20],
    ]

    const baseStyle: StyleSpecification = {
      version: 8,
      name: 'Enhanced Indonesia Map',
      sources: {
        'base-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'ocean-bg',
          type: 'background',
          paint: {
            'background-color': '#b3e5fc', // biru laut lembut
          },
        },
        {
          id: 'base-map',
          type: 'raster',
          source: 'base-tiles',
          paint: {
            'raster-saturation': -0.8,
            'raster-brightness-min': 0.3,
            'raster-brightness-max': 0.6,
            'raster-opacity': 0.6,
          },
        },
      ],
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: baseStyle,
      center: [118, -2],
      zoom: 4.5,
      maxBounds: bounds,
    })

    mapRef.current = map

    map.on('load', () => {
      const provColors: Record<string, string> = {}
      const colorPalette = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
        '#F4A261', '#E76F51', '#2A9D8F', '#E9C46A', '#F77F00',
      ]

      let colorIndex = 0
      const getColor = (name: string) => {
        if (!provColors[name]) {
          provColors[name] = colorPalette[colorIndex % colorPalette.length]
          colorIndex++
        }
        return provColors[name]
      }

      const features = (indonesia as any).features.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          color: getColor(f.properties.NAME_1 || f.properties.name || 'Tanpa Nama'),
        },
      }))
      const coloredData: FeatureCollection = {
        type: 'FeatureCollection',  // literal string
        features: features,         // array GeoJSON Feature
      };

      map.addSource('indonesia', { type: 'geojson', data: coloredData })

      // Layer utama (warna dasar)
      map.addLayer({
        id: 'indo-fill',
        type: 'fill',
        source: 'indonesia',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.9,
        },
      })

      // Layer highlight untuk hover
      map.addLayer({
        id: 'indo-highlight',
        type: 'fill',
        source: 'indonesia',
        paint: {
          'fill-outline-color': '#ffffff',
          'fill-color': '#ffffff',
          'fill-opacity': 0.5,
        },
        filter: ['==', 'NAME_1', ''], // kosong awalnya
      })

      // Outline
      map.addLayer({
        id: 'indo-outline',
        type: 'line',
        source: 'indonesia',
        paint: {
          'line-color': '#fff',
          'line-width': 1.2,
        },
      })

      // Popup elegan
      const popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'map-popup',
      })

      map.on('mousemove', 'indo-fill', (e) => {
        if (!e.features?.length) return

        const feature = e.features[0]
        const name = feature.properties?.NAME_1 || feature.properties?.name || 'Tanpa Nama'

        // Highlight provinsi
        map.setFilter('indo-highlight', ['==', 'NAME_1', name])

        // Tampilkan popup
        const coordinates = e.lngLat
        popup
          .setLngLat(coordinates)
          .setHTML(`
            <div style="
              font-weight:600;
              font-size:15px;
              color:#222;
              background:white;
              padding:6px 10px;
              border-radius:8px;
              box-shadow:0 3px 10px rgba(0,0,0,0.15);
              transition:all 0.3s ease;
            ">
              ${name}
            </div>
          `)
          .addTo(map)
      })

      map.on('mouseleave', 'indo-fill', () => {
        map.setFilter('indo-highlight', ['==', 'NAME_1', ''])
        popup.remove()
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 })
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 })
  const handleResetView = () => {
    mapRef.current?.flyTo({ center: [118, -2], zoom: 4.5, duration: 1000 })
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="relative w-full max-w-7xl h-[500px] rounded-2xl overflow-hidden shadow-lg">
        <div ref={mapContainer} className="w-full h-full rounded-2xl" />

        {/* Kontrol tombol custom */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all hover:scale-105"
            title="Zoom In"
          >
            <ZoomIn className="text-gray-700" size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all hover:scale-105"
            title="Zoom Out"
          >
            <ZoomOut className="text-gray-700" size={20} />
          </button>
          <button
            onClick={handleResetView}
            className="p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-all hover:scale-105"
            title="Reset View"
          >
            <Maximize2 className="text-gray-700" size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap
