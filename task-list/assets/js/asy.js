const baseUrl = 'https://jsonplaceholder.typicode.com';

window.onload = () => {
    const btnGetUsers = document.querySelector('.btn-get-users');

    btnGetUsers.addEventListener('click', async () => {
        try {
            const users = await get(`${baseUrl}/users`);
            buildUsersList(users);
            const usersList = document.querySelector('.users-list');
            usersList.addEventListener('click', async (e) => {
                const posts = await get(`${baseUrl}/posts?userId=${e.target.id}`);
                buildPostList(posts);
                const postsItems = document.querySelectorAll('.posts-list-item');
                postsItems.forEach(async (post) => {
                    const postBlock = post.querySelector('.comments');
                    const countComments = await get(`${baseUrl}/comments?postId=${post.getAttribute('id')}`);
                    postBlock.innerHTML = countComments.length;
                });
                const postsList = document.querySelector('.posts-list');
                postsList.addEventListener('click', async (e) => {
                    const comments = await get(`${baseUrl}/comments?postId=${e.target.id}`);
                    buildCommentsList(comments);
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

function buildUsersList(users) {
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

function buildPostList(posts) {
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

function buildCommentsList(posts) {
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