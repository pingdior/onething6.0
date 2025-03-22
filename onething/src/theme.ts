import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4ECDC4', // 主色调：柔和的蓝绿色
      light: '#A6E4D0', // 辅助色系：浅薄荷绿
      dark: '#1A535C', // 辅助色系：中性蓝色
    },
    secondary: {
      main: '#FF6B6B', // 点缀色：温暖的珊瑚色
    },
    background: {
      default: '#F7F9FB', // 浅灰背景
    },
    text: {
      primary: '#2D3748', // 深灰文本
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Noto Sans SC", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme; 