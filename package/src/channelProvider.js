import React from "react";
import {getChannelModule, getScreenPropsFromChannelModule, ObserveStore} from "./common";

export default function (store, routeKey)
{
    return class extends React.Component
    {
        constructor(props)
        {
            super(props);
            this.observer = new ObserveStore(store);
            const channelModule = getChannelModule(store.getState());
            this.state = {
                channel: getScreenPropsFromChannelModule(routeKey, channelModule)
            }
        }

        componentDidMount()
        {
            if (this.observer)
            {
                this.observer.start((state, call) =>
                {
                    const channelModule = getChannelModule(state);
                    if (!(!Object.hasOwnProperty.call(channelModule, routeKey) && this.state.channel === undefined) && typeof call === "function")
                    {
                        call(getScreenPropsFromChannelModule(routeKey, channelModule));
                    }
                }, (channel) =>
                {
                    this.setState({
                        channel
                    });
                });
            }
        }

        componentWillUnmount()
        {
            if (this.observer)
            {
                this.observer.dispose();
                this.observer = null;
            }
        }

        render()
        {
            const Children = this.props.children;
            return typeof Children === "function" ? <Children {...this.state.channel}/> : Children;
        }
    }
}