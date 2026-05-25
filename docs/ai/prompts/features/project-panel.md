# Project Panel

## Objetivo

Implementar o painel responsável pelo gerenciamento das músicas do projeto.

O painel deve permitir:

- visualização da lista de músicas
- seleção da música atual
- criação de músicas
- remoção de músicas

Toda a lógica deve utilizar o estado global provido pelo ProjectContext.

---

# Estrutura Esperada

```txt
Project Panel
 ├── Header
 │    └── New Song Button
 │
 └── Songs List
      └── Song Item
           ├── Title
           └── Delete Button
````

---

# Funcionalidades

## Listagem de músicas

Renderizar todos os itens de:

```js
project.songs
```

Cada item deve exibir:

```js
song.title
```

Caso o título esteja vazio:

```txt
Untitled ${index}
```

---

## Seleção de música

Ao clicar em um item:

* atualizar `currentSongIndex`
* refletir visualmente o item selecionado

O item ativo deve possuir estado visual distinto.

---

## Adicionar música

O header do painel deve possuir um botão:

```txt
+ New Song
```

Ao clicar:

* adicionar novo item em `project.songs`

Estrutura:

```js
{
  title: '',
  content: ''
}
```

Após adicionar:

* selecionar automaticamente a nova música

---

## Remover música

Cada item deve possuir um botão de remoção.

Ao clicar:

* exibir confirmação antes da exclusão

Exemplo:

```txt
Are you sure you want to delete this song?
```

Após confirmação:

* remover item
* reajustar `currentSongIndex`
* evitar índices inválidos

Nunca permitir estado inconsistente.

---

# Requisitos Técnicos

* utilizar React hooks
* evitar rerenders desnecessários
* componentes desacoplados
* estrutura preparada para drag-and-drop futuro

---

# Requisitos de UX

* item selecionado claramente destacado
* hover states
* transições suaves
* interação responsiva

````