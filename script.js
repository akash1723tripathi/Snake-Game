const board = document.querySelector(".board")
const modal = document.querySelector(".modal")
const startModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".start-over")
const startBtn = document.querySelector(".btn-start")
const restartBtn = document.querySelector(".btn-restart")
const MaxScoreElement = document.querySelector("#max-score")
const ScoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

const blockHeight = 20
const blockWidth = 20
const rows = Math.floor(board.clientHeight / blockHeight)
const cols = Math.floor(board.clientWidth / blockWidth)

let MaxScore = localStorage.getItem("maxScore") || 0
let score = 0
let time = 0


const blocks = [] 
let snake =[{x:0,y:0}]
let food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
let intervalId = null
let timeIntervalId = null
let direction = "down"

for(let row=0;row<rows;row++){
      for(let col=0;col<cols;col++){
            const block = document.createElement("div")
            block.classList.add("block")
            board.appendChild(block)
            // block.innerText = `${row}-${col}`
            blocks[`${row}-${col}`] = block
      }
}


function render(){

      blocks[`${food.x}-${food.y}`].classList.add("food")
      
      let head = null
      if(direction == "right"){
            head = {x:snake[0].x,y:snake[0].y+1}
      }else if(direction == "left"){
            head = {x:snake[0].x,y:snake[0].y-1}
      }else if(direction == "up"){
            head = {x:snake[0].x-1,y:snake[0].y}
      }else if(direction == "down"){
            head = {x:snake[0].x+1,y:snake[0].y}
      }

      if( head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols ){
            clearInterval(intervalId)
            
            modal.style.display = "flex"
            startModal.style.display = "none"
            gameOverModal.style.display = "flex"


            return
      }

      if( head.x == food.x && head.y == food.y ){
            blocks[`${food.x}-${food.y}`].classList.remove("food")
            food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
            snake.unshift(head)

            score+=1
            ScoreElement.innerText = score

            if(score > MaxScore){
                  MaxScore = score
                  MaxScoreElement.innerText = MaxScore
                  localStorage.setItem("maxScore",MaxScore.toString())
            }

      }

      snake.forEach((segment)=>{
            blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
      })

      snake.unshift(head)
      snake.pop()   


      snake.forEach((segment)=>{
            blocks[`${segment.x}-${segment.y}`].classList.add("fill")
      })
}


document.addEventListener("keydown",(e)=>{
      if(e.key == "ArrowUp"){
            direction = "up"
      }else if(e.key == "ArrowDown"){
            direction = "down"
      }else if(e.key == "ArrowLeft"){
            direction = "left"
      }else if(e.key == "ArrowRight"){
            direction = "right"
      }
})


startBtn.addEventListener("click",()=>{
      modal.style.display = "none"
      intervalId = setInterval(() => {
            render()
      }, 200);

      timeIntervalId = setInterval(() => {
            let [min,sec] = time.split(":").map(Number)
            if(sec == 59){
                  min+=1
                  sec=0
            }else{
                  sec+=1
            }

            time = `${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`
            timeElement.innerText = time
      },1000)
            

})

restartBtn.addEventListener("click",()=>{
      resartGame()
})

function resartGame(){
      blocks[`${food.x}-${food.y}`].classList.remove("food")
      snake.forEach((segment)=>{
            blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
      })
      direction = "down"
      score=0
      time=`00:00`

      MaxScoreElement.innerText = MaxScore
      ScoreElement.innerText = score
      timeElement.innerText = time

      modal.style.display = "none"
      snake =[{x:0,y:0}]
      food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
      intervalId = setInterval(() => {
            render()
      }, 400);

}

