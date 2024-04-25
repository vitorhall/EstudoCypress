import assert from "assert";
class RegisterForm {
  elements = {
    titleInput: () => cy.get("#title"),
    titleFeedback: () => cy.get("#titleFeedback"),
    imageUrlInput: () => cy.get("#imageUrl"),
    imageUrlFeedback: () => cy.get("#urlFeedback"),
    submitBtn: () => cy.get("#btnSubmit"),
  };
  typeTitle(text) {
    if (!text) return;
    this.elements.titleInput().type(text);
  }
  typeUrl(text) {
    if (!text) return;
    this.elements.imageUrlInput().type(text);
  }
  clickSubmit() {
    this.elements.submitBtn().click();
  }
  pressEnter() {
    cy.focused().type("{enter}");
  }
}
const registerForm = new RegisterForm();
const color = {
  errors: "rgb(220, 53, 69)",
  success: "",
};

describe("Image Registration", () => {
  describe("Submitting an image with invalid inputs", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });
    const input = {
      title: "",
      url: "",
    };

    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });

    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });
    it(`Then I enter "${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    });
    it(`Then I click the submit button`, () => {
      registerForm.clickSubmit();
    });
    it(`Then I should see "Please type a title for the image" message above the title field`, () => {
      registerForm.elements
        .titleFeedback()
        .should("contains.text", "Please type a title for the image");
      // registerForm.elements.titleFeedback().should((elemnt) => {
      //   debugger;
      // });
    });
    it(`And I should see "Please type a valid URL" message above the imageUrl field`, () => {
      registerForm.elements
        .imageUrlFeedback()
        .should("contains.text", "Please type a valid URL");
    });
    it(`And I should see an exclamation icon in the title and URL fields`, () => {
      registerForm.elements.titleInput().should(([element]) => {
        const styles = window.getComputedStyle(element);
        const border = styles.getPropertyValue("border-right-color");
        assert.strictEqual(border, color.errors);
      });
    });
  });
  describe("Submitting an image with valid inputs using enter key", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });
    const input = {
      title: "Alien BR",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };
    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });
    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });
    it(`Then I enter ""${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    });
    it("Then I can hit enter to submit the form", () => {
      registerForm.pressEnter();
      cy.wait(100);
    });
    it("And the list of registered images should be updated with the new item", () => {
      cy.get(".card-img").should((element) => {
        const lastElement = element[element.length - 1];
        const src = lastElement.getAttribute("src");
        assert.strictEqual(src, input.url);
      });
    });
    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleFeedback().should("contains.text", "");
      registerForm.elements.imageUrlFeedback().should("contains.text", "");
    });
  });
  describe("Submitting an image and updating the list", () => {
    after(() => {
      cy.clearAllLocalStorage();
    });
    const input = {
      title: "Alien BR",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };
    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });
    it(`When I enter "${input.title}" in the title field`, () => {
      registerForm.typeTitle(input.title);
    });
    it(`Then I enter ""${input.url}" in the URL field`, () => {
      registerForm.typeUrl(input.url);
    });
    it("Then I can hit enter to submit the form", () => {
      registerForm.clickSubmit();
      cy.wait(100);
    });
    it("And the list of registered images should be updated with the new item", () => {
      cy.get(".card-img").should((element) => {
        const lastElement = element[element.length - 1];
        const src = lastElement.getAttribute("src");
        assert.strictEqual(src, input.url);
      });
    });
    it("Then The inputs should be cleared", () => {
      registerForm.elements.titleFeedback().should("contains.text", "");
      registerForm.elements.imageUrlFeedback().should("contains.text", "");
    });
  });
  describe("Refreshing the page after submitting an image clicking in the submit button", () => {
    const input = {
      title: "Alien BR",
      url: "https://cdn.mos.cms.futurecdn.net/eM9EvWyDxXcnQTTyH8c8p5-1200-80.jpg",
    };
    it("Given I am on the image registration page", () => {
      cy.visit("/");
    });
    it("Then I have submitted an image by clicking the submit button", () => {
      registerForm.typeTitle(input.title);
      registerForm.typeUrl(input.url);
      registerForm.clickSubmit();
      cy.wait(100);
    });
    it("When I refresh the page", () => {
      cy.reload();
    });
    it("Then I should still see the submitted image in the list of registered images", () => {
      cy.get(".card-img").should((element) => {
        const lastElement = element[element.length - 1];
        const src = lastElement.getAttribute("src");
        assert.strictEqual(src, input.url);
      });
    });
  });
});
