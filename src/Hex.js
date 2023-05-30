import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";

export default class BinaryConverter extends React.Component {
    constructor(props) {
        super(props);
        this.addButtonRef = React.createRef();
        this.subtractButtonRef = React.createRef();
        this.colors = ["#eeeeee", "#aaffe5", "#aaeeff"];
        this.state = {
            copy: [false, ""],
            binary: Array(8).fill(0),
            decimal: 0,
            colors: Array(8).fill(0),
        };
    }

    componentDidUpdate(prevProps, prevState) {
        let binary = prevState.binary.slice();
        if (binary.length == 8) {
            this.subtractButtonRef.current.disabled = true;
            this.subtractButtonRef.current.style.color = "#616161";
        } else {
            this.subtractButtonRef.current.disabled = false;
            this.subtractButtonRef.current.style.color = "#000";
        }
        if (binary.length == 32) {
            this.addButtonRef.current.disabled = true;
            this.addButtonRef.current.style.color = "#616161";
        } else {
            this.addButtonRef.current.disabled = false;
            this.addButtonRef.current.style.color = "#000";
        }
    }

    changeBinaryLength(n) {
        let binary = this.state.binary.slice(),
            colors = this.state.colors.slice();

        if (n > binary.length && binary.length != 32) {
            binary = Array(binary.length).fill(0).concat(binary);
            colors = Array(colors.length).fill(0).concat(colors);
        } else if (n < binary.length && binary.length != 8) {
            binary = binary.slice(binary.length / 2);
            colors = colors.slice(colors.length / 2);
        }
        const decimal = parseInt(binary.join(""), 2);
        console.log(binary, colors);
        this.setState({ binary, decimal, colors });
    }

    handleBinaryOperation(i) {
        let binary = this.state.binary.slice();
        if (i) this.changeBinaryLength(binary.length * 2);
        else this.changeBinaryLength(binary.length / 2);
    }

    handleBinaryClick(i) {
        const binary = this.state.binary.slice();
        binary[i] = binary[i] === 0 ? 1 : 0;
        const decimal = parseInt(binary.join(""), 2);
        this.setState({ binary, decimal });
    }

    handleBinaryRightClick(i) {
        let color = this.state.colors.slice();
        color[i] = (color[i] + 1) % this.colors.length;
        this.setState({ colors: color });
    }

    handleDecimalChange(e, hexadecimal) {
        const decimal = e.target.value == "" ? 0 : parseInt(e.target.value, hexadecimal);
        let binaryStr = decimal.toString(2);
        let length = Math.pow(2, Math.ceil(Math.log2(binaryStr.length)));
        length = length < 8 ? 8 : length;
        binaryStr = binaryStr.padStart(length, "0");
        const binary = binaryStr.split("").map(Number);
        this.setState({ binary, decimal });
    }

    handleCopyBinary() {
        let binaryStr = this.state.binary.join("");
        navigator.clipboard.writeText(binaryStr).then(
            () => {
                this.setState({ copy: [true, "复制成功"] });
            },
            (err) => {
                this.setState({ copy: [true, "无法复制"] });
                console.error("无法复制", err);
            }
        );
    }
    handleClose() {
        this.setState({ copy: [false, ""] });
    }

    /*
public class Main {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int m = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int[] dp = new int[m + 1];
        for (int i = 0; i < n; i++) {
            for (int j = m; j >= arr[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - arr[i]] + arr[i]);
            }
        }
        System.out.println(dp[m]);
    }
}
*/
    render() {
        return (
            <div>
                <div className="hex-page">
                    <div className="container">
                        <div className="buttons">
                            {this.state.binary.map((value, i) => (
                                <Button
                                    key={i}
                                    onClick={() => this.handleBinaryClick(i)}
                                    onContextMenu={() => this.handleBinaryRightClick(i)}
                                    style={{ backgroundColor: this.colors[this.state.colors[i]] }}
                                >
                                    {value}
                                </Button>
                            ))}
                        </div>
                        <div className="operation">
                            <Button ref={this.addButtonRef} onClick={() => this.handleBinaryOperation(1)}>
                                +
                            </Button>
                            <Button ref={this.subtractButtonRef} onClick={() => this.handleBinaryOperation(0)}>
                                -
                            </Button>
                            <Button onClick={() => this.handleCopyBinary()}>复制</Button>
                        </div>
                    </div>
                    <TextField
                        fullWidth
                        variant="filled"
                        onChange={(e) => this.handleDecimalChange(e, 8)}
                        value={this.state.decimal.toString(8)}
                        label="8 进制"
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        onChange={(e) => this.handleDecimalChange(e, 10)}
                        value={this.state.decimal.toString(10)}
                        label="10 进制"
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        onChange={(e) => this.handleDecimalChange(e, 16)}
                        value={this.state.decimal.toString(16)}
                        label="16 进制"
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        onChange={(e) => this.handleDecimalChange(e, 32)}
                        value={this.state.decimal.toString(32)}
                        label="32 进制"
                    />
                </div>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    autoHideDuration={750}
                    open={this.state.copy[0]}
                    message={this.state.copy[1]}
                    onClose={() => this.handleClose()}
                    onClick={() => this.handleClose()}
                />
            </div>
        );
    }
}
