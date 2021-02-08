import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import backendAPI from "../Utils/backendAPI";
import UserAccess from "../components/UsersAccess";
import NotificationManager from "react-notifications/lib/NotificationManager";

const REF_INFO = {
  id: 1,
  refrigerator_name: "something",
};
const VALID_GET_USERS_WITH_ACCESS = () => {
  backendAPI.getAllUsersWithAccess = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: [
          {
            username: "Michael",
            id: 2,
          },
        ],
      },
    })
  );
};

beforeEach(() => {
  backendAPI.getAllUsersWithAccess = jest.fn(() =>
    Promise.resolve({
      statusCode: 401,
    })
  );
});

it("renders correctly", () => {
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);

  expect(userAccess.queryByTestId("search-users-input")).toBeTruthy();
  expect(userAccess.queryByText("List of shared users")).toBeTruthy();
});
it("calls backendAPI.getAllUsersWithAccess when first loading", () => {
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);

  expect(backendAPI.getAllUsersWithAccess).toHaveBeenCalled();
});
it("calls backendAPI.searchusers when typing on search input", () => {
  backendAPI.searchUsers = jest.fn(() =>
    Promise.resolve({
      statusCode: 400,
    })
  );
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  const searchInput = userAccess.queryByTestId("search-users-input");

  userEvent.type(searchInput, "as");
  userEvent.click(userAccess.queryByText("List of shared users"));
  expect(backendAPI.searchUsers).toHaveBeenCalledTimes(2);
});
it("shows users names when typing on seach input", async () => {
  backendAPI.searchUsers = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: [
          {
            username: "Michael",
            id: 2,
          },
        ],
      },
    })
  );
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  const searchInput = userAccess.queryByTestId("search-users-input");
  userEvent.type(searchInput, "a");
  await new Promise((resolve) => setTimeout(resolve, 100));
  const userMichael = userAccess.queryByText("Michael");
  expect(userMichael).toBeTruthy();
});
it("shows people who have access to refrigerator", async () => {
  VALID_GET_USERS_WITH_ACCESS();
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(userAccess.queryByText("Michael")).toBeTruthy();
});
it("clicking on user from search opens up share modal", async () => {
  backendAPI.searchUsers = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: [
          {
            username: "Michael",
            id: 2,
          },
        ],
      },
    })
  );
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  const searchInput = userAccess.queryByTestId("search-users-input");
  userEvent.type(searchInput, "a");
  await new Promise((resolve) => setTimeout(resolve, 100));
  const userMichael = userAccess.queryByText("Michael");
  userEvent.click(userMichael);
  expect(userAccess.queryByText("Share refrigerator")).toBeTruthy();
});
it("clicking on share button on share modal calls backendApi.giveUserAccess", async () => {
  backendAPI.searchUsers = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: [
          {
            username: "Michael",
            id: 2,
          },
        ],
      },
    })
  );
  backendAPI.giveUserAccess = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: { message: "shared successfully" },
    })
  );
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  const searchInput = userAccess.queryByTestId("search-users-input");
  NotificationManager.success = jest.fn((type, message) => {
    expect(message).toBe("shared successfully");
    expect(type).toBe("Success message");
  });
  userEvent.type(searchInput, "a");
  await new Promise((resolve) => setTimeout(resolve, 100));
  const userMichael = userAccess.queryByText("Michael");
  userEvent.click(userMichael);
  userEvent.click(userAccess.queryByTestId("share-refrigerator-button"));
  expect(backendAPI.giveUserAccess).toHaveBeenCalled();
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(NotificationManager.success).toHaveBeenCalledTimes(1);
});

it(
  "clicking on username will give you a 'can't share to Owner' notification if trying to share with owner" +
    "and doesn't open up share modal",
  async () => {
    backendAPI.searchUsers = jest.fn(() =>
      Promise.resolve({
        statusCode: 200,
        message: {
          message: [
            {
              username: "Michael",
              id: 2,
              isYou: true,
            },
          ],
        },
      })
    );
    const userAccess = render(<UserAccess refInfo={REF_INFO} />);
    const searchInput = userAccess.queryByTestId("search-users-input");
    NotificationManager.error = jest.fn((type, message) => {
      expect(message).toBe("Can't share to Owner");
      expect(type).toBe("Error message");
    });
    userEvent.type(searchInput, "a");
    await new Promise((resolve) => setTimeout(resolve, 100));
    const userMichael = userAccess.queryByText("Michael");
    userEvent.click(userMichael);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(NotificationManager.error).toHaveBeenCalledTimes(1);
    expect(userAccess.queryByText("Share refrigerator")).toBeNull();
  }
);

it("gives an error notification when trying to share it with someone that's already shared with", async () => {
  backendAPI.searchUsers = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: {
        message: [
          {
            username: "Michael",
            id: 2,
          },
        ],
      },
    })
  );
  VALID_GET_USERS_WITH_ACCESS();
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  const searchInput = userAccess.queryByTestId("search-users-input");
  NotificationManager.error = jest.fn((type, message) => {
    expect(message).toBe("Already shared with this person");
    expect(type).toBe("Error message");
  });
  userEvent.type(searchInput, "a");
  await new Promise((resolve) => setTimeout(resolve, 100));
  const userMichael = userAccess.queryByTestId("sharelist-2");
  userEvent.click(userMichael);
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(NotificationManager.error).toHaveBeenCalledTimes(1);
  expect(userAccess.queryByText("Share refrigerator")).toBeNull();
});
it("clicking on X button next to name opens unshare modal", async () => {
  VALID_GET_USERS_WITH_ACCESS();
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  await new Promise((resolve) => setTimeout(resolve, 100));
  userEvent.click(userAccess.queryByTestId("unshare-button-2"));
  expect(userAccess.queryByText("Unshare refrigerator")).toBeTruthy();
  expect(
    userAccess.queryByText(
      `Are you sure you want to unshare "${REF_INFO.refrigerator_name}" from "Michael"?`
    )
  ).toBeTruthy();
});
it("calls backendAPI.takeAccessAway when user confirms unshare", async () => {
  VALID_GET_USERS_WITH_ACCESS();
  backendAPI.takeAccessAway = jest.fn(() =>
    Promise.resolve({
      statusCode: 400,
      message: { message: "error" },
    })
  );
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  await new Promise((resolve) => setTimeout(resolve, 100));
  userEvent.click(userAccess.queryByTestId("unshare-button-2"));
  userEvent.click(userAccess.queryByTestId("confirm-unshare"));
  expect(backendAPI.takeAccessAway).toHaveBeenCalled();
});
it("shows success notification if unsharing was successful", async () => {
  VALID_GET_USERS_WITH_ACCESS();
  backendAPI.takeAccessAway = jest.fn(() =>
    Promise.resolve({
      statusCode: 200,
      message: { message: "Success unsharing" },
    })
  );
  NotificationManager.success = jest.fn((type, message) => {
    expect(type).toBe("Success message");
    expect(message).toBe("Success unsharing");
  });
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  await new Promise((resolve) => setTimeout(resolve, 100));
  userEvent.click(userAccess.queryByTestId("unshare-button-2"));
  userEvent.click(userAccess.queryByTestId("confirm-unshare"));
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(NotificationManager.success).toHaveBeenCalled();
});
it("shows error notification if unsharing was unsuccessful", async () => {
  VALID_GET_USERS_WITH_ACCESS();
  backendAPI.takeAccessAway = jest.fn(() =>
    Promise.resolve({
      statusCode: 400,
      message: { message: "error unsharing" },
    })
  );
  NotificationManager.error = jest.fn((type, message) => {
    expect(type).toBe("Error message");
    expect(message).toBe("error unsharing");
  });
  const userAccess = render(<UserAccess refInfo={REF_INFO} />);
  await new Promise((resolve) => setTimeout(resolve, 100));
  userEvent.click(userAccess.queryByTestId("unshare-button-2"));
  userEvent.click(userAccess.queryByTestId("confirm-unshare"));
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(NotificationManager.error).toHaveBeenCalled();
});
