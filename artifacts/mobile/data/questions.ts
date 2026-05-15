export type Category = "geography" | "sports" | "science" | "history";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  category: Category;
}

const geographyQuestions: Question[] = [
  {
    id: "geo1",
    question: "What is the capital city of France?",
    options: ["Berlin", "Paris", "Rome", "Madrid"],
    correctIndex: 1,
    hint: "City of Light, home to the Eiffel Tower",
    category: "geography",
  },
  {
    id: "geo2",
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
    hint: "It covers more than 30% of Earth's surface",
    category: "geography",
  },
  {
    id: "geo3",
    question: "Which is the world's longest river?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctIndex: 1,
    hint: "It flows through Egypt and Sudan",
    category: "geography",
  },
  {
    id: "geo4",
    question: "Which country has the most natural lakes?",
    options: ["Russia", "Brazil", "USA", "Canada"],
    correctIndex: 3,
    hint: "A North American country bordering the USA",
    category: "geography",
  },
  {
    id: "geo5",
    question: "What is the smallest country by land area?",
    options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
    correctIndex: 2,
    hint: "It is located within the city of Rome",
    category: "geography",
  },
  {
    id: "geo6",
    question: "Which continent is the largest by area?",
    options: ["Africa", "Asia", "North America", "Europe"],
    correctIndex: 1,
    hint: "It is home to over 4 billion people",
    category: "geography",
  },
  {
    id: "geo7",
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
    correctIndex: 3,
    hint: "Not the largest city, but the official capital",
    category: "geography",
  },
  {
    id: "geo8",
    question: "What is the highest mountain in Africa?",
    options: ["Mount Kenya", "Mount Kilimanjaro", "Rwenzori", "Atlas Peak"],
    correctIndex: 1,
    hint: "Located in Tanzania, near the Kenyan border",
    category: "geography",
  },
  {
    id: "geo9",
    question: "Which body of water is considered the saltiest?",
    options: ["Red Sea", "Mediterranean", "Dead Sea", "Caspian Sea"],
    correctIndex: 2,
    hint: "You can float effortlessly on its surface",
    category: "geography",
  },
  {
    id: "geo10",
    question: "Which country has the world's longest coastline?",
    options: ["Norway", "Australia", "Canada", "Russia"],
    correctIndex: 2,
    hint: "It also has the most natural lakes in the world",
    category: "geography",
  },
];

const sportsQuestions: Question[] = [
  {
    id: "spo1",
    question: "How many players are on a soccer team?",
    options: ["9", "10", "11", "12"],
    correctIndex: 2,
    hint: "Standard FIFA regulation for field players",
    category: "sports",
  },
  {
    id: "spo2",
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Argentina", "Italy", "Brazil"],
    correctIndex: 3,
    hint: "Known for its samba-style football",
    category: "sports",
  },
  {
    id: "spo3",
    question: "How many rings appear on the Olympic flag?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    hint: "One ring represents each inhabited continent",
    category: "sports",
  },
  {
    id: "spo4",
    question: "Which sport uses a shuttlecock?",
    options: ["Tennis", "Squash", "Badminton", "Racquetball"],
    correctIndex: 2,
    hint: "Often played in parks and gardens",
    category: "sports",
  },
  {
    id: "spo5",
    question: "What is the maximum score in ten-pin bowling?",
    options: ["200", "250", "300", "350"],
    correctIndex: 2,
    hint: "Requires 12 consecutive strikes",
    category: "sports",
  },
  {
    id: "spo6",
    question: "How long is a marathon race?",
    options: ["26.2 miles", "24 miles", "30 km", "50 km"],
    correctIndex: 0,
    hint: "Inspired by Greek messenger Pheidippides",
    category: "sports",
  },
  {
    id: "spo7",
    question: "In which sport is a 'birdie' one under par?",
    options: ["Basketball", "Golf", "Tennis", "Cricket"],
    correctIndex: 1,
    hint: "Played on greens and fairways",
    category: "sports",
  },
  {
    id: "spo8",
    question: "How many players does each basketball team have on court?",
    options: ["4", "5", "6", "7"],
    correctIndex: 1,
    hint: "Five on each side of the court",
    category: "sports",
  },
  {
    id: "spo9",
    question: "What is a score of 40-40 called in tennis?",
    options: ["Tie", "Even", "Deuce", "Love"],
    correctIndex: 2,
    hint: "From the French word meaning 'two'",
    category: "sports",
  },
  {
    id: "spo10",
    question: "How many Olympic gold medals did Michael Phelps win?",
    options: ["19", "21", "23", "25"],
    correctIndex: 2,
    hint: "He is the most decorated Olympian of all time",
    category: "sports",
  },
];

const scienceQuestions: Question[] = [
  {
    id: "sci1",
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctIndex: 2,
    hint: "From the Latin word 'Aurum'",
    category: "science",
  },
  {
    id: "sci2",
    question: "How many bones are in the adult human body?",
    options: ["196", "206", "216", "226"],
    correctIndex: 1,
    hint: "Babies are born with about 270 bones",
    category: "science",
  },
  {
    id: "sci3",
    question: "Which planet is called the Red Planet?",
    options: ["Venus", "Mars", "Saturn", "Jupiter"],
    correctIndex: 1,
    hint: "Named after the Roman god of war",
    category: "science",
  },
  {
    id: "sci4",
    question: "What is known as the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"],
    correctIndex: 2,
    hint: "It produces ATP through cellular respiration",
    category: "science",
  },
  {
    id: "sci5",
    question: "What is the atomic number of hydrogen?",
    options: ["1", "2", "3", "4"],
    correctIndex: 0,
    hint: "The simplest and most abundant element in the universe",
    category: "science",
  },
  {
    id: "sci6",
    question: "What gas makes up most of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Argon", "Nitrogen"],
    correctIndex: 3,
    hint: "It makes up about 78% of what we breathe",
    category: "science",
  },
  {
    id: "sci7",
    question: "What is the hardest natural substance on Earth?",
    options: ["Steel", "Quartz", "Ruby", "Diamond"],
    correctIndex: 3,
    hint: "It scores 10 on the Mohs hardness scale",
    category: "science",
  },
  {
    id: "sci8",
    question: "How many chromosomes do humans typically have?",
    options: ["23", "44", "46", "48"],
    correctIndex: 2,
    hint: "They come in 23 pairs",
    category: "science",
  },
  {
    id: "sci9",
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctIndex: 1,
    hint: "Famous for its beautiful ring system",
    category: "science",
  },
  {
    id: "sci10",
    question: "Approximately what is the speed of light in a vacuum?",
    options: ["200,000 km/s", "250,000 km/s", "300,000 km/s", "350,000 km/s"],
    correctIndex: 2,
    hint: "About 186,000 miles per second",
    category: "science",
  },
];

const historyQuestions: Question[] = [
  {
    id: "his1",
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctIndex: 2,
    hint: "Atomic bombs were dropped on Japan this year",
    category: "history",
  },
  {
    id: "his2",
    question: "Who was the first President of the United States?",
    options: ["John Adams", "Thomas Jefferson", "Benjamin Franklin", "George Washington"],
    correctIndex: 3,
    hint: "His portrait appears on the one-dollar bill",
    category: "history",
  },
  {
    id: "his3",
    question: "Who invented the telephone?",
    options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"],
    correctIndex: 2,
    hint: "He patented his invention in 1876",
    category: "history",
  },
  {
    id: "his4",
    question: "When did the Berlin Wall fall?",
    options: ["1985", "1987", "1989", "1991"],
    correctIndex: 2,
    hint: "The Cold War was coming to an end",
    category: "history",
  },
  {
    id: "his5",
    question: "Who was the last pharaoh of Ancient Egypt?",
    options: ["Nefertiti", "Cleopatra", "Hatshepsut", "Ramesses II"],
    correctIndex: 1,
    hint: "Famous for her alliances with Julius Caesar and Mark Antony",
    category: "history",
  },
  {
    id: "his6",
    question: "In what year did the French Revolution begin?",
    options: ["1776", "1782", "1789", "1793"],
    correctIndex: 2,
    hint: "The year the Bastille prison was stormed",
    category: "history",
  },
  {
    id: "his7",
    question: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
    correctIndex: 2,
    hint: "Also known as Lisa Gherardini",
    category: "history",
  },
  {
    id: "his8",
    question: "When did Apollo 11 first land humans on the Moon?",
    options: ["1965", "1967", "1969", "1971"],
    correctIndex: 2,
    hint: "Neil Armstrong was the first to step on the lunar surface",
    category: "history",
  },
  {
    id: "his9",
    question: "What ancient wonder was located in Alexandria, Egypt?",
    options: ["Hanging Gardens", "Great Pyramid", "Lighthouse", "Colossus"],
    correctIndex: 2,
    hint: "It helped sailors navigate the Mediterranean Sea",
    category: "history",
  },
  {
    id: "his10",
    question: "How long did the Hundred Years' War actually last?",
    options: ["100 years", "112 years", "116 years", "125 years"],
    correctIndex: 2,
    hint: "It lasted even longer than its name suggests",
    category: "history",
  },
];

export const questionsByCategory: Record<Category, Question[]> = {
  geography: geographyQuestions,
  sports: sportsQuestions,
  science: scienceQuestions,
  history: historyQuestions,
};

export function getQuestionsForCategory(category: Category): Question[] {
  const qs = [...questionsByCategory[category]];
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }
  return qs;
}
