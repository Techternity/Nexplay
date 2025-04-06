import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

interface AthleteData {
    name: string;
    age: string;
    sport: string;
    role?: string;
    trainingHours: string;
    competitions: string;
    wins: string;
    runs?: string;
    wickets?: string;
    matchesPlayed?: string;
    goals?: string;
    assists?: string;
    scores?: string;
    rebounds?: string;
}

interface Metrics {
    avgProgress: string;
    competitions: number;
    achievementRate: string;
    sportSpecificMetric?: string;
}

interface PerformanceTrend {
    month: string;
    performance: number;
    average: number;
}

interface ProgressMetric {
    month: string;
    strength: number;
    speed: number;
    technique: number;
}

const Analyst: React.FC = () => {
    const [athleteData, setAthleteData] = useState<AthleteData>({
        name: '',
        age: '',
        sport: '',
        trainingHours: '',
        competitions: '',
        wins: ''
    });
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [performanceTrend, setPerformanceTrend] = useState<PerformanceTrend[]>([]);
    const [progressMetrics, setProgressMetrics] = useState<ProgressMetric[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAthleteData({ ...athleteData, [e.target.name]: e.target.value });
    };

    const analyzeData = () => {
        const trainingHours = parseInt(athleteData.trainingHours) || 0;
        const competitions = parseInt(athleteData.competitions) || 0;
        const wins = parseInt(athleteData.wins) || 0;

        const achievementRate = competitions > 0 ? 
            ((wins / competitions) * 100).toFixed(1) : '0';

        let sportSpecificMetric = '';
        if (athleteData.sport === 'Cricket') {
            const runs = parseInt(athleteData.runs || '0');
            const wickets = parseInt(athleteData.wickets || '0');
            sportSpecificMetric = `Runs: ${runs}, Wickets: ${wickets}`;
        } else if (athleteData.sport === 'Football') {
            const goals = parseInt(athleteData.goals || '0');
            const assists = parseInt(athleteData.assists || '0');
            sportSpecificMetric = `Goals: ${goals}, Assists: ${assists}`;
        } else if (athleteData.sport === 'Basketball') {
            const scores = parseInt(athleteData.scores || '0');
            const rebounds = parseInt(athleteData.rebounds || '0');
            const assists = parseInt(athleteData.assists || '0');
            sportSpecificMetric = `Scores: ${scores}, Rebounds: ${rebounds}, Assists: ${assists}`;
        }

        setMetrics({
            avgProgress: `${Math.floor(Math.random() * 100)}%`, // Removed decimals
            competitions,
            achievementRate: `${achievementRate}%`,
            sportSpecificMetric
        });

        const trend: PerformanceTrend[] = Array(6).fill(null).map((_, i) => ({
            month: new Date(2025, 3 - i, 1).toLocaleString('default', { month: 'short' }),
            performance: Math.floor(Math.random() * 40 + 60),
            average: 75
        })).reverse();
        setPerformanceTrend(trend);

        const progress: ProgressMetric[] = Array(6).fill(null).map((_, i) => ({
            month: new Date(2025, 3 - i, 1).toLocaleString('default', { month: 'short' }),
            strength: Math.min(100, Math.random() * 100),
            speed: Math.min(100, Math.random() * 100),
            technique: Math.min(100, Math.random() * 100),
        })).reverse();
        setProgressMetrics(progress);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600 pt-16">
                    {/* Added padding to prevent overlap */}
                    Athlete Performance Analytics
                </h1>

                <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Athlete Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={athleteData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Age</label>
                            <input 
                                type="number" 
                                name="age"
                                value={athleteData.age}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type your age"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Sport</label>
                            <select 
                                name="sport"
                                value={athleteData.sport}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                            >
                                <option value="">Select Sport</option>
                                <option value="Cricket">Cricket</option>
                                <option value="Football">Football</option>
                                <option value="Basketball">Basketball</option>
                            </select>
                        </div>
                        {athleteData.sport === 'Cricket' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Role</label>
                                    <input 
                                        type="text" 
                                        name="role"
                                        value={athleteData.role || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Batsman, Bowler, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Runs</label>
                                    <input 
                                        type="number" 
                                        name="runs"
                                        value={athleteData.runs || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total runs scored"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Wickets</label>
                                    <input 
                                        type="number" 
                                        name="wickets"
                                        value={athleteData.wickets || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total wickets taken"
                                    />
                                </div>
                            </>
                        )}
                        {athleteData.sport === 'Football' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Goals</label>
                                    <input 
                                        type="number" 
                                        name="goals"
                                        value={athleteData.goals || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total goals scored"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Assists</label>
                                    <input 
                                        type="number" 
                                        name="assists"
                                        value={athleteData.assists || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total assists made"
                                    />
                                </div>
                            </>
                        )}
                        {athleteData.sport === 'Basketball' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Scores</label>
                                    <input 
                                        type="number" 
                                        name="scores"
                                        value={athleteData.scores || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total scores made"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rebounds</label>
                                    <input 
                                        type="number" 
                                        name="rebounds"
                                        value={athleteData.rebounds || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total rebounds made"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Assists</label>
                                    <input 
                                        type="number" 
                                        name="assists"
                                        value={athleteData.assists || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Total assists made"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-2">Weekly Training Hours</label>
                            <input 
                                type="number" 
                                name="trainingHours"
                                value={athleteData.trainingHours}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type your training hours"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Competitions Participated</label>
                            <input 
                                type="number" 
                                name="competitions"
                                value={athleteData.competitions}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type competitions participated"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Wins</label>
                            <input 
                                type="number" 
                                name="wins"
                                value={athleteData.wins}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type wins"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={analyzeData}
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Analyze Performance
                    </button>
                </div>

                {metrics && (
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {Object.entries({
                            'Average Progress': metrics.avgProgress,
                            'Competitions': metrics.competitions,
                            'Achievement Rate': metrics.achievementRate,
                            ...(metrics.sportSpecificMetric ? { 'Sport-Specific Metric': metrics.sportSpecificMetric } : {})
                        }).map(([name, value]) => (
                            <div key={name} className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-sm text-gray-500">{name}</h3>
                                <p className="text-2xl font-bold">{value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {metrics && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Performance Trend</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={performanceTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="performance" stroke="#8884d8" />
                                    <Line type="monotone" dataKey="average" stroke="#82ca9d" strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Progress Metrics</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={progressMetrics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="strength" fill="#8884d8" />
                                    <Bar dataKey="speed" fill="#82ca9d" />
                                    <Bar dataKey="technique" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analyst;