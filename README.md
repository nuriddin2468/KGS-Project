Чтобы начать:

создайте .env 
```
POSTGRES_DB=fasti
POSTGRES_USER=postgres
POSTGRES_HOST=postgres-db
POSTGRES_PASSWORD=mySecretPassword

CLIENT_ID=
CLIENT_SECRET=

```

- docker compose up
и все, заходим по ссылочке: http://localhost:3000 и радуемся :)

Endpoints:
GET: / -> чтобы сфетчить данные по tradable и noNTradable минимальные суммы

GET: /buy -> чтобы купить (просто отнимает у пользователя по 100) 

Было использовано:
BULL -> для очередей (чтобы каждые 5 минут фетчить данные из skinport)
REDIS -> чтобы хранить данные в кэше
PG -> для пользователя
Fastify -> для бэка