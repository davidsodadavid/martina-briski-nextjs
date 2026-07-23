import BreathingCircle from "@/components/BreathingCircle";
import HomePracticeCta from "@/components/HomePracticeCta";

export default function HomePage() {
  return (
    <main className="relative w-full flex-1">
      <BreathingCircle
        inhaleSeconds={6}
        exhaleSeconds={6}
        showLabel={false}
        sizeScale={1.5}
        phaseFontSize={16}
        phaseFade
        holdSeconds={0.7}
        restSeconds={0.7}
        hoverPattern
      />
      <HomePracticeCta />
    </main>
  );
}
