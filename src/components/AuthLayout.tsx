import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-[20%] right-[15%] w-64 h-64 lg:w-80 lg:h-80 bg-accent-purple rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-4000"></div>
            </div>
            <div className="relative z-10 w-full max-w-md">
                <Outlet />
            </div>
        </div>
    );
};