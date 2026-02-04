import { useState, useEffect } from 'react'
import hang0 from './assets/hangman/hangman-0.png'
import hang1 from './assets/hangman/hangman-1.png'
import hang2 from './assets/hangman/hangman-2.png'
import hang3 from './assets/hangman/hangman-3.png'
import hang4 from './assets/hangman/hangman-4.png'
import hang5 from './assets/hangman/hangman-5.png'
import hang6 from './assets/hangman/hangman-6.png'
import memi0 from './assets/memi/0.png'
import memi1 from './assets/memi/1.png'
import memi2 from './assets/memi/2.png'
import memi3 from './assets/memi/3.png'
import memi4 from './assets/memi/4.png'
import memi5 from './assets/memi/5.png'
import memi6 from './assets/memi/6.png'
import memi7 from './assets/memi/7.png'
import memi8 from './assets/memi/8.png'
import memi9 from './assets/memi/9.png'
import win from './assets/win.png'
import lol from './assets/lol.png'

const hangmanImages = [
  hang0,
  hang1,
  hang2,
  hang3,
  hang4,
  hang5,
  hang6,
]

const noMap = {
  0: memi0,
  1: memi0,
  2: memi1,
  3: memi2,
  4: memi2,
  5: memi3,
  6: memi3,
  7: memi3,
  8: memi4,
  9: memi4,
  10: memi5,
  11: memi5,
  12: memi6,
  13: memi7,
  14: memi7,
  15: memi8,
  16: memi9,
}

export default function App() {
  const target = 'WILL YOU MARRY ME'.toUpperCase()
  const punchline = 'WILL YOU BE MY VALENTINES'.toUpperCase()
  const maxLives = 6
  const nos = [
    'NO',
    'wait..... no?', // 0
    'tf?', // 1
    'excuse me?', // 2
    'foreal?', // 2
    'do you hate me?', // 3
    'wow', // 3
    'this mf', // 3
    'still trying to say no, huh?', // 4
    'hayz', // 4
    'who am i to you?', // 5
    'homaygad', // 5
    'after all this time?', // 6
    'so i guess this is it', // 7
    'hmmm', // 7
    'unless', // 8
    'YES.... aha gatchu', // 9
  ]
  const [noCount, setNoCount] = useState(0)

  const [lives, setLives] = useState(maxLives)
  const [usedLetters, setUsedLetters] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)

  const imageIndex = maxLives - lives
  const currentImage = hangmanImages[imageIndex] 

  // Build display string
  const display = target
    .split('')
    .map((char) => {
      if (char === ' ') return ' '
      return usedLetters.includes(char) ? char : '_'
    })

  // Game state
  const gameWon = display.every(
    (char, idx) => char === ' ' || char === target[idx]
  )
  const gameLost = lives <= 0

  // All letters for keyboard
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const handleGuess = (letter) => {
    if (usedLetters.includes(letter) || gameWon || gameLost) return

    setUsedLetters([...usedLetters, letter])

    if (!target.includes(letter)) {
      setLives((prev) => prev - 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase()

      // Only allow A–Z
      if (!/^[A-Z]$/.test(letter)) return

      handleGuess(letter)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [usedLetters, lives])

  const onReset = () => {
    setLives(maxLives)
    setUsedLetters([])
    setNoCount(0)
  }

  return (
    <div className="h-screen bg-gray-800 flex flex-col items-center justify-center text-white space-y-6 px-4">
      {/* <h1 className="text-4xl font-bold">Hangman</h1> */}
      {/* <h2 className="text-xl">Lives: {lives}</h2> */}

      {/* Image */}
      {isSuccess ? (
        <div className="relative w-full h-3/4">
          <img
            src={win}
            alt="Hangman"
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="relative w-full h-1/2">
          {!gameWon ? (
            <img
              src={currentImage}
              alt="Hangman"
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <img
              src={noCount === 0 ? currentImage : noMap[noCount]}
              alt="Hangman"
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>
      )}

      {/* Display either punchline or underscores */}
      <div className="text-3xl tracking-widest flex justify-center space-x-2">
        {!isSuccess ? 
          (gameWon ? punchline.split('') : display).map((char, idx) => (
            <span
              key={idx}
              className={char === ' ' ? 'w-3' : 'inline-block'}
            >
              {char}
            </span>
          )) : (
            <span className='text-6xl font-bold'>I WIN!!! BIG SUCCESS!!!!</span>
          )
        } {!isSuccess ? <span>{gameWon ? '?' : ''}</span> : <></>}
      </div>

      {gameWon && !isSuccess && (
        <div className="text-2xl font-bold mt-4 text-center flex gap-36">
          <button 
            className='bg-green-500 hover:bg-green-700 rounded px-3 cursor-pointer' 
            onClick={() => setIsSuccess(true)}
          >
            YES
          </button>
          {noCount < nos.length - 1 ? (
            <button 
              className='bg-red-500 hover:bg-red-700 rounded px-4 cursor-pointer' 
              onClick={() => setNoCount(noCount + 1)}
            >
              {nos[noCount]}
            </button>
          ) : (
            <button 
              className='bg-green-500 hover:bg-green-700 rounded px-3 cursor-pointer' 
              onClick={() => setIsSuccess(true)}
            >
              {nos[noCount]}
            </button>
          )}
          
        </div>
      )}

      {gameLost && (
        <div className="text-red-400 text-2xl font-bold mt-4 text-center flex flex-col gap-4">
          💀 You lost!
          <button 
            onClick={() => onReset()}
            className='text-white bg-blue-500 hover:bg-blue-700 rounded cursor-pointer'
          >
            Try Again!
          </button>
        </div>
      )}

      {/* Onscreen keyboard */}
      {!gameWon && !gameLost && (
        <div className="grid grid-cols-7 gap-2 mt-6">
          {alphabet.map((letter) => {
            const used = usedLetters.includes(letter)
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                className={`px-3 py-2 rounded font-bold 
                  ${used ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={used}
              >
                {letter}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
