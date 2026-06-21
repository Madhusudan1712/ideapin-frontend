import './App.css'
import { Box } from "@mui/material";
import AppRoutes from "./app/AppRoutes";
import AppFooter from "./components/common/footer/AppFooter";

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box component="main" sx={{ flex: 1 }}>
        <AppRoutes />
      </Box>
      <AppFooter />
    </Box>
  )
}

export default App
