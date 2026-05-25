# Specs

Definições formais dos formatos e estruturas do projeto Colyrics.

---

# Project Schema (.colyrics)

```ts
project = {
  title: string,
  settings: {
    text: {
      fontFamily: string,
      fontSize: number,
      lineHeight: number
    },
    page: {
      size: string,
      orientation: string,
      margin: number
    }
  },
  songs: Song[]
}
```

---

## Song

```ts
type Song = {
  title: string,
  content: string
}
```

Regras:

* `title` obrigatório
* `content` obrigatório, podendo ser string vazia
* ordem dos songs define ordem de exibição

---

# .colyrics format

* Formato JSON
* Deve seguir exatamente o schema de `project`
* Campos desconhecidos devem ser ignorados
* Deve ser validado antes de aplicar no estado

Validação mínima:

* exists `title`
* exists `settings`
* exists `songs` (array)

---

# .chordmd format

Arquivo texto com estrutura livre + convenções:

## Regras:

* Pode iniciar ou não com `@chordmd` (deve ser removido no import)
* Pode conter markdown
* Primeira linha `# ` define o título
* Se não houver título, usar nome do arquivo

## Estrutura típica:

```txt
# Song Title
## Key: G

### Verse 1
[Am]lyrics here [C] more lyrics
[D]And more lyrics [E]
```

---

## Parsing rules:

* Remover `@chordmd` se existir no início
* Remover linhas vazias iniciais
* Extrair título da primeira linha `# `
* `content` preserva texto completo (incluindo título)
* Não transformar conteúdo em estrutura obrigatória

---

# .md format

* Deve iniciar com `@chordmd` (deve ser removido no import)
* Igual ao `.chordmd`
* Mesmo parser pode ser reutilizado

---

# Import Rules

* `.colyrics` → substitui projeto inteiro
* `.chordmd` / `.md` → adiciona nova música
* múltiplos arquivos `.chordmd` / `.md` permitidos
* se `.colyrics` estiver presente → ignorar outros arquivos

---

# Data Integrity Rules

* `project` é source of truth
* `songs` nunca deve ser undefined
* nunca mutar estado diretamente
* updates devem ser imutáveis

---

# Compatibility Rules

* `.colyrics` deve ser sempre retrocompatível
* novos campos devem ser opcionais
* parsers antigos devem continuar funcionando

---

# Rendering Contract

* renderer recebe apenas estrutura parseada
* nunca recebe raw `.chordmd`
* output deve ser idempotente (mesma entrada → mesmo output)
