Feature: Exemplary set up for Yadda/Mocha/WebDriverJS 

Scenario: Find the weather for Oslo on YR-2014

    When I start yr2014 with Oslo in the search field
    Then I should see the weather forecast for Oslo

Scenario: As a user I want to see locations when I type into the search field, in order for me to find the location I'm looking for.

	When I search for "Berg"
	then I want to see "Berg" in search results
	and I want be able to select "Berg" from the search results
