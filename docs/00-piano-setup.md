# Piano di setup (temporaneo)

> Documento **temporaneo**: guida l'avvio del sistema. Quando i criteri di "a regime" in fondo sono soddisfatti si cancella, insieme ai riferimenti in `CLAUDE.md` e in `02-processo-operativo.md`.
> Aggiornato il 2026-11-02.

## Stato

| # | Cosa | Chi | Entro | Stato |
|---|---|---|---|---|
| 1 | Ramo `main` creato (i task partono da lì) | Claude | lun 2/11 | ✅ |
| 2 | Lingue: pagina solo inglese, profilo di Gilberto in italiano; Gilberto 1 post/settimana | Ettore → Claude | lun 2/11 | ✅ skill, script e documenti aggiornati |
| 3 | 5 task pianificati creati (tabella sotto) | Claude | lun 2/11 | ✅ |
| 4 | **Collegare il connettore MailMCP** a 4 task: Giro casella, Piano settimanale, Richiesta statistiche, Report mensile | Ettore (interfaccia claude.ai, task pianificati) | **mar 3/11 09:00** | ⏳ senza connettore i task si fermano senza fare nulla |
| 5 | Lettura degli allegati: script `scripts/mail_attachments.py` (provato su un caso simulato) | Claude | lun 2/11 | ✅ |
| 6 | Test allegato **GC-TEST-2** inviato; rispondere con OK + screenshot allegato con la graffetta, oppure con i numeri nel testo | Ettore | mer 4/11 | ⏳ GC-TEST-1: risposta letta, allegato non arrivato |
| 7 | Cartella `INBOX.LinkedIn` creata; la risposta a GC-TEST-1 è lì | Claude | lun 2/11 | ✅ |
| 8 | Casella condivisa con GTM: il giro LinkedIn tocca solo le mail `[gCASTEL LI]` o con tag di intake | Claude | lun 2/11 | ✅ |
| 9 | Su GitHub impostare `main` come ramo di default (Settings → General → Default branch) ed eliminare `claude/linkedin-agentic-communication-gnu4u7` | Ettore | ven 6/11 | ⏳ facoltativo, ma evita confusione |
| 10 | Cancellare dalla webmail la cartella vuota `INBOX.INBOX.LinkedIn` (creata per errore) | Ettore | quando capita | ⏳ |

## Task pianificati

| Task | Quando (ora italiana) | MailMCP | Prima esecuzione |
|---|---|---|---|
| `LI · Giro casella` | lun–ven 09:07, 13:07, 17:07 | serve | mar 3/11 09:07 |
| `LI · Ricerca fonti` | mer 14:43 | non serve | mer 4/11 14:43 |
| `LI · Piano settimanale` | gio 08:37 | serve | gio 5/11 08:37 |
| `LI · Richiesta statistiche` | ven 15:47 | serve | ven 6/11 15:47 (nessun post pubblicato: non deve mandare nulla) |
| `LI · Report mensile` | giorno 1, 10:07 | serve | mar 1/12 10:07 |

Scrittura, visual e revisione non hanno un task proprio: partono nel giro casella appena Ettore risponde al piano o a una bozza.

## Calendario dell'avvio

### Settimana 45 (2–6 novembre): verifica
- **Mar 3/11**: primi giri casella. Controllo: leggono solo le mail LinkedIn e non toccano quelle GTM.
- **Mer 4/11**: prima ricerca fonti → controllare `research/2026-11-04_fonti.md` (fonti primarie, citazioni esatte).
- **Gio 5/11**: primo piano, settimana 46 (slot: mar 10, mer 11 + Gilberto mer 11 alle 12:30, gio 12). Ettore risponde entro venerdì.
- **Gio 5 – lun 9/11**: bozze v1 (pagina in inglese, Gilberto in italiano), revisioni, OK. Ogni bozza va approvata entro il giorno prima dello slot.
- **Ven 6/11**: la richiesta statistiche non deve partire (nessun post pubblicato).

### Settimana 46 (9–13 novembre): primo ciclo vero
- **Mar 10, mer 11, gio 12/11**: Ettore pubblica alle 08:30 dalla mail "Pronto"; Gilberto mer 11 alle 12:30.
- **Gio 12/11**: piano della settimana 47.
- **Ven 13/11**: prima richiesta statistiche → screenshot o numeri → `analytics/metrics.csv`.

### Settimana 47 (16–20 novembre): secondo ciclo
- Ciclo completo senza interventi manuali.
- **Ven 20/11**: verifica finale (criteri sotto).

### Martedì 1/12
- Primo report mensile (novembre, dati parziali) con le prime proposte per il playbook.

## Registro

| Data | Evento | Esito |
|---|---|---|
| 2026-10-27 | GC-TEST-1 inviato | — |
| 2026-10-31 | Risposta di Ettore a GC-TEST-1 | testo letto; nessun allegato nella mail |
| 2026-11-02 | GC-TEST-2 inviato (allegato con graffetta o numeri nel testo) | in attesa |

## A regime quando

1. I 5 task sono stati eseguiti almeno una volta senza errori, con MailMCP dove serve.
2. Test allegato chiuso: screenshot letti, oppure si adottano i numeri nel testo come formato standard.
3. Due cicli settimanali completi (settimane 46 e 47): piano → bozze → OK → "Pronto" → pubblicazione → statistiche.
4. Nessuna mail GTM spostata o toccata dal sistema LinkedIn.

Allora: cancellare questo file, togliere le righe "Setup plan" in `CLAUDE.md` e "piano temporaneo" in `02-processo-operativo.md`, e fare commit `Remove setup plan`.
