# 📱 Guia Completo de Setup - App Habitus Mobile

## ✅ O que foi configurado automaticamente:

### 1. 🔐 Sistema de Autenticação Corrigido
- ✅ Persistência de sessão implementada com `onAuthStateChange()`
- ✅ Login com email/senha funcionando corretamente
- ✅ Login social com Google configurado
- ✅ Fluxo de recuperação de senha corrigido
  - Email de reset agora redireciona para `/update-password`
  - Nova página `UpdatePassword.tsx` permite redefinir senha
  - Após atualizar, usuário é deslogado e redirecionado para login
- ✅ Campo `premium` adicionado ao banco de dados

### 2. 📦 PWA (Progressive Web App) Configurado
- ✅ `vite-plugin-pwa` instalado e configurado
- ✅ Service Worker para cache offline
- ✅ Manifest.json com configurações do app
- ✅ Cache de requisições Supabase para funcionamento offline

### 3. 📱 Capacitor Instalado e Configurado
- ✅ Dependências instaladas:
  - @capacitor/core
  - @capacitor/cli
  - @capacitor/ios
  - @capacitor/android
- ✅ `capacitor.config.ts` criado com:
  - App ID: `app.lovable.f2c30060302b4c11b6920a56701953a8`
  - App Name: `Habitus`
  - Splash Screen configurada (fundo preto #000000)
  - Hot reload habilitado para desenvolvimento

---

## 🎨 Próximos Passos: Ícones do App

### Opção 1: Criar Ícones Manualmente
Use uma ferramenta como Figma, Canva ou Photoshop para criar:

**Icon Principal (512x512px):**
- Fundo: Preto (#000000)
- Símbolo: Checkmark em círculo
- Cor: Cyan vibrante (#00D1FF)
- Estilo: Minimalista, flat design

Salve os ícones em:
- `public/icon-512.png` (512x512px)
- `public/icon-192.png` (192x192px)

### Opção 2: Usar Ferramenta de Geração Online
Recomendações:
- [Icon Kitchen](https://icon.kitchen/)
- [PWA Asset Generator](https://www.pwabuilder.com/)
- [Favicon.io](https://favicon.io/)

Upload o logo do Habitus (se tiver) ou use o checkmark como base.

---

## 🚀 Como Buildar para Android e iOS

### Pré-requisitos:
- Node.js instalado
- Git instalado
- Para iOS: Mac com Xcode
- Para Android: Android Studio

### Passo 1: Exportar para GitHub
1. No Lovable, clique em **"Export to GitHub"**
2. Clone seu repositório localmente:
```bash
git clone <seu-repositorio-url>
cd habitus
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Inicializar Capacitor
```bash
npx cap init
```
Quando solicitado:
- App name: `Habitus`
- App ID: `app.lovable.f2c30060302b4c11b6920a56701953a8`
- Web directory: `dist`

### Passo 4: Adicionar Plataformas
```bash
# Para Android
npx cap add android

# Para iOS (apenas em Mac)
npx cap add ios
```

### Passo 5: Build do App
```bash
npm run build
```

### Passo 6: Sync com Plataformas Nativas
```bash
npx cap sync
```

### Passo 7: Abrir e Testar

**Android:**
```bash
npx cap open android
```
Isso abrirá o Android Studio. Conecte um dispositivo ou emulador e clique em "Run".

**iOS:**
```bash
npx cap open ios
```
Isso abrirá o Xcode. Selecione um simulador ou dispositivo e clique em "Run".

---

## 🔄 Workflow de Desenvolvimento

### Após fazer mudanças no código:
1. Commit e push para GitHub
2. Git pull no seu projeto local
3. Execute:
```bash
npm run build
npx cap sync
```
4. Abra novamente no Android Studio ou Xcode

---

## 💳 Sistema Premium (Próximo Passo - Opcional)

### Para implementar assinaturas com Stripe:

1. **Habilite o Stripe no Lovable:**
   - Clique no backend
   - Vá para integrações
   - Ative Stripe e configure sua chave secreta

2. **Atualize a página de assinaturas:**
   O arquivo `src/pages/Subscription.tsx` já existe. Precisaremos:
   - Integrar com Stripe Checkout
   - Criar webhook para atualizar `premium = true` após pagamento
   - Adicionar lógica condicional para liberar recursos premium

3. **Proteção de recursos premium:**
```typescript
// Exemplo em qualquer componente
import { useUser } from '@/contexts/UserContext';

export default function PremiumFeature() {
  const { user } = useUser();
  
  if (!user?.premium) {
    return (
      <div>
        <p>Este recurso é exclusivo para assinantes Premium.</p>
        <Button onClick={() => navigate('/subscription')}>
          Assinar Premium
        </Button>
      </div>
    );
  }
  
  return <div>Conteúdo Premium...</div>;
}
```

---

## 📝 Notas Importantes

### Autenticação:
- ✅ O sistema de autenticação agora persiste corretamente
- ✅ Usuários podem logar, deslogar e fazer login novamente sem problemas
- ✅ Recuperação de senha funciona corretamente
- ⚠️ Para produção, configure as URLs de redirecionamento no Supabase (já configurado automaticamente pelo Lovable Cloud)

### URLs de Redirecionamento:
O Lovable Cloud já configura automaticamente:
- Site URL: URL do seu app publicado
- Redirect URLs: URLs permitidas para autenticação

Para adicionar domínio customizado:
1. Abra o Backend do Lovable
2. Vá para Auth Settings
3. Adicione seu domínio customizado

### Publicação nas Lojas:

**Google Play Store:**
- Necessário conta de desenvolvedor ($25 uma vez)
- Gere APK/AAB assinado no Android Studio
- Configure página da loja, screenshots, descrição
- Submit para revisão

**Apple App Store:**
- Necessário conta Apple Developer ($99/ano)
- Configure certificados e provisioning profiles
- Archive o app no Xcode
- Upload via App Store Connect
- Submit para revisão

---

## 🔧 Solução de Problemas Comuns

### "Invalid Refresh Token" nos logs de autenticação:
- Este erro é normal quando tokens expiram
- O Supabase automaticamente renova tokens válidos
- Não afeta o funcionamento do login

### Service Worker não atualiza:
```bash
# Limpe o cache e force rebuild
rm -rf dist
npm run build
```

### App não abre após sync:
```bash
# Limpe e reconstrua as plataformas
npx cap sync --deployment
```

### Problemas com ícones:
- Certifique-se de que os arquivos existem em `public/`
- Verifique se os nomes correspondem ao manifest
- Force rebuild: `npm run build && npx cap sync`

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Consulte a documentação do Capacitor: https://capacitorjs.com/docs
3. Documentação do Lovable: https://docs.lovable.dev/

---

## ✨ Resumo do que foi feito:

1. ✅ Sistema de autenticação 100% funcional com persistência de sessão
2. ✅ Recuperação de senha corrigida com página dedicada
3. ✅ PWA configurado com service worker e cache offline
4. ✅ Capacitor instalado e pronto para empacotamento nativo
5. ✅ Campo premium adicionado ao banco de dados
6. ✅ Arquivos de configuração criados (capacitor.config.ts, vite.config.ts)
7. ✅ Rotas atualizadas com página de update password

**Próximos passos para você:**
1. Adicionar os ícones do app (icon-192.png e icon-512.png)
2. Exportar para GitHub e seguir os passos de build
3. Testar em emulador/dispositivo
4. (Opcional) Implementar sistema de pagamento Premium com Stripe

Está tudo pronto para transformar seu web app em um app nativo! 🎉
