const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2, // Trigger when 20% is visible
  }
);

document.querySelectorAll(".subject-box").forEach((box) => {
  observer.observe(box);
});
