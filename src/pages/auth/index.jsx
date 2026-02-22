import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import {useGetUserInfo} from '../../hooks/useGetUserInfo';
import "./style.css";
import { useEffect } from "react";
export const Auth = () => {
  const navigate = useNavigate();

  const {isAuth} = useGetUserInfo(); 

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      ProfilePhoto: results.user.photoURL,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    // we can not store obj to local storage hwnce we need json.stringify
    navigate("/expense-tracker");
  };
   
   if(isAuth){ 
    return <Navigate to="/expense-tracker" />;  // make sure if user is logged in then logged in rakhe
   }
 

  return (
    <>
      <div className="login-page">
        <h4>Sign in with Google to continue</h4>
        <button className="login-with-google-btn" onClick={signInWithGoogle}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Logo"
          />
          Sign in with Google
        </button>
      </div>
    </>
  );
};
