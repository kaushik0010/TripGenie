import { SparklesIcon } from "@heroicons/react/24/solid";
import TripForm from "./_components/TripForm";
import AuthButton from "./_components/AuthButton";
import LanguageSwitcher from "./_components/LanguageSwitcher";

export default function Home() {
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex justify-between items-center p-4 sm:p-6">
          <div className="flex-1 flex justify-start">
            <LanguageSwitcher />
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex-1 flex justify-end">
            <AuthButton />
          </div>
        </div>
      </header>
      
      <main className="pt-20 sm:pt-28 min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center space-y-4 max-w-full">
          <div className="inline-flex items-center justify-center p-2 sm:p-3 bg-slate-700/50 rounded-full">
            <SparklesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 px-2">
            TripGenie
          </h1>
          <p className="max-w-md sm:max-w-xl text-base sm:text-lg text-slate-400 mb-4 px-4 leading-relaxed">
            Your personal AI travel assistant. Tell us your travel dreams, and we'll craft the perfect itinerary.
          </p>
        </div>

        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-0 mt-6">
          <TripForm />
        </div>
      </main>
    </>
  );
}