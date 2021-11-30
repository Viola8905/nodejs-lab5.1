
//щоб запустити npm run dev

import express from "express";


const PORT = 3000;

const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(PORT, () => {
  console.log("http://localhost:3000");
});



app.get('/', function(req, res) {
  
  res.send('hello');  
});

// 6. Об’єкт “Абонент” (номер телефону, домашня адреса, власник; сумарна тривалість розмов, рахунок). Запит абонентів за казаною адресою із тривалістю розмов більше ніж вказана.


let Abonents = [
    {
        id:"0",
        phone:"123456",
        address:"Petefi",
        owner:"Alina",
        duration: "100",
        bill:"45",
    },
    {
        id:"1",
        phone:"000456",
        address:"Lehozkoho",
        owner:"Taras",
        duration: "990",
        bill:"245",
    },
    {
        id:"2",
        phone:"1111156",
        address:"Korzo",
        owner:"Alina",
        duration: "15",
        bill:"10",
    }
]

app.get("/abonents", (req, res) => {
    res.send(Abonents);
});


// Запит абонентів за казаною адресою із тривалістю розмов більше ніж вказана.
app.get("/abonents/duration",(req,res) =>{
   let abonents = Abonents.find((abonent) => abonent.duration > 1000 && abonent.address === "Lehozkoho");
   if (abonents !== null) res.status(200).send(abonents);
   else res.status(404).send("Not Found");
    
});



// отримання інформації щодо одного об’єкту (за Кодом),
app.get("/abonents/:id", (req, res) => {
    let abonent = Abonents.find((abonent) => abonent.id == parseInt(req.params.id)  );// чому при строгій рівності у прикладі працює а у мене ні?
    if (abonent !== null) res.status(200).send(abonent);
    else res.status(404).send("Not Found");
  });
  


//видалення інформації про вказаний об’єкт.
app.delete("/abonents/:id", (req, res) => {
    let index = Abonents.findIndex((abonent) => abonent.id == parseInt(req.params.id));
    if (index >= 0) {
      let deletedAbonent = Abonents[index];
      Abonents.splice(index, 1);
      res.send(deletedAbonent);
    } else res.status(404).send("Not Found");
  });


  //додавання одного об’єкту,

  app.post("/abonents", (req, res) => {
    let newAbonent = {
      id: Number(Date.now()),
      ...req.body,
    };
    Abonents.push(newAbonent);
    res.send(newAbonent);
  });



  // отримання вибірки з колекції згідно з вказаними параметрами (параметри передаються через рядок стану)
  app.post("/abonents/query", (req, res) => {
    
    let queriedAbonents = Abonents;

    if(req.query.owner)
        queriedAbonents = queriedAbonents.filter((abonent) => abonent.owner == req.query.owner);

    if(req.query.bill)
        queriedAbonents = queriedAbonents.filter((abonent) => abonent.bill >= req.query.bill);

    res.send(queriedAbonents);
    
  
    
      
  });


  //додавання колекції об’єктів,
  app.post("/abonents/collection", (req, res) => {
  /*

  BODY:
 [
     
      {
          "id":"0",
          "phone":"000456",
          "address":"Lehozkoho",
          "owner":"Taras",
          "duration": "990",
          "bill":"245"
      },
      {
          "id":"6",
          "phone":"000456",
          "address":"Leho",
          "owner":"Tars",
          "duration": "990",
          "bill":"245"
      }
      
 ]

  */
 
    for(let item of req.body){
      Abonents.push(item);
    }
   
    res.send(Abonents);
  });


  // редагування інформації  про вказаний об’єкт.
  app.patch("/abonents/:id", (req, res) => {
    let index = Abonents.findIndex((abonent) => abonent.id === parseInt(req.params.id));
        if (index >= 0) {
            let updatedAbonent = Abonents[index];
            for (let key in updatedAbonent)
                if (req.body[key]) updatedAbonent[key] = req.body[key];
            res.send(updatedAbonent);
        } else res.status(404).send("Not Found");
});
