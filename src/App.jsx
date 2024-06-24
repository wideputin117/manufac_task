import React from 'react';
import './App.css';
import MainApp from './table1';
import { MantineProvider } from '@mantine/core';
function App() {
  return (
     
      <MantineProvider>
        <div>
      <MainApp />
      </div>
      </MantineProvider>
   


     
  );
}

export default App;