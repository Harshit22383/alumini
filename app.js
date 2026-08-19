// Initial Mock Data (Saved into localStorage for persistence)
const defaultPosts = [
  {
    id: 1,
    author: "Aman Sharma",
    batch: "2022",
    category: "achievement",
    time: "2 hours ago",
    content: "Excited to share that I've joined Google as a Software Engineer Intern! Grateful for the school CS lab days.",
    likes: 12,
    hasLiked: false
  },
  {
    id: 2,
    author: "Pooja Verma",
    batch: "2020",
    category: "reunion",
    time: "5 hours ago",
    content: "Planning a mini-reunion in Delhi next weekend for the Class of 2020. Drop a comment if you are in town!",
    likes: 8,
    hasLiked: false
  }
];

// Initialize storage
if (!localStorage.getItem("alumni_posts")) {
  localStorage.setItem("alumni_posts", JSON.stringify(defaultPosts));
}

let activeFilter = "all";

function getPosts() {
  return JSON.parse(localStorage.getItem("alumni_posts")) || [];
}

function savePosts(posts) {
  localStorage.setItem("alumni_posts", JSON.stringify(posts));
  renderFeed();
}

function renderFeed() {
  const feedContainer = document.getElementById("postsFeed");
  const posts = getPosts();
  feedContainer.innerHTML = "";

  const filteredPosts = activeFilter === "all" 
    ? posts 
    : posts.filter(p => p.category === activeFilter);

  if (filteredPosts.length === 0) {
    feedContainer.innerHTML = `
      <div class="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
        No updates found in this category.
      </div>`;
    return;
  }

  filteredPosts.forEach(post => {
    const postEl = document.createElement("article");
    postEl.className = "bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3";

    // Category badge color
    const categoryBadge = post.category === "achievement" 
      ? '<span class="text-xs bg-yellow-100 text-yellow-800 font-semibold px-2.5 py-0.5 rounded-full">Achievement</span>'
      : post.category === "reunion"
      ? '<span class="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">Reunion</span>'
      : '<span class="text-xs bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-full">Update</span>';

    postEl.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
            ${post.author.charAt(0)}
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">${post.author}</h3>
            <p class="text-xs text-gray-500">Batch of '${post.batch} • ${post.time}</p>
          </div>
        </div>
        ${categoryBadge}
      </div>

      <p class="text-gray-800 text-sm leading-relaxed">${post.content}</p>

      <div class="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <button onclick="toggleLike(${post.id})" class="flex items-center space-x-1.5 font-medium ${post.hasLiked ? 'text-red-500' : 'hover:text-red-500'}">
          <i class="${post.hasLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          <span>${post.likes} Likes</span>
        </button>
        <span class="cursor-pointer hover:underline">Share</span>
      </div>
    `;
    feedContainer.appendChild(postEl);
  });
}

function addPost() {
  const input = document.getElementById("postContent");
  const category = document.getElementById("postCategory").value;
  const content = input.value.trim();

  if (!content) return;

  const newPost = {
    id: Date.now(),
    author: "You",
    batch: "2024",
    category: category,
    time: "Just now",
    content: content,
    likes: 0,
    hasLiked: false
  };

  const posts = getPosts();
  posts.unshift(newPost);
  input.value = "";
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

function filterPosts(type) {
  activeFilter = type;
  renderFeed();
}

// Initial Render
renderFeed();