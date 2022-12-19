// "use strict"

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Загружаем текстуру поля
const ground = new Image();
ground.src = "image/ground.png";

// Загружаем текстуру еды (яблоко)
const foodImg = new Image();
foodImg.src = "image/food.png";

let box = 32; // Размер ячейки

let score = 0; // Кол-во очков

let speed = 150; // Скорость игры (обновление draw в мс)

// Спавн еды на на поле
let food = {
	x: Math.floor((Math.random() * 17 + 1)) * box,
	y: Math.floor((Math.random() * 15 + 3)) * box,
};

// Начальный спавн змейки
let snake = [];
snake[0] = {
	x: 9 * box,
	y: 10 * box
};

document.addEventListener("keydown", direction); // работа с клавиатурой

let dir; // переменная для клавиш

// Считывания нажатия клавиш
function direction(event) {
	if(event.keyCode == 37 && dir != "right") {
		dir = "left";
	} else if(event.keyCode == 38 && dir != "down") {
		dir = "up";
	} else if(event.keyCode == 39 && dir != "left") {
		dir = "right";
	} else if(event.keyCode == 40 && dir != "up") {
		dir = "down";
	}
}

// Проигрыш в случае, если змейка съест свой хвост
function eatTail(head, arrSnake) {
	for(let i = 0; i < arrSnake.length; i++) {
		if(head.x == arrSnake[i].x && head.y == arrSnake[i].y) {
			clearInterval(game);
			ctx.fillStyle = "blue";
			ctx.fillText("Game Over :(", box * 5, box * 10);
			ctx.fillText(`Score: ${score}`, box * 6.5, box * 12);
		};
	};
};

// функция игры
function draw() {
	// Рисуем поле и еду
	ctx.drawImage(ground, 0, 0);
	ctx.drawImage(foodImg, food.x, food.y);

	// Цвет змейки и ее расположение
	for(let i = 0; i < snake.length; i++) {
		// Четный элемент - черный, нечетный - красный 
		ctx.fillStyle = i == 0 ? "green" : i % 2 == 0 ? "black" : "red";
		ctx.fillRect(snake[i].x, snake[i].y, box, box);	// Рисуем квадрат элемента змейки
	}

	// Надпись очков
	ctx.fillStyle = "white";
	ctx.font = "50px Arial";
	ctx.fillText(":", box * 1.9, box * 1.6);
	ctx.fillText(score, box * 2.5, box * 1.7);

	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	// Если змейка кушает еду
	if(snakeX == food.x && snakeY == food.y) {
		score++;
		food = {
			x: Math.floor((Math.random() * 17 + 1)) * box,
			y: Math.floor((Math.random() * 15 + 3)) * box,
		};

		// Проверка спавна еды 
		for(i = 0; i < snake.length; i++) {

			// Переспавниваем еду, если она оказалась внутри змейки
			if (food.x == snake[i].x && food.y == snake[i].y) {
				food = {
					x: Math.floor((Math.random() * 17 + 1)) * box,
					y: Math.floor((Math.random() * 15 + 3)) * box,	
				};
			};
		};
	} else snake.pop();

	// Код проигрыша (Удар об стену)
	if(snakeX < box || 
	   snakeX > box * 17 || 
	   snakeY < box * 3 || 
	   snakeY > box * 17) {
		clearInterval(game);
		ctx.fillStyle = "blue";
		ctx.fillText("Game Over :(", box * 5, box * 10);
		ctx.fillText(`Score: ${score}`, box * 6.5, box * 12);
	}

	// Направление движения змейки
	if(dir == "left") snakeX -= box;
	if(dir == "right") snakeX += box;
	if(dir == "up") snakeY -= box;
	if(dir == "down") snakeY += box;

	let newHead = {
		x: snakeX,
		y: snakeY
	};

	eatTail(newHead, snake);	// Проверка на поедание самой себя

	snake.unshift(newHead);		// Добавляем новый элемент змейки (голову) в начало массива элементов
}

// Вызов функции игры с интервалом speed мс
let game = setInterval(draw, speed);



