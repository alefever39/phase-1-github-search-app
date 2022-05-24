addEventListener('DOMContentLoaded', () => {
    addSubmitEventListener()
})


function addSubmitEventListener() {
    let form = document.querySelector('form')
    form.addEventListener('submit', e => {
        e.preventDefault()
        getUserInformation(e.target.searchType.value, e.target.search.value)
    })
}


function getUserInformation (searchTypeValue, searchName) {
    fetch(`https://api.github.com/search/users?q=${searchName}`)
    .then(resp => resp.json())
    .then(data => {
        const reposListUl = document.querySelector('#repos-list')
        reposListUl.textContent = ''
        const userList = document.querySelector('#user-list')
        userList.textContent = ''
        handleSearchType(data, searchTypeValue, userList, reposListUl)
    })
}

function handleSearchType(data, searchTypeValue, userList, reposListUl) {
    if (searchTypeValue === 'user-search') {
        data.items.forEach(searchResult => {
            const reposListUrl = searchResult['repos_url']
            buildNewUserLi(searchResult, userList, reposListUrl, reposListUl)
        })
    }
    else {
        const reposListUrl = data.items[0]['repos_url']
        fetchReposList(reposListUrl, reposListUl)
    }
}




function buildNewUserLi(searchResult, userList, reposListUrl, reposListUl) {
    const li = document.createElement('li')
    const img = document.createElement('img')
    const a = document.createElement('a')
    const btn = document.createElement('button')
    const br = document.createElement('br')

    li.className = 'userInfo'
    img.src = searchResult['avatar_url']
    img.className = 'avatar'
    a.href = searchResult['html_url']
    a.textContent = searchResult.login
    btn.textContent = 'Display Repos'
    btn.addEventListener('click', () => fetchReposList(reposListUrl, reposListUl))

    li.append(img, a, btn)
    userList.append(li, br)
}




function fetchReposList(reposListUrl, reposListUl) {
    fetch(reposListUrl)
    .then(resp => resp.json())
    .then(data => {
        reposListUl.textContent = ''
        data.forEach(repo => buildNewReposLi(repo, reposListUl))
    })
}

function buildNewReposLi(repo, reposListUl) {
    const li = document.createElement('li')
    const a = document.createElement('a')

    a.href = repo['html_url']
    a.textContent = repo.name
    li.append(a)
    reposListUl.append(li)
}
