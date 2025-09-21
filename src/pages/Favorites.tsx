import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookCard from '../components/BookCard';
import { Heart } from 'lucide-react';
import { removeDataFG, setDataFG } from '../firebase';
interface favoriteProps{
  setCurrentView:any
}
const Favorites: React.FC<favoriteProps> = ({setCurrentView}) => {
  const { 
    books, 
    favorites, 
    currentUser
  } = useAuth();

  const favoriteIds = new Set(favorites.map(fav => fav.id))
  const favoriteBooks:any = books.filter(book => favoriteIds.has(book.id));
  const handleBorrow = async (book: any) => {
    
  };

  const handleReturn = async (book: any) => {
   
  };

  const handleReserve = async (book: any) => {
    let rnum:any = Number((Math.random() * 10000).toFixed(0)) + 1
    rnum =(rnum + "" ).padStart(4,"0")
    rnum = rnum + "EK" + Date.now()
    setDataFG(`books/${book.isbn}/reserved/${currentUser?.uid}`,rnum)
    setDataFG(`users/${currentUser?.uid}/reserved/${book.isbn}`,rnum)
  };

  const handleCancelReservation = async (book: any) => {
    removeDataFG(`books/${book.isbn}/reserved/${currentUser?.uid}`)
    removeDataFG(`users/${currentUser?.uid}/reserved/${book.isbn}`)
  };

  const handleRemoveFromFavorites = async (book: any) => {
      removeDataFG(`users/${currentUser?.uid}/favorites/${book.id}`)
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Heart className="h-8 w-8 mr-3 text-red-500" />
          My Favorite Books
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personal collection of {favoriteBooks.length} favorite books
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteBooks.map((book:any) => (
            <BookCard
              key={book.id}
              book={book}
              onBorrow={handleBorrow}
              onReturn={handleReturn}
              onReserve={handleReserve}
              onCancelReservation={handleCancelReservation}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No favorite books yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding books to your favorites to see them here
          </p>
          <button
            onClick={() => setCurrentView("books")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Browse Books
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;