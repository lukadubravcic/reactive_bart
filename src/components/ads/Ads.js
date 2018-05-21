import React from 'react';
import agent from '../../agent';

const ROLLUP_DISPLAY_TIME = 3000;
const ROLLUPS_DIRECTORY = '/rollups/';


class Ads extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            activeRollup: null,            
        };

        this.fadeOutTimeout = null;
        this.fadeInTimeout = null;

        this.pickingArray = [];

        this.getRollups = async () => {
            let result = await agent.Rollups.getRollups();
            if (result.length) {
                this.setState({ images: [...result] });
                this.pickingArray = [...result];
                this.initRollupToggle();
            }
        };

        this.initRollupToggle = () => {
            // postaviti incijalni oglas
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
            let index = null;

            if (this.pickingArray.length === 0) {
                this.pickingArray = [...this.state.images];
            }

            index = this.getRandomRollupIndex();

            this.preloadRollup(this.pickingArray[index].image);
            let rollupToShow = this.pickingArray[index];
            this.pickingArray.splice(index, 1);

            setTimeout(() => {
                this.setRollup(rollupToShow);
                this.handleRollups();
            }, ROLLUP_DISPLAY_TIME);
        };

        this.setRollup = async rollup => {            
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
    }

    componentDidMount() {
        this.getRollups();
    }

    render() {

        return (
            <div id="rollups">
                <a href={this.state.activeRollup !== null ? this.state.activeRollup.url : null} target="_blank" rel="noopener noreferrer">
                    <img id="rollup" src={this.state.activeRollup !== null ? `/rollups/${this.state.activeRollup.image}` : null} alt="Rollup" />
                </a>
            </div>
        )
    }
}

export default Ads;




