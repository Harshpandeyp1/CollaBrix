import React, { useState } from 'react'

const DiscoveryFeed = () => {

  // Stores the currently selected filter
  const [activeFilter, setActiveFilter] = useState('all')

  // Tracks which items the user has liked
  const [likedItems, setLikedItems] = useState({})

  // Tracks which items the user marked "Interested" in
  const [interestedItems, setInterestedItems] = useState({})

  // Tracks which post's comment section is currently expanded (stores the item id, or null if none open)
  const [openCommentsFor, setOpenCommentsFor] = useState(null)

  // Stores the text currently typed in each post's comment input, keyed by item id
  // e.g. { 1: "nice idea!", 2: "" }
  const [commentDrafts, setCommentDrafts] = useState({})

  // Stores the actual submitted comments for each post, keyed by item id
  // e.g. { 1: [{ id: 1, author: 'You', text: 'nice idea!' }] }
  const [comments, setComments] = useState({})

  // Filter buttons
  const filters = [
    { key: 'all', label: 'All Feed' },
    { key: 'idea', label: 'Ideas' },
    { key: 'project', label: 'Projects' },
  ]

  // Temporary feed data
  const feedItems = [
    {
      id: 1,
      type: 'project',
      title: 'Collabrix',
      description:
        'A collaboration platform where developers can discover people, ideas, and projects.',
      author: 'Harsh Kumar',
      time: '2 hours ago',
      likes: 24,
      comments: 12
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 2,
      type: 'idea',
      title: 'AI-powered college assistant',
      description:
        'What if students could use AI to get help with their studies, projects, and career planning?',
      author: 'Rahul Sharma',
      time: '4 hours ago',
      likes: 18,
      comments: 6
    },
    {
      id: 3,
      type: 'project',
      title: 'Campus Connect',
      description:
        'A platform that helps students discover events and connect with other students.',
      author: 'Priya Singh',
      time: '1 day ago',
      likes: 31,
      comments: 14
    }
  ]

  // Filter the feed items based on the active filter tab
  const filteredItems = feedItems.filter((item) => {
    if (activeFilter === 'all') return true
    return item.type === activeFilter
  })

  // Toggle like state for a specific post
  const toggleLike = (id) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Toggle "Interested" state for a specific post
  const toggleInterested = (id) => {
    setInterestedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Opens the comment section for a post, or closes it if it's already open (accordion-style, one at a time)
  const toggleComments = (id) => {
    setOpenCommentsFor((prev) => (prev === id ? null : id))
  }

  // Updates the draft text as the user types in a specific post's comment box
  const handleCommentChange = (id, text) => {
    setCommentDrafts((prev) => ({ ...prev, [id]: text }))
  }

  // Submits a new comment for a given post
  const handleCommentSubmit = (id, e) => {
    e.preventDefault() // stop the form from refreshing the page

    const text = (commentDrafts[id] || '').trim()
    if (!text) return // don't add empty comments

    // Build a new comment object — using Date.now() as a quick unique id for now
    const newComment = { id: Date.now(), author: 'You', text }

    // Append the new comment to this post's existing comment list (or start a new array if none yet)
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newComment]
    }))

    // Clear the input box for this post after submitting
    setCommentDrafts((prev) => ({ ...prev, [id]: '' }))

    // TODO: replace this with a real API call later (e.g. POST /posts/:id/comments)
  }

  return (
    <section className="w-full bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 transition-all duration-300">

      {/* Feed Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
            Discover Community
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Explore ideas, open-source builds, and collaborators across Collabrix
          </p>
        </div>

        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-600 to-teal-500 items-center justify-center shadow-md shadow-sky-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200/60">

        {filters.map(({ key, label }) => (

          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`
              px-4
              py-1.5
              rounded-lg
              text-xs
              font-semibold
              transition-all
              duration-200

              ${
                activeFilter === key
                  ? 'bg-white text-sky-700 shadow-sm ring-1 ring-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }
            `}
          >
            {label}
          </button>

        ))}

      </div>

      {/* Feed Items */}
      <div className="space-y-4">

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs font-medium text-slate-400">No {activeFilter}s to show right now.</p>
          </div>
        )}

        {filteredItems.map((item) => {
          const isLiked = likedItems[item.id]
          const isInterested = interestedItems[item.id]
          const likeCount = item.likes + (isLiked ? 1 : 0)

          // Is this specific post's comment section currently open?
          const isCommentsOpen = openCommentsFor === item.id

          // The list of comments submitted so far for this post (empty array if none yet)
          const postComments = comments[item.id] || []

          // Total comment count = original seed count + any new ones the user added locally
          const totalComments = item.comments + postComments.length

          return (
            <div
              key={item.id}
              className="
                group
                p-5
                rounded-xl
                border
                border-slate-200/70
                bg-white
                hover:border-sky-300/80
                hover:shadow-md
                hover:shadow-sky-500/5
                transition-all
                duration-200
              "
            >

              {/* Author Section */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  {/* Avatar */}
                  <div className="
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-sky-500
                    to-teal-500
                    text-white
                    text-xs
                    font-bold
                    shadow-sm
                    ring-2
                    ring-white
                  ">
                    {item.author
                      .split(' ')
                      .map((name) => name[0])
                      .join('')
                    }
                  </div>

                  {/* Author Information */}
                  <div>
                    <p className="text-xs font-bold text-slate-800 hover:text-sky-600 transition-colors">
                      {item.author}
                    </p>
                    <p className="text-[11px] font-medium text-slate-400">
                      {item.time}
                    </p>
                  </div>

                </div>

                {/* Type Badge */}
                <span className={`
                  inline-flex
                  items-center
                  gap-1
                  px-2.5
                  py-0.5
                  rounded-full
                  text-[11px]
                  font-bold
                  tracking-wide
                  capitalize
                  border

                  ${
                    item.type === 'project'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : 'bg-sky-50 text-sky-700 border-sky-200/60'
                  }
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'project' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                  {item.type}
                </span>

              </div>

              {/* Title */}
              <h3 className="
                mt-3.5
                text-base
                font-bold
                text-slate-800
                group-hover:text-sky-600
                transition-colors
                tracking-tight
              ">
                {item.title}
              </h3>

              {/* Description */}
              <p className="
                mt-1.5
                text-xs
                sm:text-sm
                leading-relaxed
                text-slate-600
              ">
                {item.description}
              </p>

              {/* Actions */}
              <div className="
                mt-4
                pt-3.5
                border-t
                border-slate-100
                flex
                items-center
                gap-4
              ">

                {/* Like button */}
                <button
                  onClick={() => toggleLike(item.id)}
                  className={`
                    flex items-center gap-1.5
                    px-2.5 py-1.5 rounded-lg text-xs font-semibold
                    transition-all active:scale-95
                    ${isLiked 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
                  `}
                >
                  <svg
                    className={`w-4 h-4 ${isLiked ? 'scale-110' : ''} transition-transform`}
                    fill={isLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                  </svg>
                  <span>{likeCount}</span>
                </button>

                {/* Comment button — toggles the comment section open/closed for this post */}
                <button
                  onClick={() => toggleComments(item.id)}
                  className={`
                    flex items-center gap-1.5
                    px-2.5 py-1.5 rounded-lg text-xs font-semibold
                    transition-all active:scale-95
                    ${isCommentsOpen 
                      ? 'bg-sky-50 text-sky-600' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{totalComments}</span>
                </button>

                {item.type === 'project' && (
                  <button
                    onClick={() => toggleInterested(item.id)}
                    className={`
                      ml-auto
                      px-3.5
                      py-1.5
                      rounded-lg
                      text-xs
                      font-bold
                      transition-all
                      duration-200
                      active:scale-95

                      ${
                        isInterested
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300/80'
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow-sky-500/20'
                      }
                    `}
                  >
                    {isInterested ? '✓ Interested' : 'I\'m Interested'}
                  </button>
                )}

              </div>

              {/* Comment Section — only rendered when this post's comments are open */}
              {isCommentsOpen && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl">

                  {/* List of existing comments for this post */}
                  {postComments.length > 0 && (
                    <div className="flex flex-col gap-2.5 mb-3">
                      {postComments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2">

                          {/* Small avatar for the commenter */}
                          <div className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-teal-400 text-white text-[9px] font-bold ring-1 ring-white">
                            {comment.author[0]}
                          </div>

                          {/* Comment bubble */}
                          <div className="bg-white rounded-xl p-2.5 flex-1 border border-slate-100 shadow-2xs">
                            <p className="text-[11px] font-bold text-slate-800">{comment.author}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{comment.text}</p>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment input bar — submitting calls handleCommentSubmit for THIS item's id */}
                  <form
                    onSubmit={(e) => handleCommentSubmit(item.id, e)}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={commentDrafts[item.id] || ''}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      placeholder="Write a comment..."
                      className="
                        flex-1
                        text-xs
                        px-3 py-2
                        rounded-lg
                        bg-white
                        border border-slate-200
                        outline-none
                        focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500
                        transition-all
                        placeholder:text-slate-400
                      "
                    />
                    <button
                      type="submit"
                      className="
                        px-3.5 py-2
                        rounded-lg
                        bg-slate-900 hover:bg-sky-600
                        text-white
                        text-xs font-semibold
                        transition-colors
                        shadow-2xs
                      "
                    >
                      Post
                    </button>
                  </form>

                </div>
              )}

            </div>
          )
        })}

      </div>

    </section>
  )
}

export default DiscoveryFeed