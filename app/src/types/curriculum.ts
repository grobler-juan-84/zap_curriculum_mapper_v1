export interface VocabularyItem {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  translationOrNote?: string;
  audioSample?: string;
}

export interface ActivityItem {
  id: string;
  number: number;
  title: string;
  type: 'Listening' | 'Speaking' | 'Reading' | 'Game' | 'Song/Chant' | 'Phonics';
  audioTrack?: string;
  instructions: string;
}

export interface BookContent {
  curriculumObjectives: string[];
  targetVocabulary: VocabularyItem[];
  targetLanguage: {
    question: string;
    answer: string;
    variations?: string[];
  };
  grammarFocus: string[];
  skills: string[];
  activities: ActivityItem[];
}

export interface TeachingIntelligence {
  lessonOverview: string;
  priorKnowledge: string[];
  teacherFocus: {
    recognition: string;
    productiveResponse: string;
    goal: string;
  };
  likelyDifficulties: Array<{
    issue: string;
    studentSays: string;
    targetPattern: string;
    teachingResponse: string;
  }>;
  buildsToward: Array<{
    phase: string;
    pattern: string;
  }>;
  learningProgression: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  curriculumFloor: string[];
  optionalDepth: string[];
}

export interface PageSpread {
  id: string;
  pageNumbers: string; // e.g. "6–7"
  leftPageNumber: number;
  rightPageNumber: number;
  unitNumber: number;
  unitTitle: string;
  title: string;
  subtitle: string;
  bookContent: BookContent;
  teachingIntelligence: TeachingIntelligence;
  // Visual layout simulation details for textbook pages
  visuals: {
    leftPage: {
      headerBadge: string;
      title: string;
      heroIllustrationType: 'classroom_scene' | 'backpack_items' | 'story_strip' | 'phonics_grid';
      exercise1: {
        number: string;
        text: string;
        audioTrack?: string;
        items: Array<{ id: number; label: string; x?: number; y?: number }>;
      };
      exercise2?: {
        number: string;
        text: string;
        dialogueBox?: { speakerA: string; speakerB: string };
      };
    };
    rightPage: {
      headerBadge: string;
      title: string;
      exercise3: {
        number: string;
        text: string;
        audioTrack?: string;
        grammarBanner?: { prompt: string; pattern: string };
      };
      exercise4: {
        number: string;
        text: string;
        gamePrompt?: string;
        partnerIcon?: boolean;
      };
    };
  };
}

export interface Book {
  /** Postgres `books.id` UUID. Prefer param name `bookUuid` when passing this value. */
  id: string
  /** Catalog identity from Postgres `books.book_id` (e.g. beehive_1_sb). */
  catalogBookId?: string
  seriesId: string
  title: string
  level: string
  audience: string
  totalUnits: number
  type: 'Student Book' | 'Workbook' | "Teacher's Guide"
  coverImage?: string
  /** Storage object path in book-assets bucket. */
  coverPath?: string
  colorScheme: {
    primary: string
    accent: string
    badgeBg: string
    badgeText: string
  }
  pageSpreads: PageSpread[]
}

export interface CurriculumSeries {
  id: string
  name: string
  publisher: string
  shortDesc: string
  targetAges: string
  levelsCount: number
  availableBooksCount: number
  /** Postgres UUID of the featured book (`books.id`). */
  featuredBookUuid: string
  /** Signed URL for series cover (from Storage), when available. */
  coverImage?: string
  /** Storage object path in book-assets bucket. */
  coverPath?: string
  colorScheme: {
    accent: string
    badge: string
  }
  books: Book[]
}

export type QuickActionType =
  | 'scaffold'
  | 'lesson-plan'
  | 'chalkie-prompt'
  | 'speaking-activities'
  | 'game-ideas'
  | 'likely-difficulties';

export interface ChatMessage {
  id: string;
  sender: 'teacher' | 'ai';
  timestamp: string;
  actionType?: QuickActionType;
  content: string;
  structuredData?: unknown;
}
