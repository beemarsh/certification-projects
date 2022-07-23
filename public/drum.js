const alpha = [
  "Apl",
  "Heater 2",
  "Heater 3",
  "Heater 4",
  "Clap",
  "Open HH",
  "Kick n' Hat",
  "Kick",
  "Closed HH",
];

const beta = [
  "Chord 1",
  "Chord 2",
  "Chord 3",
  "Shaker",
  "Open HH",
  "Closed HH",
  "Punchy Kick",
  "Side Stick",
  "Snare",
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Drum Machine",
      powerAlphaClassName: "power-toggle-off",
      powerBetaClassName: "power-toggle-on",
      bankAlphaClassName: "bank-toggle-off",
      bankBetaClassName: "bank-toggle-on",
      disabled: "",
      volume: 25,
    };

    this.handlePlay = this.handlePlay.bind(this);
    this.handleClickAndPlay = this.handleClickAndPlay.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handlePowerClick = this.handlePowerClick.bind(this);
    this.handleRangeDrag = this.handleRangeDrag.bind(this);
    this.handleBankClick = this.handleBankClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handlePlay(x) {
    const playElementOne = document.querySelector(`audio#${x}.clip`);

    playElementOne.play();
  }

  handleClickAndPlay(x) {
    let a = x.toUpperCase();
    let clickElement = document.querySelector(`button#${a}.drum-pad`);
    clickElement.click();
    let playElement = document.querySelector(`audio#${a}.clip`);
    playElement.play();
  }

  handleKeyDown(e) {
    e.preventDefault();
    if (
      this.state.powerBetaClassName === "power-toggle-on" &&
      this.state.bankAlphaClassName === "bank-toggle-on"
    ) {
      const a = e.key.toLowerCase();
      switch (a) {
        case `q`:
          this.setState({ text: alpha[0] });
          this.handleClickAndPlay(`q`);
          break;
        case `w`:
          this.setState({ text: alpha[1] });
          this.handleClickAndPlay(`w`);
          break;
        case `e`:
          this.setState({ text: alpha[2] });
          this.handleClickAndPlay(`e`);
          break;
        case `a`:
          this.setState({ text: alpha[3] });
          this.handleClickAndPlay(`a`);
          break;
        case `s`:
          this.setState({ text: alpha[4] });
          this.handleClickAndPlay(`s`);
          break;
        case `d`:
          this.setState({ text: alpha[5] });
          this.handleClickAndPlay(`d`);
          break;
        case `z`:
          this.setState({ text: alpha[6] });
          this.handleClickAndPlay(`z`);
          break;
        case `x`:
          this.setState({ text: alpha[7] });
          this.handleClickAndPlay(`x`);
          break;
        case `c`:
          this.setState({ text: alpha[8] });
          this.handleClickAndPlay(`c`);
          break;
        default:
          break;
      }
    } else if (
      this.state.powerBetaClassName === "power-toggle-on" &&
      this.state.bankBetaClassName === "bank-toggle-on"
    ) {
      const b = e.key.toLowerCase();
      switch (b) {
        case `q`:
          this.setState({ text: beta[0] });
          this.handleClickAndPlay(`q`);
          break;
        case `w`:
          this.setState({ text: beta[1] });
          this.handleClickAndPlay(`w`);
          break;
        case `e`:
          this.setState({ text: beta[2] });
          this.handleClickAndPlay(`e`);
          break;
        case `a`:
          this.setState({ text: beta[3] });
          this.handleClickAndPlay(`a`);
          break;
        case `s`:
          this.setState({ text: beta[4] });
          this.handleClickAndPlay(`s`);
          break;
        case `d`:
          this.setState({ text: beta[5] });
          this.handleClickAndPlay(`d`);
          break;
        case `z`:
          this.setState({ text: beta[6] });
          this.handleClickAndPlay(`z`);
          break;
        case `x`:
          this.setState({ text: beta[7] });
          this.handleClickAndPlay(`x`);
          break;
        case `c`:
          this.setState({ text: beta[8] });
          this.handleClickAndPlay(`c`);
          break;
        default:
          break;
      }
    }
  }

  handleButtonClick(e) {
    if (
      this.state.powerBetaClassName === "power-toggle-on" &&
      this.state.bankAlphaClassName === "bank-toggle-on"
    ) {
      switch (e.target.id) {
        case "Q":
          this.setState({ text: alpha[0] });
          this.handlePlay("Q");
          break;
        case "W":
          this.setState({ text: alpha[1] });
          this.handlePlay("W");
          break;
        case "E":
          this.setState({ text: alpha[2] });
          this.handlePlay("E");
          break;
        case "A":
          this.setState({ text: alpha[3] });
          this.handlePlay("A");
          break;
        case "S":
          this.setState({ text: alpha[4] });
          this.handlePlay("S");
          break;
        case "D":
          this.setState({ text: alpha[5] });
          this.handlePlay("D");
          break;
        case "Z":
          this.setState({ text: alpha[6] });
          this.handlePlay("Z");
          break;
        case "X":
          this.setState({ text: alpha[7] });
          this.handlePlay("X");
          break;
        case "C":
          this.setState({ text: alpha[8] });
          this.handlePlay("C");
          break;
        default:
          break;
      }
    } else if (
      this.state.powerBetaClassName === "power-toggle-on" &&
      this.state.bankBetaClassName === "bank-toggle-on"
    ) {
      switch (e.target.id) {
        case "Q":
          this.setState({ text: beta[0] });
          this.handlePlay("Q");
          break;
        case "W":
          this.setState({ text: beta[1] });
          this.handlePlay("W");
          break;
        case "E":
          this.setState({ text: beta[2] });
          this.handlePlay("E");
          break;
        case "A":
          this.setState({ text: beta[3] });
          this.handlePlay("A");
          break;
        case "S":
          this.setState({ text: beta[4] });
          this.handlePlay("S");
          break;
        case "D":
          this.setState({ text: beta[5] });
          this.handlePlay("D");
          break;
        case "Z":
          this.setState({ text: beta[6] });
          this.handlePlay("Z");
          break;
        case "X":
          this.setState({ text: beta[7] });
          this.handlePlay("X");
          break;
        case "C":
          this.setState({ text: beta[8] });
          this.handlePlay("C");
          break;
        default:
          break;
      }
    }
  }

  handlePowerClick() {
    this.setState({
      // powerAlphaClassName: `${
      //   this.state.powerAlphaClassName === "power-toggle-off"
      //     ? "power-toggle-on"
      //     : "power-toggle-off"
      // }`,
      // powerBetaClassName: `${
      //   this.state.powerBetaClassName === "power-toggle-on"
      //     ? "power-toggle-off"
      //     : "power-toggle-on"
      // }`,
      disabled: `${this.state.disabled === "" ? "true" : ""}`,
    });

    // if (!this.state.disabled) {
    //   this.setState({ text: "" });
    // } else if (this.state.disabled) {
    //   this.setState({ text: "Drum Machine" });
    // }
  }

  handleRangeDrag(e) {
    this.setState({
      text: "Volume: " + e.target.value,
      volume: e.target.value,
    });
  }

  handleBankClick() {
    this.setState({
      bankAlphaClassName: `${
        this.state.bankAlphaClassName === "bank-toggle-off"
          ? "bank-toggle-on"
          : "bank-toggle-off"
      }`,
      bankBetaClassName: `${
        this.state.bankBetaClassName === "bank-toggle-on"
          ? "bank-toggle-off"
          : "bank-toggle-on"
      }`,
    });
  }

  render() {
    return /*#__PURE__*/ React.createElement(
      "div",
      { className: "App" } /*#__PURE__*/,
      React.createElement(
        "div",
        { className: "App-header" } /*#__PURE__*/,
        React.createElement(
          "div",
          { id: "drum-machine" } /*#__PURE__*/,

          React.createElement(
            "div",
            { id: "drum-machine-display" } /*#__PURE__*/,
            React.createElement(
              "div",
              {
                id: "drum-pad-container",
                className: "drum-pad-container",
              } /*#__PURE__*/,
              React.createElement(
                "button",
                {
                  ref: (node) => (this.Qbutton = node),
                  id: "Q",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "Q",
                  className: "clip",

                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1AQdBSq_GzglUbM1zvjTfi95OXiFSe8eM",
                  type: "audio/mp3",
                }),
                "Q"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "W",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "W",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1gWbCmtftvsgK0W1SKdEjPTdlSFNBsVTI",
                  type: "audio/mp3",
                }),
                "W"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "E",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "E",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1roDiMV-i40xDcjjZ76mrWOxJBIwo2KHX",
                  type: "audio/mp3",
                }),
                "E"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "A",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "A",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1-BOkjdUrmEckow1PRwvKa_LBKE_9SFFV",
                  type: "audio/mp3",
                }),
                "A"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "S",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "S",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1vJpSIzm6w8GY4B3UNulQ3ttUaPUE2ov8",
                  type: "audio/mp3",
                }),
                "S"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "D",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "D",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1Bkgi_hiRDtc83iTWyXNeuZSmVXH0ZhBS",
                  type: "audio/mp3",
                }),
                "D"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "Z",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "Z",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1ikjCCg7sMUA5l5WotTtuWmX_fUbeMj94",
                  type: "audio/mp3",
                }),
                "Z"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "X",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "X",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1Qfvntir0i1BDdqNeDv1Cx3PHvbdHTUiy",
                  type: "audio/mp3",
                }),
                "X"
              ) /*#__PURE__*/,

              React.createElement(
                "button",
                {
                  id: "C",
                  className: "drum-pad",
                  onClick: this.handleButtonClick,
                  disabled: this.state.disabled,
                } /*#__PURE__*/,

                React.createElement("audio", {
                  id: "C",
                  className: "clip",
                  volume: this.state.volume / 100,
                  src: "https://drive.google.com/uc?export=download&id=1JaNGuBj_5EyXBgvAg-5BY0PGvaEd6saK",
                  type: "audio/mp3",
                }),
                "C"
              )
            ) /*#__PURE__*/,

            React.createElement(
              "div",
              { className: "controls-container" } /*#__PURE__*/,
              React.createElement(
                "div",
                { className: "power-control" } /*#__PURE__*/,
                React.createElement(
                  "p",
                  { className: "text" },
                  "Power"
                ) /*#__PURE__*/,
                React.createElement(
                  "div",
                  { className: "power-buttons" } /*#__PURE__*/,
                  React.createElement(
                    "label",
                    {
                      className: "switch",

                      onChange: this.handlePowerClick,
                    } /*#__PURE__*/,
                    React.createElement("input", {
                      type: "checkbox",
                      checked:
                        this.state.disabled === "" ? true : false,
                    }) /*#__PURE__*/,
                    React.createElement("span", { className: "slider round" })
                  ) /*#__PURE__*/
                )
              ) /*#__PURE__*/,

              React.createElement(
                "div",
                { className: "text-display" } /*#__PURE__*/,
                React.createElement(
                  "p",
                  { id: "display", className: "text-param" },
                  this.state.text
                )
              ) /*#__PURE__*/,

              React.createElement("input", {
                type: "range",
                min: "0",
                max: "100",
                step: "1",
                className: "volume-control",
                value: this.state.volume,
                onChange: this.handleRangeDrag,
                disabled: this.state.disabled,
              }) /*#__PURE__*/,

              React.createElement(
                "div",
                { className: "bank-control" } /*#__PURE__*/,
                React.createElement(
                  "p",
                  { className: "text" },
                  "Bank"
                ) /*#__PURE__*/,
                React.createElement(
                  "label",
                  {
                    className: "switch",
                    onChange: !this.state.disabled && this.handleBankClick,
                  } /*#__PURE__*/,

                  React.createElement("input", {
                    type: "checkbox",
                  }) /*#__PURE__*/,
                  React.createElement("span", { className: "slider round" })
                )
              )
            )
          )
        )
      )
    );
  }
}

ReactDOM.render(
  /*#__PURE__*/
  React.createElement(
    React.StrictMode,
    null /*#__PURE__*/,
    React.createElement(App, null)
  ),

  document.getElementById("root")
);
