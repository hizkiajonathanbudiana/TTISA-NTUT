import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../components/Icon';

export const NotFoundPage = () => {
    return (
        <main className="relative min-h-screen w-full bg-background flex items-center justify-center p-4 overflow-hidden font-sans">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[5%] left-[10%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-blue rounded-full filter blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 lg:w-96 lg:h-96 bg-accent-green rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-lg text-center"
            >
                <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 shadow-xl">
                    <h1 className="text-8xl font-extrabold text-primary tracking-tighter">404</h1>
                    <h2 className="mt-4 text-3xl font-bold text-text-primary">Page Not Found</h2>
                    <p className="mt-4 text-text-secondary">
                        Sorry, we couldn't find the page you were looking for. It might have been moved or deleted.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex items-center gap-2 bg-text-primary text-background font-bold py-3 px-6 rounded-full text-lg hover:bg-neutral-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        <Icon path="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" className="w-5 h-5" />
                        Go Back Home
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};