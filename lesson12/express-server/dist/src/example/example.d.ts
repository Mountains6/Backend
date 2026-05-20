interface Cook {
    cookFood(foodName: string): {
        name: string;
        tasty: boolean;
    };
}
declare class Chef implements Cook {
    name: string;
    constructor(name: string);
    cookFood(foodName: string): {
        name: string;
        tasty: boolean;
    };
}
declare class JuniorCook implements Cook {
    name: string;
    constructor(name: string);
    cookFood(foodName: string): {
        name: string;
        tasty: boolean;
    };
}
declare const michelleChef: Chef;
declare class Butler {
    name: string;
    private chef;
    constructor(name: string, chef: Cook);
    bring(order: string): {
        drink: string;
        name: string;
        tasty: boolean;
    };
}
declare const freddyButler: Butler;
declare class Queen {
    name: string;
    private butler;
    constructor(name: string, butler: Butler);
    breakfast(order: string): {
        drink: string;
        name: string;
        tasty: boolean;
    };
}
declare const elisabeth: Queen;
//# sourceMappingURL=example.d.ts.map