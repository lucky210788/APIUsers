const baseUrl = 'https://jsonplaceholder.typicode.com';

window.onload = () => {
    const btnGetUsers = document.querySelector('.btn-get-users');

    btnGetUsers.addEventListener('click', () => {
        get(`${baseUrl}/users`).then((response) => {
            renderUsers(response);
            const usersList = document.querySelector('.users-list');
            usersList.addEventListener('click', (e) => {
                handleClickOnUser(e.target.id);
            });
        }).catch((error) => {
            console.error(error);
        });
    });
};

function get(url) {
    const toast = new Toasty();
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = () => {
            if (request.status === 200) {
                toast.info("successful response");
                resolve(JSON.parse(request.response));
            } else {
                toast.error('not successful response');
                reject(Error(
                    'Произошла ошибка. Код ошибки:' + request.statusText
                ));
            }
        };
        request.send();
    });
}

function renderUsers(users) {
    const usersList = document.querySelector('.users-list');
    const postsList = document.querySelector('.posts');
    const comment = document.querySelector('.comment');
    usersList.classList.remove('d-none');
    postsList.innerHTML = '';
    usersList.innerHTML = '';
    comment.innerHTML = '';
    users.forEach((user) => {
        usersList.innerHTML += `<li id="${user.id}" class="users-list-item list-item">${user.name}</li>`;
    });
}

function renderPosts(posts) {
    let list = document.createElement('ul');
    const comment = document.querySelector('.comment');
    list.setAttribute('class', 'posts-list list');
    list.innerHTML = '';
    comment.innerHTML = '';
    posts.forEach((post) => {
        const itemList = `<li id="${post.id}" class="posts-list-item list-item">
                                ${post.title}
                                <div class="comments">
                                    <div class="spinner"></div>
                                </div>
                            </li>`;
        list.innerHTML += itemList;
    });
    const block = document.querySelector('.posts');
    block.innerHTML = '';
    block.appendChild(list);
}

function renderComments(posts) {
    let list = document.createElement('ul');
    list.setAttribute('class', 'comment-list list');
    list.innerHTML = '';
    posts.forEach((post) => {
        list.innerHTML += `<li id="${post.id}" class="posts-list-item list-item">${post.name}</li>`;
    });
    const block = document.querySelector('.comment');
    block.innerHTML = '';
    block.appendChild(list);
}

function handleClickOnUser(user) {
    get(`${baseUrl}/posts?userId=${user}`)
        .then((response) => {
            renderPosts(response);
            getCountComments();
            const postsList = document.querySelector('.posts-list');
            postsList.addEventListener('click', (e) => {
                handleClickOnPost(e.target.id);
            })
        }).catch((error) => {
        console.error(error);
    });
}

function handleClickOnPost(post) {
    get(`${baseUrl}/comments?postId=${post}`)
        .then((response) => {
            renderComments(response);
        }).catch((error) => {
        console.error(error);
    });
}

function getCountComments() {
    const postsList = document.querySelectorAll('.posts-list-item');
    postsList.forEach((post) => {
        const postBlock = post.querySelector('.comments');
        get(`${baseUrl}/comments?postId=${post.getAttribute('id')}`)
            .then((response) => {
                postBlock.innerHTML = response.length;
            }).catch((error) => {
            console.error(error);
        });
    });
}