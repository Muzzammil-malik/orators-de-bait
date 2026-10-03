import { useState } from "react";
import type { Match, TournamentTree } from "@/content/tournament";
import { ChampionNode } from "./ChampionNode";

interface TournamentBracketProps {
  tree: TournamentTree;
  selectedMatchId?: string;
  onSelectMatch: (matchId: string) => void;
  onOpenMatchModal: (matchId: string) => void;
}

export function TournamentBracket({
  tree,
  selectedMatchId,
  onSelectMatch,
  onOpenMatchModal,
}: TournamentBracketProps) {
  // Mobile stage tab: "prelims" | "qf" | "sf" | "final"
  const [mobileStage, setMobileStage] = useState<"prelims" | "qf" | "sf" | "final">("sf");
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);

  const { preliminaries = [], quarterFinals, semiFinals, final, champion } = tree;

  // 8 Preliminary rounds: 4 on left side, 4 on right side
  const prelimsLeft = preliminaries.slice(0, 4);  // PR 01, PR 02, PR 03, PR 04
  const prelimsRight = preliminaries.slice(4, 8); // PR 05, PR 06, PR 07, PR 08

  // 4 Quarterfinals: 2 on left, 2 on right
  const qfLeft = quarterFinals.slice(0, 2); // QF 1 (PR 1+2), QF 2 (PR 3+4)
  const qfRight = quarterFinals.slice(2, 4); // QF 3 (PR 5+6), QF 4 (PR 7+8)

  // 2 Semifinals: SF 1 (left), SF 2 (right)
  const sfLeft = semiFinals[0];
  const sfRight = semiFinals[1];

  return (
    <section id="tree" className="grain relative bg-ivory py-8 md:py-14 overflow-x-hidden" aria-label="Tournament Bracket">
      <div className="w-full px-2 md:px-4">
        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <div className="mb-1 flex items-center gap-3 font-type text-xs uppercase tracking-widest text-ink">
              <span className="bg-ink px-2 py-0.5 text-sun">STAGE 01</span>
              <span>16 Teams · 8 Prelims (4 Left · 4 Right) → Top 8 Knockout</span>
            </div>
            <h2 className="display text-4xl text-ink md:text-6xl">
              Tournament <span className="text-hot">Tree.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-type">
            <span className="flex items-center gap-1.5 border border-ink bg-paper px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-hot" />
              <span className="text-ink">Live Match</span>
            </span>
            <span className="flex items-center gap-1.5 border border-ink bg-sun px-2 py-1 font-bold text-ink">
              <span>★</span>
              <span>Advancing Team</span>
            </span>
            <span className="flex items-center gap-1.5 border border-ink/40 bg-paper px-2 py-1 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-stone" />
              <span>Completed / Upcoming</span>
            </span>
          </div>
        </div>

        {/* Mobile Stage Selector (Tab controls under 1200px) */}
        <div className="mb-6 flex flex-wrap gap-2 xl:hidden" role="tablist" aria-label="Bracket stages">
          {[
            { id: "prelims", label: "Prelims", count: 8 },
            { id: "qf", label: "Quarterfinals", count: 4 },
            { id: "sf", label: "Semifinals", count: 2 },
            { id: "final", label: "Championship", count: 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mobileStage === tab.id}
              onClick={() => setMobileStage(tab.id as "prelims" | "qf" | "sf" | "final")}
              className={`flex-1 min-w-[120px] border-2 border-ink px-3 py-2 text-center font-type text-xs uppercase tracking-wider transition-colors ${
                mobileStage === tab.id
                  ? "bg-ink text-sun shadow-[2px_2px_0_var(--hot)] font-bold"
                  : "bg-paper text-ink hover:bg-sun/40"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* DESKTOP TOURNAMENT TREE (7-Column Symmetrical Layout — full-viewport, no horizontal scroll) */}
        <div className="hidden lg:block w-full overflow-hidden pb-6">
          <div className="w-full">
            {/* Column Titles */}
            <div className="grid grid-cols-[1.1fr_1fr_0.9fr_1.1fr_0.9fr_1fr_1.1fr] gap-1.5 mb-3 text-center font-type text-[9px] font-bold uppercase tracking-wider text-ink">
              <div className="border-b-2 border-ink bg-paper/70 py-1 px-0.5 leading-tight">
                PRELIMS<br/><span className="opacity-60">(LEFT · 4)</span>
              </div>
              <div className="border-b-2 border-ink bg-paper/70 py-1 px-0.5 leading-tight">
                QF<br/><span className="opacity-60">(LEFT)</span>
              </div>
              <div className="border-b-2 border-ink bg-paper/70 py-1 px-0.5 leading-tight">
                SF<br/><span className="opacity-60">01</span>
              </div>
              <div className="border-b-2 border-hot bg-sun/50 py-1 px-0.5 text-hot leading-tight">
                GRAND<br/><span className="opacity-80">FINAL</span>
              </div>
              <div className="border-b-2 border-ink bg-paper/70 py-1 px-0.5 leading-tight">
                SF<br/><span className="opacity-60">02</span>
              </div>
              <div className="border-b-2 border-ink bg-paper/70 py-1 px-0.5 leading-tight">
                QF<br/><span className="opacity-60">(RIGHT)</span>
              </div>
              <div className="border-b-2 border-ink bg-paper/70 py-1 px-0.5 leading-tight">
                PRELIMS<br/><span className="opacity-60">(RIGHT · 4)</span>
              </div>
            </div>

            {/* Visual Tree Grid with 7 Connected Columns */}
            <div className="grid grid-cols-[1.1fr_1fr_0.9fr_1.1fr_0.9fr_1fr_1.1fr] items-center gap-1.5 relative py-2">
              {/* SVG Connecting Lines Layer */}
              <svg
                className="absolute inset-0 pointer-events-none w-full h-full z-0"
                style={{ overflow: "visible" }}
                aria-hidden="true"
              >
                {/* Connectors: Left Prelims 1&2 to QF 1 */}
                <path d="M 15.5% 12.5% L 17% 12.5% L 17% 25% L 18.5% 25%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M 15.5% 37.5% L 17% 37.5% L 17% 25% L 18.5% 25%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />

                {/* Connectors: Left Prelims 3&4 to QF 2 */}
                <path d="M 15.5% 62.5% L 17% 62.5% L 17% 75% L 18.5% 75%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M 15.5% 87.5% L 17% 87.5% L 17% 75% L 18.5% 75%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />

                {/* Connectors: Left QF 1&2 to SF 1 */}
                <path d="M 29% 25% L 31% 25% L 31% 50% L 33% 50%" fill="none" stroke="var(--ink)" strokeWidth="2" />
                <path d="M 29% 75% L 31% 75% L 31% 50% L 33% 50%" fill="none" stroke="var(--ink)" strokeWidth="2" />

                {/* Connector: SF 1 to Grand Final */}
                <path d="M 43% 50% L 46.5% 50%" fill="none" stroke="var(--ink)" strokeWidth="2.5" />

                {/* Connector: SF 2 to Grand Final */}
                <path d="M 57% 50% L 53.5% 50%" fill="none" stroke="var(--ink)" strokeWidth="2.5" />

                {/* Connectors: Right QF 3&4 to SF 2 */}
                <path d="M 71% 25% L 69% 25% L 69% 50% L 67% 50%" fill="none" stroke="var(--ink)" strokeWidth="2" />
                <path d="M 71% 75% L 69% 75% L 69% 50% L 67% 50%" fill="none" stroke="var(--ink)" strokeWidth="2" />

                {/* Connectors: Right Prelims 5&6 to QF 3 */}
                <path d="M 84.5% 12.5% L 83% 12.5% L 83% 25% L 81.5% 25%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M 84.5% 37.5% L 83% 37.5% L 83% 25% L 81.5% 25%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />

                {/* Connectors: Right Prelims 7&8 to QF 4 */}
                <path d="M 84.5% 62.5% L 83% 62.5% L 83% 75% L 81.5% 75%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M 84.5% 87.5% L 83% 87.5% L 83% 75% L 81.5% 75%" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
              </svg>

              {/* Column 1: Preliminaries Left */}
              <div className="relative z-10 flex flex-col gap-2 justify-between py-1">
                {prelimsLeft.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    compact
                    isSelected={selectedMatchId === match.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(match.id)}
                    onOpenModal={() => onOpenMatchModal(match.id)}
                  />
                ))}
              </div>

              {/* Column 2: Quarterfinals Left */}
              <div className="relative z-10 flex flex-col gap-6 justify-around py-3">
                {qfLeft.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    compact
                    isSelected={selectedMatchId === match.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(match.id)}
                    onOpenModal={() => onOpenMatchModal(match.id)}
                  />
                ))}
              </div>

              {/* Column 3: Semifinal Left */}
              <div className="relative z-10 flex flex-col justify-center py-3">
                {sfLeft && (
                  <BracketMatchCard
                    match={sfLeft}
                    compact
                    isSelected={selectedMatchId === sfLeft.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(sfLeft.id)}
                    onOpenModal={() => onOpenMatchModal(sfLeft.id)}
                  />
                )}
              </div>

              {/* Column 4: Center Grand Final & Champion */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-3">
                <ChampionNode
                  champion={champion}
                  finalCompleted={final.status === "completed"}
                />
                <div className="w-full">
                  <BracketMatchCard
                    match={final}
                    isFinal
                    compact
                    isSelected={selectedMatchId === final.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(final.id)}
                    onOpenModal={() => onOpenMatchModal(final.id)}
                  />
                </div>
              </div>

              {/* Column 5: Semifinal Right */}
              <div className="relative z-10 flex flex-col justify-center py-3">
                {sfRight && (
                  <BracketMatchCard
                    match={sfRight}
                    compact
                    isSelected={selectedMatchId === sfRight.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(sfRight.id)}
                    onOpenModal={() => onOpenMatchModal(sfRight.id)}
                  />
                )}
              </div>

              {/* Column 6: Quarterfinals Right */}
              <div className="relative z-10 flex flex-col gap-6 justify-around py-3">
                {qfRight.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    compact
                    isSelected={selectedMatchId === match.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(match.id)}
                    onOpenModal={() => onOpenMatchModal(match.id)}
                  />
                ))}
              </div>

              {/* Column 7: Preliminaries Right */}
              <div className="relative z-10 flex flex-col gap-2 justify-between py-1">
                {prelimsRight.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    compact
                    isSelected={selectedMatchId === match.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(match.id)}
                    onOpenModal={() => onOpenMatchModal(match.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE RESPONSIVE BRACKET VIEW (Tabs for Prelims, QF, SF, Final) */}
        <div className="lg:hidden space-y-6">
          {mobileStage === "prelims" && (
            <div className="space-y-6">
              <div>
                <div className="font-type text-xs uppercase tracking-widest text-ink font-bold pb-2 border-b-2 border-ink flex items-center justify-between">
                  <span>Left Bracket Prelims (Matches 01–04)</span>
                  <span className="text-hot">Top 4 Advance to QF 1 &amp; 2</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 mt-3">
                  {prelimsLeft.map((match) => (
                    <BracketMatchCard
                      key={match.id}
                      match={match}
                      isSelected={selectedMatchId === match.id}
                      hoveredTeamId={hoveredTeamId}
                      onHoverTeam={setHoveredTeamId}
                      onSelect={() => onSelectMatch(match.id)}
                      onOpenModal={() => onOpenMatchModal(match.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="font-type text-xs uppercase tracking-widest text-ink font-bold pb-2 border-b-2 border-ink flex items-center justify-between">
                  <span>Right Bracket Prelims (Matches 05–08)</span>
                  <span className="text-hot">Top 4 Advance to QF 3 &amp; 4</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 mt-3">
                  {prelimsRight.map((match) => (
                    <BracketMatchCard
                      key={match.id}
                      match={match}
                      isSelected={selectedMatchId === match.id}
                      hoveredTeamId={hoveredTeamId}
                      onHoverTeam={setHoveredTeamId}
                      onSelect={() => onSelectMatch(match.id)}
                      onOpenModal={() => onOpenMatchModal(match.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {mobileStage === "qf" && (
            <div className="space-y-4">
              <div className="font-type text-xs uppercase tracking-widest text-muted-foreground pb-2 border-b border-ink/20">
                Top 8 Quarterfinals (Fed by 8 Preliminary Round Winners)
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {quarterFinals.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    isSelected={selectedMatchId === match.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(match.id)}
                    onOpenModal={() => onOpenMatchModal(match.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {mobileStage === "sf" && (
            <div className="space-y-4">
              <div className="font-type text-xs uppercase tracking-widest text-muted-foreground pb-2 border-b border-ink/20">
                Final Four Semifinals (Winners Advance to Championship)
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {semiFinals.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    isSelected={selectedMatchId === match.id}
                    hoveredTeamId={hoveredTeamId}
                    onHoverTeam={setHoveredTeamId}
                    onSelect={() => onSelectMatch(match.id)}
                    onOpenModal={() => onOpenMatchModal(match.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {mobileStage === "final" && (
            <div className="space-y-6">
              <ChampionNode
                champion={champion}
                finalCompleted={final.status === "completed"}
              />
              <div className="max-w-md mx-auto">
                <BracketMatchCard
                  match={final}
                  isFinal
                  isSelected={selectedMatchId === final.id}
                  hoveredTeamId={hoveredTeamId}
                  onHoverTeam={setHoveredTeamId}
                  onSelect={() => onSelectMatch(final.id)}
                  onOpenModal={() => onOpenMatchModal(final.id)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Help */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink/20 pt-4 text-xs font-type text-muted-foreground">
          <div>
            💡 <strong className="text-ink">Progression:</strong> 16 Teams → 8 Prelims (4 Left / 4 Right) → 4 Quarterfinals → 2 Semifinals → 1 Grand Final. Click any card to load into the Live Scorecard.
          </div>
          <div className="text-stone">
            All match results verified by Orators&rsquo; Club Tabulation Desk.
          </div>
        </div>
      </div>
    </section>
  );
}

interface BracketMatchCardProps {
  match: Match;
  isFinal?: boolean;
  isSelected?: boolean;
  compact?: boolean;
  hoveredTeamId: string | null;
  onHoverTeam: (teamId: string | null) => void;
  onSelect: () => void;
  onOpenModal: () => void;
}

function BracketMatchCard({
  match,
  isFinal,
  isSelected,
  compact,
  hoveredTeamId,
  onHoverTeam,
  onSelect,
  onOpenModal,
}: BracketMatchCardProps) {
  const isLive = match.status === "live";
  const isCompleted = match.status === "completed";

  const isWinnerA = isCompleted && match.winnerTeamId === match.teamA?.id;
  const isWinnerB = isCompleted && match.winnerTeamId === match.teamB?.id;

  const isEliminatedA = isCompleted && !isWinnerA && !!match.winnerTeamId;
  const isEliminatedB = isCompleted && !isWinnerB && !!match.winnerTeamId;

  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer border-2 transition-all ${
        isLive
          ? "border-hot bg-paper shadow-[3px_3px_0_var(--hot)] ring-1 ring-hot/30"
          : isSelected
          ? "border-ink bg-sun shadow-[3px_3px_0_var(--ink)]"
          : "border-ink bg-paper shadow-[2px_2px_0_var(--ink)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)]"
      }`}
    >
      {/* Top Match Header Strip */}
      <div
        className={`flex items-center justify-between border-b-2 border-ink px-1.5 py-0.5 font-type text-[9px] uppercase tracking-wider ${
          isLive
            ? "bg-hot text-paper font-bold"
            : isFinal
            ? "bg-sun text-ink font-bold"
            : "bg-ivory text-ink"
        }`}
      >
        <span className="font-bold truncate">{match.roundLabel}</span>
        {isLive && (
          <span className="flex items-center gap-0.5 font-bold shrink-0">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-paper" />
            Z{match.zone}
          </span>
        )}
        {isCompleted && (
          <span className="text-[8px] text-muted-foreground shrink-0">✓</span>
        )}
        {!isLive && !isCompleted && (
          <span className="text-[8px] text-stone shrink-0">–</span>
        )}
      </div>

      {/* Team A Row */}
      <div
        onMouseEnter={() => match.teamA && onHoverTeam(match.teamA.id)}
        onMouseLeave={() => onHoverTeam(null)}
        className={`flex items-center justify-between border-b border-ink/20 px-1.5 py-1 transition-colors ${
          isWinnerA ? "bg-sun/40 font-bold" : ""
        } ${isEliminatedA ? "opacity-50 bg-ivory/50" : ""} ${
          hoveredTeamId && match.teamA && hoveredTeamId === match.teamA.id
            ? "bg-sun/60"
            : ""
        }`}
      >
        <div className="flex items-center gap-1 overflow-hidden min-w-0">
          <span
            className={`display flex h-4 w-4 shrink-0 items-center justify-center border border-ink text-[9px] ${
              isWinnerA ? "bg-ink text-sun" : "bg-paper text-ink"
            }`}
          >
            {match.teamA ? String(match.teamA.number).padStart(2, "0") : "–"}
          </span>
          <span className="truncate font-type text-[9px] uppercase font-medium text-ink leading-none">
            {match.teamA ? match.teamA.name : "TBD"}
          </span>
        </div>
        <div className="shrink-0 pl-1">
          {match.scoreA ? (
            <span className={`display text-sm leading-none ${
              isWinnerA ? "text-ink font-bold" : "text-muted-foreground"
            }`}>{match.scoreA.total}</span>
          ) : (
            <span className="font-type text-[9px] text-stone">--</span>
          )}
        </div>
      </div>

      {/* Team B Row */}
      <div
        onMouseEnter={() => match.teamB && onHoverTeam(match.teamB.id)}
        onMouseLeave={() => onHoverTeam(null)}
        className={`flex items-center justify-between px-1.5 py-1 transition-colors ${
          isWinnerB ? "bg-sun/40 font-bold" : ""
        } ${isEliminatedB ? "opacity-50 bg-ivory/50" : ""} ${
          hoveredTeamId && match.teamB && hoveredTeamId === match.teamB.id
            ? "bg-sun/60"
            : ""
        }`}
      >
        <div className="flex items-center gap-1 overflow-hidden min-w-0">
          <span
            className={`display flex h-4 w-4 shrink-0 items-center justify-center border border-ink text-[9px] ${
              isWinnerB ? "bg-ink text-sun" : "bg-paper text-ink"
            }`}
          >
            {match.teamB ? String(match.teamB.number).padStart(2, "0") : "–"}
          </span>
          <span className="truncate font-type text-[9px] uppercase font-medium text-ink leading-none">
            {match.teamB ? match.teamB.name : "TBD"}
          </span>
        </div>
        <div className="shrink-0 pl-1">
          {match.scoreB ? (
            <span className={`display text-sm leading-none ${
              isWinnerB ? "text-ink font-bold" : "text-muted-foreground"
            }`}>{match.scoreB.total}</span>
          ) : (
            <span className="font-type text-[9px] text-stone">--</span>
          )}
        </div>
      </div>

      {/* Footer Details strip */}
      <div className="flex items-center justify-between border-t border-ink/20 bg-ivory/60 px-1.5 py-0.5 font-type text-[8px] text-muted-foreground">
        <span className="truncate">{match.scheduledTime || match.court}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className="text-ink underline hover:text-hot shrink-0 ml-1"
        >
          ↗
        </button>
      </div>
    </div>
  );
}
