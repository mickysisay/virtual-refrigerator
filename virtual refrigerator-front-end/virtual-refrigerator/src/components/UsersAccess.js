import React from "react";
import backendAPI from "../Utils/backendAPI";
import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";
import "./login.css";
import { Button, Modal } from "react-bootstrap";
import { MDBIcon, MDBFormInline } from "mdbreact";
import { confirmAlert } from "react-confirm-alert";

export default class UserAccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refInfo: this.props.refInfo,
      allowedUsers: [],
      searchedUsers: [],
      searchName: "",
    };
  }
  componentDidMount() {
    this.getAllowedUsers();
    document.body.addEventListener("click", this.removeSearchResults);
  }
  componentWillUnmount() {
    document.body.removeEventListener("click", this.removeSearchResults);
  }
  getAllowedUsers = async () => {
    const response = await backendAPI.getAllUsersWithAccess(
      this.state.refInfo.id
    );
    if (response.statusCode === 200) {
      this.setState({
        allowedUsers: response.message.message,
      });
    }
  };
  searchUsers = async (e) => {
    this.setState({ searchName: e.target.value });
    if (e.target.value.trim().length !== 0) {
      const response = await backendAPI.searchUsers(e.target.value.trim());
      if (response.statusCode === 200) {
        const arrUsers = response.message.message;
        this.setSearchedUsers(arrUsers);
      }
    } else {
      this.setState({ searchedUsers: [] });
    }
  };
  setSearchedUsers = (arrUsers) => {
    const isAlreadyShared = (id, arr) => {
      return arr.some((e) => {
        return e.id === id;
      });
    };
    arrUsers.forEach((e) => {
      e["sharedStatus"] = e["isYou"]
        ? "owner"
        : isAlreadyShared(e["id"], this.state.allowedUsers)
        ? "shared"
        : "notShared";
    });
    this.setState({ searchedUsers: arrUsers });
  };
  unShareRefrigerator = async (e) => {
    const data = {
      refrigerator_id: this.state.refInfo["id"],
      user_id: e["id"],
    };
    const response = await backendAPI.takeAccessAway(data);
    if (response.statusCode === 200) {
      this.getAllowedUsers();
      NotificationManager.success(
        "Success message",
        response.message.message,
        1000,
        () => {
          alert("callback");
        }
      );
    } else {
      NotificationManager.error(
        "Error message",
        response.message.message,
        1000,
        () => {
          alert("callback");
        }
      );
    }
  };
  shareRefrigerator = async (e) => {
    const data = {
      refrigerator_id: this.state.refInfo["id"],
      user_id: e["id"],
    };
    const response = await backendAPI.giveUserAccess(data);
    if (response.statusCode === 200) {
      this.getAllowedUsers();
      NotificationManager.success(
        "Success message",
        response.message.message,
        1000,
        () => {
          alert("callback");
        }
      );
    } else {
      NotificationManager.error(
        "Error message",
        response.message.message,
        1000,
        () => {
          alert("callback");
        }
      );
    }
  };
  confirmRemoveAccess = (e) => {
    confirmAlert({
      closeOnClickOutside: false,
      customUI: ({ onClose }) => {
        return (
          <div>
            <Modal.Dialog>
              <Modal.Header closeButton onClick={onClose}>
                <Modal.Title>Unshare refrigerator</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>
                  Are you sure you want to unshare "
                  {this.state.refInfo["refrigerator_name"]}" from "
                  {e["username"]}"?
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                  No
                </Button>
                <Button
                  variant="danger"
                  data-testid="confirm-unshare"
                  onClick={() => {
                    this.unShareRefrigerator(e);
                    onClose();
                  }}
                >
                  Unshare
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        );
      },
    });
  };

  confirmShare = (e) => {
    if (e["sharedStatus"] === "owner") {
      NotificationManager.error(
        "Error message",
        "Can't share to Owner",
        1000,
        () => {
          alert("callback");
        }
      );
      return;
    } else if (e["sharedStatus"] === "shared") {
      NotificationManager.error(
        "Error message",
        "Already shared with this person",
        1000,
        () => {
          alert("callback");
        }
      );
      return;
    }

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div>
            <Modal.Dialog>
              <Modal.Header closeButton onClick={onClose}>
                <Modal.Title>Share refrigerator</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>
                  Are you sure you want to share "
                  {this.state.refInfo["refrigerator_name"]}" with {e.username}?
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                  No
                </Button>
                <Button
                  data-testid="share-refrigerator-button"
                  variant="primary"
                  onClick={() => {
                    this.shareRefrigerator(e);
                    onClose();
                  }}
                >
                  Share
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        );
      },
    });
  };
  removeSearchResults = (e) => {
    if (!e.target.classList.contains("individual-results-unable")) {
      this.setState({ searchName: "", searchedUsers: [] });
    }
  };

  render() {
    return (
      <div>
        <div className="search-userss">
          <MDBFormInline className="md-form">
            <MDBIcon icon="search" />
            <input
              data-testid="search-users-input"
              className="form-control form-control-sm ml-3 w-75"
              type="text"
              placeholder="Add users"
              value={this.state.searchName}
              aria-label="Search"
              onChange={this.searchUsers}
            />
          </MDBFormInline>
          <div onClick={this.handleOnClick} className="users-result">
            {this.state.searchedUsers.length !== 0 ? (
              this.state.searchedUsers.map((e) => {
                return (
                  <div
                    key={`id-${e["id"]}`}
                    data-testid={`sharelist-${e["id"]}`}
                    onClick={(c) => this.confirmShare(e)}
                    className={
                      e["sharedStatus"] === "notShared"
                        ? "individual-results"
                        : "individual-results-unable"
                    }
                  >
                    {e["username"]}
                  </div>
                );
              })
            ) : this.state.searchName.trim() === "" ? null : (
              <div className="no-users">No Users found</div>
            )}
          </div>
        </div>
        <div>
          <h3>List of shared users</h3>
          <div className="shared-list">
            {this.state.allowedUsers.length === 0
              ? "shared with no users"
              : this.state.allowedUsers.map((e) => {
                  return (
                    <div className="already-shared" key={e.id}>
                      <div>{e.username}</div>
                      <MDBIcon
                        data-testid={`unshare-button-${e.id}`}
                        onClick={() => {
                          this.confirmRemoveAccess(e);
                        }}
                        icon="times"
                      />
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    );
  }
}
