const {XMLHttpRequest} = require('xmlhttprequest')
const { Telegraf} = require('telegraf');
const bot = new Telegraf('2118032058:AAHG43kJI9PqHpRc_IlMY_k9eI1FAYOMe7Y')
let buffer = []

bot.start(ctx => {
    ctx.reply(

    `Welcome!!

To start searching you must introduce tags, you can do this typing the tags in the chat like "sergal cartoon etc" without quote marks
and send the message, then let the bot do his magic :D
    
Comands:
/help
/contact
/donate

In case of malfunction or any suggestions: @AgnidDrage`
        )
})

bot.command('contact', ctx => {
    ctx.reply('Contacto: @AgnidDrage')
})

bot.help(ctx => {
    ctx.reply(
    `To start searching you must introduce tags, you can do this typing the tags in the chat like "sergal cartoon etc" without quote marks
and send the message, then let the bot do his magic :D
    
Comands:
/help
/contact
/donate

In case of malfunction or any suggestions: @AgnidDrage`
    )
})

bot.command('donate', ctx => {
    ctx.reply(`Unfortunately I live in a third world country in Latin America, so any donation is really apreciatted, even a little amount of money like 5 dolars are a lot of money here.

Of course this is completely optional, so, if you want to help me here is the link:

https://www.paypal.com/donate/?hosted_button_id=795VHWP3YBYVC`
)})


bot.on('text', ctx => {
    let id = ctx.chat.id
    try{
    for (user of buffer){
        if (id == user.id){
            let index = buffer.indexOf(user)
            buffer.splice(index,1)
        }
    }
    let text = ctx.message.text
    globalThis.tags = text.split(' ')
    let post = getStuff(tags)
    if( post == 'https://e621.net/posts/undefined'){
        ctx.reply('No post was found with the tags entered.')
    } else {

    ctx.telegram.sendMessage(ctx.chat.id, post, {
        parse_mode: 'html',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'dOwOnload', callback_data: 'DWL' }],
                [{text: 'Search Again', callback_data:'RSC'}]
            ]
        })
    })

    let userData = {
        'id': ctx.chat.id,
        'post': post,
        'tags': tags
    } 

    buffer.push(userData)

   // Borra los datos de busqueda del usuario cada 1 hr.
    setTimeout(()=>{
        for (user of buffer){
            if (id == user.id){
                let index = buffer.indexOf(user)
                buffer.splice(index,1)
            }
        }
    }, 3600000)

    }
} catch (e) {
    ctx.telegram.sendMessage(id, 'Search failed, try retyping the tags.')
    }
})

bot.action('DWL', ctx => {
    let id = ctx.chat.id
    try {
    for (user of buffer){
        if (id == user.id){
            var urlPost = user.post
            //buffer.splice(user)
        }
    }
    image = getImage(urlPost)
    ctx.telegram.sendDocument(ctx.chat.id, image)
    //ctx.telegram.sendMessage(ctx.chat.id, 'Error al conseguir el archivo')
    } catch (e) {
        ctx.telegram.sendMessage(id, 'Error getting file.')
    }
})

bot.action('RSC', ctx => {
    let id = ctx.chat.id
    try {
    for (user of buffer){
        if (id == user.id){
            let index = buffer.indexOf(user)
            var userTags = user.tags
            buffer.splice(index,1)
        }
    }
    

    let post = getStuff(userTags)
    if( post == 'https://e621.net/posts/undefined'){
        ctx.reply('No post was found with the tags entered.')
    } else {

    ctx.telegram.sendMessage(ctx.chat.id, post, {
        parse_mode: 'html',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'dOwOnload', callback_data: 'DWL' }],
                [{text: 'Search Again', callback_data:'RSC'}]
            ]
        })
    })

    let userData = {
        'id': id,
        'post': post,
        'tags': userTags
    } 
    
    buffer.push(userData)
    }
    } catch (e) {
        ctx.telegram.sendMessage(id, 'Search failed, try retyping the tags.')
    }
})

const getStuff = tags => {
    // Arma el url con los tags
    let basicUrl = "https://e621.net/posts.json?"
    let req = new XMLHttpRequest();
    let urlList = []
    let data = []
    let ids = []
    tags = tags.map(text => text+'+')

    for (let i = 1; i < 3; i++) {
        basicUrl =  basicUrl + "page=" + i + "&tags=";
        for(let i of tags){
            basicUrl = basicUrl + i;
        }
        urlList.push(basicUrl);
        basicUrl = "https://e621.net/posts.json?"
    }

    // realiza el GET
    for (let url of urlList) {        
        req.open('GET', url, false);
        req.setRequestHeader('User-Agent', 'Agnid-DoseOfE621');
        req.setRequestHeader("Authorization", "Basic " + Buffer.from("AgnidDrage:2MJ6ftFefc2uWYAX51ouxsft").toString('base64'));
        req.send()
        if (req.status == 200){
            data.push(JSON.parse(req.responseText))
        } else {
            console.log('error')
        }        
    }

    // Rescata datos de los Jsons 
    for (let json of data) {
        if (json.post == []) {
            continue
        }
        posts = json.posts
        for (let post of posts) {
            ids.push(post.id)
        }
    }

    let id = ids[Math.floor((Math.random()*ids.length))]
    let post = 'https://e621.net/posts/' +  id

    return post
}

const getImage = post => {
    let spittedPost = post.split('/')
    id = spittedPost[4]

    let req = new XMLHttpRequest();
    req.open('GET', 'https://e621.net/posts/' + id + '.json', false);
    req.setRequestHeader('User-Agent', 'Agnid-DoseOfE621');
    req.setRequestHeader("Authorization", "Basic " + Buffer.from("AgnidDrage:2MJ6ftFefc2uWYAX51ouxsft").toString('base64'));
    req.onload
    req.send()
    if (req.status == 200){
        var data = JSON.parse(req.responseText)
    } else {
        console.log('error')
    }

    img = data.post.file.url
    return img
}

bot.launch()
