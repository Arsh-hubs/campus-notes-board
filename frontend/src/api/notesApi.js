import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/notes";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Get user-friendly error message from axios error
 */
const getErrorMessage = (error) => {
  if (!error.response) {
    // Network error or timeout
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return "Request timed out. Please check your connection and try again.";
    }
    if (error.message === "Network Error") {
      return "Unable to connect to server. Please check your internet connection.";
    }
    return "Network error. Please try again later.";
  }

  const status = error.response.status;
  const serverMessage = error.response.data?.message;

  switch (status) {
    case 400:
      return serverMessage || "Invalid request. Please check your input.";
    case 404:
      return serverMessage || "Resource not found.";
    case 500:
      return serverMessage || "Server error. Please try again later.";
    default:
      return serverMessage || `Error ${status}. Please try again.`;
  }
};

/**
 * Fetch all notes
 * @returns {Promise} Promise that resolves to an array of notes
 */
export const fetchAllNotes = async () => {
  try {
    const response = await apiClient.get("/");
    return response.data;
  } catch (error) {
    const enhancedError = new Error(getErrorMessage(error));
    enhancedError.response = error.response;
    enhancedError.isNetworkError = !error.response;
    console.error("Error fetching notes:", error);
    throw enhancedError;
  }
};

/**
 * Create a new note
 * @param {Object} noteData - The note data containing title and content
 * @param {string} noteData.title - The title of the note
 * @param {string} noteData.content - The content of the note
 * @returns {Promise} Promise that resolves to the created note
 */
export const createNote = async (noteData) => {
  try {
    const response = await apiClient.post("/", noteData);
    return response.data;
  } catch (error) {
    const enhancedError = new Error(getErrorMessage(error));
    enhancedError.response = error.response;
    enhancedError.isNetworkError = !error.response;
    console.error("Error creating note:", error);
    throw enhancedError;
  }
};

/**
 * Delete a note by ID
 * @param {string} noteId - The ID of the note to delete
 * @returns {Promise} Promise that resolves when the note is deleted
 */
export const deleteNote = async (noteId) => {
  try {
    await apiClient.delete(`/${noteId}`);
  } catch (error) {
    const enhancedError = new Error(getErrorMessage(error));
    enhancedError.response = error.response;
    enhancedError.isNetworkError = !error.response;
    console.error("Error deleting note:", error);
    throw enhancedError;
  }
};

