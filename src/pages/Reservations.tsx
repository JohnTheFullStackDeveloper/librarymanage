import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';
import { Calendar } from 'lucide-react';
import { removeDataFG, setDataFG } from '../firebase';
import { serverTimestamp } from 'firebase/database';
interface props{
  setContentView:any,
}
const Reservations: React.FC<props> = ({setContentView}) => {
  const { 
    currentUser, 
    reservedBooksc,
    books
  } = useAuth();
  const totalReservedBooks =new Set(reservedBooksc.map(r => r.key))
  const reservedBooks:any= books.filter(book => totalReservedBooks.has(book.isbn))
  const handleBorrow = async (book: any) => {
   
  };

  const handleReturn = async (book: any) => {
    
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Calendar className="h-8 w-8 mr-3 text-blue-500" />
          My Reservations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You have {reservedBooks.length} books reserved
        </p>
      </div>

      {/* Reservations Grid */}
      {reservedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reservedBooks.map((book:any) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={handleBorrow}
              onReturn={handleReturn}
              onCancelReservation={handleCancelReservation}
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No reservations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Reserve books that are currently borrowed to be notified when they become available
          </p>
          <button
            onClick={() => setContentView("books")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Browse Books
          </button>
        </div>
      )}
    </div>
  );
};

export default Reservations;