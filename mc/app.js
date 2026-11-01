const skins = [
  { name: "Bully Ange", file: "Bully Ange.png", color: "#bfc5ca", light: "#eef1f3" },
  { name: "Bully Bizare", file: "Bully Bizare.png", color: "#4520bc", light: "#7d5bea" },
  { name: "Bully Bonbon", file: "Bully Bonbon.png", color: "#b847a9", light: "#e888db" },
  { name: "Bully Content", file: "Bully Content.png", color: "#d5b600", light: "#ffe95c" },
  { name: "Bully Détendu", file: "Bully Détendu.png", color: "#12a965", light: "#48e69b" },
  { name: "Bully Exité", file: "Bully Exité.png", color: "#f19a00", light: "#ffcb4d" },
  { name: "Bully Faché", file: "Bully Faché.png", color: "#b91519", light: "#f05050" },
  { name: "Bully Neutre", file: "Bully Neutre.png", color: "#777b80", light: "#b7bbc0" },
  { name: "Bully Triste", file: "Bully Triste.png", color: "#04bfc7", light: "#5cecf0" },
  { name: "Bullyinventif", file: "Bullyinventif.png", color: "#087cab", light: "#29b7e9" },
];

const grid = document.querySelector("#skin-grid");
const searchInput = document.querySelector("#search-input");
const visibleCount = document.querySelector("#visible-count");
const totalCount = document.querySelector("#total-count");
const emptyState = document.querySelector("#empty-state");
const sortButton = document.querySelector("#sort-button");
const previousButton = document.querySelector("#previous-skin");
const nextButton = document.querySelector("#next-skin");
const activePosition = document.querySelector("#active-position");
let alphabetical = true;
let activeSlot = 0;

totalCount.textContent = skins.length;

function createViewer(canvas, skin) {
  if (!window.skinview3d) {
    canvas.replaceWith(Object.assign(document.createElement("img"), {
      src: `skins/${encodeURIComponent(skin.file)}`,
      alt: `Texture de ${skin.name}`,
    }));
    return;
  }

  const viewer = new skinview3d.SkinViewer({
    canvas,
    width: 280,
    height: 285,
    skin: `skins/${encodeURIComponent(skin.file)}`,
  });
  viewer.fov = 48;
  viewer.zoom = 0.9;
  viewer.controls.enableRotate = true;
  viewer.controls.enableZoom = false;
  viewer.controls.enablePan = false;
  viewer.animation = new skinview3d.IdleAnimation();
  viewer.animation.paused = true;
  viewer.playerObject.rotation.y = -0.35;
}

function renderSkins() {
  const query = searchInput.value.trim().toLocaleLowerCase("fr");
  const visibleSkins = skins
    .filter((skin) => skin.name.toLocaleLowerCase("fr").includes(query))
    .sort((a, b) => alphabetical ? a.name.localeCompare(b.name, "fr") : 0);

  grid.innerHTML = visibleSkins.map((skin) => `
    <article class="skin-card" data-skin-name="${skin.name}" style="--skin-color: ${skin.color}; --skin-light: ${skin.light}">
      <div class="preview">
        <canvas aria-label="Aperçu 3D du skin ${skin.name}"></canvas>
      </div>
      <div class="card-actions">
        <div>
          <h3 class="skin-name">${skin.name}</h3>
          <p class="skin-meta">Minecraft skin · PNG</p>
        </div>
        <a class="download" href="skins/${encodeURIComponent(skin.file)}" download="${skin.file}" aria-label="Télécharger ${skin.name}" title="Télécharger la texture"><i data-lucide="download" aria-hidden="true"></i></a>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("canvas").forEach((canvas, index) => {
    createViewer(canvas, visibleSkins[index]);
    canvas.closest(".skin-card").addEventListener("click", (event) => {
      if (!event.target.closest(".download")) {
        const count = grid.querySelectorAll(".skin-card").length;
        const slot = ((index - activeSlot) % count + count) % count;
        const forwardDistance = slot;
        const backwardDistance = slot - count;
        activeSlot += Math.abs(forwardDistance) <= Math.abs(backwardDistance) ? forwardDistance : backwardDistance;
        updateCarousel();
      }
    });
  });
  visibleCount.textContent = visibleSkins.length;
  emptyState.hidden = visibleSkins.length !== 0;
  activeSlot = Math.min(activeSlot, Math.max(visibleSkins.length - 1, 0));
  updateCarousel();
  lucide.createIcons();
}

function updateCarousel() {
  const cards = [...grid.querySelectorAll(".skin-card")];
  if (!cards.length) {
    activePosition.textContent = "";
    return;
  }

  const stepAngle = 360 / cards.length;
  grid.style.setProperty("--wheel-rotation", `${-activeSlot * stepAngle}deg`);
  cards.forEach((card, index) => {
    const slot = ((index - activeSlot) % cards.length + cards.length) % cards.length;
    card.style.setProperty("--card-angle", `${index * stepAngle}deg`);
    card.className = "skin-card";
    if (slot === 0) card.classList.add("is-center");
    else if (slot === 1) card.classList.add("is-right-1");
    else if (slot === 2) card.classList.add("is-right-2");
    else if (slot === 3) card.classList.add("is-right-3");
    else if (slot === cards.length - 1) card.classList.add("is-left-1");
    else if (slot === cards.length - 2) card.classList.add("is-left-2");
    else if (slot === cards.length - 3) card.classList.add("is-left-3");
    else if (slot < cards.length / 2) card.classList.add("is-hidden-right");
    else card.classList.add("is-hidden-left");
  });
  const visibleIndex = ((activeSlot % cards.length) + cards.length) % cards.length;
  activePosition.textContent = `${visibleIndex + 1} / ${cards.length}`;
}

function moveCarousel(step) {
  const count = grid.querySelectorAll(".skin-card").length;
  if (!count) return;
  activeSlot += step;
  updateCarousel();
}

searchInput.addEventListener("input", renderSkins);
previousButton.addEventListener("click", () => moveCarousel(-1));
nextButton.addEventListener("click", () => moveCarousel(1));
grid.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (Math.abs(event.deltaY) < 3) return;
  moveCarousel(event.deltaY > 0 ? 1 : -1);
}, { passive: false });
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveCarousel(-1);
  if (event.key === "ArrowRight") moveCarousel(1);
});
sortButton.addEventListener("click", () => {
  alphabetical = !alphabetical;
  sortButton.firstChild.textContent = alphabetical ? "Nom " : "Ajout ";
  renderSkins();
});
renderSkins();
