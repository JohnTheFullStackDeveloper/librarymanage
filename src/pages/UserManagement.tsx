import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Search, DollarSign, AlertTriangle, Check, X } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { books } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredUsers : any= []
  // users.filter(user => {
  //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
  //   const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
  //   return matchesSearch && matchesRole;
  // });

  const handleUpdateFines = async (userId: string, amount: number) => {
    try {
      // await updateUserFines(userId, amount);
    } catch (error) {
      console.error('Failed to update fines:', error);
    }
  };

  const getUserBorrowedBooks = (userId: string) => {
    // return books.filter(book => book.borrowedBy === userId);
  };

  const getUserReservedBooks = (userId: string) => {
    // return books.filter(book => book.reservedBy === userId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Users className="h-8 w-8 mr-3 text-blue-500" />
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage {/*users.length*/} library users and their activities
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-6">
        {filteredUsers.map((user:any) => {
          const borrowedBooks = getUserBorrowedBooks(user.uid);
          const reservedBooks = getUserReservedBooks(user.uid);
          
          return (
            <div key={user.uid} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* User Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      user.role === 'admin' ? 'bg-red-500' :
                      user.role === 'faculty' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === 'admin' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                          user.role === 'faculty' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        }`}>
                          {user.role}
                        </span>
                        {/* {user.department && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {user.department}
                          </span>
                        )} */}
                        {user.studentId && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            ID: {user.studentId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {/*borrowedBooks.length*/}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Borrowed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {/*reservedBooks.length*/}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Reserved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        user.fines > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        ${user.fines.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Fines
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Borrowed Books */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <Check className="h-4 w-4 mr-2 text-blue-500" />
                      Currently Borrowed ({/*borrowedBooks.length*/})
                    </h4>
                    {/*borrowedBooks.length*/0 > 0 ? (
                      <div className="space-y-2">
                        {/* {borrowedBooks.map(book => {
                          const isOverdue = book.returnDate && new Date(book.returnDate) < new Date();
                          return (
                            <div key={book.id} className={`p-3 rounded-lg border ${
                              isOverdue 
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                            }`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {book.title}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    by {book.author}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Due: {book.returnDate && new Date(book.returnDate).toLocaleDateString()}
                                  </p>
                                </div>
                                {isOverdue && (
                                  <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-xs font-medium">Overdue</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })} */}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        No books currently borrowed
                      </p>
                    )}
                  </div>

                  {/* Reserved Books */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                      Reserved Books ({/*reservedBooks.length*/})
                    </h4>
                    {/*reservedBooks.length*/0 > 0 ? (
                      <div className="space-y-2">
                        {/* {reservedBooks.map(book => (
                          <div key={book.id} className="p-3 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              by {book.author}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Reserved: {book.reservedDate && new Date(book.reservedDate).toLocaleDateString()}
                            </p>
                          </div>
                        ))} */}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        No books currently reserved
                      </p>
                    )}
                  </div>
                </div>

                {/* Fine Management */}
                {user.fines > 0 && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-300">
                          Outstanding Fine: ${user.fines.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateFines(user.uid, -user.fines)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors duration-200"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => {
                            const amount = prompt('Enter additional fine amount:');
                            if (amount && !isNaN(parseFloat(amount))) {
                              handleUpdateFines(user.uid, parseFloat(amount));
                            }
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors duration-200"
                        >
                          Add Fine
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;