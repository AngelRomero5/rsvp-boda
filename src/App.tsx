import './App.css'
import NavBar from './Components/NavBar'
import RSVP from './Components/RSVP'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

function App() {

  return (
    <>
    <MantineProvider>
        <NavBar />
        <RSVP />
    </MantineProvider>
    </>
  )
}

export default App
