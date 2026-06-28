import './App.css'
import { Box } from "@mui/material";
import AppRoutes from "./app/AppRoutes";

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppRoutes />
      </Box>
    </Box>
  )
}

export default App;
