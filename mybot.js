const wc = require('wechaty');
const Wechaty = wc.Wechaty;
const Contact = wc.Contact;
const MediaMessage = wc.MediaMessage;

let a = function(){
  let bot =  Wechaty.instance();
  bot.on('scan', (url, code) => console.log(`Scan QrCode to login: ${code}\n${url}`))
  .on('login',       user => {
    console.log(`User ${user} logined`);
    // Contact.find({name:"WL"}).then(oneone=>{
    //   oneone.say(new MediaMessage(__dirname+'/6901653886880564042.mp3'));
    // });
    Contact.findAll().then(contactList=>{
      console.log(`contact number : ${contactList.length}`);
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.official()) {
          console.log(`official ${i}: ${contact}`)
        }
      }
      
      /**
       *  Special contact list
       */
      
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.special()) {
          console.log( `special ${i}: ${contact.name()}`)
        }
      }
      
      /**
       *  personal contact list
       */
      
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.personal()) {
          console.log(`personal ${i}: ${contact.get('name')} : ${contact.id}`)
        }
      }
    });
  })
  .on('message',  message =>{
    const sender = message.from();
    const msg = message.content();
    console.log(`sender name : ${sender.name()} , sender alias : ${sender.alias()} \n 
    Message: ${msg} \n
    typeEx: ${message.typeEx()}  type: ${message.type()} typeSub: ${message.typeSub()} typeApp: ${message.typeApp()}`);
    if(message instanceof MediaMessage){
      console.log(`media file : .ext: ${message.ext()} filename: ${message.filename()} `)
      // message.saveFile(message.filename()).then(()=>{
          
      //   message.say(new MediaMessage(__dirname+'/'+message.filename()));
      // });
    }
    if(message.self()){
      console.log('自己的消息');
      return ;
    }
    if(/鹏哥/.test(msg)){
      message.say('鹏哥最帅');
    }
  })
  .init();
}
    
let b = function(){
  let bot2 = new Wechaty();
  
  bot2.on('scan', (url, code) => console.log(`bot2 : Scan QrCode to login: ${code}\n${url}`))
  .on('login',       user => {
    console.log(`bot2 : User ${user} logined`);
    // Contact.find({name:"WL"}).then(oneone=>{
    //   oneone.say(new MediaMessage(__dirname+'/6901653886880564042.mp3'));
    // });
    Contact.findAll().then(contactList=>{
      console.log(`bot2 : contact number : ${contactList.length}`);
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.official()) {
          console.log(`bot2 : official ${i}: ${contact}`)
        }
      }
      
      /**
       *  Special contact list
       */
      
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.special()) {
          console.log( `bot2 : special ${i}: ${contact.name()}`)
        }
      }
      
      /**
       *  personal contact list
       */
      
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.personal()) {
          console.log(`bot2 : personal ${i}: ${contact.get('name')} : ${contact.id}`)
        }
      }
    });
  })
  .on('message',  message =>{
    const sender = message.from();
    const msg = message.content();
    console.log(`bot2 : sender name : ${sender.name()} , sender alias : ${sender.alias()} \n 
    Message: ${msg} \n
    typeEx: ${message.typeEx()}  type: ${message.type()} typeSub: ${message.typeSub()} typeApp: ${message.typeApp()}`);
    if(message instanceof MediaMessage){
      console.log(`bot2 : media file : .ext: ${message.ext()} filename: ${message.filename()} `)
      // message.saveFile(message.filename()).then(()=>{
        
      //   message.say(new MediaMessage(__dirname+'/'+message.filename()));
      // });
    }
    if(message.self()){
      console.log('bot2 : 自己的消息');
      return ;
    }
    if(/鹏哥/.test(msg)){
      message.say('bot2 : 鹏哥最帅');
    }
  })
  .init();
}

let c = function(){
  let bot3= new Wechaty();
  
  bot3.on('scan', (url, code) => console.log(`bot3 : Scan QrCode to login: ${code}\n${url}`))
  .on('login',       user => {
    console.log(`bot3 : User ${user} logined`);
    // Contact.find({name:"WL"}).then(oneone=>{
    //   oneone.say(new MediaMessage(__dirname+'/6901653886880564042.mp3'));
    // });
    Contact.findAll().then(contactList=>{
      console.log(`bot3 : contact number : ${contactList.length}`);
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.official()) {
          console.log(`bot3 : official ${i}: ${contact}`)
        }
      }
      
      /**
       *  Special contact list
       */
      
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.special()) {
          console.log( `bot3 : special ${i}: ${contact.name()}`)
        }
      }
      
      /**
       *  personal contact list
       */
      
      for (let i = 0; i < contactList.length; i++) {
        const contact = contactList[i]
        if (contact.personal()) {
          console.log(`bot3 : personal ${i}: ${contact.get('name')} : ${contact.id}`)
        }
      }
    });
  })
  .on('message',  message =>{
    const sender = message.from();
    const msg = message.content();
    console.log(`bot3 : sender name : ${sender.name()} , sender alias : ${sender.alias()} \n 
    Message: ${msg} \n
    typeEx: ${message.typeEx()}  type: ${message.type()} typeSub: ${message.typeSub()} typeApp: ${message.typeApp()}`);
    if(message instanceof MediaMessage){
      console.log(`bot3 : media file : .ext: ${message.ext()} filename: ${message.filename()} `)
      // message.saveFile(message.filename()).then(()=>{
        
      //   message.say(new MediaMessage(__dirname+'/'+message.filename()));
      // });
    }
    if(message.self()){
      console.log('bot2 : 自己的消息');
      return ;
    }
    if(/鹏哥/.test(msg)){
      message.say('bot3 : 鹏哥最帅');
    }
  })
  .init();
};
       
a();