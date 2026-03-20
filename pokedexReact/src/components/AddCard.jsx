import { useEffect, useState } from "react"
import PokemonCard from "./PokemonCard"

const AddCard = () => {
  const [name, setName] = useState("")
  const [image, setImage] = useState(null)

  const [type, setType] = useState("fire")
  const [strength, setStrength] = useState("")
  const [speed, setSpeed] = useState("")
  const [weight, setWeight] = useState("")
  const [skill, setSkill] = useState("")

  const [cards, setCards] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("cards")
    if (saved) {
      setCards(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (data) => {
    localStorage.setItem("cards", JSON.stringify(data))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file))
    }
  }

  const handleAdd = () => {
    if (!name || !image || !strength || !speed || !weight || !skill) return

    const newCard = {
      id: Date.now(),
      name,
      image,
      type,
      strength: Number(strength),
      speed: Number(speed),
      weight: Number(weight),
      skill: skill.split(",")
    }

    const updated = [...cards, newCard]

    setCards(updated)
    saveToStorage(updated)

    setName("")
    setImage(null)
    setType("fire")
    setStrength("")
    setSpeed("")
    setWeight("")
    setSkill("")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-10">

      <div className="w-full max-w-md bg-white border border-gray-300 shadow-lg rounded-2xl p-6 flex flex-col gap-4">

        <h1 className="text-gray-800 text-xl font-bold text-center">
          Create Pokemon Card
        </h1>

        <input
          className="p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          placeholder="Pokemon Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="psychic">Psychic</option>
        </select>

        <input
          type="number"
          placeholder="Strength"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
          type="number"
          placeholder="Speed"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
          type="number"
          placeholder="Weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
          type="text"
          placeholder="Skills (attack,defense)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="p-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-gray-700"
        />

        {image && (
          <img
            src={image}
            alt="preview"
            className="w-full h-44 object-cover rounded-xl border border-gray-300"
          />
        )}

        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 transition text-white font-bold py-2 rounded-xl"
        >
          Ajouter
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {cards.map((card) => (
          <PokemonCard key={card.id} pokemon={card} />
        ))}
      </div>

    </div>
  )
}

export default AddCard