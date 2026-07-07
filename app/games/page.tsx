import { GameLocker } from "@/components/game-locker";
import { getGames } from "@/lib/platform";

export default async function GamesPage() {
  const gameScripts = await getGames();

  return (
    <div className="min-h-screen">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Games Arcade</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            Interactive canvas demos with a 24-hour source-code unlock flow.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        {gameScripts.map((game) => (
          <GameLocker key={game.id} game={game} />
        ))}
      </section>
    </div>
  );
}
