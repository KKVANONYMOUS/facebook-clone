$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

changeicon=(event)=>{
  let icon_id=event.getAttribute('id');
  let icon=document.getElementById(icon_id);
  icon.setAttribute('src','/assets/like-1.png')
}