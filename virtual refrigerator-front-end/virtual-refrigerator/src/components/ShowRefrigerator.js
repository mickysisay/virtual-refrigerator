import React from "react";
import backendAPI from "../Utils/backendAPI";
import Sidebar from "react-sidebar";
import { confirmAlert } from "react-confirm-alert";
import AddPersonalItem from "./AddPersonalItem";
import { Button } from "react-bootstrap";
import PersonalItemShow from "./PersonalItemShow";
import { Grid } from "@material-ui/core";
import "./login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBIcon, MDBFormInline } from "mdbreact";
import RefrigeratorItemShow from "./RefrigeratorItemShow";
import AddRefrigeratorItem from "./AddRefrigeratorItem";
import {
  Navbar as Navigationbar,
  Nav as Navigation,
  Form,
} from "react-bootstrap";
import ScanForRefrigeratorItem from "./ScanForRefrigeratorItem";
import Switch from "react-switch";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import UserAccess from "./UsersAccess";

export default class ShowRefrigerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      personalItems: [],
      allItems: [],
      filteredPersonalItems: [],
      filteredAllItems: [],
      sidebarOpen: false,
      showingCalender: false,
      refrigeratorInfo: {},
    };
  }

  componentDidMount() {
    this.getAllPersonalItems();
    this.getAllItems();
    this.getRefrigeratorInfo();
  }
  toggleShowCalendar = (e) => {
    this.setState({
      showingCalender: e,
    });
  };
  getRefrigeratorInfo = async () => {
    const response = await backendAPI.getRefrigeratorByRefrigeratorId(
      this.state.id
    );
    if (response.statusCode === 200) {
      const message = response.message.message;
      this.setState({ refrigeratorInfo: message });
    }
  };
  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  };

  getAllItems = async () => {
    const response = await backendAPI.getAllItemsInRefrigerator(this.state.id);
    if (response.statusCode === 200) {
      this.setState({
        allItems: response.message.message,
        filteredAllItems: response.message.message,
      });
    } else {
      this.props.history.push("/");
    }
  };
  setPersonalItems = (personalItems) => {
    this.setState({
      personalItems: personalItems,
      filteredPersonalItems: personalItems,
    });
  };
  setRefrigeratorItems = (item) => {
    this.setState({
      allItems: item,
      filteredAllItems: item,
    });
  };
  getAllPersonalItems = async () => {
    const response = await backendAPI.getAllPersonalItems();
    if (response.statusCode === 200) {
      this.setState({
        personalItems: response.message.message,
        filteredPersonalItems: response.message.message,
      });
    }
  };

  openItemScanner = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div>
            <ScanForRefrigeratorItem
              data-testid="scan-to-take-item"
              setItem={this.setRefrigeratorItems}
              onClose={onClose}
              refrigerator_id={this.state.id}
            />
          </div>
        );
      },
    });
  };

  createAddItemModal = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div>
            <AddPersonalItem
              setPersonalItems={this.setPersonalItems}
              onClose={onClose}
            />
          </div>
        );
      },
    });
  };
  createRefrigeratorItemModal = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div>
            <AddRefrigeratorItem
              refrigeratorId={this.state.id}
              itemInfo={{}}
              setRefrigeratorItems={this.setRefrigeratorItems}
              onClose={onClose}
            />
          </div>
        );
      },
    });
  };
  filterPersonalItems = (e) => {
    const val = e.target.value.toLowerCase();
    const newArray = this.state.personalItems.filter((e) => {
      return e["item_name"].toLowerCase().includes(val);
    });
    this.setState({
      filteredPersonalItems: newArray,
    });
  };
  filterAllItems = (e) => {
    const val = e.target.value.toLowerCase();
    const newArray = this.state.allItems.filter((e) => {
      return e["item_name"].toLowerCase().includes(val);
    });
    this.setState({
      filteredAllItems: newArray,
    });
  };
  render() {
    return (
      <div>
        <Sidebar
          sidebarClassName="side-bar"
          sidebar={
            <div>
              <div className="home-button">
                <a href="/">Home</a>
              </div>

              <div className="personal-Items">
                <MDBFormInline className="md-form">
                  <MDBIcon icon="search" />
                  <input
                    data-testid="search-personal-items"
                    className="form-control form-control-sm ml-3 w-75"
                    type="text"
                    placeholder="Search personal Items"
                    aria-label="Search"
                    onChange={this.filterPersonalItems}
                  />
                </MDBFormInline>
                <Button
                  block
                  data-testid="add-personal-item-button"
                  className="add-buttons"
                  onClick={() => {
                    this.createAddItemModal();
                  }}
                >
                  Add Personal Item
                </Button>
                {this.state.filteredPersonalItems.length !== 0 ? (
                  this.state.filteredPersonalItems.map((e) => {
                    return (
                      <PersonalItemShow
                        key={e["id"]}
                        setItem={this.setRefrigeratorItems}
                        setPersonalItems={this.setPersonalItems}
                        personalItem={e}
                        refrigeratorId={this.state.id}
                      />
                    );
                  })
                ) : (
                  <div>No items found</div>
                )}
              </div>
            </div>
          }
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white" } }}
          children={
            <div className="main-content-sidebar" data-testid="main-content">
              <Navigationbar
                className="refrigerator-bar"
                bg="dark"
                variant="dark"
              >
                <Navigationbar.Brand
                  style={{ cursor: "pointer" }}
                  onClick={() => this.onSetSidebarOpen(true)}
                >
                  Sidebar
                </Navigationbar.Brand>

                <Navigation className="mr-auto">
                  <Navigation.Link data-testid="homeButton" href="/">
                    Home
                  </Navigation.Link>
                </Navigation>
                <Form inline>
                  <Navigation className="mr-auto">
                    <Navigationbar.Brand
                      data-testid="scan-to-take-item-button"
                      style={{ cursor: "pointer" }}
                      onClick={() => this.openItemScanner()}
                    >
                      <MDBIcon icon="barcode" />
                    </Navigationbar.Brand>
                    <Navigation.Link href="/logout">Logout</Navigation.Link>
                  </Navigation>
                </Form>
              </Navigationbar>

              <div className="users-access">
                {this.state.refrigeratorInfo["isOwner"] ? (
                  <UserAccess
                    data-testId="user-access"
                    refInfo={this.state.refrigeratorInfo}
                  />
                ) : null}
              </div>

              <div className="refrigerator-items">
                <MDBFormInline className="md-form">
                  <MDBIcon icon="search" />
                  <input
                    className="form-control form-control-sm ml-3 w-75"
                    type="text"
                    placeholder="Search Refrigerator Items"
                    aria-label="Search"
                    onChange={this.filterAllItems}
                  />
                </MDBFormInline>
                <Button
                  block
                  className="add-buttons"
                  onClick={() => {
                    this.createRefrigeratorItemModal();
                  }}
                >
                  Add Refrigerator Item
                </Button>
                <div className="toggle-calendar">
                  <span>Normal</span>
                  <Switch
                    data-testid="item-view-switch"
                    height={window.innerWidth * 0.015}
                    width={window.innerWidth * 0.04}
                    className="toggle-calendar-switch"
                    onChange={this.toggleShowCalendar}
                    checked={this.state.showingCalender}
                  />
                  <span>Calendar</span>
                </div>
                <hr />
                {this.state.showingCalender ? (
                  <div data-testid="calendar-item-view">
                    <FullCalendar
                      // width={window.innerWidth * 0.7}
                      //  height={700}
                      plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                      initialView="dayGridMonth"
                      events={this.state.filteredAllItems.map((e) => {
                        return {
                          title: e["item_name"],
                          start: e["CreatedOn"],
                          end: e["expiration_date"]
                            ? e["expiration_date"]
                            : "2030-12-12",
                        };
                      })}
                    />
                  </div>
                ) : (
                  <Grid
                    data-testid="grid-item-view"
                    container
                    direction="row"
                    justify="center"
                    spacing={32}
                    className="mt-4"
                  >
                    {this.state.filteredAllItems.length !== 0 ? (
                      this.state.filteredAllItems.map((e) => {
                        return (
                          <Grid key={e["id"]}>
                            <RefrigeratorItemShow
                              setItem={this.setRefrigeratorItems}
                              item={e}
                            />
                          </Grid>
                        );
                      })
                    ) : (
                      <div>No items found</div>
                    )}
                  </Grid>
                )}
              </div>
            </div>
          }
        ></Sidebar>

        {/* <GetItemBarCode /> */}
      </div>
    );
  }
}
