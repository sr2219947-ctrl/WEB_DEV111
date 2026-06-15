const propertySearch = document.getElementById("property-search");
const clearSearchButton = document.getElementById("clear-search");
const cards = Array.from(document.querySelectorAll(".property-card"));
const searchCount = document.getElementById("search-count");
const noResults = document.getElementById("no-results");

function updateSearchState(query){

  const normalizedQuery = query.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {

    const searchableText = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
    const isMatch = searchableText.includes(normalizedQuery);

    card.style.display = isMatch ? "block" : "none";

    if(isMatch){
      visibleCount++;
    }
  });

  if(searchCount){
    searchCount.textContent = normalizedQuery
      ? `Showing ${visibleCount} card${visibleCount === 1 ? "" : "s"} for "${query.trim()}"`
      : `Showing all ${cards.length} cards`;
  }

  if(noResults){
    noResults.hidden = visibleCount !== 0;
  }
}

if(propertySearch){

  propertySearch.addEventListener("input", event => {
    updateSearchState(event.target.value);
  });

  propertySearch.addEventListener("search", event => {
    updateSearchState(event.target.value);
  });
}

if(clearSearchButton){

  clearSearchButton.addEventListener("click", () => {
    if(propertySearch){
      propertySearch.value = "";
      propertySearch.focus();
    }

    updateSearchState("");
  });
}

updateSearchState(propertySearch ? propertySearch.value : "");

function showNotes(topic){

    const notesBox =
    document.getElementById("notes-box");

    const notes = {

        variables: `
        <h2>🎨 CSS Variables</h2>

        <p>
        CSS Variables help create reusable
        styling values for colors, spacing
        and themes.
        </p>

        <div class="code-box">
        :root{
          --primary:#6B7A99;
        }

        h1{
          color:var(--primary);
        }
        </div>

        <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties"
        target="_blank"
        class="read-more-btn">

        Read More →
        </a>
        `,


        selectors: `
        <h2>🎯 CSS Selectors</h2>

        <p>
        Selectors target HTML elements
        for styling.
        </p>

        <div class="code-box">
        p{
          color:blue;
        }

        .box{
          background:red;
        }

        #title{
          font-size:40px;
        }
        </div>

        <a
        href="https://www.w3schools.com/css/css_selectors.asp"
        target="_blank"
        class="read-more-btn">

        Read More →
        </a>
        `,


        grid: `
        <h2>🟦 CSS Grid</h2>

        <p>
        CSS Grid creates responsive
        2D layouts easily.
        </p>

        <div class="code-box">
        .container{
          display:grid;

          grid-template-columns:
          1fr 1fr 1fr;
        }
        </div>

        <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout"
        target="_blank"
        class="read-more-btn">

        Read More →
        </a>
        `,


        flexbox: `
        <h2>📦 Flexbox</h2>

        <p>
        Flexbox aligns items beautifully
        in rows and columns.
        </p>

        <div class="code-box">
        .container{
          display:flex;

          justify-content:center;
          align-items:center;
        }
        </div>

        <a
        href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
        target="_blank"
        class="read-more-btn">

        Read More →
        </a>
        `,


        animation: `
        <h2>✨ CSS Animation</h2>

        <p>
        CSS animations add movement
        without JavaScript.
        </p>

        <div class="code-box">
        @keyframes float{
          0%{
            transform:
            translateY(0);
          }

          100%{
            transform:
            translateY(-20px);
          }
        }
        </div>

        <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations"
        target="_blank"
        class="read-more-btn">

        Read More →
        </a>
        `,


        transform: `
        <h2>🔄 CSS Transform</h2>

        <p>
        Transform rotates, scales
        and moves elements.
        </p>

        <div class="code-box">
        .box:hover{
          transform:
          rotate(10deg)
          scale(1.1);
        }
        </div>

        <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform"
        target="_blank"
        class="read-more-btn">

        Read More →
        </a>
        `
    };

    notesBox.innerHTML =
    notes[topic];

    notesBox.scrollIntoView({
        behavior:"smooth"
    });
}