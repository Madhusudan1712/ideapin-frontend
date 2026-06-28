import { lazy } from "react";

const Home = lazy(() => import("../../pages/home/HomePage"));
const Feed = lazy(() => import("../../pages/feed/FeedPage"));
const MyNotes = lazy(() => import("../../pages/mynotes/MyNotesPage"));


export const tabsData = [
  {
    key: "home",
    label: "Home",
    component: Home,
    path: "/home",
    icon: "lucide:home"
  },
  {
    key: "feed",
    label: "Feed",
    component: Feed,
    path: "/feed",
    icon: "lucide:rss"
  },
  {
    key: "mynotes",
    label: "My Notes",
    component: MyNotes,
    path: "/mynotes",
    icon: "lucide:notebook"
  }
];

