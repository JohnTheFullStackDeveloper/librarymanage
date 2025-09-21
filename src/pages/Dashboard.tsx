import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Users, 
  Heart, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, books ,favorites,reservedBooksc} = useAuth();

  const getStats = () => {
    let totalBooks :any = books.length;
    const totalBooksInQuantity = books.reduce((acc, book) => acc + book.totalCount, 0);
    const availableBooks = books.filter(book => book.availability).length;
    totalBooks = totalBooks +` (${totalBooksInQuantity})`
    let borrowedBooks : number = 0
     books.forEach(element => {
       borrowedBooks += element.countOfBorrowedBook
    });
    let reservedBooks : number = 0
    books.forEach(element => {
      reservedBooks += element.countOfReservedBook
    })
    
    let reservedNames:any = books.map((book) => book?.borrowed || {})
    reservedNames = reservedNames.map((book:any) => book[currentUser?.uid || '']).filter(Boolean)
    const userBorrowedBooks =  reservedNames.length;
    const userFavoriteBooks =  favorites.length
    const userReservedBooks =  reservedBooksc.length;
    const userFines = currentUser?.fines || 0;

    const studentsCount = 0;
    const facultyCount = 0;
    const totalFines =0;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      reservedBooks,
      userBorrowedBooks,
      userFavoriteBooks,
      userReservedBooks,
      userFines,
      studentsCount,
      facultyCount,
      totalFines
    };
  };

  const stats = getStats();

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description?: string;
  }> = ({ title, value, icon, color, description }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')} dark:${color.replace('border-l-', 'bg-').replace('-500', '-900')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const recentBooks:any = []

  const overdueBooks :any= []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 capitalize">
          {currentUser?.role} Dashboard - {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* User Fines Alert */}
      {(currentUser?.fines || 0) > 0 && currentUser?.role == "student" && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                Outstanding Fines
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                You have ${currentUser?.fines.toFixed(2)} in overdue fines. Please pay at the library desk.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {currentUser?.role === 'admin' ? (
          <>
            <StatCard
              title="Total Books"
              value={stats.totalBooks}
              icon={<BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              color="border-l-blue-500"
            />
            <StatCard
              title="Borrowed Books"
              value={stats.borrowedBooks}
              icon={<TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              color="border-l-orange-500"
            />
            <StatCard
              title="Total Reservations"
              value={stats.reservedBooks}
              icon={<Users className="h-6 w-6 text-green-600 dark:text-green-400" />}
              color="border-l-green-500"
            />
            <StatCard
              title="Total Fines"
              value={`$${stats.totalFines.toFixed(2)}`}
              icon={<DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />}
              color="border-l-red-500"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Books Borrowed"
              value={stats.userBorrowedBooks}
              icon={<BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
              color="border-l-blue-500"
            />
            <StatCard
              title="Favorite Books"
              value={stats.userFavoriteBooks}
              icon={<Heart className="h-6 w-6 text-red-600 dark:text-red-400" />}
              color="border-l-red-500"
            />
            <StatCard
              title="Reservations"
              value={stats.userReservedBooks}
              icon={<Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />}
              color="border-l-green-500"
            />
            {
              currentUser?.role == "student" ?
              (<StatCard
              title="Outstanding Fines"
              value={`$${stats.userFines.toFixed(2)}`}
              icon={<DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />}
              color="border-l-orange-500"
            />):(<></>)
            }
          </>
        )}
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentBooks.length > 0 ? (
              recentBooks.map((book :any) => {
                // const borrower = users.find(u => u.uid === book.borrowedBy);
                return (
                  <></>
                //   <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                //     <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                //     <div className="flex-1">
                //       <p className="text-sm font-medium text-gray-900 dark:text-white">
                //         "{book.title}" borrowed
                //       </p>
                //       <p className="text-xs text-gray-600 dark:text-gray-400">
                //         by {borrower?.name} • {book.borrowedDate && new Date(book.borrowedDate).toLocaleDateString()}
                //       </p>
                //     </div>
                //   </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats / Overdue Books */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
            {currentUser?.role === 'admin' ? 'Overdue Books' : 'Quick Stats'}
          </h2>
          
          {currentUser?.role === 'admin' ? (
            <div className="space-y-4">
              {overdueBooks.length > 0 ? (
                overdueBooks.map((book :any) => {
                  // const borrower = users.find(u => u.uid === book.borrowedBy);
                  // const daysOverdue = Math.floor((Date.now() - new Date(book.returnDate!).getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <></>
                    // <div key={book.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    //   <div>
                    //     <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    //       {book.title}
                    //     </p>
                    //     <p className="text-xs text-red-600 dark:text-red-400">
                    //       {borrower?.name} • {daysOverdue} days overdue
                    //     </p>
                    //   </div>
                    //   <span className="text-xs font-medium text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-800 px-2 py-1 rounded">
                    //     ${(daysOverdue * 0.50).toFixed(2)}
                    //   </span>
                    // </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  No overdue books
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.availableBooks}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  Available Books
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentUser?.role === 'faculty' ? 'Free' : 'Paid'}
                </div>
                <div className="text-sm text-green-800 dark:text-green-300">
                  Borrowing Access
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;