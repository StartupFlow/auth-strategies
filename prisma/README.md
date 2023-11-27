### Why SQLite ?
- SQLite is a self-contained, serverless, zero-configuration, transactional SQL database engine.
- Zero latency :  SQLite is a single file on disk
- One less service to maintain
- Multi-instance replication thanks to https://fly.io/docs/litefs/
- Database size : SQLite is capable of handling databases that are an **Exabyte** in size (that's one **million Terabytes**, or one **billion Gigabytes** 🤯).
  https://sqlite.org/hctree/doc/hctree/doc/hctree/index.html


### You can view and explore your data here
```bash
npx prisma studio
```

You cannot read the *data.db* file directly.
You can use **sqlite3** to read the data.db file.

```bash
sudo apt-get install sqlite3 && sqlite3 --version
```

```bash
sqlite3 prisma/data.db .dump > prisma/dev.sql
```
