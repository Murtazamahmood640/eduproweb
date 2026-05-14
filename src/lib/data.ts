export interface Module {
  title: string;
  duration: string;
  lessons: string[];
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  experience?: string;
  achievements?: string[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructorId: string;
  rating: number;
  students: number;
  price: string;
  image: string;
  demoVideo?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  outline: Module[];
}

export const TEACHERS: Teacher[] = [
  {
    id: "uzma-siraj",
    name: "Uzma Siraj",
    role: "Elite Urdu Language Specialist",
    specialty: "O/A Level Urdu & Literature",
    rating: 4.9,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800",
    bio: "Uzma Siraj is a legendary Urdu educator in Pakistan with over 20 years of experience. She has pioneered modern methods to teach classical Urdu literature, helping thousands of students secure A* grades in O and A Levels.",
    experience: "22 Years",
    achievements: ["Best Regional Teacher Award 2022", "Author of 3 O-Level Guidebooks"],
  },
  {
    id: "waleed-anwar",
    name: "Waleed Anwar",
    role: "Senior Mathematics Examiner",
    specialty: "Mathematics O/A Levels (4024/9709)",
    rating: 5.0,
    reviews: 5400,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800",
    bio: "Waleed Anwar is widely regarded as one of Pakistan's top Mathematics instructors. Known for his 'Waleed Method' of simplifying complex calculus and mechanics, he ensures that students don't just solve problems, but master the logic behind them.",
    experience: "15 Years",
    achievements: ["CIE Certified Trainer", "1000+ A* Grades in 2023"],
  },
  {
    id: "zain-qamar",
    name: "Zain Qamar",
    role: "Physics Master Instructor",
    specialty: "Physics O/A Levels (5054/9702)",
    rating: 4.9,
    reviews: 3200,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=800",
    bio: "Zain Qamar brings Physics to life with practical demonstrations and deep conceptual clarity. His expertise in A-Level Physics Paper 5 (Planning, Analysis, and Evaluation) is unmatched.",
    experience: "12 Years",
    achievements: ["Physics Olympiad Mentor", "Guest Speaker at National Science Portal"],
  },
  {
    id: "kashif-ismail",
    name: "Kashif Ismail",
    role: "Lead Chemistry Consultant",
    specialty: "O/A Level Chemistry",
    rating: 4.8,
    reviews: 1800,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600&h=800",
    bio: "Kashif Ismail specializes in Organic Chemistry, making it easy to understand through 3D visualization and mechanism mapping. He has a track record of helping students bridge the gap from IGCSE to A-Level Chemistry.",
    experience: "10 Years",
  },
  {
    id: "sijra-teacher",
    name: "Sijra",
    role: "English Language & IELTS Expert",
    specialty: "English (1123/8021/9093) & IELTS",
    rating: 4.9,
    reviews: 2800,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600&h=800",
    bio: "Sijra is a Cambridge certified English teacher focusing on creative writing and reading comprehension. She provides personalized feedback on essays, helping students achieve Band 8.5+ in IELTS and A* in O-Level English.",
    experience: "8 Years",
  },
  {
    id: "hans-muller",
    name: "Hans Muller",
    role: "Native German Language Instructor",
    specialty: "German A1-C2 & TestDaF",
    rating: 4.7,
    reviews: 1100,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800",
    bio: "Hans Muller is a native German speaker with a passion for teaching language through culture. He uses immersive techniques to help students achieve fluency and pass the Goethe/TestDaF examinations for German university admissions.",
    experience: "14 Years",
  },
];

export const COURSES: Course[] = [
  {
    id: "math-o-level",
    title: "Mathematics O Level (4024) — Complete Mastery",
    category: "Mathematics",
    instructorId: "waleed-anwar",
    rating: 5.0,
    students: 15200,
    price: "PKR 15,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/sample.mp4",
    level: "Intermediate",
    description: "This course covers the entire O Level Mathematics syllabus (4024). From basic algebra to advanced trigonometry and statistics, Waleed Anwar guides you through every concept with past paper practice from the last 20 years.",
    outline: [
      { title: "Algebra & Equations", duration: "10 hours", lessons: ["Linear Equations", "Quadratic Factoring", "Simultaneous Equations", "Inequalities"] },
      { title: "Trigonometry & Geometry", duration: "12 hours", lessons: ["Pythagoras Theorem", "Sine & Cosine Rules", "Circle Properties", "Similarity & Congruence"] },
      { title: "Calculus & Functions", duration: "8 hours", lessons: ["Introduction to Differentiation", "Gradient Functions", "Function Notation", "Inverse Functions"] },
      { title: "Probability & Statistics", duration: "6 hours", lessons: ["Relative Frequency", "Cumulative Frequency", "Standard Deviation", "Tree Diagrams"] },
    ],
  },
  {
    id: "physics-a-level",
    title: "Physics A Level (9702) — The Ultimate Prep",
    category: "Science",
    instructorId: "zain-qamar",
    rating: 4.9,
    students: 8400,
    price: "PKR 18,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/physics-demo.mp4",
    level: "Advanced",
    description: "Master the complexities of A Level Physics with Zain Qamar. This course focuses on deep conceptual understanding of mechanics, fields, and particle physics, with a special module dedicated to A-Level Practical Skills (Paper 3 & 5).",
    outline: [
      { title: "Mechanics & Fluids", duration: "15 hours", lessons: ["Kinematics", "Dynamics", "Forces & Torques", "Work, Energy & Power"] },
      { title: "Electric & Magnetic Fields", duration: "14 hours", lessons: ["Coulomb's Law", "Electric Potential", "Magnetic Induction", "Lenz's Law"] },
      { title: "Nuclear & Particle Physics", duration: "10 hours", lessons: ["Radioactivity", "Standard Model", "Binding Energy", "Mass Defect"] },
      { title: "Oscillations & Waves", duration: "12 hours", lessons: ["SHM", "Superposition", "Stationary Waves", "Doppler Effect"] },
    ],
  },
  {
    id: "english-language-ielts",
    title: "English Mastery: IGCSE & IELTS Band 8.5+",
    category: "Languages",
    instructorId: "sijra-teacher",
    rating: 4.9,
    students: 12500,
    price: "PKR 12,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/english-demo.mp4",
    level: "Intermediate",
    description: "Designed for both IGCSE students and IELTS aspirants. Sijra teaches you the art of high-impact writing, sophisticated vocabulary, and critical listening skills required to excel in international English examinations.",
    outline: [
      { title: "Writing Excellence", duration: "10 hours", lessons: ["Narrative Writing", "Descriptive Essays", "Argumentative Techniques", "Directed Writing"] },
      { title: "Reading & Comprehension", duration: "8 hours", lessons: ["Skimming & Scanning", "Identifying Implicit Meaning", "Writer's Effects", "Summary Writing"] },
      { title: "IELTS Speaking & Listening", duration: "12 hours", lessons: ["Fluency & Cohesion", "Lexical Resource", "Accents & Intonation", "Multiple Choice Strategies"] },
    ],
  },
  {
    id: "german-a1-beginner",
    title: "German A1: Foundation for Foreign Education",
    category: "Languages",
    instructorId: "hans-muller",
    rating: 4.7,
    students: 4200,
    price: "PKR 10,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/german-demo.mp4",
    level: "Beginner",
    description: "Start your journey towards studying in Germany. Hans Muller teaches the basics of German grammar, greetings, and daily conversations, specifically tailored for students planning to move to Germany for higher education.",
    outline: [
      { title: "Greetings & Basics", duration: "6 hours", lessons: ["Alphabets & Pronunciation", "Self Introduction", "Numbers & Dates", "Days of the Week"] },
      { title: "Essential Grammar", duration: "12 hours", lessons: ["Nouns & Articles", "Verb Conjugations", "Sentence Structure", "Prepositions"] },
      { title: "Daily Life in Germany", duration: "10 hours", lessons: ["Ordering Food", "Asking for Directions", "Shopping", "Health & Doctor visits"] },
    ],
  },
  {
    id: "chemistry-o-level",
    title: "Chemistry O Level (5070) — Complete Series",
    category: "Science",
    instructorId: "kashif-ismail",
    rating: 4.8,
    students: 6800,
    price: "PKR 14,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/chemistry-demo.mp4",
    level: "Intermediate",
    description: "Master Chemistry O Level with Kashif Ismail. From atomic structure to organic chemistry, this comprehensive course uses visual learning and practical demonstrations to make complex concepts simple.",
    outline: [
      { title: "Atomic Structure & Bonding", duration: "9 hours", lessons: ["Electrons & Orbitals", "Ionic Bonding", "Covalent Bonding", "Metallic Bonding"] },
      { title: "Chemical Reactions", duration: "11 hours", lessons: ["Oxidation & Reduction", "Equilibrium", "Acid-Base Chemistry", "Reaction Rates"] },
      { title: "Organic Chemistry", duration: "10 hours", lessons: ["Hydrocarbons", "Functional Groups", "Reaction Mechanisms", "Polymers"] },
      { title: "Practical Skills & Lab", duration: "6 hours", lessons: ["Titrations", "Qualitative Analysis", "Lab Safety", "Data Handling"] },
    ],
  },
  {
    id: "urdu-a-level",
    title: "Urdu Literature A Level — Classical & Modern",
    category: "Languages",
    instructorId: "uzma-siraj",
    rating: 4.9,
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/urdu-demo.mp4",
    students: 5600,
    price: "PKR 13,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1507842217343-583f7270bfba?auto=format&fit=crop&q=80&w=800&h=500",
    level: "Advanced",
    description: "Explore the richness of Urdu literature from classical poetry to modern prose. Uzma Siraj guides students through critical analysis and creative writing in Urdu, ensuring excellence in A Level examinations.",
    outline: [
      { title: "Classical Poetry", duration: "12 hours", lessons: ["Ghazal Tradition", "Iqbal's Philosophy", "Metaphor & Symbolism", "Critical Analysis"] },
      { title: "Modern Literature", duration: "10 hours", lessons: ["Short Stories", "Novels & Narratives", "Contemporary Writers", "Literary Devices"] },
      { title: "Writing Skills", duration: "8 hours", lessons: ["Essay Writing", "Creative Composition", "Critical Response", "Exam Technique"] },
    ],
  },
  {
    id: "mathematics-a-level",
    title: "Mathematics A Level (9709) — Advanced Mastery",
    category: "Mathematics",
    instructorId: "waleed-anwar",
    rating: 5.0,
    students: 9200,
    price: "PKR 16,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1453847585129-71efb826e8c1?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/math-advanced-demo.mp4",
    level: "Advanced",
    description: "Progress to A Level Mathematics with Waleed Anwar's proven 'Waleed Method'. This course covers pure mathematics, mechanics, and statistics with extensive past paper solutions from CIE.",
    outline: [
      { title: "Pure Mathematics 1", duration: "14 hours", lessons: ["Complex Numbers", "Polynomials", "Series & Sequences", "Differentiation & Integration"] },
      { title: "Pure Mathematics 2", duration: "12 hours", lessons: ["Trigonometric Functions", "Logarithms & Exponentials", "Vectors", "Calculus Applications"] },
      { title: "Mechanics & Statistics", duration: "10 hours", lessons: ["Forces & Motion", "Probability Distributions", "Hypothesis Testing", "Regression"] },
    ],
  },
  {
    id: "biology-o-level",
    title: "Biology O Level (5090) — Life Sciences Complete",
    category: "Science",
    instructorId: "zain-qamar",
    rating: 4.9,
    students: 7100,
    price: "PKR 14,500",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/biology-demo.mp4",
    level: "Intermediate",
    description: "Comprehensive Biology O Level course covering cells, genetics, ecology, and human physiology. Expert-led with real lab demonstrations and past paper mastery.",
    outline: [
      { title: "Cell Biology & Microscopy", duration: "8 hours", lessons: ["Cell Structure", "Organelles", "Cellular Transport", "Microscope Use"] },
      { title: "Genetics & Evolution", duration: "10 hours", lessons: ["DNA & Genes", "Inheritance Patterns", "Evolution", "Natural Selection"] },
      { title: "Ecology & Plant Biology", duration: "9 hours", lessons: ["Ecosystems", "Food Chains", "Photosynthesis", "Plant Transport"] },
      { title: "Human Body Systems", duration: "8 hours", lessons: ["Respiration", "Circulation", "Digestion", "Excretion"] },
    ],
  },
  {
    id: "islamic-studies",
    title: "Islamic Studies O Level (2011) — Mastery Program",
    category: "Social Studies",
    instructorId: "uzma-siraj",
    rating: 4.8,
    students: 5600,
    price: "PKR 11,500",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/islamic-studies-demo.mp4",
    level: "Intermediate",
    description: "Detailed Islamic Studies O Level course covering Islamic beliefs, practices, history, and ethics with scholarly depth and contemporary relevance.",
    outline: [
      { title: "Islamic Beliefs & Practices", duration: "9 hours", lessons: ["Tawheed", "The Five Pillars", "Prophet Muhammad", "The Qur'an"] },
      { title: "Islamic History", duration: "10 hours", lessons: ["Early Islamic State", "Golden Age", "Ottoman Empire", "Modern Islam"] },
      { title: "Islamic Law & Ethics", duration: "8 hours", lessons: ["Shariah Principles", "Islamic Finance", "Medical Ethics", "Social Justice"] },
    ],
  },
  {
    id: "english-literature-a-level",
    title: "English Literature A Level (9093) — Textual Analysis",
    category: "Languages",
    instructorId: "sijra-teacher",
    rating: 4.9,
    students: 8900,
    price: "PKR 15,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1507842217343-583f7270bfba?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/english-literature-demo.mp4",
    level: "Advanced",
    description: "Master A Level English Literature with deep textual analysis, critical perspectives, and essay writing excellence. Study Shakespeare, poetry, and contemporary works.",
    outline: [
      { title: "Shakespeare Studies", duration: "12 hours", lessons: ["Hamlet", "Macbeth", "Character Analysis", "Dramatic Techniques"] },
      { title: "Poetry Analysis", duration: "10 hours", lessons: ["Romantic Poetry", "Modern Poetry", "Form & Structure", "Critical Interpretation"] },
      { title: "Prose & Essays", duration: "9 hours", lessons: ["Novel Analysis", "Critical Reading", "Essay Structure", "Academic Writing"] },
    ],
  },
  {
    id: "commerce-o-level",
    title: "Commerce O Level (7100) — Business Fundamentals",
    category: "Business",
    instructorId: "waleed-anwar",
    rating: 4.7,
    students: 4500,
    price: "PKR 12,000",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/commerce-demo.mp4",
    level: "Intermediate",
    description: "Complete Commerce O Level covering business organization, accounting principles, economics, and trade. Real-world case studies and practical applications included.",
    outline: [
      { title: "Business Organization", duration: "8 hours", lessons: ["Business Types", "Ownership", "Sole Traders", "Partnerships & Companies"] },
      { title: "Accounting Basics", duration: "10 hours", lessons: ["Double Entry", "Trial Balance", "Profit & Loss", "Balance Sheet"] },
      { title: "Economics & Trade", duration: "9 hours", lessons: ["Supply & Demand", "Money", "International Trade", "Banking"] },
    ],
  },
  {
    id: "french-beginner",
    title: "French A1: Beginner's Gateway",
    category: "Languages",
    instructorId: "hans-muller",
    rating: 4.6,
    students: 3200,
    price: "PKR 9,500",
    image: "https://res.cloudinary.com/demo/image/fetch/w_800,h=500,c_fill/https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=500",
    demoVideo: "https://res.cloudinary.com/demo/video/upload/v1/french-demo.mp4",
    level: "Beginner",
    description: "Start learning French from scratch. Perfect for those planning European studies or looking to add a Romance language to their skillset.",
    outline: [
      { title: "Fundamentals", duration: "6 hours", lessons: ["Pronunciation", "Basic Greetings", "Numbers", "Days & Months"] },
      { title: "Essential Grammar", duration: "10 hours", lessons: ["Verbs", "Adjectives", "Sentence Structure", "Question Formation"] },
      { title: "Practical Communication", duration: "8 hours", lessons: ["Ordering Food", "Directions", "Shopping", "Hotel Check-in"] },
    ],
  },
];


export const getTeacherById = (id: string) => TEACHERS.find((t) => t.id === id);
export const getCoursesByTeacherId = (teacherId: string) =>
  COURSES.filter((c) => c.instructorId === teacherId);
export const getCourseById = (id: string) => COURSES.find((c) => c.id === id);
