import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, Card, ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]); // Lista de usuários
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const [error, setError] = useState(""); // Mensagem de erro
  const [page, setPage] = useState(1); // Página atual
  const [limit] = useState(10); // Limite de usuários por página
  const [totalPages, setTotalPages] = useState(1); // Total de páginas disponíveis

  // Função para buscar os usuários
  const fetchUsers = async (currentPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const token = await AsyncStorage.getItem("@jwt_token");
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const response = await axios.get(
        `https://simple-api-ngvw.onrender.com/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit, // Limite de usuários por página
            page: currentPage, // Página atual
          },
        }
      );

      const { users: fetchedUsers, count } = response.data;

      setUsers(fetchedUsers);
      setTotalPages(Math.ceil(count / limit)); // Calcula o total de páginas
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Erro ao carregar os usuários. Verifique sua conexão ou faça login novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os usuários ao montar o componente ou mudar de página
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Função para avançar para a próxima página
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Função para voltar para a página anterior
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
        <Text>Carregando usuários...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.name}>Nome: {item.name}</Text>
              <Text style={styles.email}>E-mail: {item.email}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
      />

      <View style={styles.pagination}>
        <Button
          mode="contained"
          disabled={page === 1}
          onPress={handlePreviousPage}
          style={styles.paginationButton}
        >
          Anterior
        </Button>
        <Text style={styles.pageInfo}>
          Página {page} de {totalPages}
        </Text>
        <Button
          mode="contained"
          disabled={page === totalPages}
          onPress={handleNextPage}
          style={styles.paginationButton}
        >
          Próxima
        </Button>
      </View>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  paginationButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
