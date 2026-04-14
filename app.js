(function () {
  const yearNode = document.querySelector("[data-year]");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const eventTime = new Date("2026-04-17T19:45:00+01:00");
  const countdownNode = document.querySelector("[data-event-countdown]");
  if (countdownNode) {
    const diff = eventTime.getTime() - Date.now();
    if (diff <= 0) {
      countdownNode.textContent = "Scheduled kickoff time has passed. Check the live page for updates.";
    } else {
      const totalHours = Math.floor(diff / 3600000);
      countdownNode.textContent = `${Math.floor(totalHours / 24)}d ${totalHours % 24}h until scheduled kickoff`;
    }
  }

  const liveRoot = document.querySelector("[data-live-root]");
  if (!liveRoot) {
    return;
  }

  const fallback = {
    match: "Ulster Rugby vs Leinster Rugby",
    competition: "BKT United Rugby Championship, Round 15",
    status: "Scheduled",
    homeTeam: "Ulster Rugby",
    awayTeam: "Leinster Rugby",
    homeScore: null,
    awayScore: null,
    kickoffLocal: "2026-04-17T19:45:00+01:00",
    venue: "Affidea Stadium, Belfast",
    lastUpdated: "2026-04-14T00:00:00-07:00",
    notes: [
      "The match is scheduled for Friday, April 17, 2026 at 7:45 PM Belfast time.",
      "This page uses original notes and local JSON updates."
    ]
  };

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  function render(data) {
    const homeScore = data.homeScore === null || data.homeScore === undefined ? "-" : data.homeScore;
    const awayScore = data.awayScore === null || data.awayScore === undefined ? "-" : data.awayScore;
    const notes = Array.isArray(data.notes) ? data.notes : [];
    liveRoot.innerHTML = `
      <div class="live-card">
        <p class="eyebrow">Live update board</p>
        <h2>${data.match}</h2>
        <div class="score-strip" aria-label="Current score">
          <span>${data.homeTeam}</span>
          <strong>${homeScore} - ${awayScore}</strong>
          <span>${data.awayTeam}</span>
        </div>
        <div class="info-table compact">
          <div><span>Status</span><strong>${data.status}</strong></div>
          <div><span>Venue</span><strong>${data.venue}</strong></div>
          <div><span>Kickoff</span><strong>${formatDate(data.kickoffLocal)}</strong></div>
          <div><span>Last updated</span><strong>${formatDate(data.lastUpdated)}</strong></div>
        </div>
        <ul class="note-list">${notes.map((note) => `<li>${note}</li>`).join("")}</ul>
      </div>
    `;
  }

  fetch("../data/live-updates.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Live update data unavailable");
      }
      return response.json();
    })
    .then(render)
    .catch(() => render(fallback));
})();
