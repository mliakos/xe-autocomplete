import React, { Component } from "react";
import Logo from "./Components/Logo";
import "./App.css";
import Autocomplete from "./Components/Autocomplete";

class App extends Component {

  render() {
    return (
      <div className="App">
        <Logo />
        <Autocomplete
          style={{
            margin: "0 auto"
          }}
          minChars={1} // Minimum characters required to start search
          debounce={500} // Time passed required to make the request after user has stopped typing (in ms)
          desktopResultsLimit={20} // Limit query parameter for desktop
          tabletResultsLimit={20} // Limit query parameter for tablet
          mobileResultsLimit={10} // Limit query parameter for mobile
          cachingTimeThreshold = {300} // Time after which has passed, new requests will be made (in seconds)
        />
      </div>
    );
  }
}

export default App;
