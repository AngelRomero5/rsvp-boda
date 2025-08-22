import './App.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

import RSVP from './Components/RSVP'

function App() {

  return (
    <>
    <MantineProvider>
        <RSVP />
    </MantineProvider>
    </>
  )
}

export default App
