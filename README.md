Brukerhistorie-testing
---------------------

**Kjøring mot public url**

Start scriptet:

```
powershell -File "C:\git\devops\Testing.Integration\BDD-yadda-client.ps1" -rootPath:"C:\git\beta.yr.no" -testUrl:"http://url-der-yr-er-public-tilgjengelig" -testGroup:"brukerhistorier"
```

**Kjøring mot localhost**

Gjør følgende for å kjøre brukerhistorie-crossbrowsertesting på browserstack mot en website på en port på localhost:

1.	Først, logg inn på BrowserStack gå til https://www.browserstack.com/automate
2.	Trykk + ved siden av ***«Username and Access Keys»***
3.	Kopier ut «Access key» hash’en som står der ,  som ser slik ut: ***XydaRq3Q7h8idU51YQbz***
4.	Last ned browserstack sin localhost-client(proxy) for ditt os på https://www.browserstack.com/local-testing#command-line og legg den i en passende katalog.
5.	Åpne konfigurasjonfilen for Yadda-BDD på GIT\beta.yr.no\test\bdd-yadda\config.js og
Legg inn en gyldig bruker i browserstack.user og nøkkelen fra punkt 3 ala ***browserstack.key = ‘XydaRq3Q7h8idU51YQbz’***.
Sjekk også at det står browserstack.local = true for localhost-testing.
6.	Start et console/command-shell og gå til katalogen i punkt 4, hvor du starter browserstack-klienten med nøkkelen fra punkt 3 ala: 
***BrowserStackLocal.exe XydaRq3Q7h8idU51YQbz -onlyAutomate***
7.	Start YR2014 node/webserver på en lokal url, f.eks localhost:3000 (Spør Bård eller Pope for latest start-oppsett)
8.	Se over alle konfigurerte browserprofiles i konfigurasjonen - navnene er definert som listEnvironments['NNNN'] i ***GIT\beta.yr.no\test\bdd-yadda\config.js***
9.	Så er det bare å starte Yadda-BDD med en av de mange konfigurerte profilene, for eksempel «iphone» eller et komma-separert sett av profiler som «win8-opera,mac-chrome,android-galaxy» mot «localhost:3000» på dette viset: ```powershell -File "\git\devops\Testing.Integration\BDD-yadda-client.ps1" -rootPath:"\git\beta.yr.no" -testUrl:"http://localhost:3000" -testGroup
:"brukerhistorier" -browserProfiles:"win8-ie11,win8-opera,mac-chrome,iphone5,ipad,android-galaxy"```

PS: Hvis testen ikke ser ut til å starte, sjekke i listen over kjørte automatiserte tester på venstre side av https://www.browserstack.com/automate Der står det også hvilken device/os og brower-versjon den da har tolket konfigurasjonen som.

Redigert på http://dillinger.io/
