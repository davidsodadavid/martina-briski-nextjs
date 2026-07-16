import AudioPractice from "@/components/AudioPractice";

export default function AudioPracticePage() {
  return (
    <main className="relative w-full flex-1">
      <AudioPractice
        fullScreen
        src="https://pub-1144190a4cb1457da1471034790b3b55.r2.dev/audio/shavasana.mp4"
        title="Opuštanje"
        subtitle="9 min · vođena praksa"
        background="#5F6D6A"
      />
    </main>
  );
}
