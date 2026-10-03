import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/debait/Nav";
import { Hero } from "@/components/debait/Hero";
import { Intro, Stats, Theme, Tournament } from "@/components/debait/Story";
import { Scoring, SwitchRound, Zones } from "@/components/debait/Match";
import { Closing, Live, Rules, Schedule, Teams } from "@/components/debait/Info";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DE'BAIT — Same Minds, Different Arguments | Orators' Club MJCET" },
      {
        name: "description",
        content:
          "DE'BAIT, the two-day debate tournament by Orators' Club MJCET. 16 teams, theme: Social Media & Digital Natives.",
      },
      { property: "og:title", content: "DE'BAIT — Same Minds, Different Arguments" },
      {
        property: "og:description",
        content: "16 teams. 2 days. One Switch Round. The Orators' Club MJCET debate on Social Media & Digital Natives.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Nav />
      <Hero />
      <Intro />
      <Theme />
      <Stats />
      <Tournament />
      <Zones />
      <SwitchRound />
      <Scoring />
      <Schedule />
      <Teams />
      <Rules />
      <Live />
      <Closing />
    </main>
  );
}
