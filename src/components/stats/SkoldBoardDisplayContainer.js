import React from 'react';
import SkoldBoardTable from './SkoldBoardTable';


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
                this.setState({ height: 800 + "px" });
                this.animationTimeout = setTimeout(this.renderContent, 750)
            });
        });
    }

    render() {

        const style = { height: this.state.height };

        return (
            <div style={style} className="height-tran">
                {this.state.readyToRender ? <SkoldBoardTable data={this.props.data} /> : null}
            </div>
        )
    }
}

export default SkoldBoardDisplayContainer;