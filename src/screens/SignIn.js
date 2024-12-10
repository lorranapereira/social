import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext"; // Certifique-se do caminho correto

import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth(); // Consome o contexto do AuthContext

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://simple-api-ngvw.onrender.com/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data.jwt) {
        const token = response.data.jwt;

        await AsyncStorage.setItem("@jwt_token", token);

        setUser({ email, token });
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao realizar login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.login}>Login</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <EmailInput value={email} setValue={setEmail} />

          <PasswordInput
            value={password}
            setValue={setPassword}
            showPassword
            setShowPassword={() => {}}
          />

          <Button
            mode="contained"
            style={styles.loginButton}
            loading={isLoading}
            disabled={isLoading}
            onPress={handleLogin}
          >
            Login
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text>
              Não tem uma conta?{" "}
              <Text style={styles.createAccountText}>Crie uma</Text>
            </Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    width: "80%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  login: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  createAccountText: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default SignIn;
