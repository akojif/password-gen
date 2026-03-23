import { Component } from "react";
import Toggle from "./components/Toogle";
import Clipboard from "./components/Clipboard";
import sun from "./assets/images/sun.png";
import moon from "./assets/images/moon.png";
import { RandomPassword } from "./utils/RandomPassword";
import "./AppV1.css";

const themeVars = {
  dark:  { background: "#222225", font: "#ffffff" },
  light: { background: "#ffffff", font: "#222225" },
};

class AppV1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      length: 8,
      pwd: "",
      upperCase: true,
      lowerCase: true,
      numeric: true,
      symbol: true,
      theme: "light",
    };
  }

  componentDidMount() {
    this.generatePwd();
  }

  generatePwd() {
    const { upperCase, lowerCase, numeric, symbol, length } = this.state;
    const pwd = new RandomPassword()
      .setLength(length)
      .setLowerCase(lowerCase)
      .setUpperCase(upperCase)
      .setNumberCase(numeric)
      .setSymbol(symbol)
      .generate();
    this.setState({ pwd });
  }

  handleCheckbox(e) {
    const { name, checked } = e.target;
    this.setState({ [name]: checked }, () => this.generatePwd());
  }

  handleLengthChange({ target: { value } }) {
    const length = Math.min(40, Math.max(8, Number(value) || 8));
    this.setState({ length }, () => this.generatePwd());
  }

  changeTheme(e) {
    const next = e.target.checked ? "dark" : "light";
    this.setState({ theme: next });
    const root = document.documentElement;
    root.style.setProperty("--background-color", themeVars[next].background);
    root.style.setProperty("--font-color", themeVars[next].font);
  }

  render() {
    const { pwd, length, upperCase, lowerCase, numeric, symbol, theme } =
      this.state;
    const { version, onVersionSwitch } = this.props;

    return (
      <div className={`v1-app ${theme}`}>
        <div className="v1-container">
          {/* Header */}
          <div className="v1-header-row">
            <h1 className="v1-title">
              Generate a secure password
              <span className="v1-badge">v1</span>
            </h1>
            <div className="v1-header-controls">
              <div className="v1-version-switcher">
                <button
                  className={`v1-version-btn${version === "v1" ? " active" : ""}`}
                  onClick={() => onVersionSwitch("v1")}
                >
                  v1
                </button>
                <button
                  className={`v1-version-btn${version === "v2" ? " active" : ""}`}
                  onClick={() => onVersionSwitch("v2")}
                >
                  v2
                </button>
              </div>
              <div className="v1-switch">
                <Toggle
                  icons={{
                    checked: (
                      <img
                        src={moon}
                        width="16"
                        height="16"
                        role="presentation"
                        alt="dark"
                        style={{ pointerEvents: "none" }}
                      />
                    ),
                    unchecked: (
                      <img
                        src={sun}
                        width="16"
                        height="16"
                        role="presentation"
                        alt="light"
                        style={{ pointerEvents: "none" }}
                      />
                    ),
                  }}
                  checked={theme === "dark"}
                  onChange={(e) => this.changeTheme(e)}
                />
              </div>
            </div>
          </div>

          {/* Password display */}
          <div className="v1-input-row">
            <input
              id="input"
              className={`v1-pwd-input ${theme}`}
              type="text"
              readOnly
              value={pwd}
            />
            <div className="v1-clipboard">
              <Clipboard theme={theme} />
            </div>
          </div>

          <hr className="v1-divider" />

          {/* Options */}
          <section>
            <header>
              <h3 className="v1-section-title">Customize your password</h3>
            </header>
            <fieldset className="v1-fieldset">
              <div className="v1-row">
                <div className="v1-col">
                  {[
                    { label: "Uppercase", name: "upperCase", value: upperCase },
                    { label: "Lowercase", name: "lowerCase", value: lowerCase },
                    { label: "Numeric",   name: "numeric",   value: numeric   },
                    { label: "Symbols",   name: "symbol",    value: symbol    },
                  ].map(({ label, name, value }) => (
                    <label key={name} className="v1-checkbox-label">
                      {label}
                      <input
                        type="checkbox"
                        name={name}
                        checked={value}
                        onChange={(e) => this.handleCheckbox(e)}
                      />
                      <span className="v1-checkmark" />
                    </label>
                  ))}
                </div>

                <div className="v1-col">
                  <div className="v1-length-row">
                    <span>Password Length:</span>
                    <input
                      className="v1-length-input"
                      type="number"
                      min="8"
                      max="40"
                      value={length}
                      onChange={(e) => this.handleLengthChange(e)}
                    />
                  </div>
                  <div className="v1-slider-container">
                    <input
                      className="v1-slider"
                      type="range"
                      min="8"
                      max="40"
                      value={length}
                      onChange={(e) => this.handleLengthChange(e)}
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </section>

          <div className="v1-actions">
            <button
              className="v1-generate-btn"
              onClick={() => this.generatePwd()}
            >
              Generate
            </button>
          </div>

          <div className="v1-footer">
            Made with <span style={{ color: "#e25555" }}>&#9829;</span> by{" "}
            <a href="https://francisakoji.com">Francis Akoji</a>
          </div>
        </div>
      </div>
    );
  }
}

export default AppV1;
