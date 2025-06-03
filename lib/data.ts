import type { Game } from "./types"

export const games: Game[] = [
  {
    id: "1",
    title: "Demon Hunter Chronicles",
    developer: "AnimeStudio",
    genre: "Fighting / PvP",
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    icon: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-03-15T18:00:00.000Z",
    description: "Experience the ultimate demon slaying adventure in this action-packed Roblox game inspired by Demon Slayer. Master breathing techniques, forge powerful swords, and battle fearsome demons in stunning environments.",
    animeStyle: "Demon Slayer",
    tags: ["Fighting", "PvP", "Anime", "Adventure"],
    status: "Upcoming",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    images: [
      "https://i.ibb.co/PzZCQs7z/200.png",
      "https://i.ibb.co/PzZCQs7z/200.png"
    ],
    robloxGameId: "123456789",
    links: {
      discord: "https://discord.gg/demonhunter",
      twitter: "https://twitter.com/demonhuntergame",
      roblox: "https://www.roblox.com/games/123456789",
      youtube: "https://youtube.com/@demonhunter"
    },
    features: ["Breathing Techniques", "Sword Crafting", "Demon Battles", "Story Mode"],
    platforms: ["Roblox"],
    notifications: {
      enabled: true,
      discord: true,
      email: true
    }
  },
  {
    id: "2",
    title: "Pirate Legacy Online",
    developer: "GrandLineStudios",
    genre: "RPG / Open World",
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    icon: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-04-20T12:00:00.000Z",
    description: "Set sail in the world of One Piece! Build your crew, explore the Grand Line, and search for the ultimate treasure. Features Devil Fruits, Haki training, and epic naval battles.",
    animeStyle: "One Piece",
    tags: ["RPG", "Open World", "Adventure", "Multiplayer"],
    status: "Alpha Testing",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    robloxGameId: "987654321",
    links: {
      discord: "https://discord.gg/piratelegacy",
      roblox: "https://www.roblox.com/games/987654321"
    },
    features: ["Devil Fruits", "Haki System", "Naval Combat", "Crew Building"],
    platforms: ["Roblox", "Roblox (Early Access)"],
    notifications: {
      enabled: true,
      discord: true,
      email: false
    }
  },
  {
    id: "3",
    title: "Soul Society Simulator", 
    developer: "BleachDevs",
    genre: "RPG / Open World",
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-05-10T15:30:00.000Z",
    description: "Enter the world of Bleach as a Soul Reaper! Train your Zanpakuto, master Kido spells, and protect the living world from Hollows in this immersive RPG experience.",
    animeStyle: "Bleach",
    tags: ["RPG", "Supernatural", "Fighting"],
    status: "Beta Testing",
    robloxGameId: "456789123",
    links: {
      discord: "https://discord.gg/soulsociety"
    },
    features: ["Zanpakuto Training", "Kido Spells", "Hollow Battles"],
    platforms: ["Roblox"],
    notifications: {
      enabled: false,
      discord: false,
      email: false
    }
  },
  {
    id: "4",
    title: "Dragon Warrior Z",
    developer: "SaiyanGames", 
    genre: "Fighting / PvP",
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-06-01T20:00:00.000Z",
    description: "Power up and transform in this Dragon Ball Z inspired fighting game! Train to unlock new forms, learn signature moves, and battle other players in intense PvP combat.",
    animeStyle: "Dragon Ball",
    tags: ["Fighting", "PvP", "Transformations"],
    status: "TBA",
    features: ["Transformations", "Ki Attacks", "Training Grounds"],
    platforms: ["Roblox"],
    notifications: {
      enabled: true,
      discord: true,
      email: true
    }
  },
  {
    id: "5",
    title: "Hero Academia Training",
    developer: "PlusUltraStudios",
    genre: "Adventure / Quest-Based", 
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-07-15T14:00:00.000Z",
    description: "Develop your Quirk and become the next Symbol of Peace! Attend U.A. High School, train with classmates, and face off against villains in this My Hero Academia adventure.",
    animeStyle: "My Hero Academia",
    tags: ["Adventure", "School", "Quirks"],
    status: "Upcoming",
    features: ["Quirk Development", "School Life", "Villain Battles"],
    platforms: ["Roblox"],
    notifications: {
      enabled: true,
      discord: false,
      email: true
    }
  },
  {
    id: "6",
    title: "Titan Defense Force",
    developer: "WallMaria",
    genre: "Tower Defense",
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-08-30T16:45:00.000Z",
    description: "Defend humanity's last stronghold against the Titans! Use ODM gear, coordinate with your squad, and protect the walls in this intense Attack on Titan strategy game.",
    animeStyle: "Attack on Titan",
    tags: ["Strategy", "Defense", "Teamwork"],
    status: "Delayed",
    features: ["ODM Gear", "Squad Tactics", "Wall Defense"],
    platforms: ["Roblox"],
    notifications: {
      enabled: false,
      discord: true,
      email: false
    }
  },
  {
    id: "7",
    title: "Shinobi Chronicles",
    developer: "HiddenLeafGames",
    genre: "RPG / Open World",
    thumbnail: "https://i.ibb.co/PzZCQs7z/200.png",
    releaseDate: "2025-09-12T11:30:00.000Z",
    description: "Master the way of the ninja in this Naruto-inspired adventure! Learn jutsu, form teams, and embark on missions across the Hidden Villages.",
    animeStyle: "Naruto",
    tags: ["RPG", "Ninja", "Adventure"],
    status: "Upcoming",
    features: ["Jutsu System", "Village Missions", "Team Formation"],
    platforms: ["Roblox"],
    notifications: {
      enabled: true,
      discord: true,
      email: true
    }
  },
  {
    id: "8",
    title: "Alchemist Brotherhood",
    developer: "Equivalent Exchange Games",
    genre: "RPG",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Fullmetal+Alchemist",
    releaseDate: "2025-08-22T00:00:00.000Z",
    description:
      "Embark on a journey to recover what was lost in this Fullmetal Alchemist inspired RPG. Master the art of alchemy, uncover government conspiracies, and face the truth about the Philosopher's Stone.",
    animeStyle: "Fullmetal Alchemist",
    links: {
      discord: "https://discord.gg/alchemistbrotherhood",
      twitter: "https://twitter.com/alchemistbro",
      roblox: "https://roblox.com/games/alchemist-brotherhood"
    }
  },
  {
    id: "9",
    title: "Mecha Pilot: New Genesis",
    developer: "NERV Interactive",
    genre: "Simulator",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Evangelion",
    releaseDate: "2025-10-05T00:00:00.000Z",
    description:
      "Pilot advanced mechs to defend humanity against mysterious enemies in this Evangelion inspired simulator. Experience psychological storytelling while mastering complex mech controls and combat systems.",
    animeStyle: "Evangelion",
    links: {
      discord: "https://discord.gg/mechapilot",
      twitter: "https://twitter.com/mechapilotgame",
      roblox: "https://roblox.com/games/mecha-pilot",
      youtube: "https://youtube.com/@mechapilotofficial"
    }
  },
]
