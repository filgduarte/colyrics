# Project Structure

## Overview

Arquitetura baseada em separação clara entre UI, estado e lógica de domínio.

---

# Estrutura

```txt
src/
├── components/
├── hooks/
├── lib/
│   ├── parser/
│   ├── renderer/
│   ├── import/
│   ├── export/
│   └── utils/
├── models/
└── App.jsx
```

---

# Regras por camada

## components/

* Apenas UI
* Sem regras de negócio
* Usar hooks/lib para lógica

## hooks/

* Lógica reutilizável de estado
* Ex: useViewSettings, useFileImport

## lib/

Contém toda lógica não-UI

---

## lib/parser

* Funções puras
* Converte chordmd → estrutura intermediária
* Sem HTML, sem React

---

## lib/renderer

* Converte estrutura → HTML/preview
* Não faz parsing
* Não muta dados

---

## lib/import

* Leitura de arquivos (.colyrics, .chordmd, .md)
* Validação e normalização
* Atualiza estado via integração com hooks

---

## lib/export

* Geração de arquivos (.colyrics, .pdf, etc)
* Deve ser consistente com estrutura do project

---

## lib/utils

* Funções genéricas reutilizáveis
* Sem regra de domínio

---

# State (source of truth)

```js
project = {
  title,
  settings,
  songs
}
```

* `.colyrics` deve espelhar exatamente esse formato
* `songs` é a única fonte de músicas

---

# Fluxo chordmd

```txt
raw chordmd → parser → data → renderer → HTML
```

Regras:

* parser não renderiza
* renderer não interpreta raw text
* UI não faz parsing direto

---

# Convenções

* JS/React em camelCase / PascalCase
* Código em inglês
* Funções puras sempre que possível
* Separação estrita de responsabilidades

---

# Regras para agente IA

* Nunca colocar parser/render dentro de componentes
* Reutilizar lib existente antes de criar novo código
* Manter compatibilidade com `.colyrics`
* Não misturar import/export com UI
* Priorizar extensões de código existente
