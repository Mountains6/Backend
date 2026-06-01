"use strict";
// Cоздать повара (класс и объект). Повар должен уметь готовить
// На кухне может быть младший повар и он тоже должен уметь готовить
class Chef {
    constructor(name) {
        this.name = name;
    }
    cookFood(foodName) {
        return { name: foodName, tasty: true };
    }
}
class JuniorCook {
    constructor(name) {
        this.name = name;
    }
    cookFood(foodName) {
        return { name: foodName, tasty: false };
    }
}
const michelleChef = new Chef("Michelle");
// console.log(michelleChef.name);
// console.log(michelleChef.cookFood("eggs"));
// {
// name: "eggs"
// tasty: true
// }
class Butler {
    constructor(name, chef) {
        this.name = name;
        this.chef = chef;
        this.name = name;
        this.chef = chef;
    }
    bring(order) {
        const food = this.chef.cookFood(order);
        return { ...food, drink: "orange juice" };
    }
}
const freddyButler = new Butler("Freddy", michelleChef);
// console.log(freddyButler.bring("Eggs"));
class Queen {
    constructor(name, butler) {
        this.name = name;
        this.butler = butler;
        this.name = name;
        this.butler = butler;
    }
    breakfast(order) {
        return this.butler.bring(order);
    }
}
const elisabeth = new Queen("Elisabeth", freddyButler);
console.log(elisabeth.breakfast("Toasts"));
//# sourceMappingURL=example.js.map