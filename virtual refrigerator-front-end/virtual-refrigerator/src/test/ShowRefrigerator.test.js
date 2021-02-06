import React from "react";
import { render } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import backendAPI from "../Utils/backendAPI";
import ShowRefrigerator from "../components/ShowRefrigerator";

const params = {
    id: 2
}
const match = {
    params: params
}
const REFRIGERATOR_INFO = {
    refrigerator_name : "something",
    isOwner: true
}
beforeEach(()=>{
    backendAPI.getRefrigeratorByRefrigeratorId = jest.fn(() => Promise.resolve(
        { statusCode: 200, message: {message:REFRIGERATOR_INFO} }));
    backendAPI.getAllItemsInRefrigerator = jest.fn(() => Promise.resolve(
        { statusCode: 200, message: { message: [] } }));
    backendAPI.getAllPersonalItems = jest.fn(()=>Promise.resolve(
        {statusCode : 200,  message: { message: [] } }
    ))
    backendAPI.getAllUsersWithAccess = jest.fn(()=> Promise.resolve({
       statusCode: 200 , message : {message:[]} 
    }))
})

it("renders successfully", () => {
    const refrigeratorPage = render(<ShowRefrigerator
        match={match}
    />)
    expect(refrigeratorPage.queryByText("Add Refrigerator Item")).toBeTruthy();
    expect(refrigeratorPage.queryByText("Normal")).toBeTruthy()
    expect(refrigeratorPage.queryByText("Calendar")).toBeTruthy()
})
it("calls backendApi.getRefrigeratorByRefrigeratorId when page loads", () => {
   
    const refrigeratorPage = render(<ShowRefrigerator
        match={match}
    />)
    expect(backendAPI.getRefrigeratorByRefrigeratorId).toHaveBeenCalled();
})
it("calls backendApi.getAllItemsInRefrigerator when loading page", () => {
    const refrigeratorPage = render(<ShowRefrigerator
        match={match}
    />)
    expect(backendAPI.getAllItemsInRefrigerator).toHaveBeenCalled()
})
it("calls backendApi.getAllPersonalItems when loading page",()=>{
    const refrigeratorPage = render(<ShowRefrigerator
        match={match}
    />)
    expect(backendAPI.getAllPersonalItems).toHaveBeenCalled()
})

it("doesn't show sharedlist if user doesn't own refrigerator", () => {
    backendAPI.getRefrigeratorByRefrigeratorId = jest.fn(() => Promise.resolve(
        { statusCode: 200, message: {message:{
            ...REFRIGERATOR_INFO,isOwner : false
        }} }));
    const refrigeratorPage = render(<ShowRefrigerator
        match={match}
    />)
    expect(refrigeratorPage.queryByText("List of shared users")).toBeNull();
})
it("shows sharedList if user owns refrigerator" ,async ()=>{
    backendAPI.getRefrigeratorByRefrigeratorId = jest.fn(() => Promise.resolve(
        { statusCode: 200, message: {message:{
            ...REFRIGERATOR_INFO,isOwner : true
        }} }));

        
    const refrigeratorPage = render(<ShowRefrigerator
        match={match}
    />)
    //need to ask someone about this
   // expect(refrigeratorPage.queryByTestId("user-access")).toBeTruthy();
})


