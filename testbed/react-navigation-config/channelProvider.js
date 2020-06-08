"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(store, routeKey) {
  return class extends _react.default.Component {
    constructor(props) {
      super(props);
      this.observer = new _common.ObserveStore(store);
      var channelModule = (0, _common.getChannelModule)(store.getState());
      this.state = {
        channel: (0, _common.getScreenPropsFromChannelModule)(routeKey, channelModule)
      };
    }

    componentDidMount() {
      if (this.observer) {
        this.observer.start((state, call) => {
          var channelModule = (0, _common.getChannelModule)(state);

          if (!(!Object.hasOwnProperty.call(channelModule, routeKey) && this.state.channel === undefined) && typeof call === "function") {
            call((0, _common.getScreenPropsFromChannelModule)(routeKey, channelModule));
          }
        }, channel => {
          this.setState({
            channel
          });
        });
      }
    }

    componentWillUnmount() {
      if (this.observer) {
        this.observer.dispose();
        this.observer = null;
      }
    }

    render() {
      var Children = this.props.children;
      return typeof Children === "function" ? /*#__PURE__*/_react.default.createElement(Children, this.state.channel) : Children;
    }

  };
}