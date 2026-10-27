# Archivio dei post approvati

Solo post approvati da Ettore (o da Gilberto per il suo profilo). Una cartella per post:

```
content/<anno>/<aaaa-mm-gg>_<ID>_<slug>/
├── post.md      # frontmatter (canale, tipo, pilastro, fonti, approvazione) + testo IT/EN + primo commento
├── post.json    # dati completi del post approvato
├── visual.png   # immagine o copertina del carosello
├── visual.pdf   # carosello (se presente)
└── visual.json  # specifica per rigenerare il visual
```

Creato da `scripts/archive_post.py`, chiamato da `linkedin-inbox` dopo l'OK.
