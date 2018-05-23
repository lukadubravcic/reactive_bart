import React from 'react';
import agent from '../../agent';

const ROLLUP_DISPLAY_TIME = 30000;
const ROLLUPS_DIRECTORY = '/rollups/';


class Ads extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            images: [],
            activeRollup: null,
            hovering: false,
        };

        this.hovering = false;
        this.timeOutFinished = false;
        this.rollupToShow = null;

        this.toggleTimeout = null;

        this.pickingArray = [];

        this.getRollups = async () => {
            let result = await agent.Rollups.getRollups();

            if (result !== null && result.length) {
                this.setState({ images: [...result] });
                this.pickingArray = [...result];
                this.initRollupToggle();
            }
        };

        this.initRollupToggle = () => {
            if (this.state.images.length === 1) this.setRollup(this.state.images[0]);
            else {
                let randIndex = this.getRandomRollupIndex();
                this.preloadRollup(this.pickingArray[randIndex].image)
                this.setRollup(this.pickingArray[randIndex]);
                this.pickingArray.splice(randIndex, 1);

                this.handleRollups();
            }
        };

        this.handleRollups = () => {
            if (this.state.images.length === 1) return;
            this.rollupToShow = this.setupNextRollup();

            this.timeOutFinished = false;

            if (!this.hovering) {

                this.toggleTimeout = setTimeout(() => {
                    this.timeOutFinished = true;
                    clearTimeout(this.toggleTimeout)

                    if (!this.hovering) {
                        this.setRollup(this.rollupToShow);
                        this.handleRollups();
                    }
                }, ROLLUP_DISPLAY_TIME);
            }
        };

        this.setupNextRollup = () => {
            let index = null;

            if (this.pickingArray.length === 0) {
                this.pickingArray = [...this.state.images];
            }

            index = this.getRandomRollupIndex();

            this.preloadRollup(this.pickingArray[index].image);
            let rollupToShow = this.pickingArray[index];
            this.pickingArray.splice(index, 1);

            return rollupToShow;
        }

        this.setRollup = rollup => {
            return this.setState({ activeRollup: rollup });
        };


        this.preloadRollup = rollupURL => {
            return new Promise((resolve, reject) => {
                let rollup = new Image();
                rollup.onload = () => resolve(true);
                rollup.onerror = err => reject(false);
                rollup.src = ROLLUPS_DIRECTORY + rollupURL;
            });
        };

        this.getRandomRollupIndex = () => {
            if (this.pickingArray.length > 0) {
                let newIndex = Math.floor(Math.random() * this.pickingArray.length);
                while (this.pickingArray[newIndex] === this.state.activeRollup) {
                    newIndex = Math.floor(Math.random() * this.pickingArray.length);
                }
                return newIndex;
            }
            else return null;
        };

        this.hoverIn = ev => {
            ev.preventDefault();
            this.hovering = true;

        }

        this.hoverOut = ev => {
            ev.preventDefault();
            this.hovering = false;
            if (this.timeOutFinished) {
                this.rollupToShow = this.setupNextRollup();
                this.setRollup(this.rollupToShow);
                this.handleRollups()
            }
        }
    }

    componentDidMount() {
        this.getRollups();
    }

    componentWillUnmount() {
        clearTimeout(this.toggleTimeout);
    }

    render() {

        return (
            <div id="rollups">
                <a
                    href={this.state.activeRollup !== null ? this.state.activeRollup.url : null}
                    target="_blank"
                    rel="noopener noreferrer">
                    <img
                        id="rollup"
                        src={this.state.activeRollup !== null ? `/rollups/${this.state.activeRollup.image}` : null}
                        alt="Rollup"
                        onMouseOver={this.hoverIn}
                        onMouseOut={this.hoverOut} />
                </a>
            </div>
        )
    }
}

export default Ads;




