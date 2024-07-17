import { describe, expect } from "vitest";

import Find from "../../util/Find.util.js";

import data from "../data/llms.json";

describe("Tests of the Find Utility", () => {
    test("That the indexByName will find an example llm and return it's location", () => {
        //Arrange
        const testName = data[0].name;
        
        //Act
        const result = Find.indexByName(data, testName)

        //Assert
        expect(result).toEqual(0);

    })

    test("That the indexByName will find an example llm and return it's location different item", () => {
        //Arrange
        const testName = data[1].name;
        
        //Act
        const result = Find.indexByName(data, testName)

        //Assert
        expect(result).toEqual(1);

    })

    test("That the indexByName will return -1 if the item isn't in the list", () => {
        //Arrange
        const testName = "MockLLM";
        
        //Act
        const result = Find.indexByName(data, testName)

        //Assert
        expect(result).toEqual(-1);

    })
})