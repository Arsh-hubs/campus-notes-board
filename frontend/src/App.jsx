import { useState, useEffect, useCallback } from 'react'
import { fetchAllNotes, createNote, deleteNote } from './api/notesApi'
import NoteForm from './components/NoteForm'
import NotesList from './components/NotesList'
import './App.css'

function App() {
  // State management
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Fetch all notes from the API
  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchAllNotes()
      setNotes(data || [])
    } catch (err) {
      // Use the enhanced error message from API helper
      const errorMessage = err.message || 'Failed to load notes. Please try again.'
      setError(errorMessage)
      console.error('Error loading notes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch notes on component mount
  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  // Create a new note and add it to the list
  const handleCreateNote = useCallback(async (noteData) => {
    try {
      const newNote = await createNote(noteData)
      // Use functional update to avoid stale closure
      setNotes((prevNotes) => [newNote, ...prevNotes])
      return newNote
    } catch (err) {
      console.error('Error creating note:', err)
      throw err
    }
  }, [])

  // Delete a note by ID
  const handleDeleteNote = useCallback(async (noteId) => {
    setDeletingId(noteId)
    
    try {
      await deleteNote(noteId)
      // Use functional update to avoid stale closure
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId))
    } catch (err) {
      // Use the enhanced error message from API helper
      const errorMessage = err.message || 'Failed to delete note. Please try again.'
      setError(errorMessage)
      console.error('Error deleting note:', err)
      throw err
    } finally {
      setDeletingId(null)
    }
  }, [])

  // Clear error state
  const handleClearError = useCallback(() => {
    setError(null)
  }, [])

  return (
    <div className="app">
      <h1>Campus Notes Board</h1>
      <NoteForm onCreateNote={handleCreateNote} />
      <NotesList 
        notes={notes}
        loading={loading}
        error={error}
        deletingId={deletingId}
        onDeleteNote={handleDeleteNote}
        onRetry={loadNotes}
        onClearError={handleClearError}
      />
    </div>
  )
}

export default App
