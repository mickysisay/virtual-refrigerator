import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import backendAPI from "../Utils/backendAPI";
import AddRefrigeratorItem from '../components/AddRefrigeratorItem'

const ITEM_INFO = {
    item_name : "something",
     
}
const REFRIGERATOR_ID = 2;
it("renders successfully",()=>{
    const addRefrigeratorItemModal = render(<AddRefrigeratorItem
        itemInfo = {{}} refrigerator_id = {REFRIGERATOR_ID} />)
    expect(addRefrigeratorItemModal.queryByText("Add Item")).toBeTruthy();
})
it("clicking on Cancel calls onClose props", ()=>{
    const onClose = jest.fn();
    const addRefrigeratorItemModal = render(<AddRefrigeratorItem
        onClose = {onClose}
        itemInfo = {{}} refrigerator_id = {REFRIGERATOR_ID} />)
    userEvent.click(addRefrigeratorItemModal.queryByText("Cancel"));
    expect(onClose).toHaveBeenCalled();    
})
it("only allows quantity to be a number between 1 and 100",()=>{
    const onClose = jest.fn();
    const addRefrigeratorItemModal = render(<AddRefrigeratorItem
        onClose = {onClose}
        itemInfo = {{}} refrigerator_id = {REFRIGERATOR_ID} />)
    const quantityInput = addRefrigeratorItemModal.queryByTestId("Quantity-item-add");
    userEvent.type(quantityInput,"hello");
    expect(addRefrigeratorItemModal.queryByTestId("Quantity-item-add").value).toBe("1");
    userEvent.type(quantityInput,"2")
    expect(addRefrigeratorItemModal.queryByTestId("Quantity-item-add").value).toBe("12")    
})
