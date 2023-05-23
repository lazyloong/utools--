import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import BinaryConverter from "./Hex";

window.platform = {
    isMacOs: window.utools.isMacOs(),
    isWindows: window.utools.isWindows(),
    isLinux: window.utools.isLinux(),
};

const themeDic = {
    light: createMuiTheme({
        palette: {
            type: "light",
        },
        props: {
            MuiButtonBase: {
                disableRipple: true,
            },
        },
    }),
    dark: createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#90caf9",
            },
            secondary: {
                main: "#f48fb1",
            },
        },
        props: {
            MuiButtonBase: {
                disableRipple: true,
            },
        },
    }),
};

export default class App extends React.Component {
    state = {
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
        enter: null,
        copyIndex: null,
    };

    componentDidMount() {
        window.utools.onPluginEnter((enter) => {
            this.setState({ enter });
        });
        window.utools.onPluginOut(() => {
            this.setState({ enter: null });
        });
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            this.setState({ theme: e.matches ? "dark" : "light" });
        });
        window.addEventListener("keydown", (e) => {
            if (/^Digit([1-9])$/.test(e.code) && (window.platform.isMacOs ? e.metaKey : e.altKey)) {
                e.stopPropagation();
                e.preventDefault();
                this.setState({ copyIndex: [parseInt(RegExp.$1)] });
            }
        });
    }

    getEnterPage = (enter) => {
        switch (enter.code) {
            case "hex":
                return <BinaryConverter {...enter} copyIndex={this.state.copyIndex} />;
            default:
                return false;
        }
    };

    render() {
        const { enter, theme } = this.state;
        if (!enter) return false;
        return (
            <ThemeProvider theme={themeDic[theme]}>
                <div className="app-page">{this.getEnterPage(enter)}</div>
            </ThemeProvider>
        );
    }
}
