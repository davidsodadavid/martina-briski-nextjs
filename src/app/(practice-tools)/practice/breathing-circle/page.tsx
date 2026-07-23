import BreathingCircle from "@/components/BreathingCircle";

export default function BreathingCirclePage() {
  return (
    <main className="relative w-full flex-1">
      <BreathingCircle
        inhaleSeconds={6}
        exhaleSeconds={6}
        sizeScale={1.2}
        phaseFade
        holdSeconds={0.7}
        restSeconds={0.7}
      />
    </main>
  );
}
