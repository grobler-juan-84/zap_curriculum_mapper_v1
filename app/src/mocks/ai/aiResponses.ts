import type { PageSpread, QuickActionType } from '../../types/curriculum';

export interface AIResponseData {
  title: string;
  badge?: string;
  summary: string;
  sections: Array<{
    heading: string;
    subheading?: string;
    content?: string;
    listItems?: string[];
    callout?: {
      label: string;
      text: string;
      type: 'tip' | 'warning' | 'frame';
    };
  }>;
  rawTextForCopy?: string;
}

export function generateQuickActionResponse(action: QuickActionType, spread: PageSpread): AIResponseData {
  const { title, pageNumbers, unitTitle, bookContent, teachingIntelligence } = spread;
  const vocabList = bookContent.targetVocabulary.map((v) => v.word).join(', ');
  const targetQ = bookContent.targetLanguage.question;
  const targetA = bookContent.targetLanguage.answer;

  switch (action) {
    case 'scaffold':
      return {
        title: `Productive Speaking Scaffold: ${title} (pp. ${pageNumbers})`,
        badge: 'Speaking Progression',
        summary: `An 8-step sequence transitioning learners from receptive recognition of ${bookContent.targetVocabulary.length} target words to independent spoken fluency.`,
        sections: [
          {
            heading: '01. Physical Elicitation & Word Stress',
            content: `Display the textbook spread illustrations. Point to each item without speaking; tap rhythm beats to establish syllable stress before introducing full sentences.`,
            listItems: [
              `Teacher points to clock: students choral echo /klɒk/.`,
              `Teacher points to window: students clap on two syllables (WIN-dow).`,
            ],
          },
          {
            heading: '02. Teacher Model: Question + Answer Frame',
            content: `Establish the dual role of the exchange. Use two distinct hand positions or puppet avatars to represent Speaker A and Speaker B.`,
            callout: {
              label: 'Model Exchange',
              text: `“${targetQ}” ➔ “${targetA}”`,
              type: 'frame',
            },
          },
          {
            heading: '03. Choral & Split-Class Repetition',
            content: `Divide the room into two halves. Left half asks the question with raised intonation; right half responds in full sentence with hand gestures for the indefinite article.`,
          },
          {
            heading: '04. Systematic Vocabulary Substitution',
            content: `Keep the grammatical frame frozen while swapping only the noun slot:`,
            listItems: bookContent.targetVocabulary.slice(0, 4).map((v) => `“${targetQ}” ➔ “It is a ${v.word}.”`),
          },
          {
            heading: '05. Gradual Frame Removal (Fading)',
            content: `Write the sentence skeleton on the board: “It is a ____.” Point to the slots while fading spoken support until students speak unprompted.`,
          },
          {
            heading: '06. Reverse Elicitation: Answer ➔ Reconstruct Question',
            content: `Give the answer first: “It is a chair!” Challenge students to reconstruct the question: “What is it?” This prevents passive one-way response habits.`,
            callout: {
              label: 'Teacher Tip',
              text: 'Students typically take 3x longer to master asking questions than answering them. Spend equal time on question production.',
              type: 'tip',
            },
          },
          {
            heading: '07. Peer Information Gap & Pointing',
            content: `Students open to pages ${pageNumbers}. Partner A places a finger on an unrevealed object; Partner B asks and Partner A answers. Switch after 3 items.`,
          },
          {
            heading: '08. Realia Transfer & Independent Production',
            content: `Students stand up, point to authentic physical items in the actual room, and execute the exchange without touching their books.`,
          },
        ],
      };

    case 'lesson-plan':
      return {
        title: `35-Minute Curriculum Plan: ${unitTitle} · ${title}`,
        badge: 'Lesson Timetable',
        summary: `Structured to reach the curriculum floor in 25 minutes, reserving 10 minutes for communicative partner practice and formative verification.`,
        sections: [
          {
            heading: 'Lesson Goal & Floor Target',
            content: `By minute 35, 100% of students independently identify the target items and produce "${targetA}" when prompted with "${targetQ}".`,
          },
          {
            heading: 'Phase 1: Warm-up & Context Anchor',
            subheading: '3 minutes · Whole Class',
            listItems: [
              'Sing or chant a familiar greeting routine.',
              'Quick visual scan of textbook spread pages ' + pageNumbers + ': elicit 2 things students already notice.',
            ],
          },
          {
            heading: 'Phase 2: Vocabulary Verification & Phonics Sounding',
            subheading: '7 minutes · Input & Choral Drill',
            listItems: [
              `Audio Track ${bookContent.activities[0]?.audioTrack || '04'}: Listen, point, and echo each word twice.`,
              'Finger-tap drill on the indefinite article ("a" or "an").',
              'Fast visual flash: show item for 1 second, students shout the target word.',
            ],
          },
          {
            heading: 'Phase 3: Target Language Modeling & Frame Deconstruction',
            subheading: '8 minutes · Guided Grammar',
            listItems: [
              `Model question with exaggerated rising intonation: "${targetQ}"`,
              `Establish full productive response: "${targetA}"`,
              'Highlight contractive forms: "It is" vs "It\'s".',
            ],
          },
          {
            heading: 'Phase 4: Guided Speaking & Reverse Elicitation',
            subheading: '8 minutes · Scaffolding to Autonomy',
            listItems: [
              'Split-room dialogue rally (Team Blue asks, Team Red answers).',
              'Mystery item under cloth: Teacher asks, random student answers.',
              'Reverse: Teacher gives the answer, students construct the question.',
            ],
          },
          {
            heading: 'Phase 5: Partner Practice (Pair Work)',
            subheading: '6 minutes · Student Production',
            listItems: [
              'Pairs open books to pp. ' + pageNumbers + '.',
              'Student A covers an item; Student B asks: "' + targetQ + '".',
              'Swap roles after 4 exchanges. Teacher circulates taking formative notes.',
            ],
          },
          {
            heading: 'Phase 6: Independent Exit Check (Floor Verification)',
            subheading: '3 minutes · Individual Assessment',
            listItems: [
              'Point to 1 item for each student during door line-up or table check.',
              'Formative metric: Student must produce full sentence, not isolated word.',
            ],
          },
        ],
      };

    case 'chalkie-prompt': {
      const promptString = `=====================================================
CHALKIE DOWNSTREAM LESSON GENERATION PROMPT
Curriculum Series: ${spread.unitTitle} (pp. ${pageNumbers})
Book: Beehive 1 (Student Book)
=====================================================

[CURRICULUM FLOOR - NON-NEGOTIABLE]
- Students must learn and actively produce:
  * Vocabulary: ${vocabList}
  * Core Question: ${targetQ}
  * Core Answer Frame: ${targetA}
- Mastery standard: Spoken sentence with correct article "a", not one-word recognition.

[SOURCE TEXTBOOK EVIDENCE]
- Series: Beehive 1 / Oxford University Press
- Unit: ${unitTitle}
- Spread Pages: ${pageNumbers}
- Activities in Book: ${bookContent.activities.map((a) => a.title).join(' | ')}

[PEDAGOGICAL SCAFFOLDING REQUIREMENTS]
1. Floor First: Do NOT introduce extra nouns (e.g. pencil sharpener, stapler) until the core 8 are produced accurately.
2. Progression:
   - Step 1: Auditory discrimination & pointing
   - Step 2: Choral pronunciation of isolated noun
   - Step 3: Teacher-led full sentence completion ("It is a...")
   - Step 4: Full answer to question
   - Step 5: Student-initiated question formation
   - Step 6: Peer-to-peer communicative transfer
3. Watch for likely errors:
   - Article omission ("It is desk" -> prompt with rhythm tap)
   - Single-word shouting ("Desk" -> hold up 3 fingers to demand "It is a desk")

[PRODUCTIVE PRACTICE DIRECTIVE]
- Student talking time must exceed 65% of lesson.
- Activities must require spoken exchange between student pairs, not written worksheets.

[OPTIONAL ENRICHMENT (DEPTH SECOND)]
- If floor is met early:
  * Add familiar color adjectives: "It is a brown desk."
  * Chain two items: "It is a chair and a desk."

[GENERATION CONSTRAINTS]
- Tone: Practical, energetic, age-appropriate for 6-7 year olds.
- Format: Step-by-step teacher script with explicit target utterances.
- Zero AI slop: Do not add unnecessary theoretical jargon.`;

      return {
        title: `Chalkie Prompt: Downstream Lesson Generator`,
        badge: 'Exportable Prompt',
        summary: `A high-fidelity prompt specification ready to paste into Chalkie or any downstream instructional lesson builder.`,
        rawTextForCopy: promptString,
        sections: [
          {
            heading: 'Curriculum Floor & Non-Negotiables',
            content: `Source target: ${bookContent.curriculumObjectives.join(' ')}`,
            listItems: [
              `Target Vocabulary: ${vocabList}`,
              `Target Language Frame: "${targetQ}" ➔ "${targetA}"`,
            ],
          },
          {
            heading: 'Scaffolding & Articulation Directives',
            content: `Strictly enforce the 6-tier progression. Prioritize spoken sentence frames before pencil-to-paper exercises.`,
          },
          {
            heading: 'Anti-Overload Constraint',
            content: `Explicit rule: Do NOT inflate the vocabulary list with secondary items until all 8 floor words are mastered productively.`,
            callout: {
              label: 'Downstream Bridge',
              text: 'Click "Copy Prompt" below to copy the full formatted prompt with all pedagogical parameters intact.',
              type: 'tip',
            },
          },
        ],
      };
    }

    case 'speaking-activities':
      return {
        title: `Productive Speaking Routines: pp. ${pageNumbers}`,
        badge: 'Speaking Drills',
        summary: `High-output student speaking activities designed to maximize oral turns and ensure language is used communicatively.`,
        sections: [
          {
            heading: '1. Point and Ask (Rapid Fire)',
            subheading: '4 minutes · Pairs · Book-based',
            content: `Student A touches any object on page ${pageNumbers} and asks "${targetQ}". Student B must reply in under 3 seconds using the full frame "${targetA}". After 4 items, swap immediately.`,
          },
          {
            heading: '2. Classroom Detective Hunt',
            subheading: '6 minutes · Small Groups · Realia',
            content: `Teacher calls out: "Find me a clock!" Students hurry to the classroom wall, point, and chant together: "It is a clock! It is on the wall!" Repeat with desk, board, window, trash can.`,
          },
          {
            heading: '3. Answer ➔ Reconstruct the Question (Reverse Drill)',
            subheading: '5 minutes · Whole Class to Pairs',
            content: `Teacher says only the answer: "It is a cabinet!" Students race to form the question: "${targetQ}". First table to chorus the question correctly scores a token.`,
            callout: {
              label: 'Pedagogical Benefit',
              text: 'Reverses the standard passive answering pattern and builds active interrogative competence.',
              type: 'tip',
            },
          },
          {
            heading: '4. The Peeking Flashcard',
            subheading: '5 minutes · Partner Game',
            content: `Student A covers a card with a piece of paper, sliding it slowly down by 1 cm. Student B watches and guesses: "Is it a chair? ... No, it is a desk!"`,
          },
        ],
      };

    case 'game-ideas':
      return {
        title: `Curriculum-Grounded Games: pp. ${pageNumbers}`,
        badge: 'Language Games',
        summary: `Games designed strictly around target grammar and vocabulary. Zero time wasted on empty entertainment.`,
        sections: [
          {
            heading: 'Game 1: Classroom Realia Relay',
            subheading: 'Language Target: Complete Identification Frame',
            content: `Two teams line up. Teacher shows a flashcard of an item from pages ${pageNumbers} (e.g. board). First runner runs to the board, touches it, and must say aloud: "It is a board!" before tagging the next teammate.`,
            callout: {
              label: 'Production Rule',
              text: 'Touching the object without producing the complete spoken sentence sends the runner back to start.',
              type: 'warning',
            },
          },
          {
            heading: 'Game 2: Flashcard Freeze (Musical Nouns)',
            subheading: 'Language Target: Question & Answer Interaction',
            content: `Play background classroom music. Students mingle quietly holding 1 flashcard. When music pauses, students freeze with nearest partner. Partner A asks: "${targetQ}", Partner B answers: "${targetA}". Swap cards and resume music.`,
          },
          {
            heading: 'Game 3: Mystery Box Feely Game',
            subheading: 'Language Target: Sensory Deduction & Oral Guessing',
            content: `Place miniature classroom realia or stationery in an opaque fabric box. Student puts one hand inside, feels the contours, and declares: "It is a [chair/pencil]!" Pull out to verify.`,
          },
        ],
      };

    case 'likely-difficulties':
      return {
        title: `Teacher Diagnostic & Intervention Guide`,
        badge: 'Diagnostic Alerts',
        summary: `Concise warnings regarding common phonological, syntactic, and cognitive obstacles students face on pages ${pageNumbers}.`,
        sections: teachingIntelligence.likelyDifficulties.map((diff, idx) => ({
          heading: `${idx + 1}. ${diff.issue}`,
          subheading: `Student says: “${diff.studentSays}” ➔ Target: “${diff.targetPattern}”`,
          content: diff.teachingResponse,
          callout: {
            label: 'Correction Strategy',
            text: `Address immediately without shaming. Elicit correction using physical count fingers or rhythmic chant rather than overt grammatical explanation.`,
            type: 'warning',
          },
        })),
      };

    default:
      return {
        title: 'Teaching Intelligence Output',
        summary: 'Contextual curriculum insights generated for current pages.',
        sections: [],
      };
  }
}

export function generateTeacherChatResponse(query: string, spread: PageSpread): AIResponseData {
  const q = query.toLowerCase();
  const { pageNumbers, bookContent, teachingIntelligence } = spread;

  if (q.includes('scaffold') || q.includes('weaker') || q.includes('struggling') || q.includes('differentiat')) {
    return {
      title: `Scaffolding Strategy for Diverse Learners (pp. ${pageNumbers})`,
      summary: `Targeted adjustments to ensure struggling learners reach the floor without holding back confident speakers.`,
      sections: [
        {
          heading: 'Tier 1: Visual & Physical Anchor (Struggling Learners)',
          content: `Reduce cognitive load by providing a tactile color-coded sentence strip on their desk: [Yellow = It] [Blue = is] [Green = a] [Photo = desk]. Allow them to point as they speak.`,
        },
        {
          heading: 'Tier 2: Core Sentence Production (On-Level)',
          content: `Work with picture prompts only. Ensure they never skip the article "a" and can alternate between asking and answering with a partner.`,
        },
        {
          heading: 'Tier 3: Extension Challenge (Advanced Learners)',
          content: `Encourage chaining: "It is a desk and a chair." or adding descriptive attributes: "It is a big brown desk next to the window."`,
        },
      ],
    };
  }

  if (q.includes('prior') || q.includes('already know') || q.includes('prerequisite')) {
    return {
      title: `Prior Knowledge Diagnostic: pp. ${pageNumbers}`,
      summary: `Prerequisite schemas required for students to access this lesson smoothly.`,
      sections: [
        {
          heading: 'Essential Prerequisites (Must be verified before teaching)',
          listItems: teachingIntelligence.priorKnowledge,
        },
        {
          heading: 'Quick 60-Second Check Before Starting',
          content: `Hold up fingers 1 through 5: verify students can chant numbers. Point to red/blue objects in room: verify color recognition. If these fail, spend 2 minutes reviewing before tackling pages ${pageNumbers}.`,
        },
      ],
    };
  }

  if (q.includes('mistake') || q.includes('difficult') || q.includes('error') || q.includes('watch')) {
    return generateQuickActionResponse('likely-difficulties', spread);
  }

  if (q.includes('game') || q.includes('fun') || q.includes('warm') || q.includes('activity')) {
    return generateQuickActionResponse('game-ideas', spread);
  }

  if (q.includes('connect') || q.includes('later') || q.includes('future') || q.includes('build')) {
    return {
      title: `Curriculum Trajectory & Future Connections`,
      summary: `How the language on pages ${pageNumbers} serves as the launchpad for subsequent units and levels.`,
      sections: [
        {
          heading: 'Vertical Learning Trajectory',
          listItems: teachingIntelligence.buildsToward.map((b) => `${b.phase} ➔ "${b.pattern}"`),
        },
        {
          heading: 'Why This Matters Pedagogically',
          content: `Mastering singular identification ("It is a...") now prevents future syntactic collapse when students encounter plurals ("They are..."), prepositions ("It is under the..."), and demonstratives ("This vs That").`,
        },
      ],
    };
  }

  // Default custom response
  return {
    title: `Teaching Guidance: ${spread.title}`,
    summary: `Curriculum intelligence response tailored to: "${query}"`,
    sections: [
      {
        heading: `Context Grounding: ${spread.unitTitle} · pp. ${pageNumbers}`,
        content: `For these pages, the curriculum floor requires all students to master: ${bookContent.targetLanguage.question} and ${bookContent.targetLanguage.answer}.`,
      },
      {
        heading: 'Actionable Classroom Advice',
        content: `When addressing "${query}", keep teacher talking time low and maximize choral and pair rehearsal. Elicit student language using real objects in the room rather than relying solely on the printed page.`,
        listItems: [
          'Verify student comprehension through pointing before demanding spoken output.',
          'Always model the question structure with upward intonation.',
          'Pair stronger speakers with developing speakers for supportive peer coaching.',
        ],
      },
    ],
  };
}
