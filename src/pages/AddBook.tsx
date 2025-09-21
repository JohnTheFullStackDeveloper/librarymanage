import React, { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { getDataFG, setDataFG } from '../firebase';

const AddBook: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    coverUrl: '',
    description: '',
    publisher: '',
    totalCount:10,
    publishYear: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Programming',
    'Web Development',
    'Software Engineering',
    'Data Science',
    'Machine Learning',
    'Computer Networks',
    'Database Systems',
    'Algorithms',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'History',
    'Philosophy',
    'Psychology',
    'Business',
    'Economics',
    'Art',
    'Other'
  ];

  const addBook = async ()=>{
    // console.log(pushId)
    const d = await getDataFG(`books/${formData.isbn}`,"")
    if(d != null){
      alert("Book already exists")
      return "fail";
    }
    await setDataFG(`books/${formData.isbn}`,{
      ...formData,
      id: formData.isbn,
      remainingCount:formData.totalCount
    })
    return "success"
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const s = await addBook()
      if(s == "fail"){
        setLoading(false);
        return;
      }
      setSuccess(true);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        coverUrl: '',
        description: '',
        publisher: '',
        totalCount:10,
        publishYear: new Date().getFullYear()
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishYear' ? parseInt(value) : value
    }));
  };

  const generateISBN = () => {
    const isbn = `978-${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 900000000) + 100000000}`;
    setFormData(prev => ({ ...prev, isbn }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Plus className="h-8 w-8 mr-3 text-green-500" />
          Add New Book
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add a new book to the library collection
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-300">
              Book added successfully to the library collection!
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter the book title"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter the author name"
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ISBN *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="isbn"
                  required
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="978-XXXXXXXXX"
                />
                <button
                  type="button"
                  onClick={generateISBN}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Publisher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter the publisher name"
              />
            </div>

            {/* Publish Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Publish Year
              </label>
              <input
                type="number"
                name="publishYear"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.publishYear}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Count
              </label>
              <input
                type="number"
                name="totalCount"
                value={formData.totalCount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            {/* Cover URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/book-cover.jpg (optional - will use stock image if empty)"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Enter a brief description of the book"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  author: '',
                  isbn: '',
                  category: '',
                  coverUrl: '',
                  description: '',
                  publisher: '',
                  totalCount:10,
                  publishYear: new Date().getFullYear()
                });
              }}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>{loading ? 'Adding Book...' : 'Add Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;