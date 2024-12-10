import React, { useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import { AuthContext } from "../context/AuthContext"; // Context API
import NameInput from "../components/NameInput";
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUp = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Estado para mensagem de sucesso
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");
    setSuccess(""); // Limpa mensagens de sucesso ao iniciar
    setIsLoading(true);

    try {
      const response = await axios.post("https://simple-api-ngvw.onrender.com/users", {
        name,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Conta criada com sucesso! Faça o login."); // Define a mensagem de sucesso

        setTimeout(() => {
          navigation.navigate("SignIn", { success: true }); // Navega para a tela de login com sucesso
        }, 1500); // Aguarda 1,5 segundos para exibir a mensagem
      } else {
        setError("Erro ao criar a conta. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao criar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.createAccount}>Criar conta</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <NameInput value={name} setValue={setName} />
        <EmailInput value={email} setValue={setEmail} />
        <PasswordInput
          value={password}
          setValue={setPassword}
          showPassword
          setShowPassword={() => {}}
        />

        <Button
          style={styles.createButton}
          mode="contained"
          loading={isLoading}
          disabled={isLoading}
          onPress={handleSignUp} // Função de cadastro
        >
          Criar
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text>
            Já tem uma conta? <Text style={styles.loginText}>Faça o login</Text>
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
  createAccount: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  createButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignSelf: "center",
  },
  loginText: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default SignUp;
