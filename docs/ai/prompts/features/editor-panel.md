# Editor Panel

## Objetivo

Implementar um editor de ChordMD preparado para syntax highlight futuro.

O editor deve possuir:

- textarea funcional
- camada visual sobreposta
- numeração de linhas
- sincronização de scroll
- atualização em tempo real

---

# Estrutura Esperada

```txt
Editor Panel
 ├── Line Numbers
 │
 └── Editor Container
      ├── Syntax Overlay
      └── Transparent Textarea
````

---

# Funcionalidades

## Carregamento da música atual

O editor deve exibir:

```js
currentSong.content
```

Sempre sincronizado com o contexto global.

Ao trocar a música selecionada:

* atualizar automaticamente o conteúdo exibido

---

## Atualização em tempo real

Toda alteração na textarea deve:

* atualizar imediatamente `currentSong.content`
* refletir automaticamente no Preview

---

# Textarea

A textarea será responsável por:

* input real do usuário
* caret
* seleção
* eventos de teclado

---

## Requisitos da textarea

A textarea deve possuir:

* fundo transparente
* texto transparente
* caret visível
* resize desabilitado
* scroll sincronizado

---

# Syntax Overlay

Criar uma camada visual sobreposta à textarea.

Essa camada será utilizada futuramente para:

* syntax highlight
* destaque de acordes
* parsing visual
* decorações de código

---

## Requisitos do overlay

O overlay deve:

* possuir mesma fonte da textarea
* possuir mesmo line-height
* possuir mesmo padding
* possuir mesma quebra de linha
* acompanhar scroll perfeitamente

O alinhamento deve ser pixel-perfect.

---

# Numeração de linhas

Criar uma coluna fixa à esquerda contendo:

* número das linhas
* alinhamento vertical perfeito
* sincronização com scroll

---

## Requisitos

A numeração deve:

* atualizar automaticamente conforme quantidade de linhas
* acompanhar scroll vertical
* manter alinhamento exato

---

# Scroll sincronizado

Sincronizar:

* textarea
* overlay
* line numbers

Todos devem permanecer alinhados durante:

* scroll vertical
* scroll horizontal
* edição dinâmica

---

# Requisitos Técnicos

* arquitetura preparada para syntax highlighting futuro
* evitar rerenders pesados por keystroke
* evitar perda de foco da textarea
* estrutura compatível com virtualização futura

---

# Objetivo Arquitetural

A implementação deve preparar o editor para futura evolução similar a:

* Monaco Editor
* CodeMirror
* Obsidian

````