let handler = async (m, {
    conn,
    command,
    dbBot
}) => {
    switch (command) {
        case "self":
            dbBot[conn.user.jid].self = true
            m.reply(await Func.style("Bot Berhasil Self", 1))
            break
        case "public":
            dbBot[conn.user.jid].self = false
            m.reply(await Func.style("Bot Berhasil Public", 1))
            break
    }
}
handler.help = handler.command = ["self", "public"];
handler.tags = ["owner"];
handler.owner = true
export default handler