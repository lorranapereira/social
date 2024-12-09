import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './src/screens/SignIn'; // Tela de Login
import SignUp from './src/screens/SignUp'; // Tela de Cadastro
import Home from './src/screens/Home'; // Tela Home (protegida)

// Contexto para autenticação
const AuthContext = createContext();

const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            // Usuário não autenticado: Exibe as telas de SignIn e SignUp
            <>
              <Stack.Screen name="SignIn" component={SignIn} options={{ title: 'Entrar' }} />
              <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Registrar' }} />
            </>
          ) : (
            // Usuário autenticado: Exibe a Home
            <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;

// Função para acessar o contexto
export const useAuth = () => useContext(AuthContext);
