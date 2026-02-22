import { useState } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/firebase-config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import "./ExpenseTracker.css";

export const ExpenseTracker = () => {
  const addHook = useAddTransaction() || {};
  const AddTransaction = addHook.AddTransaction || (() => {});

  const getHook = useGetTransactions() || {};
  const transactions = getHook.transactions || [];
  const { balance = 0, income = 0, expenses = 0 } = getHook.transactionTotals || {};

  const userInfo = useGetUserInfo() || {};
  // const { name } = userInfo;
  const { name = "" } = userInfo;
  const userID = userInfo.userID; // needed for reset

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(""); 
  const [transactionType, setTransactionType] = useState("income");

  const navigate = useNavigate();

  // Add Transaction
  const onSubmit = (e) => {
    e.preventDefault();
    if (!description || transactionAmount === "") return;

    AddTransaction({
      description,
      transactionAmount: Number(transactionAmount),
      transactionType,
    });

    setDescription("");
    setTransactionAmount("");
    setTransactionType("income");
  };

  // Sign Out
  const signUserOut = async () => {
    try {
      await signOut(auth);
      // localStorage.clear();
      localStorage.removeItem("auth");
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  // Reset Month Transactions
  const resetTransactions = async () => {
    if (!userID) return;
    try {
      const q = query(
        collection(db, "transactions"),
        where("userID", "==", userID)
      );
      const snapshot = await getDocs(q);

      const batchDelete = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "transactions", docSnap.id))
      );

      await Promise.all(batchDelete);

      alert("All transactions reset! You can start a new month.");
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  return (
    <>
      <div className="expense-tracker">
        <div className="container">
          <h1> {name}'s Expense Tracker</h1>

          <div className="total-balance">
            <h3>Your Balance</h3>
            { balance >= 0 ? (
              <h2>Rs. {balance.toFixed(2)}</h2>
            ): (
              <h2> -Rs.{balance * -1 .toFixed(2)}</h2>
            )}         
           
          </div>

          <div className="summary">
            <div className="income">
              <h4>Income</h4>
              <p>Rs. {income.toFixed(2)}</p>
            </div>
            <div className="expenses">
              <h4>Expenses</h4>
              <p>Rs. {expenses.toFixed(2)}</p>
            </div>
          </div>

          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              required
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <div className="transaction-type">
              <input
                type="radio"
                id="expense"
                value="expense"
                name="type"
                checked={transactionType === "expense"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <label htmlFor="expense">Expenses</label>
              <input
                type="radio"
                id="income"
                value="income"
                name="type"
                checked={transactionType === "income"}
                onChange={(e) => setTransactionType(e.target.value)}
              />
              <label htmlFor="income">Income</label>
            </div>
            <button type="submit" style={{background: "rgb(34, 197, 94)"}}>Add Transaction</button>
          </form>
        </div>

        {/* Sign Out & Reset Buttons */}
        <div className="sign-out">
          <button onClick={signUserOut}>Sign-out</button>
          <button onClick={resetTransactions} style={{background: "#f97316"}}>Reset Month</button>
        </div>
      </div>

      <div className="transactions">
        <h3>Transactions</h3>
        <ul>
          {transactions
            .slice()
            .sort((a, b) => {
              const aTime = a.createdAT?.toMillis ? a.createdAT.toMillis() : a.createdAT;
              const bTime = b.createdAT?.toMillis ? b.createdAT.toMillis() : b.createdAT;
              return bTime - aTime;
            })
            .map((t, index) => {
              const { description, transactionAmount, transactionType } = t;
              return (
                <li key={index}>
                  <h4>{description}</h4>
                  <p>
                    Rs. {transactionAmount} •{" "}
                    <span style={{ color: transactionType === "expense" ? "red" : "green", fontWeight: 600 }}>
                      {transactionType}
                    </span>
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};