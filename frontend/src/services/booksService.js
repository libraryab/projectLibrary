import axios from "axios";
import { tokenUtils } from "../utils/tokenUtils";

const API_BASE_URL = "/api/v1";

const normalizeBook = (book) => ({
  ...book,
  author: book.author || book.authors?.map((author) => author.name).join(", ") || "-",
})

const extractBooksList = (responseData) => {
  const books = responseData?.data?.books || responseData?.books || responseData?.data || responseData
  if (!Array.isArray(books)) return []
  return books.map(normalizeBook)
}

/**
 * Get all books
 * @returns {Promise<Array>} Array of book objects
 */
export const getAllBooks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return extractBooksList(response.data);
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

/**
 * Get book by ID
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Book object
 */
export const getBookById = async (bookId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
    const book = response.data.data || response.data;
    return book ? normalizeBook(book) : book;
  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    throw error;
  }
};

/**
 * Count available books
 * @returns {Promise<number>} Count of available books
 */
export const getAvailableBooksCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    const books = extractBooksList(response.data);
    return books.filter((book) => book.isAvailable === true).length;
  } catch (error) {
    console.error("Error counting available books:", error);
    throw error;
  }
};

/**
 * Search books by title (case-insensitive)
 * @param {string} title - Search term
 * @returns {Promise<Array>} Array of matching books
 */
export const searchBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    const books = extractBooksList(response.data);
    if (!title.trim()) return books;

    return books.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase()),
    );
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

/**
 * Get only available books
 * @returns {Promise<Array>} Array of available books
 */
export const getAvailableBooks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    const books = extractBooksList(response.data);
    return books.filter((book) => book.isAvailable === true);
  } catch (error) {
    console.error("Error fetching available books:", error);
    throw error;
  }
};

/**
 * Create a new book
 * @param {Object} bookData - { title, author, isbn, description, year, isAvailable }
 * @returns {Promise<Object>} Created book object
 */
export const createBook = async (bookData) => {
  try {
    const token = tokenUtils.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    console.log("Creating book with data:", bookData);
    console.log("Headers:", headers);

    // normalize author -> authors array expected by backend
    const payload = {
      title: bookData.title,
      publisherId: bookData.publisherId,
      libraryId: bookData.libraryId,
      isbn: bookData.isbn,
      year: bookData.year,
      description: bookData.description,
      authors: bookData.author ? [bookData.author] : (bookData.authors || undefined),
    }

    const response = await axios.post(`${API_BASE_URL}/books`, payload, {
      headers,
    });
    return normalizeBook(response.data.data || response.data);
  } catch (error) {
    console.error("Error creating book:", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    console.error("Full error response:", error.response);
    throw error;
  }
};

/**
 * Update an existing book
 * @param {string} bookId - The book ID
 * @param {Object} bookData - { title, author, isbn, description, year, isAvailable }
 * @returns {Promise<Object>} Updated book object
 */
export const updateBook = async (bookId, bookData) => {
  try {
    const token = tokenUtils.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const payload = {
      title: bookData.title,
      publisherId: bookData.publisherId,
      isbn: bookData.isbn,
      year: bookData.year,
      description: bookData.description,
      authors: bookData.author ? [bookData.author] : (bookData.authors || undefined),
    }

    const response = await axios.put(`${API_BASE_URL}/books/${bookId}`, payload, {
      headers,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error updating book ${bookId}:`, error);
    throw error;
  }
};

/**
 * Delete a book
 * @param {string} bookId - The book ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteBook = async (bookId) => {
  try {
    const token = tokenUtils.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.delete(`${API_BASE_URL}/books/${bookId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting book ${bookId}:`, error);
    throw error;
  }
};
