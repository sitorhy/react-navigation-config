export function navigationOptions(navigationOptions = {})
{
    return (Component) =>
    {
        return class extends Component
        {
            static navigationOptions = navigationOptions;
        };
    };
}
