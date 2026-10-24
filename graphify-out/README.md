# Navegação do conhecimento Petyra

Comece por [wiki/index.md](wiki/index.md). O [grafo JSON](graph.json) mantém `source_file` e `source_location` relativos ao repositório; a [visualização HTML](graph.html) permite explorar os mesmos vínculos e o [relatório](GRAPH_REPORT.md) resume comunidades e limites.

## Limites da evidência

- Nós documentais identificam requisitos, regras e planos. Eles não comprovam implementação.
- Nós de código identificam arquivos e símbolos extraídos estaticamente. Eles não comprovam comportamento funcional ou segurança.
- Nós SQL identificam declarações de tabelas, tipos, funções, políticas e referências. Não confirmam que uma migração foi aplicada.
- `EXTRACTED` indica relação explícita no arquivo citado. `INFERRED` indica associação interpretada com confiança registrada.
- Contagens de tokens não estão disponíveis neste ambiente. Isso não significa custo zero. Nenhuma chamada externa a LLM ou credencial foi usada para produzir o mapa.

## Consultar e atualizar

No Codex com a skill graphify instalada, consulte `/graphify query "checkout split produtos serviços"` ou `/graphify query "autenticação permissões multi-tenant"`. Para seguir uma dependência específica, acrescente `--dfs`.

Depois de alterar fontes, rode `/graphify . --update --wiki` a partir da raiz do repositório. A atualização de documentos exige nova extração semântica; uma atualização apenas de AST não transforma planos em funções implementadas. Compare as localizações com as fontes e reavalie a implementação por testes separados.

O diretório contém saídas geradas. Arquivos `.graphify_*` são intermediários locais e não devem transportar caminhos pessoais para o GitHub.
