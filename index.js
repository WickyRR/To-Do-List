import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Coconuttree21816*",
  port: 5432,
});

db.connect();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
let items = [
    { id: 1, title: "Buy milk" },
    { id: 2, title: "Finish homework" },
  ];
let dates=[];
let current_day_id = 1;
async function getDates(){
    const data = await db.query("SELECT * FROM dates;");
    dates = data.rows;
    console.log(dates);
    return dates;
}

async function getTasks(){
    const tasks = await db.query("SELECT * FROM tasks WHERE refered_day =$1;",[current_day_id]);
    items = tasks.rows;
    console.log(items);
    return items;
}


//app.get("/", async (req,res)=>{
//    
//    res.render("index.ejs",
//});
app.get("/", async(req,res)=>{
    const days = await getDates();
    const list = await getTasks();
    res.render("new.ejs",{
        titleLIst:days,
        listItems:list,
        currentday:current_day_id
       });
});
app.post('/day', async(req,res)=>{
    const day_id = req.body.day_id;
    current_day_id = day_id;
    res.redirect('/');
});
app.post('/addDate', async(req,res)=>{
    const date = req.body.date;
    try{
        await db.query("INSERT INTO dates(day) VALUES($1)",[date]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});
app.post('/add',async (req,res)=>{
    const newTask = req.body.newItem;
    try{
        await db.query("INSERT INTO tasks(task,refered_day) VALUES($1,$2)",[newTask,current_day_id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});
app.post("/edit", async (req,res)=>{
    const updatedTask = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
    try{
        await db.query("UPDATE tasks SET task = $1 WHERE id = $2;",[updatedTask,id]);
        res.redirect("/");
    }catch(err){
        console.log(err);
    }
});

app.post('/delete', async (req,res)=>{
    const id = req.body.deleteItemId;
    try{
        await db.query("DELETE FROM tasks WHERE id = $1",[id]);
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
});
app.listen(port , ()=>{
    console.log(`Server running on port ${port}`);
});