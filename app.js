/* ==========================================================================
   INITIAL MOCK DATA
   ========================================================================== */

const defaultPosts = [
  {
    id: 1,
    author: "Aman Sharma",
    batch: "2022",
    category: "achievement",
    time: "2 hours ago",
    content: "Excited to share that I've joined Google as a Software Engineer Intern! Grateful for the school CS lab days.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
    likes: 18,
    hasLiked: false,
    comments: [
      { id: 101, author: "Rahul Verma", text: "Huge congratulations Aman! Proud moment!" }
    ]
  },
  {
    id: 2,
    author: "Sneha Nair",
    batch: "2023",
    category: "opportunity",
    time: "4 hours ago",
    content: "My team at StartupLabs is hiring 2 Frontend Interns (React / Tailwind). Direct fast-track interview for school passouts!",
    imageUrl: "",
    likes: 24,
    hasLiked: false,
    comments: []
  }
];

const alumniProfiles = [
  {
    name: "Aman Sharma",
    batch: "2022",
    role: "SWE Intern @ Google",
    city: "Bengaluru, India",
    lat: 12.9716,
    lng: 77.5946,
    openToMentor: true,
    skills: ["Python", "Cloud", "Distributed Systems"]
  },
  {
    name: "Pooja Verma",
    batch: "2020",
    role: "Product Designer @ Swiggy",
    city: "Gurugram, India",
    lat: 28.4595,
    lng: 77.0266,
    openToMentor: true,
    skills: ["UI/UX", "Figma", "Design Systems"]
  },
  {
    name: "Rohan Kapoor",
    batch: "2020",
    role: "Masters in CS @ Univ of Toronto",
    city: "Toronto, Canada",
    lat: 43.6532,
    lng: -79.3832,
    openToMentor: false,
    skills: ["AI/ML", "Robotics"]
  },
  {
    name: "Ananya Iyer",
    batch: "2021",
    role: "Data Analyst @ Deloitte",
    city: "Mumbai, India",
    lat: 19.0760,
    lng: 72.8777,
    openToMentor: true,
    skills: ["SQL", "Tableau", "Analytics"]
  }
];

const eventsData = [
  {
    id: 1,
    title: "Class of 2020 - 6-Year Reunion & Dinner",
    date: "Saturday, Oct 24, 2026 • 7:00 PM",
    location: "Grand Ballroom, City Center",
    category: "Reunion",
    going: 42,
    userRsvp: null
  },
  {
    id: 2,
    title: "Alumni Cricket League 2026",
    date: "Sunday, Nov 15, 2026 • 9:00 AM",
    location: "School Sports Ground",
    category: "Sports",
    going: 28,
    userRsvp: null
  }
];

const yearbookPhotos = [
  {
    title: "Annual Sports Day Championship",
    batch: "2024",
    tag: "Throwback",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=60",
    caption: "Green House lifting the overall champions trophy after 4 years!"
  },
  {
    title: "Class 12th Farewell Evening",
    batch: "2022",
    tag: "Farewell",
    imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=60",
    caption: "The last group picture right outside the library courtyard."
  },
  {
    title: "Science Exhibition Winners",
    batch: "2023",
    tag: "Milestone",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=60",
    caption: "Working on the IoT Smart City model in the physics lab."
  }
];

let chatMessagesData = {
  "2024": [
    { sender: "Karan", time: "10:14 AM", text: "Anyone free for coffee near campus today?" },
    { sender: "JD (You)", time: "10:16 AM", text: "I can join after 4 PM!" }
  ],
  "2022": [
    { sender: "Aman", time: "Yesterday", text: "Let me know if anyone needs referrals for engineering roles." }
  ],
  "2020": [
    { sender: "Pooja", time: "Yesterday", text: "Don't forget to RSVP for the dinner reunion!" }
  ],
  "all": [
    { sender: "Admin", time: "Aug 15", text: "Welcome to the verified AlumniHub network!" }
  ]
};

/* ==========================================================================
   INITIAL LOCALSTORAGE SYNC
   ========================================================================== */

if (!localStorage.getItem("alumni_posts_v4")) {
  localStorage.setItem("alumni_posts_v4", JSON.stringify(defaultPosts));
}
if (!localStorage.getItem("alumni_events_v4")) {
  localStorage.setItem("alumni_events_v4", JSON.stringify(eventsData));
}

let activeFilter = "all";
let mentorOnlyFilter = false;
let activeChatBatch = "2024";
let mapInstance = null;

/* ==========================================================================
   MULTI-PAGE ROUTER (HASH-BASED)
   ========================================================================== */

const validPages = ['home', 'feed', 'directory', 'events', 'yearbook', 'chat', 'about'];

function navigateToPage() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const targetPage = validPages.includes(hash) ? hash : 'home';

  validPages.forEach(page => {
    const pageEl = document.getElementById(`page-${page}`);
    const navEl = document.getElementById(`nav-${page}`);

    if (page === targetPage) {
      if (pageEl) {
        pageEl.classList.remove('hidden');
        if (page === 'feed') pageEl.classList.add('grid');
      }
      if (navEl) {
        navEl.className = "nav-link active-nav px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition";
      }
    } else {
      if (pageEl) {
        pageEl.classList.add('hidden');
        if (page === 'feed') pageEl.classList.remove('grid');
      }
      if (navEl) {
        navEl.className = "nav-link px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition text-blue-100 hover:bg-blue-700 dark:hover:bg-gray-700";
      }
    }
  });

  // Page-specific trigger hooks
  if (targetPage === 'feed') renderFeed();
  if (targetPage === 'directory') {
    renderDirectory();
    setTimeout(initMap, 250);
  }
  if (targetPage === 'events') renderEvents();
  if (targetPage === 'yearbook') renderYearbook();
  if (targetPage === 'chat') renderChat();
}

window.addEventListener('hashchange', navigateToPage);
window.addEventListener('DOMContentLoaded', navigateToPage);

/* ==========================================================================
   FEED LOGIC
   ========================================================================== */

function getPosts() {
  return JSON.parse(localStorage.getItem("alumni_posts_v4")) || [];
}

function savePosts(posts) {
  localStorage.setItem("alumni_posts_v4", JSON.stringify(posts));
  renderFeed();
}

function filterPosts(type) {
  activeFilter = type;
  ['all', 'achievement', 'opportunity', 'reunion'].forEach(btn => {
    const el = document.getElementById(`filter-${btn}`);
    if (el) {
      el.className = btn === type 
        ? "w-full text-left px-3 py-2 rounded-lg text-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-400 font-semibold flex items-center transition"
        : "w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition";
    }
  });
  renderFeed();
}

function renderFeed() {
  const container = document.getElementById("postsFeed");
  if (!container) return;
  const posts = getPosts();
  container.innerHTML = "";

  const filtered = activeFilter === "all" ? posts : posts.filter(p => p.category === activeFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500">No updates in this category.</div>`;
    return;
  }

  filtered.forEach(post => {
    const postEl = document.createElement("article");
    postEl.className = "bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-3";

    let badge = `<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-0.5 rounded-full">💬 General</span>`;
    if (post.category === 'achievement') badge = `<span class="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 font-semibold px-2.5 py-0.5 rounded-full">🏆 Achievement</span>`;
    if (post.category === 'opportunity') badge = `<span class="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full">💼 Job / Referral</span>`;
    if (post.category === 'reunion') badge = `<span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold px-2.5 py-0.5 rounded-full">📅 Reunion</span>`;

    const imgTag = post.imageUrl ? `<div class="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 max-h-80"><img src="${post.imageUrl}" class="w-full h-full object-cover"/></div>` : '';

    const commentsList = post.comments && post.comments.length > 0
      ? post.comments.map(c => `
          <div class="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg text-xs border border-gray-100 dark:border-gray-700">
            <span class="font-semibold text-gray-900 dark:text-white">${c.author}:</span>
            <span class="text-gray-600 dark:text-gray-300">${c.text}</span>
          </div>`).join('')
      : `<p class="text-xs text-gray-400 italic">No comments yet.</p>`;

    postEl.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">${post.author.charAt(0)}</div>
          <div>
            <div class="flex items-center space-x-1.5">
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">${post.author}</h3>
              <i class="fa-solid fa-circle-check text-blue-500 text-xs" title="Verified"></i>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Batch of '${post.batch} • ${post.time}</p>
          </div>
        </div>
        ${badge}
      </div>

      <p class="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">${post.content}</p>
      ${imgTag}

      <div class="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <button onclick="toggleLike(${post.id})" class="flex items-center space-x-1.5 font-medium ${post.hasLiked ? 'text-red-500' : 'hover:text-red-500'}">
          <i class="${post.hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          <span>${post.likes} Likes</span>
        </button>
        <span><i class="fa-regular fa-comment mr-1"></i> ${post.comments ? post.comments.length : 0} Replies</span>
      </div>

      <div class="pt-2 space-y-2">
        <div class="space-y-1">${commentsList}</div>
        <div class="flex gap-2 pt-1">
          <input type="text" id="comment-input-${post.id}" placeholder="Write a comment..." class="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-xs outline-none focus:border-blue-500" onkeypress="if(event.key==='Enter') addComment(${post.id})"/>
          <button onclick="addComment(${post.id})" class="text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition">Reply</button>
        </div>
      </div>
    `;
    container.appendChild(postEl);
  });
}

function addPost() {
  const content = document.getElementById("postContent").value.trim();
  const imageUrl = document.getElementById("postImageUrl").value.trim();
  const category = document.getElementById("postCategory").value;
  const batch = document.getElementById("postBatch").value;

  if (!content) return;

  const newPost = {
    id: Date.now(),
    author: "You",
    batch: batch,
    category: category,
    time: "Just now",
    content: content,
    imageUrl: imageUrl,
    likes: 0,
    hasLiked: false,
    comments: []
  };

  const posts = getPosts();
  posts.unshift(newPost);
  document.getElementById("postContent").value = "";
  document.getElementById("postImageUrl").value = "";
  savePosts(posts);
}

function toggleLike(id) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    post.hasLiked = !post.hasLiked;
    post.likes += post.hasLiked ? 1 : -1;
    savePosts(posts);
  }
}

function addComment(id) {
  const input = document.getElementById(`comment-input-${id}`);
  const text = input.value.trim();
  if (!text) return;

  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push({ id: Date.now(), author: "You", text: text });
    input.value = "";
    savePosts(posts);
  }
}

/* ==========================================================================
   DIRECTORY & GEOMAP
   ========================================================================== */

function toggleMentorOnlyFilter() {
  mentorOnlyFilter = !mentorOnlyFilter;
  const btn = document.getElementById("mentor-filter-btn");
  if (btn) {
    btn.className = mentorOnlyFilter 
      ? "px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium transition"
      : "px-3 py-1.5 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-700 font-medium transition";
  }
  renderDirectory();
}

function renderDirectory() {
  const grid = document.getElementById("directoryGrid");
  if (!grid) return;
  const query = (document.getElementById("dirSearchInput")?.value || "").toLowerCase();
  grid.innerHTML = "";

  const filtered = alumniProfiles.filter(alumnus => {
    const matchesMentor = !mentorOnlyFilter || alumnus.openToMentor;
    const matchesQuery = !query || alumnus.name.toLowerCase().includes(query) || alumnus.role.toLowerCase().includes(query) || alumnus.city.toLowerCase().includes(query);
    return matchesMentor && matchesQuery;
  });

  filtered.forEach(a => {
    const card = document.createElement("div");
    card.className = "card-hover bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3";
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">${a.name.charAt(0)}</div>
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
              ${a.name} <i class="fa-solid fa-circle-check text-blue-500 text-xs"></i>
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">Batch of '${a.batch}</p>
          </div>
        </div>
        ${a.openToMentor ? '<span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">Mentor</span>' : ''}
      </div>
      <div>
        <p class="text-xs font-semibold text-gray-800 dark:text-gray-200">${a.role}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
          <i class="fa-solid fa-location-dot text-red-500"></i> ${a.city}
        </p>
      </div>
      <div class="flex flex-wrap gap-1 pt-1">
        ${a.skills.map(s => `<span class="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">${s}</span>`).join('')}
      </div>
      <button class="w-full text-xs font-semibold bg-blue-50 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-300 py-1.5 rounded-lg transition">
        Connect / Message
      </button>
    `;
    grid.appendChild(card);
  });
}

function initMap() {
  const mapDiv = document.getElementById('alumniMap');
  if (!mapDiv || mapInstance) return;

  mapInstance = L.map('alumniMap').setView([20.5937, 78.9629], 3);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapInstance);

  alumniProfiles.forEach(a => {
    L.marker([a.lat, a.lng]).addTo(mapInstance)
      .bindPopup(`<b>${a.name}</b> (Batch '${a.batch})<br>${a.role}<br>📍 ${a.city}`);
  });
}

/* ==========================================================================
   EVENTS LOGIC
   ========================================================================== */

function renderEvents() {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;
  const events = JSON.parse(localStorage.getItem("alumni_events_v4")) || eventsData;
  grid.innerHTML = "";

  events.forEach(evt => {
    const card = document.createElement("div");
    card.className = "card-hover bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4";
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <span class="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-semibold px-2.5 py-0.5 rounded-full">${evt.category}</span>
        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400"><i class="fa-solid fa-users mr-1"></i> ${evt.going} Confirmed</span>
      </div>
      <div>
        <h3 class="font-bold text-gray-900 dark:text-white text-base">${evt.title}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1"><i class="fa-regular fa-clock mr-1.5"></i> ${evt.date}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"><i class="fa-solid fa-location-dot mr-1.5 text-red-500"></i> ${evt.location}</p>
      </div>
      <div class="pt-2 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <button onclick="handleRSVP(${evt.id}, 'going')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold ${evt.userRsvp === 'going' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 dark:bg-gray-700 dark:text-emerald-300'} transition">
          <i class="fa-solid fa-check mr-1"></i> Going
        </button>
        <button onclick="handleRSVP(${evt.id}, 'interested')" class="flex-1 py-1.5 rounded-lg text-xs font-semibold ${evt.userRsvp === 'interested' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-300'} transition">
          <i class="fa-regular fa-star mr-1"></i> Interested
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function handleRSVP(id, status) {
  const events = JSON.parse(localStorage.getItem("alumni_events_v4")) || eventsData;
  const evt = events.find(e => e.id === id);
  if (evt) {
    if (evt.userRsvp === status) {
      evt.userRsvp = null;
      if (status === 'going') evt.going--;
    } else {
      if (evt.userRsvp === 'going') evt.going--;
      evt.userRsvp = status;
      if (status === 'going') evt.going++;
    }
    localStorage.setItem("alumni_events_v4", JSON.stringify(events));
    renderEvents();
  }
}

/* ==========================================================================
   YEARBOOK LOGIC
   ========================================================================== */

function renderYearbook() {
  const grid = document.getElementById("yearbookGrid");
  if (!grid) return;
  grid.innerHTML = "";

  yearbookPhotos.forEach(p => {
    const card = document.createElement("div");
    card.className = "card-hover bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm";
    card.innerHTML = `
      <div class="h-48 overflow-hidden bg-gray-100">
        <img src="${p.imageUrl}" alt="${p.title}" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
      </div>
      <div class="p-4 space-y-1.5">
        <div class="flex justify-between items-center text-xs">
          <span class="font-bold text-blue-600 dark:text-blue-400">Batch '${p.batch}</span>
          <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-[10px] font-semibold">${p.tag}</span>
        </div>
        <h4 class="font-bold text-gray-900 dark:text-white text-sm">${p.title}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">${p.caption}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ==========================================================================
   BATCH LOUNGE (CHAT) LOGIC
   ========================================================================== */

function switchChatBatch(batch) {
  activeChatBatch = batch;
  ['2024', '2022', '2020', 'all'].forEach(b => {
    const btn = document.getElementById(`chat-batch-${b}`);
    if (btn) {
      btn.className = b === batch 
        ? "w-full text-left px-3 py-2 rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between"
        : "w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between";
    }
  });
  renderChat();
}

function renderChat() {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  container.innerHTML = "";
  const messages = chatMessagesData[activeChatBatch] || [];

  messages.forEach(msg => {
    const isMe = msg.sender.includes("You");
    const msgEl = document.createElement("div");
    msgEl.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'}`;
    msgEl.innerHTML = `
      <span class="text-[10px] text-gray-400 mb-0.5">${msg.sender} • ${msg.time}</span>
      <div class="px-3.5 py-2 rounded-2xl max-w-xs text-xs ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-none'}">
        ${msg.text}
      </div>
    `;
    container.appendChild(msgEl);
  });
  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  if (!chatMessagesData[activeChatBatch]) chatMessagesData[activeChatBatch] = [];
  chatMessagesData[activeChatBatch].push({
    sender: "JD (You)",
    time: "Just now",
    text: text
  });

  input.value = "";
  renderChat();
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = "fa-solid fa-sun";
}
