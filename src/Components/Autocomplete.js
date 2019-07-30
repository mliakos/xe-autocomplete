import React, { Component } from "react";
import { Icon, Button, Input, AutoComplete, Row, Col } from "antd";
import { debounce } from "lodash";
import Banner from "./Banner";

const { Option } = AutoComplete;

class Autocomplete extends Component {

  // Adding necessary event listeners on component mount
  componentDidMount() {
    window.addEventListener("resize", this.handleResize); // Listen for window resize
  }

  // Removing  event listeners on component unmount
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  // Initializing state
  state = {
    dataSource: [],
    value: "",
    modalOpen: false,
    buttonDisabled: true,
    noResults: "",
    width: window.innerWidth,
    loading: false,
    error: false
  };

  // Results fetching method
  fetchResults = (query, cache) => {

    let currentWidth = this.state.width;
    let device = currentWidth <= 600 ? 'mobile' :
    currentWidth > 600 && currentWidth < 992 ? 'tablet' : 'desktop';

    return new Promise((resolve, reject) => {

      // Execute if input characters are more than minChars
      if (query.length > this.props.minChars) {

        // Setting loading to true
        this.setState({
          loading: true,
          error: false,
          noResults: ''
        })

        /*** Caching or requesting ***/

        /* Getting localstorage item based on device used */
        const cached = JSON.parse(localStorage.getItem(`${query}-${device}`));
      
        const nowTimestamp = Date.now();

        // Checking if response data for query is cached and if time since caching is within specified prop
        if (cached && (nowTimestamp - cached.timestamp) / 1000 < this.props.cachingTimeThreshold) {

          // Updating state with fetched data
          this.setState({
            dataSource: cached.entries,
            modalOpen: true,
            noResults: '',
            error: false,
            loading: false
          });

          resolve(cached.entries);

        }

        // Else fetch normally
        else {

          const language = navigator.language.match(/([^-]+)/)[0];

          fetch(
            `http://35.180.182.8/search?keywords=${query}&language=${
            language
            }&limit=${this.props[`${device}ResultsLimit`]
            }` // Limit the results depending on screen size
          )
            .then(res => {
              res.text().then(data => {
                if (res.status === 200) {

                  // Setting loading to false
                  this.setState({
                    loading: false
                  })

                  data = JSON.parse(data);

                  // Adding timestamp
                  data.timestamp = Date.now();

                  data.entries = data.entries.map((item, index) => {
                    return {
                      query: item.name,
                      key: index
                    };
                  });

                  let buttonDisabled = !data.entries.length;

                  // Updating state with fetched data
                  this.setState({
                    dataSource: data.entries,
                    modalOpen: true,
                    buttonDisabled: buttonDisabled,
                    noResults: buttonDisabled ? "No results found" : ""
                  });

                  // Caching data if needed (cache === true)
                  if (cache) localStorage.setItem(`${query}-${device}`, JSON.stringify(data));
                  
                  resolve(data);

                } else {
                  resolve([]);
                }
              });
            })
            .catch(err => {
              this.setState({
                error: true,
                dataSource: [],
                loading: false
              })
              resolve([])
            });
          }
        }
      });
  };

  // Debouncing request method
  fetchResultsDebounced = debounce(this.fetchResults, this.props.debounce);

  // Render results method
  renderOption(item) {
    return (
      <Option key={item.query} text={item.value}>
        <div className="global-search-item">
          <span className="global-search-item-desc">{item.query}</span>
        </div>
      </Option>
    );
  }

  // Search handling method
  handleSearch = value => {
    // Updating state with user  input
    this.setState({
      value: value
    });

    // Fetching data with debounce
    this.fetchResultsDebounced(value, true);

  };

  handleButtonClick = query => {
    window.open(`https://google.com/search?q=${query}`);
  };

  handleInputKeypress(keycode) {
    // Query length
    let valueLength = this.state.value.length;

    /* If user presses escape or backspace erasing the last character of the query, close dropdown */

    // Backspace (not emptying datasource)
    if (keycode === 8 && valueLength === 1) {
      this.setState({
        modalOpen: false
      });
    }

    // Escape
    else if (keycode === 27) {
      this.setState({
        modalOpen: false
      });
    }

    // Backspace (emptying datasource)
    else if (keycode === 8 && valueLength === 0) {
      this.setState({
        modalOpen: false,
        dataSource: []
      });
    }
  }

  handleInputFocus = () => {
    this.setState({
      modalOpen: true,
      buttonDisabled: !this.state.dataSource.length
    });
  };

  // Result click method
  handleSelection(result) {
    this.setState({
      value: result,
      modalOpen: false,
      noResults: "",
      buttonDisabled: false
    });
  }

  // Handle window resize
  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      dataSource: []
    });
  };

  // Rednering method
  render() {
    // Destructuring state, declaring dataSource and value variables
    const { dataSource, value, modalOpen } = this.state;
    let currentWidth = this.state.width;
    let component = "";
    let errorMsg = this.state.error == true ? <p style={{ color: 'red' }}>An error occured. Please check your internet connection.</p> : null

    /****** Conditional rendering ******/

    // Rendering for desktops and mobiles
    if (currentWidth > 992 || currentWidth <= 600) {
      component = (
        <div
          className="global-search-wrapper"
          style={{ width: "95%", margin: "auto", paddingTop: "30px" }}
        >
          <AutoComplete
            className="global-search"
            size="default"
            style={{ width: "100%", marginBottom: "30px" }}
            dataSource={dataSource ? dataSource.map(this.renderOption) : []}
            onSelect={key => this.handleSelection(key)} // Method to execute on result click
            onSearch={value => this.handleSearch(value)} // Method to execute when user types
            onBlur={() => this.setState({
              modalOpen: false
            })}
            placeholder="Type here"
            optionLabelProp="value"
            open={modalOpen}
          >
            <Input
              suffix={
                <Button
                  className="search-btn"
                  style={{ marginRight: -12 }}
                  size="default"
                  type="primary"
                  onClick={() => this.handleButtonClick(this.state.value)}
                  disabled={this.state.buttonDisabled}
                >
                  { // Show loading spinner if loading, else show search icon
                    this.state.loading === true ? <Icon type="loading" style={{ fontSize: 16 }} spin /> : <Icon type="search" />
                  }
                </Button>
              }
              onKeyUp={event => this.handleInputKeypress(event.keyCode)}
              onClick={this.handleInputFocus}
            />
          </AutoComplete>

          <div>
            {
              // Dynamically render no results message
              this.state.noResults
            }
          </div>

          {
            // Dynamically render error message
            errorMsg
          }

          {
            //Render banner if not mobile
            currentWidth >= 600 ? <Banner margin={"250px auto 0px"} /> : null

          }
        </div>
      );
    }

    // Rendering for tablets (portrait & landscape)
    else if (currentWidth < 992 && currentWidth > 600) {
      component = (
        <div
          className="global-search-wrapper"
          style={{ width: "95%", margin: "auto", paddingTop: "30px" }}
        >
          <Row>
            {/* Component collumn */}
            <Col span={18} push={6}>

              <AutoComplete
                className="global-search"
                size="default"
                style={{ width: "70%", marginBottom: "30px" }}
                dataSource={dataSource ? dataSource.map(this.renderOption) : []}
                onSelect={key => this.handleSelection(key)} // Method to execute on result click
                onSearch={value => this.handleSearch(value)} // Method to execute when user types
                onBlur={() => this.setState({
                  modalOpen: false
                })}
                placeholder="Type here"
                optionLabelProp="value"
                open={modalOpen}
              >
                <Input
                  suffix={
                    <Button
                      className="search-btn"
                      style={{ marginRight: -12 }}
                      size="default"
                      type="primary"
                      onClick={() => this.handleButtonClick(this.state.value)}
                      disabled={this.state.buttonDisabled}
                    >

                      { // Show loading spinner if loading, else show search icon
                        this.state.loading === true ? <Icon type="loading" style={{ fontSize: 24 }} spin /> : <Icon type="search" />
                      }
                    </Button>
                  }
                  onKeyUp={event => this.handleInputKeypress(event.keyCode)}
                  onClick={this.handleInputFocus}
                />
              </AutoComplete>

              <div>
                {
                  // Dynamically render no results message
                  this.state.noResults
                }
              </div>

              {
                // Dynamically render error message
                errorMsg
              }
            </Col>

            {/* Banner collumn */}
            <Col span={6} pull={18}>
              <Banner height={"300px"} margin="0px 0px 0px 30px" />
            </Col>
          </Row>
        </div>
      );
    }


    return component;
  }
}

export default Autocomplete;

