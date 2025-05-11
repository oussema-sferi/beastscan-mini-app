document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("cards-container");
    const loading = document.getElementById("loading-message");

    // Bootstrap modal instance
    let editModal = new bootstrap.Modal(document.getElementById('editModal'));
    let titleInput = document.getElementById('editTitle');
    let descInput = document.getElementById('editDescription');
    let keyInput = document.getElementById('editKey');

    try {
        const res = await fetch("https://my.beastscan.com/test-kit");
        const data = await res.json();
        loading.remove();

        data.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.className = "col-md-4";

            const cardKey = card.title.replace(/\s+/g, '-').toLowerCase();

            // Load saved votes or fallback to API
            const voteKey = `vote-${cardKey}`;
            let storedVotes = JSON.parse(localStorage.getItem(voteKey));
            let votes = storedVotes || {
                up: card.votes?.up || 0,
                down: card.votes?.down || 0
            };

            // Load edited content if exists
            const editKey = `edit-${cardKey}`;
            const savedEdit = JSON.parse(localStorage.getItem(editKey));
            const displayTitle = savedEdit?.title || card.title;
            const displayDesc = savedEdit?.description || card.description;

            cardElement.innerHTML = `
        <div class="card text-center h-100 shadow-sm">
          <img src="${card.image}" class="card-img-top" alt="${displayTitle}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${displayTitle}</h5>
            <p class="card-text">${displayDesc}</p>
            <div class="mt-auto">
              <div class="d-flex align-items-center justify-content-center mb-2">
                <button class="btn btn-outline-success btn-sm me-2 upvote">⬆️</button>
                <span class="vote-count fw-bold">${votes.up - votes.down}</span>
                <button class="btn btn-outline-danger btn-sm ms-2 downvote">⬇️</button>
              </div>
              <a href="${card.button?.url}" target="_blank" class="btn btn-primary w-100 mb-2">${card.button?.label}</a>
              <button class="btn btn-outline-secondary btn-sm w-100 edit-card" data-key="${editKey}">Edit</button>
            </div>
          </div>
        </div>
      `;

            container.appendChild(cardElement);

            // Vote Logic
            const up = cardElement.querySelector(".upvote");
            const down = cardElement.querySelector(".downvote");
            const count = cardElement.querySelector(".vote-count");

            up.addEventListener("click", () => {
                votes.up++;
                count.textContent = votes.up - votes.down;
                localStorage.setItem(voteKey, JSON.stringify(votes));
            });

            down.addEventListener("click", () => {
                votes.down++;
                count.textContent = votes.up - votes.down;
                localStorage.setItem(voteKey, JSON.stringify(votes));
            });

            // Edit Logic
            const editBtn = cardElement.querySelector(".edit-card");
            const titleEl = cardElement.querySelector(".card-title");
            const descEl = cardElement.querySelector(".card-text");

            editBtn.addEventListener("click", () => {
                titleInput.value = titleEl.textContent;
                descInput.value = descEl.textContent;
                keyInput.value = editKey;
                editModal.show();
            });

            // Save changes on form submit
            document.getElementById("editForm").addEventListener("submit", (e) => {
                e.preventDefault();
                const newTitle = titleInput.value.trim();
                const newDesc = descInput.value.trim();
                const key = keyInput.value;

                // Update localStorage
                localStorage.setItem(key, JSON.stringify({
                    title: newTitle,
                    description: newDesc
                }));

                // Reload page to apply changes
                location.reload();
            });
        });
    } catch (err) {
        loading.textContent = "Failed to load cards.";
        console.error("API error:", err);
    }
});
