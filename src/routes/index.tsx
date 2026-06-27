import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Data Structures Visualizer — Learn, Visualize, Master" },
      { name: "description", content: "Interactive data structures visualizer and learning platform. Animated simulators for arrays, linked lists, stacks, queues, trees, heaps, tries, and graphs." },
      { property: "og:title", content: "Data Structures Visualizer" },
      { property: "og:description", content: "Learn, Visualize, and Master Data Structures with interactive animated simulators." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/visualizer/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0f1a", color: "#e6e9f2", fontFamily: "system-ui, sans-serif" }}>
      Loading Data Structures Visualizer…
    </div>
  );
}
