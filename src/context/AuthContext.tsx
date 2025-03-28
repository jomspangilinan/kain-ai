import React, { createContext, useContext, useState } from "react";
import { PublicClientApplication, AuthenticationResult, EventType } from "@azure/msal-browser";
import { MsalProvider, useMsal, } from "@azure/msal-react";



const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_APP_ID,
        authority: import.meta.env.VITE_AZURE_AUTHORITY,
        redirectUri: '/',
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

interface AuthContextProps {
    msalInstance: PublicClientApplication;
    activeAccount: ReturnType<PublicClientApplication["getActiveAccount"]>;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.enableAccountStorageEvents();

    msalInstance.addEventCallback((event) => {
        var authenticationResult = event?.payload as AuthenticationResult;
        if (event.eventType === EventType.LOGIN_SUCCESS && authenticationResult?.account) {
            const account = authenticationResult?.account;
            msalInstance.setActiveAccount(account);
            window.location.reload();
        }
    });

    const activeAccount = msalInstance.getActiveAccount();
    const login = async () => {
        try {
            await msalInstance.loginPopup({
                scopes: ["User.Read"], // Add required scopes
            });

        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = () => {
        msalInstance.logoutPopup();
    };

    return (
        <AuthContext.Provider value={{ msalInstance, activeAccount, login, logout }}>
            <MsalProvider instance={msalInstance}>{children}</MsalProvider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};