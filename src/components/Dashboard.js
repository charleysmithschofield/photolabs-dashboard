// Dashboard.js
import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
} from "helpers/selectors";

// Define panel data
const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];

class Dashboard extends Component {
  // Set initial state
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: []
  };

  // Check if there is a saved focus state when rendering
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });
  }

  // Listen for state changes
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      // Save focus state to local storage
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  // Set state of focused panel
  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  render() {
    // Log state for debugging
    console.log(this.state);

    // Add CSS classes based on focus state
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    // Display loading indicator when data is loading
    if (this.state.loading) {
      return <Loading />;
    }

    // Render panels based on focus state
    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
      .map(panel => (
        <Panel
          key={panel.id}
          label={panel.label}
          value={panel.getValue(this.state)}
          onSelect={() => this.selectPanel(panel.id)}
        />
      ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
