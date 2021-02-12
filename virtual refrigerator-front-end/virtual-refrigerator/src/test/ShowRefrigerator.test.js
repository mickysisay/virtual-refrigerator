import React from "react";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import backendAPI from "../Utils/backendAPI";
import ShowRefrigerator from "../components/ShowRefrigerator";

const params = {
  id: 2,
};
const match = {
  params: params,
};
const REFRIGERATOR_INFO = {
  refrigerator_name: "something",
  isOwner: true,
};
beforeEach(() => {
  backendAPI.getRefrigeratorByRefrigeratorId = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: { message: REFRIGERATOR_INFO },
    })
  );
  backendAPI.getAllItemsInRefrigerator = jest.fn(() =>
    Promise.resolve({ statusCode: 200, message: { message: [] } })
  );
  backendAPI.getAllPersonalItems = jest.fn(() =>
    Promise.resolve({ statusCode: 200, message: { message: [] } })
  );
  backendAPI.getAllUsersWithAccess = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: { message: [] },
    })
  );
});

it("renders successfully", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  expect(refrigeratorPage.queryByText("Add Refrigerator Item")).toBeTruthy();
  expect(refrigeratorPage.queryByText("Normal")).toBeTruthy();
  expect(refrigeratorPage.queryByText("Calendar")).toBeTruthy();
});
it("calls backendApi.getRefrigeratorByRefrigeratorId when page loads", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  expect(backendAPI.getRefrigeratorByRefrigeratorId).toHaveBeenCalled();
});
it("calls backendApi.getAllItemsInRefrigerator when loading page", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  expect(backendAPI.getAllItemsInRefrigerator).toHaveBeenCalled();
});
it("calls backendApi.getAllPersonalItems when loading page", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  expect(backendAPI.getAllPersonalItems).toHaveBeenCalled();
});

it("doesn't show sharedlist if user doesn't own refrigerator", () => {
  backendAPI.getRefrigeratorByRefrigeratorId = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: {
          ...REFRIGERATOR_INFO,
          isOwner: false,
        },
      },
    })
  );
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  expect(refrigeratorPage.queryByText("List of shared users")).toBeNull();
});
it("shows sharedList if user owns refrigerator", async () => {
  backendAPI.getRefrigeratorByRefrigeratorId = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: {
          ...REFRIGERATOR_INFO,
          isOwner: true,
        },
      },
    })
  );

  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  //need to ask someone about this
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(refrigeratorPage.queryByText("List of shared users")).toBeTruthy();
  //
});
it("shows sidebar control at the top left corner of page", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  expect(refrigeratorPage.queryByText("Sidebar")).toBeTruthy();
});

it("clicking on sidebar control open sidebar and shows personal items", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  const sideBar = refrigeratorPage.queryByText("Sidebar");
  userEvent.click(sideBar);
  expect(refrigeratorPage.queryByText("Add Personal Item")).toBeTruthy();
  expect(refrigeratorPage.queryByTestId("search-personal-items")).toBeTruthy();
});

it("clicking on add personal item creates a modal", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  const sideBar = refrigeratorPage.queryByText("Sidebar");
  userEvent.click(sideBar);
  expect(refrigeratorPage.queryByText("Add Item")).toBeNull();
  userEvent.click(refrigeratorPage.queryByText("Add Personal Item"));
  expect(refrigeratorPage.queryByText("Add Item")).toBeTruthy();
});
it("clicking on cancel closes the addpersonal item modal", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  const sideBar = refrigeratorPage.queryByText("Sidebar");
  userEvent.click(sideBar);
  userEvent.click(refrigeratorPage.queryByTestId("add-personal-item-button"));
  expect(refrigeratorPage.queryByText("Cancel")).toBeTruthy();
  userEvent.click(refrigeratorPage.queryByText("Cancel"));
  expect(refrigeratorPage.queryByText("Cancel")).toBeNull();
  expect(refrigeratorPage.queryByText("Add Item")).toBeNull();
});
it("shows scanner when clicking on barcode icon", () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  const scanButton = refrigeratorPage.queryByTestId("scan-to-take-item-button");
  userEvent.click(scanButton);
  const scanner = refrigeratorPage.queryByTestId("cancel-scan-item");
  expect(scanner).toBeTruthy();
});
it("changes view when clicking on switch", async () => {
  const refrigeratorPage = render(<ShowRefrigerator match={match} />);
  const switchButton = refrigeratorPage.queryByTestId("item-view-switch");
  const calendarView = refrigeratorPage.queryByTestId("calendar-item-view");
  const gridView = refrigeratorPage.queryByTestId("grid-item-view");
  expect(gridView).toBeTruthy();
  expect(calendarView).toBeNull();
  userEvent.click(switchButton);
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  expect(refrigeratorPage.queryByTestId("grid-item-view")).toBeNull();
  expect(refrigeratorPage.queryByTestId("calendar-item-view")).toBeTruthy();
});
 