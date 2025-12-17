import { useState, useCallback, useEffect, useRef } from "react";
import "./NoteForm.css";

function NoteForm({ onCreateNote }) {
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Ref to store timeout ID for cleanup
  const successTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // Reset form fields
  const resetForm = useCallback(() => {
    setTitle("");
    setContent("");
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Clear any existing timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    // Validation
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("Title and content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateNote({ title: trimmedTitle, content: trimmedContent });
      setSuccess(true);
      resetForm();

      // Clear success message after 3 seconds
      successTimeoutRef.current = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      // Use the enhanced error message from API helper
      const errorMessage = err.message || "Failed to create note. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, onCreateNote, resetForm]);

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>Create New Note</h2>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">Note created successfully!</div>
      )}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter note content"
          rows={6}
          disabled={isSubmitting}
          required
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? (
          <span className="submit-btn-loading">
            <span className="submit-btn-spinner"></span>
            Creating...
          </span>
        ) : (
          "Create Note"
        )}
      </button>
    </form>
  );
}

export default NoteForm;

