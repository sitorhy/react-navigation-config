import React from 'react';

import baseRoutes from './config/baseRoutes';
import {renderNavigation} from './lib';

function App(): React.JSX.Element {
  return renderNavigation(baseRoutes);
}
export default App;
