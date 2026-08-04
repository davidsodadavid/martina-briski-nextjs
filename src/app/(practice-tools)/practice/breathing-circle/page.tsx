import BreathingCircle from "@/components/BreathingCircle";

export default function BreathingCirclePage() {
  return (
    <main className="relative w-full flex-1">
      <BreathingCircle
        inhaleSeconds={4}
        exhaleSeconds={4}
        sizeScale={1.2}
        phaseFade
        holdSeconds={3}
        restSeconds={3}
      />
    </main>
  );
}
