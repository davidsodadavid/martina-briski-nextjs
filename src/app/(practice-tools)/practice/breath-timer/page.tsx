import BreathTimer from "@/components/BreathTimer";

export default function BreathTimerPage() {
  return (
    <main className="relative w-full flex-1">
      <BreathTimer
        duration={60}
        fillTo="#5F6D6A"
        label="plank"
        nextHref="/practice"
      />
    </main>
  );
}
