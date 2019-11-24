window.onload = function () {
    const btnGetUsers = document.querySelector('.btn-get-users');

    btnGetUsers.addEventListener('click', function () {
        get('https://jsonplaceholder.typicode.com/users').then(function (response) {
            renderUsers(JSON.parse(response));
        }).then(function () {
            let usersList = document.querySelector('.users-list');
            usersList.addEventListener('click', function (e) {
                handleClickOnUser(e.target.id);
            });
        }).catch(function (error) {
            console.error(error);
        });
    });
};

function get(url) {
    const toast = new Toasty();
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = function () {
            if (request.status === 200) {
                toast.info("successful response");
                resolve(request.response);
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
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const itemList = `<li id="${user.id}" class="users-list-item list-item">${user.name}</li>`;
        usersList.innerHTML += itemList;
    }
}

function renderPosts(posts) {
    let list = document.createElement('ul');
    const comment = document.querySelector('.comment');
    list.setAttribute('class', 'posts-list list');
    list.innerHTML = '';
    comment.innerHTML = '';
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const itemList = `<li id="${post.id}" class="posts-list-item list-item">
                                ${post.title}
                                <div class="comments">
                                    <div class="spinner"></div>
                                </div>
                            </li>`;
        list.innerHTML += itemList;
    }
    const block = document.querySelector('.posts');
    block.innerHTML = '';
    block.appendChild(list);
}

function renderComments(posts) {
    let list = document.createElement('ul');
    list.setAttribute('class', 'comment-list list');
    list.innerHTML = '';
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const itemList = `<li id="${post.id}" class="posts-list-item list-item">${post.name}</li>`;
        list.innerHTML += itemList;
    }
    const block = document.querySelector('.comment');
    block.innerHTML = '';
    block.appendChild(list);
}

function handleClickOnUser(user) {
    get(`https://jsonplaceholder.typicode.com/posts?userId=${user}`)
        .then(function (response) {
            renderPosts(JSON.parse(response));
        })
        .then(function () {
            getCountComments();
        })
        .then(function () {
            let postsList = document.querySelector('.posts-list');
            postsList.addEventListener('click', function (e) {
                handleClickOnPost(e.target.id);
            })
        }).catch(function (error) {
        console.error(error);
    });
}

function handleClickOnPost(post) {
    get(`https://jsonplaceholder.typicode.com/comments?postId=${post}`)
        .then(function (response) {
            renderComments(JSON.parse(response));
        }).catch(function (error) {
        console.error(error);
    });
}

function getCountComments() {
    let postsList = document.querySelectorAll('.posts-list-item');
    for (let i = 0; i < postsList.length; i++) {
        const post = postsList[i];
        let postBlock = post.querySelector('.comments');
        get(` https://jsonplaceholder.typicode.com/comments?postId=${post.getAttribute('id')}`)
            .then(function (response) {
            const comments = JSON.parse(response);
            postBlock.innerHTML = comments.length;
        }).catch(function (error) {
            console.error(error);
        });
    }
}