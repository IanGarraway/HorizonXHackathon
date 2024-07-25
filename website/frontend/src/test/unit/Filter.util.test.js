import { describe, expect } from "vitest";

import data from "../data/llms.json";

import Filter from "../../util/Filter.util.js";

describe("Tests on the Filter Utility", () => {
    describe("Tests on the Filter.byName function", () => {
        test("test that Filter.ByName will filter by name", () => {
            //Arrange
            const testName = "Aya";
        
            //Act

            const result = Filter.byName(data, testName);

            //Assert

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe(data[0].name);
        })

        test("test that Filter.ByName will filter by name, capitilisation doesn't matter", () => {
            //Arrange
            const testName = "aya";
        
            //Act

            const result = Filter.byName(data, testName);

            //Assert

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe(data[0].name);
        })

        test("test that Filter.ByName will output multiple matches", () => {
            //Arrange
            const testName = "g";
        
            //Act

            const result = Filter.byName(data, testName);

            //Assert

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe(data[1].name);
            expect(result[1].name).toBe(data[3].name);
        })

        test("test that Filter.ByName will return nothing if there is no match", () => {
            //Arrange
            const testName = "nullResult";
        
            //Act

            const result = Filter.byName(data, testName);

            //Assert

            expect(result).toHaveLength(0);
        
        })
    })

    describe("Tests on the Filter.byOrganisation function", () => {
        test("test that Filter.ByOrganisation will filter by org", () => {
            //Arrange
            const testName = "Cohere";
        
            //Act

            const result = Filter.byOrganisation(data, testName);

            //Assert

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe(data[0].name);
        });

        test("test that Filter.ByOrganisation will filter by org, case dont matter", () => {
            //Arrange
            const testName = "cohere";
        
            //Act

            const result = Filter.byOrganisation(data, testName);

            //Assert

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe(data[0].name);
        });

        test("test that Filter.ByOrganisation will filter multiple results", () => {
            //Arrange
            const testName = "OpenAI";
        
            //Act

            const result = Filter.byOrganisation(data, testName);

            //Assert

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe(data[3].name);
            expect(result[1].name).toBe(data[4].name);
        });

        test("test that Filter.ByName will return nothing if there is no match", () => {
            //Arrange
            const testName = "nullResult";
        
            //Act

            const result = Filter.byOrganisation(data, testName);

            //Assert

            expect(result).toHaveLength(0);
        
        })
    })
})