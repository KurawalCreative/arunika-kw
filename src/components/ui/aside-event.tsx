"use client";

import { Clock } from "lucide-react";

const AsideEvent = () => {
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
        <div>
            {/* Sidebar kanan fixed */}
            <aside className="hidden lg:flex fixed right-4 top-24 w-72 h-fit bg-white border border-gray-200 rounded-xl text-gray-800 p-5 shadow-sm z-10">
                <div className="w-full">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Events</h2>
                    <div className="space-y-3">
                        {events.map((event, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 border border-gray-100 bg-white hover:bg-gray-50 transition-colors rounded-lg p-3 shadow-sm"
                            >
                                <div
                                    className={`flex flex-col items-center justify-center w-12 h-12 rounded-md font-bold ${event.color}`}
                                >
                                    <span className="text-xs">{event.date.month}</span>
                                    <span className="text-lg">{event.date.day}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold leading-tight">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Placeholder agar konten tidak tertimpa */}
            <div className="hidden lg:block w-72 shrink-0" />
        </div>
    );
};

export default AsideEvent;
