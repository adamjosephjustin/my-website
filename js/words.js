const WORD_LIST = {
    EN: {
        EASY: [
            // Animals
            "Cat", "Dog", "Fish", "Bird", "Lion", "Tiger", "Bear", "Elephant", "Monkey", "Rabbit",
            "Horse", "Cow", "Pig", "Sheep", "Duck", "Chicken", "Frog", "Turtle", "Snake", "Mouse",
            "Butterfly", "Bee", "Ant", "Spider", "Ladybug", "Penguin", "Seal", "Whale", "Dolphin", "Shark",
            "Octopus", "Crab", "Snail", "Giraffe", "Zebra", "Kangaroo", "Koala", "Panda", "Fox", "Wolf",

            // Food
            "Apple", "Banana", "Orange", "Grape", "Strawberry", "Pizza", "Cake", "Cookie", "Bread", "Cheese",
            "Milk", "Water", "Juice", "Ice Cream", "Candy", "Chocolate", "Carrot", "Tomato", "Potato", "Corn",
            "Egg", "Bacon", "Sandwich", "Burger", "Hot Dog", "Pasta", "Rice", "Soup", "Salad", "Chicken",

            // Objects
            "Ball", "Book", "Pen", "Pencil", "Chair", "Table", "Door", "Window", "Cup", "Plate",
            "Spoon", "Fork", "Knife", "Bowl", "Glass", "Bottle", "Box", "Bag", "Hat", "Shoe",
            "Sock", "Shirt", "Pants", "Dress", "Coat", "Glove", "Scarf", "Umbrella", "Clock", "Watch",
            "Phone", "Computer", "Camera", "TV", "Radio", "Lamp", "Bed", "Pillow", "Blanket", "Towel",

            // Nature
            "Sun", "Moon", "Star", "Cloud", "Rain", "Snow", "Wind", "Tree", "Flower", "Grass",
            "Mountain", "River", "Ocean", "Beach", "Island", "Forest", "Desert", "Rock", "Sand", "Leaf",

            // Vehicles
            "Car", "Bus", "Train", "Plane", "Bike", "Boat", "Truck", "Helicopter", "Rocket", "Balloon",

            // Actions/Emotions
            "Smile", "Laugh", "Jump", "Run", "Walk", "Sleep", "Eat", "Drink", "Sing", "Dance",
            "Happy", "Sad", "Angry", "Scared", "Excited", "Tired", "Love", "Hug", "Kiss", "Wave"
        ],
        HARD: [
            // Abstract Concepts
            "Dream", "Idea", "Time", "Music", "Magic", "Secret", "Mystery", "Memory", "Story", "Adventure",
            "Freedom", "Peace", "Justice", "Truth", "Hope", "Faith", "Trust", "Courage", "Wisdom", "Knowledge",

            // Weather & Nature
            "Rainbow", "Thunder", "Lightning", "Tornado", "Hurricane", "Earthquake", "Volcano", "Avalanche", "Tsunami", "Eclipse",
            "Sunrise", "Sunset", "Shadow", "Reflection", "Frost", "Fog", "Mist", "Dew", "Breeze", "Storm",

            // Emotions & States
            "Jealous", "Proud", "Shy", "Brave", "Lonely", "Confused", "Surprised", "Disappointed", "Grateful", "Curious",
            "Embarrassed", "Frustrated", "Anxious", "Calm", "Peaceful", "Energetic", "Lazy", "Bored", "Worried", "Relaxed",

            // Activities
            "Swimming", "Climbing", "Flying", "Cooking", "Painting", "Writing", "Reading", "Building", "Gardening", "Fishing",
            "Shopping", "Traveling", "Camping", "Hiking", "Skiing", "Skating", "Surfing", "Diving", "Racing", "Fighting",

            // Places
            "School", "Library", "Museum", "Hospital", "Restaurant", "Park", "Zoo", "Circus", "Theater", "Stadium",
            "Airport", "Station", "Market", "Farm", "Factory", "Office", "Store", "Mall", "Cafe", "Hotel",

            // Fantasy & Space
            "Dragon", "Unicorn", "Fairy", "Wizard", "Ghost", "Alien", "Monster", "Robot", "Vampire", "Dinosaur",
            "Planet", "Galaxy", "Comet", "Asteroid", "Spaceship", "Satellite", "Astronaut", "Telescope", "Orbit", "Gravity",

            // Technology
            "Internet", "Email", "Website", "Download", "Upload", "Password", "Battery", "Charger", "Keyboard", "Mouse",
            "Screen", "Speaker", "Microphone", "Headphones", "Webcam", "Printer", "Scanner", "Remote", "Controller", "Antenna",

            // Sports & Games
            "Football", "Basketball", "Tennis", "Golf", "Baseball", "Hockey", "Volleyball", "Rugby", "Cricket", "Bowling",
            "Chess", "Cards", "Dice", "Puzzle", "Maze", "Tag", "Hide and Seek", "Hopscotch", "Marbles", "Kite",

            // Professions
            "Doctor", "Teacher", "Police", "Firefighter", "Chef", "Artist", "Musician", "Scientist", "Engineer", "Pilot",
            "Farmer", "Sailor", "Soldier", "Nurse", "Dentist", "Lawyer", "Judge", "President", "King", "Queen"
        ]
    },
    NL: {
        EASY: [
            // Dieren
            "Kat", "Hond", "Vis", "Vogel", "Leeuw", "Tijger", "Beer", "Olifant", "Aap", "Konijn",
            "Paard", "Koe", "Varken", "Schaap", "Eend", "Kip", "Kikker", "Schildpad", "Slang", "Muis",
            "Vlinder", "Bij", "Mier", "Spin", "Lieveheersbeestje", "Pinguïn", "Zeehond", "Walvis", "Dolfijn", "Haai",
            "Octopus", "Krab", "Slak", "Giraf", "Zebra", "Kangoeroe", "Koala", "Panda", "Vos", "Wolf",

            // Eten
            "Appel", "Banaan", "Sinaasappel", "Druif", "Aardbei", "Pizza", "Taart", "Koekje", "Brood", "Kaas",
            "Melk", "Water", "Sap", "IJsje", "Snoep", "Chocolade", "Wortel", "Tomaat", "Aardappel", "Maïs",
            "Ei", "Spek", "Boterham", "Hamburger", "Hotdog", "Pasta", "Rijst", "Soep", "Salade", "Kip",

            // Voorwerpen
            "Bal", "Boek", "Pen", "Potlood", "Stoel", "Tafel", "Deur", "Raam", "Kopje", "Bord",
            "Lepel", "Vork", "Mes", "Kom", "Glas", "Fles", "Doos", "Tas", "Hoed", "Schoen",
            "Sok", "Shirt", "Broek", "Jurk", "Jas", "Handschoen", "Sjaal", "Paraplu", "Klok", "Horloge",
            "Telefoon", "Computer", "Camera", "TV", "Radio", "Lamp", "Bed", "Kussen", "Deken", "Handdoek",

            // Natuur
            "Zon", "Maan", "Ster", "Wolk", "Regen", "Sneeuw", "Wind", "Boom", "Bloem", "Gras",
            "Berg", "Rivier", "Oceaan", "Strand", "Eiland", "Bos", "Woestijn", "Steen", "Zand", "Blad",

            // Voertuigen
            "Auto", "Bus", "Trein", "Vliegtuig", "Fiets", "Boot", "Vrachtwagen", "Helikopter", "Raket", "Ballon",

            // Acties/Emoties
            "Glimlach", "Lachen", "Springen", "Rennen", "Lopen", "Slapen", "Eten", "Drinken", "Zingen", "Dansen",
            "Blij", "Verdrietig", "Boos", "Bang", "Opgewonden", "Moe", "Liefde", "Knuffel", "Kus", "Zwaaien"
        ],
        HARD: [
            // Abstracte Concepten
            "Droom", "Idee", "Tijd", "Muziek", "Magie", "Geheim", "Mysterie", "Herinnering", "Verhaal", "Avontuur",
            "Vrijheid", "Vrede", "Rechtvaardigheid", "Waarheid", "Hoop", "Geloof", "Vertrouwen", "Moed", "Wijsheid", "Kennis",

            // Weer & Natuur
            "Regenboog", "Donder", "Bliksem", "Tornado", "Orkaan", "Aardbeving", "Vulkaan", "Lawine", "Tsunami", "Eclips",
            "Zonsopgang", "Zonsondergang", "Schaduw", "Reflectie", "Vorst", "Mist", "Nevel", "Dauw", "Bries", "Storm",

            // Emoties & Staten
            "Jaloers", "Trots", "Verlegen", "Dapper", "Eenzaam", "Verward", "Verrast", "Teleurgesteld", "Dankbaar", "Nieuwsgierig",
            "Beschaamd", "Gefrustreerd", "Angstig", "Kalm", "Vredig", "Energiek", "Lui", "Verveeld", "Bezorgd", "Ontspannen",

            // Activiteiten
            "Zwemmen", "Klimmen", "Vliegen", "Koken", "Schilderen", "Schrijven", "Lezen", "Bouwen", "Tuinieren", "Vissen",
            "Winkelen", "Reizen", "Kamperen", "Wandelen", "Skiën", "Schaatsen", "Surfen", "Duiken", "Racen", "Vechten",

            // Plaatsen
            "School", "Bibliotheek", "Museum", "Ziekenhuis", "Restaurant", "Park", "Dierentuin", "Circus", "Theater", "Stadion",
            "Luchthaven", "Station", "Markt", "Boerderij", "Fabriek", "Kantoor", "Winkel", "Winkelcentrum", "Café", "Hotel",

            // Fantasie & Ruimte
            "Draak", "Eenhoorn", "Fee", "Tovenaar", "Spook", "Alien", "Monster", "Robot", "Vampier", "Dinosaurus",
            "Planeet", "Melkweg", "Komeet", "Asteroïde", "Ruimteschip", "Satelliet", "Astronaut", "Telescoop", "Baan", "Zwaartekracht",

            // Technologie
            "Internet", "Email", "Website", "Downloaden", "Uploaden", "Wachtwoord", "Batterij", "Oplader", "Toetsenbord", "Muis",
            "Scherm", "Luidspreker", "Microfoon", "Koptelefoon", "Webcam", "Printer", "Scanner", "Afstandsbediening", "Controller", "Antenne",

            // Sport & Spellen
            "Voetbal", "Basketbal", "Tennis", "Golf", "Honkbal", "Hockey", "Volleybal", "Rugby", "Cricket", "Bowlen",
            "Schaken", "Kaarten", "Dobbelstenen", "Puzzel", "Doolhof", "Tikkertje", "Verstoppertje", "Hinkelen", "Knikkers", "Vlieger",

            // Beroepen
            "Dokter", "Leraar", "Politie", "Brandweerman", "Chef", "Kunstenaar", "Muzikant", "Wetenschapper", "Ingenieur", "Piloot",
            "Boer", "Zeeman", "Soldaat", "Verpleegster", "Tandarts", "Advocaat", "Rechter", "President", "Koning", "Koningin"
        ]
    }
};
