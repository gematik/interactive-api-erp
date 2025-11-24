/// <reference types="Cypress" />

/*
Copyright (Change Date see Readme), gematik GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*******

For additional notes and disclaimer from gematik and in case of changes by gematik find details in the "Readme" file.
*/

context('Form', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('should change input values', () => {
    const nameText = 'John Deer';
    const descText = 'This is a desc test';
    const recurrenceIntervalText = 10;
    const dateText = '2001-03-15';

    cy.get('[id="#/properties/name-input"]').clear().type(nameText);
    cy.get('[id="#/properties/description-input"]').clear().type(descText);
    cy.get('[id="#/properties/done-input"]').uncheck();
    cy.get('[id="#/properties/recurrence"] > div').click();
    cy.get('[data-value="Monthly"]').click();
    cy.get('[id="#/properties/recurrence_interval-input"]').clear().type(recurrenceIntervalText);
    cy.get('[id="#/properties/due_date-input"]').clear().type(dateText);
    cy.get('[id="#/properties/rating"] span:last').click();
    cy.get('[id="boundData"]').invoke('text').then((content => {
      const data = JSON.parse(content);

      expect(data.name).to.equal(nameText);
      cy.get('[id="#/properties/name"] p').should('be.empty')

      cy.get('[id="#/properties/recurrence_interval"]').should('exist')

      expect(data.description).to.equal(descText);
      expect(data.done).to.equal(false);
      expect(data.recurrence).to.equal('Monthly');
      expect(data.recurrence_interval).to.equal(recurrenceIntervalText);
      expect(data.due_date).to.equal(dateText);
      expect(data.rating).to.equal(5);
    }));
  });

  it('should show errors', () => {
    cy.get('[id="#/properties/name-input"]').clear();

    cy.get('[id="#/properties/name"] p:first-child').should('not.be.empty');

    cy.get('[id="#/properties/due_date-input"]').clear().type('351');

    cy.get('[id="#/properties/due_date"] p:first-child').should('not.be.empty');

    cy.get('[id="#/properties/recurrence"] > div').click();
    cy.get('[data-value="Never"]').click();

    cy.get('[id="#/properties/recurrence_interval"]').should('not.exist')

    cy.get('[id="boundData"]').invoke('text').then((content => {
      const data = JSON.parse(content);

      expect(data.due_date).to.equal('Invalid date');
    }));
  });
})
