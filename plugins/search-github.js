/*
- [ *PLUGINS GIT SEARCH* ]
- Description: Search github repositori

- Created by parhan
- Request bisa ke: 6283873688108

- Api: -
- Website: https://www.ureshii.my.id
- Connected: https://whatsapp.com/channel/0029VavoHgNDuMRZyeRUQE0o
*/

import fetch from 'node-fetch'
let handler = async (m, { text, command, usedPrefix }) => {
    if (!text) throw `Masukkan pencarian\nContoh: *${usedPrefix + command}* stikerinbot`
    
    m.react("⌛")
    
    let res = await fetch(global.API('https://api.github.com', '/search/repositories', { q: text }))
    if (!res.ok) throw eror
    let json = await res.json()
    
    let str = json.items.map((repo, index) => {
    return `*${ 1 + index }. ${repo.name}*
By *${repo.owner.login}*

> Forked: ${repo.fork ? 'True' : 'False'}
> Private: ${repo.private ? 'True': 'False'}

> Dibuat: ${formatDate(repo.created_at)}
> Terakhir up: ${formatDate(repo.updated_at)}

> View: ${repo.watchers}
> Fork: ${repo.forks}
> Stars: ${repo.stargazers_count}

> Issue: ${repo.open_issues} ${repo.description ? `

${repo.description}` : ''}

*${repo.clone_url}*
    `.trim()
    }).join('\n\n')
    
    m.reply(str)
}
    
handler.help = ['github <pencarian>']
handler.tags = ['search']
handler.command = /^g(ithub|h)s(earch)?$/i

export default handler

function formatDate(n, locale = 'id') {
    let d = new Date(n)
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    })
}