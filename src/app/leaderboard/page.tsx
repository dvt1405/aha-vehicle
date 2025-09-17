import React from "react";
import BottomNav from "@/components/BottomNav";

// Ahamove-style icons
const StarIcon = () => (
    <svg
        className="w-8 h-8 text-orange-400 drop-shadow-lg"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path d="M12 2l2.9 6.9 7.1.6-5.4 5 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-5 7.1-.6z" />
    </svg>
);

const HelmetIcon = () => (
    <svg
        className="w-7 h-7 text-blue-500 drop-shadow"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <ellipse cx="12" cy="13" rx="9" ry="7" fill="#3b82f6" />
        <ellipse cx="12" cy="11" rx="9" ry="7" fill="#60a5fa" />
        <rect x="7" y="15" width="10" height="3" rx="1.5" fill="#1e293b" />
    </svg>
);

const BikeIcon = () => (
    <svg
        className="w-7 h-7 text-green-500 drop-shadow"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <circle cx="6" cy="18" r="3" fill="#22c55e" />
        <circle cx="18" cy="18" r="3" fill="#22c55e" />
        <rect x="11" y="10" width="2" height="5" rx="1" fill="#166534" />
        <rect x="8" y="8" width="8" height="2" rx="1" fill="#16a34a" />
    </svg>
);

const CoinIcon = ({ className = "w-6 h-6" }) => (
    <svg
        className={
            className + " text-yellow-400 drop-shadow"
        }
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="gold"
            strokeWidth="2"
            fill="#fde68a"
        />
        <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="10"
            fill="#b45309"
            fontWeight="bold"
        >
            ₳
        </text>
    </svg>
);

const leaderboardData = [
    { rank: 1, name: "Alice", score: 1850 },
    { rank: 2, name: "Bob", score: 1720 },
    { rank: 3, name: "Charlie", score: 1600 },
    { rank: 4, name: "Daisy", score: 1500 },
    { rank: 5, name: "Eve", score: 1400 },
];

const rankIcon = (rank: number) => {
    if (rank === 1) return <StarIcon />;
    if (rank === 2) return <HelmetIcon />;
    if (rank === 3) return <BikeIcon />;
    return (
        <span className="text-lg font-bold text-gray-400 w-8 text-center">
            {rank}
        </span>
    );
};

export default function LeaderboardPage() {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: "url('/aha-bg.png'), linear-gradient(to bottom, #e0f2fe, #f1f5f9)",
            }}
        >
            <div className="max-w-xl w-full mx-auto mt-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-2xl p-8 border-4 border-yellow-200 bg-opacity-90 backdrop-blur-md">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-lg flex items-center gap-2">
                        <StarIcon />
                        Leaderboard
                    </h1>
                    <div className="flex items-center bg-yellow-100 rounded-full px-5 py-2 shadow-lg border border-yellow-300">
                        <CoinIcon className="w-7 h-7 mr-2" />
                        <span className="font-bold text-xl text-yellow-700 drop-shadow">
                            {leaderboardData[0].score}
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    {leaderboardData.map((user, idx) => (
                        <div
                            key={user.rank}
                            className={`flex items-center justify-between py-4 px-3 rounded-xl mb-3 transition-all ${
                                idx === 0
                                    ? "bg-yellow-100 font-bold border-2 border-yellow-300 shadow-xl scale-105"
                                    : idx === 1
                                    ? "bg-blue-100 border border-blue-200"
                                    : idx === 2
                                    ? "bg-green-50 border border-green-100"
                                    : "hover:bg-blue-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {rankIcon(user.rank)}
                                <span className="text-lg">{user.name}</span>
                            </div>
                            <div className="flex items-center">
                                <CoinIcon className="w-5 h-5 mr-1" />
                                <span className="font-semibold">{user.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
