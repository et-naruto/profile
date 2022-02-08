import '../styles/globals.css'
import toast, { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
