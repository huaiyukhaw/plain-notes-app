import { NotesList } from "./components/NotesList";
import { Search } from "./components/Search";
import { CreateNote } from "./components/CreateNote";
import { NoteProvider } from "./context/noteContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
  return (
    <NoteProvider>
      <div className="mx-auto flex min-h-screen max-w-[1408px] flex-col gap-4 overflow-x-hidden bg-white/30 p-4">
        <Header />
        <Search />
        <CreateNote />
        <div className="flex-1">
          <NotesList />
        </div>
        <Footer />
      </div>
    </NoteProvider>
  );
}

export default App;
