import React, { useState } from 'react'
import axios from 'axios'
import Head from './Head'
import Profilebar from './Profilebar'

export default function NewJournal({ setAuthToken, authToken, handleLogout }) {
  const [Title, setTitle] = useState('')
  const [Description, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const Token = localStorage.getItem("dbtoken");
    console.log("inside posting",Token);
    try {
      const response = await axios.post('https://qw.getskybuy.shop/api/new_journal', { 
        Title, Description, Token}
        )
      alert("Journal Published: Your journal entry has been successfully published.")
      setTitle('')
      setBody('')
    } catch (error) {
      alert("Error: There was an error publishing your journal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Head/>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Profilebar/>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">What's on your mind today?</h2>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full p-2"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Body"
                value={Description}
                onChange={(e) => setBody(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-full p-2 h-40"
                required
              />
            </div>
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 p-2" disabled={isLoading}>
              {isLoading ? 'Publishing...' : 'Publish Journal'}
            </button>
          </div>
        </form>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/logo.svg" alt="Wellnotes Logo" className="h-8 mb-4" />
              <p className="text-sm">It's time to incentivize your thoughts and build productive well-being.</p>
              <p className="text-sm mt-2">Copyright © 2024 - All rights reserved</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white">Whitepaper</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Terms of services</a></li>
                <li><a href="#" className="hover:text-white">Privacy policy</a></li>
                <li><a href="#" className="hover:text-white">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white hover:bg-blue-700 p-2">
              Join Us
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}