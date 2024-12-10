import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, Button, TextInput, ActivityIndicator, Card, Title } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext"; // Certifique-se do caminho correto

const Home = () => {
  const [posts, setPosts] = useState([]); // Lista de posts
  const [error, setError] = useState(""); // Mensagem de erro
  const [title, setTitle] = useState(""); // Título do post
  const [description, setDescription] = useState(""); // Descrição do post
  const [image, setImage] = useState(null); // URI da imagem
  const [loading, setLoading] = useState(false); // Indicador de carregamento
  const { user } = useAuth(); // Obtenha o usuário do contexto
  const userEmail = user?.email; // E-mail do usuário logado
  const [page, setPage] = useState(1); // Página atual
  const [limit] = useState(2); // Limite de posts por página
  const [totalPages, setTotalPages] = useState(1); // Total de páginas disponíveis

  // Função para selecionar imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Imagem selecionada:", result.assets[0]);
      setImage(result.assets[0]); // Certifique-se de salvar todo o objeto da imagem
    } else {
      console.log("Seleção de imagem cancelada");
    }
  };


  // Função para criar um novo post
  const handleCreatePost = async () => {
    if (!title || !description || !image) {
      Alert.alert("Erro", "Preencha todos os campos e selecione uma imagem.");
      return;
    }

    console.log("Título:", title);
    console.log("Descrição:", description);
    console.log("Imagem:", image);

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("@jwt_token");
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      // Valida se o campo image está corretamente estruturado
      if (!image.uri) {
        throw new Error("URI da imagem está vazia ou inválida.");
      }

      // Criação do FormData
      const formData = new FormData();
      formData.append("foto", {
        uri: image.uri, // URI da imagem
        type: image.type || "image/jpeg", // Tipo do arquivo
        name: "upload.jpg", // Nome do arquivo
      });
      formData.append("title", title);
      formData.append("content", description);

      // Envio da requisição para a API
      const response = await axios.post("https://simple-api-ngvw.onrender.com/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Sucesso", "Post criado com sucesso!");
        setTitle("");
        setDescription("");
        setImage(null);
        fetchPosts(); // Atualiza a lista de posts
      } else {
        Alert.alert("Erro", "Não foi possível criar o post. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao criar post:", err);
      if (err.response?.data) {
        console.error("Resposta da API:", err.response.data);
      }
      Alert.alert("Erro", "Não foi possível criar o post. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar os posts
  const fetchPosts = async (currentPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const token = await AsyncStorage.getItem("@jwt_token");
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const response = await axios.get("https://simple-api-ngvw.onrender.com/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit, // Limite de posts por página
          page: currentPage, // Página atual
        },
      });

      const { posts: fetchedPosts, count } = response.data;

      setPosts(fetchedPosts);
      setTotalPages(Math.ceil(count / limit)); // Calcula o total de páginas
    } catch (err) {
      console.error("Erro ao buscar posts:", err);
      setError("Erro ao carregar os posts. Verifique sua conexão ou faça login novamente.");
    } finally {
      setLoading(false);
    }
  };

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

  // Carrega os posts ao montar o componente ou mudar de página
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  // Função para deletar um post da API
  const deletePost = async (postId) => {
    try {
      const token = await AsyncStorage.getItem("@jwt_token");
      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      await axios.delete(`https://simple-api-ngvw.onrender.com/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      Alert.alert("Sucesso", "Post deletado com sucesso!");
    } catch (err) {
      console.error("Erro ao deletar post:", err);
      Alert.alert("Erro", "Não foi possível deletar o post. Verifique sua conexão ou faça login novamente.");
    }
  };

  // Carrega os posts ao montar o componente
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
    <ScrollView>
      <View style={styles.formulario}>
        <Text style={styles.header}>Criar Novo Post</Text>

        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Descrição"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.textarea}
        />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Selecione uma Imagem</Text>
          )}
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <Button
            mode="contained"
            onPress={handleCreatePost}
            style={styles.createButton}
          >
            Criar Post
          </Button>
        )}
      </View>
      <Text style={styles.header}>Posts</Text>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card key={post.id} style={styles.card}>
            <Card.Content>
              <Title>{post.title}</Title>
              <Text>{post.content}</Text>
              <Text style={styles.authorText}>
                Autor: {post.author?.name} ({post.author?.email})
              </Text>
              <Image source={{ uri: post.imageId }} style={styles.image} />
              <Text style={styles.dateText}>
                Criado em: {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </Card.Content>
            <Card.Actions>
              {post.author?.email === userEmail && ( // Verifica se o e-mail do autor bate com o e-mail do usuário logado
                <Button
                  mode="contained"
                  color="red"
                  onPress={() => deletePost(post.id)}
                >
                  Deletar
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))
      ) : (
        <Text style={styles.noPostsText}>Nenhum post encontrado.</Text>
      )}
    </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  formulario: {
    backgroundColor: "#DFDFDF",
    padding: 20,
  },
  card: {
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 700,
    marginVertical: 20,
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
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
  },
  noPostsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  authorText: {
    marginTop: 10,
    fontStyle: "italic",
    color: "gray",
  },
  dateText: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
  image: {
    marginTop: 10,
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  imagePickerText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#007BFF", // Cor do botão
    borderRadius: 8,
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#007BFF",
    fontWeight: "bold",
    fontSize: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3, // Sombras para Android
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
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
