import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Criação do contexto
export const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena o estado global do usuário

  const login = async (userData) => {
    setUser(userData); // Define os dados do usuário
  };

  const logout = async () => {
    setUser(null); // Limpa os dados do usuário
    await AsyncStorage.removeItem("@jwt_token"); // Remove o token
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = () => React.useContext(AuthContext);
