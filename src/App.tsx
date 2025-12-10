import { Routes, Route, Navigate } from "react-router"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import SoftwareUpgrade from "./pages/software-upgrade"
import ReduxPersistParse from "./pages/redux-persist-parse"

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/software-upgrade" replace />} />
            <Route path="/software-upgrade" element={<SoftwareUpgrade />} />
            <Route path="/redux-persist-parse" element={<ReduxPersistParse />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
