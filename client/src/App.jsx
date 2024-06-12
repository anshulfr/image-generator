import { useState } from 'react'

export const App = () => {
  const [imageURL, setImageURL] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const serverUrl =  import.meta.env.VITE_SERVER_URL

  const fetchImage = () => {
    setIsLoading(true)
    fetch(`${serverUrl}/?prompt=${prompt}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then(blob => {
        const url = URL.createObjectURL(blob)
        setImageURL(url)
      })
      .catch(error => {
        console.error('Error fetching image:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleButton = (event) => {
    event.preventDefault()
    fetchImage()
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleButton(event)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#6b21a8] to-[#1e40af] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Image Generator</h1>
          <p className="mt-2 text-lg text-gray-400">Enter a prompt to generate an image.</p>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="prompt" className="sr-only">
              Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              className="block w-full rounded-md border-[#6b21a8] bg-[#6b21a8]/50 px-4 py-3 text-white placeholder-gray-400 focus:border-[#6b21a8] focus:ring-[#6b21a8]"
              placeholder="Enter a prompt"
            />
          </div>
          <button
            onClick={handleButton}
            className="inline-flex w-full justify-center rounded-md bg-[#6b21a8] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#5b0eac] focus:outline-none focus:ring-2 focus:ring-[#6b21a8] focus:ring-offset-2 border border-[#6b21a8]"
          >
            Generate Image
          </button>
        </form>
        <div className="overflow-hidden rounded-md bg-[#1e40af]/50 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <img src="https://i.imgur.com/LmGn47q.gif" width="42px" />
            </div>
          ) : (
            imageURL && <img src={imageURL} />
          )}
        </div>
      </div>
    </div>
  )
}
