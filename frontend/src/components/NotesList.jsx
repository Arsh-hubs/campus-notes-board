import { useCallback, useMemo } from "react";
import "./NotesList.css";

function NotesList({ 
  notes, 
  loading, 
  error, 
  deletingId, 
  onDeleteNote, 
  onRetry,
  onClearError 
}) {
  // Format date helper - memoized to avoid recreation on each render
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Handle delete with confirmation
  const handleDelete = useCallback(async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await onDeleteNote(noteId);
    } catch (err) {
      // Error is handled in parent component via error state
      console.error("Delete error:", err);
    }
  }, [onDeleteNote]);

  // Memoize sorted notes to avoid recalculation
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [notes]);

  // Loading state
  if (loading) {
    return (
      <div className="notes-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading notes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="notes-list-container">
        <div className="error-message">
          {error}
          {onClearError && (
            <button 
              onClick={onClearError} 
              className="error-dismiss"
              aria-label="Dismiss error"
            >
              ×
            </button>
          )}
        </div>
        <button onClick={onRetry} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <div className="notes-list-container">
        <div className="empty-state">
          No notes yet. Create your first note above!
        </div>
      </div>
    );
  }

  // Notes list
  return (
    <div className="notes-list-container">
      <h2>Notes ({notes.length})</h2>
      <div className="notes-grid">
        {sortedNotes.map((note) => (
          <div key={note._id} className="note-card">
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <button
                className="delete-btn"
                onClick={() => handleDelete(note._id)}
                disabled={deletingId === note._id}
                aria-label={`Delete note: ${note.title}`}
              >
                {deletingId === note._id ? "Deleting..." : "×"}
              </button>
            </div>
            <p className="note-content">{note.content}</p>
            <div className="note-footer">
              <span className="note-date">
                {formatDate(note.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesList;

