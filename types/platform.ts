export type CategoryType = "notes" | "insem_pyq" | "endsem_pyq" | "solved";

export type University = "SPPU" | "MSBTE";

export type AcademicSubject = {
  id: string;
  university: University;
  patternScheme: string;
  branch: string;
  year: number;
  semester: number;
  subjectName: string;
  subjectSlug: string;
  subjectCode?: string;
  regulationYear?: string;
  createdAt: string;
};

export type EducationResource = {
  id: string;
  subjectId?: string;
  university: University;
  patternScheme: string;
  branch: string;
  year: number;
  semester: number;
  subjectName: string;
  subjectSlug: string;
  categoryType: CategoryType;
  fileTitle: string;
  fileUrl: string;
  filePath?: string;
  examYear?: string;
  downloadCount: number;
  isTrending: boolean;
  createdAt: string;
};

export type BomItem = {
  item: string;
  link?: string;
};

export type Project = {
  id: string;
  projectSlug: string;
  title: string;
  projectTier: "basic" | "advanced" | "premium";
  categoryTag: "Basic" | "Advanced" | "Premium" | "IoT" | "Robotics";
  imageUrl: string;
  youtubeUrl: string;
  theoryContent: string;
  bomList: BomItem[];
  reportUrl: string;
  codeString: string;
  codeFileUrl?: string;
  relatedKitSlug?: string;
  createdAt: string;
};

export type StoreKit = {
  id: string;
  productSlug: string;
  title: string;
  category: "Robotics Kits" | "Embedded Systems" | "Electronics DIY" | "IoT Automation";
  summary: string;
  mrp: number;
  sellingPrice: number;
  stockStatus: boolean;
  imageGallery: string[];
  technicalSpecs: Record<string, string>;
  whatsInBox: string[];
  warrantyInfo: string;
  returnPolicy: string;
  weightGrams: number | null;
  packageLengthCm: number | null;
  packageWidthCm: number | null;
  packageHeightCm: number | null;
  availabilityStatus: "available" | "coming_soon" | "out_of_stock";
  createdAt: string;
};

export type GameScript = {
  id: string;
  slug: string;
  title: string;
  description: string;
  channel: "projectskatta" | "projectskatta_gaming";
  youtubeUrl: string;
  promoVideoId?: string;
  gameFileUrl?: string;
  thumbnailUrl?: string;
  sourceCode: string;
  sourceCodeFileUrl?: string;
};

export type VideoPoolItem = {
  id: string;
  youtubeVideoId: string;
  videoDescription: string;
  isPrimary: boolean;
  clickCount: number;
};
