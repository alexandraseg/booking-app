import NavigationDashboard from "./NavigationDashboard";

export default function LayoutDashboard({children}) {
    return (
        <div className="flex min-h-screen">
            <NavigationDashboard />
            <main className="p-5 grow border-8 border-secondary">
            {children}
            </main>
            
        </div>   
    );
}