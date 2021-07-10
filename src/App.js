import { Route } from 'react-router-dom';
import AppBar from './components/AppBar';
import GalleryPage from './views/Gallery';
import ImageDetails from './views/ImageDetails';
import { useEffect } from "react";
import { fetchImages } from "./redux/gallery/gallery-operations";
import { useDispatch } from 'react-redux';

function App() {

  const dispatch = useDispatch();

  useEffect(() => dispatch(fetchImages()), []);

  return (
    <div className="App">
      <AppBar/>
      <main className="section-gallery">
        <Route exact path="/" component={GalleryPage} />
        <Route path="/:id" component={ImageDetails} />
      </main>
    </div>
  );
}

export default App;
