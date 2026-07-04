import type {
  AcademicSubject,
  EducationResource,
  GameScript,
  Project,
  StoreKit,
  VideoPoolItem
} from "@/types/platform";

export const universities = ["SPPU", "MSBTE"] as const;

export const schemesByUniversity = {
  SPPU: ["2024 Pattern", "2019 Pattern"],
  MSBTE: ["K-Scheme", "I-Scheme"]
} as const;

export const branchesByUniversity = {
  SPPU: [
    "First Year Engineering",
    "Computer Engineering",
    "Information Technology",
    "Electronics & Telecommunication Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Artificial Intelligence and Data Science"
  ],
  MSBTE: [
    "Computer Engineering",
    "Information Technology",
    "Electronics & Telecommunication Engineering",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Artificial Intelligence and Machine Learning",
    "Automation and Robotics"
  ]
} as const;

export const branches = Array.from(new Set([...branchesByUniversity.SPPU, ...branchesByUniversity.MSBTE]));

export const yearsByUniversity = {
  SPPU: [1, 2, 3, 4],
  MSBTE: [1, 2, 3]
} as const;

export const semesters = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const categoryTypeLabels = {
  notes: "Study Notes",
  insem_pyq: "In-Sem PYQs",
  endsem_pyq: "End-Sem PYQs",
  solved: "Solved Papers"
} as const;

type SubjectSeed = {
  university: AcademicSubject["university"];
  patternScheme: string;
  branch: string;
  semester: number;
  subjectName: string;
  subjectCode?: string;
  regulationYear?: string;
};

function yearFromSemester(semester: number) {
  return Math.ceil(semester / 2);
}

function slugifySubject(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const subjectSeeds: SubjectSeed[] = [
  ["Engineering Mathematics I", "EM-I", 1],
  ["Engineering Physics", "EPH", 1],
  ["Engineering Chemistry", "ECH", 1],
  ["Basic Electrical and Electronics Engineering", "BEEE", 1],
  ["Programming and Problem Solving", "PPS", 1],
  ["Engineering Mathematics II", "EM-II", 2],
  ["Engineering Mechanics", "EM", 2],
  ["Engineering Graphics", "EG", 2],
  ["Design Thinking and Idea Lab", "DTIL", 2],
  ["Project Based Learning", "PBL", 2]
].map(([subjectName, subjectCode, semester]) => ({
  university: "SPPU",
  patternScheme: "2024 Pattern",
  branch: "First Year Engineering",
  semester: Number(semester),
  subjectName: String(subjectName),
  subjectCode: String(subjectCode),
  regulationYear: "2024"
}));

const sppu2019Seeds: SubjectSeed[] = [
  ["Computer Engineering", 3, "Discrete Mathematics", "DM"],
  ["Computer Engineering", 3, "Fundamentals of Data Structures", "FDS"],
  ["Computer Engineering", 3, "Object Oriented Programming", "OOP"],
  ["Computer Engineering", 3, "Computer Graphics", "CG"],
  ["Computer Engineering", 3, "Digital Electronics and Logic Design", "DELD"],
  ["Computer Engineering", 4, "Engineering Mathematics III", "EM-III"],
  ["Computer Engineering", 4, "Data Structures and Algorithms", "DSA"],
  ["Computer Engineering", 4, "Software Engineering", "SE"],
  ["Computer Engineering", 4, "Microprocessor", "MP"],
  ["Computer Engineering", 4, "Principles of Programming Languages", "PPL"],
  ["Computer Engineering", 5, "Database Management Systems", "DBMS"],
  ["Computer Engineering", 5, "Theory of Computation", "TOC"],
  ["Computer Engineering", 5, "Systems Programming and Operating System", "SPOS"],
  ["Computer Engineering", 5, "Computer Networks and Security", "CNS"],
  ["Computer Engineering", 6, "Data Science and Big Data Analytics", "DSBDA"],
  ["Computer Engineering", 6, "Web Technology", "WT"],
  ["Computer Engineering", 6, "Artificial Intelligence", "AI"],
  ["Computer Engineering", 6, "Cloud Computing", "CC"],
  ["Electronics & Telecommunication Engineering", 3, "Engineering Mathematics III", "EM-III"],
  ["Electronics & Telecommunication Engineering", 3, "Electronic Circuits", "EC"],
  ["Electronics & Telecommunication Engineering", 3, "Digital Electronics", "DE"],
  ["Electronics & Telecommunication Engineering", 3, "Network Theory", "NT"],
  ["Electronics & Telecommunication Engineering", 4, "Signals and Systems", "SS"],
  ["Electronics & Telecommunication Engineering", 4, "Control Systems", "CS"],
  ["Electronics & Telecommunication Engineering", 4, "Analog Communication", "AC"],
  ["Electronics & Telecommunication Engineering", 4, "Microcontrollers", "MC"],
  ["Mechanical Engineering", 3, "Engineering Mathematics III", "EM-III"],
  ["Mechanical Engineering", 3, "Strength of Materials", "SOM"],
  ["Mechanical Engineering", 3, "Thermodynamics", "TD"],
  ["Mechanical Engineering", 3, "Fluid Mechanics", "FM"],
  ["Mechanical Engineering", 4, "Theory of Machines I", "TOM-I"],
  ["Mechanical Engineering", 4, "Manufacturing Processes", "MP"],
  ["Mechanical Engineering", 4, "Material Science", "MS"],
  ["Electrical Engineering", 3, "Engineering Mathematics III", "EM-III"],
  ["Electrical Engineering", 3, "Electrical Machines I", "EM-I"],
  ["Electrical Engineering", 3, "Power System I", "PS-I"],
  ["Electrical Engineering", 3, "Network Analysis", "NA"],
  ["Civil Engineering", 3, "Engineering Mathematics III", "EM-III"],
  ["Civil Engineering", 3, "Building Technology and Materials", "BTM"],
  ["Civil Engineering", 3, "Surveying", "SUR"],
  ["Civil Engineering", 3, "Strength of Materials", "SOM"]
].map(([branch, semester, subjectName, subjectCode]) => ({
  university: "SPPU",
  patternScheme: "2019 Pattern",
  branch: String(branch),
  semester: Number(semester),
  subjectName: String(subjectName),
  subjectCode: String(subjectCode),
  regulationYear: "2019"
}));

const msbteFallbackSeeds: SubjectSeed[] = [
  ["Computer Engineering", "K-Scheme", 1, "Basic Mathematics", "BMS"],
  ["Computer Engineering", "K-Scheme", 1, "Communication Skills (English)", "ENG"],
  ["Computer Engineering", "K-Scheme", 1, "Programming in C", "PIC"],
  ["Computer Engineering", "K-Scheme", 2, "Applied Mathematics", "AMS"],
  ["Computer Engineering", "K-Scheme", 3, "Data Structures Using C", "DSU"],
  ["Computer Engineering", "K-Scheme", 4, "Java Programming", "JPR"],
  ["Computer Engineering", "K-Scheme", 5, "Data Communication and Computer Network", "DCN"],
  ["Computer Engineering", "K-Scheme", 6, "Emerging Trends in Computer Engineering and Information Technology", "ETI"],
  ["Electronics & Telecommunication Engineering", "K-Scheme", 3, "Digital Techniques", "DTE"],
  ["Electronics & Telecommunication Engineering", "K-Scheme", 4, "Microcontroller Applications", "MIC"],
  ["Electronics & Telecommunication Engineering", "I-Scheme", 5, "Microcontroller and Applications", "MCA"],
  ["Mechanical Engineering", "K-Scheme", 3, "Strength of Materials", "SOM"],
  ["Electrical Engineering", "K-Scheme", 3, "Electrical Circuits and Networks", "ECN"],
  ["Civil Engineering", "K-Scheme", 3, "Building Construction", "BCO"]
].map(([branch, patternScheme, semester, subjectName, subjectCode]) => ({
  university: "MSBTE",
  patternScheme: String(patternScheme),
  branch: String(branch),
  semester: Number(semester),
  subjectName: String(subjectName),
  subjectCode: String(subjectCode),
  regulationYear: String(patternScheme)
}));

export const subjectCatalog: AcademicSubject[] = [...subjectSeeds, ...sppu2019Seeds, ...msbteFallbackSeeds].map(
  (item) => {
    const subjectSlug = slugifySubject(item.subjectName);

    return {
      id: `subject-${slugifySubject(item.university)}-${slugifySubject(item.patternScheme)}-${slugifySubject(item.branch)}-${item.semester}-${subjectSlug}`,
      university: item.university,
      patternScheme: item.patternScheme,
      branch: item.branch,
      year: yearFromSemester(item.semester),
      semester: item.semester,
      subjectName: item.subjectName,
      subjectSlug,
      subjectCode: item.subjectCode,
      regulationYear: item.regulationYear,
      createdAt: "2026-07-02T00:00:00.000Z"
    };
  }
);

export const educationResources: EducationResource[] = [];

export const projects: Project[] = [
  {
    id: "project-line-follower",
    projectSlug: "line-follower-robot-pid",
    title: "Line Follower Robot with PID Control",
    projectTier: "basic",
    categoryTag: "Robotics",
    imageUrl: "/images/hero-lab.png",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    theoryContent:
      "A reliable line follower uses infrared reflectance sensors to detect contrast and a PID loop to correct motor speed in real time. The project teaches sensor calibration, motor driver control, error calculation, and practical tuning.",
    bomList: [
      { item: "Arduino Uno" },
      { item: "L298N Motor Driver" },
      { item: "IR Sensor Array" },
      { item: "BO Motors and Chassis" },
      { item: "7.4V Battery Pack" }
    ],
    reportUrl: "https://example.com/line-follower-report.pdf",
    codeString:
      "int error = readLineSensors();\nint correction = kp * error + kd * (error - lastError);\nleftMotor(baseSpeed - correction);\nrightMotor(baseSpeed + correction);\nlastError = error;",
    relatedKitSlug: "pid-line-follower-kit",
    createdAt: "2026-06-26T09:00:00.000Z"
  },
  {
    id: "project-esp32-home",
    projectSlug: "esp32-home-automation",
    title: "ESP32 Home Automation Controller",
    projectTier: "advanced",
    categoryTag: "IoT",
    imageUrl: "/images/hero-lab.png",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    theoryContent:
      "ESP32 connects relay modules to a Wi-Fi dashboard so appliances can be switched from a phone. The project introduces GPIO isolation, relay safety, network setup, and mobile control flow.",
    bomList: [
      { item: "ESP32 Dev Board" },
      { item: "4-Channel Relay Module" },
      { item: "5V Power Supply" },
      { item: "Jumper Wires" }
    ],
    reportUrl: "https://example.com/esp32-home-automation-report.pdf",
    codeString:
      "#include <WiFi.h>\nconst int relayPin = 26;\nvoid setup(){ pinMode(relayPin, OUTPUT); }\nvoid loop(){ digitalWrite(relayPin, HIGH); }",
    relatedKitSlug: "esp32-iot-relay-kit",
    createdAt: "2026-06-20T10:15:00.000Z"
  },
  {
    id: "project-digital-meter",
    projectSlug: "mini-digital-multimeter",
    title: "Mini Digital Multimeter",
    projectTier: "basic",
    categoryTag: "Basic",
    imageUrl: "/images/hero-lab.png",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    theoryContent:
      "This beginner electronics project measures voltage and resistance using ADC readings and divider networks. It is a strong submission project for diploma electronics labs.",
    bomList: [
      { item: "Arduino Nano" },
      { item: "16x2 LCD" },
      { item: "Precision Resistors" },
      { item: "Rotary Selector" }
    ],
    reportUrl: "https://example.com/mini-digital-multimeter.pdf",
    codeString:
      "float adc = analogRead(A0);\nfloat voltage = adc * (5.0 / 1023.0);\nlcd.print(voltage);",
    createdAt: "2026-06-15T08:30:00.000Z"
  },
  {
    id: "project-balance-bot",
    projectSlug: "two-wheel-balancing-robot",
    title: "Two Wheel Balancing Robot",
    projectTier: "premium",
    categoryTag: "Advanced",
    imageUrl: "/images/hero-lab.png",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    theoryContent:
      "A compact robotics project based on IMU feedback and motor correction. It combines angle estimation, PID balancing, and mechanical weight distribution.",
    bomList: [
      { item: "MPU6050 IMU" },
      { item: "Arduino Nano" },
      { item: "Dual Motor Driver" },
      { item: "High Torque DC Motors" }
    ],
    reportUrl: "https://example.com/two-wheel-balancing-robot.pdf",
    codeString:
      "float angle = getFilteredAngle();\nfloat output = pid.compute(angle, 0);\nsetMotorSpeed(output);",
    relatedKitSlug: "balancing-robot-kit",
    createdAt: "2026-06-08T14:10:00.000Z"
  }
];

export const storeKits: StoreKit[] = [
  {
    id: "kit-line-follower",
    productSlug: "pid-line-follower-kit",
    title: "PID Line Follower Kit",
    category: "Robotics Kits",
    summary: "Complete chassis, controller, sensors, motors, and wiring for a competition-ready line follower.",
    mrp: 2499,
    sellingPrice: 1749,
    stockStatus: true,
    imageGallery: ["/images/hero-lab.png"],
    technicalSpecs: {
      Controller: "Arduino Uno compatible",
      Sensors: "5-channel IR array",
      Motor: "BO geared motors",
      Battery: "7.4V Li-ion recommended",
      Difficulty: "Beginner to intermediate"
    },
    whatsInBox: ["1x Chassis kit", "1x Arduino Uno compatible board", "1x 5-channel IR sensor array", "2x BO geared motors", "Wiring & screws"],
    warrantyInfo: "3 months warranty on electronic components.",
    returnPolicy: "7-day replacement for manufacturing defects.",
    weightGrams: 450,
    packageLengthCm: 25,
    packageWidthCm: 18,
    packageHeightCm: 8,
    availabilityStatus: "available",
    createdAt: "2026-06-25T07:00:00.000Z"
  },
  {
    id: "kit-esp32-iot",
    productSlug: "esp32-iot-relay-kit",
    title: "ESP32 IoT Relay Kit",
    category: "IoT Automation",
    summary: "Wi-Fi relay kit for home automation, mini projects, and lab demonstrations.",
    mrp: 1899,
    sellingPrice: 1399,
    stockStatus: true,
    imageGallery: ["/images/hero-lab.png"],
    technicalSpecs: {
      Controller: "ESP32 DevKit",
      Output: "4 relay channels",
      Input: "5V relay logic",
      Connectivity: "Wi-Fi 2.4GHz",
      Safety: "Opto-isolated relay board"
    },
    whatsInBox: ["1x ESP32 DevKit board", "1x 4-channel relay module", "Jumper wires", "USB cable"],
    warrantyInfo: "3 months warranty on electronic components.",
    returnPolicy: "7-day replacement for manufacturing defects.",
    weightGrams: 250,
    packageLengthCm: 20,
    packageWidthCm: 14,
    packageHeightCm: 6,
    availabilityStatus: "available",
    createdAt: "2026-06-21T07:00:00.000Z"
  },
  {
    id: "kit-basic-electronics",
    productSlug: "basic-electronics-lab-kit",
    title: "Basic Electronics Lab Kit",
    category: "Electronics DIY",
    summary: "Breadboard, resistors, ICs, sensors, jumper wires, and core lab components for first-year students.",
    mrp: 1499,
    sellingPrice: 999,
    stockStatus: true,
    imageGallery: ["/images/hero-lab.png"],
    technicalSpecs: {
      Breadboard: "830 tie points",
      ICs: "Timer, op-amp, logic gates",
      Resistors: "Common E12 values",
      LEDs: "5mm mixed colors",
      Use: "Lab practice and viva prep"
    },
    whatsInBox: ["1x Breadboard", "Assorted resistors & ICs", "Assorted LEDs", "Jumper wires"],
    warrantyInfo: "No warranty on consumable components.",
    returnPolicy: "7-day replacement for manufacturing defects.",
    weightGrams: 300,
    packageLengthCm: 22,
    packageWidthCm: 15,
    packageHeightCm: 5,
    availabilityStatus: "available",
    createdAt: "2026-06-18T07:00:00.000Z"
  }
];

export const videoRotationPool: VideoPoolItem[] = [
  {
    id: "video-pk-intro",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDescription: "ProjectsKatta intro and kit offer reel",
    isPrimary: true,
    clickCount: 84
  }
];

export const gameScripts: GameScript[] = [
  {
    id: "game-led-runner",
    slug: "led-runner",
    title: "LED Runner Canvas Game",
    description: "A small arcade demo for reels, used to gate source code behind a 10-second promo watch flow.",
    channel: "projectskatta_gaming",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    promoVideoId: "dQw4w9WgXcQ",
    gameFileUrl: "",
    thumbnailUrl: "/images/hero-lab.png",
    sourceCode:
      "const canvas = document.querySelector('canvas');\nconst ctx = canvas.getContext('2d');\nlet x = 20;\nfunction loop(){\n  ctx.clearRect(0,0,canvas.width,canvas.height);\n  ctx.fillRect(x, 80, 18, 18);\n  x = (x + 2) % canvas.width;\n  requestAnimationFrame(loop);\n}\nloop();"
  }
];

export function getTrendingItems() {
  return [
    ...subjectCatalog
      .slice(0, 4)
      .map((item) => ({
        title: item.subjectName,
        meta: `${item.university} ${item.branch} Sem ${item.semester}`,
        href: `/education?q=${encodeURIComponent(item.subjectName)}`,
        count: 0
      })),
    ...projects.slice(0, 2).map((project) => ({
      title: project.title,
      meta: project.categoryTag,
      href: `/projects/${project.projectSlug}`,
      count: 120
    }))
  ].sort((a, b) => b.count - a.count);
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.projectSlug === slug);
}

export function getStoreKitBySlug(slug: string) {
  return storeKits.find((kit) => kit.productSlug === slug);
}
