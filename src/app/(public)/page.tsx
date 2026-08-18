import BreathingCircle from "@/components/BreathingCircle";
import HomePracticeCta from "@/components/HomePracticeCta";
import HomeCursor from "@/components/HomeCursor";

export default function HomePage() {
  return (
    <main className="relative w-full flex-1">
      <HomeCursor className="absolute inset-0">
        <BreathingCircle
          inhaleSeconds={4}
          exhaleSeconds={4}
          showLabel={false}
          sizeScale={1.5}
          phaseFontSize={16}
          phaseFade
          holdSeconds={3}
          restSeconds={3}
          mobileAlign="top"
        />
      </HomeCursor>
      <HomePracticeCta />
    </main>
  );
}
