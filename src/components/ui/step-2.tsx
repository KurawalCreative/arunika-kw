"use client";
import React from "react";
import { PinContainer } from "../ui/3d-pin";
import mapSvg from "@/assets/svg/map-dark.svg";
import kebaya from "@/assets/images/kebaya.jpg";
import payas from "@/assets/images/payas.jpg";
import agus from "@/assets/images/agus.png";
import siti from "@/assets/images/siti.png";
import { DottedMap } from "./dotted-map";
import Image from "next/image";

export function Step2() {
    return (
        <div className="relative">
            <Image src={kebaya.src} width={500} height={250} alt="map" className="bg-accent absolute top-0 -right-40 -z-10 aspect-square size-32 rotate-6 rounded-md object-cover p-2 transition-transform duration-300 hover:scale-110" />
            <Image src={payas.src} width={500} height={250} alt="map" className="bg-accent absolute top-0 -left-40 -z-10 aspect-square size-32 -rotate-10 rounded-md object-cover p-2 transition-transform duration-300 hover:scale-110" />
            <Image src={agus.src} width={500} height={250} alt="map" className="bg-accent absolute bottom-0 -left-40 -z-10 aspect-square size-32 rotate-7 rounded-md object-cover p-2 transition-transform duration-300 hover:scale-110" />
            <Image src={siti.src} width={500} height={250} alt="map" className="bg-accent absolute -right-40 bottom-0 -z-10 aspect-square size-32 -rotate-15 rounded-md object-cover p-2 transition-transform duration-300 hover:scale-110" />

            <div className="z-10 flex w-full flex-col items-center justify-center gap-8">
                <div className="text-center">
                    <h2 className="mb-2 text-3xl font-bold text-white">Jelajahi Peta Indonesia</h2>
                    <p className="text-gray-400">Temukan baju adat menarik dari berbagai daerah</p>
                </div>

                <PinContainer title="Temukan gaya pakaian adat" href="#">
                    <div className="flex h-[20rem] w-[50rem] basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2">
                        <div className="flex h-100 w-full items-center justify-center rounded-lg">
                            <Image src={mapSvg.src} width={500} height={250} alt="map" className="transition-transform duration-300 hover:scale-110" />
                        </div>
                        <div className="mt-4 flex w-full flex-1 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
                    </div>
                </PinContainer>
            </div>
        </div>
    );
}
