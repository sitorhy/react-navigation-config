import React from "react";

class Navigator {
    _connect(navigator) {
        this.navigator = navigator;
    }

    switchTab() {

    }

    reLaunch() {

    }

    redirectTo() {

    }

    navigateTo() {

    }

    navigateBack() {

    }
}

export default function (AppContainer, acceptNavigator = () => { }, releaseNavigator = () => { }) {
    return class extends React.Component {
        constructor(...args) {
            super(...args);
            this._navigator = new Navigator();
            this._navigator._connect(this);
            acceptNavigator(this._navigator);
        }

        onNavigationStateChange = (prevState, newState, action) => {
            const { onNavigationStateChange } = this.props;

            console.log(prevState);
            console.log(newState);
            console.log(action);

            const {type}=action;
            switch(type)
            {
                case "Navigation/NAVIGATE":{

                }
                break;
            }


            if (typeof onNavigationStateChange === "function") {
                onNavigationStateChange(prevState, newState, action);
            }
        };

        componentWillUnmount() {
            releaseNavigator(this._navigator);
            this._navigator._connect(null);
            this._navigator = null;
        }

        render() {
            const { uriPrefix } = this.props;
            return (
                <AppContainer uriPrefix={uriPrefix} onNavigationStateChange={this.onNavigationStateChange} />
            );
        }
    }
}