'use client'

import { useEffect, useRef } from 'react'
import maplibregl, { Map, Popup, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { FeatureCollection } from 'geojson'
import indonesia from '@/assets/coordinates/id.json'
import { useTheme } from 'next-themes'
import * as turf from '@turf/turf'

type InteractiveMapProps = {
  selectedProvince?: string | null
}

const InteractiveMap = ({ selectedProvince }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null) 
  const mapRef = useRef<Map | null>(null)
  const { theme } = useTheme()

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
          id: 'background',
          type: 'background',
          paint: {
            'background-color': theme === 'dark' ? '#111827' : '#ffffff',
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
            'raster-opacity': 0,
          },
        },
      ],
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: baseStyle,
      center: [118, -2],
      zoom: 4.28,
      maxBounds: bounds,
      dragPan: false,
      scrollZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
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
        type: 'FeatureCollection',
        features,
      }

      map.addSource('indonesia', { type: 'geojson', data: coloredData })

      map.addLayer({
        id: 'indo-fill',
        type: 'fill',
        source: 'indonesia',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.9,
        },
      })

      map.addLayer({
        id: 'indo-highlight',
        type: 'fill',
        source: 'indonesia',
        paint: {
          'fill-outline-color': '#ffffff',
          'fill-color': '#ffffff',
          'fill-opacity': 0.5,
        },
        filter: ['==', 'NAME_1', ''],
      })

      map.addLayer({
        id: 'indo-outline',
        type: 'line',
        source: 'indonesia',
        paint: {
          'line-color': '#fff',
          'line-width': 1.2,
        },
      })

      map.addLayer({
        id: 'indo-labels',
        type: 'symbol',
        source: 'indonesia',
        layout: {
          'text-field': ['get', 'NAME_1'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': theme === 'dark' ? '#f9fafb' : '#111827',
          'text-halo-color': theme === 'dark' ? '#111827' : '#ffffff',
          'text-halo-width': 1.2,
        },
      })

      const popup = new Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'map-popup',
      })

      map.on('mousemove', 'indo-fill', (e) => {
        map.getCanvas().style.cursor = 'pointer'
        if (!e.features?.length) return

        const feature = e.features[0]
        const name = feature.properties?.NAME_1 || feature.properties?.name || 'Tanpa Nama'
        map.setFilter('indo-highlight', ['==', 'NAME_1', name])

        popup
          .setLngLat(e.lngLat)
          .setHTML(`<div style="font-weight:600;font-size:15px;color:#222;">${name}</div>`)
          .addTo(map)
      })

      map.on('mouseleave', 'indo-fill', () => {
        map.getCanvas().style.cursor = ''
        map.setFilter('indo-highlight', ['==', 'NAME_1', ''])
        popup.remove()
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // 🔹 Update warna saat theme berubah
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const bgColor = theme === 'dark' ? '#111827' : '#ffffff'
    try {
      map.setPaintProperty('background', 'background-color', bgColor)
    } catch {}

    try {
      const textColor = theme === 'dark' ? '#f9fafb' : '#111827'
      const haloColor = theme === 'dark' ? '#111827' : '#ffffff'
      map.setPaintProperty('indo-labels', 'text-color', textColor)
      map.setPaintProperty('indo-labels', 'text-halo-color', haloColor)
    } catch {}
  }, [theme])

  // 🔹 Fokus ke provinsi tertentu (opsional jika dipilih)
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedProvince) return

    const source: any = map.getSource('indonesia') as any
    if (!source?._data) return

    const feature = source._data.features.find(
      (f: any) => f.properties.NAME_1?.toLowerCase() === selectedProvince.toLowerCase()
    )

    if (feature) {
      const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature)
      map.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40, duration: 1000 }
      )
    }
  }, [selectedProvince])

  return (
    <div className="flex justify-center items-center py-5">
      <div className="relative w-full max-w-7xl h-[500px] overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  )
}

export default InteractiveMap
