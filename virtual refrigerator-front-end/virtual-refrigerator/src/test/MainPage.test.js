import React from "react";
import {render,fireEvent} from "@testing-library/react";
import MainPage from '../components/MainPage'

it("renders correctly", ()=>{
    
    const {queryByTestId} = render(<MainPage />);
    expect(queryByTestId("addRefrigeratorButton")).toBeTruthy();

    
})
describe ("add refrigerator modal" , ()=>{
    it("should not exist on load" , ()=>{
        const {queryByTestId} = render(<MainPage />);
        expect(queryByTestId("addRefrigeratorModal")).toBeNull();
        }
    )
    it("should exist when you click on add refrigerator button" , ()=>{
        const {queryByTestId} = render(<MainPage />);
        const addRefrigeratorButton = queryByTestId("addRefrigeratorButton");
        fireEvent.click(addRefrigeratorButton);
        expect(queryByTestId("addRefrigeratorModal")).toBeTruthy();
        }
    )
})
// it("should show a card of the refrigerator" , () =>{
//     backendAPI.getAllRefrigetors = jest.fn(()=> Promise.resolve([{
//         statusCode :200,
//         message : {id:1,refrigerator_name: "something"}
//     }]))
//     const mainPage = render(<MainPage />)
//     mainPage.getByText("something").toBeTruthy();

// })
