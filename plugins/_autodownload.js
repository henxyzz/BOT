import axios from "axios"
import puppeteer from "puppeteer"
export async function before(m, { isPrems }) {
    let user = global.db.data.users[m.sender]
    let chat = global.db.data.chats[m.chat]
    let setting = global.db.data.settings[this.user.jid]

    if (!m.text) return
    if (m.isBaileys || m.fromMe) return
    if (m.text.startsWith('=>') || m.text.startsWith('>') || m.text.startsWith('.') || m.text.startsWith('#') || m.text.startsWith('!') || m.text.startsWith('/') || m.text.startsWith('\/')) return
    if (chat.mute || chat.isBanned || user.banned) return

    let text = m.text.replace(/\n+/g, ' ')
    if ((chat.autodownload || user.autodownload) && text.match(regex)) {
        this.autodownload = this.autodownload || {}
        let link = text.match(regex)[0]

        if (/^http(s)?:\/\/(www|v(t|m)).tiktok.com\/[-a-zA-Z0-9@:%._+~#=]/i.test(link)) {
            if (!(m.sender in this.autodownload)) {
                try {
                    this.autodownload[m.sender] = true
                    if (setting.composing) await this.sendPresenceUpdate('composing', m.chat).catch(() => {})
                    if (setting.autoread) await this.readMessages([m.key]).catch(() => {})
                    await global.loading(m, conn)
                    let { data } = await tiktok(link)
                    if (data.images) {
                        await this.sendFile(m.chat, data.images[0], false, link, m)
                    } else {
                        await this.sendFile(m.chat, data.play, false, link, m)
                    }
                } catch (e){
                    return !0
                } finally {
                    await global.loading(m, conn, true)
                    delete this.autodownload[m.sender]
                }
            }
        }

        if (/^http(s)?:\/\/(www)?.instagram.com\/(p|reel|v)\/[-a-zA-Z0-9@:%._+~#=]|https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%+-]+(\/[A-Za-z0-9._%+-]+)*(\/\?[A-Za-z0-9=&._%+-]*)?/i.test(link)) {
            if (!(m.sender in this.autodownload)) {
                try {
                    this.autodownload[m.sender] = true
                    if (setting.composing) await this.sendPresenceUpdate('composing', m.chat).catch(() => {})
                    if (setting.autoread) await this.readMessages([m.key]).catch(() => {})
                    await global.loading(m, conn)
                    let media = await getInstagramStories(link)
                    await this.sendFile(m.chat, media[0], false, link, m)
                } catch {
                    return !0
                } finally {
                    await global.loading(m, conn, true)
                    delete this.autodownload[m.sender]
                }
            }
        }

    }
    return !0
}

async function tiktok(url) {
    let res = await axios.post('https://www.tikwm.com/api', {}, {
        params: {
            url, hd: 1
        }
    })
    return res.data
}

let regex = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi
let delay = time => new Promise(res => setTimeout(res, time))

const getInstagramStories = async (instagramStoriesURL) => {
    let browser
    let page
    let downloadLinks = []
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: "new"
        })
        page = await browser.newPage()

        const userAgents = [
            "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
            "Mozilla/5.0 (Windows NT 10.0 Win64 x64 rv:89.0) Gecko/20100101 Firefox/89.0",
            "Mozilla/5.0 (Macintosh Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.48",
        ]

        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
        console.log("UserAgent : " + randomUserAgent)
        await page.setUserAgent(randomUserAgent)

        const WebsiteURL = "https://fastdl.app/story-saver"

        await page.goto(WebsiteURL, {
            waitUntil: "networkidle2", timeout: 60000
        })

        await page.waitForSelector("#search-form-input")

        await page.$eval("#search-form-input", (el, value) => {
            el.value = value
            el.dispatchEvent(new Event("input", {
                bubbles: true
            }))
        }, instagramStoriesURL)

        await page.click(".search-form__button")

        await page.waitForSelector(".output-list__item", {
            timeout: 60000
        })

        const downloadLinks = await page.$$eval(
            ".button.button--filled.button__download",
            (elements) => elements.map((el) => el.href)
        )

        return downloadLinks
    } catch (error) {
        if (page) {
            await page.screenshot({
                path: "error_screenshot.png"
            })
        }
        console.error(error)
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}