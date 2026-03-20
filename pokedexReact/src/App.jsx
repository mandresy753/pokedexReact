import React, { useState, useEffect } from "react";
import SearchHeader from "./components/SearchHeader";
import PokemonCard from "./components/PokemonCard";
import AddCard from "./components/AddCard"
import Footer from "./components/Footer";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("three");
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [transition, setTransition] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();

            return {
              id: details.id,
              name: details.name,
              type: details.types[0].type.name,
              strength: details.stats[1].base_stat,
              speed: details.stats[5].base_stat,
              weight: `${details.weight / 10} kg`,
              skill: [details.abilities[0].ability.name],
              image: details.sprites.other["official-artwork"].front_default,
            };
          })
        );

        setPokemons(pokemonDetails);
        setDisplayedPokemons(
          view === "three" ? getRandomThree(pokemonDetails) : shuffleArray([...pokemonDetails])
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pokemons:", error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    const filteredPokemons = pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedPokemons(
      view === "three" ? getRandomThree(filteredPokemons) : shuffleArray([...filteredPokemons])
    );
    if (view === "three") setCurrentIndex(0);
  }, [view, searchTerm, pokemons]);

  useEffect(() => {
    if (searchTerm === "" && view === "three") {
      const interval = setInterval(() => {
        setTransition(true);
        setTimeout(() => {
          const filteredPokemons = pokemons.filter(
            (pokemon) =>
              pokemon.name.toLowerCase().includes(searchTerm) ||
              pokemon.type.toLowerCase().includes(searchTerm)
          );
          setDisplayedPokemons(getNextSet(filteredPokemons, currentIndex));
          setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredPokemons.length / 3));
          setTransition(false);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [pokemons, searchTerm, currentIndex, view]);

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getRandomThree = (arr) => {
    if (arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const getNextSet = (arr, index) => {
    if (arr.length === 0) return [];
    const start = index * 3;
    return arr.slice(start, start + 3).length < 3 ? getRandomThree(arr) : arr.slice(start, start + 3);
  };

  const scrollLeft = () => {
    if (view === "three") {
      setTransition(true);
      setTimeout(() => {
        const filteredPokemons = pokemons.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.type.toLowerCase().includes(searchTerm)
        );
        const totalSets = Math.ceil(filteredPokemons.length / 3);
        setCurrentIndex((prev) => (prev - 1 + totalSets) % totalSets);
        setDisplayedPokemons(getNextSet(filteredPokemons, (currentIndex - 1 + totalSets) % totalSets));
        setTransition(false);
      }, 500);
    }
  };

  const scrollRight = () => {
    if (view === "three") {
      setTransition(true);
      setTimeout(() => {
        const filteredPokemons = pokemons.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.type.toLowerCase().includes(searchTerm)
        );
        const totalSets = Math.ceil(filteredPokemons.length / 3);
        setCurrentIndex((prev) => (prev + 1) % totalSets);
        setDisplayedPokemons(getNextSet(filteredPokemons, (currentIndex + 1) % totalSets));
        setTransition(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <SearchHeader onSearch={handleSearch} view={view} setView={setView} />
      <div className="container mx-auto px-4 py-8 mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl font-semibold text-gray-800">Chargement des Pokémon...</div>
          </div>
        ) : displayedPokemons.length > 0 ? (
          <div className="relative">
            {view === "three" && (
              <div className="overflow-hidden">
                <div
                  onClick={scrollLeft}
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-40 bg-opacity-50 hover:bg-opacity-75 cursor-pointer z-10 rounded-2xl"
                  style={{ backgroundColor: "#C4C4C4" }}
                ></div>
                <div
                  className={`flex gap-6 transition-transform duration-500 ease-in-out ${
                    transition ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
                  } flex-row justify-center`}
                  style={{ height: "auto", minHeight: "480px" }}
                >
                  {displayedPokemons.map((pokemon) => (
                    <div key={pokemon.id} className="w-96">
                      <PokemonCard pokemon={pokemon} view={view} />
                    </div>
                  ))}
                </div>
                <div
                  onClick={scrollRight}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-40 bg-opacity-50 hover:bg-opacity-75 cursor-pointer z-10 rounded-2xl"
                  style={{ backgroundColor: "#C4C4C4" }}
                ></div>
              </div>
            )}
            {view === "all" && (
              <div className="flex flex-wrap gap-6 justify-center overflow-auto">
                {displayedPokemons.map((pokemon) => (
                  <div key={pokemon.id} className="w-96 sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <PokemonCard pokemon={pokemon} view={view} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600 mb-2">
              Aucun Pokémon trouvé pour "{searchTerm}"
            </div>
            <div className="text-gray-500">Essayez un autre terme de recherche</div>
          </div>
        )}
     <Footer/>
     <div>
      <AddCard/>
     </div>
    </div>
  </div>
    
  );
}

export default App;