import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../../contexts/AchievementContext';
import { useSettings } from '../../contexts/SettingsContext';

// ==========================================
// GAME SHELL UTILITIES
// ==========================================
const GameShell = ({ title, highScoreKey, children, onRestart, score }) => {
  const [highScore, setHighScore] = useState(0);
  const { getAccentColor } = useSettings();
  const accent = getAccentColor();

  useEffect(() => {
    const stored = localStorage.getItem(highScoreKey);
    if (stored) setHighScore(parseInt(stored));
  }, [highScoreKey]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(highScoreKey, score.toString());
    }
  }, [score, highScore, highScoreKey]);

  return (
    <div className="flex flex-col h-full bg-gray-950 font-mono text-gray-200">
      <div className="flex justify-between items-center p-3 border-b border-dark-border bg-black/40">
        <div>
          <span className="text-[10px] text-gray-500 uppercase">GAME MODULE:</span>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
        </div>
        <div className="flex gap-4 text-xs">
          <div>SCORE: <span style={{ color: accent }} className="font-bold">{score}</span></div>
          <div>HI-SCORE: <span className="text-gray-400 font-bold">{highScore}</span></div>
        </div>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-0">
        {children}
      </div>
      <div className="p-3 border-t border-dark-border bg-black/40 flex justify-between items-center text-[10px] text-gray-500">
        <span>CTRL/Cmd keys active</span>
        <button
          onClick={onRestart}
          className="px-2 py-0.5 border border-gray-800 hover:border-white rounded transition-colors text-[9px] cursor-pointer"
        >
          RESTART GAME
        </button>
      </div>
    </div>
  );
};

// ==========================================
// GAME 1: SNAKE
// ==========================================
const GRID_SIZE = 20;
const CELL_SIZE = 14;
const SNAKE_SPEED = 140;

const SnakeGame = ({ onScoreChange }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const spawnFood = useCallback((currentSnake) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    const initialSnake = [{ x: 10, y: 10 }];
    setFood(spawnFood(initialSnake));
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsStarted(true);
  }, [spawnFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const currentDir = directionRef.current;
        let newX = head.x + currentDir.x;
        let newY = head.y + currentDir.y;

        // Wrap walls
        if (newX < 0) newX = GRID_SIZE - 1;
        if (newX >= GRID_SIZE) newX = 0;
        if (newY < 0) newY = GRID_SIZE - 1;
        if (newY >= GRID_SIZE) newY = 0;

        const newHead = { x: newX, y: newY };

        // Self collision
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const nextScore = score + 10;
          setScore(nextScore);
          onScoreChange(nextScore);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SNAKE_SPEED);
    return () => clearInterval(interval);
  }, [isStarted, isGameOver, food, spawnFood, score, onScoreChange]);

  return (
    <div className="flex flex-col items-center select-none">
      <div 
        className="relative bg-black border-2 border-gray-900 overflow-hidden"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
        }}
      >
        {!isStarted || isGameOver ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90">
            {isGameOver && <h2 className="text-red-500 text-lg font-bold mb-3 uppercase tracking-widest">// GAME OVER</h2>}
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded text-xs transition-colors cursor-pointer"
            >
              {isGameOver ? 'RETRY' : 'START SIMULATION'}
            </button>
          </div>
        ) : null}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-pink-500 rounded-full"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE + 1,
            top: food.y * CELL_SIZE + 1,
            boxShadow: '0 0 8px #f43f5e'
          }}
        />

        {/* Snake body */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-green-400' : 'bg-green-600'}`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE + 1,
                top: segment.y * CELL_SIZE + 1,
                boxShadow: isHead ? '0 0 6px #22c55e' : 'none',
                borderRadius: isHead ? '3px' : '1px'
              }}
            />
          );
        })}
      </div>
      {/* Mobile D-Pad Controls */}
      <div className="flex flex-col items-center gap-1 mt-3">
        <button
          onClick={() => { if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 }); }}
          className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-green-600 cursor-pointer flex items-center justify-center"
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => { if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 }); }}
            className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-green-600 cursor-pointer flex items-center justify-center"
          >
            ◀
          </button>
          <button
            onClick={() => { if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 }); }}
            className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-green-600 cursor-pointer flex items-center justify-center"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => { if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 }); }}
          className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-green-600 cursor-pointer flex items-center justify-center"
        >
          ▼
        </button>
      </div>
      <span className="text-[9px] text-gray-500 mt-2 uppercase tracking-widest">Controls: Touch D-Pad / Arrows / WASD</span>
    </div>
  );
};

// ==========================================
// GAME 2: 2048
// ==========================================
const Game2048 = ({ onScoreChange }) => {
  const [board, setBoard] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const addTile = (currentBoard) => {
    const emptyIndices = [];
    currentBoard.forEach((val, idx) => {
      if (val === 0) emptyIndices.push(idx);
    });
    if (emptyIndices.length === 0) return currentBoard;
    
    const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...currentBoard];
    newBoard[randomIdx] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const resetGame = useCallback(() => {
    let fresh = Array(16).fill(0);
    fresh = addTile(fresh);
    fresh = addTile(fresh);
    setBoard(fresh);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
  }, [onScoreChange]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const slideRowLeft = (row) => {
    let filtered = row.filter(val => val !== 0);
    let newRow = [];
    let addedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        newRow.push(mergedVal);
        addedScore += mergedVal;
        i++;
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { row: newRow, addedScore };
  };

  const handleMove = useCallback((direction) => {
    if (gameOver) return;

    let newBoard = [...board];
    let totalAddedScore = 0;
    let changed = false;

    // Helper functions to get and set rows/columns
    const getRow = (idx) => board.slice(idx * 4, idx * 4 + 4);
    const getCol = (idx) => [board[idx], board[idx + 4], board[idx + 8], board[idx + 12]];

    if (direction === 'LEFT' || direction === 'RIGHT') {
      for (let i = 0; i < 4; i++) {
        let row = getRow(i);
        if (direction === 'RIGHT') row.reverse();
        const res = slideRowLeft(row);
        if (direction === 'RIGHT') res.row.reverse();

        // Check if anything changed
        for (let j = 0; j < 4; j++) {
          const boardIdx = i * 4 + j;
          if (newBoard[boardIdx] !== res.row[j]) {
            changed = true;
            newBoard[boardIdx] = res.row[j];
          }
        }
        totalAddedScore += res.addedScore;
      }
    } else {
      // UP or DOWN
      for (let i = 0; i < 4; i++) {
        let col = getCol(i);
        if (direction === 'DOWN') col.reverse();
        const res = slideRowLeft(col);
        if (direction === 'DOWN') res.row.reverse();

        for (let j = 0; j < 4; j++) {
          const boardIdx = j * 4 + i;
          if (newBoard[boardIdx] !== res.row[j]) {
            changed = true;
            newBoard[boardIdx] = res.row[j];
          }
        }
        totalAddedScore += res.addedScore;
      }
    }

    if (changed) {
      newBoard = addTile(newBoard);
      const nextScore = score + totalAddedScore;
      setScore(nextScore);
      onScoreChange(nextScore);
      setBoard(newBoard);

      // Check game over (no zeros and no merges possible)
      const hasEmpty = newBoard.includes(0);
      let mergesPossible = false;
      if (!hasEmpty) {
        // Check horizontal
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 3; j++) {
            if (newBoard[i * 4 + j] === newBoard[i * 4 + j + 1]) mergesPossible = true;
          }
        }
        // Check vertical
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 4; j++) {
            if (newBoard[i * 4 + j] === newBoard[(i + 1) * 4 + j]) mergesPossible = true;
          }
        }
        if (!mergesPossible) setGameOver(true);
      }
    }
  }, [board, gameOver, score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); handleMove('UP'); }
      else if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); handleMove('DOWN'); }
      else if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); handleMove('LEFT'); }
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); handleMove('RIGHT'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const tileColors = {
    0: 'bg-gray-900/60 border-gray-800 text-transparent',
    2: 'bg-green-500/10 border-green-500/30 text-green-400 font-bold',
    4: 'bg-green-500/20 border-green-500/50 text-green-300 font-bold shadow-[0_0_5px_rgba(0,255,65,0.15)]',
    8: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold shadow-[0_0_8px_rgba(0,212,255,0.2)]',
    16: 'bg-cyan-500/25 border-cyan-500/60 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,212,255,0.3)]',
    32: 'bg-purple-500/15 border-purple-500/40 text-purple-400 font-bold shadow-[0_0_12px_rgba(180,0,255,0.25)]',
    64: 'bg-purple-500/30 border-purple-500/70 text-purple-200 font-bold shadow-[0_0_15px_rgba(180,0,255,0.4)]',
    128: 'bg-pink-500/15 border-pink-500/40 text-pink-400 font-bold shadow-[0_0_18px_rgba(255,0,128,0.3)]',
    256: 'bg-pink-500/30 border-pink-500/75 text-pink-200 font-bold shadow-[0_0_20px_rgba(255,0,128,0.5)]',
    512: 'bg-yellow-500/20 border-yellow-500/60 text-yellow-300 font-bold shadow-[0_0_22px_rgba(255,215,0,0.4)]',
    1024: 'bg-yellow-500/40 border-yellow-500/90 text-yellow-100 font-bold shadow-[0_0_25px_rgba(255,215,0,0.6)]',
    2048: 'bg-red-500/30 border-red-500/80 text-white font-extrabold shadow-[0_0_30px_rgba(255,0,64,0.7)] animate-pulse-neon',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative grid grid-cols-4 gap-2 p-2 bg-black border-2 border-gray-900 rounded-lg w-64 h-64 select-none">
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center rounded-lg">
            <h2 className="text-red-500 text-lg font-bold mb-3 uppercase tracking-widest">// COLLAPSED</h2>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-cyan-500 text-black font-bold rounded text-xs transition-colors cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        )}
        {board.map((tile, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center text-xs font-mono rounded border transition-all duration-150 ${tileColors[tile] || tileColors[2048]}`}
          >
            {tile !== 0 ? tile : ''}
          </div>
        ))}
      </div>
      {/* Mobile D-Pad Controls */}
      <div className="flex flex-col items-center gap-1 mt-3">
        <button
          onClick={() => handleMove('UP')}
          className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-cyan-600 cursor-pointer flex items-center justify-center"
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => handleMove('LEFT')}
            className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-cyan-600 cursor-pointer flex items-center justify-center"
          >
            ◀
          </button>
          <button
            onClick={() => handleMove('RIGHT')}
            className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-cyan-600 cursor-pointer flex items-center justify-center"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => handleMove('DOWN')}
          className="w-10 h-8 bg-gray-900 border border-gray-700 rounded text-xs text-white hover:bg-gray-800 active:bg-cyan-600 cursor-pointer flex items-center justify-center"
        >
          ▼
        </button>
      </div>
      <span className="text-[9px] text-gray-500 mt-2 uppercase tracking-widest">Controls: Touch D-Pad / Arrows / WASD</span>
    </div>
  );
};

// ==========================================
// GAME 3: TYPING SPEED TEST
// ==========================================
const SAMPLE_PHRASES = [
  'To build scalable systems, SDE engineers must optimize API endpoints, load balancers, and MongoDB indexes.',
  'Senior full stack engineers design clean decoupled database schemas using proper secondary keys.',
  'React leverages virtual DOM diff reconciliations and lazy loaded split bundles for lightning speeds.',
  'FastAPI routers handle asynchronous event loops and coroutine thread pools efficiently.',
  'Modern microservices exchange decoupled telemetry payloads via secure WebSocket pipelines.'
];

const TypingTestGame = ({ onScoreChange }) => {
  const [phrase, setPhrase] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const resetGame = useCallback(() => {
    clearInterval(timerRef.current);
    const randomPhrase = SAMPLE_PHRASES[Math.floor(Math.random() * SAMPLE_PHRASES.length)];
    setPhrase(randomPhrase);
    setTypedText('');
    setTimeRemaining(30);
    setWpm(0);
    onScoreChange(0);
    setIsStarted(false);
    setIsFinished(false);
  }, [onScoreChange]);

  useEffect(() => {
    resetGame();
    return () => clearInterval(timerRef.current);
  }, [resetGame]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setTypedText(val);

    if (!isStarted) {
      setIsStarted(true);
      // Start Timer
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Calculate dynamic WPM
    const wordsCount = val.trim().split(/\s+/).filter(w => w.length > 0).length;
    const elapsedMinutes = (30 - timeRemaining) / 60 || 0.01;
    const currentWPM = Math.round(wordsCount / elapsedMinutes);
    setWpm(currentWPM);
    onScoreChange(currentWPM);

    // Auto finish if fully typed correctly
    if (val === phrase) {
      clearInterval(timerRef.current);
      setIsFinished(true);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col justify-center gap-4">
      {isFinished ? (
        <div className="text-center p-6 bg-black border-2 border-gray-900 rounded-lg">
          <h3 className="text-green-400 font-bold mb-2 uppercase tracking-wider">// TEST TERMINATED</h3>
          <p className="text-lg font-bold mb-4">{wpm} WPM</p>
          <button 
            onClick={resetGame}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs transition-colors cursor-pointer"
          >
            PLAY AGAIN
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Target Phrase */}
          <div className="p-3 bg-black border border-gray-900 rounded leading-relaxed text-xs text-gray-400">
            {phrase.split('').map((char, index) => {
              let colorClass = 'text-gray-500';
              if (index < typedText.length) {
                colorClass = typedText[index] === char ? 'text-green-400' : 'text-red-500 underline';
              }
              return (
                <span key={index} className={colorClass}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Typing Area */}
          <textarea
            ref={inputRef}
            value={typedText}
            onChange={handleInputChange}
            placeholder="Click here and begin typing the prompt text above..."
            className="w-full h-16 bg-gray-900 border border-gray-800 rounded p-2 text-xs focus:border-neon-purple outline-none resize-none font-mono"
            disabled={isFinished}
          />

          <div className="flex justify-between items-center text-[10px] text-gray-500">
            <div>TIMER: <span className="text-white font-bold">{timeRemaining}s</span></div>
            <div>SPEED: <span className="text-white font-bold">{wpm} WPM</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================
const GamesApp = memo(() => {
  const [activeGame, setActiveGame] = useState('snake'); // 'snake', '2048', 'typing'
  const [score, setScore] = useState(0);

  const { unlockAchievement } = useAchievements();

  // Trigger game achievement on mount
  useEffect(() => {
    unlockAchievement('GAMER_MODE');
  }, [unlockAchievement]);

  const handleScoreChange = useCallback((s) => {
    setScore(s);
  }, []);

  const handleRestart = () => {
    // Unique restart handlers inside specific instances
    setScore(0);
    // Simple state trigger to cause child reload
    const lastGame = activeGame;
    setActiveGame('');
    setTimeout(() => setActiveGame(lastGame), 10);
  };

  return (
    <div className="flex flex-col sm:flex-row h-full bg-gray-950 text-white overflow-hidden">
      {/* Sidebar / Top Tab Game Selector */}
      <div className="w-full sm:w-24 border-b sm:border-b-0 sm:border-r border-white/10 bg-black/40 flex flex-row sm:flex-col p-1.5 gap-1.5 shrink-0 overflow-x-auto">
        <span className="hidden sm:block text-[8px] font-mono text-gray-600 uppercase font-bold text-center">// GAMES</span>
        <button
          onClick={() => { setActiveGame('snake'); setScore(0); }}
          className={`flex-1 sm:flex-none px-2 py-2 sm:py-3 rounded text-[10px] uppercase font-bold transition-all text-center cursor-pointer whitespace-nowrap ${activeGame === 'snake' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'text-gray-500 hover:text-white border border-transparent'}`}
        >
          🐍 SNAKE
        </button>
        <button
          onClick={() => { setActiveGame('2048'); setScore(0); }}
          className={`flex-1 sm:flex-none px-2 py-2 sm:py-3 rounded text-[10px] uppercase font-bold transition-all text-center cursor-pointer whitespace-nowrap ${activeGame === '2048' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-gray-500 hover:text-white border border-transparent'}`}
        >
          🎮 2048
        </button>
        <button
          onClick={() => { setActiveGame('typing'); setScore(0); }}
          className={`flex-1 sm:flex-none px-2 py-2 sm:py-3 rounded text-[10px] uppercase font-bold transition-all text-center cursor-pointer whitespace-nowrap ${activeGame === 'typing' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' : 'text-gray-500 hover:text-white border border-transparent'}`}
        >
          ⌨️ TYPING
        </button>
      </div>

      {/* Game Content Box */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {activeGame === 'snake' && (
            <motion.div key="snake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <GameShell title="Snake Core" highScoreKey="snakeHighScore" score={score} onRestart={handleRestart}>
                <SnakeGame onScoreChange={handleScoreChange} />
              </GameShell>
            </motion.div>
          )}
          {activeGame === '2048' && (
            <motion.div key="2048" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <GameShell title="2048 Grid" highScoreKey="2048HighScore" score={score} onRestart={handleRestart}>
                <Game2048 onScoreChange={handleScoreChange} />
              </GameShell>
            </motion.div>
          )}
          {activeGame === 'typing' && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <GameShell title="Shell Speed Test" highScoreKey="typingHighScore" score={score} onRestart={handleRestart}>
                <TypingTestGame onScoreChange={handleScoreChange} />
              </GameShell>
            </motion.div>
          )}
          {activeGame === '' && (
            <div className="h-full flex items-center justify-center bg-gray-950 font-mono text-gray-500 text-xs">
              Re-initiating module...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default GamesApp;
