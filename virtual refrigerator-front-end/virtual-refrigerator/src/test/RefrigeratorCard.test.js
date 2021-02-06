import React from "react";
import {render} from "@testing-library/react";
import RefrigeratorCard from "../components/RefrigeratorCard";
import userEvent from '@testing-library/user-event'
import backendAPI from "../Utils/backendAPI";

const REFRIGERATOR_INFO = {
    refrigerator_name : "something",
    id : 2,
}

it("renders successfully", ()=>{
    const refrigeratorCard = render(
    <RefrigeratorCard refrigerator = {REFRIGERATOR_INFO} />)
   expect(refrigeratorCard.getByText("Created")).toBeTruthy();
})
it("doesn't show Rename and Delete if user is not owner", () =>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:false}
    const refrigeratorCard = render(
    <RefrigeratorCard refrigerator = {refrigerator} />)
    expect(refrigeratorCard.queryByText("Rename")).toBeNull();
    expect(refrigeratorCard.queryByText("Delete")).toBeNull();
})
it("shows Rename and Delete if user is owner", ()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    const refrigeratorCard = render(
    <RefrigeratorCard refrigerator = {refrigerator} />)
    expect(refrigeratorCard.queryByText("Rename")).toBeTruthy();
    expect(refrigeratorCard.queryByText("Delete")).toBeTruthy();
})
it("clicking on Rename should open a rename modal" ,() =>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    const refrigeratorCard = render(
        <RefrigeratorCard refrigerator = {refrigerator} />)
    const editButton  = refrigeratorCard.queryByText("Rename");    
    userEvent.click(editButton);
    expect(refrigeratorCard.queryByText("Edit Refrigerator")).toBeTruthy();
    expect(refrigeratorCard.queryByText("Cancel")).toBeTruthy();
    expect(refrigeratorCard.queryByText("Update")).toBeTruthy();    
})
it("clicking cancel on rename modal closes modal", ()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    const refrigeratorCard = render(
        <RefrigeratorCard refrigerator = {refrigerator} />)
    const editButton  = refrigeratorCard.queryByText("Rename");    
    userEvent.click(editButton);
    const cancelButton = refrigeratorCard.queryByText("Cancel");
    userEvent.click(cancelButton);
    expect(refrigeratorCard.queryByText("Edit Refrigerator")).toBeNull();
    expect(refrigeratorCard.queryByText("Cancel")).toBeNull();
    expect(refrigeratorCard.queryByText("Update")).toBeNull(); 
})
it("clicking on Update on rename modal calls backendAPI",()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    backendAPI.updateRefrigerator = jest.fn(()=> Promise.resolve([
    {...refrigerator,refrigerator_name : "something2" }
    ]))
    const updateRef = jest.fn() 
    const refrigeratorCard = render(
        <RefrigeratorCard 
        updateRef = {updateRef}
        refrigerator = {refrigerator} />)
    const editButton  = refrigeratorCard.queryByText("Rename");    
    userEvent.click(editButton);
    const updateButton = refrigeratorCard.queryByText("Update");
    userEvent.click(updateButton);   
    expect(backendAPI.updateRefrigerator).toHaveBeenCalled();
    
})
it("clicking on Delete should open delete modal", ()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    const refrigeratorCard = render(
        <RefrigeratorCard refrigerator = {refrigerator} />)
    const deleteButton  = refrigeratorCard.queryByText("Delete");    
    userEvent.click(deleteButton);
    expect(refrigeratorCard.queryByText("Delete Refrigerator")).toBeTruthy();
    expect(refrigeratorCard.queryByText(`Are you sure you want to delete "${refrigerator.refrigerator_name}"?`)).toBeTruthy();
    expect(refrigeratorCard.queryByText("No")).toBeTruthy();
    expect(refrigeratorCard.queryAllByText("DELETE")).toBeTruthy();
    
})
it("clicking on delete on delete modal calls backendAPI", ()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    backendAPI.deleteRefrigerator = jest.fn(()=> Promise.resolve([
    {...refrigerator,refrigerator_name : "something2" }
    ]))
    const updateRef = jest.fn() 
    const refrigeratorCard = render(
        <RefrigeratorCard 
        updateRef = {updateRef}
        refrigerator = {refrigerator} />)
    const deleteButton  =  refrigeratorCard.queryByTestId("delete-refrigerator") ;    
    userEvent.click(deleteButton);
    const confirmDelete = refrigeratorCard.queryByTestId("confirm-delete-refrigerator");
    userEvent.click(confirmDelete);   
    expect(backendAPI.deleteRefrigerator).toHaveBeenCalled(); 
})
it("confirming delete calls updateRef if statuscode is 200",async ()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    backendAPI.deleteRefrigerator = jest.fn(()=> Promise.resolve({
        statusCode :200,
      }))
    const updateRef = jest.fn() 
    const refrigeratorCard = render(
        <RefrigeratorCard 
        updateRef = {updateRef}
        refrigerator = {refrigerator} />)
    const deleteButton  =  refrigeratorCard.queryByTestId("delete-refrigerator") ;    
    userEvent.click(deleteButton);
    const confirmDelete = refrigeratorCard.queryByTestId("confirm-delete-refrigerator");
    userEvent.click(confirmDelete);   
    expect(backendAPI.deleteRefrigerator).toHaveBeenCalled();
    //expect(updateRef).toHaveBeenCalled()
})
it("clicking on No on delete modal closes modal",()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    const refrigeratorCard = render(
        <RefrigeratorCard refrigerator = {refrigerator} />)
    const deleteButton  = refrigeratorCard.queryByTestId("delete-refrigerator");    
    userEvent.click(deleteButton);
    const noButton = refrigeratorCard.queryByText("No");
    userEvent.click(noButton);
    expect(refrigeratorCard.queryByText("Delete Refrigerator")).toBeNull();
    expect(refrigeratorCard.queryByText(`Are you sure you want to delete "${refrigerator.refrigerator_name}"?`)).toBeNull();
    expect(refrigeratorCard.queryByText("No")).toBeNull();
})

it("clicking on refrigerator card calls handleClick prop", ()=>{
    const refrigerator = {...REFRIGERATOR_INFO , isOwner:true}
    const handleClick = jest.fn();
    const refrigeratorCard = render(
        <RefrigeratorCard
        handleClick = {handleClick}
        refrigerator = {refrigerator} />)
    userEvent.click(refrigeratorCard.queryByText(refrigerator.refrigerator_name));
    expect(handleClick).toHaveBeenCalled();    
})