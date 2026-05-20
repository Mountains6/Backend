// Cоздать повара (класс и объект). Повар должен уметь готовить
// На кухне может быть младший повар и он тоже должен уметь готовить

interface Cook {
  cookFood(foodName: string): { name: string; tasty: boolean };
}

class Chef implements Cook {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  cookFood(foodName: string) {
    return { name: foodName, tasty: true };
  }
}

class JuniorCook implements Cook {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  cookFood(foodName: string) {
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
  constructor(
    public name: string,
    private chef: Cook, // формирование связи между дворецким и поваром (через интерфейс, так как
    // это гибко и нет зависимости от конкретного класса)
  ) {
    this.name = name;
    this.chef = chef;
  }

  bring(order: string) {
    const food = this.chef.cookFood(order);
    return { ...food, drink: "orange juice" };
  }
}

const freddyButler = new Butler("Freddy", michelleChef);
// console.log(freddyButler.bring("Eggs"));

class Queen {
  constructor(
    public name: string,
    private butler: Butler,
  ) {
    this.name = name;
    this.butler = butler;
  }

  breakfast(order: string) {
    return this.butler.bring(order);
  }
}

const elisabeth = new Queen("Elisabeth", freddyButler);
console.log(elisabeth.breakfast("Toasts"));
