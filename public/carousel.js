const slider = document.querySelector('.items');
const slider2 = document.querySelector('.items2');
const slider3 = document.querySelector('.items3');
let isDown = false;
let isDown2 = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
  isDown = false;
  slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
  console.log(walk);
});


slider2.addEventListener('mousedown', (e) => {
  isDown = true;
  slider2.classList.add('active');
  startX = e.pageX - slider2.offsetLeft;
  scrollLeft = slider2.scrollLeft;
});
slider2.addEventListener('mouseleave', () => {
  isDown = false;
  slider2.classList.remove('active');
});
slider2.addEventListener('mouseup', () => {
  isDown = false;
  slider2.classList.remove('active');
});
slider2.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider2.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider2.scrollLeft = scrollLeft - walk;
  console.log(walk);
});



slider3.addEventListener('mousedown', (e) => {
  isDown = true;
  slider3.classList.add('active');
  startX = e.pageX - slider3.offsetLeft;
  scrollLeft = slider3.scrollLeft;
});
slider3.addEventListener('mouseleave', () => {
  isDown = false;
  slider3.classList.remove('active');
});
slider3.addEventListener('mouseup', () => {
  isDown = false;
  slider3.classList.remove('active');
});
slider3.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider3.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  slider3.scrollLeft = scrollLeft - walk;
  console.log(walk);
});
