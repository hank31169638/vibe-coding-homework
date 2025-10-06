import { Suspense } from "react";
import SnakeGame from "./components/SnakeGame";
import "@fontsource/inter";

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <Suspense fallback={
        <div style={{ color: 'white', fontSize: '24px' }}>Loading Snake Game...</div>
      }>
        <SnakeGame />
      </Suspense>
    </div>
  );
}

export default App;
