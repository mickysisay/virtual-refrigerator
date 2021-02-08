import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import backendAPI from "../Utils/backendAPI";
import AddPersonalItem from "../components/AddPersonalItem";
import NotificationManager from "react-notifications/lib/NotificationManager";

it("renders successfully", () => {
  const AddPersonalItemModal = render(<AddPersonalItem />);
  expect(AddPersonalItemModal.queryByText("Add Personal Item")).toBeTruthy();
  expect(AddPersonalItemModal.queryByTestId("add-personal-item")).toBeTruthy();
  expect(AddPersonalItemModal.queryByTestId("scan-personal-item")).toBeTruthy();
});
it("typing on name input works", () => {
  const AddPersonalItemModal = render(<AddPersonalItem />);
  const personalItemName = AddPersonalItemModal.queryByTestId(
    "personal-item-name"
  );
  expect(personalItemName.value).toBe("");
  userEvent.type(personalItemName, "something");
  expect(personalItemName.value).toBe("something");
});

it("clicking on cancel button calls onclose prop", () => {
  const onClose = jest.fn();
  const AddPersonalItemModal = render(<AddPersonalItem onClose={onClose} />);
  const cancelButton = AddPersonalItemModal.queryByTestId(
    "cancel-personal-item-modal"
  );
  userEvent.click(cancelButton);
  expect(onClose).toHaveBeenCalled();
});
it("clicking on add button with empty name gives error notification", () => {
  NotificationManager.error = jest.fn((type, message) => {
    expect(type).toBe("Error message");
    expect(message).toBe("item name cannot be empty");
  });
  const AddPersonalItemModal = render(<AddPersonalItem />);
  const addButton = AddPersonalItemModal.queryByTestId("add-personal-item");
  userEvent.click(addButton);
  expect(NotificationManager.error).toHaveBeenCalled();
});
it("clicking on add button with a valid name calls backendAPI.addPersonalItem", () => {
  backendAPI.addPersonalItem = jest.fn(() =>
    Promise.resolve({
      message: { message: "something went wrong" },
    })
  );
  const AddPersonalItemModal = render(<AddPersonalItem />);
  const addButton = AddPersonalItemModal.queryByTestId("add-personal-item");
  const personalItemName = AddPersonalItemModal.queryByTestId(
    "personal-item-name"
  );
  userEvent.type(personalItemName, "something");
  userEvent.click(addButton);
  expect(backendAPI.addPersonalItem).toHaveBeenCalledTimes(1);
});
it("show success notification if adding item was successful", async () => {
  backendAPI.addPersonalItem = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: { message: {} },
    })
  );
  const onClose = jest.fn();
  const setPersonalItems = jest.fn();
  NotificationManager.success = jest.fn((type, message) => {
    expect(type).toBe("Success message");
    expect(message).toBe("personal item added succesfully");
  });
  const AddPersonalItemModal = render(
    <AddPersonalItem onClose={onClose} setPersonalItems={setPersonalItems} />
  );
  const addButton = AddPersonalItemModal.queryByTestId("add-personal-item");
  const personalItemName = AddPersonalItemModal.queryByTestId(
    "personal-item-name"
  );
  userEvent.type(personalItemName, "something");
  userEvent.click(addButton);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(NotificationManager.success).toHaveBeenCalled();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  expect(onClose).toHaveBeenCalled();
});
it("clicking on scan removes modal", () => {
  const AddPersonalItemModal = render(<AddPersonalItem />);
  const scanButton = AddPersonalItemModal.queryByTestId("scan-personal-item");
  userEvent.click(scanButton);
  expect(AddPersonalItemModal.queryByText("Add Personal Item")).toBeNull();
  expect(AddPersonalItemModal.queryByTestId("add-personal-item")).toBeNull();
  expect(AddPersonalItemModal.queryByTestId("scan-personal-item")).toBeNull();
});
