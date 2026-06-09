import { Toaster } from './components/ui/sonner'
import AppRoutes from './routes/AppRoutes'

const App = () => {
   return (
      <>
         <Toaster position='top-center' richColors closeButton />
         <AppRoutes />
      </>
   );
};

export default App;
