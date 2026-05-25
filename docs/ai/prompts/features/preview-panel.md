# Preview Panel

## Objetivo

Implementar o painel responsável pela renderização visual do ChordMD.

O preview deve:

- renderizar a música atual
- atualizar em tempo real
- utilizar escala proporcional
- respeitar configurações globais

---

# Fonte de Dados

Renderizar:

```js
currentSong.content
````

Sempre sincronizado com o Editor.

---

# Atualização reativa

Toda alteração no editor deve atualizar o preview imediatamente.

A troca de música no painel Project também deve atualizar automaticamente o preview.

---

# Configuração Global

A renderização deve utilizar:

```js
config.preview
```

Exemplo:

```js
preview: {
  size,
  orientation,
  margin,
  fontFamily,
  fontSize,
  lineHeight
}
```

---

# Estrutura Esperada

```txt
Preview Panel
 └── Scaled Preview Container
      └── Rendered ChordMD Page
```

---

# Escala proporcional

O preview deve funcionar como uma miniatura proporcional da página real.

---

## Requisitos

A escala deve:

* adaptar automaticamente à largura disponível
* preservar proporções
* utilizar transform scale
* manter fidelidade visual

---

## Comportamento esperado

```txt
Painel menor
→ preview reduzido proporcionalmente

Painel maior
→ preview ampliado proporcionalmente
```

Sem distorções.

---

# Renderização

A renderização deve:

* separar parsing de renderização
* possuir arquitetura extensível
* permitir futura paginação
* permitir futura exportação PDF

---

# Requisitos Técnicos

* evitar rerenders desnecessários
* utilizar memoização quando necessário
* arquitetura desacoplada do Editor

---

# Requisitos de UX

* atualização instantânea
* renderização suave
* preview sempre centralizado
* boa legibilidade mesmo reduzido
