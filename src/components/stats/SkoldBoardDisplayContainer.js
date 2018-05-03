import React from 'react';
import SkoldBoardTable from './SkoldBoardTable';

const sizeOfTableRow = 60; // 60px
const tableBottomBorderSize = 10; // 10px

// komponent koja samo renda mjesto za tablicu, tablica je zasebna komponenta
class SkoldBoardDisplayContainer extends React.Component {
    constructor(props) {
        super(props);
        this.animationTimeout = null;
        this.state = {
            height: 0,
            readyToRender: false,
        }

        this.renderContent = () => {
            this.setState({ readyToRender: true })
        }
    }

    componentDidMount() {
        // animiraj stvaranje mjesta za tablicu
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.setState({ height: ((Object.keys(this.props.data).length + 1) * sizeOfTableRow + tableBottomBorderSize) + "px" });
                this.animationTimeout = setTimeout(this.renderContent, 750)
            });
        });
    }

    render() {
        const style = {
            height: this.state.height,
            marginTop: 50 + "px",
        };

        return (
            <div style={style} className="height-tran">
                {this.state.readyToRender ? <SkoldBoardTable data={this.props.data} currentUser={this.props.currentUser} /> : null}
            </div>
        )
    }
}

export default SkoldBoardDisplayContainer;