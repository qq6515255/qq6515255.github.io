var add = document.getElementById('add-icon');
var add_type = document.getElementById('add_type');

add.onclick = function() {
    var add_box = document.getElementsByClassName('add_friend')[0];
    if (add_box.style.display == 'none') {
        add_box.style.display = 'block';
    } else {
        add_box.style.display = 'none'
    }
}


add_type.onclick = function() {
    add_type[i].classList.remove('active');
    this.classList.add('active');
}