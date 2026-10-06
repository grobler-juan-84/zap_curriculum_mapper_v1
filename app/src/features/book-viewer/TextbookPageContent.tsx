import React from 'react';
import type { PageSpread } from '../../types/curriculum';
import { Volume2, Users } from 'lucide-react';

interface TextbookPageContentProps {
  spread: PageSpread;
  pageSide: 'left' | 'right';
  onWordClick?: (word: string) => void;
  highlightedWord?: string | null;
}

export const TextbookPageContent: React.FC<TextbookPageContentProps> = ({
  spread,
  pageSide,
  onWordClick,
  highlightedWord,
}) => {
  const pageNumber = pageSide === 'left' ? spread.leftPageNumber : spread.rightPageNumber;
  const { bookContent, visuals } = spread;

  // Render left page
  if (pageSide === 'left') {
    return (
      <div className="w-full h-full bg-[#FCFDFD] text-slate-800 flex flex-col justify-between p-5 font-sans select-none relative overflow-hidden border-r border-slate-200 shadow-inner">
        {/* Top Unit Banner */}
        <div className="border-b-2 border-amber-400 pb-2 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-900 font-extrabold text-sm px-2.5 py-0.5 rounded shadow-xs">
              Unit {spread.unitNumber}
            </span>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {spread.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <span>{visuals.leftPage.headerBadge}</span>
          </div>
        </div>

        {/* Dynamic Spread Content based on Spread ID */}
        {spread.id === 'beehive-1-p6-7' && (
          <div className="flex-1 flex flex-col justify-between space-y-3">
            {/* Exercise 1 */}
            <div className="bg-sky-50/70 border border-sky-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="font-semibold text-xs text-sky-950">
                    Listen, point and repeat.
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                  <Volume2 className="w-3 h-3" /> Track 04
                </span>
              </div>

              {/* Classroom Illustration Graphic Simulation */}
              <div className="relative bg-gradient-to-b from-sky-100 to-amber-50 border border-sky-200 rounded-md p-3 h-48 flex flex-col justify-between overflow-hidden shadow-xs">
                {/* Wall Elements */}
                <div className="flex justify-between items-start">
                  {/* Clock (1) */}
                  <div
                    onClick={() => onWordClick?.('clock')}
                    className={`cursor-pointer transition-transform hover:scale-105 bg-white p-1 rounded-full border-2 border-slate-300 shadow-sm flex items-center gap-1 ${
                      highlightedWord === 'clock' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-700 bg-white">
                      🕒 9:00
                    </div>
                    <span className="text-[10px] font-bold px-1 bg-amber-200 rounded text-slate-900">1. clock</span>
                  </div>

                  {/* Board (3) */}
                  <div
                    onClick={() => onWordClick?.('board')}
                    className={`cursor-pointer transition-transform hover:scale-105 bg-emerald-800 text-white px-3 py-1.5 rounded border-2 border-amber-700 shadow-md text-center ${
                      highlightedWord === 'board' ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="text-[11px] font-mono text-emerald-100">Welcome! A B C</div>
                    <span className="text-[9px] font-bold bg-amber-400 text-slate-900 px-1 rounded inline-block mt-0.5">
                      3. board
                    </span>
                  </div>

                  {/* Window (4) */}
                  <div
                    onClick={() => onWordClick?.('window')}
                    className={`cursor-pointer transition-transform hover:scale-105 bg-sky-200 border-2 border-sky-400 p-1.5 rounded shadow-sm text-center ${
                      highlightedWord === 'window' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                  >
                    <div className="text-xs">☀️ 🌳</div>
                    <span className="text-[9px] font-bold bg-white text-slate-900 px-1 rounded block mt-0.5">
                      4. window
                    </span>
                  </div>
                </div>

                {/* Middle Floor Elements */}
                <div className="flex justify-between items-end pt-2">
                  {/* Door (2) */}
                  <div
                    onClick={() => onWordClick?.('door')}
                    className={`cursor-pointer transition-transform hover:scale-105 bg-amber-100 border-2 border-amber-600 rounded p-1.5 text-center ${
                      highlightedWord === 'door' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                  >
                    <div className="text-xs">🚪 [Exit]</div>
                    <span className="text-[9px] font-bold bg-amber-300 text-slate-900 px-1 rounded block">
                      2. door
                    </span>
                  </div>

                  {/* Cabinet (7) */}
                  <div
                    onClick={() => onWordClick?.('cabinet')}
                    className={`cursor-pointer transition-transform hover:scale-105 bg-amber-200 border-2 border-amber-700 rounded p-1.5 text-center ${
                      highlightedWord === 'cabinet' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                    }`}
                  >
                    <div className="text-xs">🗄️ 📚</div>
                    <span className="text-[9px] font-bold bg-white text-slate-900 px-1 rounded block">
                      7. cabinet
                    </span>
                  </div>

                  {/* Desk & Chair (5, 8) */}
                  <div className="flex items-end gap-1.5">
                    <div
                      onClick={() => onWordClick?.('desk')}
                      className={`cursor-pointer transition-transform hover:scale-105 bg-amber-300 border-2 border-amber-700 rounded px-2 py-1 text-center ${
                        highlightedWord === 'desk' ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <div className="text-xs">📖 ✏️</div>
                      <span className="text-[9px] font-bold bg-amber-500 text-white px-1 rounded block">
                        5. desk
                      </span>
                    </div>

                    <div
                      onClick={() => onWordClick?.('chair')}
                      className={`cursor-pointer transition-transform hover:scale-105 bg-blue-100 border-2 border-blue-600 rounded px-1.5 py-1 text-center ${
                        highlightedWord === 'chair' ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <div className="text-xs">🪑</div>
                      <span className="text-[9px] font-bold bg-blue-600 text-white px-1 rounded block">
                        8. chair
                      </span>
                    </div>
                  </div>

                  {/* Trash Can (6) */}
                  <div
                    onClick={() => onWordClick?.('trash can')}
                    className={`cursor-pointer transition-transform hover:scale-105 bg-slate-200 border-2 border-slate-500 rounded p-1 text-center ${
                      highlightedWord === 'trash can' ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="text-xs">🗑️</div>
                    <span className="text-[9px] font-bold bg-slate-700 text-white px-1 rounded block">
                      6. trash can
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 2 */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-2.5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <span className="font-semibold text-xs text-amber-950">
                  Numbers Game. Say and point.
                </span>
              </div>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-amber-200 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <span className="text-amber-600 font-bold">Child A:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded italic">“Number 3!”</span>
                </div>
                <span className="text-slate-400">➔</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <span className="text-sky-600 font-bold">Child B:</span>
                  <span className="bg-sky-50 text-sky-900 px-2 py-0.5 rounded italic font-semibold">
                    “It is a board!”
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spread pp. 8-9 (School Supplies) */}
        {spread.id === 'beehive-1-p8-9' && (
          <div className="flex-1 flex flex-col justify-between space-y-3">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="font-semibold text-xs text-emerald-950">
                    Listen, point and repeat supplies.
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Track 06
                </span>
              </div>

              {/* Backpack Grid */}
              <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded border border-emerald-200">
                {bookContent.targetVocabulary.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onWordClick?.(item.word)}
                    className="p-1.5 rounded bg-emerald-50/50 hover:bg-emerald-100 border border-emerald-200 text-center cursor-pointer transition-transform hover:scale-105"
                  >
                    <div className="text-base mb-0.5">
                      {idx === 0 ? '🖊️' : idx === 1 ? '✏️' : idx === 2 ? '🧼' : idx === 3 ? '📏' : idx === 4 ? '🖍️' : idx === 5 ? '🎒' : idx === 6 ? '👝' : '📓'}
                    </div>
                    <div className="text-[11px] font-bold text-slate-900">{idx + 1}. {item.word}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <span className="font-semibold text-xs text-sky-950">Chant: My School Bag</span>
              </div>
              <p className="text-xs text-slate-700 italic bg-white p-2 rounded border border-sky-100">
                “A pen, a pencil, an eraser too! Everything fits in my backpack blue!”
              </p>
            </div>
          </div>
        )}

        {/* Spread pp. 10-11 (Story) */}
        {spread.id === 'beehive-1-p10-11' && (
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-950">Comic Story: The Messy Desk</span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Track 08
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 block">Frame 1</span>
                  <div className="text-sm my-1">📚💥✏️</div>
                  <p className="text-[11px] font-medium text-slate-800">“Oh no! My desk is messy!”</p>
                </div>
                <div className="bg-white p-2 rounded border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 block">Frame 2</span>
                  <div className="text-sm my-1">🤝✨</div>
                  <p className="text-[11px] font-medium text-slate-800">“Can you help me, please?”</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spread pp. 12-13 (Phonics) */}
        {spread.id === 'beehive-1-p12-13' && (
          <div className="flex-1 flex flex-col justify-between space-y-2">
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-950">Phonics Focus: Letter B & D</span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Track 10
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2.5 rounded border border-amber-300 text-center">
                  <div className="text-2xl font-extrabold text-amber-600">Bb</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">/b/ /b/ board</div>
                  <div className="text-[10px] text-slate-500">book · bag · boy</div>
                </div>
                <div className="bg-white p-2.5 rounded border border-amber-300 text-center">
                  <div className="text-2xl font-extrabold text-amber-600">Dd</div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">/d/ /d/ desk</div>
                  <div className="text-[10px] text-slate-500">door · duck · dog</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for other books */}
        {spread.id !== 'beehive-1-p6-7' && spread.id !== 'beehive-1-p8-9' && spread.id !== 'beehive-1-p10-11' && spread.id !== 'beehive-1-p12-13' && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-slate-50 rounded border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">{spread.title}</h3>
            <p className="text-xs text-slate-600 mb-3">{spread.subtitle}</p>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-xs">
              {bookContent.targetVocabulary.map((v) => (
                <span key={v.id} className="text-xs bg-white px-2 py-1 rounded border border-slate-300 font-medium">
                  {v.word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Page Number Footer */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">{pageNumber}</span>
          <span className="text-[10px]">Oxford University Press · Beehive 1</span>
        </div>
      </div>
    );
  }

  // Render right page
  return (
    <div className="w-full h-full bg-[#FCFDFD] text-slate-800 flex flex-col justify-between p-5 font-sans select-none relative overflow-hidden shadow-inner">
      {/* Top Grammar Banner */}
      <div className="border-b-2 border-sky-400 pb-2 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-sky-500 text-white font-extrabold text-sm px-2.5 py-0.5 rounded shadow-xs">
            Language
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {spread.bookContent.targetLanguage.question}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
          <span>{visuals.rightPage.headerBadge}</span>
        </div>
      </div>

      {/* Dynamic Right Page Content */}
      {spread.id === 'beehive-1-p6-7' && (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          {/* Exercise 3: Grammar Spotlight */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border-2 border-sky-300 rounded-lg p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span className="font-bold text-xs text-sky-950">
                  Listen and say. Then practice.
                </span>
              </div>
              <span className="text-[10px] font-mono text-sky-700 bg-white px-1.5 py-0.5 rounded border border-sky-200 flex items-center gap-1">
                <Volume2 className="w-3 h-3" /> Track 05
              </span>
            </div>

            {/* Grammar Box Frame */}
            <div className="bg-white rounded-md p-3 border border-sky-200 shadow-xs mb-2">
              <div className="flex items-center justify-around text-center">
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Question</div>
                  <div className="text-sm font-bold text-indigo-700">What is it?</div>
                </div>
                <div className="text-slate-300 text-lg">➔</div>
                <div className="text-left">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Answer</div>
                  <div className="text-sm font-bold text-emerald-700">It is a desk.</div>
                  <div className="text-[10px] text-slate-500 italic mt-0.5">(It’s = It is)</div>
                </div>
              </div>
            </div>

            {/* 4 Mini Practice Prompts */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-1.5 bg-white rounded border border-sky-100 hover:border-sky-300 cursor-pointer">
                <div className="text-sm">🕒</div>
                <div className="text-[10px] font-semibold text-slate-700">a clock</div>
              </div>
              <div className="p-1.5 bg-white rounded border border-sky-100 hover:border-sky-300 cursor-pointer">
                <div className="text-sm">🪑</div>
                <div className="text-[10px] font-semibold text-slate-700">a chair</div>
              </div>
              <div className="p-1.5 bg-white rounded border border-sky-100 hover:border-sky-300 cursor-pointer">
                <div className="text-sm">🚪</div>
                <div className="text-[10px] font-semibold text-slate-700">a door</div>
              </div>
              <div className="p-1.5 bg-white rounded border border-sky-100 hover:border-sky-300 cursor-pointer">
                <div className="text-sm">🗄️</div>
                <div className="text-[10px] font-semibold text-slate-700">a cabinet</div>
              </div>
            </div>
          </div>

          {/* Exercise 4: Communicative Pair Work */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <span className="font-bold text-xs text-amber-950">
                  Look at your classroom. Ask and answer.
                </span>
              </div>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Users className="w-3 h-3" /> Pair Practice
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-amber-200 flex items-center justify-between">
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-700">Partner A:</span>
                  <span className="italic text-slate-700">“What is it?” (points to window)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sky-700">Partner B:</span>
                  <span className="font-semibold text-slate-900 bg-sky-50 px-1.5 py-0.5 rounded">
                    “It is a window!”
                  </span>
                </div>
              </div>
              <div className="text-xl">👉 🪟</div>
            </div>
          </div>
        </div>
      )}

      {/* pp. 8-9 Right Page (Colors) */}
      {spread.id === 'beehive-1-p8-9' && (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-emerald-950">Grammar Focus: What color is it?</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                Track 07
              </span>
            </div>
            <div className="bg-white rounded p-3 border border-emerald-200 text-center mb-2">
              <div className="text-sm font-bold text-emerald-800">What color is it?</div>
              <div className="text-sm font-bold text-slate-900 mt-1">It’s yellow. / It’s a yellow crayon.</div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-1 bg-red-50 border border-red-200 rounded font-semibold text-red-700">Red pen</div>
              <div className="p-1 bg-blue-50 border border-blue-200 rounded font-semibold text-blue-700">Blue bag</div>
              <div className="p-1 bg-amber-50 border border-amber-200 rounded font-semibold text-amber-700">Yellow ruler</div>
              <div className="p-1 bg-green-50 border border-green-200 rounded font-semibold text-green-700">Green book</div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-xs font-bold text-amber-950 mb-1">Mystery Bag Game</div>
            <p className="text-xs text-slate-700">
              Pick an item from your school bag without looking. Guess the color and object!
            </p>
          </div>
        </div>
      )}

      {/* pp. 10-11 Right Page (Values & Project) */}
      {spread.id === 'beehive-1-p10-11' && (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs font-bold text-purple-950 mb-2">Social Value: Helping in Class</div>
            <div className="bg-white p-3 rounded border border-purple-200 text-center">
              <div className="text-sm font-bold text-purple-900">“Can you help me, please?”</div>
              <div className="text-sm font-bold text-emerald-700 mt-1">“Sure! Here is your pencil!”</div>
            </div>
          </div>
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-2.5">
            <div className="text-xs font-bold text-sky-950 mb-1">Class Clean-up Pledge</div>
            <p className="text-xs text-slate-700">We keep our desks tidy and help each other learn.</p>
          </div>
        </div>
      )}

      {/* pp. 12-13 Right Page (Review Check) */}
      {spread.id === 'beehive-1-p12-13' && (
        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-xs font-bold text-amber-950 mb-2">Unit 1 Language Check</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white p-2 rounded border border-amber-200 text-xs">
                <span>1. I can name 8 classroom objects</span>
                <span className="text-amber-500 font-bold">★★★</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded border border-amber-200 text-xs">
                <span>2. I can ask: “What is it?”</span>
                <span className="text-amber-500 font-bold">★★★</span>
              </div>
              <div className="flex items-center justify-between bg-white p-2 rounded border border-amber-200 text-xs">
                <span>3. I can say /b/ and /d/ sounds</span>
                <span className="text-amber-500 font-bold">★★★</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for other spreads */}
      {spread.id !== 'beehive-1-p6-7' && spread.id !== 'beehive-1-p8-9' && spread.id !== 'beehive-1-p10-11' && spread.id !== 'beehive-1-p12-13' && (
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-slate-50 rounded border border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase">Target Language Pattern</div>
          <div className="text-base font-bold text-indigo-700 my-2">{spread.bookContent.targetLanguage.answer}</div>
          <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
            {spread.teachingIntelligence.teacherFocus.goal}
          </div>
        </div>
      )}

      {/* Bottom Page Number Footer */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span className="text-[10px]">Curriculum Floor Focus: Active Spoken Production</span>
        <span className="font-bold text-slate-700">{pageNumber}</span>
      </div>
    </div>
  );
};
