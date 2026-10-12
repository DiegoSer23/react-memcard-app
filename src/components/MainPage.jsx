import { useEffect, useState } from "react";
import Card from "./Card";

function MainPage() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
        .then((response) => response.json())
        .then(async (data) => {
            const detailedPromises = data.results.map((pokemon) =>
            fetch(pokemon.url).then((res) => res.json())
            );
            
            const detailedData = await Promise.all(detailedPromises);
            
            const formattedPokemon = detailedData.map((poke) => ({
            id: poke.id,
            name: poke.name,
            image: poke.sprites.front_default,
            isClicked: false,
            }));

            setPokemonList(formattedPokemon);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching Pokémon data:", error);
            setLoading(false);
        });
    }, []);

    const scrambleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const updateCardState = (id) => {
        //if id is already clicked reset, otherwise just update
        const selected = pokemonList.find(pokemon => pokemon.id === id);
        if (selected.isClicked) {
            setScore(0);
            setPokemonList(prevPokeList => 
                scrambleArray(prevPokeList.map(pokemon => ({ ...pokemon, isClicked: false})))
            );
            return;
        }
        const newScore = score + 1
        setScore(newScore);
        setBestScore(prevBest => Math.max(prevBest, newScore));
        setPokemonList(prevPokeList =>
            scrambleArray(prevPokeList.map(pokemon => 
                pokemon.id === id
                    ? { ...pokemon, isClicked:true }
                    : pokemon
            ))
        );
    }

    if (loading) return <div>Loading Pokémon...</div>;

    return (
        <>
            <h2>Pokemon Memory Card Game</h2>
            <label>Score:{score}</label>
            <label>Best Score:{bestScore}</label>
            <div id="cards-grid">
                {pokemonList.map((pokemon) => (
                    <Card 
                        key={pokemon.id}
                        name={pokemon.name}
                        src={pokemon.image}
                        onClick={() => updateCardState(pokemon.id)} 
                    />
                ))}
            </div>
        </>
    )
}

export default MainPage