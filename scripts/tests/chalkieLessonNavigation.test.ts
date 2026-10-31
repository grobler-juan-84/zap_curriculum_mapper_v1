import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  findLessonAnchorForPrintedPage,
  isPrintedPageInsideUnitRange,
  listLessonAnchorsForUnit,
  resolveGroundedUnitChrome,
  resolveLessonPagesForPrintedPage,
  resolveNextLessonStep,
  resolvePreviousLessonStep,
  resolveUnitForPrintedPage,
} from '../../app/src/features/chalkie/chalkieLessonNavigation.ts'
import { resolveActiveLessonScope } from '../../app/src/features/chalkie/chalkieStudentBookUi.ts'

const BE3_UNIT_RANGES = [
  {
    unitNumber: 8,
    title: 'Healthy Living',
    printedPageStart: 128,
    printedPageEnd: 143,
  },
  {
    unitNumber: 9,
    title: 'School Trips',
    printedPageStart: 144,
    printedPageEnd: 159,
  },
] as const

const BE3 = 'big_english_3_sb'
const U8 = 8

const EXPECTED_U08_SEQUENCE = [
  [128, 129],
  [130, 131],
  [132, 133],
  [134, 135],
  [136, 137],
  [138, 139],
  [140],
  [141],
  [142],
  [143],
] as const

describe('BE3 Unit 8 lesson anchors', () => {
  test('lists the complete Unit 8 lesson sequence including Values', () => {
    const anchors = listLessonAnchorsForUnit({
      studentBookCatalogId: BE3,
      unitNumber: U8,
    })
    assert.equal(anchors.length, 10)
    assert.deepEqual(
      anchors.map((a) => [...a.studentBookPrintedPages]),
      EXPECTED_U08_SEQUENCE.map((pages) => [...pages]),
    )
    const values = anchors.find((a) => a.studentBookPrintedPages[0] === 142)
    assert.ok(values)
    assert.equal(values.companionRelationshipId, null)
  })

  test('Writing → Phonics → Values → Review next chain', () => {
    let pages: number[] = [140]
    for (const expected of [[141], [142], [143]] as const) {
      const step = resolveNextLessonStep({
        studentBookCatalogId: BE3,
        unitNumber: U8,
        currentLessonPages: pages,
      })
      assert.equal(step.kind, 'lesson')
      if (step.kind === 'lesson') {
        assert.deepEqual([...step.anchor.studentBookPrintedPages], [...expected])
        pages = [...step.anchor.studentBookPrintedPages]
      }
    }
    const end = resolveNextLessonStep({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      currentLessonPages: [143],
    })
    assert.equal(end.kind, 'end_of_unit')
  })

  test('previous navigation across mixed one/two-page lessons', () => {
    const fromPhonics = resolvePreviousLessonStep({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      currentLessonPages: [141],
    })
    assert.equal(fromPhonics.kind, 'lesson')
    if (fromPhonics.kind === 'lesson') {
      assert.deepEqual([...fromPhonics.anchor.studentBookPrintedPages], [140])
    }

    const fromWriting = resolvePreviousLessonStep({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      currentLessonPages: [140],
    })
    assert.equal(fromWriting.kind, 'lesson')
    if (fromWriting.kind === 'lesson') {
      assert.deepEqual([...fromWriting.anchor.studentBookPrintedPages], [138, 139])
    }

    const fromOpener = resolvePreviousLessonStep({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      currentLessonPages: [128, 129],
    })
    assert.equal(fromOpener.kind, 'start_of_unit')
  })

  test('Go resolves both pages of every two-page component', () => {
    const pairs = [
      [128, 129],
      [130, 131],
      [132, 133],
      [134, 135],
      [136, 137],
      [138, 139],
    ] as const
    for (const pages of pairs) {
      for (const page of pages) {
        assert.deepEqual(
          resolveLessonPagesForPrintedPage({
            studentBookCatalogId: BE3,
            unitNumber: U8,
            printedPage: page,
          }),
          [...pages],
        )
      }
    }
  })

  test('Go preserves exact companions and Values companion absence', () => {
    const openerLeft = resolveActiveLessonScope({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      visiblePrintedPages: [128],
      activePrintedPage: 128,
    })
    assert.equal(openerLeft.scopeSource, 'lesson_anchor')
    assert.deepEqual(openerLeft.lessonPrintedPages, [128, 129])
    assert.ok(openerLeft.companion)
    assert.deepEqual(openerLeft.companion?.workbookPrintedPages, [104, 105])

    const openerRight = resolveActiveLessonScope({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      visiblePrintedPages: [129],
      activePrintedPage: 129,
    })
    assert.deepEqual(openerRight.lessonPrintedPages, [128, 129])
    assert.deepEqual(openerRight.companion?.workbookPrintedPages, [104, 105])

    const story = resolveActiveLessonScope({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      visiblePrintedPages: [131],
      activePrintedPage: 131,
    })
    assert.deepEqual(story.lessonPrintedPages, [130, 131])
    assert.deepEqual(story.companion?.workbookPrintedPages, [106])

    const values = resolveActiveLessonScope({
      studentBookCatalogId: BE3,
      unitNumber: U8,
      visiblePrintedPages: [142],
      activePrintedPage: 142,
    })
    assert.deepEqual(values.lessonPrintedPages, [142])
    assert.equal(values.companion, null)
    assert.equal(
      findLessonAnchorForPrintedPage({
        studentBookCatalogId: BE3,
        unitNumber: U8,
        printedPage: 142,
      })?.companionRelationshipId,
      null,
    )
  })

  test('Review is end of unit; outside-unit page check', () => {
    assert.equal(
      resolveNextLessonStep({
        studentBookCatalogId: BE3,
        unitNumber: U8,
        currentLessonPages: [143],
      }).kind,
      'end_of_unit',
    )
    assert.equal(
      isPrintedPageInsideUnitRange({
        printedPage: 143,
        unitPrintedPageStart: 128,
        unitPrintedPageEnd: 143,
      }),
      true,
    )
    assert.equal(
      isPrintedPageInsideUnitRange({
        printedPage: 144,
        unitPrintedPageStart: 128,
        unitPrintedPageEnd: 143,
      }),
      false,
    )
  })

  test('does not invent lesson anchors for other units', () => {
    assert.deepEqual(
      listLessonAnchorsForUnit({
        studentBookCatalogId: BE3,
        unitNumber: 7,
      }),
      [],
    )
    assert.equal(
      resolveLessonPagesForPrintedPage({
        studentBookCatalogId: 'beehive_1_sb',
        unitNumber: 1,
        printedPage: 6,
      }),
      null,
    )
  })
})

describe('grounded unit chrome (SCOPE-01 residual)', () => {
  test('Review p.143 keeps Unit 8 grounded chrome', () => {
    const chrome = resolveGroundedUnitChrome({
      printedPage: 143,
      selectedUnitNumber: 8,
      selectedUnitTitle: 'Healthy Living',
      selectedUnitPrintedPageStart: 128,
      selectedUnitPrintedPageEnd: 143,
      bookUnits: BE3_UNIT_RANGES,
    })
    assert.equal(chrome.status, 'inside_selected')
    assert.equal(chrome.groundedUnitNumber, '8')
    assert.equal(chrome.groundedUnitLabel, 'Unit 8: Healthy Living')
  })

  test('p.144 and p.146 do not retain Unit 8 grounded chrome', () => {
    for (const page of [144, 146] as const) {
      const chrome = resolveGroundedUnitChrome({
        printedPage: page,
        selectedUnitNumber: 8,
        selectedUnitTitle: 'Healthy Living',
        selectedUnitPrintedPageStart: 128,
        selectedUnitPrintedPageEnd: 143,
        bookUnits: BE3_UNIT_RANGES,
      })
      assert.equal(chrome.status, 'outside_resolved_other')
      assert.notEqual(chrome.groundedUnitNumber, '8')
      assert.equal(chrome.groundedUnitNumber, '9')
      assert.equal(
        chrome.groundedUnitLabel?.includes('Unit 8'),
        false,
      )
      assert.equal(
        resolveUnitForPrintedPage(BE3_UNIT_RANGES, page)?.unitNumber,
        9,
      )
    }
  })

  test('re-entering Unit 8 pages restores Unit 8 chrome', () => {
    const outside = resolveGroundedUnitChrome({
      printedPage: 146,
      selectedUnitNumber: 8,
      selectedUnitTitle: 'Healthy Living',
      selectedUnitPrintedPageStart: 128,
      selectedUnitPrintedPageEnd: 143,
      bookUnits: BE3_UNIT_RANGES,
    })
    assert.equal(outside.status, 'outside_resolved_other')

    for (const page of [128, 135, 140, 143] as const) {
      const chrome = resolveGroundedUnitChrome({
        printedPage: page,
        selectedUnitNumber: 8,
        selectedUnitTitle: 'Healthy Living',
        selectedUnitPrintedPageStart: 128,
        selectedUnitPrintedPageEnd: 143,
        bookUnits: BE3_UNIT_RANGES,
      })
      assert.equal(chrome.status, 'inside_selected')
      assert.equal(chrome.groundedUnitNumber, '8')
      assert.equal(chrome.groundedUnitLabel, 'Unit 8: Healthy Living')
    }
  })

  test('unresolved outside pages clear chrome without inventing a unit', () => {
    const chrome = resolveGroundedUnitChrome({
      printedPage: 200,
      selectedUnitNumber: 8,
      selectedUnitTitle: 'Healthy Living',
      selectedUnitPrintedPageStart: 128,
      selectedUnitPrintedPageEnd: 143,
      bookUnits: BE3_UNIT_RANGES,
    })
    assert.equal(chrome.status, 'outside_unresolved')
    assert.equal(chrome.groundedUnitNumber, null)
    assert.equal(chrome.groundedUnitLabel, null)
  })
})
