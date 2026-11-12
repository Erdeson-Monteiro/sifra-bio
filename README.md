# Sifra Bio

Protótipo demonstrável do agente de vendas para extrativistas e agricultores familiares.

## Rodar

```bash
npm install
npm run dev
# http://localhost:3000
```

Ou com Docker:

```bash
docker compose up --build
```

O banco SQLite fica em `data/sifra.db`. Use **Reiniciar demonstração** para voltar ao seed e gerar a venda da Maria como `BAC-0042`. `URL_PUBLICA` define o endereço usado nos QR codes.

## Easypanel

Crie um serviço App a partir do GitHub, selecione o Dockerfile, target port `3000`, e configure `PORT=3000`, `DB_PATH=/app/data/sifra.db` e `URL_PUBLICA=https://seu-dominio`. Monte um volume em `/app/data` e habilite Auto Deploy.
