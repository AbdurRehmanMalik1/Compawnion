export class Pet {
    name: string;
    description: string;
    imageUrl: string;

    constructor(name: string, description: string, imageUrl: string) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}

export interface PetInterface{
    name: string;
    description: string;
    imageUrl: string;
}