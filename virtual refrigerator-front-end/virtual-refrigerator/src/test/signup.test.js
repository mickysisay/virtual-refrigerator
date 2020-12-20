import React from "react";
import {render,fireEvent} from "@testing-library/react";
import Signup from "../components/Signup"

it("renders correctly", ()=>{
    const {queryByTestId} = render(<Signup />);

    expect(queryByTestId("username")).toBeTruthy();
    expect(queryByTestId("password")).toBeTruthy();
    expect(queryByTestId("email")).toBeTruthy();
    expect(queryByTestId("confirmPassword")).toBeTruthy();
    expect(queryByTestId("signupButton")).toBeTruthy(); 
})

describe ("input values" , ()=>{
    it("updates on change" , ()=>{
        const {queryByTestId} = render(<Signup />);
        const arrayInputs = ["username","password","email","confirmPassword","signupButton"];
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
        const {queryByTestId} = render(<Signup />);
        const signupButton = queryByTestId("signupButton");
        fireEvent.click(signupButton);
        expect(queryByTestId("usernameError")).toHaveTextContent("username can't be empty");
    });
    it("have a password is empty error if password is empty",()=>{
        const {queryByTestId} = render(<Signup />);
        fireEvent.change(queryByTestId("username") , {target:{value:"testeee"}});
        const signupButton = queryByTestId("signupButton");
        fireEvent.click(signupButton);
        expect(queryByTestId("passwordError")).toHaveTextContent("password can't be empty");
    });
    it("have a email is empty error if email is empty",()=>{
        const {queryByTestId} = render(<Signup />);
        fireEvent.change(queryByTestId("username") , {target:{value:"testeee"}});
        fireEvent.change(queryByTestId("password") , {target:{value:"testeee"}});
        const signupButton = queryByTestId("signupButton");
        fireEvent.click(signupButton);
        expect(queryByTestId("emailError")).toHaveTextContent("email can't be empty");
    });
})

describe("blur input check", ()=>{
    it("have a username error if username is too short",()=>{
        const {queryByTestId} = render(<Signup />);
        fireEvent.change(queryByTestId("username") , {target:{value:"test"}});
        fireEvent.blur(queryByTestId("username"));
        expect(queryByTestId("usernameError")).toHaveTextContent("Username too short");
    });
    it("have a password error if password is too short",()=>{
        const {queryByTestId} = render(<Signup />);
        fireEvent.change(queryByTestId("password") , {target:{value:"test"}});
        fireEvent.blur(queryByTestId("password"));
        expect(queryByTestId("passwordError")).toHaveTextContent("Password is too short");
    });
    it("have a email error if email is too short",()=>{
        const {queryByTestId} = render(<Signup />);
        fireEvent.change(queryByTestId("email") , {target:{value:"test"}});
        fireEvent.blur(queryByTestId("email"));
        expect(queryByTestId("emailError")).toHaveTextContent("Email is too short");
    });
    it("have a confirmPassword error if passwords don't match",()=>{
        const {queryByTestId} = render(<Signup />);
        fireEvent.change(queryByTestId("password") , {target:{value:"testeee"}});
        fireEvent.change(queryByTestId("confirmPassword") , {target:{value:"testee"}});
        fireEvent.blur(queryByTestId("confirmPassword"));
        expect(queryByTestId("confirmPasswordError")).toHaveTextContent("Passwords don't match");
    });
})