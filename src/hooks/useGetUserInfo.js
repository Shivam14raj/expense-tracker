// export const useGetUserInfo = () =>{
//     const {name, profilePhoto, userID, isAuth} = JSON.parse(
//     localStorage.getItem('auth'))

//     return {name, profilePhoto, userID, isAuth}; // need seperatley these sometimes
// }



// export const useGetUserInfo = () => {
//   const storedAuth = localStorage.getItem("auth");

//   if (!storedAuth) {
//     return {
//       name: null,
//       profilePhoto: null,
//       userID: null,
//       isAuth: false,
//     };
//   }

//   const { name, profilePhoto, userID, isAuth } = JSON.parse(storedAuth);

//   return { name, profilePhoto, userID, isAuth };
// };

export const useGetUserInfo = () => {
  const storedAuth = localStorage.getItem("auth");

  if (!storedAuth || storedAuth === "null") {
    return {
      name: "",
      profilePhoto: "",
      userID: "",
      isAuth: false,
    };
  }

  try {
    const parsedAuth = JSON.parse(storedAuth);

    if (!parsedAuth) {
      return {
        name: "",
        profilePhoto: "",
        userID: "",
        isAuth: false,
      };
    }

    const {
      name = "",
      profilePhoto = "",
      userID = "",
      isAuth = false,
    } = parsedAuth;

    return { name, profilePhoto, userID, isAuth };
  } catch (err) {
    console.error("Auth parse error:", err);
    return {
      name: "",
      profilePhoto: "",
      userID: "",
      isAuth: false,
    };
  }
};