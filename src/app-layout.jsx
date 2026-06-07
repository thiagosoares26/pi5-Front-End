import { useState, useEffect } from "react";

export function AppLayout({ children = null }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <div
            className={isDark ? "dark-mode" : ""}
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                transition: "background-color 0.3s ease, color 0.3s ease"
            }}
        >

            <main style={{ flex: 1 }}>
                {children}
            </main>

        </div>
    );
}