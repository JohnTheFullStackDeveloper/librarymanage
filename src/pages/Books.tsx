import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';
import { Search, Filter } from 'lucide-react';
import { getDataFG, removeDataFG, setDataFG } from '../firebase';
import { serverTimestamp } from 'firebase/database';

const Books: React.FC = () => {
  const { 
    books,currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showIssueBook,setShowIssueBook] = useState(false);
  const [userGmail,setUserGmail] = useState('');
  const [userName,setUserName] = useState('');
  const [loading,setLoading] = useState(false);
  const [userUid,setUserUid] = useState('');
  const [userGeted,setUserGeted] = useState(false);
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(books.map(book => book.category))];
    return ['all', ...uniqueCategories];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.includes(searchTerm);
      
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' && book.availability) ||
                                 (availabilityFilter === 'borrowed' && !book.availability);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, searchTerm, selectedCategory, availabilityFilter]);

  const handleViewDetails = (book: any) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const handleBorrow = async (book: any) => {
    setShowIssueBook(true)
    setSelectedBook(book);
  };

  const handleReturn = async (book: any) => {
    
  };

  const handleReserve = async (book: any) => {
    let rnum:any = Number((Math.random() * 10000).toFixed(0)) 
    rnum =(rnum + "" ).padStart(4,"0")
    rnum = rnum + "EK" + Date.now()
    setDataFG(`books/${book.isbn}/reserved/${currentUser?.uid}`,rnum)
    setDataFG(`users/${currentUser?.uid}/reserved/${book.isbn}`,rnum)
  };

  const handleCancelReservation = async (book: any) => {
    removeDataFG(`books/${book.isbn}/reserved/${currentUser?.uid}`)
    removeDataFG(`users/${currentUser?.uid}/reserved/${book.isbn}`)
  };

  const handleAddToFavorites = async (book: any) => {
    setDataFG(`users/${currentUser?.uid}/favorites/${book.id}`,{"id":book.id,time:serverTimestamp()})
  };

  const handleRemoveFromFavorites = async (book: any) => {
    removeDataFG(`users/${currentUser?.uid}/favorites/${book.id}`)
  };

  const handleEdit = (book: any) => {
    // TODO: Implement edit modal
    console.log('Edit book:', book);
  };

  const handleDelete = async (book: any) => {
    
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Library Books
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse and manage our collection of {books.length} books
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books, authors, ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Books</option>
              <option value="available">Available</option>
              <option value="borrowed">Not Available</option>
            </select>

            {/* View Mode Toggle */}
            {/* <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredBooks.length} of {books.length} books
        </p>
      </div>

      {/* Books Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {filteredBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onViewDetails={handleViewDetails}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
            onReserve={handleReserve}
            onCancelReservation={handleCancelReservation}
            onAddToFavorites={handleAddToFavorites}
            onRemoveFromFavorites={handleRemoveFromFavorites}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No books found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
      {showIssueBook && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Issue Book ({selectedBook.title})
                </h2>
                <button
                  onClick={() => {setShowBookModal(false) 
                  setLoading(false)
                setShowIssueBook(false)
                setUserGmail('')
                setSelectedBook(null)
                setUserUid('')
                setUserName('')
                setUserGeted(false)}}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Gmail
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={userGmail}
                  onChange={(e) => setUserGmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter User Gmail"
                />
              </div>
              <button
              type="submit"
              disabled={loading}
              onClick={async ()=>{
                if(userGmail == ""){
                  alert("Please Enter User Gmail")
                  return;
                }else if(!userGmail.endsWith("@gmail.com")){
                  alert("Please Enter Valid Gmail")
                  return;
                }
                setLoading(true)
                try{
                  const d = await getDataFG(`gmails/${userGmail.split("@")[0]}`,"")
                  if(d == null){
                    setUserName("user not found")
                    setUserGeted(false)

                  }else{
                    setUserName(d.name)
                    setUserUid(d.uid)
                    setUserGeted(true)
                  }
                }catch(e){
                  setLoading(false)
                  setUserGeted(false)
                }
                setLoading(false)
              }}
              className="px-6 mt-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
              <span>Find</span>
            </button>
              <div className="md:col-span-2 mt-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Gmail
                </label>
                <input
                readOnly={true}
                  type="text"
                  name="title"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="User Name"
                />
              </div>
              {userGeted && (<button 
              type="submit"
              disabled={loading}
              onClick={async ()=>{
                setLoading(true)
                const d = await getDataFG(`books/${selectedBook.isbn}/borrowed/${userUid}`,"")
                if(d !== null){
                  alert("You already borrowed this book")
                  setLoading(false)
                  return;
                }
                await setDataFG(`books/${selectedBook.isbn}/borrowed/${userUid}`,serverTimestamp())
                alert("Book borrowed successfully")
                setLoading(false)
                setShowIssueBook(false)
                setUserGmail('')
                setSelectedBook(null)
                setUserUid('')
                setUserGeted(false)
                setUserName('')
              }}
              className="px-6 mt-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
              <span>Issue Boook To This User</span>
            </button>)}
            </div>
          </div>
        </div>
      )
      }
      {/* Book Details Modal */}
      {showBookModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Book Details
                </h2>
                <button
                  onClick={() => {setShowBookModal(false) 
                    setSelectedBook(null)}}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedBook.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      by {selectedBook.author}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">ISBN:</span>
                      <span className="text-gray-900 dark:text-white font-mono">
                        {selectedBook.isbn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedBook.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Publisher:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedBook.publisher}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Year:</span>
                      <span className="text-gray-900 dark:text-white">
                        {selectedBook.publishYear}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`font-medium ${
                        selectedBook.availability 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedBook.availability ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                  
                  {selectedBook.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {selectedBook.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;