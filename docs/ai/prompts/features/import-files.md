Implemente uma funcionalidade de abertura/importação de arquivos para um webapp React.

Contexto:
O aplicativo utiliza uma variável de estado chamada `project` para armazenar todas as informações do projeto atual.

Estrutura do estado:

```js id="z0t5xq"
const [project, setProject] = useState({
	title: config.editor.defaultProjectTitle,
	settings: {
		text: {
			fontFamily: config.preview.fontFamily,
			fontSize: config.preview.fontSize,
			lineHeight: config.preview.lineHeight,
		},
		page: {
			size: config.preview.size,
			orientation: config.preview.orientation,
			margin: config.preview.margin,
		}
	},
	songs: [
		{
			title: config.editor.defaultSongTitle,
			content: '',
		}
	],
});
```

Os arquivos `.colyrics` utilizam exatamente essa mesma estrutura JSON.

Requisitos da funcionalidade:

1. Criar uma função para seleção e abertura de arquivos utilizando `input type="file"`.

2. O sistema deve aceitar os seguintes formatos:

* `.colyrics`
* `.chordmd`
* `.md`

3. Comportamento para cada tipo de arquivo:

### Arquivos `.colyrics`

* Exibir um alerta de confirmação avisando que o projeto atual será substituído.
* Caso o usuário cancele a ação, interromper a importação.
* Ler o conteúdo do arquivo como texto.
* Fazer parse do JSON.
* Validar minimamente se o objeto possui:

  * propriedade `title`
  * propriedade `settings`
  * propriedade `songs`
  * `songs` deve ser um array
* Substituir completamente o estado `project` utilizando `setProject`.

### Arquivos `.chordmd` ou `.md`

* Ler o conteúdo do arquivo como texto.
* Normalizar quebras de linha.
* Caso o conteúdo inicie com a string `@chordmd`, removê-la.
* Remover linhas vazias do início do conteúdo após o processamento.
* Extrair o título markdown da primeira linha iniciada com `# `.
* O texto após `# ` deve ser utilizado como `title`.
* Caso não exista título markdown, utilizar o nome do arquivo sem extensão como fallback.
* O conteúdo completo processado (incluindo o título markdown) deve ser salvo na propriedade `content`.
* Criar um novo item dentro de `project.songs`.
* Adicionar as músicas sem sobrescrever as já existentes.

4. Requisitos adicionais:

* Utilizar APIs modernas do navegador (`file.text()` preferencialmente).
* Implementar tratamento de erros para:

  * JSON inválido
  * estrutura inválida
  * leitura de arquivo
  * formato não suportado
* Permitir múltiplos arquivos `.chordmd` e `.md` selecionados simultaneamente.
* Caso um arquivo `.colyrics` seja selecionado junto com outros arquivos:

  * priorizar o `.colyrics`
  * ignorar os demais arquivos
* Utilizar código limpo e modular.
* Separar a lógica em funções auxiliares reutilizáveis.
* Não utilizar bibliotecas externas para parsing.

5. Entregar:

* Função completa de importação.
* Funções auxiliares separadas.
* Exemplo de `input file` em React.
* Código pronto para integração.
* Comentários explicando as partes importantes do fluxo.