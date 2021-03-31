describe ("My first test", function () {
  it ("Ciao", function () {
    
    // cy.visit ("http://localhost:4200/");
    cy.visit ("https://board-games-5261e.web.app");
    cy.contains ("Sign in").click ();
    cy.contains ("Sign in as guest").click ();
    cy.get (".bg-app[href=\"/barony\"]").click ();
    
    cy.contains ("New game").click ();
    cy.get (".b-game-name-field").type ("Test 1");
    cy.contains ("Local").click ();
    
    cy.get (".bg-archeo-game-create").click ();
    
    cy.get (".b-new-players-type-button.is-yellow").click ();
    cy.get (".b-new-players-type-button.is-red").click ();
    
    cy.contains ("Start game").click ();
    
    cy.contains ("Setup");

    cy.go ("back");

    cy.contains ("Test 1").parents ("tr").within (() => {
      cy.contains ("delete").click ();
    });

    cy.contains ("account_circle").click ();
    cy.contains ("Delete account").click ();

  })
})