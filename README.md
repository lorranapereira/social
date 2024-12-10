Social
Aplicativo React Native com funcionalidades de autenticação, criação, listagem e exclusão de posts.
Descrição

Este é um aplicativo desenvolvido com React Native e React Navigation, que utiliza uma API para autenticação e gerenciamento de posts. Ele inclui:

    Tela de Login e Cadastro.
    Listagem de posts com paginação.
    Criação de posts com título, descrição e upload de imagens.
    Exclusão de posts, restrita ao usuário que os criou.
    Listagem de usuários com paginação.

Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

    Node.js (versão 16 ou superior).
    Expo CLI (para executar o aplicativo).
    Git (opcional, para clonar o repositório).

Instalação

    Clone o repositório do projeto:

git clone https://github.com/lorranapereira/social.git

Navegue para a pasta do projeto:

cd social

Instale as dependências:

npm install

Instale o AsyncStorage, necessário para armazenar o token do usuário:

npm install @react-native-async-storage/async-storage

Instale o React Navigation e suas dependências:

npm install @react-navigation/native react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons react-native-get-random-values
npm install @react-navigation/stack @react-navigation/bottom-tabs

Instale o Axios para lidar com as requisições à API:

npm install axios

Instale o Expo Image Picker para lidar com o upload de imagens:

    expo install expo-image-picker

    Certifique-se de que todas as dependências foram instaladas corretamente.

Configuração da API

    Acesse o arquivo onde as URLs da API estão definidas (ex.: Home.js ou Users.js).
    Certifique-se de que as URLs apontam para o endpoint correto:

    https://simple-api-ngvw.onrender.com/

Como Executar

    Execute o aplicativo no ambiente de desenvolvimento:

npm start

Funcionalidades
Login e Cadastro

    Acesse a tela inicial e entre com suas credenciais ou crie uma nova conta.

Listagem de Posts

    Veja todos os posts paginados. Você pode navegar entre as páginas usando os botões "Anterior" e "Próxima".

Criação de Posts

    Crie um novo post preenchendo o título, descrição e selecionando uma imagem.

Exclusão de Posts

    Exclua apenas os posts que você criou. O botão "Deletar" só aparece para o criador do post.

Listagem de Usuários

    Visualize uma lista de todos os usuários registrados no sistema, com paginação.
