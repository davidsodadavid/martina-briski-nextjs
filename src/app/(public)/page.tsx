import BreathingCircle from "@/components/BreathingCircle";
import HomePracticeCta from "@/components/HomePracticeCta";
import HomeCursor from "@/components/HomeCursor";

export default function HomePage() {
  return (
    <main className="relative w-full flex-1">
      <HomeCursor className="absolute inset-0">
        <BreathingCircle
          inhaleSeconds={6}
          exhaleSeconds={6}
          showLabel
          labelRevealDelayMs={10000}
          sizeScale={1.5}
          phaseFontSize={16}
          phaseFade
          holdSeconds={0.7}
          restSeconds={0.7}
        />
      </HomeCursor>
      <HomePracticeCta />
    </main>
  );
}
