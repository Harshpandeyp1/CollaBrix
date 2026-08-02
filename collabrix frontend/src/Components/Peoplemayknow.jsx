import React, { useState, useEffect } from 'react'
import axios from 'axios'

const PeopleMayKnow = () => {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sentRequests, setSentRequests] = useState({})
  const [sendingIds, setSendingIds] = useState({})

  useEffect(() => {
    fetchPeople()
  }, [])

  const getInitials = (username) => {
    if (!username) return ''
    return username
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('')
  }

  const fetchPeople = async () => {
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication required. Please sign in to see suggestions.')
      setPeople([])
      setLoading(false)
      return
    }

    try {
      const response = await axios.get('http://localhost:8080/api/users/suggestion', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setPeople(Array.isArray(response.data) ? response.data : [])
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          fetchError.message ||
          'Unable to load suggestions.'
      )
      setPeople([])
    } finally {
      setLoading(false)
    }
  }

  const requestConnect = async (id) => {
    if (sentRequests[id] || sendingIds[id]) return

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Authentication required. Please sign in to send a request.')
      return
    }

    setError('')
    setSendingIds((prev) => ({ ...prev, [id]: true }))

    try {
      await axios.post(
        'http://localhost:8080/api/connections/request',
        { receiverId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setSentRequests((prev) => ({ ...prev, [id]: true }))
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError.message ||
          'Unable to send the connection request.'
      )
    } finally {
      setSendingIds((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  return (
    <aside className="w-full max-w-xs bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          People You May Know
        </h2>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-3">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          Loading suggestions...
        </div>
      ) : people.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-500">
          No suggestions available right now.
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto flex flex-col gap-1.5 pr-1 -mr-1 scrollbar-thin scrollbar-thumb-slate-200">
          {people.map((person) => {
            const sent = !!sentRequests[person.id]
            const sending = !!sendingIds[person.id]

            return (
              <div
                key={person.id}
                className="group relative flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-100 transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
                    {getInitials(person.username)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {person.username}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{person.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => requestConnect(person.id)}
                  disabled={sent || sending}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold transition duration-200 active:scale-95 ${
                    sent
                      ? 'bg-slate-100 text-slate-600 border border-slate-200'
                      : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm'
                  } ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {sent ? 'Sent' : sending ? 'Sending...' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </aside>
  )
}

export default PeopleMayKnow