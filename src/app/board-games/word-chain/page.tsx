"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";
import { WORD_CHAIN_WORDS } from "@/data/word-chain-words";

const WORD_LIST = new Set(WORD_CHAIN_WORDS);
const WORD_ARRAY = WORD_CHAIN_WORDS;

// 15 秒要想出單字再用手機打完，對國小孩子太趕
const TURN_TIME = 30;

function getWordsStartingWith(letter: string): string[] {
  return WORD_ARRAY.filter(w => w.startsWith(letter.toLowerCase()));
}

function getRandomStarter(used?: Set<string>): string {
  // 起始字的最後一個字母要有夠多字可以接（不然像 box 一開始就接不下去）
  const starters = WORD_ARRAY.filter(w => w.length >= 3 && w.length <= 6 && !used?.has(w)
    && getWordsStartingWith(w.slice(-1)).length >= 20);
  return starters[Math.floor(Math.random() * starters.length)];
}

export default function WordChainPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [chain, setChain] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [turnTime, setTurnTime] = useState(TURN_TIME);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);
  const [lives, setLives] = useState(3);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("word-chain");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chainEndRef = useRef<HTMLDivElement>(null);

  // 提示的字在畫面上會加括號顯示，取最後一個字母時要先把括號拿掉
  // （原本會取到「)」，之後任何字都接不上）
  const lastLetter = chain.length > 0 ? chain[chain.length - 1].replace(/[^a-z]/g, "").slice(-1) : "";

  const endGame = useCallback((finalScore: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScore(finalScore);
    const newHigh = updateHighScore(finalScore);
    setIsNewHigh(newHigh);
    if (finalScore >= 200) playPerfect();
    else if (finalScore >= 100) playVictory();
    setMode("done");
  }, [updateHighScore]);

  const resetTurnTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTurnTime(TURN_TIME);
    let t = TURN_TIME;
    timerRef.current = setInterval(() => {
      t--;
      setTurnTime(t);
    }, 1000);
  }, []);

  const startGame = useCallback(() => {
    const starter = getRandomStarter();
    setChain([starter]);
    setUsedWords(new Set([starter]));
    setInput("");
    setScore(0);
    setLives(3);
    setFeedback(null);
    setIsNewHigh(false);
    setMode("playing");
    resetTurnTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [resetTurnTimer]);

  // Watch for turn timer expiry
  useEffect(() => {
    if (turnTime <= 0 && mode === "playing") {
      playWrong();
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({ type: "wrong", msg: "時間到！" });
      setTimeout(() => setFeedback(null), 1500);

      if (newLives <= 0) {
        endGame(score);
      } else {
        // Give a hint word and continue
        const available = getWordsStartingWith(lastLetter).filter(w => !usedWords.has(w));
        if (available.length === 0) {
          endGame(score);
        } else {
          const hint = available[Math.floor(Math.random() * available.length)];
          setChain(prev => [...prev, `(${hint})`]);
          setUsedWords(prev => { const s = new Set(Array.from(prev)); s.add(hint); return s; });
          resetTurnTimer();
          setInput("");
        }
      }
    }
  }, [turnTime, mode, lives, score, lastLetter, usedWords, endGame, resetTurnTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    chainEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chain]);

  const handleSubmit = useCallback(() => {
    if (mode !== "playing") return;
    const word = input.trim().toLowerCase();
    setInput("");

    if (word.length < 2) {
      setFeedback({ type: "wrong", msg: "至少 2 個字母" });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (chain.length > 0 && word[0] !== lastLetter) {
      playWrong();
      setFeedback({ type: "wrong", msg: `必須以「${lastLetter.toUpperCase()}」開頭` });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (usedWords.has(word)) {
      playWrong();
      setFeedback({ type: "wrong", msg: "這個字已經用過了" });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (!WORD_LIST.has(word)) {
      // 字典收的字有限，孩子打的可能是真的單字，所以不扣生命，只請他換一個
      playWrong();
      setFeedback({ type: "wrong", msg: "字典裡沒有這個字，換一個試試（不扣生命）" });
      setTimeout(() => setFeedback(null), 2000);
      inputRef.current?.focus();
      return;
    }

    // Valid word!
    playCorrect();
    const wordScore = word.length * 2 + (turnTime > 20 ? 5 : turnTime > 10 ? 3 : 1);
    const newScore = score + wordScore;
    setScore(newScore);
    setChain(prev => [...prev, word]);
    setUsedWords(prev => { const s = new Set(Array.from(prev)); s.add(word); return s; });
    setFeedback({ type: "correct", msg: `+${wordScore} 分` });
    setTimeout(() => setFeedback(null), 1000);
    resetTurnTimer();
    inputRef.current?.focus();

    // Check if any words start with last letter of this word
    const nextLetter = word.slice(-1);
    const available = getWordsStartingWith(nextLetter).filter(w => !usedWords.has(w) && w !== word);
    if (available.length === 0) {
      // 這個字母開頭的字用完了（例如 x）：加分，換一個新的字繼續接
      const used = new Set(Array.from(usedWords)); used.add(word);
      const fresh = getRandomStarter(used);
      if (!fresh) { setTimeout(() => endGame(newScore + 50), 500); return; }
      setScore(newScore + 10);
      setChain(prev => [...prev, `(${fresh})`]);
      setUsedWords(prev => { const s = new Set(Array.from(prev)); s.add(fresh); return s; });
      setFeedback({ type: "correct", msg: `沒有 ${nextLetter.toUpperCase()} 開頭的字了，+10 分，換新的字繼續` });
      setTimeout(() => setFeedback(null), 2000);
    }
  }, [mode, input, chain, lastLetter, usedWords, score, turnTime, endGame, resetTurnTimer]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  }, [handleSubmit]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-emerald-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔗</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">接龍大師</h1>
          <p className="text-slate-500 text-sm">英文單字接龍，訓練你的詞彙量</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>系統給出一個起始單字</li>
            <li>你要輸入一個以<span className="font-bold text-emerald-600">前一個字的最後字母</span>開頭的單字</li>
            <li>每個單字只能用一次</li>
            <li>每回合限時 {TURN_TIME} 秒</li>
            <li>共 3 條命，超過時間會扣一條命</li>
            <li>字典裡沒有的字不扣命，換一個字就好</li>
            <li>字越長、速度越快，得分越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          開始接龍
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 200);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-emerald-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          接龍 {chain.length} 個字 ・ 得分 {score}
        </div>
        <GameOverScreen
          score={score} maxScore={200} gameName="接龍大師" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "word-chain", activityName: "接龍大師" }}
        />
        <div className="mt-4 bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm">
          <h4 className="font-bold text-sm text-slate-600 mb-2">完成的接龍：</h4>
          <div className="flex flex-wrap gap-1">
            {chain.map((w, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-full ${w.startsWith("(") ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-700"}`}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-emerald-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">
          {"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}
        </div>
        <div className={`text-sm font-mono ${turnTime <= 5 ? "text-red-500 font-bold" : "text-slate-500"}`}>
          ⏱ {turnTime}s
        </div>
        <div className="text-sm font-bold text-emerald-600">🏆 {score}</div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-4 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${turnTime <= 5 ? "bg-red-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`}
          style={{ width: `${(turnTime / TURN_TIME) * 100}%` }} />
      </div>

      {/* Chain display */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm mb-4 max-h-40 overflow-y-auto">
        <div className="flex flex-wrap gap-1">
          {chain.map((w, i) => (
            <span key={i} className={`text-sm px-2 py-1 rounded-full font-medium
              ${w.startsWith("(") ? "bg-slate-100 text-slate-400 italic" : i === chain.length - 1 ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"}`}>
              {w}
            </span>
          ))}
          <div ref={chainEndRef} />
        </div>
      </div>

      {/* Current requirement */}
      <div className="text-center mb-4">
        <span className="text-sm text-slate-500">請輸入以</span>
        <span className="text-2xl font-black text-emerald-600 mx-2">{lastLetter.toUpperCase()}</span>
        <span className="text-sm text-slate-500">開頭的單字</span>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-sm font-bold mb-2 animate-fadeIn ${feedback.type === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, ""))}
          onKeyDown={handleKeyDown}
          placeholder={`輸入以 ${lastLetter} 開頭的單字...`}
          className="flex-1 px-4 py-4 text-xl font-bold text-center rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition lowercase"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button onClick={handleSubmit}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition active:scale-95">
          送出
        </button>
      </div>
    </div>
  );
}
