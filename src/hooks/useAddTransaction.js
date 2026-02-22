import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import  {db} from '../config/firebase-config'
import {useGetUserInfo} from './useGetUserInfo'

export const useAddTransaction = () =>{
    
    const transactionCollectionref = collection(db, "transactions"); 
    const {userID} = useGetUserInfo() // hook 2

   const AddTransaction = async ({description, transactionAmount, transactionType}) =>{
     await addDoc(transactionCollectionref, {
        userID,
        description,  
        transactionAmount,
        transactionType,
        createdAT: serverTimestamp()
     });
   };
   return  {AddTransaction}  
}