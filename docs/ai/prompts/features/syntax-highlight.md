# Syntax Highlight

## Objetivo

Implementar o sistema de syntax highlight do editor ChordMD utilizando a camada `Syntax Overlay`.

O sistema deve:

- identificar elementos sintáticos do ChordMD
- envolver tokens em spans com classes específicas
- permitir estilização futura via CSS
- manter alinhamento perfeito com a textarea
- suportar atualização em tempo real
- validar erros básicos de sintaxe

---

# Estrutura Geral

O syntax highlight deve funcionar através de parsing linha a linha do conteúdo do editor.

A saída deve ser HTML renderizado dentro da camada overlay.

Exemplo estrutural:

```html
<span class="title"># Amazing Grace</span>
````

---

# Classes de Highlight

## Title

Linhas iniciadas com:

```txt
# 
```

Devem gerar:

```html
<span class="title">...</span>
```

---

## Meta

Linhas iniciadas com:

```txt
@
```

Devem gerar:

```html
<span class="meta">...</span>
```

Exemplo:

```txt
@key: G
@tempo: 120
```

---

## Section

Conteúdo entre colchetes:

```txt
[Verse]
[Chorus]
[Bridge]
```

Deve gerar:

```html
<span class="section">...</span>
```

---

## Chord

Cifras entre colchetes inline:

```txt
[C]
[Am]
[F#7]
```

Devem gerar:

```html
<span class="chord">...</span>
```

A identificação deve funcionar mesmo no meio da frase.

Exemplo:

```txt
[C]Amazing [G]grace
```

---

## Blockquote

Marcadores de blockquote:

```txt
>
```

Devem gerar:

```html
<span class="blockquote">></span>
```

Apenas o marcador deve receber a classe.

---

## Comment

Comentários iniciados com:

```txt
//
```

Devem gerar:

```html
<span class="comment">...</span>
```

---

# Highlight da Linha Atual

A linha atual do cursor deve possuir destaque visual.

---

## Requisitos

* identificar a linha atual da textarea
* refletir o destaque na camada overlay
* atualização em tempo real conforme movimentação do cursor

---

## Estrutura esperada

A linha atual deve possuir classe adicional:

```html
<div class="line active-line">
  ...
</div>
```

---

# Validação de Sintaxe

Implementar validação básica de erros sintáticos.

As validações devem funcionar em tempo real.

---

# Erros Detectáveis

## Colchetes vazios

Detectar:

```txt
[]
```

Isso deve ser marcado como erro.

---

## Headers sem espaço

Detectar linhas iniciadas com:

```txt
#
##
###
```

Sem espaço após os caracteres.

Exemplos inválidos:

```txt
#Title
##Verse
###Bridge
```

Exemplos válidos:

```txt
# Title
## Verse
### Bridge
```

---

# Estrutura de erro

Elementos inválidos devem receber:

```html
<span class="syntax-error">...</span>
```

---

# Requisitos Técnicos

## Parsing

O parser deve:

* funcionar linha a linha
* permitir múltiplos tokens por linha
* preservar espaços e alinhamento
* preservar quebras de linha

---

## Segurança

Evitar inserção insegura de HTML.

Escapar caracteres antes do parsing.

---

## Performance

O sistema deve:

* evitar rerender completo desnecessário
* suportar documentos grandes
* possuir atualização fluida durante digitação

---

# Compatibilidade Futura

A arquitetura deve permitir futura implementação de:

* tokens customizados
* autocomplete
* lint avançado
* parser semântico
* syntax tree
* folding
* highlights múltiplos

---

# Objetivo Final

O resultado deve proporcionar uma experiência semelhante a editores modernos como:

* VSCode
* Monaco
* CodeMirror
* Obsidian

Mantendo sincronização perfeita entre:

* textarea
* overlay
* line numbers
* cursor
* scroll