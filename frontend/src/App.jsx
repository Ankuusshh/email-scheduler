import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComposeEmail from "./pages/ComposeEmail";

function App() {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [page, setPage] = useState("dashboard");

    if (!token) {
        return (
            <Login onLogin={setToken} />
        );
    }

    if (page === "compose") {
        return (
            <ComposeEmail
                token={token}
                onBack={() => setPage("dashboard")}
            />
        );
    }

    return (
        <Dashboard
            token={token}
            onLogout={() => {
                localStorage.removeItem("token");
                setToken(null);
            }}
            onCompose={() => setPage("compose")}
        />
    );
}

export default App;