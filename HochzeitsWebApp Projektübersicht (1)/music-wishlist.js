// [Bestehenden Code beibehalten]

class MusicWishlist {
  // [Existierende Methoden]

  renderWishlist() {
    const wishlist = document.getElementById('wishlist');
    wishlist.innerHTML = this.tracks
      .sort((a, b) => b.votes - a.votes)
      .map(track => `
        <li class="track">
          <span>${track.name} - ${track.artist}</span>
          <div class="vote-buttons">
            <button class="upvote" data-id="${track.id}">▲ ${track.upvotes || 0}</button>
            <button class="downvote" data-id="${track.id}">▼ ${track.downvotes || 0}</button>
          </div>
        </li>
      `).join('');

    document.querySelectorAll('.upvote').forEach(btn => {
      btn.addEventListener('click', () => this.handleVote(btn.dataset.id, 'up'));
    });
    document.querySelectorAll('.downvote').forEach(btn => {
      btn.addEventListener('click', () => this.handleVote(btn.dataset.id, 'down'));
    });
  }

  handleVote(trackId, type) {
    const track = this.tracks.find(t => t.id === trackId);
    if (track) {
      if (type === 'up') {
        track.upvotes = (track.upvotes || 0) + 1;
      } else {
        track.downvotes = (track.downvotes || 0) + 1;
      }
      track.votes = (track.upvotes || 0) - (track.downvotes || 0);
      this.renderWishlist();
    }
  }

  // [Restlichen Code beibehalten]
}