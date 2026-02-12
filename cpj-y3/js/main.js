// place js in here














//// LOADING SCREEN



      // Wait for first image to load before showing splash
      const firstImage = new Image();
      firstImage.src = 'assets/images/term-1/01-1.jpg';

      firstImage.onload = function () {
        document.querySelector('.splash-wrapper').style.opacity = '1';
      };

      // Background image cycling
      const splashImages = document.querySelectorAll('.splash-bg-image');
      let splashCurrentIndex = 0;

      function cycleSplashImages() {
        splashImages[splashCurrentIndex].classList.remove('active');
        splashCurrentIndex = (splashCurrentIndex + 1) % splashImages.length;
        splashImages[splashCurrentIndex].classList.add('active');
      }



      // TIME 1k = 1 second

      if (splashImages.length > 1) {
        setInterval(cycleSplashImages, 3000);
      }




























        //////////////GLITCH ANIMATIOn




     // ========================================
      // GLITCH TEXT REVEAL ANIMATION
      // Add this to your main.js
      // ========================================

              class GlitchTextReveal {
                constructor(options = {}) {
                  this.baseDelay = options.baseDelay || 40;
                  this.randomRange = options.randomRange || 600;
                  this.scrambleDuration = options.scrambleDuration || 400;
                  this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`01';
                  this.elements = document.querySelectorAll('[data-text]');
                  this.isAnimating = false;
                }

                init() {
                  this.elements.forEach(el => {
                    const text = el.dataset.text;
                    el.innerHTML = '';
                    
                    [...text].forEach(char => {
                      const span = document.createElement('span');
                      span.className = 'letter';
                      span.dataset.char = char;
                      span.dataset.original = char;
                      span.textContent = char === ' ' ? '\u00A0' : char;
                      
                      // Add hover events for interactive glitch
                      span.addEventListener('mouseenter', () => this.glitchLetter(span));
                      span.addEventListener('mouseleave', () => this.unglitchLetter(span));
                      
                      el.appendChild(span);
                    });
                  });
                }

                reveal() {
                  this.isAnimating = true;
                  
                  const allLetters = document.querySelectorAll('.letter');
                  
                  // Reset all letters
                  allLetters.forEach(letter => {
                    letter.classList.remove('visible', 'glitching', 'flickering', 'scrambling', 'revealed');
                    letter.style.opacity = '0';
                    letter.textContent = letter.dataset.original === ' ' ? '\u00A0' : letter.dataset.original;
                  });

                  // Create array of indices and shuffle for random reveal order
                  const indices = Array.from({ length: allLetters.length }, (_, i) => i);
                  this.shuffle(indices);

                  let maxDelay = 0;

                  // Reveal each letter with glitch effect
                  indices.forEach((letterIndex, order) => {
                    const delay = this.baseDelay * order + Math.random() * this.randomRange;
                    const letter = allLetters[letterIndex];
                    
                    const totalTime = delay + this.scrambleDuration;
                    if (totalTime > maxDelay) maxDelay = totalTime;
                    
                    // Start scrambling before reveal
                    setTimeout(() => {
                      letter.style.opacity = '1';
                      letter.classList.add('visible', 'scrambling', 'flickering', 'glitching');
                      this.scramble(letter);
                    }, delay);

                    // Remove flicker
                    setTimeout(() => {
                      letter.classList.remove('flickering');
                    }, delay + this.scrambleDuration * 0.5);

                    // Settle to final character
                    setTimeout(() => {
                      letter.classList.remove('scrambling', 'glitching');
                      letter.classList.add('revealed');
                      letter.textContent = letter.dataset.original === ' ' ? '\u00A0' : letter.dataset.original;
                      letter.dataset.char = letter.dataset.original;
                    }, delay + this.scrambleDuration);
                  });

                  // Mark animation complete
                  setTimeout(() => {
                    this.isAnimating = false;
                  }, maxDelay + 100);
                }

                scramble(letter) {
                  let iterations = 0;
                  const maxIterations = 8;
                  
                  const interval = setInterval(() => {
                    if (iterations >= maxIterations || letter.classList.contains('revealed')) {
                      clearInterval(interval);
                      return;
                    }
                    
                    const randomChar = this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                    letter.textContent = randomChar;
                    letter.dataset.char = randomChar;
                    iterations++;
                  }, this.scrambleDuration / maxIterations);
                }

                glitchLetter(letter) {
                  if (this.isAnimating || !letter.classList.contains('revealed')) return;
                  
                  letter.classList.add('glitching');
                  this.hoverScramble(letter);
                }

                hoverScramble(letter) {
                  if (!letter.classList.contains('glitching')) return;
                  
                  const randomChar = this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)];
                  letter.textContent = randomChar;
                  letter.dataset.char = randomChar;
                  
                  letter._scrambleTimeout = setTimeout(() => {
                    this.hoverScramble(letter);
                  }, 50);
                }

                unglitchLetter(letter) {
                  if (this.isAnimating) return;
                  
                  if (letter._scrambleTimeout) {
                    clearTimeout(letter._scrambleTimeout);
                  }
                  
                  letter.classList.remove('glitching');
                  letter.textContent = letter.dataset.original === ' ' ? '\u00A0' : letter.dataset.original;
                  letter.dataset.char = letter.dataset.original;
                }

                shuffle(array) {
                  for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                  }
                  return array;
                }
              }

              // ========================================
              // INITIALIZE GLITCH ANIMATION
              // ========================================
              const glitchReveal = new GlitchTextReveal({
                baseDelay: 50,
                randomRange: 500,
                scrambleDuration: 350
              });

              glitchReveal.init();

              // Trigger reveal on page load
              window.addEventListener('load', () => {
                setTimeout(() => glitchReveal.reveal(), 500);
              });


              // ========================================
              // HERO BACKGROUND IMAGE CYCLING
              // ========================================
              class HeroBackgroundCycler {
                constructor(options = {}) {
                  this.cycleInterval = options.cycleInterval || 3000; // 3 seconds per image
                  this.groups = document.querySelectorAll('.hero-bg-group');
                  this.favItems = document.querySelectorAll('.fav-item[data-group]');
                  this.currentGroup = 1;
                  this.intervals = {};
                }

                init() {
                  // Start cycling for active group
                  this.startCycling(this.currentGroup);

                  // Add click events to FAVS items
                  this.favItems.forEach(item => {
                    item.addEventListener('click', () => {
                      const groupNum = parseInt(item.dataset.group);
                      this.switchGroup(groupNum);
                    });
                  });
                }

                switchGroup(groupNum) {
                  if (groupNum === this.currentGroup) return;

                  // Update active states
                  this.groups.forEach(group => {
                    if (parseInt(group.dataset.group) === groupNum) {
                      group.classList.add('active');
                    } else {
                      group.classList.remove('active');
                    }
                  });

                  this.favItems.forEach(item => {
                    if (parseInt(item.dataset.group) === groupNum) {
                      item.classList.add('active');
                    } else {
                      item.classList.remove('active');
                    }
                  });

                  // Stop old cycling, start new
                  this.stopCycling(this.currentGroup);
                  this.currentGroup = groupNum;
                  this.startCycling(groupNum);
                }

                startCycling(groupNum) {
                  const group = document.querySelector(`.hero-bg-group[data-group="${groupNum}"]`);
                  if (!group) return;

                  const images = group.querySelectorAll('.hero-bg-image');
                  if (images.length <= 1) return;

                  let currentIndex = 0;

                  // Find currently active image
                  images.forEach((img, index) => {
                    if (img.classList.contains('active')) {
                      currentIndex = index;
                    }
                  });

                  this.intervals[groupNum] = setInterval(() => {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.add('active');
                  }, this.cycleInterval);
                }

                stopCycling(groupNum) {
                  if (this.intervals[groupNum]) {
                    clearInterval(this.intervals[groupNum]);
                    delete this.intervals[groupNum];
                  }
                }
              }

              // ========================================
              // INITIALIZE BACKGROUND CYCLER
              // ========================================
              const heroCycler = new HeroBackgroundCycler({
                cycleInterval: 1500 // Change image every 3 seconds
              });

              document.addEventListener('DOMContentLoaded', () => {
                heroCycler.init();
              });





























// ========================================
// WEEK LINK PREVIEW IMAGE HOVER
// ========================================
function initWeekPreviewHover() {
  const weekLinks = document.querySelectorAll('.week-link[data-preview]');
  const previewImg = document.getElementById('week-preview-img');
  
  if (!weekLinks.length || !previewImg) return;
  
  // Store the default image
  const defaultSrc = previewImg.src;
  
  weekLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
      const imgSrc = this.getAttribute('data-preview');
      if (imgSrc) {
        // Fade out
        previewImg.style.opacity = '0';
        
        // After fade out, change src and fade in
        setTimeout(() => {
          previewImg.src = imgSrc;
          previewImg.style.opacity = '1';
        }, 200);
      }
    });
    
    link.addEventListener('mouseleave', function() {
      // Fade back to default
      previewImg.style.opacity = '0';
      
      setTimeout(() => {
        previewImg.src = defaultSrc;
        previewImg.style.opacity = '1';
      }, 200);
    });
  });
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initWeekPreviewHover();
});








































//colapsible uh boxes



function initExperimentBoxes() {
  // Get all experiment boxes
  const boxes = document.querySelectorAll('.experiment-box');

  boxes.forEach(box => {
    // Add click event to the entire box
    box.addEventListener('click', function () {
      // Toggle expanded class
      this.classList.toggle('expanded');
    });
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  initExperimentBoxes();
});




document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.experiment-box');
  
  boxes.forEach(box => {
      box.addEventListener('click', () => {
          // Toggle this box
          box.classList.toggle('expanded');
          
          // Optional: Close others when one opens (Accordion style)
          // If you want them all to stay open, remove this part:
          boxes.forEach(otherBox => {
              if (otherBox !== box) {
                  otherBox.classList.remove('expanded');
              }
          });
      });
  });
});

   document.addEventListener('DOMContentLoaded', () => {
        const boxes = document.querySelectorAll('.experiment-box');
        boxes.forEach(box => {
            box.addEventListener('click', (e) => {
                // Prevent lightbox trigger if clicking inside experiment box
                // (though background-images usually don't trigger img tags)
                e.stopPropagation(); 
                
                box.classList.toggle('expanded');
                boxes.forEach(otherBox => {
                    if (otherBox !== box) otherBox.classList.remove('expanded');
                });
            });
        });
    });




























// ====================================
// CATALOG PAGE - EXPERIMENTS SECTION
// Add this to your main.js
// ====================================

// ====================================
// TITLE LETTER ANIMATION
// Random flickering/reveal effect
// Uses catalog-prefixed classes to avoid conflict with GlitchTextReveal
// ====================================
function initTitleAnimation() {
  const titleLines = document.querySelectorAll('.catalog-title-line');
  
  if (!titleLines.length) return;

  // Wrap each letter in a span with CATALOG-SPECIFIC class (not .letter!)
  titleLines.forEach(line => {
      const text = line.textContent;
      line.innerHTML = '';
      
      for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.className = 'catalog-letter'; // UNIQUE class name
          span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
          line.appendChild(span);
      }
  });

  // Get all CATALOG letters (not .letter which GlitchTextReveal uses)
  const allLetters = document.querySelectorAll('.catalog-title-line .catalog-letter');
  const letterArray = Array.from(allLetters);
  
  // Shuffle array for random order
  const shuffled = letterArray.slice().sort(() => Math.random() - 0.5);
  
  // Reveal letters randomly with flickering
  shuffled.forEach((letter, index) => {
      const delay = index * 50 + Math.random() * 100;
      
      setTimeout(() => {
          // Start flickering with CATALOG-SPECIFIC class
          letter.classList.add('catalog-flickering');
          
          // After a short flicker, reveal the letter
          setTimeout(() => {
              letter.classList.remove('catalog-flickering');
              letter.classList.add('catalog-visible'); // UNIQUE class name
          }, 150 + Math.random() * 100);
      }, delay);
  });
  
  // Fallback: ensure ALL letters are visible after animation completes
  const maxDelay = shuffled.length * 50 + 500;
  setTimeout(() => {
      allLetters.forEach(letter => {
          letter.classList.remove('catalog-flickering');
          letter.classList.add('catalog-visible');
      });
  }, maxDelay);
}

// View Mode Toggle
function initExperimentsViewToggle() {
  const gridViewBtn = document.getElementById('grid-view-btn');
  const listViewBtn = document.getElementById('list-view-btn');
  const experimentsGrid = document.getElementById('experiments-grid');
  const experimentsList = document.getElementById('experiments-list');

  // Check if elements exist (only run on catalog page)
  if (!gridViewBtn || !listViewBtn) return;

  gridViewBtn.addEventListener('click', function() {
      // Switch to grid view
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      experimentsGrid.classList.remove('hidden');
      experimentsList.classList.remove('active');
  });

  listViewBtn.addEventListener('click', function() {
      // Switch to list view
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      experimentsGrid.classList.add('hidden');
      experimentsList.classList.add('active');
  });
}

// List View - Hover to change preview image with smooth fade
function initListViewHover() {
  const listItems = document.querySelectorAll('.experiment-list-item');
  const previewImg = document.getElementById('list-preview-img');

  // Check if elements exist
  if (!listItems.length || !previewImg) return;

  listItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
          // Remove active from all
          listItems.forEach(i => i.classList.remove('active'));
          // Add active to current
          this.classList.add('active');
          
          // Smooth fade transition for preview image
          const imgSrc = this.getAttribute('data-img');
          if (imgSrc && previewImg.src !== imgSrc) {
              // Fade out
              previewImg.style.opacity = '0';
              
              // After fade out, change src and fade in
              setTimeout(() => {
                  previewImg.src = imgSrc;
                  previewImg.style.opacity = '1';
              }, 250);
          }
      });
  });
}

// Scroll arrow for catalog hero
function initCatalogScrollArrow() {
  const scrollArrow = document.getElementById('scroll-arrow');
  const content = document.getElementById('content');

  if (!scrollArrow || !content) return;

  scrollArrow.addEventListener('click', function() {
      content.scrollIntoView({ 
          behavior: 'smooth' 
      });
  });
}

// Initialize all catalog functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initTitleAnimation();
  initExperimentsViewToggle();
  initListViewHover();
  initCatalogScrollArrow();
});





























































window.onload = () => {
  let all = document.getElementsByClassName("zoom"),
    lightbox = document.getElementById("lightbox");

  if (all.length > 0) {
    for (let i of all) {
      i.onclick = () => {
        let clone = i.cloneNode();
        clone.className = "";
        lightbox.innerHTML = "";
        lightbox.appendChild(clone);
        lightbox.className = "show";
      };
    }
  }

  lightbox.onclick = () => {
    lightbox.className = "";
  };
};

document.addEventListener("DOMContentLoaded", function () {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});

function scrollToTop() {
  window.scroll({ top: 0, left: 0, behavior: "smooth" });
}

function initHamburgerMenu() {
  /* initialise Hamburger-Menu */
  const hamburger = document.querySelector(".main__nav-ham");
  const navMenu = document.querySelector(".main__nav-list");
  const title = document.querySelector(".main__nav-title");

  hamburger.addEventListener("click", mobileMenu);

  function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
}

initHamburgerMenu();

/**
 * Load JSON from HTML like this
 * loadJSON('my-file.json',
 *       function(data) { console.log(data); },
 *       function(xhr) { console.error(xhr); }
 * );
 *
 * @param {*} path
 * @param {*} success
 * @param {*} error
 */
function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

function generateRepoItemsFrom(theData) {
  const items = Object.keys(theData);
  items.forEach((el0) => {
    const in0 = theData[`${el0}`];
    const headline = `${el0.charAt(0).toUpperCase()}${el0.slice(1)}`;
    const id = `repo-${el0}`;
    let result = `<h2>${headline}</h2>`;
    in0.forEach((el) => {
      const push = `<ul class="repo__list"><li class="repo__item"><ul>`;
      const thumbnail = `<li><img src="/assets/images/repo/${el.thumbnail}" /></li>`;
      const l0 = `<br><a href="${el.link}" target="_blank">link</a>`;
      const link = el.link?.length > 0 ? l0 : "";
      const r0 = `${el.title}`;
      const r1 = `${el.reference}`;
      const r2 = `${link}`;
      const reference = `<li><p>${r0}<br>${r1}${r2}</p></li>`;
      const description = `<li><p>${el.description}</p></li>`;
      const pop = `</li></ul></ul>`;
      result += `${push}${thumbnail}${reference}${description}${pop}`;
    });
    document.getElementById(id).innerHTML = result;
  });
}

function logErrorMessage(theError) {
  console.error(theError);
}


document.addEventListener("keydown", function (e) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    return;
  const o = document.getElementById("go-prev").href
    , s = document.getElementById("go-next").href;
  if (e.key == "ArrowLeft")
    window.location.assign(o);
  else if (e.key == "ArrowRight")
    window.location.assign(s);
  else if (e.key == "Escape") {
    const t = document.getElementById("bio-details");
    t.classList.toggle("expanded"),
      t.classList.toggle("collapsed")
  }
});


// ========================================
// HEADER HIDE/SHOW ON SCROLL
// ========================================
class ScrollHeader {
  constructor() {
    this.header = document.querySelector('header');
    this.lastScrollY = window.scrollY;
    this.ticking = false;
  }

  init() {
    if (!this.header) return;
    
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // At the very top - always show
    if (currentScrollY < 50) {
      this.header.classList.remove('header-hidden');
      this.lastScrollY = currentScrollY;
      return;
    }

    // Scrolling down - hide header
    if (currentScrollY > this.lastScrollY) {
      this.header.classList.add('header-hidden');
    } 
    // Scrolling up - show header
    else {
      this.header.classList.remove('header-hidden');
    }

    this.lastScrollY = currentScrollY;
  }
}

// Initialize scroll header
const scrollHeader = new ScrollHeader();
document.addEventListener('DOMContentLoaded', () => {
  scrollHeader.init();
});