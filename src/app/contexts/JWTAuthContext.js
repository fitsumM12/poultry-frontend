import { createContext, useReducer, useEffect } from "react";
import api from "../apis/axios";
import { Loading } from "app/components";

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }

    case "LOGIN": {
      return { ...state, isAuthenticated: true, user: action.payload.user };
    }

    case "LOGOUT": {
      return { ...state, isAuthenticated: false, user: null };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ Restore auth state on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch({
        type: "INIT",
        payload: {
          isAuthenticated: true,
          user: JSON.parse(user),
        },
      });
    } else {
      dispatch({
        type: "INIT",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/users/login/", {
        email,
        password,
      });

      const { user, token, refresh_token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "LOGIN", payload: { user } });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
  };

  if (!state.isInitialized) return <Loading />;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
