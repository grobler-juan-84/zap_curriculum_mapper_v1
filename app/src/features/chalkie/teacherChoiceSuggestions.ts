/** Prototype AI prior-learning suggestions for teacher-choice Step 2 (BE2 U8). */

export type TeacherChoiceSuggestion = {
  id: string
  label: string
  source: string
  frame: string
  whyItMayHelp: string
  caution: string
  evidenceNote: string
}

export const BE2_U08_AI_SUGGESTIONS: TeacherChoiceSuggestion[] = [
  {
    id: 'PL-19',
    label: 'Preference',
    source: 'Unit 7',
    frame: 'Do you like + noun? Yes, I do. I like … / No, I don’t. I don’t like …',
    whyItMayHelp: 'It supports fuller preference exchanges with Unit 8 animal vocabulary.',
    caution: 'Keep positive and negative answers accurate.',
    evidenceNote: 'Previously used for food preferences in Unit 7.',
  },
  {
    id: 'PL-08',
    label: 'Agreement',
    source: 'Unit 2',
    frame: 'Me, too! / Me neither!',
    whyItMayHelp: 'It can extend a short preference exchange.',
    caution: '“Me neither!” follows a negative statement only.',
    evidenceNote:
      'Previously used for agreement after positive or negative preference statements in Unit 2.',
  },
  {
    id: 'PL-01',
    label: 'Action description',
    source: 'Unit 1',
    frame: 'What’s he/she doing? He/She’s + -ing.',
    whyItMayHelp: 'It supports talking about animal actions after ability language.',
    caution: 'Animal examples are teacher/mapper adaptations, not exact publisher wording.',
    evidenceNote: 'Previously used for singular present-continuous action descriptions in Unit 1.',
  },
  {
    id: 'PL-03',
    label: 'Quantity',
    source: 'Units 1 and 6',
    frame: 'How many + plural noun are there? There are …',
    whyItMayHelp: 'It is useful when there is a clear animal picture or scene to count.',
    caution: 'Use only with countable plural animals and a visible count.',
    evidenceNote: 'Previously used for counting pictures and objects in Units 1 and 6.',
  },
]
