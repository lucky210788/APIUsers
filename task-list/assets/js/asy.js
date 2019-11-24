window.onload = () => {
    const btnGetUsers = document.querySelector('.btn-get-users');

    btnGetUsers.addEventListener('click', async () => {
        try {
            let users = await get('https://jsonplaceholder.typicode.com/users');
            buildUsersList(JSON.parse(users));
            let usersList = document.querySelector('.users-list');
            usersList.addEventListener('click', async (e) => {
                let posts = await get(`https://jsonplaceholder.typicode.com/posts?userId=${e.target.id}`);
                buildPostList(JSON.parse(posts));
                let postsItems = document.querySelectorAll('.posts-list-item');
                for (let i = 0; i < postsItems.length; i++) {
                    const post = postsItems[i];
                    let postBlock = post.querySelector('.comments');
                    let countComments = await get(` https://jsonplaceholder.typicode.com/comments?postId=${post.getAttribute('id')}`);
                    postBlock.innerHTML = JSON.parse(countComments).length;
                }
                let postsList = document.querySelector('.posts-list');
                postsList.addEventListener('click', async (e) => {
                    const comments = await get(`https://jsonplaceholder.typicode.com/comments?postId=${e.target.id}`);
                    buildCommentsList(JSON.parse(comments));
                })
            })
        } catch (error) {
            console.error(error);
        }
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

function buildUsersList(users) {
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

function buildPostList(posts) {
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

function buildCommentsList(posts) {
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