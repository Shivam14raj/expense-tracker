import { useEffect, useState } from "react";
import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  const { userID } = useGetUserInfo(); // may be undefined initially

  useEffect(() => {
    if (!userID) return; // wait until userID is available

    const transactionCollectionRef = collection(db, "transactions");

    const q = query(
      transactionCollectionRef,
      where("userID", "==", userID),
      orderBy("createdAT", "asc") // make sure Firestore index exists
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let totalIncome = 0;
        let totalExpenses = 0;

        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          // calculate totals
          if (data.transactionType === "income") totalIncome += Number(data.transactionAmount);
          else if (data.transactionType === "expense") totalExpenses += Number(data.transactionAmount);

          return {
            id: doc.id,
            ...data,
          };
        });

        setTransactions(docs);

        // update totals
        let balance = totalIncome - totalExpenses;
        setTransactionTotals({
          balance,
          income: totalIncome,
          expenses: totalExpenses,
        });
      },
      (error) => console.error("Firestore snapshot error:", error)
    );

    return () => unsubscribe(); // cleanup on unmount
  }, [userID]);

  return { transactions, transactionTotals };
};