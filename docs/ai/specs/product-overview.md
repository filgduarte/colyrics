# Visão Geral do Produto — Colyrics

## O que é o Colyrics

Colyrics é um editor web baseado em arquivos `.chordmd`, projetado para escrever, organizar e renderizar cifras musicais.

Ele suporta:

* edição de texto com acordes
* visualização renderizada em tempo real
* organização de múltiplas músicas em projetos
* importação e exportação de projetos e arquivos individuais

---

## Conceito Principal

O sistema é centrado em dois tipos de arquivos:

### 1. `.chordmd` (arquivo de música)

* Documento individual de música
* Contém letras com marcação de acordes em formato semelhante a markdown
* Pode ser importado individualmente para um projeto
* É renderizado em uma visualização formatada

**Observação importante:**
Esse formato também pode existir como um arquivo `.md`, desde que contenha a flag `@chordmd` no início do conteúdo.

---

### 2. `.colyrics` (arquivo de projeto)

* Snapshot completo do projeto
* Contém:

  * configurações do projeto
  * múltiplas músicas
  * ordem das músicas
* Usado para salvar e restaurar o estado completo do workspace

---

## Funcionalidades principais

### Editor

* Escrita e edição de conteúdo `.chordmd`
* Sintaxe tipo markdown com marcação de acordes
* Suporte a múltiplas músicas dentro de um projeto

### Renderizador (Preview)

* Converte chordmd em HTML formatado
* Alinha acordes acima das letras
* Fornece layout pronto para impressão

### Sistema de projeto

* Múltiplas músicas por projeto
* Ordenação de músicas
* Configurações globais (fonte, layout de página, espaçamento)

### Importação / Exportação

* Importa `.chordmd`, `.md`, `.colyrics`
* Exporta `.chordmd` (música individual)
* Exporta `.colyrics` (projeto completo)
* Exporta PDF (layout de impressão)

---

## Modelo de dados

Fonte única de verdade:

```js
project = {
  title,
  settings,
  songs
}
```

---

## Princípio de renderização

* `.chordmd` bruto → parser → output estruturado → renderer → HTML
* O parser nunca gera UI
* O renderer nunca interpreta texto bruto
* A UI não implementa lógica de parsing diretamente

---

## Limites do projeto

O Colyrics NÃO é:

* uma DAW (estação de produção musical)
* um player de áudio
* um editor MIDI

Ele É:

* um editor de documentos de cifras e letras
* uma ferramenta de renderização e formatação musical
* um sistema de organização de músicas baseado em projetos

---

## Objetivos de design

* estrutura previsível
* importação/exportação simples
* renderização determinística
* separação clara entre parsing e UI
* extensibilidade para novos formatos
