import React, { useEffect, useState } from "react";

export default function PokemonApp() {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [allTypes, setAllTypes] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Pokémon Kingdom";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(fullText.substring(0, i));
      if (i === fullText.length) {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  async function fetchPokemons() {
    setLoading(true);
    let res = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + offset
    );
    let data = await res.json();

    let details = await Promise.all(
      data.results.map(async (p) => {
        let d = await fetch(p.url);
        let info = await d.json();
        return {
          name: info.name,
          image: info.sprites.other["official-artwork"].front_default,
          types: info.types.map((t) => t.type.name),
          height: info.height,
          weight: info.weight,
          stats: info.stats,
        };
      })
    );
    setPokemons((prev) => {
      const all = [...prev, ...details];
      const unique = new Map(all.map((p) => [p.name, p]));
      return Array.from(unique.values());
    });

    setLoading(false);
  }


  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypes() {
    let res = await fetch("https://pokeapi.co/api/v2/type");
    let data = await res.json();
    setAllTypes(data.results.map((t) => t.name));
  }


  let shownPokemons = pokemons.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (type ? p.types.includes(type) : true)
  );

  return (
    <div className="min-h-screen relative p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 animate-gradient-x">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>
      <h1
        className="text-5xl md:text-6xl font-extrabold text-center mb-10 
                   bg-gradient-to-r from-indigo-400 via-sky-500 to-emerald-400 
                   bg-clip-text text-transparent 
                   tracking-wide leading-tight 
                   bg-[length:200%_200%] animate-[gradient-move_4s_ease_infinite]"
      >
        {displayedText}
        <span className="animate-pulse">|</span>
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
        <input
          type="text"
          placeholder="🔍 Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-4 rounded-2xl border border-purple-400/50 bg-white/5 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-lg transition"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full md:w-1/4 p-4 rounded-2xl border border-purple-400/50 bg-white/5 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-lg transition"
        >
          <option value="">-- Select Type --</option>
          {allTypes.map((t, i) => (
            <option key={i} value={t} className="bg-black text-white">
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {shownPokemons.length > 0 ? (
          shownPokemons.map((p, i) => (
            <div
              key={i}
              className="group relative bg-white/10 backdrop-blur-xl border border-purple-500/30 p-6 rounded-3xl shadow-xl hover:scale-105 hover:rotate-1 transform transition duration-500 cursor-pointer overflow-hidden"
            >
          
              <div className="absolute inset-0 rounded-3xl opacity-40 group-hover:opacity-70 blur-xl bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 transition"></div>

              <img
                src={p.image}
                alt={p.name}
                className="relative mx-auto w-36 h-36 object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
              />
              <h3 className="relative mt-4 text-2xl font-bold capitalize text-center bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                {p.name}
              </h3>
              <p className="relative text-center mt-2 text-sm text-gray-200">
                {p.types.join(", ")}
              </p>
              <button
                onClick={() => setSelectedPokemon(p)}
                className="relative mt-5 w-full py-2 font-semibold rounded-xl bg-gradient-to-r from-sky-500/40 to-emerald-500/40 border border-sky-400/60 text-white shadow-md hover:scale-105 hover:shadow-sky-400/40 transition"
              >
                Know More 🚀
              </button>
            </div>
          ))
        ) : (
          <h2 className="text-center text-3xl col-span-full font-bold text-white mt-16 animate-bounce">
            ❌ No Pokémon Found
          </h2>
        )}
      </div>

 
      {!type && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setOffset((prev) => prev + 20)}
            disabled={loading}
            className="px-10 py-4 font-bold rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 text-white shadow-lg hover:shadow-sky-400/40 hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "⚡ Loading..." : "⚡ Load More"}
          </button>
        </div>
      )}
      {selectedPokemon && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl w-96 border border-sky-400/40 shadow-2xl animate-fadeIn">
            <button
              onClick={() => setSelectedPokemon(null)}
              className="absolute top-3 right-3 text-white hover:text-sky-400 text-xl font-bold"
            >
              ✖
            </button>
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="w-44 h-44 mx-auto object-contain drop-shadow-lg"
            />
            <h2 className="text-3xl font-extrabold capitalize mt-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 drop-shadow-md">
              {selectedPokemon.name}
            </h2>
            <p className="text-center mt-2 text-white/80">
              {selectedPokemon.types.join(", ")}
            </p>
            <div className="mt-6 text-white/90 space-y-2">
              <p>🌍 Height: {selectedPokemon.height}</p>
              <p>⚖️ Weight: {selectedPokemon.weight}</p>
              {selectedPokemon.stats.map((s, i) => (
                <p key={i}>
                  {s.stat.name.toUpperCase()}: {s.base_stat}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
