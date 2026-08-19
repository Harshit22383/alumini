// Initial Mock Posts Data
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
      { id: 101, author: "Rahul Verma", text: "Huge congratulations Aman! Proud moment!" },
      { id: 102, author: "Pooja Gupta", text: "Treat pending bro 🎉" }
    ]
  },
  {
    id: 2,
    author: "Sneha Nair",
    batch: "2023",
    category: "opportunity",
    time: "4 hours ago",
    content: "My team at StartupLabs is hiring 2 Frontend Interns (React / Tailwind). School alumni get direct referral. DM me with your portfolio!",
    imageUrl: "",
    likes: 24,
    hasLiked: false,
    comments: [
      { id: 103, author: "Karan Patel", text: "Sent you my portfolio on LinkedIn!" }
    ]
  },
  {
    id: 3,
    author: "Rohan Kapoor",
    batch: "2020",
    category: "reunion",
    time: "Yesterday",
    content: "Annual Cricket Cup + Class of 2020 reunion scheduled for next Saturday at the school sports complex. Reach out to RSVP!",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=60",
    likes: 31,
    hasLiked: false,
    comments: [
      { id: 104, author: "Vikram Singh", text: "Count me in for bowling 🏏" }
    ]
  },
  {
    id: 4,
    author: "Ananya Iyer",
    batch: "2021",
    category: "achievement",
    time: "2 days ago",
    content: "Our team just published our first research paper on Edge Computing at IEEE! Thankful to Mr. Sharma for sparking my interest in networks.",
    imageUrl: "",
    likes: 15,
    hasLiked: false,
    comments: []
  }
];

// Initialize storage
if (!localStorage.getItem("alumni_posts_v2")) {
  localStorage.setItem("alumni_posts_v2", JSON.stringify(defaultPosts));
}

let activeFilter = "all";
let searchQuery = "";

function getPosts() {
  return JSON.parse(localStorage.getItem("alumni_posts_v2")) || [];
}

function savePosts(posts) {
  localStorage.setItem("alumni_posts_v2", JSON.stringify(posts));
  renderFeed();
}

function handleSearch(query) {
  searchQuery = query.toLowerCase();
  renderFeed();
}

function filterPosts(type) {
  activeFilter = type;
  
  // Highlight active filter button
  const filterButtons = ['all', 'achievement', 'opportunity', 'reunion'];
  filterButtons.forEach(btn => {
    const el = document.getElementById(`filter-${btn}`);
    if (el) {
      if (btn === type) {
        el.className = "w-full text-left px-3 py-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center transition font-semibold";
      } else {
        el.className = "w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center transition font-medium";
      }
    }
  });

  renderFeed();
}

function renderFeed() {
  const feedContainer = document.getElementById("postsFeed");
  const posts = getPosts();
  feedContainer.innerHTML = "";

  // Apply Category Filter & Search Filter
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeFilter === "all" || post.category === activeFilter;
    const matchesSearch = !searchQuery || 
      post.author.toLowerCase().includes(searchQuery) ||
      post.content.toLowerCase().includes(searchQuery) ||
      post.batch.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filteredPosts.length === 0) {
    feedContainer.innerHTML = `
      <div class="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500 space-y-2">
        <i class="fa-regular fa-folder-open text-3xl text-gray-400"></i>
        <p class="font-medium">No updates found</p>
        <p class="text-xs text-gray-400">Try changing your search keywords or category filter.</p>
      </div>`;
    return;
  }

  filteredPosts.forEach(post => {
    const postEl = document.createElement("article");
    postEl.className = "bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3";

    // Category Badge
    let badgeHtml = '<span class="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-full">💬 General</span>';
    if (post.category === "achievement") {
      badgeHtml = '<span class="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2.5 py-0.5 rounded-full">🏆 Achievement</span>';
    } else if (post.category === "opportunity") {
      badgeHtml = '<span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">💼 Job / Career</span>';
    } else if (post.category === "reunion") {
      badgeHtml = '<span class="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">📅 Reunion</span>';
    }

    // Optional Image attachment
    const imageAttachment = post.imageUrl 
      ? `<div class="rounded-lg overflow-hidden border border-gray-100 max-h-80"><img src="${post.imageUrl}" alt="Post image" class="w-full h-full object-cover"/></div>`
      : '';

    // Comments HTML
    const commentsList = post.comments && post.comments.length > 0 
      ? post.comments.map(c => `
          <div class="bg-gray-50 p-2.5 rounded-lg text-xs space-y-0.5 border border-gray-100">
            <span class="font-semibold text-gray-800">${c.author}:</span>
            <span class="text-gray-600">${c.text}</span>
          </div>
        `).join('')
      : `<p class="text-xs text-gray-400 italic">No comments yet. Be the first to reply!</p>`;

    postEl.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
            ${post.author.charAt(0)}
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 text-sm">${post.author}</h3>
            <p class="text-xs text-gray-500">Batch of '${post.batch} • ${post.time}</p>
          </div>
        </div>
        ${badgeHtml}
      </div>

      <p class="text-gray-800 text-sm leading-relaxed">${post.content}</p>

      ${imageAttachment}

      <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <button onclick="toggleLike(${post.id})" class="flex items-center space-x-1.5 font-medium transition ${post.hasLiked ? 'text-red-500' : 'hover:text-red-500'}">
          <i class="${post.hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          <span>${post.likes} Likes</span>
        </button>

        <span class="text-gray-400 font-medium">
          <i class="fa-regular fa-comment mr-1"></i> ${post.comments ? post.comments.length : 0} Comments
        </span>
      </div>

      <!-- Comment Section -->
      <div class="pt-3 border-t border-gray-50 space-y-2">
        <div class="space-y-1.5">
          ${commentsList}
        </div>
        <div class="flex items-center space-x-2 pt-1">
          <input 
            type="text" 
            id="comment-input-${post.id}" 
            placeholder="Write a comment..." 
            class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
            onkeypress="if(event.key === 'Enter') addComment(${post.id})"
          />
          <button 
            onclick="addComment(${post.id})" 
            class="text-xs bg-gray-200 hover:bg-blue-600 hover:text-white font-medium px-3 py-1.5 rounded-lg transition"
          >
            Reply
          </button>
        </div>
      </div>
    `;

    feedContainer.appendChild(postEl);
  });
}

function addPost() {
  const contentInput = document.getElementById("postContent");
  const imageInput = document.getElementById("postImageUrl");
  const category = document.getElementById("postCategory").value;
  const batch = document.getElementById("postBatch").value;
  
  const content = contentInput.value.trim();
  const imageUrl = imageInput.value.trim();

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
  
  contentInput.value = "";
  imageInput.value = "";
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

function addComment(postId) {
  const input = document.getElementById(`comment-input-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push({
      id: Date.now(),
      author: "You",
      text: text
    });
    input.value = "";
    savePosts(posts);
  }
}

// Initial render call
renderFeed();
