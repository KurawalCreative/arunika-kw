"use client";

import { Clock } from "lucide-react";

const AppRightSidebar = () => {
    const events = [
        {
            date: { month: "NOV", day: "8" },
            title: "HackUTD Dallas Hackathon",
            time: "Sat Nov 8th @ 9:00pm ET",
            color: "bg-yellow-100 text-yellow-700 border border-yellow-300",
        },
        {
            date: { month: "NOV", day: "12" },
            title: "Lua Workshop (Tentative Date)",
            time: "Wed Nov 12th @ 3:00pm ET",
            color: "bg-green-100 text-green-700 border border-green-300",
        },
        {
            date: { month: "NOV", day: "25" },
            title: "Movie Nite - Python: The Documentary",
            time: "Tue Nov 25th @ 3:00pm ET",
            color: "bg-red-100 text-red-700 border border-red-300",
        },
    ];

    return (
        <>
            <aside className="text-text-primary fixed top-22 right-4 z-10 hidden h-fit w-72 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:flex">
                <div className="w-full">
                    <h2 className="text-text-primary mb-4 text-lg font-semibold">Upcoming Events</h2>
                    <div className="space-y-3">
                        {events.map((event, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:bg-gray-50">
                                <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-md font-bold ${event.color}`}>
                                    <span className="text-xs">{event.date.month}</span>
                                    <span className="text-lg">{event.date.day}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm leading-tight font-semibold">{event.title}</h3>
                                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Placeholder agar konten tidak tertimpa */}
            {/* <div className="hidden w-72 shrink-0 lg:block" /> */}
        </>
    );
};

export default AppRightSidebar;
