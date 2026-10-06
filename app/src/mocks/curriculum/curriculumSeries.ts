import type { CurriculumSeries } from '../../types/curriculum';

export const mockCurriculumSeries: CurriculumSeries[] = [
  {
    id: 'beehive',
    name: 'Beehive',
    publisher: 'Oxford University Press',
    shortDesc: 'A friendly 7-level primary course that gets children speaking, developing real-world confidence and 21st century skills.',
    targetAges: 'Ages 6–12',
    levelsCount: 7,
    availableBooksCount: 2,
    featuredBookId: 'beehive-1',
    colorScheme: {
      accent: '#EAB308', // amber-500
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    books: [
      {
        id: 'beehive-1',
        seriesId: 'beehive',
        title: 'Beehive 1',
        level: 'Level 1 (CEFR Pre-A1)',
        audience: 'Primary Year 1',
        totalUnits: 8,
        type: 'Student Book',
        coverImage: '/images/beehive-1-cover.svg',
        colorScheme: {
          primary: '#0284C7', // sky-600
          accent: '#F59E0B',
          badgeBg: 'bg-sky-50',
          badgeText: 'text-sky-800',
        },
        pageSpreads: [
          {
            id: 'beehive-1-p6-7',
            pageNumbers: '6–7',
            leftPageNumber: 6,
            rightPageNumber: 7,
            unitNumber: 1,
            unitTitle: 'At School',
            title: 'At School',
            subtitle: 'Classroom Objects & Identification',
            bookContent: {
              curriculumObjectives: [
                'Identify common classroom objects by sight and spoken word.',
                'Understand and use the target classroom vocabulary in simple exchanges.',
                'Respond to simple questions about visible classroom objects using complete sentences.',
              ],
              targetVocabulary: [
                { id: 'v1', word: 'clock', phonetic: '/klɒk/', partOfSpeech: 'noun', translationOrNote: 'Tells time on the wall' },
                { id: 'v2', word: 'door', phonetic: '/dɔːr/', partOfSpeech: 'noun', translationOrNote: 'Enter and exit the room' },
                { id: 'v3', word: 'board', phonetic: '/bɔːd/', partOfSpeech: 'noun', translationOrNote: 'Teacher writes on this' },
                { id: 'v4', word: 'window', phonetic: '/ˈwɪn.dəʊ/', partOfSpeech: 'noun', translationOrNote: 'Glass opening to outside' },
                { id: 'v5', word: 'desk', phonetic: '/desk/', partOfSpeech: 'noun', translationOrNote: 'Student or teacher table' },
                { id: 'v6', word: 'trash can', phonetic: '/ˈtræʃ ˌkæn/', partOfSpeech: 'noun', translationOrNote: 'Rubbish receptacle' },
                { id: 'v7', word: 'cabinet', phonetic: '/ˈkæb.ɪ.nət/', partOfSpeech: 'noun', translationOrNote: 'Storage cupboard with shelves' },
                { id: 'v8', word: 'chair', phonetic: '/tʃeər/', partOfSpeech: 'noun', translationOrNote: 'Place to sit' },
              ],
              targetLanguage: {
                question: 'What is it?',
                answer: 'It is a desk. / It is a chair.',
                variations: ['It is a clock.', 'It is a board.', 'It is a door.'],
              },
              grammarFocus: [
                'Singular classroom nouns (count nouns)',
                'Question + answer structure: What + is + it?',
                'Indefinite article + noun construction (a + consonant sound)',
                'Basic copula use of "is" (full form & contraction: It is / It’s)',
              ],
              skills: ['Listening discrimination', 'Spoken production', 'Vocabulary recognition', 'Visual pointing'],
              activities: [
                {
                  id: 'act-1',
                  number: 1,
                  title: 'Listen, point and repeat',
                  type: 'Listening',
                  audioTrack: 'Track 04',
                  instructions: 'Listen to the audio. Point to the classroom object in the scene. Repeat the word clearly.',
                },
                {
                  id: 'act-2',
                  number: 2,
                  title: 'Numbers Game',
                  type: 'Game',
                  instructions: 'Say the number of the object shown on the card. Partner points and names the item.',
                },
                {
                  id: 'act-3',
                  number: 3,
                  title: 'Listen and say. Then practice.',
                  type: 'Speaking',
                  audioTrack: 'Track 05',
                  instructions: 'Listen to the question-and-answer dialogue model. Practice with a partner using classroom realia.',
                },
                {
                  id: 'act-4',
                  number: 4,
                  title: 'Look around your classroom. Ask and answer.',
                  type: 'Speaking',
                  instructions: 'Point to a real object in the classroom. Ask your partner: "What is it?" Partner answers with full frame.',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Students learn the core 8 classroom-object vocabulary words and begin using that vocabulary productively through a simple identification question-and-answer pattern.',
              priorKnowledge: [
                'Basic classroom physical environment awareness',
                'Numbers 1–10 (for identification games)',
                'Primary colors recognition (red, blue, green)',
                'Receptive awareness of simple "What...?" questions',
                'Familiarity with greeting routines ("Hello", "Good morning")',
              ],
              teacherFocus: {
                recognition: 'desk',
                productiveResponse: 'It is a desk.',
                goal: 'Move students deliberately from passive recognition toward producing complete spoken responses.',
              },
              likelyDifficulties: [
                {
                  issue: 'Article omission',
                  studentSays: 'It is desk.',
                  targetPattern: 'It is a desk.',
                  teachingResponse:
                    'Hold up a single finger or tap a rhythm beat for "a". Whisper the "a" together before adding the noun: "It is... a... desk."',
                },
                {
                  issue: 'One-word answers',
                  studentSays: 'Desk.',
                  targetPattern: 'It is a desk.',
                  teachingResponse:
                    'Accept the recognition, then immediately use a 3-finger prompt to elicit the complete frame: "Yes! It... is... a desk."',
                },
                {
                  issue: 'Question formation reluctance',
                  studentSays: 'What desk?',
                  targetPattern: 'What is it?',
                  teachingResponse:
                    'Model the question repeatedly with exaggerated upward intonation. Have students echo in chorus before individual pairs.',
                },
                {
                  issue: 'Confusing is / are',
                  studentSays: 'They is chairs.',
                  targetPattern: 'It is a chair.',
                  teachingResponse:
                    'Keep all objects strictly singular in this initial spread. Do not introduce plurals until Unit 2.',
                },
              ],
              buildsToward: [
                { phase: 'Next Spread (pp. 8–9)', pattern: 'What color is it? It is a blue desk.' },
                { phase: 'Unit 2 (Later)', pattern: 'What can you see? I can see a desk.' },
                { phase: 'Unit 3 (Polar questions)', pattern: 'Can you see a desk? Yes, I can. / No, I cannot.' },
                { phase: 'Prepositions (Unit 4)', pattern: 'Where is the desk? It is next to the door.' },
              ],
              learningProgression: [
                { step: 1, title: 'Recognize', description: 'Hear the word while looking at the picture; point accurately without speaking.' },
                { step: 2, title: 'Repeat', description: 'Choral and individual mimicry of single vocabulary items with correct stress.' },
                { step: 3, title: 'Complete Frame', description: 'Teacher starts "It is a..." and students complete the final noun.' },
                { step: 4, title: 'Answer', description: 'Teacher asks "What is it?" and student produces the full answer sentence.' },
                { step: 5, title: 'Reconstruct Question', description: 'Teacher gives the answer ("It is a door") and prompts the question.' },
                { step: 6, title: 'Ask Partner', description: 'Pairs point to textbook illustrations and take turns asking and answering.' },
                { step: 7, title: 'Independent Response', description: 'Students walk to actual classroom objects and speak unassisted.' },
              ],
              curriculumFloor: [
                'Correctly name all 8 target classroom objects on sight.',
                'Answer "What is it?" with the full frame "It is a [noun]" with accurate article "a".',
                'Demonstrate receptive comprehension by pointing when prompted.',
              ],
              optionalDepth: [
                'Add color modifiers already known: "It is a brown door.", "It is a green board."',
                'Form the question "What is it?" unprompted when handed an unfamiliar flashcard.',
                'Chain two items using "and": "It is a desk and a chair."',
              ],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Words',
                title: 'At School',
                heroIllustrationType: 'classroom_scene',
                exercise1: {
                  number: '1',
                  text: 'Listen, point and repeat.',
                  audioTrack: '04',
                  items: [
                    { id: 1, label: '1. clock' },
                    { id: 2, label: '2. door' },
                    { id: 3, label: '3. board' },
                    { id: 4, label: '4. window' },
                    { id: 5, label: '5. desk' },
                    { id: 6, label: '6. trash can' },
                    { id: 7, label: '7. cabinet' },
                    { id: 8, label: '8. chair' },
                  ],
                },
                exercise2: {
                  number: '2',
                  text: 'Numbers Game. Look at exercise 1. Say and point.',
                  dialogueBox: {
                    speakerA: 'Number 3!',
                    speakerB: 'It’s a board!',
                  },
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Grammar',
                title: 'What is it?',
                exercise3: {
                  number: '3',
                  text: 'Listen and say. Then practice.',
                  audioTrack: '05',
                  grammarBanner: {
                    prompt: 'What is it?',
                    pattern: 'It is a desk. (It’s = It is)',
                  },
                },
                exercise4: {
                  number: '4',
                  text: 'Look at the classroom. Ask and answer.',
                  gamePrompt: 'Point to things in your real classroom with your partner!',
                  partnerIcon: true,
                },
              },
            },
          },
          {
            id: 'beehive-1-p8-9',
            pageNumbers: '8–9',
            leftPageNumber: 8,
            rightPageNumber: 9,
            unitNumber: 1,
            unitTitle: 'At School',
            title: 'In My Backpack & Colors',
            subtitle: 'School Supplies & Color Adjectives',
            bookContent: {
              curriculumObjectives: [
                'Identify 8 personal school supplies (pen, pencil, eraser, ruler, crayon, backpack, pencil case, notebook).',
                'Pair basic colors (red, blue, yellow, green) with supply nouns in spoken frames.',
                'Ask and answer: "What color is it? It is red." and "Is it a pen? Yes, it is."',
              ],
              targetVocabulary: [
                { id: 'v9', word: 'pen', phonetic: '/pen/', partOfSpeech: 'noun', translationOrNote: 'Writes with ink' },
                { id: 'v10', word: 'pencil', phonetic: '/ˈpen.səl/', partOfSpeech: 'noun', translationOrNote: 'Graphite writing tool' },
                { id: 'v11', word: 'eraser', phonetic: '/ɪˈreɪ.zər/', partOfSpeech: 'noun', translationOrNote: 'Rub out mistakes (an eraser)' },
                { id: 'v12', word: 'ruler', phonetic: '/ˈruː.lər/', partOfSpeech: 'noun', translationOrNote: 'Measures straight lines' },
                { id: 'v13', word: 'crayon', phonetic: '/ˈkreɪ.ɒn/', partOfSpeech: 'noun', translationOrNote: 'Colored wax stick for drawing' },
                { id: 'v14', word: 'backpack', phonetic: '/ˈbæk.pæk/', partOfSpeech: 'noun', translationOrNote: 'Bag worn on back' },
                { id: 'v15', word: 'pencil case', phonetic: '/ˈpen.səl ˌkeɪs/', partOfSpeech: 'noun', translationOrNote: 'Pouch holding stationery' },
                { id: 'v16', word: 'notebook', phonetic: '/ˈnəʊt.bʊk/', partOfSpeech: 'noun', translationOrNote: 'Book with blank pages' },
              ],
              targetLanguage: {
                question: 'What is this? / What color is it?',
                answer: 'It is a red pen. / It is blue.',
                variations: ['Is it a pencil? Yes, it is.', 'Is it a ruler? No, it isn’t.'],
              },
              grammarFocus: [
                'Demonstrative pronoun "this" for near objects',
                'Attributive adjective placement: [Article] + [Color] + [Noun] ("a yellow ruler")',
                'Indefinite article variation: "an eraser" vs "a pencil"',
                'Polar question inversion: "Is it a...?"',
              ],
              skills: ['Color-object pairing', 'Tactile manipulation of supplies', 'Listening for adjective order'],
              activities: [
                {
                  id: 'act-5',
                  number: 1,
                  title: 'Listen, point and repeat supplies',
                  type: 'Listening',
                  audioTrack: 'Track 06',
                  instructions: 'Listen to the stationery items being packed into the backpack. Repeat each item.',
                },
                {
                  id: 'act-6',
                  number: 2,
                  title: 'Chant: My School Bag',
                  type: 'Song/Chant',
                  audioTrack: 'Track 07',
                  instructions: 'Clap to the beat and chant: "A pen, a pencil, an eraser too! In my backpack, bright and blue!"',
                },
                {
                  id: 'act-7',
                  number: 3,
                  title: 'Color Detective',
                  type: 'Game',
                  instructions: 'Teacher calls out: "Find a red pen!" Students hold up matching real supplies.',
                },
                {
                  id: 'act-8',
                  number: 4,
                  title: 'Partner Bag Mystery',
                  type: 'Speaking',
                  instructions: 'Hide one supply in your hand. Partner guesses: "Is it a crayon?" until guessed.',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Expands from general classroom furniture to personal student supplies, layering color adjectives onto noun phrases and introducing the critical "an" exception for eraser.',
              priorKnowledge: [
                'Core frame "It is a..." from pp. 6–7',
                'Color words: red, yellow, blue, green',
                'Yes / No responses',
              ],
              teacherFocus: {
                recognition: 'pen + red',
                productiveResponse: 'It is a red pen.',
                goal: 'Ensure color adjective precedes the noun (English word order) rather than trailing.',
              },
              likelyDifficulties: [
                {
                  issue: 'Reversed adjective order',
                  studentSays: 'It is a pen red.',
                  targetPattern: 'It is a red pen.',
                  teachingResponse:
                    'Use color-coded cards: hold Color in Left Hand, Object in Right Hand. Read left to right: "Red... pen!"',
                },
                {
                  issue: 'Vowel article error',
                  studentSays: 'a eraser',
                  targetPattern: 'an eraser',
                  teachingResponse:
                    'Introduce the "apple rule" playfully. Make an apple mouth shape for "an eraser" so sounds connect smoothly.',
                },
                {
                  issue: 'Double article with color alone',
                  studentSays: 'It is a red.',
                  targetPattern: 'It is red. / It is a red pencil.',
                  teachingResponse:
                    'Clarify: if there is no object name at the end, drop the "a". "It is red" vs "It is a red pen."',
                },
              ],
              buildsToward: [
                { phase: 'Spread pp. 10–11', pattern: 'Can I borrow your red pen, please?' },
                { phase: 'Plural supplies (Unit 2)', pattern: 'I have three pencils.' },
              ],
              learningProgression: [
                { step: 1, title: 'Noun Flash', description: 'Review supplies without colors.' },
                { step: 2, title: 'Color Match', description: 'Identify isolated colors on real stationery.' },
                { step: 3, title: 'Compound Frame', description: 'Blend: [a] + [color] + [supply].' },
                { step: 4, title: 'Yes/No Test', description: 'Ask: "Is it a green ruler?" Prompt "Yes, it is / No, it is not."' },
                { step: 5, title: 'Backpack Show & Tell', description: 'Students pull item from real pencil case and present to table.' },
              ],
              curriculumFloor: [
                'Accurately identify all 8 personal supplies.',
                'Produce "a [color] [object]" with correct word order.',
                'Use "an" correctly with "eraser".',
              ],
              optionalDepth: [
                'Add size adjectives: "a big blue backpack", "a short pencil".',
                'Produce full question: "Is this your notebook?"',
              ],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Words 2',
                title: 'In My Backpack',
                heroIllustrationType: 'backpack_items',
                exercise1: {
                  number: '1',
                  text: 'Listen, point and repeat the school things.',
                  audioTrack: '06',
                  items: [
                    { id: 1, label: '1. pen' },
                    { id: 2, label: '2. pencil' },
                    { id: 3, label: '3. eraser' },
                    { id: 4, label: '4. ruler' },
                    { id: 5, label: '5. crayon' },
                    { id: 6, label: '6. backpack' },
                    { id: 7, label: '7. pencil case' },
                    { id: 8, label: '8. notebook' },
                  ],
                },
                exercise2: {
                  number: '2',
                  text: 'Listen and chant: "My School Bag".',
                  dialogueBox: {
                    speakerA: 'A ruler, a pencil, an eraser too!',
                    speakerB: 'Everything fits in my backpack blue!',
                  },
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Grammar 2',
                title: 'What color is it?',
                exercise3: {
                  number: '3',
                  text: 'Listen and say. Then practice.',
                  audioTrack: '07',
                  grammarBanner: {
                    prompt: 'What color is it?',
                    pattern: 'It’s yellow. / It’s a yellow crayon.',
                  },
                },
                exercise4: {
                  number: '4',
                  text: 'Play the Mystery Bag Game.',
                  gamePrompt: 'Put 3 items in a bag. Guess what color they are without looking!',
                  partnerIcon: true,
                },
              },
            },
          },
          {
            id: 'beehive-1-p10-11',
            pageNumbers: '10–11',
            leftPageNumber: 10,
            rightPageNumber: 11,
            unitNumber: 1,
            unitTitle: 'At School',
            title: 'Story: A Messy Desk & Helping Hands',
            subtitle: 'Classroom Values & Cooperative Language',
            bookContent: {
              curriculumObjectives: [
                'Follow a 4-frame comic story in a classroom setting.',
                'Use functional polite formulas: "Please", "Thank you", "Here you are", "You are welcome".',
                'Demonstrate social value: helping peers organize their learning space.',
              ],
              targetVocabulary: [
                { id: 'v17', word: 'help', phonetic: '/help/', partOfSpeech: 'verb', translationOrNote: 'Give assistance' },
                { id: 'v18', word: 'please', phonetic: '/pliːz/', partOfSpeech: 'adverb', translationOrNote: 'Polite request marker' },
                { id: 'v19', word: 'thank you', phonetic: '/ˈθæŋk juː/', partOfSpeech: 'phrase', translationOrNote: 'Expression of gratitude' },
                { id: 'v20', word: 'share', phonetic: '/ʃeər/', partOfSpeech: 'verb', translationOrNote: 'Use things together' },
                { id: 'v21', word: 'messy', phonetic: '/ˈmes.i/', partOfSpeech: 'adjective', translationOrNote: 'Untidy, disorganized' },
                { id: 'v22', word: 'neat', phonetic: '/niːt/', partOfSpeech: 'adjective', translationOrNote: 'Tidy, in order' },
              ],
              targetLanguage: {
                question: 'Can you help me, please?',
                answer: 'Sure! Here is your pencil.',
                variations: ['Thank you! — You’re welcome.', 'Let’s clean up together!'],
              },
              grammarFocus: [
                'Polite request modal frame: Can + you + verb + please?',
                'Handing-over expression: Here + is / are...',
                'Cooperative proposal: Let’s + base verb',
              ],
              skills: ['Narrative listening', 'Reading speech bubbles', 'Role-play with prosody and manners'],
              activities: [
                {
                  id: 'act-9',
                  number: 1,
                  title: 'Watch or listen to the story: The Messy Desk',
                  type: 'Reading',
                  audioTrack: 'Track 08',
                  instructions: 'Follow frame 1 to 4 with your finger. Notice what falls on the floor.',
                },
                {
                  id: 'act-10',
                  number: 2,
                  title: 'Read and circle the polite words',
                  type: 'Reading',
                  instructions: 'Find "Please" and "Thank you" in the speech bubbles and circle them with blue crayon.',
                },
                {
                  id: 'act-11',
                  number: 3,
                  title: 'Act out the story with props',
                  type: 'Speaking',
                  instructions: 'Work in pairs. One student pretends to drop supplies; partner helps and exchanges dialogue.',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Contextualizes all previously taught vocabulary within a realistic, empathy-building school narrative about sharing and helping a classmate clean up a messy desk.',
              priorKnowledge: [
                'Classroom objects & supplies from pp. 6–9',
                'Basic conversational turn-taking',
              ],
              teacherFocus: {
                recognition: 'Hearing polite requests',
                productiveResponse: 'Can you help me, please? / Here you are.',
                goal: 'Instill natural, kind intonation rather than flat rote recital.',
              },
              likelyDifficulties: [
                {
                  issue: 'Omitting "please" in peer requests',
                  studentSays: 'Give pencil.',
                  targetPattern: 'Pencil, please. / Can you pass the pencil, please?',
                  teachingResponse:
                    'Use the "Magic Word" reminder. No student hands over an item until "please" is spoken with a smile.',
                },
                {
                  issue: 'Struggling with "Here you are"',
                  studentSays: 'This you.',
                  targetPattern: 'Here you are.',
                  teachingResponse:
                    'Physical gesture drill: extend both hands forward offering the pencil while saying "Here... you... are!"',
                },
              ],
              buildsToward: [
                { phase: 'Unit 2 Teamwork', pattern: 'Let’s work together. Can I use your scissors?' },
                { phase: 'Everyday School English', pattern: 'Authentic daily classroom manners routine.' },
              ],
              learningProgression: [
                { step: 1, title: 'Story Gist', description: 'Look at comic frames; predict what happened to Ben’s desk.' },
                { step: 2, title: 'Listen & Follow', description: 'Audio track with character voices; pause after each bubble.' },
                { step: 3, title: 'Choral Voice', description: 'Imitate character emotions (distressed -> relieved -> happy).' },
                { step: 4, title: 'Pair Roleplay', description: 'Physical acting with real classroom desks and pencil cases.' },
              ],
              curriculumFloor: [
                'Understand the plot of the 4-frame story.',
                'Say "Can you help me, please?" and "Here you are" accurately during classroom sharing.',
              ],
              optionalDepth: [
                'Extend role-play: offer multiple items ("Here is your eraser and your red pen!").',
                'Discuss classroom values: why a neat desk helps everyone learn better.',
              ],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Story',
                title: 'The Messy Desk',
                heroIllustrationType: 'story_strip',
                exercise1: {
                  number: '1',
                  text: 'Listen and read. What is on the floor?',
                  audioTrack: '08',
                  items: [
                    { id: 1, label: 'Frame 1: Oh no! My desk is messy!' },
                    { id: 2, label: 'Frame 2: Can you help me, please?' },
                  ],
                },
                exercise2: {
                  number: '2',
                  text: 'Check your understanding.',
                  dialogueBox: {
                    speakerA: 'Look! Ben dropped his pencils and ruler.',
                    speakerB: 'Emma says: "Sure, let’s pick them up!"',
                  },
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Values & Project',
                title: 'Help Each Other',
                exercise3: {
                  number: '3',
                  text: 'Listen and act out.',
                  audioTrack: '09',
                  grammarBanner: {
                    prompt: 'School Value: We Help and Share',
                    pattern: '“Can you help me, please?” — “Here you are!”',
                  },
                },
                exercise4: {
                  number: '4',
                  text: 'Make a Class Clean-up Pledge.',
                  gamePrompt: 'Draw one tidy classroom object and stick it on the class wall chart.',
                  partnerIcon: true,
                },
              },
            },
          },
          {
            id: 'beehive-1-p12-13',
            pageNumbers: '12–13',
            leftPageNumber: 12,
            rightPageNumber: 13,
            unitNumber: 1,
            unitTitle: 'At School',
            title: 'Phonics & Unit 1 Review',
            subtitle: 'Sounds /b/ & /d/ · Consolidating Unit Language',
            bookContent: {
              curriculumObjectives: [
                'Isolate and pronounce initial phonemes /b/ and /d/ with correct articulatory mechanics.',
                'Distinguish minimal pairs and letterforms for lowercase b and d.',
                'Synthesize all 16 target words from Unit 1 in a self-assessed review check.',
              ],
              targetVocabulary: [
                { id: 'v23', word: 'board', phonetic: '/bɔːd/', partOfSpeech: 'phonics /b/', translationOrNote: 'Unit 1 vocab' },
                { id: 'v24', word: 'book', phonetic: '/bʊk/', partOfSpeech: 'phonics /b/', translationOrNote: 'Unit 1 vocab' },
                { id: 'v25', word: 'bag', phonetic: '/bæɡ/', partOfSpeech: 'phonics /b/', translationOrNote: 'Unit 1 vocab' },
                { id: 'v26', word: 'boy', phonetic: '/bɔɪ/', partOfSpeech: 'phonics /b/', translationOrNote: 'Unit 1 vocab' },
                { id: 'v27', word: 'desk', phonetic: '/desk/', partOfSpeech: 'phonics /d/', translationOrNote: 'Unit 1 vocab' },
                { id: 'v28', word: 'door', phonetic: '/dɔːr/', partOfSpeech: 'phonics /d/', translationOrNote: 'Unit 1 vocab' },
                { id: 'v29', word: 'duck', phonetic: '/dʌk/', partOfSpeech: 'phonics /d/', translationOrNote: 'Sound focus word' },
                { id: 'v30', word: 'dog', phonetic: '/dɒɡ/', partOfSpeech: 'phonics /d/', translationOrNote: 'Sound focus word' },
              ],
              targetLanguage: {
                question: 'What sound does letter B make? / What is it?',
                answer: 'B says /b/. /b/ /b/ board! It is a board.',
                variations: ['D says /d/. /d/ /d/ desk! It is a desk.', 'I can name 8 classroom things!'],
              },
              grammarFocus: [
                'Grapheme-to-phoneme correspondence (Letter B -> /b/, Letter D -> /d/)',
                'Alliterative sound chants',
                'Formative assessment statement: "I can..."',
              ],
              skills: ['Phonemic awareness', 'Auditory discrimination', 'Self-evaluation checklist'],
              activities: [
                {
                  id: 'act-12',
                  number: 1,
                  title: 'Listen, point and chant: B and D',
                  type: 'Phonics',
                  audioTrack: 'Track 10',
                  instructions: 'Feel the lips close for /b/. Tap the tongue behind teeth for /d/.',
                },
                {
                  id: 'act-13',
                  number: 2,
                  title: 'Sound Sort Race',
                  type: 'Game',
                  instructions: 'Draw a B column and a D column. Sort picture flashcards into the correct sound column.',
                },
                {
                  id: 'act-14',
                  number: 3,
                  title: 'Unit 1 Language Check',
                  type: 'Speaking',
                  instructions: 'Look at the review picture. Name 6 things and answer: "What is it?" Check your stars!',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Provides phonetic grounding in frequently confused mirror letters b and d, followed by a celebratory review station allowing teachers to verify who has reached the curriculum floor.',
              priorKnowledge: [
                'Alphabet song awareness',
                'All 16 unit items from pp. 6–11',
              ],
              teacherFocus: {
                recognition: 'Distinguishing b and d letters and sounds',
                productiveResponse: '/b/ /b/ board! /d/ /d/ desk!',
                goal: 'Fix mouth mechanics before bad phonetic habits lock in.',
              },
              likelyDifficulties: [
                {
                  issue: 'b and d letter reversal',
                  studentSays: 'Writes / reads d as b',
                  targetPattern: 'Visual difference between b (bat before ball) and d (donut before door)',
                  teachingResponse:
                    'Use "two thumbs up" bed trick: left fist is "b", right fist is "d", together they form "bed".',
                },
                {
                  issue: 'Aspirating /b/ into unvoiced /p/',
                  studentSays: '/p/ /p/ poard',
                  targetPattern: 'Voiced /b/ with throat vibration',
                  teachingResponse:
                    'Have students place hands on vocal cords: feel the buzz for /b/ board vs quiet puff for /p/.',
                },
              ],
              buildsToward: [
                { phase: 'Unit 2 Phonics', pattern: 'Sounds /p/ and /t/ in action words' },
                { phase: 'Early Reading', pattern: 'Blending CVC words (bag, bed, dog)' },
              ],
              learningProgression: [
                { step: 1, title: 'Mouth Modeling', description: 'Exaggerated lip popping for /b/ and tongue tapping for /d/.' },
                { step: 2, title: 'Sound Hunt', description: 'Find words on the page starting with each sound.' },
                { step: 3, title: 'Minimal Pair Slap', description: 'Teacher says sound; students slap the matching letter card.' },
                { step: 4, title: 'Unit Trophy Check', description: '1-on-1 rapid teacher check with formative sticker reward.' },
              ],
              curriculumFloor: [
                'Correctly discriminate initial /b/ and /d/ sounds.',
                'Recall at least 6 unit vocabulary items independently.',
                'Answer "What is it?" accurately without teacher prompting.',
              ],
              optionalDepth: [
                'Introduce initial CVC spelling (b-a-g, d-e-s-k).',
                'Peer assessment: student plays teacher and asks classmate 3 questions.',
              ],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Phonics',
                title: 'Letters B & D',
                heroIllustrationType: 'phonics_grid',
                exercise1: {
                  number: '1',
                  text: 'Listen and repeat the sounds and words.',
                  audioTrack: '10',
                  items: [
                    { id: 1, label: 'b: board, book, bag, boy' },
                    { id: 2, label: 'd: desk, door, duck, dog' },
                  ],
                },
                exercise2: {
                  number: '2',
                  text: 'Listen and chant the B & D tongue twister.',
                  dialogueBox: {
                    speakerA: 'A boy with a bag by the big brown board!',
                    speakerB: 'A duck by the door near the dirty desk!',
                  },
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Review',
                title: 'Review: I Can Do It!',
                exercise3: {
                  number: '3',
                  text: 'Look and say. Color the stars.',
                  audioTrack: '11',
                  grammarBanner: {
                    prompt: 'Formative Learning Check',
                    pattern: '★ I can name classroom things. ★ I can ask: What is it?',
                  },
                },
                exercise4: {
                  number: '4',
                  text: 'Classroom Board Game',
                  gamePrompt: 'Roll a dice. Land on a square and say: "It’s a [object]!" First to desk wins!',
                  partnerIcon: true,
                },
              },
            },
          },
        ],
      },
      {
        id: 'beehive-2',
        seriesId: 'beehive',
        title: 'Beehive 2',
        level: 'Level 2 (CEFR A1)',
        audience: 'Primary Year 2',
        totalUnits: 8,
        type: 'Student Book',
        coverImage: '/images/beehive-2-cover.svg',
        colorScheme: {
          primary: '#0D9488', // teal-600
          accent: '#F59E0B',
          badgeBg: 'bg-teal-50',
          badgeText: 'text-teal-800',
        },
        pageSpreads: [
          {
            id: 'beehive-2-p6-7',
            pageNumbers: '6–7',
            leftPageNumber: 6,
            rightPageNumber: 7,
            unitNumber: 1,
            unitTitle: 'Our Day',
            title: 'Daily Routines',
            subtitle: 'Morning Actions & Clock Times',
            bookContent: {
              curriculumObjectives: [
                'Express daily morning routines (wake up, wash face, brush teeth, eat breakfast, get dressed, go to school).',
                'Tell time to the hour ("It is seven o’clock").',
                'Ask and answer: "What time do you wake up? I wake up at seven o’clock."',
              ],
              targetVocabulary: [
                { id: 'v201', word: 'wake up', phonetic: '/weɪk ʌp/', partOfSpeech: 'phrasal verb', translationOrNote: 'Stop sleeping' },
                { id: 'v202', word: 'brush teeth', phonetic: '/brʌʃ tiːθ/', partOfSpeech: 'verb phrase', translationOrNote: 'Clean teeth with toothbrush' },
                { id: 'v203', word: 'wash face', phonetic: '/wɒʃ feɪs/', partOfSpeech: 'verb phrase', translationOrNote: 'Clean face with water' },
                { id: 'v204', word: 'eat breakfast', phonetic: '/iːt ˈbrek.fəst/', partOfSpeech: 'verb phrase', translationOrNote: 'Morning meal' },
                { id: 'v205', word: 'get dressed', phonetic: '/ɡet drest/', partOfSpeech: 'verb phrase', translationOrNote: 'Put on clothes' },
                { id: 'v206', word: 'go to school', phonetic: '/ɡəʊ tuː skuːl/', partOfSpeech: 'verb phrase', translationOrNote: 'Travel to classroom' },
              ],
              targetLanguage: {
                question: 'What time do you wake up?',
                answer: 'I wake up at seven o’clock.',
                variations: ['What time do you eat breakfast? I eat breakfast at eight o’clock.'],
              },
              grammarFocus: [
                'Present Simple habitual aspect for daily routines',
                'Preposition of time "at" with clock hours',
                'Time expression: "[Number] o’clock"',
              ],
              skills: ['Chronological sequencing', 'Time telling', 'Routine partner interviews'],
              activities: [
                {
                  id: 'act-201',
                  number: 1,
                  title: 'Listen, point and say routines',
                  type: 'Listening',
                  audioTrack: 'Track 02',
                  instructions: 'Listen to the clock chimes and routine actions. Point to the clock face.',
                },
                {
                  id: 'act-202',
                  number: 2,
                  title: 'Mime and Guess',
                  type: 'Game',
                  instructions: 'Mime a morning action. Partner guesses: "You brush your teeth!"',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Introduces habitual present tense verb collocations tied to hourly clock times, building student autonomy in talking about personal schedules.',
              priorKnowledge: ['Numbers 1–12', 'Day/night concept', 'Basic verbs from Level 1'],
              teacherFocus: {
                recognition: 'Connecting clock face to action',
                productiveResponse: 'I eat breakfast at eight o’clock.',
                goal: 'Ensure the preposition "at" is consistently produced before time expressions.',
              },
              likelyDifficulties: [
                {
                  issue: 'Dropping preposition "at"',
                  studentSays: 'I wake up seven o’clock.',
                  targetPattern: 'I wake up at seven o’clock.',
                  teachingResponse: 'Use a clock tap gesture: tap wrist twice on "at" to anchor the preposition.',
                },
              ],
              buildsToward: [
                { phase: 'Third person -s (Unit 2)', pattern: 'He wakes up at seven o’clock.' },
              ],
              learningProgression: [
                { step: 1, title: 'Action Miming', description: 'Physical total physical response (TPR) drills.' },
                { step: 2, title: 'Clock Match', description: 'Align toy clock hands with routine cards.' },
                { step: 3, title: 'Partner Timeline', description: 'Interview partner about morning routine.' },
              ],
              curriculumFloor: [
                'Produce 6 routine phrases accurately.',
                'Say time to the hour with "at [N] o’clock".',
              ],
              optionalDepth: [
                'Add half past: "at seven thirty".',
                'Sequence with "first", "then", "next".',
              ],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Routines',
                title: 'Our Day',
                heroIllustrationType: 'classroom_scene',
                exercise1: {
                  number: '1',
                  text: 'Listen, point and say morning routines.',
                  audioTrack: '02',
                  items: [
                    { id: 1, label: '1. wake up (7:00)' },
                    { id: 2, label: '2. wash face' },
                    { id: 3, label: '3. brush teeth' },
                    { id: 4, label: '4. eat breakfast' },
                  ],
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Time Grammar',
                title: 'What time is it?',
                exercise3: {
                  number: '2',
                  text: 'Listen and practice.',
                  audioTrack: '03',
                  grammarBanner: {
                    prompt: 'What time do you wake up?',
                    pattern: 'I wake up at 7 o’clock.',
                  },
                },
                exercise4: {
                  number: '3',
                  text: 'Daily Routine Timeline Interview.',
                  gamePrompt: 'Ask 3 friends what time they wake up!',
                  partnerIcon: true,
                },
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'big-english',
    name: 'Big English',
    publisher: 'Pearson',
    shortDesc: 'A rich primary English course integrating CLIL (Content and Language Integrated Learning), 21st-century skills, and assessment for learning.',
    targetAges: 'Ages 6–12',
    levelsCount: 6,
    availableBooksCount: 6,
    featuredBookId: 'big-english-1',
    colorScheme: {
      accent: '#2563EB', // blue-600
      badge: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    books: [
      {
        id: 'big-english-1',
        seriesId: 'big-english',
        title: 'Big English 1',
        level: 'Level 1 (CEFR Pre-A1)',
        audience: 'Primary Year 1',
        totalUnits: 9,
        type: 'Student Book',
        colorScheme: {
          primary: '#2563EB',
          accent: '#EA580C',
          badgeBg: 'bg-blue-50',
          badgeText: 'text-blue-800',
        },
        pageSpreads: [
          {
            id: 'big-english-1-p10-11',
            pageNumbers: '10–11',
            leftPageNumber: 10,
            rightPageNumber: 11,
            unitNumber: 1,
            unitTitle: 'In the Classroom',
            title: 'In the Classroom',
            subtitle: 'Objects & Classroom Commands',
            bookContent: {
              curriculumObjectives: [
                'Follow essential classroom imperatives: stand up, sit down, open your book, close your book.',
                'Identify classroom tools: marker, scissors, glue stick, folder.',
                'Respond physically and verbally to teacher directions.',
              ],
              targetVocabulary: [
                { id: 'be-v1', word: 'marker', phonetic: '/ˈmɑː.kər/', partOfSpeech: 'noun', translationOrNote: 'Colored pen for whiteboards' },
                { id: 'be-v2', word: 'scissors', phonetic: '/ˈsɪz.əz/', partOfSpeech: 'noun (plural)', translationOrNote: 'Tool for cutting paper' },
                { id: 'be-v3', word: 'glue stick', phonetic: '/ˈɡluː ˌstɪk/', partOfSpeech: 'noun', translationOrNote: 'Adhesive tube' },
                { id: 'be-v4', word: 'folder', phonetic: '/ˈfəʊl.dər/', partOfSpeech: 'noun', translationOrNote: 'Holds loose papers' },
              ],
              targetLanguage: {
                question: 'Open your book, please. What is this?',
                answer: 'It is a marker. / Here are the scissors.',
                variations: ['Please pass the glue stick.'],
              },
              grammarFocus: [
                'Imperative mood for instructions',
                'Plural noun without singular form: "scissors"',
              ],
              skills: ['Total Physical Response (TPR)', 'Classroom management compliance', 'Listening to imperatives'],
              activities: [
                {
                  id: 'be-act-1',
                  number: 1,
                  title: 'Listen and do',
                  type: 'Listening',
                  audioTrack: 'Track 09',
                  instructions: 'Listen to the teacher and perform the action.',
                },
                {
                  id: 'be-act-2',
                  number: 2,
                  title: 'Simon Says Classroom Edition',
                  type: 'Game',
                  instructions: 'Only follow instructions if Simon Says is spoken!',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Focuses on functional classroom survival English and motor action commands, ensuring learners understand real-time teacher instructions.',
              priorKnowledge: ['Body parts (hands, feet)', 'Basic listening gestures'],
              teacherFocus: {
                recognition: 'Hearing instructions and reacting instantly',
                productiveResponse: 'Speaking the command to a peer',
                goal: 'Link physical movement directly with English imperative verbs.',
              },
              likelyDifficulties: [
                {
                  issue: 'Treating scissors as singular',
                  studentSays: 'It is a scissors.',
                  targetPattern: 'These are scissors. / A pair of scissors.',
                  teachingResponse: 'Show the two blades opening: two blades means plural "scissors".',
                },
              ],
              buildsToward: [
                { phase: 'Unit 2', pattern: 'May I borrow your scissors?' },
              ],
              learningProgression: [
                { step: 1, title: 'Teacher Demo', description: 'Exaggerated physical actions.' },
                { step: 2, title: 'Group Echo', description: 'Class shouts command and does movement.' },
                { step: 3, title: 'Student Conductor', description: 'Individual student directs table peers.' },
              ],
              curriculumFloor: [
                'Accurately respond to 4 core classroom imperatives.',
                'Identify marker, scissors, glue stick.',
              ],
              optionalDepth: ['Student gives novel 2-step command: "Stand up and point to the door."'],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Commands',
                title: 'Classroom Action',
                heroIllustrationType: 'classroom_scene',
                exercise1: {
                  number: '1',
                  text: 'Listen and do the actions.',
                  audioTrack: '09',
                  items: [
                    { id: 1, label: '1. Stand up' },
                    { id: 2, label: '2. Sit down' },
                    { id: 3, label: '3. Open book' },
                    { id: 4, label: '4. Close book' },
                  ],
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Tools',
                title: 'Tools for Learning',
                exercise3: {
                  number: '2',
                  text: 'Listen and point to the tools.',
                  audioTrack: '10',
                  grammarBanner: {
                    prompt: 'Classroom Request',
                    pattern: 'Pass the glue stick, please.',
                  },
                },
                exercise4: {
                  number: '3',
                  text: 'Play Simon Says with your team.',
                  gamePrompt: 'Simon says touch your folder!',
                  partnerIcon: true,
                },
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'reach-higher',
    name: 'Reach Higher',
    publisher: 'National Geographic Learning',
    shortDesc: 'A rigorous academic literacy and language program using authentic content, rich photography, and inquiry-based critical thinking.',
    targetAges: 'Ages 6–12',
    levelsCount: 6,
    availableBooksCount: 4,
    featuredBookId: 'reach-higher-1',
    colorScheme: {
      accent: '#CA8A04', // yellow-600
      badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    },
    books: [
      {
        id: 'reach-higher-1',
        seriesId: 'reach-higher',
        title: 'Reach Higher 1',
        level: 'Level 1 (CEFR A1)',
        audience: 'Primary Year 1 / Early Immersion',
        totalUnits: 8,
        type: 'Student Book',
        colorScheme: {
          primary: '#1E3A8A', // blue-900
          accent: '#EAB308',
          badgeBg: 'bg-amber-50',
          badgeText: 'text-amber-900',
        },
        pageSpreads: [
          {
            id: 'reach-higher-1-p14-15',
            pageNumbers: '14–15',
            leftPageNumber: 14,
            rightPageNumber: 15,
            unitNumber: 1,
            unitTitle: 'Welcome to Our School',
            title: 'Welcome to Our School',
            subtitle: 'School Places & Community Helpers',
            bookContent: {
              curriculumObjectives: [
                'Explore school locations: playground, library, cafeteria, gym, classroom, nurse’s office.',
                'Identify who works at school: teacher, librarian, principal, nurse.',
                'Connect places to learning functions: "We read in the library."',
              ],
              targetVocabulary: [
                { id: 'rh-v1', word: 'library', phonetic: '/ˈlaɪ.brər.i/', partOfSpeech: 'noun', translationOrNote: 'Place with many books' },
                { id: 'rh-v2', word: 'playground', phonetic: '/ˈpleɪ.ɡraʊnd/', partOfSpeech: 'noun', translationOrNote: 'Outdoor play area' },
                { id: 'rh-v3', word: 'cafeteria', phonetic: '/ˌkæf.əˈtɪə.ri.ə/', partOfSpeech: 'noun', translationOrNote: 'Place where lunch is eaten' },
                { id: 'rh-v4', word: 'gym', phonetic: '/dʒɪm/', partOfSpeech: 'noun', translationOrNote: 'Large room for sports' },
              ],
              targetLanguage: {
                question: 'Where do we go to read? / Where is the librarian?',
                answer: 'We go to the library. / She is in the library.',
                variations: ['We play on the playground.'],
              },
              grammarFocus: [
                'Locative preposition "in" and "on"',
                'Subject pronoun "we" for communal school activities',
              ],
              skills: ['Spatial mapping', 'Inquiry discussion', 'Academic vocabulary building'],
              activities: [
                {
                  id: 'rh-act-1',
                  number: 1,
                  title: 'Explore the National Geographic School Photo',
                  type: 'Reading',
                  instructions: 'Observe students in an outdoor school in Kenya and an indoor library in Tokyo.',
                },
              ],
            },
            teachingIntelligence: {
              lessonOverview:
                'Expands global perspective by showing how school communities around the world share common places and purposes.',
              priorKnowledge: ['School concept', 'Basic action verbs (read, play, eat)'],
              teacherFocus: {
                recognition: 'School places and their social purpose',
                productiveResponse: 'We eat in the cafeteria.',
                goal: 'Construct complete sentences pairing place with action.',
              },
              likelyDifficulties: [
                {
                  issue: 'Preposition mix-up (in the playground vs on the playground)',
                  studentSays: 'We play in playground.',
                  targetPattern: 'We play on the playground.',
                  teachingResponse: 'Associate open sky with "on" and enclosed rooms with "in".',
                },
              ],
              buildsToward: [
                { phase: 'Unit 2 Community', pattern: 'Where do people work in our neighborhood?' },
              ],
              learningProgression: [
                { step: 1, title: 'Photo Inquiry', description: 'Ask: "What are the children doing here?"' },
                { step: 2, title: 'Place Matching', description: 'Match activity flashcard to school room.' },
                { step: 3, title: 'School Tour Walk', description: 'Walk hallway and speak names of locations.' },
              ],
              curriculumFloor: [
                'Name 4 school locations.',
                'Express 1 activity per location: "We read in the library."',
              ],
              optionalDepth: ['Compare school features across different countries and climates.'],
            },
            visuals: {
              leftPage: {
                headerBadge: 'Unit 1 · Global Schools',
                title: 'Places at School',
                heroIllustrationType: 'classroom_scene',
                exercise1: {
                  number: '1',
                  text: 'Look at the photographs. Where are the children?',
                  items: [
                    { id: 1, label: '1. Library' },
                    { id: 2, label: '2. Playground' },
                    { id: 3, label: '3. Cafeteria' },
                    { id: 4, label: '4. Gym' },
                  ],
                },
              },
              rightPage: {
                headerBadge: 'Unit 1 · Inquiry',
                title: 'What do we do here?',
                exercise3: {
                  number: '2',
                  text: 'Connect the action to the place.',
                  grammarBanner: {
                    prompt: 'School Action Frame',
                    pattern: 'We read in the library. We play on the playground.',
                  },
                },
                exercise4: {
                  number: '3',
                  text: 'Draw your favorite spot at school.',
                  partnerIcon: true,
                },
              },
            },
          },
        ],
      },
    ],
  },
];
