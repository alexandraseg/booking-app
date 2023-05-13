import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer} from "recharts";
import NavigationDashboard from "./NavigationDashboard";

export default function DashboardPage() {

    const data = [
        {
          "name": "January",
          "uv": 4000,
          "pv": 2400,
          "amt": 2400
        },
        {
          "name": "February",
          "uv": 3000,
          "pv": 1398,
          "amt": 2210
        },
        {
          "name": "March",
          "uv": 2000,
          "pv": 9800,
          "amt": 2290
        },
        {
          "name": "April",
          "uv": 2780,
          "pv": 3908,
          "amt": 2000
        },
        {
          "name": "May",
          "uv": 1890,
          "pv": 4800,
          "amt": 2181
        },
        {
          "name": "June",
          "uv": 2390,
          "pv": 3800,
          "amt": 2500
        },
        {
          "name": "July",
          "uv": 3490,
          "pv": 4300,
          "amt": 2100
        }
      ]  

    return(
        <div>
            <div className="flex min-h-screen ">

                <NavigationDashboard />
                <main className="p-5 grow border-8 border-secondary">
                    <div className="flex mb-8 items-center">
                        <div className="w-1/2 grow">
                            <h1 className="text-secondary text-xl ">Welcome, <b>Admin</b></h1>
                        </div>
                        <div className="">
                            <div className="bg-gray-200 flex items-center rounded-md mr-7">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                <span className="px-3">Admin</span>
                            </div>
                            
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="grow w-1/2 flex gap-2 items-center bg-blue-200 text-secondary p-5 rounded-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                            <div>
                                <h2 className="font-bold text-2xl leading-4">150 million</h2>
                                <h3>Total Users</h3>
                            </div>
                        </div>

                        <div className="grow w-1/2 flex gap-2 items-center bg-red-200 text-secondary p-5 rounded-2xl mr-7">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                            <div>
                                <h2 className="font-bold text-2xl leading-4">12.7 million</h2>
                                <h3>Total Places</h3>
                            </div>
                        </div>
                    </div>

                    <div className="w-full" style={{height:'40vh'}}> 
                        <h2 className="mt-8 mb-3 text-secondary font-bold text-xl">Bookings Statistics</h2>            
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart width={300} height={250} data={data}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" style={{fill:'#aaa'}} />
                                <YAxis style={{fill:'#aaa'}}/>
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                            </AreaChart>
                        </ResponsiveContainer>        
                    </div>
                    

                </main>
            </div>
        </div>

        
    );
}