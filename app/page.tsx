import { SparklesIcon } from "@heroicons/react/24/solid";
import TripForm from "./_components/TripForm";
import AuthButton from "./_components/AuthButton";
import LanguageSwitcher from "./_components/LanguageSwitcher";

export default function Home() {
  return (
    <>
      <header className="absolute top-0 right-0 p-6 flex justify-between gap-4">
        <LanguageSwitcher />
        <AuthButton />
      </header>
      <main className="flex min-h-screen w-full flex-col items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-700/50 rounded-full">
            <SparklesIcon className="h-10 w-10 text-cyan-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500">
            TripGenie
          </h1>
          <p className="max-w-xl text-lg text-slate-400 mb-4">
            Your personal AI travel assistant. Tell us your travel dreams, and we'll craft the perfect itinerary.
          </p>
        </div>

        <TripForm />
      </main>
    </>
  );
}
