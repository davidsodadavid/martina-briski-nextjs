import BreathingCircle from "@/components/BreathingCircle";

export default function BreathingCirclePage() {
  return (
    <main className="relative w-full flex-1">
      <BreathingCircle inhaleSeconds={6} exhaleSeconds={6} />
    </main>
  );
}
