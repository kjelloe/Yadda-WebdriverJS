@custommockmodule=fakeWeatherInOslo
Egenskap: YR 7.4 Punktside nedbør sannsynlighet

Scenario: Som bruker av Beta yr punktside skal jeg se tydelig når det er meldt ingen nedbør for kortidsvarsel

Gitt at det ikke er meldt nedbør
når jeg går inn på punktsiden for et sted
og ser på varselet for dag 1-3
så skal jeg se teksten "trolig ingen nedbør"

Scenario: Som bruker av Beta yr punktside skal jeg se tydelig når det det er meldt ingen nedbør for langtidsvarsel

Gitt at det ikke er meldt nedbør og sannsynligheten for regn er mindre enn 10%
når jeg går inn på punktsiden for et sted
og ser på varselet for dag 4-10
så skal jeg se teksten "trolig ingen nedbør"

Scenario: Som bruker av Beta yr punktside skal jeg se tydelig når det er meldt lite nedbør for langtidsvarsel

Gitt at det ikke er meldt nedbør og sannsynligheten for regn er større enn 9%
når jeg går inn på punktsiden for et sted
og ser på varselet for dag 4-10
så skal jeg se sannsynligheten for at det skal regne

Scenario: Som bruker av beta yr punktside skal jeg se tydelig når det er meldt nedbør for langtidsvarsel

Gitt at det er mulig det kommer nedbør
når jeg går inn på punktsiden for et sted
og ser på varselet for dag 4-10
så skal jeg se sannsynligheten for at det skal regne
og jeg skal se forventet nedbørsmengde

