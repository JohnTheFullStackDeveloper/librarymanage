import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, getDataFG } from '../firebase';
import { User } from 'lucide-react';
import { onValue, ref } from 'firebase/database';

export interface User { 
  uid: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  name: string;
  studentId?: string;
  fines: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availability: boolean;
  reserved:any[],
  borrowed:any[],
  coverUrl?: string;
  description?: string;
  publisher?: string;
  publishYear?: number;
  countOfBorrowedBook:number;
  countOfReservedBook:number;
  availableCount:number;
  totalCount:number,
}

interface AuthContextType {
  currentUser: User | null;
  books: Book[];
  loading: boolean;
  login: (email: string, password: string, role: 'admin' | 'faculty' | 'student') => Promise<void>;
  logout: () => Promise<void>;
  favorites:any[],
  reservedBooksc:any[]
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites,setFavorites] = useState([])
  const [reservedBooksc,setReservedBooksc] = useState([])
  useEffect(() => {
    // Initialize with mock data for demonstration
    let unsubscribe:any;
    let f:any,favoriteListner:any,reservedListner:any;
    const initializeData = () => {
      unsubscribe = onAuthStateChanged(auth,(user)=>{
        if (user) {
            f = onValue(ref(db,'books'), (snapshot) => {
              let bo:any = []
              snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                let availableBooks : any;
                const countOfBorrowedBook:number = childSnapshot.child('borrowed').size;
                const countOfReservedBook:number = childSnapshot.child('reserved').size;
                availableBooks = childData.totalCount - countOfBorrowedBook - countOfReservedBook;
                let countofavailableBooks:number = availableBooks;
                availableBooks = availableBooks > 0 ? true : false
                bo.push({
                  ...childData,
                  availability:availableBooks, 
                  availableCount:countofavailableBooks,
                  countOfBorrowedBook:countOfBorrowedBook,
                  countOfReservedBook:countOfReservedBook,
                })
              })
            setBooks(bo);
            })

            favoriteListner = onValue(ref(db,`users/${user?.uid}/favorites/`),(snapshot)=>{
              let fav:any = []
              snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                fav.push({...childData})
              })
              setFavorites(fav);
            })
            reservedListner = onValue(ref(db,`users/${user?.uid}/reserved/`),(snapshot)=>{
              let res:any = []
              snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                const key = childSnapshot.key
                res.push({key,childData})
              })
              setReservedBooksc(res);
            })
          async function getDetails(){
            onValue(ref(db,`users/${user?.uid}`),(snapshot)=>{
              const details = snapshot.val();
            const userData:User = {
              uid:user?.uid || '',
              email:user?.email || '',
              name:details?.name || '',
              role:details?.role || '',
              studentId:details?.studentId || '',
              fines: details?.fines || 0,
            }
          setCurrentUser(userData);
          setLoading(false)
            })
          }
          getDetails()
        } else {
          setCurrentUser(null);
          setLoading(false)
        }
      })
      // setLoading(false);
    };
    initializeData();
    return ()=>{
      try{
        f();
        favoriteListner()
        reservedListner()
        unsubscribe();
      }catch(e){

      }
    }
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'faculty' | 'student') => {
      try{
        const user = await signInWithEmailAndPassword(auth,email,password)
        const uid = user.user.uid;
        const details:any = await getDataFG(`users/${uid}`,"")
        const userData:User = {
          uid:uid || '',
          email:email || '',
          name:details?.name || '',
          role:details?.role || '',
          studentId:details?.studentId || '',
          fines: details?.fines || 0,
        }
        console.log(userData)
        setCurrentUser(userData);
      }catch(e){
        setCurrentUser(null)
        throw new Error('Invalid credentials');
      }
      // if (user) {
      //   setCurrentUser(user);
      // } else {
      //   throw new Error('Invalid credentials');
      // }

  };

  const logout = async () => {
    auth.signOut()
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    books,
    loading,
    login,
    logout,
    favorites,
    reservedBooksc
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};