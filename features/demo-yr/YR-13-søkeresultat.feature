Feature: YR 1.3 Søkeresultatsiden

Scenario: Gitt at det finnes resultater, ser jeg en vektet resultatliste på maks 20 treff med stedsnavn, metadata kategori, region, region, land

	Når jeg søker på Stockholm og får opp søkeresultatsiden
	så viser siden en liste med maksimalt 20 mulige stedsnavn med tilhørende navn, kategori region og land
	og når jeg trykker på av stedene i listen kommer jeg til punktsiden til stedet
	