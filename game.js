var field;
var height, width;
var queue = [];
var food = 0;
var score;

function randint(max){
    return Math.floor(Math.random() * max);
}

class Food{
    constructor(x, y){
        this.posx = x;
        this.posy = y;
        this.tl = 40;
    }
    draw(){
        field.fillStyle = 'red';
        field.beginPath();
        field.arc(this.posx, this.posy, 3, 0, 2 * Math.PI);
        field.fill();
    }
}

class Cell{
    constructor(x, y, head=0){
        this.posx = x;
        this.posy = y;
        this.head = head;
        this.df = 1;
    }
    draw(){
        field.fillStyle = '#35381B';
        field.beginPath();
        field.arc(this.posx, this.posy, 3, 0, 2 * Math.PI)
        field.fill();
        if(this.head){
            field.fillStyle = "#fff";
            if(this.df == 1){
                field.fillRect(this.posx + 1, this.posy + 1, 1, 1);
                field.fillRect(this.posx + 1, this.posy - 2, 1, 1);
            }else if(this.df == -1){
                field.fillRect(this.posx - 1, this.posy + 1, 1, 1);
                field.fillRect(this.posx - 1, this.posy - 2, 1, 1);
            }else if(this.df == 2){
                field.fillRect(this.posx - 2, this.posy - 2, 1, 1);
                field.fillRect(this.posx + 1, this.posy - 2, 1, 1);
            }else if(this.df == -2){
                field.fillRect(this.posx - 2, this.posy + 1, 1, 1);
                field.fillRect(this.posx + 1, this.posy + 1, 1, 1);
            }
        }
    }
    move(){
        var velocity = 6;
        if(this.df == 1){
            this.posx += velocity;
        }else if(this.df == -1){
            this.posx -= velocity;
        }else if(this.df == 2){
            this.posy -= velocity;
        }else if(this.df == -2){
            this.posy += velocity;
        }
    }
}

class Snake{
    constructor(){
        var center = height / 2;
        this.cells = [new Cell(3, center), new Cell(9, center), 
            new Cell(15, center), new Cell(21, center, 1)];
    }
    draw(){
        this.cells.forEach(cell => cell.draw());
    }
    move(){
        this.cells.forEach(cell =>  cell.move());
        for(var i = 0; i < this.cells.length - 1; ++i){
            this.cells[i].df = this.cells[i + 1].df;
        }
    }
    turn(){
        if(!queue.length) return;
        var cmd = queue.shift();
        var head = this.cells[this.cells.length - 1];
        if(Math.abs(head.df) != Math.abs(cmd)){
            head.df = cmd;
        }
    }
    check(){
        var x = this.cells[this.cells.length - 1].posx;
        var y = this.cells[this.cells.length - 1].posy;
        if(x <= 0 || x >= width) return 0;
        if(y <= 0 || y >= height) return 0;
        for(var i = 0; i < this.cells.length - 1; ++i){
            if(this.cells[i].posx == x && this.cells[i].posy == y)
                return 0;
        }
        return 1;
    }
    growup(){
        var x = this.cells[0].posx;
        var y = this.cells[0].posy;
        var df = this.cells[0].df;
        var cell;
        if(df == 1)
            cell = new Cell(x - 6, y);
        else if(df == -1)
            cell = new Cell(x + 6, y);
        else if(df == 2)
            cell = new Cell(x, y + 6);
        else if(df == -2)
            cell = new Cell(x, y - 6);
        cell.df = df;
        this.cells.unshift(cell);
    }
    eat(){
        var head = this.cells[this.cells.length - 1];
        console.log(food.posx, food.posy, head.posx, head.posy)
        if(food.posx == head.posx && food.posy == head.posy){
            food = 0;
            ++score;
            update_score();
            this.growup();
        }
    }
    gen_food(){
        if(randint(100) < 92) return 0;
        var success;
        var x, y;
        do{
            success = 1;
            x = randint(50) * 6 + 3;
            y = randint(25) * 6 + 3;
            this.cells.forEach(cell => {
                if(cell.posx == x && cell.posy == y){
                    success = 0;
                }
            });
        }while(!success);
        return new Food(x, y);
    }
}

function message(msg){
    var block = document.getElementById('message');
    block.innerText = msg;
    block.style.display = 'block';
}

function update_score(){
    document.getElementById('score').innerText = "Score: " + score;
}

function keyboard(event){
    switch(event.code){
        case 'ArrowLeft': {
            queue.push(-1);
            break;
        }case 'ArrowRight': {
            queue.push(1);
            break;
        }case 'ArrowUp': {
            queue.push(2);
            break;
        }case 'ArrowDown': {
            queue.push(-2);
            break;
        }
    }
}

function start(){
    document.getElementById('message').style.display = 'none';
    var canvas = document.getElementById('field');
    height = canvas.height;
    width = canvas.width;
    field = canvas.getContext('2d');
    score = 0;
    update_score();
    var snake = new Snake();
    snake.draw();
    var interval = setInterval(function(){
        field.clearRect(0, 0, width, height);
        snake.turn();
        snake.move();
        if(food)
            snake.eat();
        if(!snake.check()){
            clearInterval(interval);
            message("Restart Game");
            return;
        }
        if(food){
            --food.tl;
            if(!food.tl) food = 0;
            else food.draw();
        }else{
            food = snake.gen_food();
        }
        snake.draw();
    }, 150);
}