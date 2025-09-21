import React from 'react';
import { Book, useAuth } from '../contexts/AuthContext';
import { Heart, Calendar, BookOpen, User, AlertCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
  showActions?: boolean;
  onViewDetails?: (book: Book) => void;
  onBorrow: (book: Book) => void;
  onReturn?: (book: Book) => void;
  onReserve?: (book: Book) => void;
  onCancelReservation?: (book: Book) => void;
  onAddToFavorites?: (book: Book) => void;
  onRemoveFromFavorites?: (book: Book) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  showActions = true,
  onViewDetails,
  onBorrow,
  onReturn,
  onReserve,
  onCancelReservation,
  onAddToFavorites,
  onRemoveFromFavorites,
  onEdit,
  onDelete
}) => {
  const { currentUser,favorites ,books} = useAuth();
  const thisBook:any = books.filter(b => b.isbn == book.isbn)
  const totalBorrowedUsers = thisBook[0]["borrowed"]
  const isBorrowedByUser =Boolean(totalBorrowedUsers?.[currentUser?.uid || '']);
  const TotalReservedUsers = thisBook[0]["reserved"]
  // const isReserved =new Set(thisBook.filter(m => thisBook))
  // console.log(isReserved)
  let isReservedByUser =Boolean(TotalReservedUsers?.[currentUser?.uid || '']);
  
  const key = (TotalReservedUsers?.[currentUser?.uid || ''] || '').substring(0,4);
  const isInUserFavorites = favorites.some(item => item.id === book.id) || false;
  
  let canReserve =!isReservedByUser;
  if(isBorrowedByUser){
    isReservedByUser = false
    canReserve = false
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Book Cover */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {!book.availability && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
              <User className="w-3 h-3 mr-1" />
              Not Available
            </span>
          )}
          {/* {!book.availability && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              Not Available
            </span>
          )} */}
          {book.availability && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Available
            </span>
          )}
        </div>

        {/* Favorite Button */}
        {showActions && currentUser?.role !== 'admin' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isInUserFavorites) {
                onRemoveFromFavorites?.(book);
              } else {
                onAddToFavorites?.(book);
              }
            }}
            className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 ${
              isInUserFavorites
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isInUserFavorites ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Book Details */}
      <div className="p-4 sm:p-6">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            by {book.author}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {book.category}
          </p>
        </div>

        {/* Book Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">ISBN:</span>
            <span className="text-gray-900 dark:text-white font-mono text-xs">
              {book.isbn}
            </span>
          </div>
          
          {book.publishYear && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Year:</span>
              <span className="text-gray-900 dark:text-white">
                {book.publishYear}
              </span>
            </div>
          )}
          {(
            <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total count</span>
              <span className="text-gray-900 dark:text-white">
                {book.totalCount}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available count</span>
              <span className="text-gray-900 dark:text-white">
                {book.availableCount}
              </span>
            </div>
            </>
          )}
          {currentUser?.role == "admin" && (
            <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Borrowed count</span>
              <span className="text-gray-900 dark:text-white">
                {book.countOfBorrowedBook}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Reserved count</span>
              <span className="text-gray-900 dark:text-white">
                {book.countOfReservedBook}
              </span>
            </div>
            </>
          )}
          {/* {borrowedByUser && (
            <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span>Borrowed by {borrowedByUser.name}</span>
            </div>
          )}

          {reservedByUser && reservedByUser.uid !== currentUser?.uid && (
            <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
              <span>Reserved by {reservedByUser.name}</span>
            </div>
          )} */}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-wrap gap-2">
            {/* View Details */}
            <button
              onClick={() => onViewDetails?.(book)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Details
            </button>
            {/* User Actions */}
            {currentUser?.role !== 'admin' && (book.availability || isReservedByUser) && (
              <>
                {isBorrowedByUser && (
                  <button
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Return at Library Desk
                  </button>
                )}
                {canReserve && (
                  <button
                    onClick={() => onReserve?.(book)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Reserve
                  </button>
                )}

                {isReservedByUser && (
                  <>
                  <button className='flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium'>{key}</button>
                  <button
                    onClick={() => onCancelReservation?.(book)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel Reservation
                  </button>
                  </>
                )}
              </>
            )}

            {/* Admin Actions */}
            {currentUser?.role === 'admin' && (
              <>
                {/* <button
                  onClick={() => onEdit?.(book)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Edit
                </button> */}
                <button
                  onClick={() => {onBorrow(book)}}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Issue Book
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;