import { useState, useEffect } from 'react'

const hangmanImages = [
  './hangman/hangman-0.webp',
  './hangman/hangman-1.webp',
  './hangman/hangman-2.webp',
  './hangman/hangman-3.webp',
  './hangman/hangman-4.webp',
  './hangman/hangman-5.webp',
  './hangman/hangman-6.webp',
]

const noMap = {
  0: './lol.webp',
  1: './memi/0.webp',
  2: './memi/1.webp',
  3: './memi/2.webp',
  4: './memi/2.webp',
  5: './memi/3.webp',
  6: './memi/3.webp',
  7: './memi/3.webp',
  8: './memi/4.webp',
  9: './memi/4.webp',
  10: './memi/5.webp',
  11: './memi/5.webp',
  12: './memi/6.webp',
  13: './memi/7.webp',
  14: './memi/7.webp',
  15: './memi/8.webp',
  16: './memi/9.webp',
}

const preloadImages = (urls) => {
  urls.forEach((src) => {
    const img = new Image()
    img.src = src
  })
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

  useEffect(() => {
    // preload hangman images
    preloadImages(hangmanImages)

    // preload memi / no images
    preloadImages(Object.values(noMap))

    // preload win image
    const winImg = new Image()
    winImg.src = './win.webp'
  }, [])

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
            src={'./win.webp'}
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
              key={noCount}
              src={noMap[noCount]}
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
