$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

liked=(event)=>{
  let id=event.getAttribute('id');
  let icon_div=document.getElementById(id);
  event.classList.toggle("fa fa-thumbs-up");
}
