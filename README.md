# Biblioteca de Receitas Regionais

App estático 100% local. Sem requisições externas. Publicável no GitHub Pages, Firebase Hosting ou Oracle OCI.

## Rodar local
```bash
python -m http.server 5500
# http://localhost:5500
```

## Diagramas (Mermaid)
### Caso de Uso
```mermaid
usecase
  actor Usuario
  Usuario --> (Cadastrar receita)
  Usuario --> (Listar receitas)
  Usuario --> (Editar/Excluir)
  Usuario --> (Buscar/Filtrar)
```

### Classes
```mermaid
classDiagram
class Receita{
  +id: string
  +nome: string
  +regiao: string
  +categoria: string
  +ingredientes: string[]
  +preparo: string
}
```

### Sequência: salvar receita
```mermaid
sequenceDiagram
  actor U as Usuário
  participant F as Form
  participant A as app.js
  participant LS as localStorage
  U->>F: Preenche e envia
  F->>A: onSubmit(dados)
  A->>LS: getItem/setItem(KEY)
  A->>U: Atualiza lista e fecha modal
```
