# Smart Flow

Aplicativo de gerenciamento financeiro desenvolvido em **React Native** e **Expo**, com controle completo de receitas, despesas, parcelas, recorrências, análises gráficas e sincronização em nuvem.

## 🎯 Sobre o Projeto

Smart Flow é uma solução mobile para você gerenciar suas finanças pessoais de forma inteligente e intuitiva. Acompanhe seus gastos, organize suas despesas em categorias, configure pagamentos recorrentes e visualize insights gráficos sobre seus hábitos de consumo.

### ✨ Principais Funcionalidades

- 💰 **Gerenciamento de Receitas e Despesas** - Registre e categorize todas as suas transações
- 📊 **Análises Gráficas** - Visualize relatórios e gráficos sobre seus gastos
- 🔄 **Recorrências** - Configure pagamentos e receitas que se repetem automaticamente
- 💳 **Controle de Parcelas** - Acompanhe compras parceladas com detalhamento completo
- ☁️ **Sincronização em Nuvem** - Acesse seus dados em qualquer dispositivo
- 📱 **Interface Responsiva** - Experiência otimizada para dispositivos móveis

## 🛠 Stack Tecnológico

- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **Expo** - Plataforma para desenvolvimento e distribuição de apps React Native
- **TypeScript** - Linguagem tipada para maior segurança e manutenibilidade
- **[Adicionar outras dependências principais]**

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:

- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)

## 🚀 Como Começar

### 1. Clone o repositório

```bash
git clone https://github.com/jorgerios7/smart-flow.git
cd smart-flow
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto

```bash
expo start
```

Será exibido um código QR. Use o Expo Go para escanear:

- **iOS**: App Store → Expo Go → Escanear código QR
- **Android**: Google Play → Expo Go → Escanear código QR

### 4. (Opcional) Execute em um emulador

```bash
# iOS
expo start --ios

# Android
expo start --android
```

## 📁 Estrutura do Projeto

```
smart-flow/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── screens/         # Telas da aplicação
│   ├── services/        # Serviços e APIs
│   ├── context/         # Context API para gerenciamento de estado
│   ├── utils/           # Funções utilitárias
│   └── assets/          # Imagens e fontes
├── App.tsx              # Entrada principal
├── app.json             # Configuração do Expo
├── package.json         # Dependências e scripts
└── tsconfig.json        # Configuração do TypeScript
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias:

```env
API_URL=your_api_url
CLOUD_API_KEY=your_cloud_api_key
```

## 📚 Documentação

Para mais informações sobre as tecnologias utilizadas:

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Como Contribuir

Contribuições são bem-vindas! Para contribuir com o projeto:

1. Faça um Fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**Jorge Rios**

- GitHub: [@jorgerios7](https://github.com/jorgerios7)

## 💬 Suporte

Se você tiver dúvidas ou encontrar algum problema, abra uma [issue](https://github.com/jorgerios7/smart-flow/issues) no repositório.

## 🎉 Agradecimentos

Obrigado por usar o Smart Flow! Estamos sempre melhorando a aplicação com base no feedback da comunidade.

---

**Desenvolvido por Jorge Rios**
