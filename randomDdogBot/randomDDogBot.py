from telegram.ext.updater import Updater
from telegram.update import Update
from telegram.ext.callbackcontext import CallbackContext
from telegram.ext.commandhandler import CommandHandler
import requests
import time


TOKEN = '5594314201:AAFakYISV-VYn3uaG1AhUev6RZOU-QQejhk'



def main():
    buffer = []
    updater = Updater(token=TOKEN, use_context=True)
    updater.dispatcher.add_handler(CommandHandler('dog', dog))
    updater.start_polling()
    run(buffer)
    #updater.idle()

def run(buffer):
    while True:
        try:
            safe = 0
            while safe == 0:
                try:
                    url = get_url(buffer)
                    checkIfDoc(url)
                    print(url)
                    if checkIfDoc(url):
                        safe = 1
                        requests.post("https://api.telegram.org/bot{}/sendDocument?chat_id=-1001649388237&document={}".format(TOKEN, url))
                    else:
                        safe = 1
                        requests.post("https://api.telegram.org/bot{}/sendPhoto?chat_id=-1001649388237&photo={}".format(TOKEN, url))
                except requests.RequestException:
                    print("exeption")
                    continue
        except RuntimeError:
            print('Error in run() method')
            continue
        time.sleep(28800)


def get_url(buffer):
    contents = requests.get('https://random.dog/woof.json').json()
    url = contents['url']
    if url in buffer:
        url = get_url(buffer)
    if len(buffer) < 10000:
        buffer = []
    return url

def checkIfDoc(url):
    if url.find(".gif") != -1 or url.find(".mp4") != -1:
        return True
    return False

def getDog():
    contents = requests.get('https://random.dog/woof.json').json()
    url = contents['url']
    return url

def dog(update: Update, context: CallbackContext):
    safe = 0
    while safe == 0:
        try:
            url = getDog()
            checkIfDoc(url)
            print(url)
            if checkIfDoc(url):
                update.message.reply_document(url)
                safe = 1
            else:
                update.message.reply_photo(url)
                safe = 1
        except requests.RequestException:
            print("exeption")
            continue
    

if __name__ == "__main__":
    main()