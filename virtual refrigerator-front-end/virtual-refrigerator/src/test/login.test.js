import React from "react";
import {render,fireEvent} from "@testing-library/react";
import Login from "../components/Login";


it("renders correctly", ()=>{
    
    const {queryByTestId} = render(<Login />);
    expect(queryByTestId("username")).toBeTruthy();
    expect(queryByTestId("password")).toBeTruthy();
    expect(queryByTestId("loginButton")).toBeTruthy();
    
})
describe ("input values" , ()=>{
    it("updates on change" , ()=>{
        const {queryByTestId} = render(<Login />);
        const arrayInputs = ["username","password"];
        for(let i=0;i<arrayInputs.length;i++){
            const input = queryByTestId(arrayInputs[i]);
            fireEvent.change(input , {target:{value:"test"}});
            expect(input.value).toBe("test");
        }
    })
})

describe("clicking on login", ()=>{
    //const arrayInputs = ["username","password"];
    it("have a username error if username and password are empty",()=>{
        const {queryByTestId} = render(<Login />);
        const loginButton = queryByTestId("loginButton");
        fireEvent.click(loginButton);
        expect(queryByTestId("usernameError")).toHaveTextContent("username can't be empty");
    });
    it("have a password is empty error if password is empty",()=>{
        const {queryByTestId} = render(<Login />);
        fireEvent.change(queryByTestId("username") , {target:{value:"testeee"}});
        const loginButton = queryByTestId("loginButton");
        fireEvent.click(loginButton);
        expect(queryByTestId("passwordError")).toHaveTextContent("password can't be empty");
    });
})

describe("blur input check", ()=>{
    it("have a username error if username is too short",()=>{
        const {queryByTestId} = render(<Login />);
        fireEvent.change(queryByTestId("username") , {target:{value:"test"}});
        fireEvent.blur(queryByTestId("username"));
        expect(queryByTestId("usernameError")).toHaveTextContent("Username too short");
    });
    it("have a password error if password is too short",()=>{
        const {queryByTestId} = render(<Login />);
        fireEvent.change(queryByTestId("password") , {target:{value:"test"}});
        fireEvent.blur(queryByTestId("password"));
        expect(queryByTestId("passwordError")).toHaveTextContent("Password is too short");
    });
})