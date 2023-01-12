import React, { createContext, useReducer, PropsWithChildren, useCallback, useEffect } from "react";
import { login, refresh } from "./dataAccess/auth";
import { useCookies } from "react-cookie";
import { AUTH_COOKIE_NAME } from "./config"


type AuthPayloadType = {
  username: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const authPayloadDefault = {
  username: null,
  email: null,
  accessToken: null,
  refreshToken: null,
}

type AuthStateType = AuthPayloadType & {
  isLoggedIn: boolean;
};

type AuthActionType = {
  type: "LOGIN" | "LOGOUT" | "REFRESH";
  payload: AuthPayloadType;
};

type AuthActionLogin = {
  type: "LOGIN";
  username: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

type AuthActionLogout = {
  type: "LOGOUT";
}

type AuthActionRefresh = {
  type: "REFRESH";
  accessToken: string;
}

const authReducer = (state: AuthStateType, action: AuthActionLogin | AuthActionLogout | AuthActionRefresh): AuthStateType => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        username: action.username,
        email: action.email,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case "LOGOUT":
      return {
        ...state,
        ...authPayloadDefault,
        isLoggedIn: false,
      };
    case "REFRESH":
      return {
        ...state,
        accessToken: action.accessToken,
      };
    default:
      throw new Error("Invalid action type");
  }
};

const defaultAuthState: AuthStateType = {
  isLoggedIn: false,
  username: null,
  email: null,
  accessToken: null,
  refreshToken: null,
};

type AuthContextType = {
  authState: AuthStateType;
  login: (username: string, password: string) => void;
  logout: () => void;
  refresh: (refreshToken: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  authState: defaultAuthState,
  login: (username: string, password: string) => { },
  logout: () => { },
  refresh: (refreshToken: string) => { },
});


const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [authState, authDispatch] = useReducer(authReducer, defaultAuthState);
  const [cookies, setCookie, removeCookie] = useCookies([AUTH_COOKIE_NAME]);

  // Load auth state from cookies.
  useEffect(() => {
    if (cookies.NettoppMnemona_AuthState) {
      const state = cookies.NettoppMnemona_AuthState;
      const username = state.username;
      const email = state.email;
      const accessToken = state.accessToken;
      const refreshToken = state.refreshToken;

      if (!username || !email || !accessToken || !refreshToken) {
        authDispatch({ type: "LOGOUT", });
      } else {
        const payload: AuthActionLogin = {
          type: "LOGIN",
          username,
          email,
          accessToken,
          refreshToken,
        }
        authDispatch(payload);
      }
    }
  }, []);

  useEffect(() => {
    setCookie(AUTH_COOKIE_NAME, JSON.stringify(authState), { sameSite: "strict" });
  }, [authState]);


  const doLogin = useCallback(
    async (email: string, password: string) => {
      const loginDetails = await login(email, password);

      if (loginDetails.success) {
        authDispatch({
          type: "LOGIN",
          username: loginDetails.username,
          email: loginDetails.email,
          accessToken: loginDetails.accessToken,
          refreshToken: loginDetails.refreshToken,

        });
      } else {
        throw new Error("Login failed");
      }
    }, []
  );

  const doLogout = useCallback(async () => {
    authDispatch({ type: "LOGOUT" });
  }, []);

  const doRefresh = useCallback(async () => {
    if (authState.refreshToken) {
      const response = await refresh(authState.refreshToken);

      if (response.success) {
        authDispatch({
          type: "REFRESH",
          accessToken: response.accessToken,
        });
      } else {
        throw new Error("Refresh failed");
      }
    }
  }, [authState.refreshToken]);

  return (
    <AuthContext.Provider value={{ authState, login: doLogin, logout: doLogout, refresh: doRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthContext, AuthContextProvider };